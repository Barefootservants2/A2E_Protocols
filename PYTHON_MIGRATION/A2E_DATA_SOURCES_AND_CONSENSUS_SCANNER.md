# A2E PLATFORM — DATA SOURCES & CONSENSUS SCANNER
## Complete Inventory + Architecture for Source-Level Consensus

---

## DATA SOURCES — FULL INVENTORY

### TIER 1: FREE / EXISTING KEYS
Already wired or ready to wire. No cost.

| Source | Python Library | Data Provided | Key Status |
|--------|---------------|---------------|------------|
| Yahoo Finance | yfinance | Prices, fundamentals, options chains, trending, earnings | No key needed |
| FRED | fredapi | DXY, 10Y yield, CPI, PPI, unemployment, GDP, 50+ macro series | Key active |
| SEC EDGAR | sec-edgar-downloader + requests | 13F, Form 4, 8-K, proxy, insider transactions | No key needed |
| Finnhub | finnhub-python | Insider trades, earnings calendar, IPO calendar, recommendations, news, candles | Key active |
| Congress.gov | requests | Bills, amendments, committee activity | No key needed |
| USASpending | requests | Federal contract awards, spending by agency | No key needed |
| FEC | requests | Campaign finance, PAC contributions | No key needed |
| LDA Senate | requests | Lobbying filings, lobbying contributions | No key needed |
| Unusual Whales | requests (Bearer) | Options flow, congress trades, market tide/GEX | Key active |
| EIA | requests | Crude inventory, energy production, storage | Key active |
| Metals.dev | requests | Spot gold, silver, platinum, palladium | Free tier |

### TIER 2: FREE — NEW KEYS NEEDED (sign up, 5 min each)

| Source | Python Library | Data Provided | Cost |
|--------|---------------|---------------|------|
| TwelveData | requests | RSI, MACD, Bollinger, ADX, ATR, EMA, Stochastic, volume, indices | Free: 800 credits/day |
| NewsAPI | requests | Global news by keyword, source, date | Free: 100 req/day |
| AlphaVantage | alpha-vantage | Top movers, sector performance, technical indicators | Free: 25 req/day |
| Polygon.io | requests | Real-time quotes, options, forex, crypto | Free: 5 req/min |
| Tiingo | requests | EOD prices, IEX real-time, news, fundamentals | Free: 1000 req/day |
| Quandl/Nasdaq Data Link | requests | COMEX inventory, COT reports, economic data | Free tier (blocked from cloud — works from local Python) |
| IEX Cloud | requests | Real-time quotes, stats, financials, news | Free: 50K credits/mo |
| CBOE | requests | VIX term structure, put/call ratios, options volume | Free delayed data |
| Finviz | beautifulsoup4 (scrape) | Screener, heatmaps, insider trading, analyst ratings | Free (scrape) |
| Zacks | beautifulsoup4 (scrape) | Earnings estimates, rank, recommendations | Free (scrape) |
| Seeking Alpha | requests/scrape | Analyst ratings, quant ratings, earnings transcripts | Free (limited) |
| Barchart | requests | Options activity, unusual volume, technical signals | Free (limited) |
| StockAnalysis.com | requests/scrape | Financials, analyst consensus, insider activity | Free |
| TipRanks | requests/scrape | Analyst consensus, smart score, blogger sentiment | Free (limited) |
| Reddit/WallStreetBets | requests (Reddit API) | Retail sentiment, trending tickers, discussion volume | Free |
| StockTwits | requests | Social sentiment, trending, message volume | Free |

### TIER 3: PAID — ADD WHEN REVENUE JUSTIFIES

| Source | Data Provided | Cost |
|--------|---------------|------|
| Bloomberg Terminal | Everything | $24K/year |
| Refinitiv/LSEG | Institutional data | $10K+/year |
| S&P Capital IQ | Fundamentals, estimates | $15K+/year |
| SpotGamma | GEX levels, gamma exposure, key strikes | $50/mo |
| Ortex | Short interest, utilization, CTB | $50/mo |
| Koyfin | Screening, charting, fundamentals | $35/mo |

---

## CONSENSUS SCANNER ARCHITECTURE

### The Pipeline: Source Consensus → CIL Consensus → IRONCLAD Validation

```
PHASE 1: DATA SOURCE CONSENSUS
┌─────────────┐ ┌──────────────┐ ┌──────────────┐
│ Yahoo Top    │ │ Finviz       │ │ Zacks Top    │
│ Trending     │ │ Screener     │ │ Ranked       │
└──────┬──────┘ └──────┬───────┘ └──────┬───────┘
       │               │               │
┌──────┴──────┐ ┌──────┴───────┐ ┌──────┴───────┐
│ UW Options  │ │ TipRanks     │ │ SEC Insider  │
│ Flow        │ │ Smart Score  │ │ Buys         │
└──────┬──────┘ └──────┬───────┘ └──────┴───────┘
       │               │               │
       └───────────┬───┴───────────────┘
                   │
           ┌───────▼────────┐
           │  OVERLAP        │
           │  DETECTOR       │
           │                 │
           │ Ticker appears  │
           │ in 3+ sources   │
           │ = CANDIDATE     │
           └───────┬─────────┘
                   │
              TOP 5 CANDIDATES
                   │
PHASE 2: CIL DEEP ANALYSIS
                   │
       ┌───────────▼───────────┐
       │                       │
  ┌────▼────┐  ┌────▼────┐  ┌─▼──────┐
  │ URIEL   │  │COLOSSUS │  │HANIEL  │
  │ GPT-4.1 │  │ Grok    │  │Gemini  │
  └────┬────┘  └────┬────┘  └─┬──────┘
       │            │          │
       └─────┬──────┴──────────┘
             │
       ┌─────▼─────┐
       │ SYNTHESIS  │
       │ + ANVIL    │
       │ SCORING    │
       └─────┬──────┘
             │
       ┌─────▼─────┐
       │ RAZIEL     │
       │ COUNTER-   │
       │ THESIS     │
       └─────┬──────┘
             │
         TOP 2-3
             │
PHASE 3: IRONCLAD VALIDATION
             │
       ┌─────▼──────┐
       │ SENTINEL    │
       │ Position    │
       │ Sizing      │
       │ Tranche     │
       │ Entry       │
       └─────┬───────┘
             │
       PAPER TRADE
       or LIVE ORDER
```

### Phase 1: Source Consensus Scanner

```python
# scanner.py — Source Consensus
async def scan_all_sources():
    """Pull top picks from every data source in parallel"""
    results = await asyncio.gather(
        scan_yahoo_trending(),        # Top 25 trending tickers
        scan_finviz_screener(),       # Top movers + insider buys + analyst upgrades
        scan_zacks_top_ranked(),      # Zacks #1 Strong Buy
        scan_unusual_whales_flow(),   # Highest net premium options flow
        scan_sec_insider_buys(),      # Insider purchases > $100K, last 7 days
        scan_tipranks_consensus(),    # Strong Buy consensus + Smart Score 8+
        scan_seeking_alpha_quant(),   # Quant rating Strong Buy
        scan_reddit_trending(),       # WSB/investing mention velocity
        scan_finnhub_upgrades(),      # Analyst upgrades last 7 days
        scan_barchart_unusual(),      # Unusual options volume
        return_exceptions=True
    )
    return merge_and_rank(results)

def merge_and_rank(results):
    """Count how many sources flag each ticker"""
    ticker_scores = {}
    for source_name, tickers in results:
        for ticker, signal in tickers:
            if ticker not in ticker_scores:
                ticker_scores[ticker] = {
                    'count': 0, 'sources': [], 'signals': []
                }
            ticker_scores[ticker]['count'] += 1
            ticker_scores[ticker]['sources'].append(source_name)
            ticker_scores[ticker]['signals'].append(signal)

    # Sort by source count descending
    ranked = sorted(
        ticker_scores.items(),
        key=lambda x: x[1]['count'],
        reverse=True
    )

    # Return top 5 that appear in 3+ sources
    candidates = [
        (ticker, data) for ticker, data in ranked
        if data['count'] >= 3
    ][:5]

    return candidates
```

### Phase 2: CIL Deep Analysis on Candidates

```python
# For each of the top 5 candidates:
for ticker, source_data in candidates:
    query = f"""
    Evaluate {ticker} as a potential position.
    
    DATA SOURCE CONSENSUS: {len(source_data['sources'])} sources flagged this ticker.
    Sources: {', '.join(source_data['sources'])}
    Signals: {json.dumps(source_data['signals'], indent=2)}
    
    Run the full 6-layer thesis chain:
    1. Supply/demand dynamics for this company/sector
    2. Industrial/revenue demand trajectory
    3. Competitive position and moat
    4. Macro environment impact (rates, DXY, geopolitics)
    5. Sentiment and institutional positioning
    6. Catalyst calendar (earnings, filings, events)
    
    Score each layer HIGH/MEDIUM/LOW with specific data.
    """
    
    cil_result = await cil.run(query)
    anvil_score = anvil.score(cil_result)
    autopsy_flags = autopsy.scan(cil_result)
```

### Phase 3: IRONCLAD Validation

```python
# Only candidates with ANVIL >= 7.5 and AUTOPSY clean proceed
for candidate in scored_candidates:
    if candidate.anvil_score >= 7.5 and candidate.autopsy_flags == 0:
        # Check against existing portfolio
        position_check = sentinel.check_new_position(
            ticker=candidate.ticker,
            portfolio=current_portfolio,
            rules={
                'max_position_pct': 0.20,    # 20% max
                'min_position_usd': 5000,    # $5K minimum
                'correlation_check': True,    # No >80% correlated pairs
                'wash_sale_check': True,      # 30-day wash sale window
                'sector_concentration': 0.30  # No >30% in one sector
            }
        )
        
        if position_check.approved:
            # Generate tranche entry plan
            entry = ironclad.plan_entry(
                ticker=candidate.ticker,
                target_size=position_check.recommended_size,
                method='2x50_tranche'
            )
            # Paper trade or alert for human approval
            paper_trade.log(entry)
            telegram.send(format_trade_signal(candidate, entry))
```

---

## PAPER TRADING CONFIGURATION

### Starting Amount: $5,000

Research consensus:
- $1,000-$5,000 recommended for diversified beginner portfolio
- $5,000 gives enough to hold 5-10 positions with meaningful trim sizes
- Per IRONCLAD: $5K minimum position makes 5% trim = $250 (worth executing)
- Below $5K total, position sizing becomes impractical with IRONCLAD rules
- $25,000 required for PDT rule (margin day trading) — not applicable for thesis investing

### Paper Trade Rules:
- Start: $5,000 virtual capital
- Apply ALL IRONCLAD v3.0 rules identically to live
- Track every signal, every entry, every trim, every stop
- Log to Google Sheets AND Supabase
- Run 30 days minimum before any live capital decision
- Score system: compare paper results vs. S&P 500 over same period
- If paper portfolio underperforms S&P by > 5% over 30 days, system needs recalibration

### What We Measure:
- Win rate (% of positions that hit first trim target)
- Average gain on winners vs. average loss on losers
- Source consensus accuracy (did 3+ source overlap predict better than random?)
- CIL consensus accuracy (did PRIME-grade analyses outperform PROBE-grade?)
- RAZIEL value (did counter-thesis warnings prevent losses?)
- IRONCLAD compliance (did the rules execute correctly?)
- Time to first trim (how many days from entry to +5%?)

---

## TOTAL DATA POINT COUNT

| Category | Source Count | Data Points |
|----------|------------|-------------|
| Price / Quote | 5 (Yahoo, TwelveData, Polygon, Tiingo, IEX) | Real-time + historical prices, volume |
| Fundamentals | 4 (Yahoo, Finviz, Zacks, StockAnalysis) | Earnings, revenue, margins, valuation |
| Options / Flow | 4 (UW, Barchart, Yahoo, CBOE) | GEX, unusual volume, put/call, flow |
| Insider Activity | 3 (SEC, Finnhub, Finviz) | Form 4, insider buys/sells, cluster buys |
| Analyst Consensus | 4 (TipRanks, Zacks, Seeking Alpha, Finnhub) | Ratings, price targets, upgrades |
| Macro / Economic | 3 (FRED, EIA, CBOE) | Rates, inflation, oil, VIX term structure |
| Political / Regulatory | 4 (Congress, LDA, FEC, USASpending) | Bills, lobbying, contracts, PAC money |
| News / Sentiment | 4 (NewsAPI, Finnhub, Reddit, StockTwits) | Headlines, social velocity, sentiment |
| Technical Indicators | 2 (TwelveData, ta library) | RSI, MACD, Bollinger, ADX, ATR, EMA, Stochastic |
| Filings | 2 (SEC EDGAR, Finnhub) | 13F, 4, 8-K, proxy, earnings transcripts |
| **TOTAL** | **35 sources** | **~200+ distinct data signals** |

vs. TradingAgents: ~8 data sources
vs. Public.com Agents: proprietary (unknown, likely 5-10)
vs. Jenova: ~15 data sources

This is the moat. Not 5 agents arguing. 35 sources feeding 5 agents with 200+ signals scored through ANVIL. Nobody else has this data breadth with this analytical depth.
