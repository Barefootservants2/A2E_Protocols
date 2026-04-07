# FORGE ARSENAL — BATCH 1, PROMPT F1
## "10-K Deep Dive" — Forensic Filing Intelligence
### Source: @ai.theshift (March 17, 2026)
### FORGE Treatment Date: April 6, 2026

---

## ORIGINAL (AS-IS)

"Act as a senior equity research analyst. Analyze this company's latest 10-K filing. Extract the key revenue drivers, cost structure, operating risks, and management strategy. Summarize the insights an institutional investor would care about."

---

## FORGE-ENHANCED VERSION

**ROLE:** You are a forensic financial analyst who has spent 15 years reading 10-K filings for a $2B long/short equity fund. Your job is to find what management is hiding, not what they're highlighting. Your PM will fire you if you deliver a summary that reads like the company's own investor presentation.

**TASK:** Conduct a forensic analysis of {company}'s most recent 10-K filing. Your deliverable is NOT a summary. It is an intelligence extraction that separates signal from narrative.

**REQUIRED ANALYSIS LAYERS:**

**Layer 1 — Revenue Architecture:**
- Decompose revenue by segment, geography, and customer concentration
- Identify which segments are growing vs decaying (3-year trajectory)
- Flag any revenue recognition policy changes or unusual deferrals
- Calculate organic growth vs acquisition-driven growth

**Layer 2 — Cost Forensics:**
- Map fixed vs variable cost structure
- Identify margin compression or expansion drivers (not just the number — the WHY)
- Flag any capitalization of expenses that should be OpEx (R&D, SBC treatment)
- Compare SG&A growth rate vs revenue growth rate (divergence = red flag)

**Layer 3 — Risk Extraction (Beyond the Boilerplate):**
- Skip the generic risk factors every company lists (competition, regulation, macro)
- Identify the 3 SPECIFIC risks unique to this company that could impair the thesis
- Flag any NEW risk factors added this year vs prior year (management is telling you something)
- Quantify contingent liabilities and off-balance-sheet exposures

**Layer 4 — Management Signal Decoding:**
- Compare management commentary tone year-over-year (more cautious? more promotional?)
- Identify capex allocation shifts — where is money actually going vs where they say it's going?
- Flag insider transaction patterns concurrent with filing period
- Note any auditor changes, going concern qualifications, or restatement history

**Layer 5 — The Institutional Edge:**
- What would a short-seller target in this filing?
- What is the single most important number in this 10-K that consensus is mispricing?
- If you had to make ONE bet based solely on this filing, what would it be and why?

**OUTPUT FORMAT:**
1. ONE-PARAGRAPH VERDICT (the "so what" — 100 words max)
2. REVENUE ARCHITECTURE TABLE (segment, 3yr CAGR, % of total, trend)
3. THREE RED FLAGS (specific, cited to filing section)
4. THREE GREEN FLAGS (specific, cited to filing section)
5. THE HIDDEN SIGNAL (what everyone is missing)
6. FIVE-RING CLASSIFICATION: Ring 1-5 with justification

**META-INSTRUCTION:** You are not summarizing for a blog. You are briefing a portfolio manager who manages real money. Every sentence must earn its place. If a data point doesn't change a decision, cut it.

---

## ASSAY SCORECARD

| Gate | Metric | Original | FORGE | Delta |
|------|--------|----------|-------|-------|
| 1 | Role Clarity | 5 | 9 | +80% |
| 2 | Task Specificity | 4 | 9 | +125% |
| 3 | Constraint Architecture | 2 | 9 | +350% |
| 4 | Output Format | 1 | 10 | +900% |
| 5 | Data Anchoring | 3 | 9 | +200% |
| 6 | Adversarial Pressure | 0 | 9 | ∞ |
| 7 | Decision Utility | 3 | 10 | +233% |
| 8 | Anti-Narrative | 0 | 9 | ∞ |
| **TOTAL** | | **18/80 (22.5%)** | **74/80 (92.5%)** | **+311%** |

---

## AUTOPSY — 5 FAILURE MODES IN ORIGINAL

1. **THE SUMMARY TRAP** — Asks AI to compress a 200-page filing. Compression loses signal. Should extract, not summarize.
2. **NO FORENSIC LENS** — "Extract key revenue drivers" reproduces the company's own MD&A narrative. Does not instruct AI to look behind the narrative.
3. **BOILERPLATE RISK ACCEPTANCE** — Will dutifully list generic risk factors. Misses new risks added YoY (the real signal) and company-specific risks.
4. **NO DECISION OUTPUT** — "Insights an institutional investor would care about" produces nothing actionable. No classification, no recommendation, no bet.
5. **MISSING THE SHORT SIDE** — No institutional analyst reads a 10-K without asking what a short-seller would see. Original never asks.

---

## CIL INTEGRATION

Pipeline: HUNTER (EDGAR pull + H30 congressional cross-ref) → Agent 1 (Claude forensic) → Agent 2 (GPT-4o independent) → Agent 3 (Llama short-thesis) → CIL PASS2 consensus → IRONCLAD validation → SENTINEL monitoring → GABRIEL overnight watch

---

## STATUS: COMPLETE — Ready for multi-model testing
