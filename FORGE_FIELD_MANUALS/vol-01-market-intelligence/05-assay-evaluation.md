# ASSAY — Methodology Evaluation for Market Analysis

ANVIL scores the structure. ASSAY evaluates the methodology. The distinction matters: an analysis can be well-sourced and well-structured (high ANVIL) but use the wrong analytical approach entirely (low ASSAY).

ASSAY asks a single question: **Would a qualified professional in this domain accept the methodology used to reach this conclusion?**

## The ASSAY Framework

### Test 1 — Appropriate Tool Selection

Is the analytical method suited to the question being asked?

**Pass Example:** Using discounted cash flow analysis to value a growth company with predictable revenue streams.

**Fail Example:** Using P/E ratio comparison to evaluate a pre-revenue biotech. The tool doesn't match the subject. AI will do this confidently and produce a number that looks precise but is meaningless.

**Market Intelligence Application:** When AI analyzes a commodity thesis using only equity valuation metrics (P/E, P/B) without addressing the physical supply-demand balance, it has selected the wrong tool. Commodities move on physical markets first and equity markets second.

### Test 2 — Assumption Transparency

Are the assumptions stated explicitly, or are they embedded invisibly in the analysis?

**The Hidden Assumption Catalog for Market Analysis:**

| Hidden Assumption | Where It Hides | How to Detect |
|---|---|---|
| Mean reversion | "Prices will normalize" | Ask: what structural change prevents reversion? |
| Trend continuation | "The rally has legs" | Ask: what ends this trend? |
| Rational markets | "The market will price this in" | Ask: when? Markets can stay irrational longer than you can stay solvent. |
| Historical analogy | "Just like 2011..." | Ask: what's different this time? (There is always something different.) |
| Single causation | "Silver is up because of the deficit" | Ask: what other factors moved simultaneously? |

### Test 3 — Falsifiability

Does the analysis make claims that can be proven wrong? If every statement is hedged beyond testability, the methodology fails ASSAY regardless of how sophisticated it sounds.

**Pass:** "If DXY holds above 103 for two consecutive weeks while 10Y yields rise above 4.5%, the metals thesis is invalidated."

**Fail:** "Metals may face headwinds if macro conditions deteriorate, though supportive fundamentals could offset near-term pressure."

The second statement cannot be wrong. It has predicted nothing. It is analytical decoration.

### Test 4 — Scope Calibration

Is the methodology proportionate to the question? A $5,000 tactical trade does not require the same analytical depth as a $50,000 thesis position. AI defaults to maximum verbosity regardless of scope. ASSAY checks whether the methodology matches the stakes.

### Test 5 — Expert Consensus Check

Would three independent professionals in this domain, reviewing only the methodology (not the conclusion), agree that the approach is sound?

This is the test our multi-agent architecture was built to perform. When URIEL, HANIEL, and COLOSSUS independently evaluate the same data and converge on methodology — not just conclusion — ASSAY confidence increases. When they diverge on methodology, the analysis requires human arbitration before proceeding.

## ASSAY Scoring

| Grade | Criteria |
|-------|----------|
| VALIDATED | All 5 tests pass. Methodology is sound. Proceed to action evaluation. |
| CONDITIONAL | 3-4 tests pass. Methodology is usable with stated caveats. Identify which tests failed and assess impact. |
| SUSPECT | 1-2 tests pass. Methodology has fundamental issues. Do not use for position decisions without rework. |
| FAILED | 0 tests pass. Methodology is inappropriate for the question. Discard and restart. |

[AUTHOR NOTE: This chapter will include 2-3 full ASSAY evaluations of real
market analyses — one VALIDATED, one CONDITIONAL showing the rework process,
and one FAILED showing why the methodology was rejected despite confident
AI output.]

\newpage
