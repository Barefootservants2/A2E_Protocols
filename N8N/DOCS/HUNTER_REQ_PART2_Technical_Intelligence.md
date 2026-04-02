# HUNTER v3.3 — REQUIREMENTS PART 2 of 5
# TECHNICAL ANALYSIS (H10-H20) + INTELLIGENCE LAYER (H21-H28)
# Ashes2Echoes LLC | METATRON v10.8 | For: n8n Build AI
---

## CONTEXT

Continuing from Part 1. Part 2 covers the technical indicator suite (Twelve Data)
and the intelligence gathering layer (SEC, Congress, macro, geopolitical).

All nodes: alwaysOutputData=true, onError=continueRegularOutput
All feed into HUNTER MASTER MERGE → DATA AGGREGATOR → Agents
Same output schema required: {module, signal_type, signals[], count, error}

---

## H10-H20 — TECHNICAL ANALYSIS SUITE (Twelve Data)

All use Twelve Data API. Credential: Twelve Data API (Header Auth, ID: 3Jnfoq3LN9wTGMpu)
Base URL: https://api.twelvedata.com/

IMPORTANT: These run against a dynamic watchlist. The watchlist is built from
top movers (H2a) + high volume tickers (H1) + held positions. NOT a static list.

### H10 — TD Indices
ENDPOINT: /time_series?symbol=SPY,QQQ,IWM,DIA&interval=1day&outputsize=5
OUTPUT: {module:"H10", signal_type:"INDEX_PRICE", signals:[{symbol, close, change_pct, trend}], error}
PURPOSE: Broad market direction context for all agent decisions

### H11 — TD RSI
ENDPOINT: /rsi?symbol=[watchlist]&interval=1day&time_period=14
OUTPUT: {module:"H11", signal_type:"RSI", signals:[{ticker, rsi, signal:"OVERBOUGHT|OVERSOLD|NEUTRAL"}], error}
THRESHOLDS: RSI > 70 = overbought (caution) | RSI < 30 = oversold (opportunity)

### H12 — TD MACD
ENDPOINT: /macd?symbol=[watchlist]&interval=1day&fast_period=12&slow_period=26&signal_period=9
OUTPUT: {module:"H12", signal_type:"MACD", signals:[{ticker, macd, signal_line, histogram, cross:"BULLISH|BEARISH|NONE"}], error}
PURPOSE: Trend confirmation. Bullish cross = momentum entry signal.

### H13 — TD Bollinger Bands
ENDPOINT: /bbands?symbol=[watchlist]&interval=1day&time_period=20&sd=2
OUTPUT: {module:"H13", signal_type:"BOLLINGER", signals:[{ticker, upper, middle, lower, width, position:"ABOVE|BELOW|INSIDE"}], error}
PURPOSE: Volatility and breakout detection. Width expansion = trend starting.

### H14 — TD ADX
ENDPOINT: /adx?symbol=[watchlist]&interval=1day&time_period=14
OUTPUT: {module:"H14", signal_type:"ADX", signals:[{ticker, adx, trend_strength:"STRONG|MODERATE|WEAK"}], error}
THRESHOLDS: ADX > 25 = trending | ADX > 50 = strong trend | ADX < 20 = ranging

### H15 — TD ATR
ENDPOINT: /atr?symbol=[watchlist]&interval=1day&time_period=14
OUTPUT: {module:"H15", signal_type:"ATR", signals:[{ticker, atr, stop_distance}], error}
CRITICAL: ATR feeds IRONCLAD stop sizing. Stop = entry - (2 × ATR) for Ring 3/4 positions.

### H16 — TD EMA Stack
ENDPOINT: /ema?symbol=[watchlist]&interval=1day (called 3x for 20/50/200)
OUTPUT: {module:"H16", signal_type:"EMA_STACK", signals:[{ticker, ema20, ema50, ema200, stack:"BULLISH|BEARISH|MIXED"}], error}
SIGNAL: Price > EMA20 > EMA50 > EMA200 = full bullish stack. Required for Ring 3 entries.

### H17 — SEC Form 4 (MANDATORY)
SOURCE: SEC EDGAR full-text search
ENDPOINT: https://efts.sec.gov/LATEST/search-index?q=%22form+4%22&dateRange=custom&startdt={thirtyDaysAgo}&enddt={today}
OUTPUT: {module:"H17", signal_type:"FORM4_INSIDER", signals:[{filer, ticker, transaction_type, shares, value, date}], error}
MANDATORY: H4/H17/H22 triad must run on EVERY scan per HUNTER DRIFT FIX.
WATCHLIST CHECK: Must verify Sprott, Buffett (Berkshire), Druckenmiller (Duquesne),
Burry (Scion), Ackman (Pershing Square), Dalio (Bridgewater) on every run.

### H18 — TD Stochastic
ENDPOINT: /stoch?symbol=[watchlist]&interval=1day
OUTPUT: {module:"H18", signal_type:"STOCHASTIC", signals:[{ticker, k, d, signal:"BUY|SELL|NEUTRAL"}], error}
PURPOSE: Momentum entry/exit timing. K crosses above D below 20 = buy setup.

### H19 — Finnhub Recommendations
SOURCE: Finnhub
ENDPOINT: https://finnhub.io/api/v1/stock/recommendation?symbol=[ticker]
CREDENTIAL: Finnhub API (ID: ZsRtqMO5tofoPRmJ)
OUTPUT: {module:"H19", signal_type:"ANALYST_RECS", signals:[{ticker, strong_buy, buy, hold, sell, strong_sell, consensus_shift}], error}
SIGNAL: Consensus shift from HOLD → BUY = institutional upgrade cycle starting

### H20 — TD Volume Analysis
ENDPOINT: /time_series?symbol=[watchlist]&interval=1day&outputsize=20
OUTPUT: {module:"H20", signal_type:"VOLUME_ANALYSIS", signals:[{ticker, volume, avg_volume_20d, rvol, trend}], error}
KEY METRIC: RVOL (relative volume) = today_volume / avg_20d_volume
SIGNAL: RVOL > 2.0 on a technical setup = institutional confirmation. Cross-validates H1.
ENHANCEMENT NEEDED: RVOL field not currently calculated. Add it.

---

## H21-H28 — INTELLIGENCE LAYER

### H21 — Congress Bills
SOURCE: Congress.gov
ENDPOINT: https://api.congress.gov/v3/bill
CREDENTIAL: $vars.CONGRESS_API_KEY
INPUT: {congress: 119, limit: 20, sort: updateDate+desc}
OUTPUT: {module:"H21", signal_type:"CONGRESS_BILL", signals:[{bill_id, title, sponsor, committee, status, sector_tags}], error}
SIGNAL: AI/Defense/Energy/Healthcare bills advancing committee = sector catalyst
NOTE: Pair with H30 (congressional trades) and H32 (lobbying) for convergence scoring

### H22 — SEC Whale 13F (MANDATORY)
SOURCE: SEC EDGAR
ENDPOINT: https://efts.sec.gov/LATEST/search-index (13F filings)
CREDENTIAL: none (public)
OUTPUT: {module:"H22", signal_type:"WHALE_13F", signals:[{filer, ticker, shares, change_pct, quarter}], error}
MANDATORY: Part of H4/H17/H22 triad. Must check these filers EVERY run:
- Duquesne Family Office (Druckenmiller)
- Scion Asset Management (Burry)
- Pershing Square (Ackman)
- Bridgewater (Dalio)
- Berkshire Hathaway (Buffett)
- Sprott Asset Management
SIGNAL: New position by any watchlist filer = PRIME signal regardless of other gates

### H23 — SEC 8-K Material Events
SOURCE: SEC EDGAR
ENDPOINT: https://efts.sec.gov/LATEST/search-index?q=%228-K%22&dateRange=custom&startdt={today}
OUTPUT: {module:"H23", signal_type:"SEC_8K", signals:[{ticker, event_type, date, summary}], error}
KEY EVENT TYPES TO FLAG: executive changes, material agreements, restatements,
amendments to charter, going concern, missed payments
SIGNAL: 8-K before earnings = material change. 8-K + unusual options (H3) = high conviction.

### H24 — Yahoo Trending
SOURCE: Yahoo Finance (public)
ENDPOINT: https://query2.finance.yahoo.com/v1/finance/trending/US
OUTPUT: {module:"H24", signal_type:"RETAIL_TRENDING", signals:[{ticker, trend_score, change_pct}], error}
SIGNAL LOGIC: High trending + LOW institutional (H22) = retail-driven, fade.
High trending + HIGH institutional = follow momentum.
ENHANCEMENT: Cross-reference with H2b news velocity. Both spiking = breakout risk.

### H25 — Earnings Calendar (Secondary)
SOURCE: Finnhub
ENDPOINT: https://finnhub.io/api/v1/calendar/earnings
CREDENTIAL: Finnhub API (ID: ZsRtqMO5tofoPRmJ)
OUTPUT: Same as H7. Used to cross-validate H7 for completeness.
NOTE: H7 and H25 should be merged into single earnings object before DATA AGGREGATOR.

### H26 — Economic Calendar
SOURCE: Finnhub
ENDPOINT: https://finnhub.io/api/v1/calendar/economic
CREDENTIAL: Finnhub API (ID: ZsRtqMO5tofoPRmJ)
OUTPUT: {module:"H26", signal_type:"ECONOMIC_CALENDAR", signals:[{date, event, country, estimate, prior}], error}
KEY EVENTS: FOMC decision, CPI, NFP, PPI, GDP, retail sales, jobless claims
SIGNAL: FOMC within 5 days = reduce Ring 4 position size by 50%. No new Ring 3 entries.
UPCOMING: FOMC April 28-29. Rate hike probability 6.2%.

### H27 — FRED Macro Indicators
SOURCE: Federal Reserve FRED
ENDPOINT: https://api.stlouisfed.org/fred/series/observations
CREDENTIAL: $vars.FRED_API_KEY
SERIES TRACKED: FEDFUNDS, UNRATE, CPIAUCSL, M2SL, T10Y2Y (yield curve), VIXCLS
OUTPUT: {module:"H27", signal_type:"MACRO_INDICATOR", signals:[{series, value, date, trend}], regime, error}
REGIME DETECTION: Rising FEDFUNDS + inverted curve + high VIX = BEAR regime → reduce all positions
STATUS: CONFIRMED WORKING

### H28 — Geopolitical Intelligence
SOURCE: NewsAPI
ENDPOINT: https://newsapi.org/v2/everything
CREDENTIAL: NewsAPI (ID: sj27C965hpE5Y717)
KEYWORDS: Iran, Hormuz, tariffs, sanctions, NATO, Taiwan, war, ceasefire
OUTPUT: {module:"H28", signal_type:"GEOPOLITICAL", signals:[{headline, source, geo_tag, risk_level:"HIGH|MEDIUM|LOW"}], geo_risk_score, error}
SIGNAL: geo_risk_score > 7 triggers Gate 8.5 Regulatory Shock assessment
CURRENT ENVIRONMENT: Iran war active. Trump April 6 deadline passed.
Hormuz partially reopened. Brent ~$101. Peace deal speculation ongoing.
STATUS: CONFIRMED WORKING

---

## TECHNICAL ANALYSIS ENHANCEMENTS (Priority ordered)

1. RVOL calculation in H20 (HIGH — missing key confirmation metric)
2. Multi-timeframe: Add weekly RSI/MACD check alongside daily (HIGH)
3. H25+H7 merge: Deduplicate earnings into single object (MEDIUM)
4. H3 expansion: Scan top 10 volume tickers not just SPY (MEDIUM)
5. EMA cross alert: Flag when price crosses EMA20 on volume > 1.5x avg (MEDIUM)

## INTELLIGENCE LAYER ENHANCEMENTS (Priority ordered)

1. H22 watchlist verification: Add explicit filer name check, not just generic EDGAR search (HIGH)
2. H24 x H2b cross-signal: Flag when both trending AND high news velocity on same ticker (HIGH)
3. H28 geo_risk_score: Currently manual estimate. Add keyword frequency scoring (MEDIUM)
4. ADD H28b: Reddit WallStreetBets scanner — high DD post velocity = retail squeeze signal (MEDIUM)

---
PART 2 OF 5 COMPLETE. Part 3 covers H29-H42 (Metals Pipeline + Influence Chain + Correlation).
