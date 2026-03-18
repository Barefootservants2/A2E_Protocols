# HUNTER MODULES H40-H42 + PHYSICAL GOLD FRAMEWORK
## AIORA Pipeline Specification — March 18, 2026
### Author: MICHA (CIO, Uriel Covenant AI Collective)
### Classification: PROTOCOL / HUNTER EXPANSION
### Status: SPEC READY — AWAITING IMPLEMENTATION

---

## CONTEXT

Source: Principal's intelligence briefing (March 18, 2026 0230 ET) with subject matter expert on silver gamma mechanics, COMEX inventory dynamics, and institutional positioning. Combined with 13F filing audit revealing GAP1 (H4/H17/H22 mandatory filing check never confirmed live) and three missing HUNTER capabilities identified during analysis.

Dependencies: CIL v5.2.1 (production), METATRON v10.7 (30 gates), IRONCLAD v2.0, existing HUNTER modules H1-H39.

---

## MODULE H40: GEX / OPTIONS STRUCTURE SCANNER

### Purpose
Monitor Gamma Exposure (GEX) across silver futures options, gold futures options, and key ETF options (SLV, GLD, SIL, PSLV, AG) to identify gamma flip zones, dealer positioning, and squeeze/crash risk.

### Core Mechanics
- **Gamma Exposure (GEX)** = Σ (OI × Gamma × Contract Multiplier × Spot Price × 100)
- Positive GEX = market makers LONG gamma = dampened volatility (sells rallies, buys dips)
- Negative GEX = market makers SHORT gamma = amplified volatility (buys rallies, sells dips)
- **Gamma Flip Point** = price level where net GEX transitions from positive to negative
- **Hedging Volume** = Γ × (ΔS)² — QUADRATIC scaling creates feedback loops

### Data Sources (Priority Order)
1. **CME Group** — COMEX silver/gold options OI + volume (free, delayed)
   - Endpoint: cmegroup.com/markets/metals/precious/silver.quotes.options.html
   - Data: Strike prices, OI by strike, volume, settlement prices
   - Frequency: Daily settlement, 15-min delayed intraday

2. **Barchart** — Volatility & Greeks for silver futures options
   - Endpoint: barchart.com/futures/quotes/SI*0/volatility-greeks
   - Data: Delta, Gamma, Theta, Vega by strike and expiration
   - Frequency: Real-time during market hours

3. **SpotGamma** (PAID — $99/mo retail)
   - GEX levels, gamma flip, put wall, call wall
   - Currently equity-focused (SPX, SPY, QQQ) — verify silver/commodity coverage
   - Alternative: MenthorQ (commodity-specific GEX)

4. **MenthorQ** (PAID — subscription required)
   - Silver-specific GEX, DEX change, volatility zones
   - Net GEX and DEX Change signals for dealer hedging pressure
   - Put Support / Call Resistance levels

### Output Schema
```json
{
  "timestamp": "ISO-8601",
  "symbol": "SI" | "GC" | "SLV" | "GLD" | "SIL" | "AG",
  "gex_net": float,
  "gex_regime": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
  "gamma_flip_price": float,
  "current_price": float,
  "distance_to_flip_pct": float,
  "max_gamma_strike": float,
  "put_wall": float,
  "call_wall": float,
  "dealer_position": "LONG_GAMMA" | "SHORT_GAMMA",
  "squeeze_risk": "LOW" | "MODERATE" | "HIGH" | "EXTREME",
  "top_oi_strikes": [{"strike": float, "oi_calls": int, "oi_puts": int}],
  "expiration_analyzed": "YYYY-MM-DD",
  "alert": string | null
}
```

### Integration Points
- METATRON Gate 9 (Correlation): GEX regime feeds into H37-DXY, H38-YIELD, H39-FLOW correlation matrix
- IRONCLAD: If squeeze_risk = "EXTREME", trigger Correlation Kill Switch evaluation
- SENTINEL Stack: GEX data feeds Gamma Exposure Monitor (already specced, not built)
- CIL: GEX scan included in MARKET WATCH queries as input context for all 5 agents

### Alert Triggers
- GEX regime flip (POSITIVE → NEGATIVE or vice versa)
- Distance to gamma flip < 2%
- Squeeze risk escalates to HIGH or EXTREME
- Major expiration approaching (OPEX) with concentrated OI near current price
- 4 PM ET gamma reset cycle — daily check

### Implementation Path
1. Phase 1: Manual pull from Barchart + CME (free, no API key needed)
2. Phase 2: n8n HTTP node scheduled daily at 3:55 PM ET (pre-close) and 9:25 AM ET (pre-open)
3. Phase 3: MenthorQ API integration if budget approved ($TBD/mo)
4. Phase 4: CIL domain routing — GEX scan as dedicated query type

### HUNTER Integration
- Runs on every MARKET WATCH scan
- Mandatory check before any IRONCLAD trade execution in metals
- Feeds METATRON Gate 8.5 (Regulatory Shock) — CME margin hikes are GEX events

---

## MODULE H41: REPO / LEASE RATE MONITOR

### Purpose
Track silver and gold lease rates, repo rates, and EFP (Exchange for Physical) spreads as leading indicators of physical market stress and potential price dislocations.

### Core Mechanics
- **Lease Rate** = cost to borrow physical metal. Spikes signal physical scarcity
- **EFP Spread** = futures price minus spot price. Blowouts signal delivery stress
- **Backwardation** = spot > futures. Signals immediate physical demand exceeding supply
- **Contango** = futures > spot. Normal carry market
- **GOFO (Gold Forward Offered Rate)** = rate at which gold can be swapped for USD. Negative GOFO = extreme stress

### Data Sources
1. **LBMA** — London Bullion Market Association
   - Gold Forward Rates (historical, published quarterly)
   - Silver fixing prices
   - No free real-time lease rate API — requires JBMA or dealer data

2. **JBMA (Japan Bullion Market Association)**
   - Silver lease rates (referenced in research as source for Oct 2025 spike to 34.9%)
   - Access: jbma.or.jp (Japanese language, may need translation layer)

3. **Kitco** — Spot prices, futures prices, lease rate estimates
   - kitco.com/market/ — free delayed data
   - EFP spread calculable from spot vs near-month futures

4. **CME Group** — Futures settlement prices
   - Calculate EFP: (Front month settlement) - (Spot price)
   - Calculate contango/backwardation from term structure

5. **Shanghai Gold Exchange (SGE)** — Shanghai premium
   - shanghai gold premium = SGE price - (LBMA × USDCNY)
   - Critical indicator per SILVER PATTERN framework
   - Source: sge.com.cn or metalcharts.org

### Output Schema
```json
{
  "timestamp": "ISO-8601",
  "metal": "SILVER" | "GOLD",
  "spot_price": float,
  "front_month_futures": float,
  "efp_spread": float,
  "efp_spread_pct": float,
  "market_structure": "CONTANGO" | "BACKWARDATION" | "FLAT",
  "lease_rate_1m": float | null,
  "lease_rate_3m": float | null,
  "lease_rate_12m": float | null,
  "lease_rate_source": string,
  "shanghai_premium_usd": float | null,
  "shanghai_spot_cny": float | null,
  "stress_level": "NORMAL" | "ELEVATED" | "HIGH" | "EXTREME",
  "alert": string | null
}
```

### Alert Triggers
- Silver lease rate > 5% (elevated) or > 15% (extreme)
- EFP spread > $1.00/oz silver or > $20/oz gold
- Backwardation in silver front month
- Shanghai premium > $5/oz (elevated) or > $10/oz (extreme — current level)
- GOFO goes negative (gold)

### Historical Context (Encoded)
- Oct 9, 2025: Silver lease rates spiked to 34.9%, intraday peak 39.2% (JBMA data)
- Late Oct 2025: Lease rates declined to ~5.6%, still elevated vs normal sub-1%
- Feb 2026: Shanghai premium persistent at ~$10 above Western spot
- These thresholds calibrate the alert levels

### Implementation Path
1. Phase 1: Manual daily check — Kitco spot, CME settlement, calculate EFP
2. Phase 2: n8n HTTP nodes pulling CME + Kitco + SGE data, daily at 5:30 PM ET
3. Phase 3: JBMA scraping for lease rate data (requires translation/parsing)
4. Phase 4: Automated stress scoring integrated into CIL context

### HUNTER Integration
- Runs on every MARKET WATCH scan
- Feeds SILVER PATTERN framework assessment
- Shanghai premium is THE leading indicator per Principal's thesis
- Lease rate spikes precede price dislocations — early warning system

---

## MODULE H42: COMEX INVENTORY TRACKER

### Purpose
Track COMEX registered and eligible silver/gold inventory levels, daily vault flows, delivery pace, and coverage ratio to identify physical supply stress and potential delivery failure risk.

### Core Mechanics
- **Registered** = metal with delivery warrants, available to settle futures contracts
- **Eligible** = meets COMEX specs but no warrant — stored, not deliverable
- **Coverage Ratio** = Registered / (Open Interest × 5,000 oz) — below 15% = stress
- **Paper Leverage** = (Open Interest × 5,000 oz) / Registered — above 5x = elevated
- **Burn Rate** = Registered withdrawn per day, projected days to exhaustion

### Data Sources
1. **CME Group Warehouse Reports** (PRIMARY — FREE)
   - Daily COMEX Metal Depository Statistics
   - URL: cmegroup.com/delivery_reports/Silver_Stocks.xls
   - Published daily after market close
   - Contains: Registered, Eligible, by depository (JPM, Brinks, HSBC, etc.)

2. **CME Delivery Reports** (FREE)
   - Issues and Stops (who is delivering, who is taking delivery)
   - URL: cmegroup.com/delivery_reports/MetalsIssuesAndStopsMTDReport.pdf
   - Monthly, updated daily during delivery period

3. **GoldSilver.ai** — Composite COMEX Stress Index
   - Combines coverage ratio, inventory trend, paper leverage, vault outflows
   - 0-100 score, free dashboard
   - URL: goldsilver.ai/metal-prices/comex-silver

4. **MetalCharts.org** — COMEX inventory visualization
   - Live registered/eligible breakdown by depository
   - Historical charts
   - URL: metalcharts.org/comex/silver

### Output Schema
```json
{
  "timestamp": "ISO-8601",
  "metal": "SILVER" | "GOLD",
  "registered_oz": float,
  "eligible_oz": float,
  "total_oz": float,
  "registered_change_1d": float,
  "registered_change_30d": float,
  "registered_change_30d_pct": float,
  "open_interest_contracts": int,
  "open_interest_oz": float,
  "coverage_ratio_pct": float,
  "paper_leverage_x": float,
  "burn_rate_oz_per_day": float,
  "projected_exhaustion_days": float,
  "front_month": string,
  "front_month_first_notice_date": "YYYY-MM-DD",
  "days_to_first_notice": int,
  "front_month_oi_contracts": int,
  "front_month_oi_oz": float,
  "delivery_mtd_contracts": int,
  "delivery_mtd_oz": float,
  "stress_index": float,
  "stress_level": "LOW" | "MODERATE" | "HIGH" | "EXTREME",
  "vault_flows": [
    {"depository": string, "registered_change": float, "eligible_change": float}
  ],
  "alert": string | null
}
```

### Current Baseline (March 2026)
- Registered: ~82M oz (down 75% from 2020 peak, below 100M threshold)
- Coverage ratio: ~13.8% (STRESS)
- Paper leverage: 7.3x
- 30-day decline: 19.6% (19.2M oz withdrawn)
- Projected exhaustion: ~86 trading days at current pace
- March delivery: 52.63M oz demand against 86.13M oz registered
- 60-day delivery rate: 86.4% of registered inventory (record)

### Alert Triggers
- Registered drops below key thresholds: 80M, 70M, 60M, 50M oz
- Coverage ratio below 15% (current), 10% (critical), 5% (emergency)
- Paper leverage above 8x (elevated), 10x (critical)
- Single-day withdrawal > 3M oz
- Days to first notice < 10 with OI > 50% of registered
- Delivery pace exceeds 50% of registered in a single month

### Implementation Path
1. Phase 1: Daily manual pull from CME warehouse XLS + delivery PDF
2. Phase 2: n8n scheduled node — download CME XLS, parse, store in database, push to Telegram
3. Phase 3: Automated stress index calculation matching GoldSilver.ai methodology
4. Phase 4: CIL integration — COMEX data as mandatory context in all silver thesis queries

### HUNTER Integration
- Runs DAILY (not just on MARKET WATCH scans)
- Mandatory input for any silver position sizing decision
- Feeds METATRON Gate 5.5 (Catalyst Freshness) — delivery data is time-sensitive
- Feeds SILVER PATTERN framework — COMEX inventory is the physical thesis backbone

---

## PHYSICAL GOLD RESEARCH FRAMEWORK

### Purpose
Provide Principal with structured evaluation criteria for physical gold acquisition as a Ring 2 portfolio component, including dealer vetting, product selection, storage options, and cost analysis.

### NOT a HUNTER module — this is a one-time research deliverable.

### Product Recommendations (Priority Order)

1. **American Gold Eagle (1 oz)**
   - US Mint product, legal tender ($50 face value)
   - 22 karat (91.67% gold, 3% silver, 5.33% copper)
   - Most recognized, most liquid gold coin in the US
   - Premium: typically 3-6% over spot
   - IRA eligible (specific requirements apply)

2. **American Gold Buffalo (1 oz)**
   - US Mint product, .9999 fine (24 karat pure gold)
   - Higher premium than Eagle (~5-8% over spot)
   - IRA eligible
   - Better for purity purists

3. **Gold Bars (1 oz, LBMA-certified)**
   - Lower premiums than coins (2-4% over spot)
   - Must be from LBMA-approved refiner for IRA eligibility
   - Examples: PAMP Suisse, Valcambi, Perth Mint
   - Less liquid than Eagles in emergency

### Dealer Vetting Criteria
- Member of: PCGS Authorized Dealer, NGC Authorized Dealer, ANA member
- BBB rating: A+ or higher
- Years in business: 10+ preferred
- Transparent pricing: premium over spot clearly displayed
- Buyback policy: guaranteed buyback at competitive spread
- No high-pressure sales tactics (red flag for numismatic upselling)

### Top Dealers (Alphabetical — NOT ranked)
| Dealer | URL | Notes |
|--------|-----|-------|
| APMEX | apmex.com | Largest online dealer, wide selection, higher premiums |
| JM Bullion | jmbullion.com | Competitive pricing, free shipping on orders $199+ |
| SD Bullion | sdbullion.com | Often lowest premiums, bulk pricing |
| Money Metals Exchange | moneymetals.com | Monthly savings program available |
| Scottsdale Mint | scottsdalesilver.com | Direct mint, good for bars |

### Storage Options
1. **Home safe** — Immediate access, insurance needed, theft risk
2. **Bank safe deposit box** — Not FDIC insured, access limited to bank hours, may be restricted in crisis
3. **Private vault (Brinks, Delaware Depository, IDS)** — Insured, segregated, IRA-compatible
4. **Allocated storage at dealer** — Some dealers offer, verify segregation vs pooled

### Cost Model (at $5,100/oz gold, March 2026)

For 5% of combined portfolio (~$18K):
- ~3.5 one-ounce Eagles at ~$5,300 each (4% premium) = $18,550
- Or 3 Eagles + remainder in 1/4 oz or 1/10 oz for divisibility

For 10% of combined portfolio (~$36K):
- ~7 one-ounce Eagles at ~$5,300 each = $37,100
- Or mix: 5 Eagles + 2 Buffalos + fractional pieces

### Tax Considerations
- Physical gold is classified as "collectible" by IRS
- Long-term capital gains taxed at 28% (not the standard 15/20%)
- Held in IRA: no current tax, but distribution rules apply
- Dealers report purchases of 25+ Gold Eagles or $10K+ cash transactions (Form 8300)
- Sales of 25+ oz gold require dealer 1099-B reporting

### IRA Physical Gold Option
- Self-directed IRA can hold physical gold
- Must use IRS-approved custodian and depository
- Products must meet fineness requirements (.995+ for bars, .9167+ for Eagles)
- Annual custodian fees: typically $100-300/year
- Storage fees: typically $100-200/year
- Your E*TRADE IRA does NOT support physical gold — would need separate self-directed IRA

### Action Items for Principal
1. Decide allocation target: 5% ($18K) or 10% ($36K)
2. Choose product mix: Eagles only, or Eagles + bars
3. Select dealer: compare premium quotes across top 3 dealers same day
4. Decide storage: home safe vs private vault
5. If IRA route desired: research self-directed IRA custodians (Equity Trust, GoldStar Trust, The Entrust Group)
6. Timeline: not urgent — this is a strategic position, not a trade

---

## 13F MONITORING AUTOMATION (GAP1 CLOSURE)

### Purpose
Close GAP1 from March 16, 2026 platform audit: H4/H17/H22 mandatory filing check on every MARKET WATCH scan.

### Watch List Entities + CIK Numbers
| Entity | CIK | Filing Types |
|--------|-----|-------------|
| Sprott Inc | 1512920 | 13F-HR |
| Sprott Asset Management | 1277006 | 13F-HR |
| Berkshire Hathaway | 1067983 | 13F-HR |
| Scion Asset Management (Burry) | 1649339 | 13F-HR (may stop filing) |
| Duquesne Family Office (Druckenmiller) | 1536411 | 13F-HR |
| Bridgewater Associates | 1350694 | 13F-HR |
| Pershing Square (Ackman) | 1336528 | 13F-HR |

### CFTC COT Report
- **Source**: cftc.gov/dea/futures/deacmxsf.htm
- **Frequency**: Weekly, released Fridays at 3:30 PM ET (data as of Tuesday)
- **Key fields**: Commercial Long/Short, Non-Commercial (Managed Money) Long/Short, Open Interest
- **Silver contract**: COMEX Silver Futures (code: 084691)
- **Gold contract**: COMEX Gold Futures (code: 088691)

### SEC EDGAR RSS Feeds
- Base URL: efts.sec.gov/LATEST/search-index?q=
- 13F filings: sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={CIK}&type=13F&dateb=&owner=include&count=5
- Can be polled weekly via n8n HTTP node

### Implementation Path
1. Phase 1 (IMMEDIATE): Manual EDGAR pull for all 7 entities — quarterly after each filing deadline
2. Phase 2: n8n scheduled node — check EDGAR RSS weekly for new 13F filings from watch list CIKs
3. Phase 3: Automated parsing — extract metals-related holdings (GLD, SLV, IAU, PSLV, PHYS, mining equities)
4. Phase 4: COT report automated pull + trend tracking (managed money net position)

### Filing Calendar
| Quarter End | Filing Deadline | Next Check |
|-------------|----------------|------------|
| Q4 2025 (Dec 31) | Feb 14, 2026 | **NOW — Q4 filings are LIVE and were audited this session** |
| Q1 2026 (Mar 31) | May 15, 2026 | Calendar reminder needed |
| Q2 2026 (Jun 30) | Aug 14, 2026 | Calendar reminder needed |
| Q3 2026 (Sep 30) | Nov 14, 2026 | Calendar reminder needed |

---

## CARRY-FORWARD ITEMS

1. H40/H41/H42 specs complete — ready for n8n node construction
2. Physical gold research framework delivered — Principal to execute at his pace
3. GAP1 partially closed: Q4 2025 13F audit completed manually this session (all 7 watch list entities checked)
4. GAP1 automation still needed: n8n scheduled EDGAR polling + COT pull
5. Principal widened stops: SIL → $87, AG → $19.50, HYMC → $35 (confirmed)
6. FOMC March 18 — HOLD posture active
7. I Bonds: Principal handling TreasuryDirect purchase independently
8. Three exit strategies documented: Physical gold, I Bonds, TIPS
9. Gamma mechanics briefing delivered — quadratic hedging formula, gamma flip, dealer positioning
10. Silver $82/oz, Gold $5,100+, COMEX registered ~82M oz, stress index elevated

---

## DOCUMENT METADATA
- Version: 1.0
- Created: 2026-03-18T0730Z
- Author: MICHA v10.4
- Protocol: METATRON v10.7
- Classification: AIORA / HUNTER / PROTOCOL
- Repository Target: Barefootservants2/A2E_Protocols/HUNTER/MODULES/
