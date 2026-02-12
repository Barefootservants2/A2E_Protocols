# PHOENIX CLOSE v2.0 — SESSION TERMINATION PROTOCOL

**Version:** 2.0 | **Effective:** February 10, 2026
**Supersedes:** PHOENIX CLOSE v1.0
**Authority:** Principal Directive (post-$2,306 stop-loss lesson)

---

## TRIGGER

"CLOSE SESSION" spoken by Principal, OR session reaching natural completion.

---

## EXECUTION SEQUENCE

### Step 1: SESSION SUMMARY
- Duration and focus areas
- Key findings and analysis performed

### Step 2: DECISIONS MADE
- Every buy/sell/hold decision with rationale
- Stop-loss levels set or adjusted

### Step 3: ACTIONS TAKEN
- Trades executed with prices
- Files created or modified
- Protocols updated

### Step 4: FILES CREATED
- List all artifacts produced in session
- GitHub push status for each

### Step 5: GATE 19 — OVERNIGHT HOLD/FOLD ← NEW IN v2.0
**Mandatory when ANY position is held overnight.**

```
GATE 19: OVERNIGHT HOLD/FOLD
═══════════════════════════════════════════════════
CHECK 1: Silver futures price + direction (Globex/Asia)
CHECK 2: Shanghai premium (bullish if >5% over COMEX)
CHECK 3: COMEX inventory trend (draining = bullish)
CHECK 4: Any overnight catalyst risk (CPI, FOMC, earnings)
CHECK 5: Stop-loss levels verified — SHAKEOUT-PROOF?

DECISION: BINARY — HOLD OVERNIGHT or SELL TO CASH

IF HOLD:
  → Confirm stops are 15%+ below entry (NOT 11%)
  → Silver volatility exceeds 30% — tight stops = death
  → Set overnight alerts for major breaks

IF SELL TO CASH:
  → Execute before market close
  → Document re-entry triggers for next session
  → No shame in cash — it's a position too
```

**GATE 19 ORIGIN:** Feb 10, 2026 — Positions stopped out during overnight shakeout. PSLV triggered at $24.35 (11% stop). Temporary selloff reversed within hours. Loss: $2,306.97. Root cause: session closed without checking overnight risk environment. This gate prevents repeat.

### Step 6: PENDING ITEMS
- Open tasks for next session
- Deadlines and catalysts approaching

### Step 7: MEMORY UPDATES
- memory_user_edits for any persistent changes
- Flag anything that needs to survive between sessions

### Step 8: GITHUB STATUS
- Push all session artifacts to A2E_Protocols repo
- Confirm all protocol updates are committed
- No orphan documents left in /home/claude

---

## STOP-LOSS RULES (Updated v2.0)

| Asset Class | Minimum Stop | Rationale |
|-------------|-------------|-----------|
| Silver miners (AG, HYMC) | 15% | 30%+ volatility in Jan-Feb 2026 |
| Silver ETFs (PSLV, SIL, SIVR) | 12% | Lower beta than miners but still volatile |
| Broad market ETFs (VOO, QQQ) | 8% | Standard drawdown protection |
| Income ETFs (JEPI, SCHD) | 10% | Defensive positions |

**11% stops on silver = PROHIBITED.** This was the direct cause of the Feb 10 loss.

---

## RESTART PROMPT TEMPLATE

Every PHOENIX CLOSE must generate a restart prompt:

```
🔱 METATRON v10.3 — SESSION RESTART

CONTEXT: [Date] session closed. [Key state].

POSITIONS: [Current holdings with stops]

PENDING: [Open items]

TRIGGERS:
- "MARKET WATCH" = Full 19 gates + Gate 9.5 earnings
- "ORACLE" = Context only
- "CLOSE SESSION" = PHOENIX protocol

What's the play?
```

---

*"Loss is tuition for knowledge." — Principal's Creed*
*PHOENIX CLOSE v2.0 exists because $2,306 bought this lesson.*
