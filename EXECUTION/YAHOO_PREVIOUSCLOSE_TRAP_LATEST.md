# YAHOO FINANCE API — TRAP CATALOG & SAFE FETCH PATTERN v1.0
**Classification:** A2E Internal
**Owner:** MICHA on behalf of SENTINEL (`sentinel/data/yahoo.py`)
**Last revised:** 2026-04-24 · S3c

---

## WHY THIS DOC EXISTS

The live-data rule is clear: **never use `web_search` for stock prices, always hit Yahoo's chart endpoint directly.** The endpoint is free, fast, and returns real-time `regularMarketPrice`. But it has well-known failure modes that silently corrupt % change calculations, trigger false alerts, and — worst — make SENTINEL fire on data that is not what it appears to be.

This doc codifies every trap we have hit or are likely to hit, and defines the safe fetch pattern that `sentinel/data/yahoo.py` must implement.

---

## THE ENDPOINT

```
https://query1.finance.yahoo.com/v8/finance/chart/{ticker}
```

Returns JSON with shape roughly:
```json
{
  "chart": {
    "result": [{
      "meta": {
        "symbol": "PSLV",
        "regularMarketPrice": 25.83,
        "regularMarketTime": 1745520000,
        "chartPreviousClose": 26.39,
        "previousClose": 26.39,
        "regularMarketDayHigh": 26.05,
        "regularMarketDayLow": 25.71,
        "regularMarketVolume": 5234100,
        "marketState": "REGULAR",
        "instrumentType": "ETF",
        "exchangeTimezoneName": "America/New_York",
        "gmtoffset": -14400,
        "currency": "USD"
      },
      "timestamp": [...],
      "indicators": {
        "quote": [{ "open": [...], "close": [...], "high": [...], "low": [...], "volume": [...] }]
      }
    }],
    "error": null
  }
}
```

---

## THE TRAPS

### TRAP 1 — `previousClose` stale after corporate actions

Yahoo's `meta.previousClose` is the cash-close of the prior session, **not adjusted** for the overnight dividend, split, or distribution. On ex-dividend days for PSLV, PHYS, or WPM, the unadjusted `previousClose` produces a false "down 3%" alert when the true change is ~0%.

**Safe pattern:** Prefer `meta.chartPreviousClose`, which is the adjusted close. Fall back to `meta.previousClose` only if `chartPreviousClose` is missing.

```python
prev = meta.get('chartPreviousClose') or meta.get('previousClose')
```

### TRAP 2 — `regularMarketPrice` is pre-market or after-hours

When `meta.marketState` is `PRE`, `POST`, `POSTPOST`, or `CLOSED`, the `regularMarketPrice` field holds the **last regular-session price**, not the current extended-hours price. The change-versus-previous-close is meaningful; the change-versus-now is not.

**Safe pattern:** Always check `marketState` before computing "live" metrics. Map the price to session context.

```python
PRICE_FIELD_BY_STATE = {
    'REGULAR':   'regularMarketPrice',
    'PRE':       'preMarketPrice',
    'POST':      'postMarketPrice',
    'POSTPOST':  'postMarketPrice',
    'CLOSED':    'regularMarketPrice',  # settlement price
    'PREPRE':    'regularMarketPrice',  # pre-pre-market, no new data
}
```

Note: `preMarketPrice` and `postMarketPrice` may be absent if no trades have occurred in that session.

### TRAP 3 — Halted stocks return last-traded-price with stale timestamp

If a ticker is halted (LULD, regulatory halt, news halt), `regularMarketPrice` is the last print before the halt and `regularMarketTime` is that print's timestamp. The quote looks live but is frozen.

**Safe pattern:** Compute `age_seconds = now - regularMarketTime` and flag any quote older than 5 minutes during regular hours as SUSPECT. Do not fire SENTINEL alerts on suspect data.

```python
age = int(time.time()) - int(meta['regularMarketTime'])
if meta['marketState'] == 'REGULAR' and age > 300:
    return {'status': 'STALE', 'age_seconds': age, **data}
```

### TRAP 4 — Weekends and holidays return Friday's close with Monday-shaped fields

On Saturday and Sunday, the endpoint returns Friday's session data with `marketState='CLOSED'`. Without the state check, a diff-from-previous-close calculation against the stored Friday close returns 0.00% — which is correct but uninformative, and is easy to misread as "market is flat today" when markets are in fact closed.

**Safe pattern:** Display explicitly "MARKET CLOSED · last session: {date}" when `marketState='CLOSED'`. Never fire time-based alerts when closed.

### TRAP 5 — `indicators.quote[0].close[-1]` is not the same as `meta.regularMarketPrice`

The OHLC candle array and the meta snapshot come from different pipelines. On intra-minute updates, the meta snapshot updates first and the candle updates on the minute boundary. A SENTINEL run that pulls `close[-1]` for "current price" will lag by up to 60 seconds vs a run that pulls `meta.regularMarketPrice`.

**Safe pattern:** `meta.regularMarketPrice` is authoritative for current price. The candle array is authoritative for historical bars only.

### TRAP 6 — `chart` endpoint accepts `range` and `interval` but silently clips

If you ask for `range=60d&interval=1m`, Yahoo silently returns only ~7 days of 1m data (their stated maximum for minute-level). Client code that assumes 60 days will silently get 7 and produce wrong HH/HL calculations.

**Safe pattern:** After fetch, always verify the returned series length and timespan matches the requested range. Warn or bail if not.

```python
expected_bars = {
    ('1m', '1d'): 390,    # US session bars
    ('5m', '1d'): 78,
    ('1d', '1y'): 252,
}
actual = len(result['timestamp'])
if abs(actual - expected) / expected > 0.1:
    log.warn(f'Yahoo returned {actual} bars, expected ~{expected}')
```

### TRAP 7 — Futures/commodity tickers need the `=F` suffix

`GC` alone returns a nonexistent quote or a different instrument. Gold futures are `GC=F`. Silver futures are `SI=F`. Crude oil is `CL=F`. Failing to add the suffix returns an error payload with a 404, which some clients silently treat as "no data" when the right behavior is to escalate.

**Safe pattern:** Never silent-fail on 404. A 404 from Yahoo on a known ticker symbol means your symbol is wrong, not that the market is missing.

### TRAP 8 — `chart` endpoint rate limit (~2000 req/hour per IP)

During HUNTER market-wide sweeps, it is easy to blow the rate limit and start getting back `{error: "Too Many Requests"}` with HTTP 429. The client must retry with backoff, not cache the error as a valid zero-price response.

**Safe pattern:** Exponential backoff on 429. Between HUNTER sweeps, honor a minimum 100ms gap per request. Batch multiple tickers via the comma-separated quote endpoint where possible:

```
https://query1.finance.yahoo.com/v7/finance/quote?symbols=PSLV,WPM,VOO,FCX
```
(This is a different endpoint from `/v8/finance/chart/` and should be preferred for bulk quotes.)

### TRAP 9 — Yahoo sometimes returns the cached response for 30–60 seconds

Particularly under load, the CDN in front of query1 serves a cached response. A client polling at 1s intervals may see the same price for 30 consecutive polls and misread it as a stalled market.

**Safe pattern:** Compare `regularMarketTime` across consecutive polls. If the timestamp hasn't advanced in 60+ seconds during `REGULAR` market state, flag as SUSPECT and widen the poll interval.

### TRAP 10 — `crumb` / cookie requirement for certain query endpoints

The chart endpoint (`v8/finance/chart`) is generally cookie-free and works from any IP. But some deeper endpoints (options chains, key statistics, historical downloads) require a valid Yahoo cookie and a `crumb` value. If `sentinel/data/yahoo.py` is extended to pull options data, this becomes a real trap.

**Safe pattern:** Keep the core price-fetch path on `v8/finance/chart` and `v7/finance/quote` which are cookie-free. If deeper data is needed, factor that into a separate module with cookie/crumb handling.

---

## REFERENCE SAFE FETCH

Drop-in reference for `sentinel/data/yahoo.py`. Read-only, no dependencies beyond stdlib.

```python
"""
sentinel/data/yahoo.py — SAFE Yahoo Finance quote fetcher.
Codifies the trap catalog in A2E_Protocols/EXECUTION/YAHOO_PREVIOUSCLOSE_TRAP_*.md
"""
import json
import time
import urllib.request
import urllib.error
from typing import Optional, Dict, Any

CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
QUOTE_URL = "https://query1.finance.yahoo.com/v7/finance/quote?symbols={syms}"

STALE_THRESHOLD_S = 300  # 5 minutes during regular hours
DEFAULT_TIMEOUT_S = 8


class YahooFetchError(Exception):
    """Raised when Yahoo returns an error, 429, or malformed response."""


def fetch_quote(ticker: str, timeout: int = DEFAULT_TIMEOUT_S) -> Dict[str, Any]:
    """
    Return a normalized dict with fields:
      - symbol: str
      - price: float (current authoritative price — varies by market state)
      - prev_close: float (corporate-action-adjusted)
      - change_pct: float
      - market_state: 'REGULAR' | 'PRE' | 'POST' | 'POSTPOST' | 'CLOSED' | 'PREPRE'
      - age_seconds: int (seconds since regularMarketTime)
      - status: 'OK' | 'STALE' | 'CLOSED' | 'EXTENDED'
      - raw_meta: dict (original Yahoo meta block for debugging)

    Raises YahooFetchError on 404, 429, or missing data.
    """
    url = CHART_URL.format(ticker=ticker)
    req = urllib.request.Request(url, headers={'User-Agent': 'a2e-sentinel/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            payload = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        if e.code == 429:
            raise YahooFetchError(f"Rate limited on {ticker}")
        if e.code == 404:
            raise YahooFetchError(f"Unknown symbol: {ticker} (did you forget =F for futures?)")
        raise YahooFetchError(f"HTTP {e.code} on {ticker}")
    except urllib.error.URLError as e:
        raise YahooFetchError(f"Network error on {ticker}: {e}")

    chart = payload.get('chart', {})
    if chart.get('error'):
        raise YahooFetchError(f"Yahoo error on {ticker}: {chart['error']}")

    results = chart.get('result') or []
    if not results:
        raise YahooFetchError(f"No result for {ticker}")

    meta = results[0].get('meta', {})
    state = meta.get('marketState', 'CLOSED')

    # Trap 2: pick the right price field for the market state
    price_field_by_state = {
        'REGULAR':  'regularMarketPrice',
        'PRE':      'preMarketPrice',
        'POST':     'postMarketPrice',
        'POSTPOST': 'postMarketPrice',
        'CLOSED':   'regularMarketPrice',
        'PREPRE':   'regularMarketPrice',
    }
    price_field = price_field_by_state.get(state, 'regularMarketPrice')
    price = meta.get(price_field) or meta.get('regularMarketPrice')
    if price is None:
        raise YahooFetchError(f"No price for {ticker} in state {state}")

    # Trap 1: prefer adjusted close
    prev_close = meta.get('chartPreviousClose') or meta.get('previousClose')
    if prev_close is None:
        raise YahooFetchError(f"No previous close for {ticker}")

    # Trap 3: stale detection
    age = int(time.time()) - int(meta.get('regularMarketTime', 0))
    status = 'OK'
    if state == 'REGULAR' and age > STALE_THRESHOLD_S:
        status = 'STALE'
    elif state == 'CLOSED':
        status = 'CLOSED'
    elif state in ('PRE', 'POST', 'POSTPOST', 'PREPRE'):
        status = 'EXTENDED'

    change_pct = (price - prev_close) / prev_close * 100 if prev_close else 0.0

    return {
        'symbol': meta.get('symbol', ticker),
        'price': float(price),
        'prev_close': float(prev_close),
        'change_pct': round(change_pct, 4),
        'market_state': state,
        'age_seconds': age,
        'status': status,
        'raw_meta': meta,
    }


def fetch_quotes_bulk(tickers: list) -> Dict[str, Dict[str, Any]]:
    """
    Bulk fetch via the v7/quote endpoint — preferred over looping fetch_quote
    when the caller has more than ~5 symbols. Honors the same safety rules.
    """
    syms = ','.join(tickers)
    url = QUOTE_URL.format(syms=syms)
    req = urllib.request.Request(url, headers={'User-Agent': 'a2e-sentinel/1.0'})
    with urllib.request.urlopen(req, timeout=DEFAULT_TIMEOUT_S) as resp:
        payload = json.loads(resp.read())

    out = {}
    for q in payload.get('quoteResponse', {}).get('result', []):
        sym = q.get('symbol')
        if not sym:
            continue
        price = q.get('regularMarketPrice')
        prev = q.get('regularMarketPreviousClose')
        if price is None or prev is None:
            continue
        out[sym] = {
            'symbol': sym,
            'price': float(price),
            'prev_close': float(prev),
            'change_pct': round((price - prev) / prev * 100, 4),
            'market_state': q.get('marketState', 'CLOSED'),
        }
    return out
```

---

## TEST FIXTURES REQUIRED

The following cases must be covered by unit tests before `sentinel/data/yahoo.py` is relied upon for trading decisions:

1. **Ex-dividend day** — PSLV after a distribution. `prev_close` must use `chartPreviousClose`, change % must be ≈ 0 not -3%.
2. **Pre-market with no trades** — early Monday. `preMarketPrice` absent. Must not crash; must return a sensible "last regular close" fallback flagged as `EXTENDED`.
3. **Weekend** — Saturday noon query. Must return `status='CLOSED'`, age_seconds ≈ days, no alert fired.
4. **Halted stock** — inject a fixture with `regularMarketTime` 45 minutes old during `REGULAR` state. Must return `status='STALE'`.
5. **429 rate limit** — must raise `YahooFetchError`, not return a zero-price response.
6. **Unknown symbol** — `GC` without `=F`. Must raise `YahooFetchError` with the suffix hint.

---

## CARRY-FORWARD

This doc is the pattern. The actual `sentinel/data/yahoo.py` file needs to be updated in the next session to match. When it is, add a test file `tests/test_yahoo_traps.py` that exercises each numbered trap against recorded fixtures (saved JSON responses under `tests/fixtures/yahoo/`).

— MICHA
