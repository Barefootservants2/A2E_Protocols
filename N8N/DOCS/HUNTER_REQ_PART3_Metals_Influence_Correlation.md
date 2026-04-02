# HUNTER v3.3 — REQUIREMENTS PART 3 of 5
# METALS PIPELINE (H29-H36) + MACRO CORRELATION (H37-H42) + GATE 9
# Ashes2Echoes LLC | METATRON v10.8 | For: n8n Build AI
---

## CONTEXT

Parts 1-2 covered market discovery and technical/intelligence modules.
Part 3 covers the DIFFERENTIATED LAYER — the data no one else correlates —
and the Gate 9 correlation check that protects the metals thesis.

THIS IS THE COMPETITIVE EDGE. H30-H35 correlates money flows that move markets
before the price moves. Most retail traders never see this data.

---

## H29-H36 — METALS & INFLUENCE PIPELINE

### H29 — Metals Spot Prices
SOURCE: metals.dev
ENDPOINT: https://api.metals.dev/v1/latest?api_key={$vars.METALS_DEV_KEY}&currency=USD&unit=toz
CREDENTIAL: $vars.METALS_DEV_KEY (CONFIRMED VALID — returns live data)
OUTPUT: {module:"H29", signal_type:"METALS_SPOT", signals:[{metal, price, change_pct}],
  gold, silver, platinum, palladium, lbma_gold, error}
CURRENT PRICES (April 2): Silver $70.29 | Gold $4,586 | Platinum $1,896
RING 2 THESIS: Silver structural bull — deficit supply, Shanghai physical demand
STATUS: CONFIRMED WORKING

ENHANCEMENT — ADD THESE FIELDS TO H29 OUTPUT:
- shanghai_premium: SGE silver price minus COMEX silver price (physical demand indicator)
  When > $5/oz = strong physical buying pressure from China
  Source: requires calculation from separate SGE price endpoint
- gold_silver_ratio: gold_price / silver_price
  GSR > 80 = silver historically undervalued vs gold (buy signal for silver thesis)
  GSR < 60 = silver has run, consider trimming
  Current: ~65 (silver slightly undervalued)

### H30 — Congressional Trades (Unusual Whales)
SOURCE: Unusual Whales API (replaces Finnhub lobbying)
ENDPOINT: https://api.unusualwhales.com/api/congress/recent-trades
CREDENTIAL: $vars.UNUSUAL_WHALES_API_KEY (UW trial active, 7 days from April 2)
OUTPUT: {module:"H30", signal_type:"CONGRESSIONAL_TRADE",
  signals:[{member, ticker, action:"Buy|Sell", amount, date, chamber:"house|senate",
  filing_delay_days, stock_act_flag}], count, error}
SIGNAL WEIGHT: House Buy > $100K = HIGH | Senate Buy any amount = HIGH (longer advance info)
STOCK ACT FLAG: Trades filed > 45 days late = stock_act_flag:true = compliance violation = news risk
STATUS: CONFIRMED WORKING (live data returning)

### H31a — Congress Bills (Detail)
SOURCE: Congress.gov
ENDPOINT: https://api.congress.gov/v3/bill?congress=119&limit=20
CREDENTIAL: $vars.CONGRESS_API_KEY
OUTPUT: {module:"H31", signal_type:"CONGRESS_BILL_DETAIL",
  signals:[{bill_id, title, sponsor, committees, latest_action, sector}], error}

### H31b — Congressional Amendments
SOURCE: Congress.gov
ENDPOINT: https://api.congress.gov/v3/amendment?congress=119&limit=20
CREDENTIAL: $vars.CONGRESS_API_KEY
OUTPUT: Same schema as H31a
NOTE: H31a + H31b merge via H31 Committee Merge node (merge type: append)

### H32 — LDA Lobbying Registrations
SOURCE: Senate LDA (Lobbying Disclosure Act)
ENDPOINT: https://lda.senate.gov/api/v1/filings/
CREDENTIAL: none (public API)
OUTPUT: {module:"H32", signal_type:"LOBBYING", signals:[{registrant, client, issue_codes,
  amount, period}], error}
SIGNAL: Client suddenly appears in lobbying filings before legislation passes = informed bet
HIGH VALUE: Defense contractors lobbying on AI/cyber bills. Energy companies on LNG export.

### H33 — Federal Contract Awards (USASpending)
SOURCE: USASpending.gov
ENDPOINT: https://api.usaspending.gov/api/v2/search/spending_by_award/
CREDENTIAL: none (public)
OUTPUT: {module:"H33", signal_type:"FEDERAL_CONTRACT",
  signals:[{recipient, amount, naics_code, description, date, awarding_agency}], error}
SIGNAL: Large contract to publicly traded company = direct revenue catalyst
RING 3 RELEVANCE: Defense AI contracts (PLTR, RKLB, Anduril), metals infrastructure
ENHANCEMENT: Add SBIR Phase II awards — 12-18 month leading indicator for commercial revenue

### H34 — FEC Campaign Finance
SOURCE: Federal Election Commission
ENDPOINT: https://api.open.fec.gov/v1/schedules/schedule_a/
CREDENTIAL: $vars.FEC_API_KEY
OUTPUT: {module:"H34", signal_type:"CAMPAIGN_FINANCE",
  signals:[{committee, candidate, amount, contributor, date}], total_cycle, error}
SIGNAL: Industry PAC money → specific candidate → that candidate sponsors related legislation
Maps money: Industry → PAC → Candidate → Bill → Stock

### H35 — Influence Correlator (Code node — CORE DIFFERENTIATOR)
INPUT: All outputs from H30, H31, H32, H33, H34 via Influence Merge
FUNCTION: Correlates ALL influence data streams against same ticker
CURRENT OUTPUT: {module:"H35", correlations:[{ticker, convergence_score, signals_count,
  sources:[H30,H31,H32,H33,H34]}], error}

ENHANCEMENT NEEDED — WEIGHTED CONVERGENCE SCORE (0-100):
  score = (
    congressional_trade_weight (30%) +    // Buy > $100K = +30
    lobbying_spend_weight (25%) +          // Spend > $500K = +25
    bill_progress_weight (20%) +           // Committee vote = +20
    contract_award_weight (15%) +          // Award > $10M = +15
    fec_flow_weight (10%)                  // PAC contribution match = +10
  )
  Score > 70 = PRIME influence signal regardless of technical setup
  Score > 50 = STRONG signal, add to agent consideration set
  Score < 30 = low convergence, routine mention only

### H36 — Recent LDA Filings
SOURCE: Senate LDA
ENDPOINT: https://lda.senate.gov/api/v1/contributions/
OUTPUT: {module:"H36", signal_type:"LOBBYING_RECENT",
  signals:[{registrant, client, amount, period, issues}], error}
PURPOSE: Near-real-time (<30 days) lobbying activity. Supplements H32.

---

## H37-H42 — MACRO & METALS CORRELATION (Gate 9 Inputs)

### H37 — FRED DXY (Dollar Index)
SOURCE: FRED St. Louis Fed
ENDPOINT: https://api.stlouisfed.org/fred/series/observations?series_id=DTWEXBGS
CREDENTIAL: $vars.FRED_API_KEY
OUTPUT: → H37-CALC DXY code node → {dxy_value, dxy_change, dxy_regime:"BULL|BEAR|NEUTRAL"}
GATE 9 INPUT: DXY rising = dollar strengthening = headwind for metals and commodities
STATUS: CONFIRMED WORKING

### H38 — FRED 10Y Treasury Yield
SOURCE: FRED
ENDPOINT: https://api.stlouisfed.org/fred/series/observations?series_id=DGS10
CREDENTIAL: $vars.FRED_API_KEY
OUTPUT: → H38-CALC Yield → {yield_10y, yield_change, yield_regime:"RISING|FALLING|FLAT"}
GATE 9 INPUT: Yields rising rapidly = risk-off pressure on growth stocks and metals
STATUS: CONFIRMED WORKING

### H39a/b/c — Metals ETF Flow (SLV, GLD, SIL)
SOURCE: Finnhub
ENDPOINT: https://finnhub.io/api/v1/stock/candle?symbol=[SLV|GLD|SIL]&resolution=D
CREDENTIAL: Finnhub API (ID: ZsRtqMO5tofoPRmJ)
OUTPUT: → H39 ETF Merge → H39-CALC Flow → {slv_flow, gld_flow, sil_flow,
  metals_flow_composite, flow_regime:"INFLOW|OUTFLOW|NEUTRAL"}
SIGNAL: SIL (miners) leading SLV (physical) = institutional accumulation before retail
STATUS: CONFIRMED WORKING

### H40 — GEX Options (Gamma Exposure)
SOURCE: Barchart (BLOCKED — cloud IP blocked by Barchart)
ENDPOINT: https://api.barchart.com/v2/options/chain/getChain
STATUS: ❌ BLOCKED — requires dedicated IP or proxy

REPLACEMENT REQUIRED:
Use Unusual Whales options flow endpoint (already have trial access):
NEW ENDPOINT: https://api.unusualwhales.com/api/options/unusual-activity
CREDENTIAL: $vars.UNUSUAL_WHALES_API_KEY
OUTPUT: {module:"H40", signal_type:"UNUSUAL_OPTIONS",
  signals:[{ticker, strike, expiry, type, volume, oi, vol_oi_ratio, premium, sentiment}], error}
SIGNAL: vol/OI ratio > 5.0 = unusual activity. Large call sweep above ask = bullish bet.
GAMMA NOTE: While not raw GEX, unusual options flow is MORE actionable than GEX for retail

### H41 — FRED Gold Series
SOURCE: FRED
ENDPOINT: https://api.stlouisfed.org/fred/series/observations?series_id=GOLDAMGBD228NLBM
CREDENTIAL: $vars.FRED_API_KEY
OUTPUT: {module:"H41", signal_type:"GOLD_HISTORICAL", series:[{date, value}], error}
PURPOSE: Historical gold correlation. Validates gold/silver ratio trend.

### H42 — COMEX Silver Inventory
SOURCE: metalcharts.org (NEEDS VERIFICATION)
ENDPOINT: https://www.metalcharts.org/api/comex/silver/inventory
OUTPUT: {module:"H42", signal_type:"COMEX_INVENTORY", inventory_level, trend, days_since_change, error}
SIGNAL: Falling COMEX inventory = physical delivery demand > paper supply = price support
BACKUP ENDPOINT: CME Group warehouse stocks report (daily 3:30PM ET, free public data)
STATUS: ⚠️ VERIFY — metalcharts.org reliability uncertain

---

## GATE 9 — CORRELATION CHECK (Kill Switch Guardian)

INPUT: H37 (DXY), H38 (Yield), H39 (Metals Flow) via Correlation Signal Merge
LOGIC:
  IF dxy_regime == "BULL" AND yield_regime == "RISING":
    kill_switch = TRUE
    condition = "DXY rising + Yields rising = adverse metals correlation"
  ELSE:
    kill_switch = FALSE

KILL SWITCH PROTOCOL (IRONCLAD v2.1 — NO OVERRIDE):
  1. Auto 50% reduction in all metals positions (PSLV, PHYS, AG, SLV, SIL, HYMC)
  2. 48-hour embargo on new metals entries
  3. Telegram alert to Principal immediately
  4. Log to GitHub for audit trail

KILL SWITCH TELEGRAM BUG — CURRENTLY BROKEN:
The Kill Switch Alert node is outputting raw JavaScript template string instead of
rendered message. The node text field contains JS concatenation code, not an expression.

FIX REQUIRED: Kill Switch Alert (Telegram node) text field should be:
"🚨 KILL SWITCH — GATE 9 ACTIVATED
Condition: {{ $json.condition }}
DXY: {{ $json.h37_regime }} | Yield: {{ $json.h38_regime }} | Flow: {{ $json.h39_flow }}

IRONCLAD AUTO-PROTOCOL:
→ 50% metals reduction required
→ 48hr embargo on metals entries
→ NO OVERRIDE

METATRON v10.8 | HUNTER v3.3"

Use n8n {{ }} expression syntax in the Text field, NOT JavaScript string concatenation.

---

## INFLUENCE PIPELINE DATA FLOW

DATA AGGREGATOR → URIEL/COLOSSUS/HANIEL/RAZIEL → SYNTHESIS → TELEGRAM

H30-H36 → Normalize nodes (code) → Influence Merge → H35 Correlator
H37-H39 → Calc nodes (code) → Correlation Signal Merge → Correlation Full Merge → Gate 9

The H35 Influence Correlator output is fed into DATA AGGREGATOR
alongside all other H-module data.

---

## NEW MODULES TO ADD (Part 3 enhancements)

### H43 — CFTC COT Report (ADD IMMEDIATELY)
SOURCE: CFTC (Commodity Futures Trading Commission)
ENDPOINT: https://www.cftc.gov/dea/futures/deacmesf.htm (weekly CSV)
FREQUENCY: Every Friday 3:30PM ET
OUTPUT: {module:"H43", signal_type:"CFTC_COT",
  signals:[{commodity:"SILVER|GOLD", commercial_net, noncommercial_net, trend}], error}
SIGNAL:
  Commercial (hedgers) cover shorts = major rally imminent (most reliable silver signal)
  Non-commercial (speculators) at extreme long = crowded trade = reversal risk
  Commercial net short extreme = near-term ceiling
COST: FREE. No API key needed.

### H44 — PSLV NAV Premium/Discount (ADD IMMEDIATELY)
SOURCE: Sprott website (scrape or RSS)
ENDPOINT: https://sprott.com/investment-strategies/physical-commodity-funds/silver/
OUTPUT: {module:"H44", signal_type:"PSLV_PREMIUM",
  signals:[{nav, price, premium_pct, trend}], error}
SIGNAL:
  Premium > 3% = strong physical demand exceeding paper silver supply
  Premium < 0% (discount) = weak physical demand, thesis under pressure
COST: FREE. Essential for Ring 2 thesis health check.

---
PART 3 OF 5 COMPLETE. Part 4 covers Agents, Gates, MICHA Synthesis, and output layer.
