# AIORA GATE 9.5 — EARNINGS PROXIMITY CHECK
## Mandatory Blind Gate | Every MARKET WATCH Run

**Version:** 1.0
**Effective:** February 12, 2026
**Authority:** Principal Directive

---

## PURPOSE

Earnings reports move individual equities 5-15% in a single session. Any position held through earnings without deliberate awareness is an **unmanaged risk**. This gate ensures every MARKET WATCH scan includes earnings proximity awareness before any buy/hold/sell recommendation.

---

## GATE 9.5 EXECUTION (Runs Between Gate 9 and Gate 10)

### Step 1: EARNINGS DATE SCAN
For every direct holding AND top-5 holdings of any ETF position:
- Pull next confirmed earnings date
- Calculate trading days until report
- Flag any report within 10 trading days as **AMBER**
- Flag any report within 3 trading days as **RED**

### Step 2: EARNINGS TREND PULL
For any RED or AMBER flagged position:
- Last 4 quarters EPS: actual vs estimate (beat/miss/inline)
- Last 4 quarters Revenue: actual vs estimate
- Earnings surprise trend (improving or deteriorating)
- Post-earnings price action pattern (last 4 reports)

### Step 3: EARNINGS CLUSTER DETECTION
- If 2+ holdings report within the same 5-day window → **CLUSTER ALERT**
- Clusters compound risk — a sector-wide miss cascades across all related positions
- Cluster weeks require tighter stops OR reduced position size

### Step 4: RECOMMENDATION MODIFIER
- **No position adds within 3 trading days of earnings** without explicit Principal override
- **Stop-loss tightening** to 3% for any position entering earnings week
- **Post-earnings hold period**: No action for 24 hours after report (let dust settle)
- If earnings trend shows 2+ consecutive misses → **automatic sell recommendation**

---

## CURRENT PORTFOLIO EARNINGS CALENDAR

### DIRECT HOLDINGS

| Ticker | Company | Next Earnings | Days Out | Status | EPS Est |
|--------|---------|--------------|----------|--------|---------|
| **AG** | First Majestic Silver | **Feb 19, 2026** | **5 trading days** | 🔴 RED | $0.24 |
| **HYMC** | Hycroft Mining | **Mar 4, 2026** | 14 trading days | 🟡 AMBER | TBD |

### SIL ETF — TOP 5 HOLDINGS (46.83% of fund)

| Ticker | Weight | Company | Next Earnings | Days Out | Status |
|--------|--------|---------|--------------|----------|--------|
| **WPM** | 22.21% | Wheaton Precious Metals | **Mar 12, 2026** | ~20 trading days | ✅ CLEAR |
| **PAAS** | 11.73% | Pan American Silver | **Feb 18, 2026 AC** | **4 trading days** | 🔴 RED |
| **CDE** | 7.44% | Coeur Mining | **Feb 18, 2026 AC** | **4 trading days** | 🔴 RED |
| **HL** | 5.73% | Hecla Mining | **Feb 17, 2026 AC** | **3 trading days** | 🔴 RED |
| **FRES** | 5.72% | Fresnillo | TBD | — | — |

*AC = After Close | BO = Before Open*

### STOPPED OUT / NO LONGER HELD
| Ticker | Status |
|--------|--------|
| SIVR | Stopped out Feb 12 |
| PSLV | Stopped out Feb 12 |

---

## 🚨 CLUSTER ALERT: FEB 17-19, 2026

**CRITICAL EARNINGS CLUSTER DETECTED**

```
Mon Feb 17: HL (Hecla) — After Close → SIL #4 holding (5.73%)
           ⚠️ PRESIDENT'S DAY IS FEB 17 — MARKETS CLOSED
           HL likely shifts to Feb 18 pre-market or reports after hours Feb 14

Tue Feb 18: PAAS (Pan American) — After Close → SIL #2 holding (11.73%)
            CDE (Coeur Mining) — After Close → SIL #3 holding (7.44%)
            FOMC MINUTES ALSO RELEASE FEB 18

Wed Feb 19: AG (First Majestic) — TBA → DIRECT HOLDING (925 shares)
            CDE earnings call 11:00 AM ET
```

**Combined SIL exposure at risk:** HL + PAAS + CDE = 24.9% of SIL by weight
**Direct exposure at risk:** AG = ~$20,400 position

**This is the single highest-risk week for our silver portfolio in Q1 2026.**

---

## RECENT EARNINGS TREND DATA

### AG — First Majestic Silver (DIRECT HOLD)
| Quarter | EPS Est | EPS Actual | Surprise | Revenue Est | Revenue Actual | Stock Move |
|---------|---------|------------|----------|-------------|----------------|------------|
| Q3 2025 | $0.10 | $0.07 | **MISS -36%** | $429.8M | $285.1M | **-5.71%** |
| Q2 2025 | $0.06 | $0.06 | Inline | — | $268M (+94% YoY) | — |
| Q1 2025 | — | — | — | — | — | — |
| Q4 2024 | $0.09 | -$0.03 | **MISS** | — | — | — |

**⚠️ TREND: DETERIORATING.** Q3 revenue miss of 33%. Q4 2024 loss. However, Q2 2025 was record revenue. Mixed signals — production strong but costs and Mexico tax dispute creating drag. EPS estimate for Q4 2025 is $0.24 (significant jump expected from higher silver prices).

### HL — Hecla Mining (SIL #4)
| Quarter | EPS Est | EPS Actual | Surprise | Revenue |
|---------|---------|------------|----------|---------|
| Q3 2025 | $0.09 | $0.15 | **BEAT +67%** | $410M (record) |
| Q2 2025 | $0.05 | $0.09 | **BEAT +80%** | — |
| Q1 2025 | $0.05 | $0.05 | Inline | — |
| Q4 2024 | $0.06 | $0.02 | **MISS -67%** | — |

**✅ TREND: IMPROVING.** Three consecutive quarters of beats or inline. Record revenue, EBITDA, net income in Q3. Net leverage crushed from 1.8x to 0.3x. Silver cash costs negative $2.03/oz.

### CDE — Coeur Mining (SIL #3)
| Quarter | EPS Est | EPS Actual | Surprise | Revenue |
|---------|---------|------------|----------|---------|
| Q3 2025 | $0.25 | $0.23 | **MISS -8%** | $554.6M (+6.3% beat) |
| Q2 2025 | $0.18 | $0.20 | **BEAT +11%** | — |
| Q1 2025 | -$0.01 | $0.11 | **BEAT** | — |
| Q4 2024 | $0.12 | $0.11 | **MISS -8%** | — |

**✅ TREND: STRONG.** Record net income, EBITDA, FCF. $2M/day free cash flow. Acquiring New Gold (closing H1 2026). Projecting 2026 as "record year." EBITDA guidance >$1B.

### PAAS — Pan American Silver (SIL #2)
| Quarter | EPS Est | EPS Actual | Revenue |
|---------|---------|------------|---------|
| Q3 2025 | — | — | $884M (record, +24% YoY) |
| Q2 2025 | — | — | FCF $252M |

**✅ TREND: STRONG.** Record revenue. MAG Silver acquisition adding high-grade Juanicipio mine. AISC down to ~$15/oz silver. Cash position $910.8M. Dividend increased to $0.14/quarter.

### HYMC — Hycroft Mining (DIRECT HOLD)
| Quarter | EPS Est | EPS Actual | Revenue |
|---------|---------|------------|---------|
| Q3 2025 | -$0.22 | -$0.22 | Inline | $0 vs $693K est |

**⚠️ PRE-REVENUE EXPLORATION COMPANY.** No production revenue. Burning cash on exploration. This is a pure spec play on gold/silver deposit value, not an earnings story.

---

## TACTICAL IMPLICATIONS FOR FEB 13-19

1. **AG stop at $20 is correct** — gives room through earnings but exits if thesis fails
2. **SIL stop at $95-98** — the earnings cluster could whipsaw SIL 5-8% in either direction
3. **Do NOT add to AG before Feb 19 earnings** — this modifies the $5K split deployment plan
4. **The $5K post-CPI deployment should go to SIL, not AG** — diversify earnings risk
5. **Feb 18 is triple-loaded:** HL call + PAAS report + CDE report + FOMC minutes — expect extreme volatility in silver miners
6. **Feb 17 President's Day** — markets closed, HL may shift report date. Verify.

---

## GATE 9.5 PROTOCOL INTEGRATION

This gate slots into the AIORA 19-gate sequence:
- Gate 9: [existing gate]
- **Gate 9.5: EARNINGS PROXIMITY CHECK** ← NEW
- Gate 10: [existing gate]

**Execution frequency:** Every MARKET WATCH run
**Data refresh:** Weekly (earnings dates can shift)
**Override authority:** Principal only (for buying into earnings)

---

*Protocol authored by MICHA | Ashes2Echoes LLC | Uriel Covenant AI Collective*
*"Loss is tuition for knowledge."*
