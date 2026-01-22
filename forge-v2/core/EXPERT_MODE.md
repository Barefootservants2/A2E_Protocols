# FORGE v2.0 EXPERT MODE

**Version:** 2.0  
**Owner:** Ashes2Echoes, LLC  
**Principal:** William Earl Lemon — ABSOLUTE

---

## OVERVIEW

Expert Mode provides direct template access for users who know what they need.  
No wizard. No hand-holding. Raw power.

---

## ACTIVATION

### Command Line

```bash
# Direct template access
FORGE --expert <TEMPLATE_ID> [SYMBOL] [OPTIONS]

# Examples
FORGE --expert FIN-001 HYMC
FORGE --expert ACA-001 --topic "quantum entanglement"
FORGE --expert FIN-006 --portfolio 50000 --risk 0.02
```

### In-App

1. Settings → Enable Expert Mode
2. Template selector appears
3. Direct parameter input
4. [EXECUTE] → METATRON

---

## AVAILABLE TEMPLATES

### Finance (FIN-XXX)

| ID | Name | Required Params | Optional Params |
|----|------|-----------------|-----------------|
| FIN-001 | Insider Trading Analysis | symbol | days, threshold |
| FIN-002 | Sector Momentum Scan | sector | lookback |
| FIN-003 | Political Catalyst Analysis | symbol | catalyst_type |
| FIN-004 | Oversold Quality Screen | sector | rsi_threshold |
| FIN-005 | Contract Pipeline Tracker | sector | agency |
| FIN-006 | Position Sizing Calculator | symbol, portfolio | risk_pct |
| FIN-007 | Counter-Thesis Generator | symbol, thesis | — |

### Academic (ACA-XXX)

| ID | Name | Required Params | Optional Params |
|----|------|-----------------|-----------------|
| ACA-001 | Physics/Quantum Thesis | topic | methodology |
| ACA-002 | Economics Research | question | dataset |
| ACA-003 | Legal Brief | case | jurisdiction |
| ACA-004 | Medical Research | condition | study_type |
| ACA-005 | Technical Paper | problem | constraints |

---

## BATCH PROCESSING

### Spec File Format

```json
{
  "forge_version": "2.0",
  "batch_id": "batch_20260122_001",
  "tasks": [
    {
      "template": "FIN-001",
      "params": {"symbol": "HYMC", "days": 90}
    },
    {
      "template": "FIN-007",
      "params": {"symbol": "HYMC", "thesis": "Silver squeeze"}
    }
  ]
}
```

### Execution

```bash
FORGE --batch spec.json
```

---

## TEMPLATE LISTING

```bash
# List all templates
FORGE --list all

# List by category
FORGE --list finance
FORGE --list academic

# Template details
FORGE --info FIN-001
```

---

## EXPERT MODE FLAGS

```bash
--expert, -e     Enable expert mode
--template, -t   Specify template ID
--batch, -b      Batch processing mode
--list, -l       List templates
--info, -i       Template details
--output, -o     Output format (json|md|txt)
--execute, -x    Auto-execute via METATRON
--verbose, -v    Verbose output
```

---

**EXPERT MODE — FOR THOSE WHO KNOW**

**END EXPERT_MODE.md**
