# Foundation Prompts

Foundation prompts establish context, define scope, and produce first-pass analytical outputs. They are the starting position — not the destination.

Each prompt in this chapter includes:

- **The prompt itself** — copy-ready, with bracketed variables for your specific inputs
- **What it does** — a one-sentence explanation of the analytical function
- **ANVIL score range** — the expected quality range when used correctly
- **Common failure modes** — what goes wrong and how to detect it
- **Example output** — a real result from production use, scored and annotated

## Section 2.1 — Thesis Construction Prompts

### FP-01: Initial Thesis Framing

**Purpose:** Establish a structured investment thesis from a raw observation or hunch.

```
I am evaluating [ASSET/SECTOR] as a potential investment thesis.

Before forming any opinion, analyze the following layers independently:

1. SUPPLY: Current production levels, trajectory, and constraints
2. DEMAND: Primary consumption drivers, growth rates, and substitution risk
3. MACRO: Currency, interest rate, and geopolitical factors affecting price
4. SENTIMENT: Current market positioning, fund flows, and narrative
5. TECHNICAL: Price structure, support/resistance, and momentum indicators
6. CATALYST: Near-term events that could accelerate or invalidate the thesis

For each layer, provide:
- Current state with specific data points and sources
- Direction of travel (improving, stable, deteriorating)
- Confidence level (HIGH/MEDIUM/LOW) with reasoning
- The single most important thing I should verify independently

Do not provide a buy/sell recommendation. Provide the analytical foundation
for me to make my own decision.
```

**ANVIL Score Range:** 7.2 — 8.8 (depends on data availability for the asset)

**Common Failure Mode:** AI will frequently produce a sixth layer (CATALYST) that lists vague future possibilities rather than specific, dated, verifiable events. If the catalyst section contains phrases like "potential for" or "could possibly" without specific dates or filings, the output has failed this layer. Re-prompt with: "List only catalysts with confirmed dates, filing deadlines, or scheduled events."

**Example Output:** [Scored example from silver thesis — see Section 7.1]

---

### FP-02: Counter-Thesis Challenge

**Purpose:** Force AI to argue against an existing thesis before you commit capital.

```
I hold the following investment thesis:

[PASTE YOUR THESIS SUMMARY]

Your job is to destroy this thesis. Argue against every layer.
Identify the specific conditions under which this thesis fails completely.

For each counter-argument:
- Cite specific data that contradicts the thesis
- Identify the probability of the failure scenario (with reasoning)
- Name the leading indicator that would signal this failure is materializing
- State at what price level or data point the thesis becomes indefensible

Do not hedge. Do not say "on the other hand." Attack the thesis as if your
job depends on proving it wrong.
```

**ANVIL Score Range:** 6.5 — 9.2 (wide range — AI frequently pulls punches on counter-thesis)

**Common Failure Mode:** The most dangerous failure mode here is the "yes-but" counter-thesis — where AI appears to challenge the thesis but actually reinforces it by presenting weak counter-arguments that are easy to dismiss. If every counter-argument ends with a qualifier that neutralizes it, the output has failed. Re-prompt with: "Your previous counter-thesis was too weak. Give me the counter-arguments that would make a short seller confident."

---

### FP-03: Data Verification Chain

**Purpose:** Cross-reference a specific claim from AI output against verifiable sources.

```
The following claim was made in an AI-generated analysis:

"[PASTE SPECIFIC CLAIM]"

Verify this claim by:
1. Identifying the original data source (not a secondary article)
2. Confirming the specific number, date, or fact cited
3. Checking whether the data is current or stale
4. Identifying whether the claim represents the data accurately
   or mischaracterizes it (cherry-picking, out of context, etc.)
5. Finding at least one contradicting data point if one exists

Cite your sources with URLs. If you cannot verify the claim from
primary sources, say so explicitly.
```

**ANVIL Score Range:** 8.0 — 9.5 (high floor — verification is what AI does well)

**Common Failure Mode:** AI will sometimes "verify" a claim by finding a secondary source that repeats the same claim, creating a circular citation. Check that the verification source is independent of the original claim's source.

---

### FP-04: Sector Landscape Scan

### FP-05: Earnings Catalyst Pre-Position

### FP-06: Correlation Map Builder

### FP-07: Filing and Disclosure Monitor

### FP-08: Watchlist Filer Activity Scan

### FP-09: Cost Basis Scenario Modeler

### FP-10: Risk-Adjusted Position Sizer

---

[AUTHOR NOTE: Prompts FP-04 through FP-10 will be fully developed with the same
depth as FP-01 through FP-03 above. Each includes the prompt text, ANVIL score
range, common failure modes, and a scored example. Total foundation prompts
targeting 25-30 for this chapter.]

\newpage
