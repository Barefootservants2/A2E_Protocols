# HUNTER v3.0 — MARKET-WIDE DISCOVERY SYSTEM
## Effective: January 31, 2026
## Classification: PRODUCTION — DISCOVERY MODE

---

## CORE PHILOSOPHY CHANGE

**v2.0 and prior:** "Here's info on tickers you asked about." (CONFIRMATION)
**v3.0:** "Here's what's happening you DON'T know about." (DISCOVERY)

---

## SECTION 1: ARCHITECTURE SHIFT

### 1.1 The Confirmation Trap (v2.0 Problem)

Old workflow:
1. Principal provides watchlist
2. HUNTER retrieves data on watchlist items
3. Analysis confirms what Principal already suspected
4. **Result:** Echo chamber, no alpha generation

### 1.2 The Discovery Model (v3.0 Solution)

New workflow:
1. HUNTER scans market-wide for anomalies
2. Filters by Principal's stated criteria/sectors
3. Surfaces opportunities Principal DIDN'T know about
4. **Result:** Information edge, actual discovery

---

## SECTION 2: MODULE SPECIFICATIONS

### TIER 1: MARKET-WIDE SCREENERS (H1-H7)

#### H1: VOLUME ANOMALY SCANNER
- **Function:** Identify tickers with volume >200% of 20-day average
- **API Endpoints:** Finviz screener, Yahoo Finance unusual volume, TradingView scanner
- **Output:** Ranked list with volume multiplier and price action
- **Discovery Value:** Unusual volume precedes price moves

#### H2: PRICE BREAKOUT SCANNER
- **Function:** Identify tickers breaking 52-week highs/lows or key MA levels
- **API Endpoints:** Finviz 52-week high/low screener, TradingView MA crossover alerts
- **Output:** Breakout direction, level broken, volume confirmation
- **Discovery Value:** Breakouts signal regime change

#### H3: OPTIONS FLOW ANOMALY
- **Function:** Identify unusual options activity (size, OI change, sweep detection)
- **API Endpoints:** Unusual Whales (if accessible), Barchart unusual options, CBOE data
- **Output:** Ticker, strike, expiry, premium, flow direction
- **Discovery Value:** Smart money positioning visible in options

#### H4: SECTOR ROTATION DETECTOR
- **Function:** Identify money flowing between sectors
- **API Endpoints:** Sector ETF relative performance (XLF, XLE, XLK, etc.), SPDR sector fund flows
- **Output:** Sector rankings by 1/5/20-day performance, flow direction
- **Discovery Value:** Anticipate rotation before crowd

#### H5: INSIDER TRANSACTION SCANNER
- **Function:** Market-wide insider buying/selling clusters
- **API Endpoints:** SEC EDGAR Form 4 filings, OpenInsider, Finviz insider screener
- **Output:** Insider clusters by sector, notable individual transactions
- **Discovery Value:** Insiders act on information

#### H6: 13F DELTA SCANNER
- **Function:** Identify significant position changes by major funds
- **API Endpoints:** WhaleWisdom 13F tracker, SEC EDGAR 13F-HR filings, Fintel institutional ownership
- **Output:** New positions, exits, >25% position changes
- **Discovery Value:** Smart money thesis visibility

#### H7: EARNINGS SURPRISE SCANNER
- **Function:** Identify stocks with significant earnings beats/misses
- **API Endpoints:** Earnings Whispers, Yahoo Finance earnings calendar, Zacks earnings surprise
- **Output:** Surprise %, guidance change, price reaction
- **Discovery Value:** Post-earnings drift opportunity

---

### TIER 2: FLOW & POSITIONING (H8-H15)

#### H8: DARK POOL ACTIVITY
- **Function:** Identify unusual dark pool prints
- **API Endpoints:** FINRA ADF data, Quandl dark pool data
- **Output:** Large block trades, premium/discount to market
- **Limitation:** Often delayed data

#### H9: SHORT INTEREST SCANNER
- **Function:** Identify high/changing short interest
- **API Endpoints:** Finviz short float screener, FINRA short interest data, Ortex (if accessible)
- **Output:** Short % of float, days to cover, SI change
- **Discovery Value:** Short squeeze potential, crowded shorts

#### H10: ETF FLOW TRACKER
- **Function:** Monitor ETF creation/redemption activity
- **API Endpoints:** ETF.com fund flows, Bloomberg ETF data
- **Output:** Inflows/outflows by fund category
- **Discovery Value:** Passive flow impacts underlying

#### H11: FUTURES BASIS SCANNER
- **Function:** Monitor contango/backwardation in key markets
- **API Endpoints:** CME data, Barchart futures
- **Output:** Basis spread changes, roll yield opportunities
- **Discovery Value:** Futures structure signals supply/demand

#### H12: FX IMPACT SCANNER
- **Function:** Monitor currency moves impacting US equities
- **API Endpoints:** DXY, major pairs via forex APIs
- **Output:** USD strength/weakness, correlation impacts
- **Discovery Value:** Dollar moves precede commodity/equity shifts

#### H13: OPTIONS VOLUME SCANNER
- **Function:** Market-wide unusual options activity above $1M premium
- **API Endpoints:** Barchart, CBOE, Unusual Whales
- **Output:** All unusual flow above threshold
- **Discovery Value:** Large bets reveal conviction

#### H14: BOND MARKET SIGNALS
- **Function:** Monitor yield curve, credit spreads, TLT flows
- **API Endpoints:** Treasury.gov, FRED, bond ETF data
- **Output:** Yield curve shape, credit spread changes
- **Discovery Value:** Bond market leads equity market

#### H15: COT POSITIONING
- **Function:** Commitments of Traders positioning in futures
- **API Endpoints:** CFTC COT reports
- **Output:** Commercial vs speculative positioning changes
- **Discovery Value:** Extreme positioning signals reversals

---

### TIER 3: INTELLIGENCE & MACRO (H16-H21)

#### H16: NEWS VELOCITY TRACKER
- **Function:** Aggregate sentiment shifts across sectors
- **API Endpoints:** NewsAPI, Google News, financial news aggregators
- **Output:** Most-discussed sectors, sentiment shift detection
- **Discovery Value:** News velocity precedes price moves

#### H17: REGULATORY CALENDAR
- **Function:** Track upcoming regulatory events
- **API Endpoints:** Federal Register, SEC calendar, agency newsrooms
- **Output:** Pending rules, comment periods, enforcement actions
- **Discovery Value:** Regulatory events create binary outcomes

#### H18: IPO & LOCKUP CALENDAR
- **Function:** Track new listings and lockup expirations
- **API Endpoints:** IPO calendars, SEC filings
- **Output:** Upcoming IPOs, lockup expiration dates
- **Discovery Value:** Supply events impact price

#### H19: CORRELATION BREAKDOWN DETECTOR
- **Function:** Identify assets diverging from normal correlations
- **API Endpoints:** Calculated from price data
- **Output:** Assets with correlation breaks >2 standard deviations
- **Discovery Value:** Correlation breaks signal regime change

#### H20: LIQUIDITY SCANNER
- **Function:** Monitor market liquidity conditions
- **API Endpoints:** VIX, bid-ask spreads, volume data
- **Output:** Liquidity score by sector, stress indicators
- **Discovery Value:** Liquidity withdrawal precedes crashes

#### H21: CONGRESSIONAL INTEL
- **Function:** Track congressional trading and committee activity
- **API Endpoints:** Congress.gov, Capitol Trades, ProPublica
- **Output:** Member trades, committee hearings, bill progress
- **Discovery Value:** Political actors trade on information

---

### TIER 4: ADVANCED DISCOVERY (H22-H29)

#### H22: WHALE TRACKER
- **Function:** Track large institutional activity in real-time
- **API Endpoints:** Unusual Whales (paid — deferred), SEC EDGAR
- **Output:** Large block trades, institutional positioning changes
- **Note:** DEFERRED until free alternative identified

#### H23: INSTITUTIONAL 13F FILINGS
- **Function:** Real-time 13F filing alerts
- **API Endpoints:** SEC EDGAR XBRL feeds
- **Output:** New filings, position changes by major funds

#### H24: SOCIAL SENTIMENT PULSE
- **Function:** Reddit, Twitter/X sentiment aggregation
- **API Endpoints:** TBD — free tier evaluation needed
- **Output:** Trending tickers, sentiment scores, volume spikes

#### H25: DARK POOL ACTIVITY (Enhanced)
- **Function:** Enhanced dark pool monitoring
- **API Endpoints:** FINRA ADF, calculated from trade data
- **Output:** Block trade detection, unusual print patterns

#### H26: GEOPOLITICAL RISK MONITOR
- **Function:** Track geopolitical events impacting markets
- **API Endpoints:** NewsAPI with geopolitical keywords
- **Output:** Risk events, sanctions, trade policy changes

#### H27: FED & MACRO ECONOMIC DATA
- **Function:** Federal Reserve and key economic indicators
- **API Endpoints:** FRED API (need key), Treasury.gov
- **Output:** Rate decisions, economic releases, Fed commentary

#### H28: EARNINGS CALENDAR & ESTIMATES
- **Function:** Upcoming earnings with estimate tracking
- **API Endpoints:** Financial APIs, earnings calendars
- **Output:** Earnings dates, consensus estimates, whisper numbers

#### H29: PRECIOUS METALS REAL-TIME
- **Function:** Real-time precious metals pricing and spreads
- **API Endpoints:** metals.dev API (need key)
- **Output:** Spot prices, futures spreads, Shanghai premium

---

## SECTION 3: SCAN WORKFLOWS

### 3.1 Daily Discovery Scan (6:00 AM ET)

```
1. H1 → Volume anomalies (what moved?)
2. H2 → Price breakouts (what broke out?)
3. H4 → Sector rotation (where's money going?)
4. H16 → News velocity (what's being talked about?)
5. Cross-reference results → Surface non-watchlist opportunities
```

### 3.2 Weekly Discovery Scan

```
1. H5 → Insider clusters
2. H6 → 13F deltas (quarterly, but check for amendments)
3. H9 → Short interest changes
4. H15 → COT positioning
5. Generate discovery list for watchlist consideration
```

### 3.3 Event-Driven Discovery

```
1. H26 → Upcoming earnings
2. H27 → Macro events
3. H17 → Regulatory calendar
4. H18 → IPO/lockup calendar
5. Position for binary events
```

---

## SECTION 4: OUTPUT REQUIREMENTS

### 4.1 Discovery Report Format

```
## HUNTER v3.0 DISCOVERY REPORT
Date: [DATE]
Scan Type: [DAILY/WEEKLY/EVENT]

### MODULES EXECUTED
| Module | Status | Items Found | Source |
|--------|--------|-------------|--------|
| H1     | ✓/✗    | [COUNT]     | [URL]  |
| ...    | ...    | ...         | ...    |

### DISCOVERY FINDINGS
[Items NOT on current watchlist]

1. [TICKER] — [DISCOVERY REASON]
   - Data: [Specific metrics]
   - Source: [URL]
   - Relevance: [Why this matters]

### WATCHLIST CONFIRMATIONS
[Items on watchlist with new data]

### DATA GAPS
- [Modules that failed or returned no data]

### SOURCE INDEX
1. [URL]
2. [URL]
...
```

### 4.2 No Data Protocol

If a module returns no data:
1. State "[MODULE] returned no data"
2. State attempted source
3. Do NOT fabricate results
4. Move to next module

---

## SECTION 5: API IMPLEMENTATION NOTES

### 5.1 Free/Accessible Endpoints

| Module | Free Source | Limitation |
|--------|-------------|------------|
| H1-H2 | Finviz | Rate limits |
| H4 | Yahoo Finance | Delayed |
| H5 | OpenInsider | 2-day delay |
| H9 | Finviz | 2-week delay |
| H16 | Google News | Limited depth |
| H21 | Capitol Trades | Public filing delay |

### 5.2 Paid/Limited Access

| Module | Requires | Alternative |
|--------|----------|-------------|
| H3 | Unusual Whales sub | Barchart free tier |
| H6 | WhaleWisdom | SEC EDGAR direct |
| H8 | Dark pool data | FINRA ADF (delayed) |

### 5.3 n8n Integration Priority

**Phase 1 (Free endpoints):**
- H1, H2, H4, H5, H9, H16, H17, H21, H26, H27

**Phase 2 (API keys required):**
- H3, H6, H7, H8, H15

**Phase 3 (Premium/complex):**
- H10, H11, H12, H13, H14, H18, H19, H20

---

## SECTION 6: VERSIONING

| Version | Date | Changes |
|---------|------|---------|
| v3.0 | 2026-01-31 | Complete architecture shift: Discovery over Confirmation, 29 modules with specific endpoints |

---

## ATTESTATION

HUNTER v3.0 exists to find what you don't know, not confirm what you do.

**Discovery over Confirmation.**
**Sources over Assumptions.**
**Gaps disclosed, not hidden.**

**HUNTER v3.0 — DISCOVERY MODE**
