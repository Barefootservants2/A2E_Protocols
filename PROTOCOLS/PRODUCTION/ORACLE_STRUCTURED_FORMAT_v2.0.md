# ORACLE — STRUCTURED QUERY FORMAT v2.0
## McKinsey Macro Brief Standard + Full ORACLE Protocol Upgrade
**Author:** MICHA, CIO — Uriel Covenant  
**Date:** March 26, 2026  
**Amends:** METATRON v10.7 Section 5.2 (ORACLE Mode)  
**Source Inspiration:** McKinsey Global Institute Macro Brief prompt — Template 10, FORGE Financial Domain Templates v1.0  
**Classification:** PRODUCTION — ACTIVE PROTOCOL  

---

## PROBLEM WITH ORACLE v1 (CURRENT STATE)

The current ORACLE definition in METATRON v10.7 Section 5.2 is minimal:

```
ORACLE mode:
  1. Pull H37-DXY current signal
  2. Pull H38-YIELD current signal  
  3. Note correlation status
  4. No kill switch execution
  5. If adverse, recommend full MARKET WATCH
```

This is a correlation check, not a macro analysis. It answers "is the correlation environment hostile?" but not "what is the full macro picture and how does it affect our positions right now?"

The result: ORACLE runs have been inconsistent. Sometimes we get a 3-sentence correlation note. Sometimes we get a full multi-section analysis. Neither the Principal nor MICHA knows what a complete ORACLE run should look like because there is no standard deliverable list.

**This amendment fixes that.**

---

## ORACLE v2.0 — FULL DEFINITION

### What ORACLE Is

ORACLE is the context-only macro intelligence run. It does NOT execute trades. It does NOT run the full 11-sector HUNTER scan. It DOES produce a structured macro brief that tells the Principal exactly where we stand before any position decision.

**When ORACLE fires:**
- Principal asks "what's going on with [asset/sector/market]"
- Before any position entry above $5,000
- Before any earnings hold/trim decision
- At session start when market conditions may have shifted
- Any time the word "ORACLE" is used

**What ORACLE does NOT do:**
- Execute or recommend specific orders (that's MARKET WATCH)
- Run the full H1-H42 module battery (that's HUNTER)
- Auto-trigger Kill Switch (that's SENTINEL)

---

## THE ORACLE v2.0 STRUCTURED DELIVERABLE

Every ORACLE run produces exactly these 10 sections. No more freeform. Every run comparable. Every run archivable.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔮 ORACLE — MACRO INTELLIGENCE BRIEF
[DATE] | [TIME ET] | MICHA v10.7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1: GATE 9 CORRELATION STATUS
─────────────────────────────────────
H37-DXY:    [DOLLAR_WEAKENING / NEUTRAL / DOLLAR_STRENGTHENING]
H38-YIELD:  [YIELD_FALLING / NEUTRAL / YIELD_ELEVATED / YIELD_CRITICAL]
H39-FLOW:   [INSTITUTIONAL_ENTRY / NEUTRAL / INSTITUTIONAL_EXIT]

CORRELATION VERDICT: [CLEAR / WARNING / ADVERSE / KILL SWITCH]
[One sentence explaining what the combination means for metals/thesis]

SECTION 2: RATE ENVIRONMENT
────────────────────────────
Fed Funds Rate: [X.XX%]
10Y Yield: [X.XX%] | Direction: [RISING / FALLING / FLAT]
2Y-10Y Spread: [X.XX% | INVERTED / NORMAL / STEEP]
FOMC Next: [DATE] | Market pricing: [CUT / HOLD / HIKE]
Rate Impact: [Which of our rings benefit / suffer from current trajectory]

SECTION 3: DOLLAR + CURRENCY
──────────────────────────────
DXY: [XX.XX] | [ABOVE/BELOW] 100 | Direction: [RISING/FALLING]
EUR/USD: [X.XXXX] | USD/JPY: [XXX.XX]
Dollar Impact on Metals: [HEADWIND / NEUTRAL / TAILWIND]
Dollar Impact on Int'l Holdings: [Note if any IRA positions are affected]

SECTION 4: INFLATION + GROWTH
───────────────────────────────
Last CPI: [X.X%] YoY | Direction: [RISING / FALLING / FLAT]
GDP Last Quarter: [X.X%] | Forecast: [X.X%]
Consumer Spending: [STRONG / SOFTENING / WEAK]
Earnings Season Score: [Beat rate % | Current quarter growth rate]

SECTION 5: GEOPOLITICAL + POLICY
──────────────────────────────────
Active: [Key conflicts, escalation/de-escalation status]
Trade Policy: [Current tariff environment, pending changes]
Legislative Pipeline: [Bills affecting our positions]
Iran Status: [Current status — directly affects oil/defense thesis]
Impact Rating: [HIGH / MEDIUM / LOW impact on A2E positions]

SECTION 6: PORTFOLIO ALIGNMENT
────────────────────────────────
Ring 1 (SGOV/dividend core): [Rate environment assessment]
Ring 2 (PSLV/metals): [Macro environment FAVORABLE/NEUTRAL/ADVERSE]
Ring 3 (defense/structural): [Current catalyst status for XLE, ITA, LHX, PLTR]
Ring 4 (tactical): [Active positions vs macro backdrop]
Ring 5 (lottery): [Any active lottery positions noted]

SECTION 7: SECTOR ROTATION SIGNAL
────────────────────────────────────
Money flowing INTO:  [Top 2 sectors]
Money flowing FROM:  [Top 2 sectors]
Rotation Implication: [Does this help or hurt our current allocation?]

SECTION 8: SPECIFIC ADJUSTMENTS RECOMMENDED
─────────────────────────────────────────────
[Ranked list — only if warranted. If no adjustments needed, state HOLD ALL.]
1. [Ticker]: [Specific action with rationale]
2. [Ticker]: [Specific action with rationale]
[etc.]

SECTION 9: TIMELINE — WHEN THESE FACTORS HIT
───────────────────────────────────────────────
[Next 7 days]: [Key events that could move markets]
[Next 30 days]: [Macro inflection points to watch]
[Next 90 days]: [Structural changes developing]

SECTION 10: ORACLE VERDICT
────────────────────────────
POSTURE: [RISK-ON / NEUTRAL / RISK-OFF]
CONFIDENCE: [X/10]
ONE SENTENCE: [The single most important thing the Principal needs to know right now]

UPGRADE TO MARKET WATCH? [YES / NO] — [Reason]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ORACLE TRIGGER LANGUAGE

When the Principal says any of these, ORACLE fires automatically:

| Trigger | ORACLE Fires |
|---------|-------------|
| "Run ORACLE" | Full 10-section brief |
| "What's the macro look like?" | Full 10-section brief |
| "ORACLE on [asset]" | Full brief, Section 6 focused on that asset |
| "What's going on out there?" | Full 10-section brief |
| "Before I deploy..." | Sections 1, 6, 8, 10 minimum |
| "Should I hold through [event]?" | Sections 1, 5, 8, 10 |
| "Quick macro check" | Sections 1, 7, 10 only |

---

## DATA SOURCES FOR EACH SECTION

ORACLE runs on live web search. Every section pulls current data, not memory.

| Section | Primary Source | Search Query Pattern |
|---------|---------------|---------------------|
| 1. Gate 9 | Yahoo Finance | "DXY today" + "10Y yield today" + "SLV GLD volume" |
| 2. Rates | Fed + CME FedWatch | "FOMC rate decision" + "10Y 2Y Treasury today" |
| 3. Dollar | Yahoo Finance | "DXY today" + "EUR USD today" |
| 4. Inflation | BLS + GDP reports | "CPI latest" + "GDP growth latest" |
| 5. Geopolitical | News search | "Iran war status today" + "trade policy today" |
| 6. Portfolio | Memory + positions | Apply to last known positions from session |
| 7. Sector rotation | ETF flows | "XLK XLF XLI XLE sector performance week" |
| 8. Adjustments | Synthesis | Derived from sections 1-7 |
| 9. Timeline | Calendar + news | "economic calendar next 30 days" |
| 10. Verdict | Synthesis | Derived from all sections |

**Minimum searches per ORACLE run: 6**  
**Target completion time: 4-6 minutes**

---

## ORACLE ARCHIVE STANDARD

Every ORACLE run gets archived. No exceptions.

**File format:** `AIORA/ORACLE/[YYYY-MM-DD]-ORACLE-[POSTURE].md`  
**Example:** `AIORA/ORACLE/2026-03-26-ORACLE-RISK-OFF.md`

**Why archive matters:** After 6 months of structured ORACLE runs, we have a time-series of macro assessments. We can look back and answer "what was the ORACLE posture the week before the March 3 loss?" — and use that to refine the Kill Switch pre-alert thresholds.

---

## ORACLE vs MARKET WATCH — CLEAR DISTINCTION

| | ORACLE | MARKET WATCH |
|--|--------|-------------|
| Trigger | "What's the macro?" | "Run MARKET WATCH" or auto-scheduled |
| Scope | Macro context only | Full 11-sector + position analysis |
| Modules | H37/H38/H39 + web search | H1-H42 full battery |
| Output | 10-section brief | Full HUNTER report + signals |
| Time | 4-6 minutes | 15-20 minutes |
| Action items | Recommendations only | Signals + gate-qualified entry/exit |
| Kill Switch | Advisory only | Auto-execution capable |
| Use case | "Before I do something" | "Run the full protocol" |

---

## INTEGRATION WITH EXISTING PROTOCOLS

**METATRON v10.7:** This document amends Section 5.2. ORACLE mode now = 10-section brief above, not the 5-step correlation check.

**IRONCLAD v2.1:** Sections 1 and 8 of every ORACLE run are the pre-entry correlation check required before any metals entry above $5K.

**PHOENIX:** Every PHOENIX session close should note last ORACLE posture. Morning Brief from GABRIEL should include "Last ORACLE: [DATE] — [POSTURE]" in the header.

**FORGE Financial Templates:** Template 10 (McKinsey Macro) = the ORACLE structured format in persona-prompt form. Running Template 10 through CIL = enhanced ORACLE with 5-agent synthesis.

**HUNTER 11-Sector Scan:** ORACLE Section 7 (Sector Rotation) is a compressed version of the HUNTER scan Phase 3 synthesis table. ORACLE gives a 2-sector signal. HUNTER gives the full 11-sector picture. ORACLE first, HUNTER if ORACLE shows rotation opportunity worth investigating.

---

## VERSION HISTORY

| Version | Date | Change |
|---------|------|--------|
| v1.0 | METATRON v10.7 | 5-step correlation check only |
| **v2.0** | **2026-03-26** | **Full 10-section structured brief. McKinsey macro standard. Archive protocol. Clear trigger language. Section-level data sources.** |

---

*ORACLE Structured Format v2.0*  
*Ashes2Echoes LLC | Uriel Covenant AI Collective*  
*Filed: PROTOCOLS/PRODUCTION/ORACLE_STRUCTURED_FORMAT_v2.0.md*  
*Amends: METATRON v10.7 Section 5.2*

