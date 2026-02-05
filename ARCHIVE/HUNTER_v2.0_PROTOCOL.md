# HUNTER v2.0 PROTOCOL — DETAILED SPECIFICATION

**Version:** 2.0 | **Parent Protocol:** METATRON v8.0  
**Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 21, 2026

---

## OVERVIEW

HUNTER (Heuristic Unified Network for Tactical Equity Research) is METATRON's opportunity scanning subsystem. Version 2.0 maintains the 14 production modules from v7.7, enhances H8/H9/H12 with institutional-grade analytics, and adds H15 for crowding analysis.

**Module Count:** 15 (H1-H15)

---

## MODULE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    HUNTER v2.0 MODULES (15)                     │
├─────────────────────────────────────────────────────────────────┤
│  INTELLIGENCE TIER (H1-H6)                                      │
│  ├── H1: Elite Investor Tracking          [DAILY]               │
│  ├── H2a: Legislative Catalyst            [DAILY]               │
│  ├── H2b: Regulatory/Executive            [DAILY]               │
│  ├── H3: Sector Momentum Scanner          [WEEKLY]              │
│  ├── H4: Insider Cluster Detection        [DAILY]               │
│  ├── H5: Oversold Quality Screen          [DAILY]               │
│  └── H6: Contract Pipeline Tracker        [WEEKLY]              │
├─────────────────────────────────────────────────────────────────┤
│  EVENT & FLOW TIER (H7-H10)                                     │
│  ├── H7: Earnings Catalyst Calendar       [DAILY]               │
│  ├── H8: Unusual Options Flow             [DAILY] ★ ENHANCED    │
│  ├── H9: Short Interest Dynamics          [DAILY] ★ ENHANCED    │
│  └── H10: IPO/SPAC Pipeline               [WEEKLY]              │
├─────────────────────────────────────────────────────────────────┤
│  MACRO & INSTITUTIONAL TIER (H11-H14)                           │
│  ├── H11: Macro Event Calendar            [WEEKLY]              │
│  ├── H12: 13F Delta Velocity              [QUARTERLY] ★ ENHANCED│
│  ├── H13: Tariff/Trade Monitor            [DAILY]               │
│  └── H14: Position News Aggregator        [DAILY]               │
├─────────────────────────────────────────────────────────────────┤
│  POSITIONING TIER (H15) ★★ NEW                                  │
│  └── H15: Crowding/Concentration Monitor  [WEEKLY]              │
└─────────────────────────────────────────────────────────────────┘

★ ENHANCED = Upgraded in v8.0  |  ★★ NEW = Added in v8.0
```

---

## INTELLIGENCE TIER (H1-H6)

### H1: ELITE INVESTOR TRACKING
**Frequency:** Daily  
**Purpose:** Track positioning changes of proven investors  

**Tracked Investors:**
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

**Data Sources:**
- 13F Filings: Quarterly, 45-day lag
- 13D/13G Filings: >5% positions, within 10 days
- Form 4: Insider transactions, within 2 business days
- Public statements/letters

**Alert Triggers:**
| Event | Alert Level |
|-------|-------------|
| New position initiated | HIGH |
| Position increased >25% | MEDIUM |
| Position decreased >25% | MEDIUM |
| Position exited | HIGH |

**Attribution:** Methodology inspired by WhaleWisdom and Dataroma elite tracking.

---

### H2a: LEGISLATIVE CATALYST
**Frequency:** Daily  
**Purpose:** Track congressional activity affecting portfolio sectors  

**Monitoring Targets:**
- Bill introductions and co-sponsors
- Committee hearing schedules
- Floor vote calendars
- Budget/appropriations progress
- Confirmation hearings

**Data Sources:**
- Congress.gov
- GovTrack.us
- Committee calendars

**Attribution:** Framework derived from Strategas policy research methodology.

---

### H2b: REGULATORY/EXECUTIVE
**Frequency:** Daily  
**Purpose:** Track executive and regulatory actions  

**Monitoring Targets:**
- Executive orders
- Agency rule-making (proposed and final)
- Enforcement actions
- Guidance documents

**Key Agencies:**
| Sector | Agencies |
|--------|----------|
| Defense | DOD, Armed Services |
| Energy | DOE, FERC, EPA, NRC |
| Healthcare | FDA, CMS, HHS |
| Finance | SEC, Fed, CFTC, Treasury |
| Tech | FTC, DOJ Antitrust |
| Mining | BLM, EPA, USFS |

**Data Sources:**
- Federal Register
- Agency newsrooms
- WhiteHouse.gov

**Attribution:** Data sourced from Federal Register and agency press releases.

---

### H3: SECTOR MOMENTUM SCANNER
**Frequency:** Weekly  
**Purpose:** Identify sector rotation opportunities  

**Sectors Tracked:**
- XLF, XLK, XLE, XLV, XLI, XLY, XLP, XLU, XLB, XLRE, XLC
- GDX, SLV, USO (commodities)

**Metrics:**
| Metric | Calculation |
|--------|-------------|
| RS 1-Week | Sector return / SPY return |
| RS 1-Month | Same, 1-month |
| RS 3-Month | Same, 3-month |
| Fund Flow | ETF inflows/outflows |
| Breadth | % stocks > 50MA |

**Rotation Signals:**
- RS Breakout: RS > 1.1 after < 0.95
- Flow Reversal: 3 consecutive weeks opposite
- Breadth Divergence: Price up, breadth down

**Attribution:** Based on Fidelity sector rotation model and Relative Rotation Graphs.

---

### H4: INSIDER CLUSTER DETECTION
**Frequency:** Daily  
**Purpose:** Identify meaningful insider buying patterns  

**Cluster Definition:**
- 3+ different insiders buying within 14 days
- Single purchase > $500K
- CEO/CFO buying any amount

**Quality Filters (Exclude):**
- Option exercises (Form 4 code M)
- 10b5-1 plan transactions
- Gift transactions

**Weighting:**
| Role | Weight |
|------|--------|
| CEO | 3.0 |
| CFO | 2.5 |
| COO/President | 2.0 |
| Director | 1.5 |
| VP | 1.0 |

**Cluster Score:** `CS = Σ(Role_Weight × Size_Weight × Value) / 100,000`

**Attribution:** Inspired by InsiderScore methodology and academic research on insider alpha.

---

### H5: OVERSOLD QUALITY SCREEN
**Frequency:** Daily  
**Purpose:** Find quality companies at distressed prices  

**Technical Oversold:**
- RSI(14) < 30, OR
- Price > 30% below 52-week high, OR
- Price < lower Bollinger Band (2 std)

**Quality Filters:**
- Profitable (TTM EPS > 0)
- Debt/Equity < 1.0
- Current Ratio > 1.5
- Interest Coverage > 3.0
- Market cap > $500M

**Quality Score:** `QS = (Profitability × 0.3) + (Balance Sheet × 0.3) + (Momentum × 0.2) + (Catalyst × 0.2)`

**Attribution:** Combines O'Shaughnessy quality factors with technical oversold conditions.

---

### H6: CONTRACT PIPELINE TRACKER
**Frequency:** Weekly  
**Purpose:** Track government contract opportunities  

**Data Sources:**
- SAM.gov (Federal contracts)
- USASpending.gov
- DoD contracts database
- State procurement portals

**Tracking Fields:**
- Contract value
- Award timeline
- Incumbent vs competitive
- Company pipeline coverage

**Alert Triggers:**
| Event | Alert |
|-------|-------|
| New opportunity > $100M | IMMEDIATE |
| Award within 30 days | HIGH |
| Tracked company wins | IMMEDIATE |

**Attribution:** Data sourced from USASpending.gov, DoD contracts database, and SAM.gov.

---

## EVENT & FLOW TIER (H7-H10)

### H7: EARNINGS CATALYST CALENDAR
**Frequency:** Daily  
**Purpose:** Identify pre-earnings momentum setups  

**Tracking Elements:**
- Upcoming earnings dates
- Historical beat/miss patterns
- Whisper numbers vs consensus
- Pre-earnings drift signals
- Options implied volatility

**Signals:**
- Positive drift + high whisper = bullish setup
- Negative drift + low whisper = bearish setup
- IV crush opportunities post-earnings

**Attribution:** Methodology based on academic earnings drift research and Estimize crowdsourced estimates.

---

### H8: UNUSUAL OPTIONS FLOW ★ ENHANCED in v8.0
**Frequency:** Daily  
**Purpose:** Detect unusual options activity indicating informed trading  

**v8.0 Enhancements:**
- Sweep vs block classification
- Multi-exchange detection
- Urgency scoring
- Flow sentiment aggregation

**Unusual Activity Criteria:**
| Metric | Threshold | Classification |
|--------|-----------|---------------|
| Volume vs Avg | > 2x | Unusual |
| Volume vs Avg | > 5x | Highly Unusual |
| Volume vs OI | > 1.0 | New positioning |
| Premium | > $100K | Significant |
| Premium | > $1M | Institutional |

**Pattern Recognition:**
| Pattern | Structure | Interpretation |
|---------|-----------|---------------|
| Call Sweep | Multi-exchange, near-term, OTM | Bullish urgency |
| Put Sweep | Multi-exchange, near-term, OTM | Bearish urgency |
| Call Block | Single exchange, large | Institutional accumulation |
| Put Block | Single exchange, large | Institutional hedging |

**Flow Sentiment Score:**
`FSS = Σ(Call_Premium - Put_Premium) / Total_Premium`

| FSS | Interpretation |
|-----|---------------|
| > 0.5 | Strongly Bullish |
| 0.2 to 0.5 | Bullish |
| -0.2 to 0.2 | Neutral |
| -0.5 to -0.2 | Bearish |
| < -0.5 | Strongly Bearish |

**Output Format:**
```yaml
h8_alert:
  ticker: string
  activity_type: SWEEP | BLOCK | UNUSUAL_VOLUME
  direction: CALL | PUT | BOTH
  strike: float
  expiry: ISO-8601
  volume: int
  premium: float
  sentiment_signal: BULLISH | BEARISH | NEUTRAL
  urgency: HIGH | MEDIUM | LOW
```

**Attribution:** Framework inspired by OptionSonar and Unusual Whales methodologies.

---

### H9: SHORT INTEREST DYNAMICS ★ ENHANCED in v8.0
**Frequency:** Daily (bi-weekly official data)  
**Purpose:** Track short interest changes and squeeze potential  

**v8.0 Enhancements:**
- Squeeze Probability Score (SPS)
- Cost to borrow tracking
- Utilization monitoring
- Change velocity alerts

**Key Metrics:**
| Metric | Definition |
|--------|------------|
| SI % | Short shares / Float |
| Days to Cover | Short shares / Avg Volume |
| Cost to Borrow | Annualized rate |
| Utilization | Shorted / Available |

**Threshold Alerts:**
| Metric | Level | Alert |
|--------|-------|-------|
| SI % | > 20% | HIGH |
| SI % | > 40% | EXTREME |
| Days to Cover | > 5 | HIGH |
| Days to Cover | > 10 | EXTREME |
| Cost to Borrow | > 20% | HIGH |
| Cost to Borrow | > 50% | EXTREME |
| Utilization | > 90% | EXTREME |

**Squeeze Probability Score:**
`SPS = (SI_norm × 0.25) + (DTC_norm × 0.25) + (CTB_norm × 0.25) + (Util_norm × 0.25)`

| SPS | Interpretation |
|-----|---------------|
| 0-0.3 | Low squeeze potential |
| 0.3-0.5 | Moderate |
| 0.5-0.7 | High |
| 0.7-1.0 | Extreme |

**Change Alerts:**
- SI +20% in 2 weeks = Bearish acceleration
- SI -20% in 2 weeks = Covering activity
- CTB +50% in 1 week = Supply tightening

**Attribution:** Data from S3 Partners and ORTEX short interest analytics.

---

### H10: IPO/SPAC PIPELINE
**Frequency:** Weekly  
**Purpose:** Track new issues and lockup expirations  

**Monitoring:**
- Upcoming IPOs
- SPAC merger timelines
- Direct listings
- Lockup expiration dates

**Signals:**
- IPO pricing vs range
- First-day pop patterns
- Lockup release selling pressure
- SPAC redemption rates

**Attribution:** Based on Renaissance Capital IPO research and SpacResearch.com data.

---

## MACRO & INSTITUTIONAL TIER (H11-H14)

### H11: MACRO EVENT CALENDAR
**Frequency:** Weekly  
**Purpose:** Track major economic events  

**Key Events:**
- FOMC meetings and minutes
- CPI, PPI releases
- GDP reports
- NFP/employment data
- Central bank speeches (global)

**Impact Windows:**
- Pre-event positioning (T-3 to T-1)
- Event reaction (T to T+1)
- Digestion period (T+2 to T+5)

**Attribution:** Framework based on CME FedWatch and economic calendar research.

---

### H12: 13F DELTA VELOCITY ★ ENHANCED in v8.0
**Frequency:** Quarterly (with daily new filing alerts)  
**Purpose:** Analyze rate of change in institutional positioning  

**v8.0 Enhancements:**
- Delta velocity calculation (rate of change)
- Smart money weighting (H1 investors 2x)
- Category-level aggregation
- Herding detection

**Delta Calculations:**
```
Share_Delta = (Current - Prior) / Prior
Dollar_Delta = Current_Value - Prior_Value
Velocity = Annualized_Delta
```

**Aggregation Levels:**
1. Individual fund
2. Fund category (HF, MF, Pension, Sovereign)
3. Aggregate institutional

**Velocity Classification:**
| QoQ Change | Classification |
|------------|---------------|
| > +50% | Aggressive Accumulation |
| +25% to +50% | Strong Accumulation |
| +10% to +25% | Moderate Accumulation |
| -10% to +10% | Stable |
| -25% to -10% | Moderate Distribution |
| < -25% | Strong Distribution |

**Smart Money Velocity:**
H1 tracked investors weighted 2x in aggregate calculations.

**Attribution:** Methodology inspired by Goldman Sachs VIP list and hedge fund holdings research.

---

### H13: TARIFF/TRADE MONITOR
**Frequency:** Daily  
**Purpose:** Track trade policy affecting commodities/materials  

**Search Patterns:**
- "[commodity] tariff 2026"
- "[country] export ban"
- "trade war [sector]"
- "sanctions [commodity]"

**Outputs:**
- Policy changes
- Implementation dates
- Affected commodities
- Impact assessment

**Attribution:** Data sourced from USTR, Commerce Department, and trade policy news.

---

### H14: POSITION NEWS AGGREGATOR
**Frequency:** Daily  
**Purpose:** E*TRADE-style news feed by held ticker  

**When user provides portfolio/watchlist:**
- Pull news for EACH ticker (7 days)
- Flag analyst upgrades/downgrades
- Note unusual options activity
- Highlight price target changes
- Mark earnings dates

**Output:** Consolidated position-by-position brief

**Attribution:** Inspired by E*TRADE MarketWatch integration and Bloomberg terminal news feeds.

---

## POSITIONING TIER (H15) ★★ NEW in v8.0

### H15: CROWDING/CONCENTRATION MONITOR
**Frequency:** Weekly  
**Purpose:** Monitor positioning concentration and crowding risk  

**Concentration Metrics:**
```yaml
concentration:
  top_10_ownership_pct: float
  hhi_index: float  # Herfindahl-Hirschman
  hedge_fund_ownership_pct: float
  etf_ownership_pct: float
  retail_estimate_pct: float
```

**Ownership Concentration:**
| HHI | Interpretation |
|-----|---------------|
| < 1000 | Unconcentrated |
| 1000-1800 | Moderate |
| 1800-2500 | High |
| > 2500 | Very High |

**Hedge Fund Hotel Detection:**
- Count HFs with > 2% ownership
- If > 5 HFs qualify → HOTEL FLAG
- Similar entry timing → HERDING FLAG

**ETF Crowding:**
| ETF % | Risk |
|-------|------|
| < 10% | Low |
| 10-20% | Moderate |
| > 20% | High (rebalance risk) |

**Retail Crowding Indicators:**
- Reddit mention velocity (WSB, stocks)
- StockTwits sentiment/volume
- Retail options flow percentage

**Crowding Score:**
`CS = (Inst_Conc × 0.30) + (HF_Hotel × 0.25) + (Retail × 0.20) + (SI_Factor × 0.25)`

| Score | Risk Level | Max Size |
|-------|------------|----------|
| 0-0.3 | LOW | CONVICTION |
| 0.3-0.5 | MODERATE | STANDARD |
| 0.5-0.7 | HIGH | NIBBLE |
| 0.7-0.85 | VERY HIGH | NIBBLE × 0.5 |
| > 0.85 | EXTREME | AVOID |

**Output Format:**
```yaml
h15_monitor:
  ticker: string
  analysis_date: ISO-8601
  top_10_pct: float
  hhi: float
  hf_hotel_flag: boolean
  etf_ownership_pct: float
  crowding_score: float
  risk_level: string
  recommendation: string
```

**Attribution:** Based on institutional herding research and positioning analytics.

---

## HUNTER SCAN EXECUTION

### Daily Scan Sequence
```
06:00 ET - H1: Elite Investor (overnight filings)
06:30 ET - H2a/H2b: Political/Regulatory (calendar update)
07:00 ET - H4: Insider Cluster (Form 4 filings)
07:30 ET - H5: Oversold Quality (pre-market)
08:00 ET - H7: Earnings Calendar (upcoming)
08:30 ET - H8: Options Flow (prior day unusual)
09:00 ET - H9: Short Interest (estimates + bi-weekly data)
09:30 ET - H13: Tariff/Trade (overnight developments)
10:00 ET - H14: Position News (portfolio scan)
```

### Weekly Scan Sequence (Sunday)
```
H3: Sector Momentum (weekly close data)
H6: Contract Pipeline (SAM.gov update)
H10: IPO/SPAC Pipeline (upcoming week)
H11: Macro Event Calendar (week ahead)
H15: Crowding Monitor (13F aggregation)
```

### Quarterly Scan (13F Season)
```
H12: 13F Delta Velocity (new filings)
H1: Elite Investor (deep update)
H15: Crowding Monitor (full refresh)
```

---

## HUNTER INTEGRATION WITH METATRON

### Gate 11 Requirements
All 15 HUNTER modules must complete scan before Gate 11 passes.

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

**Example:** H1 (Sprott buying) + H8 (call sweeps) + H9 (SI declining) + H15 (low crowding) = CRITICAL BUY ALERT

---

## VERSION HISTORY

| Version | Modules | Changes |
|---------|---------|---------|
| v1.0 | H1-H6 | Initial release |
| v1.5 | H1-H12 | Added event & macro tiers |
| v1.7 | H1-H14 | Added H13 Tariff, H14 Position News |
| **v2.0** | **H1-H15** | **Enhanced H8/H9/H12, Added H15 Crowding** |

---

**END HUNTER v2.0 PROTOCOL**

🔱
