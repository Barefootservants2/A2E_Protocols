# FORGE v2.0 ARCHITECTURE

**Version:** 2.0  
**Owner:** Ashes2Echoes, LLC  
**Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 22, 2026

---

## PHILOSOPHY

FORGE v2.0 is NOT a form filler. It is an institutional-grade prompt engineering system that generates prompts worthy of $50-60/month subscription value.

**Core Principles:**
1. Don't ask what they know — ask what they need
2. Questions should teach
3. 90th percentile output quality
4. Receipts for everything
5. Every prompt includes counter-thesis

---

## SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INPUT                                │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SOPHISTICATION DETECTOR                        │
│  Questions that REVEAL expertise, not ask for it                │
│  • "What's your null hypothesis?" not "What's your level?"      │
│  • Teaching integrated into questions                            │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌─────────┐      ┌─────────┐      ┌─────────┐
        │ NOVICE  │      │ INTER   │      │ EXPERT  │
        │ MODE    │      │ MODE    │      │ MODE    │
        └─────────┘      └─────────┘      └─────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TEMPLATE ROUTER                               │
│  • Finance (FIN-001 to FIN-007)                                 │
│  • Academic (ACA-001 to ACA-005)                                │
│  • General (GEN-001 to GEN-010) [future]                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROMPT GENERATOR                              │
│  Components:                                                     │
│  • Role Specification                                            │
│  • Methodology (with academic citations)                         │
│  • Defined Thresholds (not vague)                               │
│  • JSON Output Schema                                            │
│  • Execution Steps                                               │
│  • Counter-Thesis Requirement                                    │
│  • HUNTER Module Cross-Validation                                │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE SCORING                                │
│  Minimum: 85/100                                                 │
│  C - Clarity (20%)                                               │
│  R - Role (25%)                                                  │
│  E - Execution (20%)                                             │
│  A - Accountability (15%)                                        │
│  T - Thesis-Testing (10%)                                        │
│  E - Evidence (10%)                                              │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    [EXECUTE] → METATRON                          │
│  Routes to METATRON v8.0 for validation                         │
│  14 Gates must pass before output                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## TARGET USERS

| User Type | Sophistication | Mode | Features |
|-----------|----------------|------|----------|
| Basement Dweller (200 IQ, never prompted) | Novice | Guided | Full wizard + teaching |
| PhD Candidate (quantum physics) | Expert | Expert | ACA-001 direct access |
| CFA/Bar/CPA Prep | Intermediate | Guided | Streamlined wizard |
| Blue-collar Investor | Novice | Guided | Full teaching mode |
| Automation Expert | Expert | Batch | API + JSON specs |

---

## TEMPLATE CATALOG

### Finance Templates (FIN-001 to FIN-007)

| ID | Name | HUNTER Modules | METATRON Gates |
|----|------|----------------|----------------|
| FIN-001 | Insider Trading Analysis | H1, H4 | 0.5, 1, 2, 5.5, 7.5 |
| FIN-002 | Sector Momentum Scan | H3 | 0.5, 1, 5.5, 11 |
| FIN-003 | Political Catalyst Analysis | H2 | 0.5, 1, 5.5, 7.5 |
| FIN-004 | Oversold Quality Screen | H5 | 0.5, 1, 7.5 |
| FIN-005 | Contract Pipeline Tracker | H6 | 0.5, 1, 5.5 |
| FIN-006 | Position Sizing Calculator | — | 0.5, 7.5 |
| FIN-007 | Counter-Thesis Generator | — | 7.5 |

### Academic Templates (ACA-001 to ACA-005)

| ID | Name | Domain | METATRON Gates |
|----|------|--------|----------------|
| ACA-001 | Physics/Quantum Thesis | Physics | 0.5, 1, 2, 3 |
| ACA-002 | Economics Research | Economics | 0.5, 1, 2, 5.5 |
| ACA-003 | Legal Brief | Law | 0.5, 1, 2, 3 |
| ACA-004 | Medical Research | Medicine | 0.5, 1, 2, 3 |
| ACA-005 | Technical Paper | Engineering | 0.5, 1, 2 |

---

## PROMPT QUALITY STANDARD

Every generated prompt MUST include:

1. **Role Specification** - Precise persona with credentials
2. **Methodology** - Step-by-step with academic citations
3. **Defined Thresholds** - Numeric, not vague ("≥5%" not "significant")
4. **JSON Output Schema** - Machine-parseable results
5. **Execution Steps** - Numbered, auditable
6. **Counter-Thesis** - Minimum 3 failure modes
7. **HUNTER Cross-Validation** - Module references where applicable

---

## SOPHISTICATION DETECTION

### Question Bank Philosophy

**WRONG:** "What's your experience level?"  
**RIGHT:** "What's the null hypothesis you're testing?"

**WRONG:** "Are you a beginner?"  
**RIGHT:** "Walk me through your thesis statement."

### Detection Questions by Domain

**Finance:**
- "What's your current thesis on [symbol]?"
- "What would invalidate your bull case?"
- "What's your position sizing methodology?"

**Academic:**
- "What's your research question?"
- "What methodology are you using?"
- "What are your primary sources?"

**Technical:**
- "What's your current architecture?"
- "What constraints are you working within?"
- "What have you already tried?"

---

## EXPERT MODE

For users who know what they want:

```bash
# Direct template access
FORGE --expert FIN-001 HYMC

# Batch processing
FORGE --batch spec.json

# Template listing
FORGE --list finance
FORGE --list academic
FORGE --list all
```

### Expert Mode Features:
- Skip sophistication detection
- Direct template parameters
- JSON input/output
- Batch processing support
- API integration ready

---

## EXECUTE ROUTING

The [EXECUTE] button routes generated prompts to METATRON v8.0:

```
User clicks [EXECUTE]
    │
    ▼
FORGE validates CREATE Score ≥ 85
    │
    ▼
FORGE packages prompt + context
    │
    ▼
METATRON v8.0 ingests
    │
    ▼
18 Gates validate
    │
    ▼
HUNTER modules scan (if applicable)
    │
    ▼
Output with audit trail
```

---

## FILE STRUCTURE

```
/forge-v2/
├── FORGE_V2_ARCHITECTURE.md      # This file
├── TEST_HARNESS_SPEC.md          # Benchmark specification
├── core/
│   ├── QUESTION_BANK.md          # Sophistication detection questions
│   ├── CREATE_SCORING.md         # Scoring methodology
│   ├── EXPERT_MODE.md            # Expert user documentation
│   └── EXECUTE_ROUTING.md        # METATRON integration
├── templates/
│   ├── finance/
│   │   ├── FIN-001_INSIDER_TRADING.md
│   │   ├── FIN-002_SECTOR_MOMENTUM.md
│   │   └── ...
│   └── academic/
│       ├── ACA-001_PHYSICS_THESIS.md
│       └── ...
└── test/
    ├── forge_test_runner.py      # Automated test runner
    └── results/                  # Benchmark results
```

---

## INTEGRATION POINTS

### METATRON v8.0
- 18 mandatory gates
- 56 drift indicators
- HUNTER v2.0 (20 modules)

### HUNTER v2.0
- H1-H6: Original modules
- H7-H14: Extended modules
- H15-H20: Flow & Positioning tier

### AIORA v2.0
- Position sizing integration
- Risk management routing
- Stop-loss calculation

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025 | Initial form-filler (DEPRECATED) |
| 2.0 | 2026-01-22 | Industrial rebuild - 12 templates, sophistication detection, METATRON integration |

---

**FORGE v2.0 — NOT A FORM FILLER**

**© 2026 Ashes2Echoes, LLC. All rights reserved.**
