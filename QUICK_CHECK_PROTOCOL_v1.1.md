# QUICK CHECK PROTOCOL v1.1

**Version:** 1.1 | **Parent Protocol:** METATRON v8.0.2  
**Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Updated:** January 23, 2026

---

## PURPOSE

QUICK CHECK provides rapid portfolio health assessment with **complete stop management calculations**. Designed for daily monitoring with actionable output.

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
- Key position prices (HYMC, PSLV, etc.)
- Commodity spot prices (silver, gold)
- VIX level
- Relevant market catalysts

---

## EXECUTION SEQUENCE

1. **Parse Screenshots** — Extract: Symbol, Shares, Current Price, Cost Basis, Current Stop
2. **Web Search** — Get live prices for key positions, commodities, VIX
3. **Calculate Stops** — Apply Stop Calculation Engine to ALL positions
4. **Validate Thesis** — Brief check on primary thesis catalysts
5. **Generate Output** — Complete report with ALL STOP MOVES table

---

## STOP CALCULATION ENGINE

### Market Cap Classification
| Cap Class | Market Cap | Protocol Stop |
|-----------|------------|---------------|
| Large Cap (LC) | >$10B | -5% to -8% |
| Mid Cap (MC) | $2B-$10B | -6% to -10% |
| Small Cap (SC) | <$2B | -8% to -12% |
| Crypto | All | -10% to -15% |

### Trailing Stop Rules
| Position Gain | Stop Adjustment |
|---------------|-----------------|
| 0-10% | Hold at initial protocol stop from cost |
| 10-20% | Raise to breakeven (cost basis) |
| 20-30% | Raise to lock 10% gain |
| 30%+ | Raise to lock 20% gain |
| 50%+ (parabolic) | Tighten to -8% from current price |

### Formula
```
Protocol_Stop = Current_Price × (1 - Cap_Percentage)
Gain_Lock_Stop = Cost_Basis × (1 + Lock_Percentage)
NEW_STOP = MAX(Protocol_Stop, Gain_Lock_Stop, Current_Stop)
```

### Example
```
Symbol: HYMC | Current: $49.78 | Cost: $40.55 | Gain: +22.76%
Cap: Small Cap → Protocol -8%
Protocol_Stop: $49.78 × 0.92 = $45.80
Gain_Lock (>20%): $40.55 × 1.10 = $44.61 (lock 10%)
Current_Stop: $41.50
NEW_STOP = MAX($45.80, $44.61, $41.50) = $45.80
Action: RAISE +$4.30
```

---

## OUTPUT FORMAT (MANDATORY)

```markdown
## QUICK CHECK — [DATE] @ [TIME] ET

| Metric | Value | Status |
|--------|-------|--------|
| **Combined Portfolio Value** | **$XX,XXX.XX** | ✅/⚠️/❌ |
| Target ($59,500) | ABOVE/BELOW by $X,XXX (+X.X%) | ✅/⚠️ |
| **Stops Triggered** | NONE / [List symbols] | ✅/❌ |
| **[Key Position] Current Price** | $XX.XX | 🚀/📈/📉 |
| **[Commodity] Spot Price** | $XX.XX/oz | Status |
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

[Brief thesis validation with web search citations]

**Catalysts Firing:**
- [Active catalyst 1]
- [Active catalyst 2]

---

### ALL STOP MOVES

**ACCOUNT -4898 (My Life in Currency)**

| Symbol | Shares | Current | Cost | Gain % | Current Stop | Protocol Stop | NEW STOP | Action |
|--------|--------|---------|------|--------|--------------|---------------|----------|--------|
| HYMC | 300 | $49.78 | $40.55 | +22.76% | $41.50 | SC -8% | **$45.80** | RAISE +$4.30 |
| PSLV | 124 | $32.91 | $31.05 | +6.00% | $30.00 | MC -6% | **$30.94** | RAISE +$0.94 |

**ACCOUNT -5267 (Individual Brokerage)**

| Symbol | Shares | Current | Cost | Gain % | Current Stop | Protocol Stop | NEW STOP | Action |
|--------|--------|---------|------|--------|--------------|---------------|----------|--------|
| AG | 250 | $24.97 | $21.13 | +18.20% | $21.50 | SC -8% | **$22.97** | RAISE +$1.47 |

---

### SUMMARY

| Action | Count | Symbols |
|--------|-------|---------|
| **RAISE** | X | SYM1, SYM2, ... |
| **LOWER** | X | SYM1, ... |
| **NEW** | X | SYM1, ... |
| **HOLD** | X | SYM1, ... |

---

### VERDICT

# ✅ GREEN — HOLDING
# ⚠️ YELLOW — REVIEW REQUIRED  
# ❌ RED — ACTION REQUIRED

[1 sentence summary + any immediate action items]

---

### ACTIONS TABLE (MANDATORY - ALWAYS LAST)

| Type | Symbol | Shares | Action | Price | Rationale |
|------|--------|--------|--------|-------|-----------|
| STOP | HYMC | — | RAISE | $45.80 | Trail per SC -8% protocol |
| STOP | PSLV | — | RAISE | $30.94 | Trail per MC -6% protocol |
| HOLD | GLD | 15 | MAINTAIN | — | Thesis intact |
```

---

## STATUS INDICATORS

### Portfolio Status
- ✅ GREEN: Above target, no stops triggered, thesis intact
- ⚠️ YELLOW: Within 5% of target OR stop approaching
- ❌ RED: Below target OR stop triggered OR thesis broken

### VIX Regime
- 🟢 <15: Risk-On — CONVICTION allowed
- 🟡 15-25: Neutral — STANDARD max
- 🔴 >25: Risk-Off — NIBBLE only
- ⛔ >35: Capitulation — NO new positions

### Thesis Status
- **INTACT**: All catalysts valid, no counter-evidence
- **WARNING**: Minor drift, monitor closely
- **BROKEN**: Core thesis invalidated, exit/reduce

---

## INTEGRATION

### With E*TRADE MCP (When Authenticated)
- Stops can be previewed/placed directly via API
- Use `etrade_preview_order` for each stop adjustment
- Execute with `etrade_place_order` after confirmation

### Without E*TRADE Auth (Manual Execution)
- Provide stop prices in ACTIONS TABLE
- User executes manually through E*TRADE web/app
- Verify execution in next QUICK CHECK

---

**END QUICK CHECK PROTOCOL v1.1**
