# VERIFICATION LAYER v1.0 — SYSTEMATIC FACT-CHECKING
## Effective: January 31, 2026
## Classification: PRODUCTION — MANDATORY PRE-OUTPUT CHECK

---

## CORE PHILOSOPHY

**The Problem:** AI outputs often contain:
- Fabricated statistics
- Outdated information presented as current
- Confident statements without sources
- Assumed data that was never retrieved

**The Solution:** Every factual claim must pass verification BEFORE delivery.

---

## SECTION 1: CLAIM CLASSIFICATION

### 1.1 Claim Types

| Type | Definition | Verification Required |
|------|------------|----------------------|
| **PRICE/QUOTE** | Any current market data | MANDATORY — Must retrieve |
| **HISTORICAL FACT** | Past events with dates | HIGH — Cross-reference if uncertain |
| **STATISTICAL** | Percentages, ratios, counts | MANDATORY — Source or methodology |
| **ATTRIBUTION** | "Company X announced..." | MANDATORY — Source required |
| **ANALYTICAL** | Interpretation of data | STATE AS INTERPRETATION |
| **OPINION** | Subjective assessment | STATE AS OPINION |

### 1.2 Verification Tiers

**TIER 1: MUST VERIFY (No exceptions)**
- Current prices, volumes, market caps
- Earnings dates and results
- Insider/institutional transactions
- Regulatory filings and dates
- Any number presented as fact

**TIER 2: SHOULD VERIFY**
- Historical price levels
- Company announcements
- Analyst ratings/targets
- Economic data points

**TIER 3: OPTIONAL VERIFY**
- General market knowledge
- Well-established historical facts
- Common financial concepts

---

## SECTION 2: VERIFICATION PROTOCOL

### 2.1 Pre-Output Checklist

Before delivering ANY analysis, execute:

```
□ PRICE CHECK
  - Did I retrieve current prices or am I assuming them?
  - Source: [URL] or "NOT RETRIEVED"

□ DATE CHECK
  - Are dates current or from training data?
  - For events: Verify they occurred/are scheduled

□ STATISTIC CHECK
  - Every percentage: How was it calculated?
  - Every ratio: What are the inputs?
  - Every count: Where did it come from?

□ ATTRIBUTION CHECK
  - Every "X said" or "X reported": Source URL?
  - Every "According to...": Verifiable?

□ ASSUMPTION CHECK
  - What am I assuming without data?
  - Flag each assumption explicitly
```

### 2.2 Verification Decision Tree

```
Is this a factual claim?
├── NO → Label as ANALYSIS or OPINION → Proceed
└── YES → Is this TIER 1?
    ├── YES → Search and verify → Source found?
    │   ├── YES → Cite source → Proceed
    │   └── NO → Flag as UNVERIFIED → Proceed with flag
    └── NO → Is this TIER 2?
        ├── YES → Attempt verification → Source found?
        │   ├── YES → Cite source → Proceed
        │   └── NO → Note as "based on training data" → Proceed
        └── NO (TIER 3) → Proceed without verification
```

---

## SECTION 3: SOURCE HIERARCHY

### 3.1 Source Ranking

| Rank | Source Type | Trust Level | Examples |
|------|------------|-------------|---------|
| **1** | Primary/Official | Highest | SEC filings, Fed statements, company 10-K |
| **2** | Major Financial Data | High | Bloomberg, Reuters, Yahoo Finance |
| **3** | Respected Analysis | Medium-High | WSJ, FT, Barron's |
| **4** | General News | Medium | AP, major newspapers |
| **5** | Aggregators | Medium-Low | Seeking Alpha, Motley Fool |
| **6** | Social/Forum | Low | Reddit, Twitter/X, StockTwits |
| **7** | Anonymous/Unverified | Lowest | Blog posts without credentials, anonymous tips, rumors |

- **Never cite Rank 7 as fact** — "Unverified reports suggest..."

### 3.2 Source Citation Format

```
[CLAIM] (Source: [NAME], [DATE], [URL])
```

Example:
```
Silver dropped 17% on January 31, 2026 (Source: Yahoo Finance, 2026-01-31, [URL])
```

---

## SECTION 4: COMMON VERIFICATION FAILURES

### 4.1 Failure Patterns to Eliminate

| Pattern | Example | Correction |
|---------|---------|------------|
| **Assumed price** | "HYMC is trading at $5.20" | Must search, retrieve, cite |
| **Fabricated %** | "85% probability of..." | State methodology or remove |
| **Stale data** | "Company announced..." (months ago) | Search for current status |
| **Confident uncertainty** | "The market will..." | Reframe as scenario |
| **False precision** | "Support at $32.47" | State derivation method |

### 4.2 Phrases That Trigger Verification

If I'm about to write these, STOP and verify:

- "The current price is..."
- "Yesterday, [company] announced..."
- "The probability is X%..."
- "According to recent reports..."
- "[Number] of [things]..."
- "The company's market cap is..."
- "[Person] said..."

---

## SECTION 5: INTEGRATION WITH METATRON/HUNTER

### 5.1 Gate Integration

| METATRON Gate | Verification Requirement |
|---------------|-------------------------|
| Gate 3 (Data Existence) | Verification Layer executes here |
| Gate 4 (Price/Volume) | TIER 1 verification mandatory |
| Gate 5 (Institutional) | TIER 1 or TIER 2 source required |
| Gate 14 (Fabrication) | Verification failure = fabrication |

### 5.2 HUNTER Integration

Every HUNTER module output must include:
```
Source: [URL]
Retrieved: [TIMESTAMP]
Data Currency: [REAL-TIME / DELAYED / HISTORICAL]
```

---

## SECTION 6: OUTPUT TEMPLATES

### 6.1 Verified Claim Template

```
[STATEMENT]
├── Source: [SOURCE NAME]
├── Date: [DATA DATE]
├── URL: [LINK]
└── Verification: ✓ VERIFIED
```

### 6.2 Unverified Claim Template

```
[STATEMENT] — UNVERIFIED
├── Basis: [Training data / Memory / Assumption]
├── Search attempted: [YES/NO]
├── Result: [No data found / Search failed / Not attempted]
└── Confidence: LOW — Treat accordingly
```

### 6.3 Analysis Summary Template

```
## VERIFICATION SUMMARY
| Claim Type | Count | Verified | Unverified |
|------------|-------|----------|------------|
| Prices     | X     | X        | X          |
| Statistics | X     | X        | X          |
| Events     | X     | X        | X          |
| Quotes     | X     | X        | X          |

Unverified claims flagged in analysis with [UNVERIFIED] tag.
```

---

## SECTION 7: IMPLEMENTATION CHECKLIST

### 7.1 Before Every Response

```
□ Identify all factual claims in my planned response
□ Classify each claim by type
□ For TIER 1 claims: Execute verification
□ For unverified claims: Flag or remove
□ Compile source index
□ Include verification summary if analysis contains >3 claims
```

### 7.2 Verification Shortcuts

| Situation | Acceptable Shortcut |
|-----------|---------------------|
| Multiple prices needed | Single search for "market movers" or sector overview |
| Historical context | State training data basis, offer to search current |
| General concepts | No verification needed |
| Principal confirms data | Principal statement = verified |

---

## SECTION 8: VERSIONING

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-01-31 | Initial verification layer protocol |

---

## ATTESTATION

Every fact delivered to Principal has either:
1. A source URL
2. A stated methodology
3. An explicit "UNVERIFIED" flag

No exceptions. No assumptions presented as facts.

**VERIFICATION LAYER v1.0 — ACTIVE**
