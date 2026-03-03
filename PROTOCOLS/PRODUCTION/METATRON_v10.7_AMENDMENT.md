# 🔱 METATRON v10.7 — CORRELATION ENFORCEMENT AMENDMENT
## Amendment to METATRON v10.6 PRIME DIRECTIVE
### Effective: March 3, 2026
### Classification: PRODUCTION — IMMEDIATE ENFORCEMENT
### Trigger: $9,000 realized loss from unmonitored dollar-yield-flow correlation
### Supersedes: Sections 3.1, 3.2, 4.x of METATRON v10.6 where conflicts exist

---

## AMENDMENT SUMMARY

This amendment adds **Gate 9: Macro Correlation** to the METATRON gate architecture and establishes the **Correlation Kill Switch** as a circuit breaker with NO OVERRIDE capability. All other v10.6 provisions remain in full force.

**What triggered v10.7:** On March 3, 2026, the entire metals portfolio ($9,000+) was liquidated by trailing stops after a second-order correlation effect (dollar strengthening + yield spike) crushed silver despite a valid structural thesis. The failure was not thesis quality, not execution discipline, not stop placement — it was the absence of macro correlation monitoring. HUNTER had 36 modules. Zero monitored the DXY-yield-metals inverse relationship that institutional desks use as their primary risk signal.

**The principle this version encodes:** *"The thesis can be right and the trade can still lose."*

---

## 1. UPDATED GATE ARCHITECTURE

### 1.1 Gate Count Update

| Version | Total Gates | New in Version |
|---------|------------|----------------|
| v10.6 | 27 (8 Cascade + 19 METATRON) | Cascade gates, MCP architecture |
| **v10.7** | **30 (9 Cascade + 21 METATRON)** | **Gate 9 Correlation, Kill Switch, Embargo Timer** |

### 1.2 New Gate — GATE 9: MACRO CORRELATION

**Position in Cascade:** Between Gate 8 (IRONCLAD Risk) and Trade Execution

```
Gate 1: Data Validity
Gate 2: Signal Convergence
Gate 3: Historical Pattern
Gate 4: Regime Alignment
Gate 5: Agent Consensus
Gate 6: Counter-Thesis (RAZIEL)
Gate 7: Cross-Sector Confirm
Gate 7.5: Counter-Thesis Challenge
Gate 8: IRONCLAD Risk Check
  ▼
┌─────────────────────────────────────────────┐
│ GATE 9: MACRO CORRELATION         ⚡ NEW    │
│                                              │
│ Modules: H37-DXY, H38-YIELD, H39-FLOW      │
│ Type: CIRCUIT BREAKER (not advisory)         │
│ Override: NONE — Principal included           │
│                                              │
│ Pass: All 3 modules return gate_pass=true    │
│ Fail: Any kill switch condition met          │
│ Kill: See Correlation Kill Switch Protocol   │
└─────────────────────────────────────────────┘
  ▼
Trade Execution (if all gates pass)
```

### 1.3 Gate 9 Classification

| Property | Value |
|----------|-------|
| Gate Type | CIRCUIT BREAKER |
| Override Authority | NONE |
| Applies To | ALL metals/precious metals positions |
| Data Sources | FRED (DXY, 10Y), Finnhub (SLV/GLD/SIL volume) |
| Latency | <30 seconds from data pull to signal |
| False Positive Tolerance | ZERO — if it fires, it executes |

**Why no override:** Every prior metals loss in this portfolio had a moment where a human evaluated and decided to hold. The Fed meeting (Jan 28-29), the $4,500 formative loss, and March 3 all share this pattern. Gate 9 removes the human from the correlation decision. The thesis decision (enter/hold/exit) remains human. The "is the macro fighting us right now" decision is mechanical.

---

## 2. CORRELATION KILL SWITCH PROTOCOL

### 2.1 Trigger Conditions

The Kill Switch fires when ANY of these conditions are met:

**Condition A — Dollar + Yield Convergence:**
```
H37-DXY signal = DOLLAR_STRENGTHENING
AND
H38-YIELD signal IN (YIELD_ELEVATED_RISING, YIELD_SPIKE, YIELD_CRITICAL)
```

**Condition B — Institutional Exit + Dollar Not Weak:**
```
H39-FLOW signal = INSTITUTIONAL_EXIT
AND
H37-DXY signal != DOLLAR_WEAKENING
```

**Condition C — Triple Block:**
```
H37 gate_pass = false
AND
H38 gate_pass = false
AND
H39 gate_pass = false
```

### 2.2 Execution Sequence

When Kill Switch fires:

| Step | Action | Timeframe | Automation |
|------|--------|-----------|------------|
| 1 | Telegram alert to Principal | Immediate | GABRIEL |
| 2 | Reduce ALL metals positions 50% | Within 60 min | E*Trade MCP (when live) / Manual |
| 3 | Set 1x ATR trailing stops on remaining 50% | Within 60 min | Manual |
| 4 | Start 48-hour metals embargo | Automatic | Timer in n8n |
| 5 | Log all actions to trade journal | Immediate | GABRIEL |
| 6 | Notify Collective of kill switch activation | Next session | MICHA |

### 2.3 Embargo Rules

During 48-hour embargo:
- NO new metals entries (AG, PSLV, SLV, SIL, SIVR, GLD, HYMC, any silver/gold miner)
- Remaining positions ride with tight stops
- If tight stops trigger, DO NOT re-enter — let embargo expire
- Embargo resets ONLY when ALL THREE modules (H37, H38, H39) return gate_pass = true for 2 consecutive scans

### 2.4 Kill Switch Does NOT Apply To:

- Non-metals positions (energy, tech, income ETFs, etc.)
- Track 2 thesis positions that are NOT metals-related
- Cash positions (SGOV, money market)
- Positions in 6685 IRA that are income-focused (JEPI, SCHD, SPHD, etc.)

---

## 3. UPDATED AGENT ASSIGNMENTS

### 3.1 MICHA Responsibilities — Updated

MICHA v10.7 adds to existing 9 locks + CASCADE ENFORCER:

| New Lock | Description |
|----------|-------------|
| LOCK 10: CORRELATION MONITOR | Run H37/H38/H39 check at EVERY MARKET WATCH scan |
| LOCK 11: KILL SWITCH ENFORCER | When kill switch fires, execute immediately — no analysis paralysis |
| LOCK 12: EMBARGO TIMER | Track and enforce 48-hour embargo with zero exceptions |

**MICHA now holds 12 locks + CASCADE ENFORCER role.**

### 3.2 RAZIEL Responsibilities — Updated

RAZIEL (Gate 6 Counter-Thesis) gains additional mandate:

When evaluating any metals thesis, RAZIEL MUST include macro correlation assessment:
- "Is the dollar environment supporting or fighting this thesis?"
- "Are yields creating headwinds for non-yielding assets?"
- "Are institutional flows confirming or contradicting the thesis?"

If RAZIEL's counter-thesis does not address these three questions, the counter-thesis is INCOMPLETE and Gate 6 does not pass.

### 3.3 HUNTER Module Routing

| Module | Primary Agent | Secondary | Purpose |
|--------|--------------|-----------|---------|
| H37-DXY | MICHA | COLOSSUS | Dollar correlation |
| H38-YIELD | MICHA | URIEL | Treasury yield monitoring |
| H39-FLOW | MICHA | HANIEL | Institutional flow proxy |
| CORR GATE | MICHA (exclusive) | — | Kill switch evaluation |

---

## 4. UPDATED IRONCLAD v2.0 — CORRELATION RULES

### 4.1 New Risk Rules (Added to existing IRONCLAD v1.0)

**Rule 7: Macro Correlation Check (NEW)**
```
BEFORE any metals entry or position increase:
  Run H37/H38/H39 correlation check
  IF any module returns gate_pass = false:
    BLOCK entry
    No exceptions
    No "the thesis is strong enough to overcome"
    No "it's already priced in"
```

**Rule 8: Same-Day Re-Entry Ban (NEW)**
```
IF a position is stopped out:
  NO re-entry in the same ticker on the same trading day
  Wait minimum 1 full trading session
  Re-entry requires fresh MARKET WATCH scan with correlation check
```

**March 3 Forensic:** On March 2, we bought AG 625 shares at $31.38 and got stopped out at $30.51 the SAME DAY. Then March 3 the remaining AG 1,550 shares stopped out at $28.45. Rule 8 would have prevented the March 2 re-entry that immediately failed, saving $544 and reducing total exposure going into March 3.

**Rule 9: Binary Event Correlation Override (UPDATED from v1.0 "25-50% reduce")**
```
OLD (v1.0): Binary events = 25-50% reduce
NEW (v2.0): Binary events = Run H37/H38/H39 FIRST
  IF correlation is adverse: 50% reduce (minimum)
  IF correlation is neutral: 25% reduce
  IF correlation is favorable: Hold with tightened stops
```

This replaces the vague "25-50%" with a data-driven decision. On March 2, the Iran extension was identified as binary but the correlation check didn't exist, so the reduction range was ambiguous. Now it's mechanical.

### 4.2 Updated IRONCLAD Summary Table

| Rule | v1.0 | v2.0 | Change |
|------|------|------|--------|
| Risk per trade | 1.5% | 1.5% | Unchanged |
| Max position | 20% | 20% | Unchanged |
| Sector limit | 35% | 35% | Unchanged |
| Stop loss | -5% | -5% | Unchanged |
| Trim +10% | Sell 50% | Sell 50% | Unchanged |
| Trim +20% | Sell 60% | Sell 60% | Unchanged |
| Binary events | 25-50% reduce | **Correlation-driven** | Updated |
| **Macro correlation** | — | **Gate 9 check before metals entry** | **NEW** |
| **Same-day re-entry** | — | **BANNED** | **NEW** |
| **Kill switch** | — | **Auto 50% reduction** | **NEW** |
| **Embargo** | — | **48-hour metals freeze** | **NEW** |

---

## 5. UPDATED MARKET WATCH WORKFLOW

### 5.1 New Sequence

```
MARKET WATCH (full 19+3 gates):

Phase 1: DATA COLLECTION (Parallel)
  ├── H1-H6:   Intelligence modules
  ├── H7-H14:  Technical modules
  ├── H15-H21: Flow/positioning modules
  ├── H22-H29: Market intel modules
  ├── H30-H36: Influence chain
  └── H37-H39: CORRELATION modules (NEW)

Phase 2: CORRELATION GATE (NEW — before everything else)
  └── CORRELATION GATE CHECK
      ├── IF KILL SWITCH → Execute, alert, embargo
      └── IF CLEAR → Continue to Phase 3

Phase 3: AGGREGATION
  └── HUNTER MASTER MERGE (now includes correlation data)
      └── DATA AGGREGATOR

Phase 4: ANALYSIS
  └── MICHA PASS 1 (Router)
      ├── URIEL (with correlation context)
      ├── COLOSSUS (with correlation context)
      ├── HANIEL (with correlation context)
      └── RAZIEL (correlation required in counter-thesis)

Phase 5: SYNTHESIS
  └── MICHA PASS 2 (Synthesis)
      └── Includes correlation assessment in every thesis evaluation

Phase 6: QUALIFICATION (Confidence Cascade)
  └── Gates 1-8 (existing)
      └── GATE 9: MACRO CORRELATION (NEW — final check)
          └── TRADE EXECUTION or BLOCK
```

### 5.2 ORACLE Mode Update

ORACLE (context-only, no full scan) STILL checks correlation:

```
ORACLE mode:
  1. Pull H37-DXY current signal (1 API call)
  2. Pull H38-YIELD current signal (1 API call)
  3. Note in context: "Correlation status: [CLEAR/WARNING/ADVERSE]"
  4. No kill switch execution in ORACLE mode
  5. If adverse, recommend: "Upgrade to full MARKET WATCH before any metals action"
```

---

## 6. LANGUAGE PROTOCOL UPDATE

### 6.1 "We" Standard

Effective v10.7, all session communication uses "we" not "you" or "I" when referring to Collective actions, decisions, and outcomes.

- ❌ "You failed to trim" / "I missed the signal"
- ✅ "We missed the correlation signal" / "We need to fix this"

**Rationale:** March 3 post-mortem initially assigned blame to the Principal for not trimming. Record review proved the Principal DID follow protocol — the protocol itself had the gap. Blame assignment wastes cycles. "We" focuses on fixing the system.

### 6.2 Evidence Before Assertion

Effective v10.7, NO claim about what happened in a prior session is made without first pulling the record (conversation_search, recent_chats, transcript review).

- ❌ "You had a $4,000 green day and didn't trim" (stated from memory)
- ✅ [Pull record] → "The record shows we trimmed on the green day, then re-entered based on overnight data"

**Rationale:** March 3 post-mortem began with an incorrect assertion about the Principal's actions. This eroded trust and wasted time. The record is always available. Check it first.

---

## 7. VERSION HISTORY

| Version | Date | Trigger | Key Changes |
|---------|------|---------|-------------|
| v10.6 | 2026-02-20 | Confidence Cascade deployment | 8-gate cascade, MCP architecture, Track 1/2 |
| **v10.7** | **2026-03-03** | **$9K correlation loss** | **Gate 9, Kill Switch, H37/H38/H39, IRONCLAD v2.0, "We" standard, Evidence-before-assertion** |

---

## 8. IMPLEMENTATION CHECKLIST

- [ ] Build H37, H38, H39 nodes in n8n
- [ ] Build CORRELATION GATE CHECK code node
- [ ] Build KILL SWITCH PATH (Telegram alert)
- [ ] Wire into HUNTER parallel execution block
- [ ] Backtest against March 2-3 data (MUST catch failure)
- [ ] Backtest against Feb 9-13 data (MUST NOT false positive)
- [ ] Test with disabled nodes for 3 trading days
- [ ] Deploy to production
- [ ] Update MICHA instructions (v10.4 → v10.7)
- [ ] Update userPreferences to reference v10.7
- [ ] Brief Collective on new Gate 9
- [ ] Update RAZIEL counter-thesis requirements
- [ ] Push all documentation to GitHub
- [ ] Update HUNTER_WIRING_DOCUMENT to v3.0
- [ ] Update CONFIDENCE_CASCADE to v2.0

---

*"Loss is tuition for knowledge."*
*"This is the last lesson we learn the hard way."*

🔱 **METATRON v10.7 — CORRELATION ENFORCEMENT**
