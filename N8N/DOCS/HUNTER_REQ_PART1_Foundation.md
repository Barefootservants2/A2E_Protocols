# HUNTER v3.3 — REQUIREMENTS PART 1 of 5
# FOUNDATION: Architecture + Control Layer + Market Discovery (H1-H9)
# Ashes2Echoes LLC | METATRON v10.8 | For: n8n Build AI
---

## CONTEXT FOR n8n BUILD

You are reviewing HUNTER v3.3 — a market intelligence workflow running in n8n cloud at
ashes2echoes.app.n8n.cloud. Workflow ID: orZPNtvvCB8RAlwF.

This is Part 1 of 5. Parts 2-5 cover technical analysis, intelligence layer, agents,
and enhancement roadmap. Each part builds on this foundation.

MISSION: Gather every available edge signal, synthesize via 4 AI agents, deliver
ranked trade opportunities aligned to Five Ring allocation framework targeting 17-20%
annual return. Goal: $350K NAV → $408K minimum this year.

---

## COMPLETE ARCHITECTURE (5 stages)

Stage 1: TRIGGERS → DATE SETUP
Stage 2: 42 H-MODULES in parallel (market data, technicals, intelligence, macro, metals)
Stage 3: GATE 9 CORRELATION CHECK → Kill Switch if DXY+Yield adverse
Stage 4: DATA AGGREGATOR → 4 AI AGENTS (URIEL/COLOSSUS/HANIEL/RAZIEL) → SYNTHESIS
Stage 5: TELEGRAM BRIEF + CIL WEBHOOK + GITHUB ARCHIVE

All nodes have: alwaysOutputData=true, onError=continueRegularOutput
Workflow fires at: 6AM ET (pre-market), 12:30PM ET (midday), manual trigger

---

## STAGE 1: CONTROL LAYER

### S0 — Date Setup (Code node)
INPUT: trigger event
OUTPUT:
{
  today: "YYYY-MM-DD",
  thirtyDaysAgo: "YYYY-MM-DD",
  ninetyDaysAgo: "YYYY-MM-DD",
  timestamp: ISO string
}
PURPOSE: Provides date variables to all downstream H-modules via $json references

---

## STAGE 2A: H1-H9 — MARKET DISCOVERY MODULES

All run in PARALLEL immediately after Date Setup.
All use httpRequest node type.
All feed into HUNTER MASTER MERGE at end of pipeline.

### H1 — Volume Anomaly
SOURCE: Yahoo Finance
ENDPOINT: https://query1.finance.yahoo.com/v8/finance/spark
CREDENTIAL: none (public)
INPUT: {today}
OUTPUT: {module:"H1", signal_type:"VOLUME_ANOMALY", signals:[{ticker, volume, avg_volume, ratio}], count, error}
SIGNAL: Tickers with volume ratio > 2.0 = institutional activity flag
STATUS: CONFIRMED WORKING

### H2a — AV Top Movers
SOURCE: Alpha Vantage
ENDPOINT: https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS
CREDENTIAL: Alpha Vantage API (Header Auth, ID: ImjP6dfYHgTNWWfo)
INPUT: {today}
OUTPUT: {module:"H2a", signal_type:"TOP_MOVERS", signals:[{ticker, price, change_pct, volume}], count, error}
SIGNAL: Top 20 gainers + losers + most active daily
STATUS: CONFIRMED WORKING

### H2b — News Velocity
SOURCE: NewsAPI
ENDPOINT: https://newsapi.org/v2/everything
CREDENTIAL: NewsAPI (Header Auth, ID: sj27C965hpE5Y717)
INPUT: {today, keywords: market/trading terms}
OUTPUT: {module:"H2b", signal_type:"NEWS_VELOCITY", signals:[{title, source, ticker_mention, published}], count, error}
SIGNAL: High article velocity on a ticker = sentiment catalyst developing
ENHANCEMENT NEEDED: Add sentiment_score field (-1 to +1) per article
STATUS: CONFIRMED WORKING

### H3 — Options Flow
SOURCE: Yahoo Finance (public)
ENDPOINT: https://query2.finance.yahoo.com/v7/finance/options/SPY
CREDENTIAL: none (public)
INPUT: none (SPY only currently)
OUTPUT: {module:"H3", signal_type:"OPTIONS_FLOW", signals:[{strike, expiry, type, volume, oi}], pcr, error}
SIGNAL: Put/call ratio < 0.7 = bullish | > 1.2 = bearish | unusual strike volume = directional bet
CURRENT ISSUE: Only scanning SPY. Should expand to top 10 volume tickers.
ENHANCEMENT: Add unusual options activity flag when volume > 5x open interest
STATUS: NEEDS VERIFICATION — response structure unclear

### H4 — Sector Rotation
SOURCE: Alpha Vantage
ENDPOINT: https://www.alphavantage.co/query?function=SECTOR
CREDENTIAL: Alpha Vantage API (ID: ImjP6dfYHgTNWWfo)
INPUT: none (returns all 11 sectors)
OUTPUT: {module:"H4", signal_type:"SECTOR_ROTATION", signals:[{sector, performance_1d, performance_5d, performance_1m}], hot_sector, cold_sector, error}
SIGNAL: Capital flowing INTO sector = tailwind for sector stocks
STATUS: CONFIRMED WORKING

### H5 — Insider Transactions
SOURCE: Finnhub
ENDPOINT: https://finnhub.io/api/v1/stock/insider-transactions
CREDENTIAL: Finnhub API (Header Auth, ID: ZsRtqMO5tofoPRmJ)
INPUT: {symbol: watchlist tickers, from: thirtyDaysAgo, to: today}
OUTPUT: {module:"H5", signal_type:"INSIDER_TRANSACTION", signals:[{name, ticker, shares, value, transaction_type, date}], net_direction, error}
SIGNAL: Cluster of insider buys = conviction signal | CEO buy > $1M = PRIME
MANDATORY: Part of required H4/H17/H22 triad per HUNTER DRIFT FIX
STATUS: CONFIRMED WORKING

### H6 — SEC 13F EDGAR
SOURCE: SEC EDGAR
ENDPOINT: https://efts.sec.gov/LATEST/search-index
CREDENTIAL: none (public)
INPUT: {query: "13F", dateRange: last quarter}
OUTPUT: {module:"H6", signal_type:"INSTITUTIONAL_13F", signals:[{filer, ticker, shares, change_pct, value}], count, error}
SIGNAL: New institutional position = accumulation | Exit = distribution
STATUS: CONFIRMED WORKING

### H7 — Earnings Calendar
SOURCE: Finnhub
ENDPOINT: https://finnhub.io/api/v1/calendar/earnings
CREDENTIAL: Finnhub API (ID: ZsRtqMO5tofoPRmJ)
INPUT: {from: today, to: 14 days forward}
OUTPUT: {module:"H7", signal_type:"EARNINGS_CALENDAR", signals:[{ticker, date, estimate_eps, revenue_estimate}], count, error}
SIGNAL: Pre-earnings drift window = 5-10 days before report. FCX earns April 16.
STATUS: CONFIRMED WORKING

### H8 — FINRA Short Sale
SOURCE: FINRA
ENDPOINT: https://api.finra.org/data/group/otcMarket/name/regShoDaily
CREDENTIAL: none (public)
INPUT: none
OUTPUT: {module:"H8", signal_type:"SHORT_SALE", signals:[{ticker, short_volume, total_volume, short_pct}], threshold_list, error}
SIGNAL: High short % + rising price = squeeze candidate | On threshold list = forced buy-in risk
ENHANCEMENT: Verify daily update cadence — may have delay
STATUS: NEEDS VERIFICATION

### H9 — IPO Calendar
SOURCE: Finnhub
ENDPOINT: https://finnhub.io/api/v1/calendar/ipo
CREDENTIAL: Finnhub API (ID: ZsRtqMO5tofoPRmJ)
INPUT: {from: today, to: 90 days forward}
OUTPUT: {module:"H9", signal_type:"IPO_CALENDAR", signals:[{ticker, date, price_range, shares_offered}], count, error}
SIGNAL: IPO within 30 days = Ring 4 event play candidate
Active tracking: SpaceX, OpenAI, Databricks, Anduril, Stripe (see IPO Wave Tracker)
STATUS: CONFIRMED WORKING

---

## DATA FLOW FROM H1-H9

All 9 nodes connect to HUNTER MASTER MERGE node (merge type: append).
Each outputs a standardized schema:
{
  module: "H1" through "H9",
  signal_type: string,
  signals: array of signal objects,
  count: number,
  error: null or error message
}

This schema is MANDATORY. All modules must conform. DATA AGGREGATOR depends on it.

---

## FIVE RING CONTEXT (for signal routing)

H1-H9 primarily feeds Ring 4 (tactical/event) and Ring 3 (structural trend confirmation):
- Ring 3 (15-20% allocation): Structural holds 6-12 months. PLTR, FCX, defense AI.
- Ring 4 (5-10% allocation): Tactical 1-4 weeks. Earnings plays, breakouts, catalysts.
- Ring 5 (max 2%): Lottery/binary. High-risk short duration.

HUNTER must remain MARKET-WIDE. Never screen for thesis-specific tickers only.
Wide net: minimum 10 signals per module, 25 consolidated minimum to agents.

---
PART 1 OF 5 COMPLETE. Part 2 covers H10-H28 (Technical Analysis + Intelligence Layer).
