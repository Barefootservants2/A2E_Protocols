# AUTOPSY — Red Flag Detection in Market Analysis

AUTOPSY is the detection layer. It catalogs the specific patterns where AI produces confident-sounding market analysis that should not be trusted. These are not edge cases. They are systematic failure modes that appear in the majority of AI-generated financial content.

This chapter may be the most valuable section of this book. Learning to detect bad analysis is more important than learning to generate good analysis — because bad analysis with high confidence is where money dies.

## The Red Flag Catalog

### RF-01: The Confidence Mismatch

**Pattern:** The output uses absolute language ("will," "certainly," "inevitably") for inherently uncertain outcomes.

**Example:**
> "Silver will reach $100 per ounce by Q3 2026 as the supply deficit continues to widen."

**Why It's Dangerous:** No market outcome is certain. Any analysis that presents a price target as inevitable has abandoned the analytical framework and entered prediction. AI does this because users reward confident answers with positive feedback, training the model toward overconfidence.

**Detection Rule:** Search the output for "will," "certainly," "inevitably," "guaranteed," "no doubt." Count them. More than two per page of analysis is a red flag. Replace with "if...then" conditional structures and re-evaluate whether the analysis still holds.

---

### RF-02: The Circular Citation

**Pattern:** AI "verifies" a claim by citing a source that itself cited the original claim, creating the appearance of independent confirmation where none exists.

**Example:** AI claims COMEX silver inventory is at 76.8M oz, cites a ZeroHedge article, which itself pulled the number from a Reddit post, which pulled it from a tweet, which misread the actual COMEX report. The real number might be 76.8M or it might not — the citation chain is contaminated.

**Detection Rule:** For any critical data point, trace the citation to the primary source. If you can't reach a .gov, exchange report, or company filing within two hops, the data is unverified.

---

### RF-03: The Narrative Anchor

**Pattern:** AI builds the entire analysis around a compelling narrative rather than data. The narrative is true — but the connection between the narrative and the trade is assumed, not proven.

**Example:** "The AI revolution requires massive amounts of silver for data center infrastructure, making silver a play on the AI boom." The narrative is true. But the actual silver consumption from AI data centers as a percentage of total silver demand is tiny compared to solar and electronics. The narrative anchors the analysis to an exciting story while the actual demand driver is mundane.

**Detection Rule:** Ask "what percentage of total demand does the narrative driver represent?" If the answer is less than 10%, the narrative is decoration, not analysis.

---

### RF-04: The Missing Denominator

**Pattern:** AI presents an absolute number that sounds impressive without providing the denominator that gives it context.

**Example:** "Fund inflows into silver ETFs reached $2.3 billion in Q1." Sounds massive. But total silver ETF AUM is $30B+. That's a 7.6% inflow rate — meaningful but not extraordinary. Without the denominator, the reader cannot evaluate significance.

**Detection Rule:** Every absolute number in a market analysis should have a denominator. Inflows vs. AUM. Deficit vs. total supply. Price change vs. historical range. If the denominator is missing, the analysis is incomplete.

---

### RF-05: The Survivorship Showcase

### RF-06: The Temporal Sleight

### RF-07: The False Consensus

### RF-08: The Hedged Nothing

### RF-09: The Authority Appeal

### RF-10: The Recency Trap

### RF-11: The Correlation-Causation Slide

### RF-12: The Precision Illusion

[AUTHOR NOTE: Red flags 05-12 will be developed to the same depth as 01-04
above. Each includes the pattern description, a real example from AI-generated
market analysis, an explanation of why it's dangerous, and a specific detection
rule. Targeting 15-20 total red flags for the market intelligence domain.

Additionally, this chapter will include a "Red Flag Scorecard" — a one-page
checklist the reader can use to scan any AI output for these patterns before
acting on it.]

\newpage
