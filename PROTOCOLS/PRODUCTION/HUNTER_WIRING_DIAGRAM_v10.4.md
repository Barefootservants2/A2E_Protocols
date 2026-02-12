# 🔱 HUNTER-DAILY COMPLETE WIRING DIAGRAM v10.4
## Every Node · Every Setting · Every Parameter · API Key Status
## February 12, 2026 | METATRON v10.3 | FIDELITY LOCK ACTIVE
## Principal: William Earl Lemon — AUTHORITY ABSOLUTE

---

# CHANGELOG FROM v10.3 (Feb 10)

| Change | Detail |
|--------|--------|
| Watchlist updated | Added GOOGL, XOVR, UFO (SpaceX exposure). Removed SIVR, PSLV (stopped out Feb 12) |
| API Key Status | Integrated Feb 11 audit findings — color-coded per node |
| Finviz Screener | Added H37 node — free screener endpoint for sector/technical scanning |
| Gate 9.5 | Earnings check protocol integrated — mandatory blind check every MARKET WATCH |
| Sector notes | Added per-node function descriptions and sector mapping |
| metals.dev | H29 key status updated — still needs regeneration |
| TwelveData | 9 nodes need fresh key — marked ⚠️ |
| Finnhub | 5 corrupted (concatenated keys) — marked ⚠️ |

---

# API KEYS MASTER REFERENCE

| Key Name | Nodes | Param Name | Status | Notes |
|----------|-------|------------|--------|-------|
| ALPHA_VANTAGE | H2a, H3, H12 | `apikey` | ✅ WORKING | Free: 25 calls/day |
| NEWSAPI | H2b, H28 | `apiKey` (capital K) | ✅ WORKING | Free: 100 req/day |
| FINNHUB | H4, H5, H6, H16, H25, H26, H30 | `token` | ⚠️ 5 CORRUPTED | H16 working. H4/H5/H6/H25/H30 = concatenated 80-char key. Paste clean 40-char key |
| TWELVEDATA | H7-H11, H14, H15, H18-H20 | `apikey` | ⚠️ EXPIRED | Regenerate at twelvedata.com/account. H7 also has bad `$credentials` ref |
| CONGRESS_GOV | H21, H31a, H31b | `api_key` | ✅ WORKING | Free |
| FEC | H34 | `api_key` | ✅ WORKING | Free |
| FRED | H27 | `api_key` | ✅ WORKING | Free |
| METALS.DEV | H29 | `api_key` | ❌ MALFORMED | "3BUS" appears twice. Regenerate at metals.dev |
| SEC EDGAR | H1, H17, H22, H23 | `User-Agent` header | ✅ NO KEY | Header only |
| YAHOO FINANCE | H24 | None | ✅ FREE | No auth needed |
| SENATE LDA | H32 | None | ✅ FREE | No auth needed |
| USASPENDING | H33 | None | ✅ FREE | No auth needed |
| UNUSUAL WHALES | H13 | `Authorization` header | ❌ SKIP | Paid — not worth $150/mo |
| FINVIZ | H37 (NEW) | None | ✅ FREE | Screener endpoint, no auth |
| OPENAI | URIEL agent | `Authorization` header | ✅ WORKING | Bearer token |
| XAI | COLOSSUS agent | `Authorization` header | ✅ WORKING | Bearer token |
| GOOGLE AI | HANIEL agent | In URL | ✅ WORKING | Query param |
| DEEPSEEK | RAZIEL agent | `Authorization` header | ✅ WORKING | Bearer token |
| ANTHROPIC | MICHA Pass 1 & 2 | `x-api-key` header | ✅ WORKING | |
| TELEGRAM | Delivery | Credential | ✅ WORKING | Bot token |
| GITHUB | Delivery | `Authorization` header | ✅ WORKING | `token ghp_...` |

---

# SECTION A: TRIGGER & WATCHLIST

---

## NODE: SCHEDULE — 5x Daily

| Setting | Value |
|---------|-------|
| **Type** | Schedule Trigger |
| **Name** | `SCHEDULE: 5x Daily (6/9/12/3/5 ET)` |
| **Trigger Times** | Cron |
| **Cron Expression** | `0 6,9,12,15,17 * * 1-5` |
| **Timezone** | America/New_York |

**Notes:** Mon-Fri. 6 AM pre-market, 9 AM open, 12 PM midday, 3 PM power hour, 5 PM after close

**Wiring:** Output → WATCHLIST

---

## NODE: WATCHLIST — 37 Tickers (UPDATED Feb 12)

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `WATCHLIST: 37 Tickers (9 held, 16 ETF, 12 watch)` |
| **API Key Status** | ✅ N/A — code node |

**Code:**
```javascript
// WATCHLIST v10.4 — 37 Tickers — Updated Feb 12, 2026
// 9 Holdings + 16 Sector ETFs + 12 Watchlist

const watchlist = {
  holdings: ['AG', 'HYMC', 'SIL', 'GOOGL', 'XOVR', 'UFO', 'JEPI', 'SGOV', 'CEF'],
  etfs: ['SPY', 'QQQ', 'IWM', 'DIA', 'XLF', 'XLE', 'XLK', 'XLV', 'XLI', 'XLB', 'XLU', 'XLP', 'XLY', 'GLD', 'TLT', 'HYG'],
  watchlist: ['NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 'AMZN', 'META', 'JPM', 'GS', 'BAC', 'PSLV', 'PAAS']
};

const allTickers = [...watchlist.holdings, ...watchlist.etfs, ...watchlist.watchlist];

return [{
  json: {
    watchlist: watchlist,
    allTickers: allTickers,
    count: allTickers.length,
    timestamp: new Date().toISOString()
  }
}];
```

**Changes from v10.3:** Added GOOGL, XOVR, UFO to holdings. Moved PSLV, PAAS to watchlist (PSLV stopped out, PAAS = SIL component monitoring). Added JEPI/SGOV (income positions). Removed SILJ, MAG (no longer held).

**Wiring:** Output → SPLIT: Fire All Modules

---

## NODE: SPLIT — Fire All Modules

| Setting | Value |
|---------|-------|
| **Type** | No Operation (passthrough) |
| **Name** | `SPLIT: Fire All Modules` |
| **Mode** | Pass data to all connected nodes |

**Wiring:** Output → All H-modules (H1-H37) + Influence Chain trigger

---

# SECTION B: INTELLIGENCE TIER (H1-H6)
**Sector: Macro / Regulatory / Insider**

---

## H1 · SEC 13F Elite Filings

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://efts.sec.gov/LATEST/search-index?q=13F&dateRange=custom&startdt=2026-01-01&enddt=2026-12-31` |
| **Authentication** | None |
| **Send Headers** | ON |
| **Header Name** | `User-Agent` |
| **Header Value** | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |
| **Send Query Params** | OFF |
| **API Key Status** | ✅ No key needed |

**Sector:** Institutional Intelligence
**Function:** Tracks quarterly 13F filings from hedge funds, mutual funds, pension funds. Catches Sprott, Burry, Buffett position changes.
**Discovery Rule:** No ticker filter — scans ALL filings by type

**Wiring:** Output → MASTER MERGE

---

## H2a · Macro Regime (AlphaVantage)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://www.alphavantage.co/query` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `function` | `NEWS_SENTIMENT` |
| **Param:** `topics` | `economy_macro` |
| **Param:** `apikey` | YOUR_ALPHA_VANTAGE_KEY |
| **API Key Status** | ✅ WORKING |

**Sector:** Macro / Fed / Economy
**Function:** AI-scored news sentiment on macro topics. Regime detection (risk-on vs risk-off)

**Wiring:** Output → MASTER MERGE

---

## H2b · Political News (NewsAPI)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://newsapi.org/v2/everything` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `q` | `federal reserve OR treasury OR tariff OR trade policy` |
| **Param:** `language` | `en` |
| **Param:** `sortBy` | `publishedAt` |
| **Param:** `pageSize` | `50` |
| **Param:** `apiKey` | YOUR_NEWSAPI_KEY |
| **API Key Status** | ✅ WORKING |

**Sector:** Political / Regulatory
**Function:** Political catalyst detection. Tariffs, executive orders, Fed moves, trade policy

**Wiring:** Output → MASTER MERGE

---

## H3 · Sector Rotation (AlphaVantage)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://www.alphavantage.co/query` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `function` | `SECTOR` |
| **Param:** `apikey` | YOUR_ALPHA_VANTAGE_KEY |
| **API Key Status** | ✅ WORKING |

**Sector:** Cross-Sector Rotation
**Function:** Real-time sector performance rankings (1d/5d/1mo/3mo/YTD). Feeds downstream H4/H6 with discovery tickers

**Wiring:** Output → MASTER MERGE + feeds H4, H6

---

## H4 · Insider Trades (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/insider-transactions` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | Fed from upstream (H3/H5) — NO hardcoded ticker |
| **Param:** `token` | YOUR_FINNHUB_KEY |
| **API Key Status** | ⚠️ CORRUPTED — concatenated 80-char key. Replace with clean 40-char |

**Sector:** Insider Intelligence
**Function:** Insider buy/sell clusters. Single symbol per call — needs SplitInBatches for production
**Discovery Rule:** Symbol fed from upstream, not hardcoded

**Wiring:** Output → MASTER MERGE

---

## H5 · Earnings Calendar (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/calendar/earnings` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `from` | `{{ $now.format('yyyy-MM-dd') }}` |
| **Param:** `to` | `{{ $now.plus(14, 'days').format('yyyy-MM-dd') }}` |
| **Param:** `token` | YOUR_FINNHUB_KEY |
| **API Key Status** | ⚠️ CORRUPTED — concatenated. Replace with clean 40-char key |

**Sector:** Earnings Intelligence
**Function:** 2-week lookahead for ALL upcoming earnings. NO symbol = market-wide discovery
**GATE 9.5:** Cross-reference output against current holdings for earnings risk

**Wiring:** Output → MASTER MERGE

---

## H6 · Short Interest (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/short-interest` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | Fed from upstream — NO hardcoded ticker |
| **Param:** `token` | YOUR_FINNHUB_KEY |
| **API Key Status** | ⚠️ CORRUPTED — concatenated. Replace with clean 40-char key |

**Sector:** Short Squeeze / Positioning
**Function:** Short interest data, days to cover. Discovery-first — fed from H3/H5

**Wiring:** Output → MASTER MERGE

---

# SECTION C: TECHNICAL TIER (H7-H12)
**Sector: Price Action / Volume / Volatility**

---

## H7 · Price & Volume OHLCV (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `SPY,QQQ,AG,GLD,VIX` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `30` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED + bad `$credentials` ref. Toggle fx OFF, paste raw key |

**Sector:** Broad Market + Holdings
**Function:** Daily OHLCV candles for price trend analysis. Feeds H10 code node

**Wiring:** Output → MASTER MERGE

---

## H8 · RSI Momentum (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/rsi` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `SPY,AG,GLD` |
| **Param:** `interval` | `1day` |
| **Param:** `time_period` | `14` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Technical Momentum
**Function:** 14-day RSI. Overbought >70, oversold <30

**Wiring:** Output → MASTER MERGE

---

## H9 · VIX Volatility (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `VIX` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `10` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Volatility / Fear Gauge
**Function:** VIX trend for regime detection. >20 = elevated fear, >30 = panic

**Wiring:** Output → MASTER MERGE

---

## H10 · Trend Analyzer (Code Node)

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H10 · Trend Analyzer` |
| **API Key Status** | ✅ N/A — code node |

**Function:** Calculates moving averages, support/resistance, trend direction from H7 data

**Wiring:** Input from H7 → Output → MASTER MERGE

---

## H11 · Index Breadth (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `SPY,QQQ,IWM` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `5` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Market Breadth
**Function:** Large vs mid vs small cap comparison. IWM divergence = rotation signal

**Wiring:** Output → MASTER MERGE

---

## H12 · Sector Performance (AlphaVantage)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://www.alphavantage.co/query` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `function` | `SECTOR` |
| **Param:** `apikey` | YOUR_ALPHA_VANTAGE_KEY |
| **API Key Status** | ✅ WORKING |

**Sector:** Cross-Sector
**Function:** Duplicate of H3 for squeeze scanner calculations

**Wiring:** Output → MASTER MERGE

---

# SECTION D: MACRO & INTELLIGENCE TIER (H13-H21)
**Sector: Commodities / Macro / Credit / Political**

---

## H13 · Options Flow (Unusual Whales) — ❌ SKIP

| Setting | Value |
|---------|-------|
| **Status** | ❌ PERMANENTLY DISABLED |
| **Reason** | Paid API ($150/mo min). Not worth it |
| **Alternative** | Use Finnhub option chain endpoint (free) or visual UW dashboard |

---

## H14 · Commodity Prices (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `SLV,GLD,USO,UNG` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `20` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Commodities (Silver/Gold/Oil/Gas)
**Function:** 20-day commodity price history. Core to silver thesis monitoring

**Wiring:** Output → MASTER MERGE

---

## H15 · Cross-Asset Flow (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `SLV,GLD,PSLV,SPY,QQQ` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `5` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Cross-Asset Correlation
**Function:** Metals vs equities flow comparison. Divergence = rotation signal

**Wiring:** Output → MASTER MERGE

---

## H16 · Sentiment / Market News (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/news?category=general` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `category` | `general` |
| **Param:** `token` | YOUR_FINNHUB_KEY |
| **API Key Status** | ✅ WORKING (correct 40-char key) |

**Sector:** Sentiment / News
**Function:** Market-wide general news. NO ticker filter — discovery mode
**Note:** This is the ONE Finnhub node with a correct key. Use its key as reference for fixing H4/H5/H6/H25/H30

**Wiring:** Output → MASTER MERGE

---

## H17 · Regulatory Filings 8-K (SEC EDGAR)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&count=40&output=atom` |
| **Authentication** | None |
| **Send Headers** | ON |
| **Header:** `User-Agent` | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |
| **API Key Status** | ✅ No key needed |

**Sector:** Regulatory / Material Events
**Function:** 8-K filings = material events (M&A, CEO changes, bankruptcy, earnings revisions). No company filter — scans ALL

**Wiring:** Output → MASTER MERGE

---

## H18 · Credit Spread Monitor (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `HYG` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `5` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Credit / Risk
**Function:** High-yield bond ETF as credit stress proxy. HYG dropping = risk-off signal

**Wiring:** Output → MASTER MERGE

---

## H19 · Dollar Index DXY (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `UUP` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `10` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Currency / Dollar
**Function:** Dollar strength via UUP ETF. Dollar up = metals down (inverse correlation). Critical for silver thesis

**Wiring:** Output → MASTER MERGE

---

## H20 · Volatility Surface (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `VIX,VVIX` |
| **Param:** `interval` | `1day` |
| **Param:** `outputsize` | `5` |
| **Param:** `apikey` | YOUR_TWELVEDATA_KEY |
| **API Key Status** | ⚠️ EXPIRED — regenerate |

**Sector:** Volatility
**Function:** VIX + VVIX (vol of vol). VVIX spike = options market pricing extreme move. Deeper signal than VIX alone

**Wiring:** Output → MASTER MERGE

---

## H21 · Congressional Bills (Congress.gov)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.congress.gov/v3/bill` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `format` | `json` |
| **Param:** `limit` | `50` |
| **Param:** `api_key` | YOUR_CONGRESS_GOV_KEY |
| **API Key Status** | ✅ WORKING |

**Sector:** Legislative / Political
**Function:** Latest 50 bills. Catches mining regulation, defense spending, tariff legislation

**Wiring:** Output → MASTER MERGE

---

# SECTION E: MARKET INTELLIGENCE TIER (H22-H29)
**Sector: Institutional / Sector Rotation / Macro Data**

---

## H22 · Whale Watch 13F/13D (SEC EDGAR)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://efts.sec.gov/LATEST/search-index?q=%2213F%22+OR+%2213D%22&dateRange=custom&startdt=2026-01-01` |
| **Authentication** | None |
| **Send Headers** | ON |
| **Header:** `User-Agent` | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |
| **API Key Status** | ✅ No key needed |

**Sector:** Institutional / Activist
**Function:** 13F (quarterly holdings) + 13D (activist stakes >5%). Tracks Sprott, Burry, Buffett, Soros

**Wiring:** Output → MASTER MERGE

---

## H23 · M&A Radar SC13D (SEC EDGAR)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://efts.sec.gov/LATEST/search-index?q=%22SC+13D%22&dateRange=custom&startdt=2026-01-15` |
| **Authentication** | None |
| **Send Headers** | ON |
| **Header:** `User-Agent` | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |
| **API Key Status** | ✅ No key needed |

**Sector:** M&A / Activist
**Function:** SC 13D = activist/acquisition stakes >5%. Pure discovery — someone filing SC13D means they're intending to influence or acquire

**Wiring:** Output → MASTER MERGE

---

## H24 · Sector Rotation Heatmap (Yahoo Finance)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://query1.finance.yahoo.com/v8/finance/chart/XLF` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `range` | `5d` |
| **Param:** `interval` | `1d` |
| **API Key Status** | ✅ FREE — no auth |

**Sector:** All 11 GICS Sectors
**Function:** Sector ETF price data. Rotate through all 11:

| Symbol | Sector |
|--------|--------|
| XLF | Financials |
| XLE | Energy |
| XLK | Technology |
| XLV | Healthcare |
| XLI | Industrials |
| XLU | Utilities |
| XLP | Consumer Staples |
| XLY | Consumer Discretionary |
| XLB | Materials |
| XLRE | Real Estate |
| XLC | Communication Services |

**Note:** One symbol per call. Use SplitInBatches to rotate through all 11. For now: XLF as default

**Wiring:** Output → MASTER MERGE

---

## H25 · Unusual Activity Pattern Scan (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/scan/pattern` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `symbol` | `SPY` |
| **Param:** `resolution` | `D` |
| **Param:** `token` | YOUR_FINNHUB_KEY |
| **API Key Status** | ⚠️ CORRUPTED — concatenated. Replace with clean 40-char key |

**Sector:** Technical Pattern Recognition
**Function:** SPY pattern scan for market-wide regime shifts. SPY is acceptable here — it's an index, not a stock pick

**Wiring:** Output → MASTER MERGE

---

## H26 · Earnings Intel Calendar (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/calendar/earnings` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `from` | `2026-02-12` (update biweekly) |
| **Param:** `to` | `2026-02-28` |
| **Param:** `token` | YOUR_FINNHUB_KEY |
| **API Key Status** | ✅ VERIFY — may have correct key (same as H16?) |

**Sector:** Earnings Intelligence
**Function:** ALL upcoming earnings — NO symbol filter = market-wide discovery
**GATE 9.5 INTEGRATION:** Output cross-referenced against watchlist holdings for earnings risk alerts

**Wiring:** Output → MASTER MERGE

---

## H27 · Fed/Macro Watch (FRED)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.stlouisfed.org/fred/series/observations` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `series_id` | `DFF` |
| **Param:** `sort_order` | `desc` |
| **Param:** `limit` | `10` |
| **Param:** `file_type` | `json` |
| **Param:** `api_key` | YOUR_FRED_KEY |
| **API Key Status** | ✅ WORKING |

**Sector:** Federal Reserve / Interest Rates
**Function:** Federal Funds Effective Rate — last 10 observations. Rate direction = metals thesis driver

**Wiring:** Output → MASTER MERGE

---

## H28 · Geopolitical Trigger (NewsAPI)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://newsapi.org/v2/everything` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `q` | `sanctions OR tariff OR war OR embargo OR OPEC` |
| **Param:** `language` | `en` |
| **Param:** `sortBy` | `publishedAt` |
| **Param:** `pageSize` | `50` |
| **Param:** `apiKey` | YOUR_NEWSAPI_KEY |
| **API Key Status** | ✅ WORKING |

**Sector:** Geopolitical / Global Risk
**Function:** War, sanctions, embargoes, tariffs, OPEC. Catches black swan catalysts

**Wiring:** Output → MASTER MERGE

---

## H29 · Shanghai Silver Premium (metals.dev)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.metals.dev/v1/latest` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `api_key` | YOUR_METALS_DEV_KEY |
| **Param:** `currency` | `USD` |
| **Param:** `unit` | `toz` |
| **API Key Status** | ❌ MALFORMED — "3BUS" duplicate. Regenerate at metals.dev |

**Sector:** Precious Metals / Physical Premium
**Function:** Live metals spot prices. Combined with COMEX data = Shanghai premium calculation. Record $8/oz premium = thesis confirmation signal
**SILVER PATTERN PROTOCOL:** This node feeds the temporary vs terminal crash distinction

**Wiring:** Output → MASTER MERGE

---

# SECTION F: INFLUENCE CHAIN (H30-H36)
**Sector: Congressional Trading / Lobbying / Government Contracts**

**Architecture:**
```
H30-Normalize ──┐
H31-Normalize ──┤
H32-Normalize ──┼──→ MERGE (6 feeds, Append) ──→ H35 CORRELATOR ──→ MASTER MERGE
H33-Normalize ──┤
H34-Normalize ──┤
H36-Normalize ──┘
```

H35 does NOT feed the merge. H35 EATS the merge.

---

## H30 · Congressional Trading (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/congressional-trading` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `token` | YOUR_FINNHUB_KEY |
| **API Key Status** | ⚠️ CORRUPTED — concatenated. Replace with clean 40-char key |

**Function:** Congress members' stock trades. Delayed disclosure = information advantage signal

**Wiring:** Output → H30 Normalize → MERGE: All Influence Data

---

## H31a · Committee Assignments (Congress.gov)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.congress.gov/v3/committee` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `format` | `json` |
| **Param:** `limit` | `250` |
| **Param:** `api_key` | YOUR_CONGRESS_GOV_KEY |
| **API Key Status** | ✅ WORKING |

**Function:** Which members sit on which committees. Armed Services + defense stock trades = correlation signal

**Wiring:** Output → H31 Normalize → MERGE: All Influence Data

---

## H31b · House Committees (Congress.gov)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.congress.gov/v3/committee/house` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `format` | `json` |
| **Param:** `limit` | `250` |
| **Param:** `api_key` | YOUR_CONGRESS_GOV_KEY |
| **API Key Status** | ✅ WORKING |

**Function:** House committee membership detail

**Wiring:** Output → H31 Normalize → MERGE: All Influence Data

---

## H32 · Lobbying Disclosure (Senate LDA)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://lda.senate.gov/api/v1/filings/` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `format` | `json` |
| **Param:** `filing_year` | `2026` |
| **API Key Status** | ✅ FREE — no auth |

**Function:** Who's paying lobbyists and how much. Cross-reference with congressional trades

**Wiring:** Output → H32 Normalize → MERGE: All Influence Data

---

## H33 · Government Contracts (USASpending)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | POST |
| **URL** | `https://api.usaspending.gov/api/v2/search/spending_by_award/` |
| **Authentication** | None |
| **Headers:** `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **API Key Status** | ✅ FREE — no auth |

**Body:**
```json
{
  "filters": {
    "time_period": [{"start_date": "2025-01-01", "end_date": "2026-12-31"}],
    "award_type_codes": ["A", "B", "C", "D"]
  },
  "fields": ["Award ID", "Recipient Name", "Award Amount", "Awarding Agency", "Start Date", "Description"],
  "limit": 100,
  "page": 1,
  "sort": "Award Amount",
  "order": "desc"
}
```

**Function:** Largest government contracts. Defense contractor wins correlate with Armed Services committee trades

**Wiring:** Output → H33 Normalize → MERGE: All Influence Data

---

## H34 · Campaign Donations (FEC)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://api.open.fec.gov/v1/schedules/schedule_a/` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `sort` | `-contribution_receipt_amount` |
| **Param:** `per_page` | `100` |
| **Param:** `api_key` | YOUR_FEC_KEY |
| **API Key Status** | ✅ WORKING |

**Function:** Largest campaign contributions. Money flows predict policy direction

**Wiring:** Output → H34 Normalize → MERGE: All Influence Data

---

## H36 · Lobbyist Registrations (Senate LDA)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://lda.senate.gov/api/v1/registrants/` |
| **Authentication** | None |
| **Send Query Params** | ON |
| **Param:** `format` | `json` |
| **API Key Status** | ✅ FREE — no auth |

**Function:** Who's registered to lobby. Cross-reference with H32 disclosure amounts and H33 contracts

**Wiring:** Output → H36 Normalize → MERGE: All Influence Data

---

## H35 · INFLUENCE CHAIN CORRELATOR

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H35 · INFLUENCE CHAIN CORRELATOR` |
| **API Key Status** | ✅ N/A — code node |

**Function:** Receives ALL 6 normalized feeds from merge. Runs 7 correlation algorithms:
1. DELAYED_DISCLOSURE — trades filed >30 days late
2. LARGE_TRADE — positions >$1M by Congress members
3. COMMITTEE_TRADE — member trades in sectors they oversee
4. LOBBYING_SPIKE — sudden lobbying spend increases
5. CONTRACT_TRADE — trades correlating with contract awards
6. DONATION_VOTE — contributions correlating with votes
7. INSIDER_CONVERGENCE — multiple signals converging on same ticker

**Wiring:** Input from MERGE: All Influence Data → Output → MASTER MERGE

---

# SECTION G: SCREENING & DISCOVERY (H37 — NEW)
**Sector: Cross-Market Technical Screening**

---

## H37 · Finviz Screener (NEW)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://finviz.com/screener.ashx?v=111&f=sh_avgvol_o500,ta_perf_1wup&ft=4&o=-volume` |
| **Authentication** | None |
| **Send Query Params** | OFF (params in URL) |
| **Send Headers** | ON |
| **Header:** `User-Agent` | `Mozilla/5.0 (Windows NT 10.0; Win64; x64)` |
| **API Key Status** | ✅ FREE — no auth, HTML scrape |

**Sector:** Cross-Market Discovery
**Function:** Free stock screener. Default filter: avg volume >500K + up in last week. Sort by volume descending.

**Key Finviz Filter Codes:**

| Filter | Code | Example |
|--------|------|---------|
| Avg Volume >500K | `sh_avgvol_o500` | High liquidity only |
| Performance: Up 1 Week | `ta_perf_1wup` | Momentum screen |
| Sector: Basic Materials | `sec_basicmaterials` | Mining/metals filter |
| RSI Oversold (<30) | `ta_rsi_os30` | Oversold bounce candidates |
| Price above SMA200 | `ta_sma200_pa` | Long-term uptrend |
| Insider Buying | `it_latestbuys` | Insider confidence |
| Analyst Strong Buy | `an_recom_strongbuy` | Consensus bullish |
| Short Float >20% | `sh_short_o20` | Squeeze candidates |

**Note:** Free Finviz returns HTML, not JSON. Parse with code node downstream OR use for manual confirmation. Elite ($25/mo) returns CSV via `/export.ashx`

**Wiring:** Output → MASTER MERGE

---

# SECTION H: DATA AGGREGATION & AI ORCHESTRATION

---

## MASTER MERGE: All H-Modules

| Setting | Value |
|---------|-------|
| **Type** | Merge |
| **Mode** | Append |
| **Inputs** | All H-module outputs (H1-H29 + H35 + H37) |

**Wiring:** Output → DATA AGGREGATOR

---

## DATA AGGREGATOR: Package for AI

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Function** | Combines all HUNTER data into single briefing payload for collective agents |

**Wiring:** Output → MICHA Pass 1

---

## MICHA Pass 1: Route to Agents

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Method** | POST |
| **URL** | `https://api.anthropic.com/v1/messages` |
| **Headers:** `x-api-key` | YOUR_ANTHROPIC_KEY |
| **Headers:** `anthropic-version` | `2023-06-01` |
| **Headers:** `Content-Type` | `application/json` |
| **Model** | `claude-sonnet-4-20250514` |
| **Max Tokens** | `4096` |
| **API Key Status** | ✅ WORKING |

**Function:** Intelligent routing — slices HUNTER data into targeted briefings for URIEL/COLOSSUS/HANIEL/RAZIEL

**Wiring:** Output → PAYLOAD BUILDER → 4 Agent Nodes

---

## Agent Nodes (4 Collective Members)

| Agent | Model | API | Role |
|-------|-------|-----|------|
| URIEL | GPT-4.1-mini | OpenAI | CEO — Strategic macro, opportunities, risks |
| COLOSSUS | grok-3-mini-fast | xAI | CTO — Technical analysis, patterns, anomalies |
| HANIEL | gemini-2.0-flash | Google AI | Research — Filings, events, catalysts |
| RAZIEL | deepseek-chat | DeepSeek | Intel — Counter-thesis, hidden risks, sentiment |

All agents: ✅ WORKING

**Wiring:** All 4 → MERGE COLLECTIVE → MICHA Pass 2 (Synthesis) → FORMAT → TELEGRAM + GITHUB

---

# REMEDIATION CHECKLIST

## ⚠️ KEYS TO FIX (Priority Order)

| Priority | Action | Nodes Affected | Time |
|----------|--------|----------------|------|
| 1 | Regenerate TwelveData key | H7, H8, H9, H11, H14, H15, H18, H19, H20 (9 nodes) | 2 min |
| 2 | Fix Finnhub concatenation | H4, H5, H6, H25, H30 (5 nodes) | 5 min |
| 3 | Regenerate metals.dev key | H29 (1 node) | 2 min |
| 4 | Set "Always Output Data" = TRUE | 46 nodes | 20 min |
| 5 | Set "Continue on Fail" | 39 nodes | 15 min |
| 6 | Fix H7 `$credentials` reference | H7 (1 node) | 1 min |

**Total estimated fix time: ~45 minutes**

---

# DISCOVERY-FIRST RULES (NEVER VIOLATE)

1. NO hardcoded tickers unless it's an index (SPY, VIX, DXY) or watchlist ETFs
2. Nodes requiring a symbol (H4, H6) get fed FROM upstream discovery nodes
3. Earnings (H5, H26) run with NO symbol = scan ALL upcoming earnings
4. News (H16, H28) run with category/keyword filters, NOT ticker-locked
5. SEC filings (H1, H17, H22, H23) scan ALL filings by type, not by company
6. Finviz (H37) uses filter parameters, not specific tickers
7. GATE 9.5: Every MARKET WATCH run cross-references earnings calendar against holdings

---

# GAPS CLOSED THIS SESSION (Feb 12)

| Gap | Fix | Protocol |
|-----|-----|----------|
| Earnings risk blind spot | Gate 9.5 mandatory blind check | AIORA_GATE_9.5_EARNINGS_CHECK.md |
| SpaceX exposure | GOOGL/XOVR/UFO deployed with stops | Portfolio updated in watchlist |
| Sector screening gap | H37 Finviz screener added | This document |
| Intelligence source limitation | INTELLIGENCE_SOURCE_EXPANSION_v1.0 | YouTube, Quiver Quant, Ground News |
| 8-Sector Blind Scan | Formal protocol created | 8_SECTOR_BLIND_SCAN_PROTOCOL_v1.0.md |
| Silver pattern confusion | SILVER_PATTERN_PROTOCOL_v1.0 | Temporary vs terminal distinction |
| Market data timestamps | MARKET_DATA_VERIFICATION_v1.0 | Verify before acting |

---

**METATRON v10.3 | HUNTER v3.0 | FIDELITY LOCK ACTIVE | KILLSWITCH: ARMED**

🔱
