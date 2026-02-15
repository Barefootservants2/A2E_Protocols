# 🔱 HUNTER CAPABILITY AUDIT — FULL API GAP ANALYSIS
## METATRON v10.2 | February 5, 2026 | MICHA/CIO
## Status: PRODUCTION REFERENCE — Guides all API expansion work

---

## EXECUTIVE SUMMARY

**Finding:** HUNTER is running at ~21% utilization of available free API endpoints. There are 27 untapped Finnhub endpoints and 12+ untapped TwelveData endpoints available on FREE tiers. Beyond those two, 6+ additional free data sources exist that we aren't pulling from at all. One platform — OpenBB — could unify all data acquisition into a single API layer.

**Target:** 100% utilization of every free endpoint that provides market edge.

---

## PART 1: RETURN THESIS — VALIDATED

| Metric | Value |
|---|---|
| Combined Capital | ~$396K ($96K brokerage + $300K IRA) |
| Target Daily Return | $500-$1,000 |
| Required Daily % | 0.13% - 0.25% |
| January 2026 Actual | ~20% (one month) |
| Top 0.1% Systematic Traders (Research) | 0.379%/day |
| Verdict | Target is BELOW elite systematic trader benchmarks |

The $400K capital level is the sweet spot: large enough for meaningful daily returns, small enough that trades don't move the market. The edge is systematic scanning + thesis-driven positioning + disciplined risk management.

---

## PART 2: FINNHUB — CURRENT vs AVAILABLE

### Currently Using (8 endpoints)

| Module | Endpoint | Function |
|---|---|---|
| H1 | `/stock/institutional-ownership` | 13F filings |
| H2 | `/news` | Company/market news |
| H4 | `/stock/insider-transactions` | Insider trades |
| H5 | `/stock/earnings` | Earnings calendar |
| H12 | `/stock/short-interest` | Short interest |
| H13 | FINRA RegSHO (repurposed) | Daily short volume |
| H16 | `/news` (filtered) | Sentiment |
| H22 | `/institutional-ownership` | Whale tracking |

### NOT Using — Available on Free Tier (60 calls/min)

#### HIGH PRIORITY

| # | Endpoint | URL | Value | New Module |
|---|---|---|---|---|
| 1 | Insider Sentiment (MSPR) | `/stock/insider-sentiment` | Pre-calculated buy/sell ratio | Enhance H4 |
| 2 | EPS Estimates | `/stock/eps-estimate` | Forward earnings consensus | HM1 |
| 3 | Revenue Estimates | `/stock/revenue-estimate` | Revenue consensus | HM1 |
| 4 | Upgrade/Downgrade | `/stock/upgrade-downgrade` | Analyst actions with price targets | HM2 |
| 5 | Price Target Consensus | `/stock/price-target` | Street consensus targets | HM2 |
| 6 | Aggregate Indicator | `/stock/aggregate-indicator` | Pre-computed technical signal | HM3 |
| 7 | Supply Chain | `/stock/supply-chain` | Upstream/downstream relationships | HM4 |
| 8 | Congressional Trading | `/stock/congressional-trading` | Congress member trades | H30 |
| 9 | Lobbying Activities | `/stock/lobbying` | Corporate lobbying spend | HM14 |
| 10 | USA Spending | `/stock/usa-spending` | Government contracts by company | HM13 |

#### MEDIUM PRIORITY

| # | Endpoint | URL | Value | New Module |
|---|---|---|---|---|
| 11 | Fund Ownership | `/stock/fund-ownership` | Which funds own what | Enhance H22 |
| 12 | Ownership Detail | `/stock/ownership` | Institutional breakdown | Enhance H1 |
| 13 | IPO Calendar | `/calendar/ipo` | Upcoming IPOs | Enhance H10 |
| 14 | FDA Calendar | `/fda-advisory-committee-calendar` | Drug approvals | Research |
| 15 | USPTO Patents | `/stock/uspto-patent` | Innovation tracking | HM10 |
| 16 | Basic Financials | `/stock/metric` | 117 fundamental metrics in ONE call | HM-NEW |
| 17 | Financials (Statements) | `/stock/financials` | Income/balance/cash flow | HM-NEW |
| 18 | Financials As Reported | `/stock/financials-reported` | Raw SEC data (as-filed) | Enhance H17 |
| 19 | Company Peers | `/stock/peers` | Market-grouped companies | Code Node |
| 20 | News Sentiment | `/news-sentiment` | Pre-calculated sentiment score | Enhance H16 |
| 21 | Pattern Recognition | `/scan/pattern` | Auto chart pattern detection | HM-NEW |
| 22 | Support/Resistance | `/scan/support-resistance` | Auto key price levels | HM16 |
| 23 | Social Sentiment | `/stock/social-sentiment` | Reddit/Twitter aggregated | Enhance H24 |
| 24 | Investment Themes | `/stock/investment-theme` | Thematic baskets | Research |
| 25 | ETF Holdings | `/etf/holdings` | What's inside any ETF | HM11 |
| 26 | ETF Sector Exposure | `/etf/sector` | ETF sector breakdown | Enhance H3 |
| 27 | SEC Similarity Index | `/stock/similarity-index` | 10-K year-over-year comparison | HM9 |

### Finnhub Score: 8/35 endpoints = 23% utilization

---

## PART 3: TWELVEDATA — CURRENT vs AVAILABLE

### Currently Using (5 endpoints)

| Module | Endpoint | Function |
|---|---|---|
| H7 | `/time_series` | OHLCV price data |
| H8 | `/rsi` | RSI indicator |
| H9 | `/time_series` (VIX) | VIX history |
| H11 | `/quote` | Real-time quotes |
| H14 | `/time_series` (commodities) | Commodity correlations |

### NOT Using — Available on Free Tier (800 calls/day)

| # | Endpoint | Value | Priority |
|---|---|---|---|
| 1 | 100+ Technical Indicators (MACD, Bollinger, Stochastic, ADX, ATR, OBV, VWAP, Williams %R, Ichimoku) | We use RSI only. ONE call can stack multiple. | HIGH |
| 2 | Earnings `/earnings` | Earnings with estimates/actuals | HIGH |
| 3 | Batch Requests (8 symbols/call) | 8x efficiency gain | HIGH |
| 4 | Statistics `/statistics` | Market cap, float, shares outstanding — critical for squeeze calc | HIGH |
| 5 | Options Chain `/options/chain` | OI, volume, put/call ratio, max pain | HIGH |
| 6 | Key Metrics `/key_stats` | Valuation ratios, profitability | HIGH |
| 7 | Dividends `/dividends` | Dividend history/upcoming | MEDIUM |
| 8 | Income Statement `/income_statement` | Financial statements | MEDIUM |
| 9 | Balance Sheet `/balance_sheet` | Balance sheet data | MEDIUM |
| 10 | Cash Flow `/cash_flow` | Cash flow statements | MEDIUM |
| 11 | Profile `/profile` | Company fundamentals | MEDIUM |
| 12 | Splits `/splits` | Stock split history | LOW |

### CRITICAL MISS: Options Chain via TwelveData

TwelveData `/options/chain` partially replaces Unusual Whales (dead). Provides:
- Open Interest by strike (positioning signal)
- Volume vs OI ratio (new money entering)
- Put/Call ratio by symbol
- Max pain calculation

### TwelveData Score: 5/17+ categories = ~29% utilization

---

## PART 4: FREE APIs NOT CURRENTLY INTEGRATED

### 1. FRED (Federal Reserve Economic Data)
**Cost:** FREE (unlimited) | **Status:** H27 specced, API key needed

| Series ID | Data | Why |
|---|---|---|
| DFF | Fed Funds Rate | Monetary policy regime |
| T10Y2Y | 10Y-2Y Yield Spread | Recession predictor |
| T10YIE | 10Y Breakeven Inflation | Gold/silver thesis |
| DTWEXBGS | Trade-Weighted USD | Dollar strength (inverse to metals) |
| BAMLH0A0HYM2 | High Yield Spread | Credit stress |
| WALCL | Fed Balance Sheet | Liquidity proxy |
| MORTGAGE30US | 30Y Mortgage Rate | Housing/REIT |
| UNRATE | Unemployment Rate | Economic cycle |
| CPIAUCSL | CPI | Inflation (precious metals catalyst) |
| M2SL | M2 Money Supply | Monetary expansion |
| COMEX series | COMEX stocks | Direct silver thesis input |

**Action:** Get key at https://fred.stlouisfed.org/docs/api/api_key.html (30 seconds, instant)

### 2. Financial Modeling Prep (FMP)
**Cost:** FREE tier (250 calls/day) | **Status:** Not integrated

| Endpoint | Value |
|---|---|
| `/api/v3/stock-screener` | Full market screener — 50+ filters — ONLY free screener API |
| `/api/v3/stock_market/actives` | Most active stocks |
| `/api/v3/stock_market/gainers` | Top gainers |
| `/api/v3/stock_market/losers` | Top losers |
| `/api/v3/sector-performance` | Sector snapshot |
| `/api/v3/institutional-holder/{symbol}` | Institutional holders |

**Action:** Get key at https://site.financialmodelingprep.com/developer

### 3. Yahoo Finance (yfinance)
**Cost:** FREE (no key) | **Status:** Not integrated

Provides: Options chains with Greeks (ONLY free source), short % of float, analyst recs, ESG scores, financial statements. WARNING: Unofficial scraper — use as backup, not primary.

### 4. OpenInsider
**Cost:** FREE (scraping) | **Status:** Not integrated
Complements Finnhub insider data. Cluster buy scanning (3+ insiders same company within 30 days).

### 5. COMEX/CME Data
**Cost:** FREE (partial) | **Status:** Not integrated
COMEX warehouse stocks, delivery reports, COT positioning. Direct silver thesis input.

### 6. OpenBB Platform (GAME-CHANGER)
**Cost:** FREE (open source) | **Status:** Evaluated Jan 22, not integrated
**What it is:** Complete financial data orchestration platform with ~100 data providers unified under one API. MCP server native. Replaces individual API integrations.

See: OPENBB_INTEGRATION_REFERENCE.md for full evaluation.

---

## PART 5: API BUDGET AFTER FULL BUILD

| API | Free Tier Limit | Projected Usage | Headroom |
|---|---|---|---|
| Finnhub | 60 calls/min | ~35 calls/min | 42% spare |
| TwelveData | 800 calls/day | ~400 calls/day (with batching) | 50% spare |
| FRED | Unlimited | ~50 calls/day | Unlimited |
| FMP | 250 calls/day | ~100 calls/day | 60% spare |
| SEC EDGAR | No limit (10/sec) | ~50 calls/day | Unlimited |
| FINRA | No limit | 1 call/day | Unlimited |
| Congress.gov | 5,000/hr | ~20 calls/day | 99.6% spare |

**Total daily cost: $0.00**

---

## PART 6: WHAT INSTITUTIONS HAVE THAT WE CAN'T GET FREE

| They Have | We Don't | Impact | Workaround |
|---|---|---|---|
| Bloomberg Terminal ($24K/yr) | Full real-time everything | Latency disadvantage | Not scalping — irrelevant for swing/position |
| OPRA Options Feed ($2K+/mo) | Real-time sweeps/blocks | Can't see sweep orders | TwelveData options chain (delayed but functional) |
| Dark Pool Data ($500+/mo) | Off-exchange volume | Can't see dark pool prints | FINRA short volume (H13) is the free proxy |
| Level 2 ($100+/mo) | Order book depth | Can't see bid/ask queues | Not needed for thesis trading |
| Proprietary Quant Models | ML prediction | No backtesting yet | Phase 2: QuantConnect/Backtrader (free) |
| Alt Data (satellite, credit cards) | Alternative data | Can't track physical | Social sentiment (Finnhub free) |

**Honest gap:** ~75% of institutional capability at $0/month. Missing 25% is real-time options flow and alternative data — not critical for thesis-driven position trading.

---

## PART 7: SYSTEM STATE AFTER FULL BUILD

| Category | Modules | Current | After Full Build |
|---|---|---|---|
| HUNTER Core (H1-H29) | 29 | Mix wired/spec'd | Enhanced with new endpoints |
| Influence Chain (H30-H35) | 6 | Spec'd | Wired |
| Global Overnight (HG1-HG8) | 8 | Spec'd | Wired |
| Micro Gap-Fill (HM1-HM16) | 16 | Mostly empty | All wired |
| **Total** | **59** | **~21% utilization** | **~79% utilization** |

---

## PART 8: BUILD ORDER

### This Week (Priority 1)
1. Get FRED API key (30 sec)
2. Get FMP API key (free signup)
3. Wire H13 as FINRA Short Volume
4. Add Finnhub Insider Sentiment to H4
5. Add TwelveData batch requests to all TD nodes (8x efficiency)

### Next Week (Priority 2)
6. Build HM1 — Estimate Revision Scanner
7. Build HM2 — Analyst Action Monitor
8. Build HM3 — Aggregate Technical Signal
9. Enhance H7/H8 — Stack Bollinger + MACD + OBV + ADX + ATR
10. Wire FRED — H27 with 11 macro series

### Week 3 (Priority 3)
11. Build HM4 — Supply Chain Mapper
12. Build HM6 — Options Positioning (TwelveData options chain)
13. Build HM7 — Market Movers (FMP)
14. Build HM8 — Fundamental Screener (FMP)
15. Build HM12 — Insider Sentiment Score

### Month 2 (Priority 4)
16-27. Remaining HM modules, HG series, backtesting framework, OpenBB evaluation

---

🔱 **HUNTER CAPABILITY AUDIT v10.2 — COMPLETE**
**All endpoints cataloged. Build in priority order.**
