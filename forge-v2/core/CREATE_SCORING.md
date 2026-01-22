# FORGE v2.0 CREATE SCORING METHODOLOGY

**Version:** 2.0  
**Owner:** Ashes2Echoes, LLC  
**Principal:** William Earl Lemon — ABSOLUTE

---

## OVERVIEW

CREATE is the quality scoring system for FORGE-generated prompts.  
Minimum passing score: **85/100**

---

## COMPONENTS

### C — Clarity (20 points)

**Measures:** Specificity, unambiguity, precision

| Score | Criteria |
|-------|----------|
| 20 | Crystal clear, no ambiguity, specific numeric thresholds |
| 15 | Clear with minor ambiguities |
| 10 | Moderately clear, some vague terms |
| 5 | Unclear, multiple interpretations possible |
| 0 | Ambiguous, no clear direction |

---

### R — Role (25 points)

**Measures:** Persona specification, domain expertise, credential alignment

| Score | Criteria |
|-------|----------|
| 25 | Expert persona with specific credentials, domain mastery evident |
| 20 | Strong persona with clear expertise |
| 15 | Generic expert role |
| 10 | Weak persona specification |
| 0 | No role specified |

---

### E — Execution (20 points)

**Measures:** Step-by-step methodology, academic rigor, process clarity

| Score | Criteria |
|-------|----------|
| 20 | Numbered steps, academic citations, reproducible methodology |
| 15 | Clear steps with some citations |
| 10 | General methodology, few specifics |
| 5 | Vague process |
| 0 | No methodology |

---

### A — Accountability (15 points)

**Measures:** JSON schema, audit trail, output verification

| Score | Criteria |
|-------|----------|
| 15 | Complete JSON schema, audit trail specified, verification steps |
| 12 | JSON schema present, partial audit trail |
| 8 | Some structured output |
| 4 | Minimal accountability |
| 0 | No accountability measures |

---

### T — Thesis-Testing (10 points)

**Measures:** Counter-thesis, failure modes, intellectual honesty

| Score | Criteria |
|-------|----------|
| 10 | ≥3 failure modes, steelmanned counter-thesis |
| 7 | 1-2 failure modes, basic counter-argument |
| 4 | Acknowledgment of alternatives |
| 0 | No counter-thesis |

---

### E — Evidence (10 points)

**Measures:** Source chain, verification, primary sources

| Score | Criteria |
|-------|----------|
| 10 | Primary sources required, chain-to-source methodology |
| 7 | Source requirements specified |
| 4 | General evidence request |
| 0 | No evidence requirements |

---

## CALCULATION

```
CREATE_SCORE = C + R + E + A + T + E

PASS: CREATE_SCORE ≥ 85
FAIL: CREATE_SCORE < 85
```

---

## SCORING EXAMPLE

**Prompt:** "Analyze HYMC insider trading for me"

| Component | Score | Rationale |
|-----------|-------|-----------|
| C (Clarity) | 5 | Vague, no thresholds, undefined timeframe |
| R (Role) | 0 | No persona specified |
| E (Execution) | 0 | No methodology |
| A (Accountability) | 0 | No output schema |
| T (Thesis-Testing) | 0 | No counter-thesis |
| E (Evidence) | 0 | No source requirements |
| **TOTAL** | **5/100** | **FAIL** |

**FORGE-Enhanced:**

| Component | Score | Rationale |
|-----------|-------|-----------|
| C (Clarity) | 18 | Specific: Form 4, 90-day window, ≥$100K threshold |
| R (Role) | 23 | SEC Analyst persona, 15yr experience |
| E (Execution) | 18 | 8-step methodology, Seyhun citation |
| A (Accountability) | 14 | JSON schema, confidence intervals |
| T (Thesis-Testing) | 9 | 3 failure modes specified |
| E (Evidence) | 9 | SEC EDGAR primary, verification steps |
| **TOTAL** | **91/100** | **PASS** |

---

**END CREATE_SCORING.md**
