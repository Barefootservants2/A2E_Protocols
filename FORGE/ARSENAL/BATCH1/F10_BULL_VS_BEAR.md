# FORGE ARSENAL — BATCH 1, PROMPT F10
## "Bull vs Bear Case" → Gate 7.5 Implementation
### Source: @ai.theshift (March 17, 2026)
### FORGE Treatment Date: April 6, 2026

---

## ORIGINAL (AS-IS)

"Present the strongest bull case and bear case for investing in {company}. Support both perspectives with financial data and industry context."

---

## FORGE-ENHANCED VERSION

**ROLE:** You are a senior equity analyst preparing a formal investment committee briefing. You have 20 years of experience and your reputation depends on the accuracy of this analysis. You will be challenged by adversarial committee members.

**TASK:** Construct the strongest possible bull thesis AND bear thesis for {company} as if two competing analysts are presenting to the same committee. Neither side is allowed to concede points to the other.

**CONSTRAINTS:**
- Each thesis must cite specific financial metrics (revenue CAGR, margin trajectory, FCF yield, debt/EBITDA, ROIC vs WACC)
- Each thesis must address at least 3 of these 5 dimensions: competitive moat, management execution, TAM trajectory, regulatory/geopolitical risk, valuation relative to growth
- The bull case MUST include its own "what would break this thesis" section
- The bear case MUST include "what would I need to see to reverse this view"
- Both cases must reference at least one contrarian data point that challenges their own position

**OUTPUT FORMAT:**
1. BULL THESIS (500-700 words): Position, evidence, catalyst timeline, and self-identified weakness
2. BEAR THESIS (500-700 words): Position, evidence, risk timeline, and reversal conditions
3. COMMITTEE VERDICT: Confidence score (0-100) for each side with explicit reasoning
4. WHAT THE CONSENSUS MISSES: One insight neither side adequately addresses

**META-INSTRUCTION:** Do not hedge. Do not say "it depends." Take positions. Defend them. Then break them.

---

## ASSAY SCORECARD

| Gate | Metric | Original | FORGE | Delta |
|------|--------|----------|-------|-------|
| 1 | Role Clarity | 0 | 9 | ∞ |
| 2 | Task Specificity | 3 | 9 | +200% |
| 3 | Constraint Architecture | 0 | 9 | ∞ |
| 4 | Output Format | 0 | 10 | ∞ |
| 5 | Data Anchoring | 1 | 8 | +700% |
| 6 | Adversarial Pressure | 0 | 9 | ∞ |
| 7 | Decision Utility | 2 | 9 | +350% |
| 8 | Anti-Hedge | 0 | 9 | ∞ |
| **TOTAL** | | **6/80 (7.5%)** | **72/80 (90%)** | **+825%** |

---

## AUTOPSY — 5 FAILURE MODES IN ORIGINAL

1. **SYMMETRY ILLUSION** — No mechanism to evaluate which case is stronger. Produces confirmation bias fuel.
2. **CITATION-FREE CLAIMS** — "Financial data" without specifying which metrics. AI cherry-picks different data for each side, making comparison impossible.
3. **NO EXIT CRITERIA** — Neither case says when to act or what would change the view.
4. **MISSING CONSENSUS GAP** — Most valuable insight (what both sides ignore) has no extraction mechanism.
5. **HEDGE DEFAULT** — Without anti-hedge instruction, produces "while there are risks, there is potential" mush.

---

## CIL INTEGRATION

Pipeline: HUNTER scan → Agent 1 (Claude bull) → Agent 2 (GPT-4o bear) → Agent 3 (Claude committee chair scoring) → Agent 4 (Llama contrarian check) → CIL PASS2 synthesis → IRONCLAD sizing → SENTINEL monitoring → GABRIEL overnight

---

## STATUS: COMPLETE — Ready for multi-model testing
