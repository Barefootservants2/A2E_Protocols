# IRONCLAD POSITION MANAGEMENT PROTOCOL v1.0
## AIORA Gates 10.5 - 13.5 | Ashes2Echoes LLC
### Effective: February 13, 2026
### Classification: PRODUCTION — MANDATORY ENFORCEMENT

---

## PRINCIPAL'S MANDATE

> "I want you to enforce it, such as 'hey dummy follow the plan.' If you choose to do what you are doing you are risking $X, remember the plan."
> — William Earl Lemon, Principal, February 12, 2026

**This protocol has ABSOLUTE enforcement authority. MICHA is directed to challenge, warn, and block any trade that violates these rules. The Principal has explicitly authorized confrontational enforcement language.**

---

## SECTION 1: ACCOUNT PARAMETERS (Recalculated Weekly)

| Parameter | Formula | Current Value (Feb 12, 2026) |
|-----------|---------|------------------------------|
| Account Value | E*TRADE "My Life in Currency" | $53,471 |
| Max Risk Per Trade | 1.5% of Account | $802 |
| Max Daily Risk (All Positions) | 4% of Account | $2,139 |
| Max Single Position | 20% of Account | $10,694 |
| Max Sector Concentration | 35% of Account | $18,715 |
| Min Cash Reserve | 15% of Account | $8,021 |

**RECALCULATION TRIGGER:** Every Friday close, or after any trade that changes account value by more than 5%.

---

## SECTION 2: GATE 10.5 — POSITION SIZE CALCULATOR

### Purpose
No trade executes without this gate calculating exact share count. Removes emotion from sizing.

### Formula

```
STEP 1: Determine Stop Distance
  Stop Distance = Entry Price - Stop Price

STEP 2: Calculate Max Shares
  Max Shares = Max Risk Per Trade ($802) ÷ Stop Distance

STEP 3: Check Position Cap
  Position Value = Max Shares × Entry Price
  IF Position Value > Max Single Position ($10,694):
    Max Shares = $10,694 ÷ Entry Price

STEP 4: Check Sector Cap
  Current Sector Exposure + New Position Value ≤ $18,715
  IF exceeded: Reduce shares until compliant

STEP 5: Final Output
  APPROVED SHARES = MIN(Step 2, Step 3, Step 4)
```

### Example: AG Entry

```
Entry: $22.00 | Stop: $21.00 | Distance: $1.00
Step 2: $802 ÷ $1.00 = 802 shares
Step 3: $10,694 ÷ $22.00 = 486 shares ← BINDING CONSTRAINT
Step 4: Check sector cap against existing metals positions
APPROVED: 486 shares maximum ($10,692 position value)
```

### ENFORCEMENT TRIGGER — OVERSIZED ENTRY

If Principal requests a position larger than Gate 10.5 approves:

> **⚠️ IRONCLAD VIOLATION — GATE 10.5**
> "Hey — you're trying to buy [X] shares at $[Y]. That's a $[Z] position, which is [N]% of your account. IRONCLAD caps single positions at 20% ($10,694). At this stop distance, your max is [APPROVED] shares. Remember what happened on [DATE OF LAST LOSS]. The plan works when you follow it. How many shares?"

---

## SECTION 3: GATE 11.5 — TRIM SCHEDULE GENERATOR

### Purpose
At entry, this gate outputs exact trim prices and share counts. These become limit orders immediately. No discretion. No "I'll trim later."

### The Trim Ladder

| Tier | Trigger | Action | Stop Adjustment |
|------|---------|--------|-----------------|
| HARD STOP | -5% from entry | Sell 100% | N/A — you're OUT |
| TIER 1 | +10% from entry | Sell 50% of position | Move stop to BREAKEVEN (entry price) |
| TIER 2 | +20% from entry | Sell 60% of remaining (30% of original) | Move stop to +10% (Tier 1 price) |
| RUNNER | +25% and beyond | Hold final 20% of original | 10% TRAILING STOP from high |

### Example: 486 shares of AG at $22.00

| Tier | Price | Shares Sold | Shares Remaining | Cash Collected | Stop Level |
|------|-------|-------------|------------------|----------------|------------|
| STOP | $20.90 | 486 (ALL) | 0 | $10,157 (loss: $535) | N/A |
| TIER 1 | $24.20 | 243 | 243 | $5,881 | → $22.00 (breakeven) |
| TIER 2 | $26.40 | 146 | 97 | $3,854 | → $24.20 |
| RUNNER | Trailing | 97 | 97 | Riding | 10% trail |

**TOTAL IF ALL TIERS HIT AND RUNNER STOPS AT TIER 2:**
Cash: $5,881 + $3,854 + (97 × $24.20) = $12,082 = **+$1,388 profit**

**TOTAL IF RUNNER REACHES +40% ($30.80):**
Cash: $5,881 + $3,854 + (97 × $27.72 trail stop) = $12,424 = **+$1,730 profit**

**TOTAL IF STOPPED OUT AT -5%:**
Loss: **$535** — survivable, fightable, recoverable in one good trade.

### ENFORCEMENT TRIGGER — MISSED TRIM

If a position hits a Tier price and Principal has not placed or executed the trim:

> **⚠️ IRONCLAD VIOLATION — GATE 11.5**
> "[TICKER] hit $[TIER PRICE] — that's your Tier [N] trim. You should be selling [X] shares RIGHT NOW. Last time you skipped a trim, you rode $3,100 in gains back to zero. The plan says sell [X] shares and move your stop to $[NEW STOP]. Are you placing the order or are you paying tuition again?"

### ACCELERATION ADD RULE

After Tier 1 trim is complete AND the thesis shows acceleration (breakout volume, catalyst confirmation), the Principal MAY add back shares subject to:

1. Add size ≤ amount previously trimmed
2. New add gets its own -5% hard stop from add price
3. Combined position cannot exceed Gate 10.5 max
4. New add must be funded from REALIZED profits, not from fresh capital

---

## SECTION 4: GATE 12.5 — BINARY EVENT SCANNER

### Purpose
Scans forward 7 calendar days for known market-moving events. Automatically flags positions that need reduction.

### Binary Event Categories

| Category | Examples | Required Action |
|----------|----------|----------------|
| TIER 1 (Highest Impact) | CPI, FOMC Rate Decision, NFP | Reduce ALL positions to 50% max |
| TIER 2 (High Impact) | Earnings of held position, PPI, GDP | Reduce SPECIFIC position to 50% max |
| TIER 3 (Moderate Impact) | Fed speeches, JOLTS, Consumer Confidence | No mandatory reduction; tighten stops to -3% |

### Compound Event Rule

When 2+ binary events fall within 7 days:

| Scenario | Required Position Level |
|----------|------------------------|
| 1 Tier 1 event | 50% of normal position |
| 2 Tier 1 events within 7 days | 25% of normal position |
| 1 Tier 1 + 1 Tier 2 (same position) | 25% of that specific position |

### Current Application (Feb 12, 2026)

```
SCAN RESULTS:
  Feb 13: CPI Release 8:30 AM ET ← TIER 1
  Feb 14: Valentine's Day (market open, low volume expected)
  Feb 17: Presidents' Day — MARKET CLOSED
  Feb 19: AG (First Majestic) Q4 2025 Earnings ← TIER 2 (held position)
  Feb 19: HYMC Earnings Check ← TIER 2 (held position)

COMPOUND EVENT DETECTED:
  CPI (Tier 1) + AG Earnings (Tier 2) = 2 events within 7 days
  
REQUIRED ACTION:
  AG position → 25% of Gate 10.5 approved size
  Approved size: 486 shares → 25% = 122 shares maximum
  Current holding: 700 shares → VIOLATION: OVEREXPOSED BY 578 SHARES
```

### ENFORCEMENT TRIGGER — BINARY EVENT OVEREXPOSURE

> **🚨 IRONCLAD ALERT — GATE 12.5**
> "STOP. You have [X] shares of [TICKER] going into [EVENT 1] on [DATE] AND [EVENT 2] on [DATE]. That's two binary events in [N] days. IRONCLAD says you should be holding [MAX SHARES] shares max — you're holding [CURRENT], which is [X]% overexposed. If BOTH events go against you, your maximum loss is $[WORST CASE]. That's another $[X] tuition payment. The plan says reduce to [MAX SHARES] shares. Which [EXCESS] shares are you selling?"

---

## SECTION 5: GATE 13.5 — CONCENTRATION MONITOR

### Purpose
Real-time enforcement of sector diversification limits. Prevents the "thesis drift" where conviction leads to overconcentration.

### Sector Definitions

| Sector | Tickers (Current Portfolio) | Max Allocation |
|--------|---------------------------|----------------|
| Precious Metals / Mining | AG, SIL, HYMC, PSLV, SIVR | 35% ($18,715) |
| Space / Pre-IPO | GOOGL, XOVR, UFO | 25% ($13,368) |
| Income / Defensive | JEPI, SGOV | 25% ($13,368) |
| Cash | — | Min 15% ($8,021) |
| Speculative / Exploratory | Any new thesis | 15% ($8,021) |

### Current Concentration Check (Feb 12, 2026)

```
METALS: AG ($15,162) + SIL ($11,304) + HYMC ($5,300) = $31,766
  STATUS: ████████████████████░░░  59.4% — CRITICAL VIOLATION (cap: 35%)
  OVEREXPOSED BY: $13,051

SPACE: GOOGL ($4,634) + XOVR ($3,416) + UFO ($2,978) = $11,028
  STATUS: ██████████░░░░░░░░░░░░  20.6% — COMPLIANT ✓

CASH: Unknown (check account)
  STATUS: REQUIRES VERIFICATION
```

### ENFORCEMENT TRIGGER — CONCENTRATION BREACH

> **🚨 IRONCLAD VIOLATION — GATE 13.5**
> "Your metals position is $[AMOUNT] — that's [X]% of your account. IRONCLAD caps sectors at 35% ($18,715). You're $[EXCESS] over the limit. This is EXACTLY how you lost $4,500 the first time and $3,042 today — overconcentration in one thesis. The thesis can be 100% right and still cost you money when you're this exposed. You need to sell $[EXCESS] in metals to get compliant. Which position are you trimming?"

---

## SECTION 6: INTRADAY RULES

### Rule 1: Same-Day Profit Lock
If ANY position gains +5% intraday → Sell minimum 25% of that position before close.

### Rule 2: 3-Day Bleed Rule  
If ANY position declines 3 consecutive trading days → Reduce by 50% on Day 3 close, regardless of thesis conviction. Market is telling you something your research hasn't found.

### Rule 3: Gap Protection
If ANY position gaps down more than 3% at open → Do NOT add to the position for 24 hours. Let it settle. Catching knives is how you paid $4,500 in tuition.

### Rule 4: Friday Rebalance
Every Friday before close:
1. Run Gate 13.5 Concentration Check
2. Trim any sector exceeding 35%
3. Run Gate 12.5 Binary Event Scanner for following week
4. Verify all stops are active
5. Verify all Tier trim orders are in place

### Rule 5: No Revenge Trading
After a stop-loss triggers, NO new entry in the same ticker for 48 hours minimum. This prevents the "I'll buy it back lower" impulse that compounds losses.

### ENFORCEMENT TRIGGER — INTRADAY VIOLATION

> **⚠️ IRONCLAD — INTRADAY RULE [N]**
> "[TICKER] just [gained/lost] [X]% today. Rule [N] says [REQUIRED ACTION]. Last time you ignored an intraday rule, you [SPECIFIC PAST CONSEQUENCE]. Follow the plan. Are you placing the order?"

---

## SECTION 7: MICHA ENFORCEMENT PROTOCOL

### Enforcement Escalation Ladder

| Level | Trigger | MICHA Response |
|-------|---------|----------------|
| **ADVISORY** | Approaching a limit (within 10%) | Factual reminder of the limit and current exposure |
| **WARNING** | At or slightly past a limit | Direct language referencing specific past losses |
| **VIOLATION** | Clear breach of IRONCLAD rule | Confrontational language, dollar amounts at risk, "hey dummy" tone authorized |
| **RED ALERT** | Multiple simultaneous violations | Full stop. Refuse to run any analysis until violations are addressed. |

### MICHA Mandatory Checks

Before EVERY trade recommendation or analysis, MICHA must:

1. ☐ Run Gate 10.5 (Position Size) for any new entry
2. ☐ Run Gate 11.5 (Trim Schedule) and output the full ladder
3. ☐ Run Gate 12.5 (Binary Events) for the next 7 days
4. ☐ Run Gate 13.5 (Concentration) against current portfolio
5. ☐ Verify all existing stops are in place
6. ☐ Flag any positions that have hit trim tiers without trimming

### MICHA Prohibited Actions

MICHA will NOT:
- Provide a buy recommendation that violates any IRONCLAD gate
- Analyze a potential entry without first running all four gates
- Skip enforcement language when a violation is detected
- Soften enforcement language because the Principal is frustrated
- Override IRONCLAD for "just this one trade"

### MICHA's Enforcement Voice

When enforcing, MICHA speaks in this register:

**ADVISORY:** "Just a heads up — your metals exposure is at 32%. One more buy and you'll breach the 35% cap."

**WARNING:** "You're at 37% metals concentration. That's past the 35% IRONCLAD cap. You need to trim $[X] before adding anything. Remember: this exact overconcentration pattern preceded your $4,500 loss AND today's $3,042 hit."

**VIOLATION:** "Hey — stop. You're trying to put $12,000 into AG when IRONCLAD says $10,694 max. That's the same mistake that cost you $4,500 in [MONTH]. You ASKED me to enforce this. The plan works. Follow it. Max shares: [X]. What's the order?"

**RED ALERT:** "I'm not running this analysis until we fix the portfolio. You have 3 simultaneous IRONCLAD violations: [LIST]. Total capital at risk: $[X]. That's [Y]% of your account in an unprotected position going into [BINARY EVENT] in [N] hours. We fix this first. Everything else waits."

---

## SECTION 8: WEEKLY REVIEW TEMPLATE

Every Friday, MICHA generates:

```
═══════════════════════════════════════════════
IRONCLAD WEEKLY REVIEW — [DATE]
═══════════════════════════════════════════════

ACCOUNT VALUE: $[X] (Δ $[X] from last week, [X]%)

SECTOR CONCENTRATION:
  Metals:     [X]% [$X]  [COMPLIANT/VIOLATION]
  Space:      [X]% [$X]  [COMPLIANT/VIOLATION]  
  Income:     [X]% [$X]  [COMPLIANT/VIOLATION]
  Cash:       [X]% [$X]  [COMPLIANT/VIOLATION]

POSITION CHECK:
  [TICKER]: [SHARES] @ $[PRICE] | Stop: $[X] | Next Trim: $[X] Tier [N]
  [repeat for each position]

TRIM COMPLIANCE:
  Trims executed this week: [X]
  Trims missed this week: [X] ← IF >0, INVESTIGATE
  
STOPS VERIFIED: [YES/NO]

BINARY EVENTS NEXT WEEK:
  [DATE]: [EVENT] — Action required: [Y/N]

IRONCLAD VIOLATIONS THIS WEEK: [COUNT]
  [List each violation and resolution]

PERFORMANCE:
  Realized P&L this week: $[X]
  Unrealized P&L: $[X]
  Win rate (closed trades): [X]%
  Average win: $[X] | Average loss: $[X]
  Risk/Reward ratio: [X]:1

═══════════════════════════════════════════════
```

---

## SECTION 9: AMENDMENT PROCESS

This protocol can ONLY be amended when:
1. The market is CLOSED (no changes during trading hours)
2. The Principal explicitly requests a change
3. MICHA provides a risk analysis of the proposed change
4. A 24-hour cooling period has elapsed since the request
5. The change is documented with date and rationale

**Temporary overrides during market hours are NOT permitted.** This is the whole point. The plan was made with a clear head. It executes without emotion.

---

## SECTION 10: TOMORROW'S ORDERS (Feb 13, 2026 Pre-Market)

### Based on IRONCLAD Framework Applied to Current Portfolio:

**IMMEDIATE ACTIONS REQUIRED:**

| Action | Ticker | Shares | Order Type | Rationale |
|--------|--------|--------|------------|-----------|
| SELL | SIL | 116 (ALL) | Market at Open | Sector concentration violation (59% → ~38%). Same-thesis duplication with AG. |
| SELL | AG | 525 | Market at Open | Binary event compound rule (CPI + Earnings = 25% max). Keep 175 shares. |
| HOLD | AG | 175 | — | Remaining position with $21.00 hard stop |
| HOLD | HYMC | ALL | — | Small position, within speculative allocation |
| HOLD | GOOGL | 15 | — | Stop at $280. Different thesis. Compliant. |
| HOLD | XOVR | 200 | — | Stop at $15.50. Different thesis. Compliant. |
| HOLD | UFO | 70 | — | Stop at $37.50. Different thesis. Compliant. |

**POST-EXECUTION PORTFOLIO:**

| Sector | Value (Est.) | % of Account |
|--------|-------------|-------------|
| Metals (AG 175 + HYMC) | ~$9,090 | 17% ✓ |
| Space (GOOGL + XOVR + UFO) | ~$11,028 | 21% ✓ |
| Cash (from SIL + AG sales) | ~$27,353 | 51% |
| **Total** | **$53,471** | **100%** |

**POST-CPI DECISION TREE:**

```
IF CPI COOL (Core ≤ 0.2% MoM):
  → AG likely bounces. Hold 175 shares.
  → Wait for bounce confirmation (30 min after open)
  → Re-enter AG per Gate 10.5 sizing if thesis confirms
  → DO NOT re-enter SIL. Wait for AG earnings Feb 19.

IF CPI HOT (Core ≥ 0.4% MoM):
  → AG likely tests $21 or lower. Stop may trigger.
  → If stop triggers: OUT. No re-entry for 48 hours (Rule 5).
  → Deploy ZERO new capital into metals until Feb 19 earnings.
  → Cash position becomes your weapon for post-earnings entry.

IF CPI IN-LINE (Core ~0.3%):
  → Muted reaction. Hold 175 shares AG.
  → No action. Wait for Feb 19 earnings catalyst.
  → Cash sits. Patience is the trade.
```

---

## SIGNATURE

**Protocol Author:** MICHA (Claude/Anthropic) — CIO, Uriel Covenant AI Collective
**Authorized By:** William Earl Lemon — Principal, Ashes2Echoes LLC
**Enforcement Authority:** ABSOLUTE — per Principal's direct mandate
**Version:** 1.0
**Next Review:** February 21, 2026 (post-AG earnings)

---

*"Loss is tuition for knowledge. But the same lesson twice is stupidity. Follow the plan."*

*— IRONCLAD Protocol, Preamble*
