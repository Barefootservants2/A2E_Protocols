# 🔱 HUNTER-DAILY COMPLETE WIRING SPECIFICATION
## Every Node, Every Setting, Every Parameter
## February 10, 2026 | METATRON v10.3
## Estimated Build Time: 2 hours

---

# API KEYS REFERENCE

**Before starting, gather these keys from your folder:**

| Key Name | Used By | Parameter Name | Notes |
|----------|---------|----------------|-------|
| ALPHA_VANTAGE_KEY | H2a, H3, H12 | `apikey` | Free tier: 25 calls/day |
| NEWSAPI_KEY | H2b, H28 | `apiKey` | Note capital K |
| FINNHUB_KEY | H4, H5, H6, H13, H16, H30 | `token` | Free tier: 60 calls/min |
| TWELVEDATA_KEY | H7, H8, H9, H10, H11, H14, H15, H18, H19, H20 | `apikey` | Free tier: 800 calls/day |
| CONGRESS_GOV_KEY | H21, H31a, H31b | `api_key` | Free |
| FEC_KEY | H34 | `api_key` | Free |
| OPENAI_KEY | URIEL agent | Header: `Authorization` | Bearer token |
| XAI_KEY | COLOSSUS agent | Header: `Authorization` | Bearer token |
| GOOGLE_AI_KEY | HANIEL agent | In URL | Query param |
| DEEPSEEK_KEY | RAZIEL agent | Header: `Authorization` | Bearer token |
| ANTHROPIC_KEY | MICHA Pass 1 & 2 | Header: `x-api-key` | |
| TELEGRAM_BOT_TOKEN | Delivery | Credential | |
| GITHUB_TOKEN | Delivery | Header: `Authorization` | `token YOUR_KEY` |

---

# SECTION A: TRIGGER & WATCHLIST

---

## NODE: SCHEDULE: 5x Daily

| Setting | Value |
|---------|-------|
| **Type** | Schedule Trigger |
| **Name** | `SCHEDULE: 5x Daily (6/9/12/3/5 ET)` |
| **Trigger Times** | Cron |
| **Cron Expression** | `0 6,9,12,15,17 * * 1-5` |
| **Timezone** | America/New_York |

**Notes:** Fires at 6 AM, 9 AM, 12 PM, 3 PM, 5 PM ET, Monday-Friday

**Wiring:** Output → WATCHLIST

---

## NODE: WATCHLIST: 35 Tickers

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `WATCHLIST: 35 Tickers (8 held, 16 ETF, 11 watch)` |

**Code:**
```javascript
// WATCHLIST — 35 Tickers
// 8 Holdings + 16 ETFs + 11 Watchlist

const watchlist = {
  holdings: ['AG', 'PSLV', 'HYMC', 'SLV', 'SILJ', 'CEF', 'PAAS', 'MAG'],
  etfs: ['SPY', 'QQQ', 'IWM', 'DIA', 'XLF', 'XLE', 'XLK', 'XLV', 'XLI', 'XLB', 'XLU', 'XLP', 'XLY', 'GLD', 'TLT', 'HYG'],
  watchlist: ['NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'JPM', 'GS', 'BAC']
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

**Wiring:** Output → SPLIT: Fire All Modules

---

## NODE: SPLIT: Fire All Modules

| Setting | Value |
|---------|-------|
| **Type** | No Operation (passthrough) or Split Out |
| **Name** | `SPLIT: Fire All Modules` |
| **Mode** | Pass data to all connected nodes |

**Wiring:** Output → All H-modules (H1 through H29) + Influence Chain trigger

---

# SECTION B: HUNTER MODULES H1-H6 (Intelligence Tier)

---

## NODE: H1 · SEC 13F Elite Filings

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H1 · SEC 13F Elite Filings` |
| **Method** | GET |
| **URL** | `https://efts.sec.gov/LATEST/search-index?q=13F&dateRange=custom&startdt=2026-01-01&enddt=2026-12-31` |
| **Authentication** | None |
| **Headers** | |
| - Name | `User-Agent` |
| - Value | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |
| **Send Query Parameters** | OFF |

**Notes:** SEC requires User-Agent header with contact email. No API key needed.

**Wiring:** Output → MASTER MERGE

---

## NODE: H2a · Macro Regime (AlphaVantage)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H2a · Macro Regime (AlphaVantage)` |
| **Method** | GET |
| **URL** | `https://www.alphavantage.co/query` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `function` | `NEWS_SENTIMENT` |
| - `topics` | `economy_macro` |
| - `apikey` | `YOUR_ALPHA_VANTAGE_KEY` |

**Notes:** Replace YOUR_ALPHA_VANTAGE_KEY with actual key

**Wiring:** Output → MASTER MERGE

---

## NODE: H2b · Political News (NewsAPI)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H2b · Political News (NewsAPI)` |
| **Method** | GET |
| **URL** | `https://newsapi.org/v2/everything` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `q` | `federal reserve OR treasury OR tariff OR trade policy` |
| - `language` | `en` |
| - `sortBy` | `publishedAt` |
| - `pageSize` | `50` |
| - `apiKey` | `YOUR_NEWSAPI_KEY` |

**Notes:** Parameter is `apiKey` (capital K). Replace with actual key.

**Wiring:** Output → MASTER MERGE

---

## NODE: H3 · Sector Rotation (AlphaVantage)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H3 · Sector Rotation (AlphaVantage)` |
| **Method** | GET |
| **URL** | `https://www.alphavantage.co/query` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `function` | `SECTOR` |
| - `apikey` | `YOUR_ALPHA_VANTAGE_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H4 · Insider Trades (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H4 · Insider Trades (Finnhub)` |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/insider-transactions` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `{{ $json.allTickers[0] }}` OR hardcode `AAPL` for testing |
| - `token` | `YOUR_FINNHUB_KEY` |

**Notes:** Finnhub uses `token` not `apikey`. For production, loop through tickers.

**Wiring:** Output → MASTER MERGE

---

## NODE: H5 · Earnings Calendar (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H5 · Earnings Calendar (Finnhub)` |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/calendar/earnings` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `from` | `{{ $now.format('yyyy-MM-dd') }}` |
| - `to` | `{{ $now.plus(7, 'days').format('yyyy-MM-dd') }}` |
| - `token` | `YOUR_FINNHUB_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H6 · Short Interest (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H6 · Short Interest (Finnhub)` |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/short-interest` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `AG` |
| - `token` | `YOUR_FINNHUB_KEY` |

**Wiring:** Output → MASTER MERGE

---

# SECTION C: HUNTER MODULES H7-H12 (Technical Tier)

---

## NODE: H7 · Price & Volume OHLCV (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H7 · Price & Volume OHLCV (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `SPY,QQQ,AG,PSLV,GLD` |
| - `interval` | `1day` |
| - `outputsize` | `30` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Notes:** TwelveData allows comma-separated symbols (batch). Max 8 per call on free tier.

**Wiring:** Output → MASTER MERGE

---

## NODE: H8 · RSI + MACD (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H8 · RSI + MACD (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/rsi` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `SPY,QQQ,AG,PSLV,GLD` |
| - `interval` | `1day` |
| - `time_period` | `14` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H9 · VIX Fear Gauge (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H9 · VIX Fear Gauge (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `VIX` |
| - `interval` | `1day` |
| - `outputsize` | `30` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H10 · Technical Breakout (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H10 · Technical Breakout (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/bbands` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `SPY,QQQ,AG` |
| - `interval` | `1day` |
| - `time_period` | `20` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Notes:** Bollinger Bands for breakout detection

**Wiring:** Output → MASTER MERGE

---

## NODE: H11 · Volatility ATR (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H11 · Volatility ATR (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/atr` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `SPY,AG,GLD` |
| - `interval` | `1day` |
| - `time_period` | `14` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H12 · Sector Performance (AlphaVantage)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H12 · Sector Performance (AlphaVantage)` |
| **Method** | GET |
| **URL** | `https://www.alphavantage.co/query` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `function` | `SECTOR` |
| - `apikey` | `YOUR_ALPHA_VANTAGE_KEY` |

**Wiring:** Output → MASTER MERGE

---

# SECTION D: HUNTER MODULES H13-H20 (Macro & Intelligence)

---

## NODE: H13 · Options Flow (Unusual Whales)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H13 · Options Flow (Unusual Whales)` |
| **Method** | GET |
| **URL** | `https://api.unusualwhales.com/api/stock/AG/options-volume` |
| **Authentication** | Header Auth |
| **Header Name** | `Authorization` |
| **Header Value** | `Bearer YOUR_UNUSUAL_WHALES_KEY` |

**Notes:** If no Unusual Whales key, use Finnhub options endpoint instead:
- URL: `https://finnhub.io/api/v1/stock/option-chain?symbol=AG&token=YOUR_FINNHUB_KEY`
- Authentication: None

**Wiring:** Output → MASTER MERGE

---

## NODE: H14 · Commodity Prices (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H14 · Commodity Prices (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `XAU/USD,XAG/USD,CL,NG` |
| - `interval` | `1day` |
| - `outputsize` | `30` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Notes:** XAU=Gold, XAG=Silver, CL=Crude Oil, NG=Natural Gas

**Wiring:** Output → MASTER MERGE

---

## NODE: H15 · ETF Fund Flows (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H15 · ETF Fund Flows (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `SLV,GLD,PSLV,SIVR` |
| - `interval` | `1day` |
| - `outputsize` | `30` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H16 · News Sentiment (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H16 · News Sentiment (Finnhub)` |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/news` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `category` | `general` |
| - `token` | `YOUR_FINNHUB_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H17 · SEC EDGAR Filings

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H17 · SEC EDGAR Filings` |
| **Method** | GET |
| **URL** | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&dateb=&owner=include&count=40&output=atom` |
| **Authentication** | None |
| **Headers** | |
| - Name | `User-Agent` |
| - Value | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |

**Notes:** Returns recent 8-K filings in XML format. No API key required.

**Wiring:** Output → MASTER MERGE

---

## NODE: H18 · Credit Spreads (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H18 · Credit Spreads (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `HYG,LQD,TLT` |
| - `interval` | `1day` |
| - `outputsize` | `30` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Notes:** HYG=High Yield, LQD=Investment Grade, TLT=Treasuries — spread indicates risk appetite

**Wiring:** Output → MASTER MERGE

---

## NODE: H19 · Dollar Index DXY (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H19 · Dollar Index DXY (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `DXY` |
| - `interval` | `1day` |
| - `outputsize` | `30` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H20 · Currency Pairs (TwelveData)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H20 · Currency Pairs (TwelveData)` |
| **Method** | GET |
| **URL** | `https://api.twelvedata.com/time_series` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `EUR/USD,USD/JPY,GBP/USD,USD/CNY` |
| - `interval` | `1day` |
| - `outputsize` | `30` |
| - `apikey` | `YOUR_TWELVEDATA_KEY` |

**Wiring:** Output → MASTER MERGE

---

# SECTION E: HUNTER MODULES H21-H29 (Research & Events)

---

## NODE: H21 · Congressional Bills (Congress.gov)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H21 · Congressional Bills (Congress.gov)` |
| **Method** | GET |
| **URL** | `https://api.congress.gov/v3/bill` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `format` | `json` |
| - `limit` | `50` |
| - `api_key` | `YOUR_CONGRESS_GOV_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H22 · 13F Institutional Holdings (SEC)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H22 · 13F Institutional Holdings (SEC)` |
| **Method** | GET |
| **URL** | `https://efts.sec.gov/LATEST/search-index?q=13F-HR&dateRange=custom&startdt=2026-01-01&enddt=2026-12-31` |
| **Authentication** | None |
| **Headers** | |
| - Name | `User-Agent` |
| - Value | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H23 · 13D Activist Filings (SEC)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H23 · 13D Activist Filings (SEC)` |
| **Method** | GET |
| **URL** | `https://efts.sec.gov/LATEST/search-index?q=SC%2013D&dateRange=custom&startdt=2026-01-01&enddt=2026-12-31` |
| **Authentication** | None |
| **Headers** | |
| - Name | `User-Agent` |
| - Value | `Ashes2Echoes/1.0 (ashes2echoes.platform@outlook.com)` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H24 · Social Sentiment (Yahoo/Reddit)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H24 · Social Sentiment` |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/social-sentiment` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `AG` |
| - `token` | `YOUR_FINNHUB_KEY` |

**Notes:** Returns Reddit/Twitter mention counts and sentiment

**Wiring:** Output → MASTER MERGE

---

## NODE: H25 · Dark Pool Volume (FINRA)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H25 · Dark Pool Volume (FINRA)` |
| **Method** | GET |
| **URL** | `https://api.finra.org/data/group/otcMarket/name/weeklySummary` |
| **Authentication** | None |
| **Headers** | |
| - Name | `Accept` |
| - Value | `application/json` |

**Notes:** FINRA data is public but may have rate limits. Alternative: use Finnhub dark pool data.

**Wiring:** Output → MASTER MERGE

---

## NODE: H26 · Geopolitical News (NewsAPI)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H26 · Geopolitical News (NewsAPI)` |
| **Method** | GET |
| **URL** | `https://newsapi.org/v2/everything` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `q` | `sanctions OR tariffs OR "trade war" OR geopolitical OR military` |
| - `language` | `en` |
| - `sortBy` | `publishedAt` |
| - `pageSize` | `30` |
| - `apiKey` | `YOUR_NEWSAPI_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H27 · FRED Economic Data

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H27 · FRED Economic Data` |
| **Method** | GET |
| **URL** | `https://api.stlouisfed.org/fred/series/observations` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `series_id` | `DFF` |
| - `api_key` | `YOUR_FRED_KEY` |
| - `file_type` | `json` |
| - `limit` | `30` |
| - `sort_order` | `desc` |

**Notes:** DFF = Federal Funds Rate. Other useful series: T10Y2Y (yield curve), BAMLH0A0HYM2 (HY spread)

**Wiring:** Output → MASTER MERGE

---

## NODE: H28 · Earnings Estimates (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H28 · Earnings Estimates (Finnhub)` |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/earnings` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `NVDA` |
| - `token` | `YOUR_FINNHUB_KEY` |

**Wiring:** Output → MASTER MERGE

---

## NODE: H29 · Shanghai Silver Premium (metals.dev)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H29 · Shanghai Silver Premium (metals.dev)` |
| **Method** | GET |
| **URL** | `https://api.metals.dev/v1/latest` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `api_key` | `YOUR_METALS_DEV_KEY` |
| - `currency` | `USD` |
| - `unit` | `toz` |

**Notes:** If no metals.dev key, use TwelveData XAG/USD as backup. Shanghai premium requires manual calculation (Shanghai price - COMEX price).

**Wiring:** Output → MASTER MERGE

---

# SECTION F: INFLUENCE CHAIN (H30-H36)

---

## NODE: H30 · Congress Member Trades (Finnhub)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H30 · Congress Member Trades (Finnhub)` |
| **Method** | GET |
| **URL** | `https://finnhub.io/api/v1/stock/congressional-trading` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `symbol` | `` (empty = all) |
| - `from` | `2025-01-01` |
| - `to` | `2026-12-31` |
| - `token` | `YOUR_FINNHUB_KEY` |

**Wiring:** Output → H30 Normalize

---

## NODE: H30 - Normalize Congress Trades

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H30 - Normalize Congress Trades` |

**Code:**
```javascript
const trades = $input.first().json;
const normalized = (Array.isArray(trades) ? trades : (trades.data || [])).map(t => ({
  source: 'H30_congressional_trades',
  member: t.name || 'Unknown',
  party: t.party || '',
  chamber: t.chamber || '',
  ticker: t.symbol || '',
  transaction_type: t.transactionType || '',
  amount_range: (t.amountFrom || 0) + '-' + (t.amountTo || 0),
  transaction_date: t.transactionDate || '',
  disclosure_date: t.filingDate || '',
  delay_days: t.filingDate && t.transactionDate ? 
    Math.round((new Date(t.filingDate) - new Date(t.transactionDate)) / 86400000) : 0
}));
return [{ json: { data: normalized, count: normalized.length } }];
```

**Wiring:** Output → MERGE: All Influence Data

---

## NODE: H31a · Senate Committees

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H31a · Senate Committees` |
| **Method** | GET |
| **URL** | `https://api.congress.gov/v3/committee/senate` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `format` | `json` |
| - `limit` | `250` |
| - `api_key` | `YOUR_CONGRESS_GOV_KEY` |

**Wiring:** Output → MERGE: Senate + House Committees

---

## NODE: H31b · House Committees

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H31b · House Committees` |
| **Method** | GET |
| **URL** | `https://api.congress.gov/v3/committee/house` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `format` | `json` |
| - `limit` | `250` |
| - `api_key` | `YOUR_CONGRESS_GOV_KEY` |

**Wiring:** Output → MERGE: Senate + House Committees

---

## NODE: MERGE: Senate + House Committees

| Setting | Value |
|---------|-------|
| **Type** | Merge |
| **Name** | `MERGE: Senate + House Committees` |
| **Mode** | Append |
| **Number of Inputs** | 2 |

**Wiring:** Output → H31 - Normalize Committee Data

---

## NODE: H31 - Normalize Committee Data

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H31 - Normalize Committee Data` |

**Code:**
```javascript
const items = $input.all();
const committees = items.flatMap(item => {
  const data = item.json.committees || item.json.data || [];
  return data.map(c => ({
    source: 'H31_committee_assignments',
    committee_name: c.name || '',
    chamber: c.chamber || '',
    committee_type: c.type || '',
    url: c.url || ''
  }));
});
return [{ json: { data: committees, count: committees.length } }];
```

**Wiring:** Output → MERGE: All Influence Data

---

## NODE: H32 · Lobbying Filings (Senate LDA)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H32 · Lobbying Filings (Senate LDA)` |
| **Method** | GET |
| **URL** | `https://lda.senate.gov/api/v1/filings/` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `filing_year` | `2026` |
| - `format` | `json` |

**Notes:** No API key required — public database

**Wiring:** Output → H32 - Normalize Lobbying Data

---

## NODE: H32 - Normalize Lobbying Data

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H32 - Normalize Lobbying Data` |

**Code:**
```javascript
const response = $input.first().json;
const filings = (response.results || []).map(f => ({
  source: 'H32_lobbying_disclosure',
  registrant: f.registrant?.name || '',
  client: f.client?.name || '',
  amount: f.income || f.expenses || 0,
  filing_year: f.filing_year || '',
  filing_period: f.filing_period || '',
  lobbying_activities: (f.lobbying_activities || []).map(a => a.description).join('; ')
}));
return [{ json: { data: filings, count: filings.length } }];
```

**Wiring:** Output → MERGE: All Influence Data

---

## NODE: H33 · Gov Contracts (USASpending)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H33 · Gov Contracts (USASpending)` |
| **Method** | POST |
| **URL** | `https://api.usaspending.gov/api/v2/search/spending_by_award/` |
| **Authentication** | None |
| **Headers** | |
| - Name | `Content-Type` |
| - Value | `application/json` |
| **Body Content Type** | JSON |
| **Body** | |

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

**Notes:** No API key required — public database

**Wiring:** Output → H33 - Normalize Contract Data

---

## NODE: H33 - Normalize Contract Data

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H33 - Normalize Contract Data` |

**Code:**
```javascript
const response = $input.first().json;
const contracts = (response.results || []).map(c => ({
  source: 'H33_government_contracts',
  recipient: c['Recipient Name'] || '',
  amount: c['Award Amount'] || 0,
  agency: c['Awarding Agency'] || '',
  start_date: c['Start Date'] || '',
  description: c['Description'] || '',
  award_id: c['Award ID'] || ''
}));
return [{ json: { data: contracts, count: contracts.length } }];
```

**Wiring:** Output → MERGE: All Influence Data

---

## NODE: H34 · Campaign Donations (FEC)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H34 · Campaign Donations (FEC)` |
| **Method** | GET |
| **URL** | `https://api.open.fec.gov/v1/schedules/schedule_a/` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `sort` | `-contribution_receipt_amount` |
| - `per_page` | `100` |
| - `api_key` | `YOUR_FEC_KEY` |

**Wiring:** Output → H34 - Normalize FEC Data

---

## NODE: H34 - Normalize FEC Data

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H34 - Normalize FEC Data` |

**Code:**
```javascript
const response = $input.first().json;
const contributions = (response.results || []).map(c => ({
  source: 'H34_campaign_finance',
  contributor_name: c.contributor_name || '',
  contributor_employer: c.contributor_employer || '',
  committee_name: c.committee?.name || '',
  candidate_name: c.candidate_name || '',
  amount: c.contribution_receipt_amount || 0,
  date: c.contribution_receipt_date || '',
  state: c.contributor_state || ''
}));
return [{ json: { data: contributions, count: contributions.length } }];
```

**Wiring:** Output → MERGE: All Influence Data

---

## NODE: H36 · Lobbyist Registrations (Senate LDA)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `H36 · Lobbyist Registrations (Senate LDA)` |
| **Method** | GET |
| **URL** | `https://lda.senate.gov/api/v1/registrants/` |
| **Authentication** | None |
| **Send Query Parameters** | ON |
| **Query Parameters:** | |
| - `format` | `json` |

**Wiring:** Output → H36 - Normalize Lobbyist Data

---

## NODE: H36 - Normalize Lobbyist Data

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H36 - Normalize Lobbyist Data` |

**Code:**
```javascript
const response = $input.first().json;
const lobbyists = (response.results || []).map(l => ({
  source: 'H36_lobbyist_registrations',
  registrant_name: l.name || '',
  registrant_id: l.id || '',
  address: l.address || '',
  contact: l.contact_name || ''
}));
return [{ json: { data: lobbyists, count: lobbyists.length } }];
```

**Wiring:** Output → MERGE: All Influence Data

---

## NODE: MERGE: All Influence Data

| Setting | Value |
|---------|-------|
| **Type** | Merge |
| **Name** | `MERGE: All Influence Data (6 feeds)` |
| **Mode** | Append |
| **Number of Inputs** | 6 |

**Inputs:**
1. H30 Normalize
2. H31 Normalize
3. H32 Normalize
4. H33 Normalize
5. H34 Normalize
6. H36 Normalize

**Wiring:** Output → H35 · INFLUENCE CHAIN CORRELATOR

---

## NODE: H35 · INFLUENCE CHAIN CORRELATOR

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `H35 · INFLUENCE CHAIN CORRELATOR` |

**Code:**
```javascript
const allData = $input.all().map(item => item.json);

const trades = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H30_congressional_trades'));
const committees = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H31_committee_assignments'));
const lobbying = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H32_lobbying_disclosure'));
const contracts = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H33_government_contracts'));
const finance = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H34_campaign_finance'));
const lobbyists = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H36_lobbyist_registrations'));

const correlations = [];

// CORRELATION 1: DELAYED_DISCLOSURE
trades.forEach(trade => {
  if (trade.delay_days > 30) {
    correlations.push({
      type: 'DELAYED_DISCLOSURE',
      member: trade.member,
      ticker: trade.ticker,
      delay: trade.delay_days + ' days',
      severity: trade.delay_days > 45 ? 'HIGH' : 'MEDIUM',
      signal: 'Late disclosure — possible information advantage'
    });
  }
});

// CORRELATION 2: LARGE_TRADES
trades.forEach(trade => {
  if (trade.amount_range && trade.amount_range.includes('1000000')) {
    correlations.push({
      type: 'LARGE_TRADE',
      member: trade.member,
      ticker: trade.ticker,
      amount: trade.amount_range,
      severity: 'HIGH',
      signal: 'Large position by member of Congress'
    });
  }
});

// CORRELATION 3: LOBBYING_SPIKE (future enhancement)
// CORRELATION 4: CONTRACT_TRADE (future enhancement)

return [{
  json: {
    source: 'H35_influence_correlator',
    total_trades: trades.length,
    total_lobbying_filings: lobbying.length,
    total_contracts: contracts.length,
    total_contributions: finance.length,
    total_lobbyists: lobbyists.length,
    delayed_disclosures: correlations.filter(c => c.type === 'DELAYED_DISCLOSURE').length,
    large_trades: correlations.filter(c => c.type === 'LARGE_TRADE').length,
    correlations: correlations,
    scan_timestamp: new Date().toISOString()
  }
}];
```

**Wiring:** Output → MASTER MERGE

---

# SECTION G: DATA AGGREGATION

---

## NODE: MASTER MERGE: All H-Modules

| Setting | Value |
|---------|-------|
| **Type** | Merge |
| **Name** | `MASTER MERGE: All H-Modules` |
| **Mode** | Append |
| **Number of Inputs** | 30+ (all H-modules) |

**Inputs:** All outputs from H1-H29 + H35 Influence Correlator

**Wiring:** Output → DATA AGGREGATOR

---

## NODE: DATA AGGREGATOR: Package for AI

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `DATA AGGREGATOR: Package for AI` |

**Code:**
```javascript
const allItems = $input.all();
const aggregated = {
  scan_timestamp: new Date().toISOString(),
  total_data_points: allItems.length,
  modules: {}
};

allItems.forEach((item, index) => {
  const source = item.json.source || `module_${index}`;
  if (!aggregated.modules[source]) {
    aggregated.modules[source] = [];
  }
  aggregated.modules[source].push(item.json);
});

// Create briefing text for AI
const briefingParts = Object.entries(aggregated.modules).map(([source, data]) => {
  return `## ${source}\n${JSON.stringify(data, null, 2).substring(0, 2000)}`;
});

return [{
  json: {
    ...aggregated,
    briefing: briefingParts.join('\n\n'),
    briefing_length: briefingParts.join('\n\n').length
  }
}];
```

**Wiring:** Output → MICHA Pass 1

---

# SECTION H: AI AGENT ORCHESTRATION

---

## NODE: MICHA Pass 1: Route to Agents

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `MICHA Pass 1: Route to Agents` |
| **Method** | POST |
| **URL** | `https://api.anthropic.com/v1/messages` |
| **Authentication** | None |
| **Headers** | |
| - `x-api-key` | `YOUR_ANTHROPIC_KEY` |
| - `anthropic-version` | `2023-06-01` |
| - `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **Body (Expression Mode ON):** | |

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "You are MICHA, CIO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: INTELLIGENT ROUTING. Analyze HUNTER data and create TARGETED BRIEFINGS for:\n- URIEL: Macro regime, sector rotation, Fed/credit, opportunities/risks\n- COLOSSUS: RSI extremes, volume anomalies, patterns, VIX, squeezes\n- HANIEL: 13F/13D filings, 8-K events, political catalysts, earnings\n- RAZIEL: Insider patterns, correlations, sentiment divergence, hidden risks\n\nDo NOT filter for any specific thesis. Report what the data shows.\n\nOutput format:\n\nURIEL_BRIEFING:\n[Strategic data]\n\nCOLOSSUS_BRIEFING:\n[Technical data]\n\nHANIEL_BRIEFING:\n[Research data]\n\nRAZIEL_BRIEFING:\n[Anomaly/counter-thesis data]",
  "messages": [
    {
      "role": "user",
      "content": "HUNTER DATA PAYLOAD:\n\n{{ $json.briefing.substring(0, 50000) }}"
    }
  ]
}
```

**Wiring:** Output → PAYLOAD BUILDER

---

## NODE: PAYLOAD BUILDER: Slice for Agents

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `PAYLOAD BUILDER: Slice for Agents` |

**Code:**
```javascript
const response = $input.first().json;

let fullText = '';
if (response.content && Array.isArray(response.content)) {
  fullText = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');
} else {
  fullText = JSON.stringify(response);
}

const extractBriefing = (text, agentName) => {
  const regex = new RegExp(`${agentName}_BRIEFING:\\s*([\\s\\S]*?)(?=(?:URIEL|COLOSSUS|HANIEL|RAZIEL)_BRIEFING:|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : `No specific briefing for ${agentName}. Full: ${text.substring(0, 2000)}`;
};

return [
  { json: { agent: 'URIEL', briefing: extractBriefing(fullText, 'URIEL'), timestamp: new Date().toISOString() } },
  { json: { agent: 'COLOSSUS', briefing: extractBriefing(fullText, 'COLOSSUS'), timestamp: new Date().toISOString() } },
  { json: { agent: 'HANIEL', briefing: extractBriefing(fullText, 'HANIEL'), timestamp: new Date().toISOString() } },
  { json: { agent: 'RAZIEL', briefing: extractBriefing(fullText, 'RAZIEL'), timestamp: new Date().toISOString() } }
];
```

**Output Mode:** Split into 4 items

**Wiring:** Output splits to all 4 agents (with IF filters or direct wiring)

---

## NODE: URIEL - Strategic Synthesis (GPT)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `URIEL - Strategic Synthesis (GPT)` |
| **Method** | POST |
| **URL** | `https://api.openai.com/v1/chat/completions` |
| **Authentication** | None |
| **Headers** | |
| - `Authorization` | `Bearer YOUR_OPENAI_KEY` |
| - `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **Body (Expression Mode ON):** | |

```json
{
  "model": "gpt-4.1-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are URIEL, CEO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: STRATEGIC SYNTHESIS\n\n1. MARKET REGIME — Risk-On / Neutral / Risk-Off\n2. MACRO NARRATIVE — What's driving markets\n3. SECTOR ROTATION — Money flow TO and FROM\n4. FED/CREDIT/CURRENCY — Current state\n5. TOP 10 OPPORTUNITIES — Any sector, with invalidation conditions\n6. TOP 10 RISKS — Evidence-based\n\nNo fabricated percentages. 100% effort."
    },
    {
      "role": "user",
      "content": "BRIEFING:\n\n{{ $json.briefing }}"
    }
  ],
  "max_tokens": 2000
}
```

**Settings Tab:**
- Always Output Data: ON
- Continue On Fail: ON

**Wiring:** Output → MERGE: Agent Outputs

---

## NODE: COLOSSUS - Technical Analysis (Grok)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `COLOSSUS - Technical Analysis (Grok)` |
| **Method** | POST |
| **URL** | `https://api.x.ai/v1/chat/completions` |
| **Authentication** | None |
| **Headers** | |
| - `Authorization` | `Bearer YOUR_XAI_KEY` |
| - `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **Body (Expression Mode ON):** | |

```json
{
  "model": "grok-3-mini-fast",
  "messages": [
    {
      "role": "system",
      "content": "You are COLOSSUS, CTO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: TECHNICAL ANALYSIS\n\n1. RSI EXTREMES — Overbought (>70) / Oversold (<30)\n2. VOLUME ANOMALIES — 2x+ normal volume\n3. PATTERN SIGNALS — Breakouts, breakdowns, squeezes\n4. VIX REGIME — Calm / Elevated / Fear\n5. SQUEEZE CANDIDATES — High short + volume + setup\n6. CORRELATION STATUS — Holding or breaking\n7. BIGGEST MOVERS — What moved, what should have\n8. TECHNICAL BIAS — Bullish / Bearish / Neutral\n\nNo fabricated percentages. Blunt assessment."
    },
    {
      "role": "user",
      "content": "BRIEFING:\n\n{{ $json.briefing }}"
    }
  ],
  "max_tokens": 2000
}
```

**Settings Tab:**
- Always Output Data: ON
- Continue On Fail: ON

**Wiring:** Output → MERGE: Agent Outputs

---

## NODE: HANIEL - Research Intel (Gemini)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `HANIEL - Research Intel (Gemini)` |
| **Method** | POST |
| **URL** | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GOOGLE_AI_KEY` |
| **Authentication** | None |
| **Headers** | |
| - `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **Body (Expression Mode ON):** | |

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "You are HANIEL, CPO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: RESEARCH INTELLIGENCE\n\n1. WHALE ACTIVITY — 13F/13D significant findings\n2. MATERIAL EVENTS (8-K) — Notable filings\n3. ACTIVIST PLAYS — >5% stakes\n4. POLITICAL CATALYSTS — Regulatory/policy\n5. CONGRESSIONAL WATCH — Relevant bills\n6. GEOPOLITICAL — Top developments + market impact\n7. EARNINGS AHEAD — Top 10 by potential impact\n8. SURPRISES — Unexpected or contradictory\n9. INTELLIGENCE GRADE — A through F\n\nCite what you find, flag what's missing.\n\nBRIEFING:\n\n{{ $json.briefing }}"
        }
      ]
    }
  ],
  "generationConfig": {
    "maxOutputTokens": 2000
  }
}
```

**Notes:** Key is in URL, not headers

**Settings Tab:**
- Always Output Data: ON
- Continue On Fail: ON

**Wiring:** Output → MERGE: Agent Outputs

---

## NODE: RAZIEL - Counter-Thesis (DeepSeek)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `RAZIEL - Counter-Thesis (DeepSeek)` |
| **Method** | POST |
| **URL** | `https://api.deepseek.com/v1/chat/completions` |
| **Authentication** | None |
| **Headers** | |
| - `Authorization` | `Bearer YOUR_DEEPSEEK_KEY` |
| - `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **Body (Expression Mode ON):** | |

```json
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "You are RAZIEL, CAO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: PATTERN ANALYSIS & COUNTER-THESIS\n\n1. INSIDER PATTERNS — Cluster activity\n2. CORRELATION STATUS — Normal/diverging\n3. SENTIMENT DIVERGENCE — News vs price conflicts\n4. LIQUIDITY WARNING — Thin market flags\n5. CROSS-ASSET ANOMALIES — What doesn't fit\n6. COUNTER-THESIS (BULLISH) — Why every bull case could be wrong\n7. COUNTER-THESIS (BEARISH) — Why every bear case could be wrong\n8. HIDDEN RISK — The one thing nobody is talking about\n\nChallenge EVERYTHING. Find what doesn't fit."
    },
    {
      "role": "user",
      "content": "BRIEFING:\n\n{{ $json.briefing }}"
    }
  ],
  "max_tokens": 2000
}
```

**Settings Tab:**
- Always Output Data: ON
- Continue On Fail: ON

**Wiring:** Output → MERGE: Agent Outputs

---

## NODE: MERGE: Agent Outputs

| Setting | Value |
|---------|-------|
| **Type** | Merge |
| **Name** | `MERGE: Agent Outputs (4 feeds)` |
| **Mode** | Append |
| **Number of Inputs** | 4 |
| **Wait for All** | ON |

**Inputs:**
1. URIEL output
2. COLOSSUS output
3. HANIEL output
4. RAZIEL output

**Wiring:** Output → MICHA Pass 2

---

## NODE: MICHA Pass 2: Grand Synthesis (Claude)

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `MICHA Pass 2: Grand Synthesis (Claude)` |
| **Method** | POST |
| **URL** | `https://api.anthropic.com/v1/messages` |
| **Authentication** | None |
| **Headers** | |
| - `x-api-key` | `YOUR_ANTHROPIC_KEY` |
| - `anthropic-version` | `2023-06-01` |
| - `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **Body (Expression Mode ON):** | |

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "You are MICHA, CIO of the Uriel Covenant AI Collective, performing GRAND SYNTHESIS under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYou have analysis from 4 agents: URIEL (Strategic), COLOSSUS (Technical), HANIEL (Research), RAZIEL (Counter-Thesis).\n\nYour task:\n1. CONCURRENCE SCORING — Where agents agree (4/4=🟢, 3/4=🟡, 2/4=🟠, <2=🔴)\n2. CONFLICT RESOLUTION — Where they disagree, who has stronger evidence\n3. TOP DISCOVERIES — Opportunities nobody asked about but data reveals\n4. TOP RISKS — What could go wrong\n5. KILLSWITCH STATUS — Any condition requiring HALT?\n6. ACTIONABLE SUMMARY — What Principal should know RIGHT NOW\n\nOutput format:\n\n🔱 HUNTER DAILY BRIEF — [DATE]\n\n## CONCURRENCE SCORE: [emoji]\n[Summary]\n\n## TOP DISCOVERIES\n1-5. [Ticker/Theme] — [Evidence] — [Concurrence]\n\n## TOP RISKS\n1-5. [Risk] — [Evidence] — [Escalation trigger]\n\n## AGENT CONFLICTS\n[Disagreements and resolution]\n\n## KILLSWITCH STATUS\n[CLEAR / ELEVATED / HALT]\n\n## BOTTOM LINE\n[2-3 sentence actionable summary]",
  "messages": [
    {
      "role": "user",
      "content": "COLLECTIVE ANALYSIS:\n\n{{ JSON.stringify($input.all().map(i => i.json)) }}"
    }
  ]
}
```

**Wiring:** Output → EXTRACT: Final Report Data

---

# SECTION I: DELIVERY

---

## NODE: EXTRACT: Final Report Data

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `EXTRACT: Final Report Data` |

**Code:**
```javascript
const response = $input.first().json;
let extractedText = '';

if (response.content && Array.isArray(response.content)) {
  extractedText = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');
} else if (response.choices && response.choices[0]) {
  extractedText = response.choices[0].message.content;
} else if (typeof response === 'string') {
  extractedText = response;
} else {
  extractedText = JSON.stringify(response);
}

return [{
  json: {
    synthesis: extractedText,
    timestamp: new Date().toISOString(),
    source: 'MICHA_Pass_2'
  }
}];
```

**Wiring:** Output → FORMAT: Telegram + GitHub Output

---

## NODE: FORMAT: Telegram + GitHub Output

| Setting | Value |
|---------|-------|
| **Type** | Code (JavaScript) |
| **Name** | `FORMAT: Telegram + GitHub Output` |

**Code:**
```javascript
const synthesis = $input.first().json.synthesis;
const timestamp = $input.first().json.timestamp;

// Telegram has 4096 char limit
const MAX_LENGTH = 4000;
const messages = [];

if (synthesis.length <= MAX_LENGTH) {
  messages.push(synthesis);
} else {
  const sections = synthesis.split(/(?=## )/);
  let currentMessage = '';
  
  for (const section of sections) {
    if ((currentMessage + section).length > MAX_LENGTH) {
      if (currentMessage) messages.push(currentMessage.trim());
      currentMessage = section;
    } else {
      currentMessage += section;
    }
  }
  if (currentMessage) messages.push(currentMessage.trim());
}

return messages.map((msg, idx) => ({
  json: {
    message: msg,
    full_synthesis: synthesis,
    part: idx + 1,
    total_parts: messages.length,
    timestamp: timestamp,
    filename: `${new Date().toISOString().split('T')[0]}_daily_brief.md`
  }
}));
```

**Wiring:** Output → Both DELIVER nodes (Telegram and GitHub)

---

## NODE: DELIVER: Telegram Alert

| Setting | Value |
|---------|-------|
| **Type** | Telegram |
| **Name** | `DELIVER: Telegram Alert` |
| **Credential** | Your Telegram Bot credential |
| **Operation** | Send Message |
| **Chat ID** | Your Telegram chat ID |
| **Text** | `{{ $json.message }}` |
| **Parse Mode** | Markdown |

**Notes:** Get chat ID by messaging your bot and checking `https://api.telegram.org/bot<TOKEN>/getUpdates`

**Wiring:** Final output (no further connection)

---

## NODE: DELIVER: GitHub Daily Log

| Setting | Value |
|---------|-------|
| **Type** | HTTP Request |
| **Name** | `DELIVER: GitHub Daily Log` |
| **Method** | PUT |
| **URL (Expression Mode ON)** | `https://api.github.com/repos/Barefootservants2/AIORA/contents/reports/hunter_daily/{{ $json.filename }}` |
| **Authentication** | None |
| **Headers** | |
| - `Authorization` | `token YOUR_GITHUB_TOKEN` |
| - `Content-Type` | `application/json` |
| **Body Content Type** | JSON |
| **Body (Expression Mode ON):** | |

```json
{
  "message": "HUNTER Daily Brief {{ $json.timestamp }}",
  "content": "{{ Buffer.from($json.full_synthesis).toString('base64') }}"
}
```

**Notes:** Creates/updates file in AIORA repo under reports/hunter_daily/

**Wiring:** Final output (no further connection)

---

# MASTER CHECKLIST

## API Keys to Insert:

| Placeholder | Nodes | Your Key |
|-------------|-------|----------|
| `YOUR_ALPHA_VANTAGE_KEY` | H2a, H3, H12 | ___________ |
| `YOUR_NEWSAPI_KEY` | H2b, H26 | ___________ |
| `YOUR_FINNHUB_KEY` | H4, H5, H6, H13, H16, H24, H28, H30 | ___________ |
| `YOUR_TWELVEDATA_KEY` | H7, H8, H9, H10, H11, H14, H15, H18, H19, H20 | ___________ |
| `YOUR_CONGRESS_GOV_KEY` | H21, H31a, H31b | ___________ |
| `YOUR_FEC_KEY` | H34 | ___________ |
| `YOUR_FRED_KEY` | H27 | ___________ |
| `YOUR_METALS_DEV_KEY` | H29 | ___________ |
| `YOUR_ANTHROPIC_KEY` | MICHA Pass 1, MICHA Pass 2 | ___________ |
| `YOUR_OPENAI_KEY` | URIEL | ___________ |
| `YOUR_XAI_KEY` | COLOSSUS | ___________ |
| `YOUR_GOOGLE_AI_KEY` | HANIEL | ___________ |
| `YOUR_DEEPSEEK_KEY` | RAZIEL | ___________ |
| `YOUR_GITHUB_TOKEN` | GitHub Delivery | ___________ |
| Telegram Bot Token | Telegram Delivery | (via credential) |

## Node Count by Section:

| Section | Nodes |
|---------|-------|
| A: Trigger & Watchlist | 3 |
| B-E: H1-H29 Modules | 29 |
| F: Influence Chain H30-H36 | 14 |
| G: Data Aggregation | 2 |
| H: AI Agents | 7 |
| I: Delivery | 4 |
| **TOTAL** | **59** |

---

🔱 **HUNTER-DAILY COMPLETE WIRING v10.3**
**February 10, 2026**
