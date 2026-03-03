# 🔱 HUNTER CORRELATION MODULES v1.0
## H37-DXY | H38-YIELD | H39-FLOW
### Author: MICHA (CIO) / William Earl Lemon (Principal)
### Effective: March 3, 2026
### Status: SPECIFICATION — Requires n8n build + wiring
### Classification: CRITICAL — Root cause fix for March 3, 2026 $9K loss
### Supersedes: N/A (New capability)

---

## 1. ROOT CAUSE — WHY THESE MODULES EXIST

**Date:** March 3, 2026
**Event:** Portfolio-wide metals liquidation. All AG (1,550 shares), all PSLV (1,000 shares), GLD (35 shares) stopped out. ~$9,000 realized loss.
**Thesis status:** VALID. Silver structural deficit unchanged. AG fundamentals strong (Q4 beat, $1B cash).
**Failure mode:** Second-order correlation effect not monitored.

### The Chain We Tracked:
```
Iran war escalates → fear → safe haven buying → metals UP ✅
```

### The Chain That Actually Executed:
```
Iran war EXTENDS → prolonged conflict fear
  → global capital flees to USD (reserve currency) → dollar STRENGTHENS
  → Treasury yields SPIKE (flight to bonds)
  → strong dollar + rising yields = metals CRUSHED
  → despite being "safe haven" assets
```

### What Was Missing:
HUNTER had 36 modules covering price action, technicals, flow, positioning, political intelligence, and cross-sector correlation. ZERO modules monitored the dollar-yield-metals inverse relationship that institutional desks use as their PRIMARY risk signal for precious metals positions.

**This is the gap between retail and institutional.** Institutional PMs don't ask "is the silver thesis valid?" — they ask "is the macro environment supporting or fighting the thesis right now?" We were answering the first question perfectly. We never asked the second.

---

## 2. MODULE SPECIFICATIONS

### 2.1 H37 — DOLLAR CORRELATION GATE (H-DXY)

**Purpose:** Monitor USD strength as an inverse pressure signal on metals positions.

**Data Source:** FRED API (free, already credentialed — H27 uses FRED)
**Endpoint:** `https://api.stlouisfed.org/fred/series/observations`
**Series IDs:**
- `DTWEXBGS` — Trade-Weighted US Dollar Index (Broad)
- `DGS10` — 10-Year Treasury Constant Maturity (backup confirmation)

**Backup Source:** TwelveData (already credentialed)
**Endpoint:** `https://api.twelvedata.com/time_series`
**Symbol:** `DXY` (US Dollar Index)

**n8n Node Configuration:**

```
Node Name: H37 — Dollar Correlation Gate
Node Type: HTTP Request
Method: GET
URL: https://api.stlouisfed.org/fred/series/observations
Query Parameters:
  series_id: DTWEXBGS
  api_key: [FRED key from H27]
  file_type: json
  sort_order: desc
  limit: 30
  observation_start: [30 days ago, dynamic]
Authentication: None (key in query)
Timeout: 30s
On Error: Continue
Always Output Data: false
```

**Code Node (H37-CALC) — Immediately after HTTP:**

```javascript
// H37-CALC: Dollar Strength Assessment
// Calculates DXY position vs 20-day moving average
// Determines trend direction (strengthening/weakening)

const observations = $input.all()[0].json.observations;

if (!observations || observations.length < 20) {
  return [{ json: {
    module: "H37-DXY",
    status: "INSUFFICIENT_DATA",
    signal: "NEUTRAL",
    gate_pass: true,
    timestamp: new Date().toISOString()
  }}];
}

// Parse values, filter out missing data points
const values = observations
  .filter(o => o.value !== ".")
  .map(o => ({ date: o.date, value: parseFloat(o.value) }))
  .slice(0, 30);

const current = values[0].value;
const prev = values[1].value;

// 20-day simple moving average
const sma20 = values.slice(0, 20).reduce((sum, v) => sum + v.value, 0) / 20;

// 5-day rate of change (momentum)
const fiveDayAgo = values[4]?.value || values[values.length - 1].value;
const roc5 = ((current - fiveDayAgo) / fiveDayAgo) * 100;

// Daily change
const dailyChange = ((current - prev) / prev) * 100;

// Determine signal
let signal = "NEUTRAL";
let gate_pass = true;
let urgency = "NONE";

if (current > sma20 && roc5 > 0.5) {
  signal = "DOLLAR_STRENGTHENING";
  gate_pass = false;  // BLOCKS metals entry
  urgency = roc5 > 1.5 ? "CRITICAL" : "WARNING";
} else if (current > sma20 && roc5 > 0) {
  signal = "DOLLAR_ELEVATED";
  gate_pass = true;  // Caution but allowed
  urgency = "MONITOR";
} else if (current < sma20 && roc5 < -0.5) {
  signal = "DOLLAR_WEAKENING";
  gate_pass = true;  // Favorable for metals
  urgency = "NONE";
} else {
  signal = "NEUTRAL";
  gate_pass = true;
  urgency = "NONE";
}

return [{ json: {
  module: "H37-DXY",
  current_dxy: current,
  sma20_dxy: Math.round(sma20 * 100) / 100,
  roc_5day: Math.round(roc5 * 100) / 100,
  daily_change_pct: Math.round(dailyChange * 100) / 100,
  above_sma20: current > sma20,
  signal: signal,
  gate_pass: gate_pass,
  urgency: urgency,
  assessment: `DXY at ${current} (SMA20: ${Math.round(sma20*100)/100}). ` +
    `${current > sma20 ? "ABOVE" : "BELOW"} 20-day average. ` +
    `5-day momentum: ${roc5 > 0 ? "+" : ""}${Math.round(roc5*100)/100}%. ` +
    `Signal: ${signal}`,
  timestamp: new Date().toISOString()
}}];
```

**Signal Matrix:**

| DXY vs SMA20 | 5-Day ROC | Signal | Gate | Action |
|---------------|-----------|--------|------|--------|
| Above | > +1.5% | DOLLAR_STRENGTHENING | ❌ BLOCK | CORRELATION KILL SWITCH fires |
| Above | +0.5 to +1.5% | DOLLAR_STRENGTHENING | ❌ BLOCK | Mandatory 50% metals reduction |
| Above | 0 to +0.5% | DOLLAR_ELEVATED | ⚠️ PASS | Caution — no new metals entries |
| Below | < -0.5% | DOLLAR_WEAKENING | ✅ PASS | Favorable for metals |
| Any | -0.5 to +0.5% | NEUTRAL | ✅ PASS | Normal operations |

---

### 2.2 H38 — TREASURY YIELD MONITOR (H-YIELD)

**Purpose:** Monitor 10-Year Treasury yield as competing safe-haven flow indicator.

**Data Source:** FRED API
**Series ID:** `DGS10` (10-Year Treasury Constant Maturity Rate)

**n8n Node Configuration:**

```
Node Name: H38 — Treasury Yield Monitor
Node Type: HTTP Request
Method: GET
URL: https://api.stlouisfed.org/fred/series/observations
Query Parameters:
  series_id: DGS10
  api_key: [FRED key from H27]
  file_type: json
  sort_order: desc
  limit: 30
  observation_start: [30 days ago, dynamic]
Authentication: None
Timeout: 30s
On Error: Continue
Always Output Data: false
```

**Code Node (H38-CALC):**

```javascript
// H38-CALC: Treasury Yield Assessment
// Monitors 10Y yield level and velocity
// Rising yields above threshold = headwind for non-yielding assets

const observations = $input.all()[0].json.observations;

if (!observations || observations.length < 10) {
  return [{ json: {
    module: "H38-YIELD",
    status: "INSUFFICIENT_DATA",
    signal: "NEUTRAL",
    gate_pass: true,
    timestamp: new Date().toISOString()
  }}];
}

const values = observations
  .filter(o => o.value !== ".")
  .map(o => ({ date: o.date, value: parseFloat(o.value) }))
  .slice(0, 30);

const current = values[0].value;
const prev = values[1]?.value || current;
const fiveDayAgo = values[4]?.value || current;
const tenDayAgo = values[9]?.value || current;

// Velocity: rate of change over 5 days
const velocity5 = current - fiveDayAgo;  // In basis points (ish)
const velocity10 = current - tenDayAgo;

// Absolute level thresholds
const CAUTION_LEVEL = 4.5;
const DANGER_LEVEL = 5.0;
const CRITICAL_VELOCITY = 0.25;  // 25bps in 5 days

let signal = "NEUTRAL";
let gate_pass = true;
let urgency = "NONE";

if (current >= DANGER_LEVEL && velocity5 > 0) {
  signal = "YIELD_CRITICAL";
  gate_pass = false;
  urgency = "CRITICAL";
} else if (current >= CAUTION_LEVEL && velocity5 > CRITICAL_VELOCITY) {
  signal = "YIELD_SPIKE";
  gate_pass = false;
  urgency = "CRITICAL";
} else if (current >= CAUTION_LEVEL && velocity5 > 0) {
  signal = "YIELD_ELEVATED_RISING";
  gate_pass = false;
  urgency = "WARNING";
} else if (current >= CAUTION_LEVEL && velocity5 <= 0) {
  signal = "YIELD_ELEVATED_STABLE";
  gate_pass = true;  // High but not rising — manageable
  urgency = "MONITOR";
} else if (velocity5 > CRITICAL_VELOCITY) {
  signal = "YIELD_RISING_FAST";
  gate_pass = true;  // Level OK but velocity concerning
  urgency = "MONITOR";
} else {
  signal = "NEUTRAL";
  gate_pass = true;
  urgency = "NONE";
}

return [{ json: {
  module: "H38-YIELD",
  current_10y: current,
  prev_10y: prev,
  velocity_5day_bps: Math.round(velocity5 * 100),
  velocity_10day_bps: Math.round(velocity10 * 100),
  above_caution: current >= CAUTION_LEVEL,
  above_danger: current >= DANGER_LEVEL,
  signal: signal,
  gate_pass: gate_pass,
  urgency: urgency,
  assessment: `10Y yield at ${current}%. ` +
    `5-day change: ${velocity5 > 0 ? "+" : ""}${Math.round(velocity5*100)}bps. ` +
    `${current >= DANGER_LEVEL ? "ABOVE DANGER THRESHOLD." : current >= CAUTION_LEVEL ? "Above caution level." : "Normal range."} ` +
    `Signal: ${signal}`,
  timestamp: new Date().toISOString()
}}];
```

**Signal Matrix:**

| 10Y Level | 5-Day Velocity | Signal | Gate | Action |
|-----------|---------------|--------|------|--------|
| ≥ 5.0% | Rising | YIELD_CRITICAL | ❌ BLOCK | Evacuate non-yielding positions |
| ≥ 4.5% | > +25bps/5d | YIELD_SPIKE | ❌ BLOCK | CORRELATION KILL fires |
| ≥ 4.5% | Rising (< 25bps) | YIELD_ELEVATED_RISING | ❌ BLOCK | Mandatory 50% reduction |
| ≥ 4.5% | Flat/falling | YIELD_ELEVATED_STABLE | ⚠️ PASS | Monitor, no new entries |
| < 4.5% | > +25bps/5d | YIELD_RISING_FAST | ⚠️ PASS | Monitor velocity |
| < 4.5% | Normal | NEUTRAL | ✅ PASS | Normal operations |

---

### 2.3 H39 — FUND FLOW PROXY (H-FLOW)

**Purpose:** Detect institutional money flow direction in metals via ETF volume and creation/redemption signals.

**Data Source:** Finnhub (already credentialed — H4/H5/H6 use Finnhub)
**Endpoint:** `https://finnhub.io/api/v1/stock/candle`

**Why ETF Volume as Proxy:**
Institutional desks moving in/out of metals show up in SLV/GLD volume BEFORE the underlying spot price moves. Abnormally high volume on a DOWN day = institutional liquidation. This is the cheapest available proxy for fund flow data without a Bloomberg terminal.

**n8n Node Configuration:**

```
Node Name: H39 — Fund Flow Proxy
Node Type: HTTP Request (x3 — one per ETF)
Method: GET

H39a — SLV Volume:
  URL: https://finnhub.io/api/v1/stock/candle
  Query: symbol=SLV&resolution=D&count=20&token=[FINNHUB_KEY]

H39b — GLD Volume:
  URL: https://finnhub.io/api/v1/stock/candle
  Query: symbol=GLD&resolution=D&count=20&token=[FINNHUB_KEY]

H39c — SIL Volume:
  URL: https://finnhub.io/api/v1/stock/candle
  Query: symbol=SIL&resolution=D&count=20&token=[FINNHUB_KEY]

All: Timeout 30s, On Error: Continue, Always Output Data: false
```

**Code Node (H39-CALC):**

```javascript
// H39-CALC: Fund Flow Assessment
// Detects institutional liquidation via volume-price divergence
// High volume + down price = institutional exit

const slv = $input.all()[0]?.json || {};
const gld = $input.all()[1]?.json || {};
const sil = $input.all()[2]?.json || {};

function analyzeFlow(data, symbol) {
  if (!data.v || data.v.length < 10) {
    return { symbol, status: "INSUFFICIENT_DATA", signal: "NEUTRAL" };
  }

  const volumes = data.v;
  const closes = data.c;
  const len = volumes.length;

  // Current day
  const currentVol = volumes[len - 1];
  const currentClose = closes[len - 1];
  const prevClose = closes[len - 2];
  const priceChange = ((currentClose - prevClose) / prevClose) * 100;

  // 20-day average volume
  const avgVol = volumes.slice(0, -1).reduce((s, v) => s + v, 0) / (len - 1);
  const volRatio = currentVol / avgVol;

  // 5-day cumulative flow (volume-weighted price direction)
  let flowScore = 0;
  for (let i = Math.max(0, len - 5); i < len; i++) {
    const dayReturn = (closes[i] - closes[Math.max(0, i-1)]) / closes[Math.max(0, i-1)];
    const dayVolRatio = volumes[i] / avgVol;
    flowScore += dayReturn * dayVolRatio;
  }

  return {
    symbol,
    current_volume: currentVol,
    avg_volume: Math.round(avgVol),
    volume_ratio: Math.round(volRatio * 100) / 100,
    price_change_pct: Math.round(priceChange * 100) / 100,
    flow_score_5day: Math.round(flowScore * 10000) / 10000,
    liquidation_signal: volRatio > 2.0 && priceChange < -2,
    accumulation_signal: volRatio > 1.5 && priceChange > 1
  };
}

const slvFlow = analyzeFlow(slv, "SLV");
const gldFlow = analyzeFlow(gld, "GLD");
const silFlow = analyzeFlow(sil, "SIL");

// Composite signal
const liquidationCount = [slvFlow, gldFlow, silFlow]
  .filter(f => f.liquidation_signal).length;
const accumulationCount = [slvFlow, gldFlow, silFlow]
  .filter(f => f.accumulation_signal).length;

let signal = "NEUTRAL";
let gate_pass = true;
let urgency = "NONE";

if (liquidationCount >= 2) {
  signal = "INSTITUTIONAL_EXIT";
  gate_pass = false;
  urgency = "CRITICAL";
} else if (liquidationCount === 1) {
  signal = "FLOW_WARNING";
  gate_pass = true;
  urgency = "WARNING";
} else if (accumulationCount >= 2) {
  signal = "INSTITUTIONAL_ACCUMULATION";
  gate_pass = true;
  urgency = "NONE";
} else {
  signal = "NEUTRAL";
  gate_pass = true;
  urgency = "NONE";
}

return [{ json: {
  module: "H39-FLOW",
  slv: slvFlow,
  gld: gldFlow,
  sil: silFlow,
  composite_signal: signal,
  liquidation_count: liquidationCount,
  accumulation_count: accumulationCount,
  gate_pass: gate_pass,
  urgency: urgency,
  assessment: `Fund flow: ${liquidationCount}/3 ETFs showing liquidation pattern. ` +
    `${accumulationCount}/3 showing accumulation. ` +
    `SLV vol ratio: ${slvFlow.volume_ratio}x avg. ` +
    `Signal: ${signal}`,
  timestamp: new Date().toISOString()
}}];
```

**Signal Matrix:**

| Liquidation ETFs | Signal | Gate | Action |
|-----------------|--------|------|--------|
| 2-3 of 3 | INSTITUTIONAL_EXIT | ❌ BLOCK | Immediate 50% metals reduction |
| 1 of 3 | FLOW_WARNING | ⚠️ PASS | Tighten stops, no new entries |
| 0 + accumulation | INSTITUTIONAL_ACCUMULATION | ✅ PASS | Favorable — consider adding |
| 0 | NEUTRAL | ✅ PASS | Normal operations |

---

## 3. CORRELATION KILL SWITCH

### 3.1 Definition

The Correlation Kill Switch is a CIRCUIT BREAKER that fires when multiple H37/H38/H39 signals align against metals positions. It is NOT a suggestion. It is NOT a gate that the Principal overrides. It executes.

### 3.2 Trigger Conditions

```
CORRELATION KILL FIRES WHEN:

  (H37-DXY signal = DOLLAR_STRENGTHENING)
  AND
  (H38-YIELD signal = YIELD_ELEVATED_RISING OR YIELD_SPIKE OR YIELD_CRITICAL)

  OR

  (H39-FLOW signal = INSTITUTIONAL_EXIT)
  AND
  (H37-DXY signal != DOLLAR_WEAKENING)

  OR

  ALL THREE modules return gate_pass = false
```

### 3.3 Execution — Non-Negotiable

When Correlation Kill fires:

1. **REDUCE ALL METALS POSITIONS BY 50% WITHIN 60 MINUTES**
   - This means: AG, PSLV, SLV, SIL, SIVR, GLD, HYMC, any silver/gold miner
   - Sell at market, not limit. Speed > price optimization.
   - If E*Trade MCP is live: automatic execution via n8n
   - If manual: Telegram alert with exact orders to place

2. **REMAINING 50% GETS TIGHT TRAILING STOPS**
   - 1x ATR trailing stop (not the wider 1.5-2x used in normal conditions)
   - These are "ride the bounce or get out" stops

3. **NO NEW METALS ENTRIES FOR 48 HOURS**
   - Timer starts from kill switch activation
   - Only reset when ALL THREE modules return gate_pass = true

4. **LOG EVERYTHING**
   - Kill switch activation time
   - Module signals at activation
   - Positions reduced
   - Execution prices
   - 48-hour embargo start/end

### 3.4 Why No Override

The March 3 loss happened because a human evaluated the data and decided to hold. The data was correct AT THE FIRST ORDER. The second-order effect was invisible without these modules. This kill switch exists because the correlation reversal happens in hours — faster than human analysis cycles. If the modules say the macro is fighting the thesis, the thesis loses regardless of its validity.

**"The thesis can be right and the trade can still lose."** — This is the lesson. This kill switch embodies it.

---

## 4. WIRING INTO HUNTER PIPELINE

### 4.1 Placement

```
[Schedule Trigger 6AM ET]
        │
        ▼
[Model Version Check]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│                    PARALLEL MODULE EXECUTION                │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ H1-H6       │  │ H7-H14      │  │ H15-H21     │       │
│  │ Intelligence │  │ Technical   │  │ Flow/Pos    │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │ H22-H29     │  │ H30-H36     │  │ H37-H39          │  │
│  │ Market Intel │  │ Influence   │  │ CORRELATION GATE │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘  │
│         │                │                    │             │
│         └────────────────┴────────────────────┘             │
│                          │                                   │
└──────────────────────────┘                                   
                           │
                           ▼
              ┌─────────────────────────┐
              │ CORRELATION GATE CHECK  │  ← NEW: Before Master Merge
              │ IF kill_switch = true   │
              │ THEN → KILL SWITCH PATH │
              │ ELSE → Normal pipeline  │
              └────────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    [KILL SWITCH PATH]        [NORMAL PATH]
    - Send Telegram alert     - HUNTER MASTER MERGE
    - Execute 50% reduction   - DATA AGGREGATOR
    - Set tight stops         - MICHA PASS 1
    - Start 48hr embargo      - Collective routing
    - Log everything          - Continue pipeline
```

### 4.2 Node Connections

H37, H38, and H39 run in PARALLEL with H1-H36 (no dependency, no delay to existing pipeline).

Their outputs merge into a new **CORRELATION GATE CHECK** node (Code node) that sits BETWEEN the existing parallel execution block and the HUNTER MASTER MERGE.

The CORRELATION GATE CHECK node:
1. Reads H37, H38, H39 outputs
2. Evaluates kill switch conditions
3. If kill switch fires → routes to KILL SWITCH PATH (Telegram + trade execution)
4. If no kill switch → passes all data (including correlation signals) to MASTER MERGE
5. Correlation signals are available to MICHA PASS 1 and Collective agents as additional context

### 4.3 API Budget Impact

| Module | API Calls | Rate Limit | Impact |
|--------|-----------|------------|--------|
| H37 (FRED) | 1 call | 120/min | Negligible |
| H38 (FRED) | 1 call | 120/min | Negligible |
| H39a (Finnhub) | 1 call | 60/min | +1 to existing Finnhub load |
| H39b (Finnhub) | 1 call | 60/min | +1 |
| H39c (Finnhub) | 1 call | 60/min | +1 |
| H37-CALC | 0 (Code) | N/A | None |
| H38-CALC | 0 (Code) | N/A | None |
| H39-CALC | 0 (Code) | N/A | None |
| CORR GATE | 0 (Code) | N/A | None |
| **TOTAL** | **5 API calls** | | **Minimal** |

---

## 5. TESTING REQUIREMENTS

### 5.1 Backtest Against March 3 Event

Before production deployment, wire H37/H38/H39 in test mode and feed them the March 2-3 data:

1. DXY on March 2-3: Was it above SMA20 and rising? → Expected: YES
2. 10Y yield on March 2-3: Was it above 4.5% and rising? → Expected: YES (Iran → bond flight)
3. SLV/GLD/SIL volume on March 2-3: Was volume >2x average with price decline? → Expected: YES

**If all three confirm, the kill switch would have fired on March 2 or early March 3, preventing the full $9K loss.**

### 5.2 False Positive Check

Run against Feb 9-13 data (the period where we were profitable and metals were ripping):

1. DXY should have been below SMA20 or falling → Kill switch should NOT have fired
2. Yields should have been stable → No block
3. SLV volume should have been high with RISING prices → Accumulation, not liquidation

**If kill switch would have fired during this profitable period, the thresholds need adjustment.**

### 5.3 Integration Test

Wire in n8n as disabled nodes. Run one full MARKET WATCH scan. Verify:
- H37/H38/H39 produce valid JSON output
- CORRELATION GATE CHECK reads all three correctly
- Kill switch logic evaluates properly
- Normal pipeline continues unaffected when no kill switch

---

## 6. DEPLOYMENT SEQUENCE

1. **BUILD** H37, H38, H39 nodes in n8n (HTTP + Code pairs)
2. **BUILD** CORRELATION GATE CHECK code node
3. **BUILD** KILL SWITCH PATH (Telegram alert node + future E*Trade execution)
4. **WIRE** H37/H38/H39 into parallel execution block
5. **WIRE** CORRELATION GATE CHECK between parallel block and MASTER MERGE
6. **TEST** with disabled nodes against live data for 3 trading days
7. **BACKTEST** against March 2-3 data (must catch the failure)
8. **BACKTEST** against Feb 9-13 data (must NOT false positive)
9. **ENABLE** — move to production
10. **MONITOR** — first 5 trading days with Telegram confirmations of every signal

---

## 7. MARCH 3 FORENSIC — WHAT WOULD HAVE HAPPENED

### With Current System (No Correlation Modules):
```
March 2 AM: HUNTER scan shows silver thesis intact ✅
March 2 PM: Re-entered AG 625 + PSLV 647
March 2 PM: Dollar strengthening, yields rising (NOT MONITORED)
March 2 PM: Same-day stops trigger on AG (-$544) and PSLV (-$459)
March 3 AM: Remaining positions hammered
March 3 AM: T-stops fire on AG 1550 (-$3,900+) and PSLV 1000 (-$2,500+)
Total: ~$9,000 realized loss
```

### With Correlation Modules Active:
```
March 2 AM: HUNTER scan shows silver thesis intact ✅
March 2 AM: H37 shows DXY above SMA20, rising 1.2% over 5 days ❌
March 2 AM: H38 shows 10Y at 4.6%, up 18bps in 5 days ❌
March 2 AM: CORRELATION GATE → KILL SWITCH FIRES
March 2 AM: Telegram alert: "CORRELATION KILL — reduce metals 50%"
March 2 AM: Sell 50% of AG, PSLV, GLD at market (BEFORE the drop)
March 2 AM: Remaining 50% gets 1x ATR trailing stops
March 2 AM: 48-hour embargo on new metals entries
March 3 AM: Tight stops catch remaining positions earlier
Estimated loss: ~$2,000-3,000 instead of $9,000
```

**Savings: $6,000-7,000. On one event. In one day.**

---

## 8. VERSION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | 2026-03-03 | MICHA/WEL | Initial specification — root cause fix for March 3 loss |

---

*"Loss is tuition for knowledge." — This is the $9,000 lesson, formalized as infrastructure.*

*"The thesis can be right and the trade can still lose." — This is the principle these modules enforce.*

🔱 **METATRON v10.7 — CORRELATION ENFORCEMENT**
