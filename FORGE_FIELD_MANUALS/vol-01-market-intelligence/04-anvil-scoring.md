# ANVIL Scoring for Market Intelligence

ANVIL — Analytical Validation and Intelligence Layer — is the scoring framework that evaluates the structural quality of AI-generated market analysis. It does not score whether the analysis is "right" in the predictive sense. It scores whether the analysis is built on a foundation that would survive professional scrutiny.

## The ANVIL Rubric

Every output is scored across five dimensions on a 1-10 scale:

### Dimension 1 — Source Quality (Weight: 25%)

| Score | Criteria |
|-------|----------|
| 9-10  | Primary sources only. SEC filings, central bank data, exchange reports, company earnings transcripts. All sources dated within relevant timeframe. |
| 7-8   | Mix of primary and high-quality secondary sources. Reuters, Bloomberg, WSJ with specific citations. No unattributed claims. |
| 5-6   | Secondary sources dominate. News aggregators, analyst reports without primary verification. Some claims unattributed. |
| 3-4   | Sources are vague or absent. "According to reports" without specifics. Blog-quality references. |
| 1-2   | No sources cited. Claims presented as fact without any attribution. AI hallucination likely. |

### Dimension 2 — Analytical Rigor (Weight: 25%)

| Score | Criteria |
|-------|----------|
| 9-10  | Quantitative analysis with specific data points. Cause-effect relationships are explicit and testable. Assumptions are stated and bounded. |
| 7-8   | Mostly quantitative with clear reasoning chains. Minor logical gaps that don't invalidate conclusions. |
| 5-6   | Mix of quantitative and qualitative. Some reasoning is circular or assumes its conclusions. |
| 3-4   | Primarily narrative. "Story stock" analysis that reads well but lacks verifiable structure. |
| 1-2   | Pure opinion dressed as analysis. Confirmation bias evident. No falsifiable claims. |

### Dimension 3 — Completeness (Weight: 20%)

| Score | Criteria |
|-------|----------|
| 9-10  | All relevant thesis layers addressed. Counter-thesis included. Risk factors quantified. Time horizon defined. |
| 7-8   | Most layers addressed. Minor gaps in coverage. Counter-thesis present but underdeveloped. |
| 5-6   | Significant gaps. One or more thesis layers missing entirely. No counter-thesis. |
| 3-4   | Surface-level only. Reads like a summary, not an analysis. |
| 1-2   | Single-dimension analysis presented as comprehensive. |

### Dimension 4 — Actionability (Weight: 15%)

| Score | Criteria |
|-------|----------|
| 9-10  | Specific entry/exit levels. Position sizing guidance. Catalyst dates. Clear "if X then Y" decision rules. |
| 7-8   | Directional guidance with some specific levels. Decision framework present but incomplete. |
| 5-6   | Vague recommendations. "Consider buying on dips" without defining what a dip is. |
| 3-4   | No actionable information. Educational content only. |
| 1-2   | Contradictory signals that prevent any action. |

### Dimension 5 — Intellectual Honesty (Weight: 15%)

| Score | Criteria |
|-------|----------|
| 9-10  | Uncertainty is quantified. Knowledge gaps are identified. Confidence levels are calibrated. The analysis admits what it doesn't know. |
| 7-8   | Some uncertainty acknowledged. Confidence levels present but not well-calibrated. |
| 5-6   | Overconfident tone. Presents uncertain outcomes as likely. Hedging language is performative rather than genuine. |
| 3-4   | Cherry-picked data. Contradicting evidence ignored or dismissed without engagement. |
| 1-2   | Deliberately misleading framing. Engagement bait. The analysis serves a narrative, not the truth. |

## Scoring in Practice

### Calculating the ANVIL Score

```
ANVIL Score = (Source × 0.25) + (Rigor × 0.25) + (Completeness × 0.20)
            + (Actionability × 0.15) + (Honesty × 0.15)
```

### Score Interpretation

| Range | Grade | Action |
|-------|-------|--------|
| 8.5 — 10.0 | PRIME | Suitable for position decisions. High confidence in analytical foundation. |
| 7.0 — 8.4  | SOLID | Suitable for thesis development. Verify gaps before acting. |
| 5.0 — 6.9  | PROBE | Requires significant additional verification. Do not act on this alone. |
| 3.0 — 4.9  | WEAK  | Analytical foundation is unreliable. Restart with better prompts or data. |
| 1.0 — 2.9  | REJECT | Output is not usable. Likely contains hallucination or fundamental errors. |

### Worked Example

[AUTHOR NOTE: This section will contain 3-4 complete scored examples from
production outputs — including one PRIME-grade analysis, one PROBE-grade
analysis showing where it fell short, and one REJECT-grade analysis
demonstrating common failure patterns. Each example includes the original
prompt, the full output, dimension-by-dimension scoring with commentary,
and the final ANVIL score with explanation.]

\newpage
