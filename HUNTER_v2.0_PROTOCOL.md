# HUNTER v2.0 PROTOCOL — DETAILED SPECIFICATION

**Version:** 2.0 | **Parent Protocol:** METATRON v8.0  
**Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 21, 2026

---

## OVERVIEW

HUNTER (Heuristic Unified Network for Tactical Equity Research) is METATRON's opportunity scanning subsystem. Version 2.0 expands from 6 to 10 modules, adding institutional flow intelligence and positioning analysis.

---

## MODULE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    HUNTER v2.0 MODULES                          │
├─────────────────────────────────────────────────────────────────┤
│  INTELLIGENCE TIER                                              │
│  ├── H1: Elite Investor Tracking          [DAILY]               │
│  ├── H2: Political Catalyst Monitor       [DAILY]               │
│  ├── H3: Sector Momentum Scanner          [WEEKLY]              │
│  └── H4: Insider Cluster Detection        [DAILY]               │
├─────────────────────────────────────────────────────────────────┤
│  OPPORTUNITY TIER                                               │
│  ├── H5: Oversold Quality Screen          [DAILY]               │
│  └── H6: Contract Pipeline Tracker        [WEEKLY]              │
├─────────────────────────────────────────────────────────────────┤
│  FLOW TIER (NEW)                                                │
│  ├── H7: Options Unusual Activity         [DAILY]               │
│  └── H8: Short Interest Dynamics          [DAILY]               │
├─────────────────────────────────────────────────────────────────┤
│  POSITIONING TIER (NEW)                                         │
│  ├── H9: 13F Delta Velocity               [QUARTERLY+]          │
│  └── H10: Crowding/Concentration          [WEEKLY]              │
└─────────────────────────────────────────────────────────────────┘
```

---

## H1: ELITE INVESTOR TRACKING

### Purpose
Track positioning changes of investors with proven long-term track records.

### Tracked Investors

| Investor | Fund | Specialty | Primary Source |
|----------|------|-----------|----------------|
| Eric Sprott | Sprott Inc | Precious metals, mining | 13F, 13D |
| Warren Buffett | Berkshire Hathaway | Value, quality | 13F, Annual Letter |
| Michael Burry | Scion Asset Mgmt | Contrarian, macro | 13F, Twitter |
| Stanley Druckenmiller | Duquesne Family Office | Macro, momentum | 13F, Interviews |
| David Tepper | Appaloosa Mgmt | Distressed, cyclical | 13F, CNBC |
| Seth Klarman | Baupost Group | Deep value | 13F, Annual Letter |
| Howard Marks | Oaktree Capital | Credit, distressed | 13F, Memos |
| Bill Ackman | Pershing Square | Activist | 13F, Letters, Twitter |
| Carl Icahn | Icahn Enterprises | Activist | 13D, 13F |
| David Einhorn | Greenlight Capital | Value, shorts | 13F, Conferences |

### Data Sources
- **13F Filings:** Quarterly, 45-day lag from quarter end
- **13D/13G Filings:** >5% positions, filed within 10 days
- **Form 4:** Insider transactions, filed within 2 business days
- **Public Statements:** Interviews, letters, conference presentations

### Alert Triggers
| Event | Alert Level | Action |
|-------|-------------|--------|
| New position initiated | HIGH | Research immediately |
| Position increased >25% | MEDIUM | Add to watchlist |
| Position decreased >25% | MEDIUM | Review thesis |
| Position exited | HIGH | Investigate reason |
| Public statement on position | HIGH | Update thesis |

### Output Format
```yaml
h1_alert:
  investor: string
  ticker: string
  action: NEW | INCREASE | DECREASE | EXIT
  shares_change: int
  value_change: float
  pct_portfolio: float
  filing_date: ISO-8601
  filing_type: 13F | 13D | 13G | FORM4
  notes: string
```

---

## H2: POLITICAL CATALYST MONITOR

### Purpose
Track policy and regulatory developments that could impact positions.

### Monitoring Targets

**Congressional:**
- Committee hearing schedules
- Bill introductions and votes
- Budget/appropriations progress
- Confirmation hearings

**Executive:**
- Executive orders
- Agency rule-making
- Trade policy (tariffs, sanctions)
- Presidential statements

**Regulatory:**
| Sector | Primary Agencies |
|--------|-----------------|
| Defense | DOD, Armed Services Committees |
| Energy | DOE, FERC, EPA |
| Healthcare | FDA, CMS, HHS |
| Finance | SEC, Fed, CFTC, Treasury |
| Tech | FTC, DOJ Antitrust |
| Mining/Resources | BLM, EPA, USFS |

### Alert Classification
| Type | Timeline | Impact |
|------|----------|--------|
| IMMINENT | <7 days | Direct policy impact |
| PENDING | 7-30 days | Potential impact |
| DEVELOPING | 30-90 days | Monitor |
| LONG-TERM | >90 days | Background |

### Output Format
```yaml
h2_alert:
  event_type: HEARING | BILL | EXECUTIVE | REGULATORY
  agency: string
  date: ISO-8601
  description: string
  affected_sectors: [list]
  affected_tickers: [list]
  impact_assessment: POSITIVE | NEGATIVE | NEUTRAL | UNCERTAIN
  probability: float
  timeline: IMMINENT | PENDING | DEVELOPING | LONG-TERM
```

---

## H3: SECTOR MOMENTUM SCANNER

### Purpose
Identify sector rotation opportunities through relative strength analysis.

### Sectors Tracked
- XLF (Financials)
- XLK (Technology)
- XLE (Energy)
- XLV (Healthcare)
- XLI (Industrials)
- XLY (Consumer Discretionary)
- XLP (Consumer Staples)
- XLU (Utilities)
- XLB (Materials)
- XLRE (Real Estate)
- XLC (Communications)
- GDX (Gold Miners)
- SLV (Silver)
- USO (Oil)

### Metrics
| Metric | Calculation | Signal |
|--------|-------------|--------|
| RS 1-Week | Sector return / SPY return | Momentum |
| RS 1-Month | Same, 1-month | Trend |
| RS 3-Month | Same, 3-month | Intermediate |
| Fund Flow | ETF inflows/outflows | Sentiment |
| Breadth | % stocks > 50MA | Health |
| New Highs/Lows | Count ratio | Extremes |

### Rotation Signals
| Signal | Criteria | Action |
|--------|----------|--------|
| RS Breakout | RS > 1.1 after < 0.95 | Initiate research |
| Flow Reversal | 3 consecutive weeks opposite | Watch closely |
| Breadth Divergence | Price up, breadth down | Caution |
| Leadership Change | New sector leading | Rebalance |

### Output Format
```yaml
h3_scan:
  scan_date: ISO-8601
  top_3_rs:
    - sector: string
      rs_1wk: float
      rs_1mo: float
      rs_3mo: float
      fund_flow_1wk: float
      breadth_50ma: float
  bottom_3_rs:
    - [same structure]
  rotation_signals: [list]
  recommended_exposure: [sectors]
```

---

## H4: INSIDER CLUSTER DETECTION

### Purpose
Identify meaningful insider buying patterns that may indicate undervaluation.

### Cluster Definition
**Standard Cluster:**
- 3+ different insiders buying within 14 calendar days
- Minimum combined value: $100K

**High-Value Single:**
- Any single insider purchase > $500K

**Executive Signal:**
- CEO or CFO buying any amount (not option exercise)

### Quality Filters (Exclude)
- Option exercises (Form 4 code M)
- 10b5-1 plan transactions (unless unusual timing)
- Gift transactions
- Purchases to maintain minimum ownership requirements

### Weighting Factors
| Insider Role | Weight |
|--------------|--------|
| CEO | 3.0 |
| CFO | 2.5 |
| COO/President | 2.0 |
| Director | 1.5 |
| VP | 1.0 |
| 10% Owner | 2.0 |

| Purchase Size vs Salary | Weight |
|------------------------|--------|
| > 100% annual | 3.0 |
| 50-100% annual | 2.0 |
| 25-50% annual | 1.5 |
| < 25% annual | 1.0 |

### Cluster Score
`CS = Σ(Role_Weight × Size_Weight × Purchase_Value) / 100,000`

| Score | Interpretation |
|-------|---------------|
| > 10 | Very strong signal |
| 5-10 | Strong signal |
| 2-5 | Moderate signal |
| < 2 | Weak signal |

### Output Format
```yaml
h4_cluster:
  ticker: string
  cluster_period: [start_date, end_date]
  total_insiders: int
  total_value: float
  cluster_score: float
  insiders:
    - name: string
      role: string
      shares: int
      value: float
      date: ISO-8601
      transaction_type: string
```

---

## H5: OVERSOLD QUALITY SCREEN

### Purpose
Find quality companies trading at distressed prices.

### Screen Criteria

**Technical Oversold:**
- RSI(14) < 30, OR
- Price > 30% below 52-week high, OR
- Price < lower Bollinger Band (2 std)

**Quality Filters:**
- Profitable (TTM EPS > 0)
- Debt/Equity < 1.0
- Current Ratio > 1.5
- Interest Coverage > 3.0
- No material negative 8-K in past 30 days
- Market cap > $500M (avoid distressed micro-caps)

### Quality Score Components
| Factor | Weight | Calculation |
|--------|--------|-------------|
| Profitability | 30% | ROE percentile |
| Balance Sheet | 30% | Debt/Equity inverse percentile |
| Momentum | 20% | 6-month RS percentile |
| Catalyst | 20% | Upcoming event score |

### Output Format
```yaml
h5_screen:
  scan_date: ISO-8601
  results:
    - ticker: string
      company: string
      sector: string
      price: float
      rsi_14: float
      pct_from_52wk_high: float
      roe: float
      debt_equity: float
      current_ratio: float
      quality_score: float
      potential_catalysts: [list]
```

---

## H6: CONTRACT PIPELINE TRACKER

### Purpose
Track government and major contract opportunities.

### Data Sources
- SAM.gov (Federal contracts)
- State procurement portals
- Company investor presentations
- Industry conferences
- Press releases

### Tracking Fields
```yaml
contract:
  contract_id: string
  description: string
  agency: string
  estimated_value: float
  award_date_expected: ISO-8601
  incumbent: string
  competitors: [list]
  our_tracked_companies: [tickers]
  probability_assessment: float
  stage: OPPORTUNITY | PROPOSAL | EVALUATION | AWARD
```

### Key Contract Vehicles
- IDIQ (Indefinite Delivery/Indefinite Quantity)
- GSA Schedule
- GWAC (Government-Wide Acquisition Contracts)
- Agency-specific BPAs

### Alert Triggers
| Event | Alert |
|-------|-------|
| New opportunity > $100M | IMMEDIATE |
| Award within 30 days | HIGH |
| Tracked company wins | IMMEDIATE |
| Tracked company loses | HIGH |
| Contract modification > 20% | MEDIUM |

---

## H7: OPTIONS UNUSUAL ACTIVITY SCANNER (NEW)

### Purpose
Detect unusual options activity that may indicate informed trading.

### Unusual Activity Criteria
| Metric | Threshold | Classification |
|--------|-----------|---------------|
| Volume vs Avg | > 2x | Unusual |
| Volume vs Avg | > 5x | Highly Unusual |
| Volume vs OI | > 1.0 | New positioning |
| Premium | > $100K | Significant |
| Premium | > $1M | Institutional |

### Pattern Recognition
| Pattern | Structure | Interpretation |
|---------|-----------|---------------|
| Call Sweep | Multiple exchanges, near-term, OTM | Bullish urgency |
| Put Sweep | Multiple exchanges, near-term, OTM | Bearish urgency |
| Call Block | Single exchange, large size | Institutional buying |
| Put Block | Single exchange, large size | Institutional hedging |
| Straddle/Strangle | Both sides | Volatility expectation |
| Unusual Spread | Complex structure | Specific outlook |

### Expiration Focus
| Days to Expiry | Classification | Weight |
|----------------|---------------|--------|
| 0-7 | Weekly | 1.5 (highest urgency) |
| 8-30 | Near-term | 1.2 |
| 31-60 | Standard | 1.0 |
| 61-120 | LEAPS-adjacent | 0.8 |
| > 120 | LEAPS | 0.6 |

### Flow Sentiment Score
`FSS = Σ(Call_Premium - Put_Premium) / Total_Premium`

| FSS | Interpretation |
|-----|---------------|
| > 0.5 | Strongly Bullish |
| 0.2 to 0.5 | Bullish |
| -0.2 to 0.2 | Neutral |
| -0.5 to -0.2 | Bearish |
| < -0.5 | Strongly Bearish |

### Output Format
```yaml
h7_alert:
  ticker: string
  timestamp: ISO-8601
  activity_type: SWEEP | BLOCK | UNUSUAL_VOLUME
  direction: CALL | PUT | BOTH
  strike: float
  expiry: ISO-8601
  volume: int
  open_interest: int
  premium: float
  vol_vs_avg: float
  sentiment_signal: BULLISH | BEARISH | NEUTRAL
  urgency: HIGH | MEDIUM | LOW
  notes: string
```

---

## H8: SHORT INTEREST DYNAMICS TRACKER (NEW)

### Purpose
Track short interest changes and assess squeeze potential.

### Key Metrics
| Metric | Definition | Significance |
|--------|------------|--------------|
| SI % | Short shares / Float | Bearish positioning |
| Days to Cover | Short shares / Avg Volume | Squeeze duration |
| Cost to Borrow | Annualized rate | Squeeze pressure |
| Utilization | Shorted / Available to short | Supply tightness |

### Threshold Alerts
| Metric | Level | Alert |
|--------|-------|-------|
| SI % | > 20% | HIGH |
| SI % | > 40% | EXTREME |
| Days to Cover | > 5 | HIGH |
| Days to Cover | > 10 | EXTREME |
| Cost to Borrow | > 20% | HIGH |
| Cost to Borrow | > 50% | EXTREME |
| Utilization | > 80% | HIGH |
| Utilization | > 95% | EXTREME |

### Squeeze Probability Score
`SPS = (SI_norm × 0.25) + (DTC_norm × 0.25) + (CTB_norm × 0.25) + (Util_norm × 0.25)`

Where each factor is normalized 0-1 based on thresholds.

| SPS | Interpretation | Action |
|-----|---------------|--------|
| 0-0.3 | Low | Standard analysis |
| 0.3-0.5 | Moderate | Monitor closely |
| 0.5-0.7 | High | Potential opportunity |
| 0.7-1.0 | Extreme | High risk/reward |

### Change Detection
| Change | Timeframe | Alert |
|--------|-----------|-------|
| SI +20% | 2 weeks | Bearish acceleration |
| SI -20% | 2 weeks | Covering activity |
| CTB +50% | 1 week | Supply tightening |
| Util +10% | 1 week | Approaching max short |

### Output Format
```yaml
h8_tracker:
  ticker: string
  report_date: ISO-8601
  short_interest:
    shares: int
    pct_float: float
    change_2wk: float
    change_4wk: float
  days_to_cover: float
  cost_to_borrow: float
  utilization: float
  squeeze_probability: float
  alerts: [list]
  recommendation: string
```

---

## H9: 13F DELTA VELOCITY ANALYSIS (NEW)

### Purpose
Analyze rate of change in institutional positioning to identify accumulation/distribution.

### Data Sources
- SEC EDGAR 13F filings
- Quarterly, filed within 45 days of quarter end
- Amendment tracking (13F/A)

### Delta Calculations
```
Share_Delta = (Current_Shares - Prior_Shares) / Prior_Shares
Dollar_Delta = Current_Value - Prior_Value
Velocity = Annualized_Delta
```

### Aggregation Levels

**Level 1: Individual Fund**
Track specific fund changes

**Level 2: Fund Category**
| Category | Examples |
|----------|----------|
| Hedge Funds | Point72, Citadel, Renaissance |
| Mutual Funds | Fidelity, Vanguard, BlackRock |
| Pensions | CalPERS, CalSTRS |
| Sovereign Wealth | Norway, Singapore |
| Insurance | Berkshire, MetLife |

**Level 3: Aggregate Institutional**
Total 13F holder position changes

### Velocity Classification
| QoQ Change | Classification | Signal |
|------------|---------------|--------|
| > +50% | Aggressive Accumulation | Very Bullish |
| +25% to +50% | Strong Accumulation | Bullish |
| +10% to +25% | Moderate Accumulation | Slightly Bullish |
| -10% to +10% | Stable | Neutral |
| -25% to -10% | Moderate Distribution | Slightly Bearish |
| -50% to -25% | Strong Distribution | Bearish |
| < -50% | Aggressive Distribution | Very Bearish |

### Smart Money Weighting
H1 tracked investors receive 2x weight in aggregate calculations.

### Output Format
```yaml
h9_analysis:
  ticker: string
  quarter: string
  total_13f_holders: int
  total_shares_held: int
  qoq_change:
    shares: float
    value: float
    holder_count: int
  category_breakdown:
    hedge_funds:
      delta: float
      notable_changes: [list]
    mutual_funds:
      delta: float
      notable_changes: [list]
  smart_money_delta: float
  velocity_signal: string
  confidence: float
```

---

## H10: CROWDING/CONCENTRATION MONITOR (NEW)

### Purpose
Monitor positioning concentration to identify crowding risk.

### Concentration Metrics

**Ownership Concentration:**
```
HHI = Σ(ownership_pct²) × 10,000

Top_10_Concentration = Σ(top_10_holder_pcts)
```

| HHI | Interpretation |
|-----|---------------|
| < 1000 | Unconcentrated |
| 1000-1800 | Moderate concentration |
| 1800-2500 | High concentration |
| > 2500 | Very high concentration |

**Hedge Fund Hotel Detection:**
- Count HFs with > 2% ownership
- If > 5 HFs qualify → HOTEL FLAG
- Check entry timing similarity → HERDING FLAG

**ETF Ownership:**
| ETF % | Risk |
|-------|------|
| < 10% | Low |
| 10-20% | Moderate |
| > 20% | High (index rebalance risk) |

**Retail Crowding Indicators:**
- Reddit mention velocity (WallStreetBets, stocks)
- StockTwits sentiment and volume
- Retail options flow percentage
- Robinhood/retail broker positioning data

### Crowding Score
`CS = (Inst_Conc × 0.30) + (HF_Hotel × 0.25) + (Retail × 0.20) + (SI_Factor × 0.25)`

| Score | Risk Level | Recommendation |
|-------|------------|---------------|
| 0-0.3 | LOW | Position freely |
| 0.3-0.5 | MODERATE | Standard sizing |
| 0.5-0.7 | HIGH | NIBBLE only |
| 0.7-0.85 | VERY HIGH | Avoid or minimal |
| > 0.85 | EXTREME | Do not enter |

### Reversal Risk Assessment
High crowding + momentum = elevated reversal risk
High crowding + negative catalyst = stampede risk

### Output Format
```yaml
h10_monitor:
  ticker: string
  analysis_date: ISO-8601
  ownership:
    institutional_pct: float
    top_10_pct: float
    hhi: float
  hedge_fund:
    count_above_2pct: int
    total_hf_ownership: float
    hotel_flag: boolean
    herding_flag: boolean
  etf_ownership_pct: float
  retail:
    wsb_mention_velocity: float
    stocktwits_volume: float
    estimated_retail_pct: float
  short_interest_pct: float
  crowding_score: float
  risk_level: string
  recommendation: string
```

---

## HUNTER SCAN EXECUTION

### Daily Scan Sequence
```
06:00 ET - H1: Elite Investor (overnight filings)
06:30 ET - H2: Political Catalyst (calendar update)
07:00 ET - H4: Insider Cluster (Form 4 filings)
07:30 ET - H5: Oversold Quality (pre-market)
08:00 ET - H7: Options Flow (prior day unusual)
08:30 ET - H8: Short Interest (bi-weekly data + estimates)
```

### Weekly Scan Sequence (Sunday)
```
H3: Sector Momentum (weekly close data)
H6: Contract Pipeline (SAM.gov update)
H10: Crowding Monitor (13F aggregation)
```

### Quarterly Scan (13F Season)
```
H9: 13F Delta Velocity (new filings)
H1: Elite Investor (deep update)
```

---

## HUNTER INTEGRATION WITH METATRON

### Gate 11 Requirements
All 10 HUNTER modules must complete scan before Gate 11 passes.

### Alert Escalation
| Alert Level | Action |
|-------------|--------|
| ROUTINE | Log for review |
| ELEVATED | Add to watchlist |
| HIGH | Immediate research |
| CRITICAL | Principal notification |

### Cross-Module Correlation
When multiple modules flag same ticker:
- 2 modules → ELEVATED
- 3+ modules → HIGH
- 4+ modules → CRITICAL

Example: H1 (Sprott buying) + H7 (call sweeps) + H8 (SI declining) = CRITICAL alert

---

**END HUNTER v2.0 PROTOCOL**

🔱
