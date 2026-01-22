# FORGE v2.0

**Industrial-Grade Prompt Engineering System**

---

## Overview

FORGE v2.0 is NOT a form filler. It generates institutional-grade prompts with:

- **Sophistication Detection** - Questions reveal expertise, not ask for it
- **CREATE Scoring** - 85/100 minimum quality threshold
- **METATRON Integration** - Execute routing to 18-gate validation
- **HUNTER Modules** - Cross-validation with market intelligence

---

## Quick Start

### Guided Mode (Default)
```
User: I want to analyze insider buying in HYMC
FORGE: [Initiates sophistication detection]
       → Routes to FIN-001
       → Generates prompt (CREATE Score: 95)
       → [EXECUTE] → METATRON validation
```

### Expert Mode
```bash
FORGE --expert FIN-001 HYMC --days 90
```

---

## Templates

### Finance (FIN-XXX)
| ID | Name | HUNTER |
|----|------|--------|
| FIN-001 | Insider Trading Analysis | H1, H4 |
| FIN-002 | Sector Momentum Scan | H3 |
| FIN-003 | Political Catalyst | H2 |
| FIN-004 | Oversold Quality | H5 |
| FIN-005 | Contract Pipeline | H6 |
| FIN-006 | Position Sizing | — |
| FIN-007 | Counter-Thesis | — |

### Academic (ACA-XXX)
| ID | Name |
|----|------|
| ACA-001 | Physics/Quantum Thesis |
| ACA-002 | Economics Research |
| ACA-003 | Legal Brief |
| ACA-004 | Medical Research |
| ACA-005 | Technical Paper |

---

## Documentation

- [Architecture](FORGE_V2_ARCHITECTURE.md)
- [Test Harness](TEST_HARNESS_SPEC.md)
- [CREATE Scoring](core/CREATE_SCORING.md)
- [Question Bank](core/QUESTION_BANK.md)
- [Expert Mode](core/EXPERT_MODE.md)
- [Execute Routing](core/EXECUTE_ROUTING.md)

---

**© 2026 Ashes2Echoes, LLC. All rights reserved.**
