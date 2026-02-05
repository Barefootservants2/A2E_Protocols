# QUICK CHECK PROTOCOL v1.0

**Version:** 1.0 | **Parent Protocol:** METATRON v8.0  
**Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 23, 2026

---

## PURPOSE

QUICK CHECK provides rapid portfolio health assessment with actionable stop management. Designed for daily monitoring without full MARKET WATCH overhead.

---

## TRIGGER CONDITIONS

Execute QUICK CHECK when:
1. User uploads portfolio screenshots
2. User requests "QUICK CHECK"
3. Market opens (pre-market routine)
4. Significant market move (>2% index change)
5. User triggers "STOP CHECK"

---

## INPUT REQUIREMENTS

### Required
- Portfolio screenshots (both accounts) OR broker API connection
- Current date/time

### Gathered via Web Search
- Key position prices (HYMC, etc.)
- Commodity spot prices (silver, gold)
- VIX level
- Relevant market context

---

## OUTPUT FORMAT

```markdown
## QUICK CHECK — [DATE] @ [TIME] ET

| Metric | Value | Status |
|--------|-------|--------|
| **Combined Portfolio Value** | $XX,XXX.XX | ✅/⚠️/❌ |
| Target ($59,500) | ABOVE/BELOW by $X,XXX (+X.X%) | ✅/⚠️ |
| **Stops Triggered** | NONE / [List symbols] | ✅/❌ |
| **HYMC Current Price** | $XX.XX | Status |
| **Silver Spot Price** | $XX.XX/oz | Status |
| **VIX Level** | XX.XX | 🟢/🟡/🔴 |

---

### ACCOUNT BREAKDOWN

**-4898 (My Life in Currency):** $XX,XXX.XX
- Unrealized Gain: +$X,XXX.XX (+X.XX%)
- Day's Gain: +$X,XXX.XX (+X.XX%)

**-5267 (Individual Brokerage):** $XX,XXX.XX  
- Unrealized Gain: +$X,XXX.XX (+X.XX%)
- Margin Debit: -$XX,XXX.XX

---

### THESIS STATUS: [INTACT / WARNING / BROKEN]

[1-3 sentences on thesis validation with web search citations]

**Catalysts Firing:**
- [Bullet list of active catalysts]

---

### OPEN STOPS — [ALL INTACT / X TRIGGERED]

**Account -4898:**
| Symbol | Stop | Last | Buffer |
|--------|------|------|--------|
| XXX | $XX.XX | $XX.XX | +X.X% |

**Account -5267:**
| Symbol | Stop | Last | Buffer |
|--------|------|------|--------|
| XXX | $XX.XX | $XX.XX | +X.X% |

---

### VERDICT

# ✅ GREEN — HOLDING
# ⚠️ YELLOW — REVIEW REQUIRED
# ❌ RED — ACTION REQUIRED

[1 sentence summary]

---

### ACTIONS TABLE

| Type | Symbol | Shares | Action | Price | Rationale |
|------|--------|--------|--------|-------|-----------|
| STOP | XXX | — | RAISE | $XX.XX | Trailing per protocol |
| HOLD | XXX | XX | MAINTAIN | — | Thesis intact |
```

---

## STOP CALCULATION PROTOCOL

### Stop-Loss by Market Cap

| Cap Class | Definition | Initial Stop | Max Stop |
|-----------|------------|--------------|----------|
| Large Cap (LC) | >$10B | -5% from entry | -8% |
| Mid Cap (MC) | $2B-$10B | -6% from entry | -10% |
| Small Cap (SC) | <$2B | -8% from entry | -12% |
| Crypto | All | -10% from entry | -15% |

### Trailing Stop Rules

1. **Initial Entry:** Set stop at protocol level from cost basis
2. **Position Up >10%:** Trail stop to breakeven (cost basis)
3. **Position Up >20%:** Trail stop to lock 10% gain
4. **Position Up >30%:** Trail stop to lock 20% gain
5. **Parabolic Move (>50%):** Tighten to -8% from current

### Stop Action Types

| Action | When to Use |
|--------|-------------|
| **RAISE** | Current stop below protocol calculation |
| **SET** | No stop currently exists |
| **LOWER** | Rarely - only if thesis changes and wider stop needed |
| **REMOVE** | Position closed or converted to long-term hold |

---

## STATUS INDICATORS

### Portfolio Status
- ✅ GREEN: Above target, no stops triggered, thesis intact
- ⚠️ YELLOW: Within 5% of target OR single stop approaching
- ❌ RED: Below target OR stop triggered OR thesis broken

### VIX Regime
- 🟢 <15: Risk-On — CONVICTION positions allowed
- 🟡 15-25: Neutral — STANDARD max
- 🔴 >25: Risk-Off — NIBBLE only
- ⛔ >35: Capitulation — NO new positions

### Thesis Status
- **INTACT**: All catalysts still valid, no counter-evidence
- **WARNING**: Minor thesis drift, requires monitoring
- **BROKEN**: Core thesis invalidated, exit or reduce

---

## INTEGRATION NOTES

### With MARKET WATCH
- QUICK CHECK can substitute for full MARKET WATCH when:
  - No new positions being considered
  - Routine daily monitoring
  - Time-constrained check

### With E*TRADE MCP
- When authenticated, stops can be previewed/placed directly
- Without auth, provide manual execution instructions

---

**END QUICK CHECK PROTOCOL v1.0**