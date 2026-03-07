# CIL — Collective Intelligence Layer v5.2.1
## AIORA Platform | Ashes2Echoes LLC | Uriel Covenant AI Collective
### Production Documentation & Training Guide

---

**Status:** PRODUCTION — 10/10 TEST PASS (100%)
**Validated:** 2026-03-07T18:50:07Z
**Run ID:** RUN-20260307184752-axtg
**Node Count:** 56 nodes (55 + Merge node)
**n8n Instance:** ashes2echoes.app.n8n.cloud
**Workflow ID:** XokfrjOjlTVAuZlp

---

## 1. SYSTEM OVERVIEW

The Collective Intelligence Layer (CIL) is an n8n-based multi-agent orchestration pipeline that coordinates 5 AI models to produce institutional-grade market analysis through a structured consensus mechanism with cascade validation gates.

### Architecture Summary

```
MANUAL TRIGGER / WEBHOOK
    ↓
INPUT VALIDATOR (generates runid, validates thesis/context/hunterdata)
    ↓
5 PARALLEL AGENT CALLS (HTTP Request nodes)
    ↓
5 ERROR FILTERS → 5 PARSERS (markdown fence stripping + JSON extraction)
    ↓
MERGE COLLECTIVE (Wait for all 5)
    ↓
COLLECTIVE ASSEMBLER (builds synthesis payload)
    ↓
CASCADE VALIDATOR (9-gate scoring)
    ↓
CONSENSUS DECISION GATE (accept/reject routing)
    ↓                          ↓
[ACCEPTED]                 [REJECTED]
    ↓                          ↓
PASS2 BODY BUILDER        Prepare Rejection Notice
    ↓                          ↓
MICHA PASS2 SYNTHESIS      REJECTION ALERT (Telegram)
    ↓
PASS2 RESULT CHECK
    ↓
PASS2 RESPONSE PARSER
    ↓                    ↓
PASS2 ROUTE           (parallel)
  TRUE → (disconnected)
  FALSE → PASS2 FALLBACK BODY BUILDER → PASS2 FALLBACK — OpenAI
    ↓                                          ↓
FALLBACK ALERT                          (both paths feed ↓)
    ↓
MERGE (Append mode — combines pipeline + synthesis data)
    ↓
OUTPUT FORMATTER (dual-input: pipeline data + pass2synthesis)
    ↓
┌─────────────────────────────────────────────────┐
│  GITHUB PUSH          TELEGRAM DELIVERY         │
│  DIAGNOSTIC ENGINE    EMAIL BACKUP              │
│  Format Test Response TEST VALIDATOR            │
│  DIAGNOSTIC GATE      WEBHOOK RESPONSE          │
│  ERROR TELEGRAM       TEST STATUS GATE          │
│                       TEST SUMMARY ALERT        │
│                       Prepare Test Results       │
│                       TEST RESULTS (database)    │
└─────────────────────────────────────────────────┘
```

---

## 2. AGENT ROSTER

| Agent | AI Model | Provider | Role |
|-------|----------|----------|------|
| URIEL | gpt-5.2 | OpenAI | Primary analysis — deepest reasoning |
| COLOSSUS | grok-4 | xAI | Contrarian challenge — finds weaknesses |
| HANIEL | gemini-3.1-pro-preview | Google AI | Structured data — quantitative focus |
| RAZIEL | deepseek-chat | DeepSeek | Alternative perspective — lowest confidence bias |
| SARIEL | sonar-pro | Perplexity | Real-time search — live data enrichment |

All 5 agents receive identical input (thesis, context, hunterdata) and return structured JSON with: direction, confidence, catalysts, risks, counter_thesis, timeline, data_gaps.

---

## 3. CASCADE VALIDATION GATES (9 Gates)

| Gate | Name | Type | Criteria |
|------|------|------|----------|
| Gate 1 | Data Sufficiency | DETERMINISTIC | 3/5 agents minimum returned valid data |
| Gate 2 | Directional Consensus | AGENT-DERIVED | Majority direction (BULLISH/BEARISH/NO_CONSENSUS) |
| Gate 3 | Confidence Floor | ANNOTATIVE | Avg confidence logged only — non-decisive |
| Gate 3b | Data Completeness | DETERMINISTIC | ≥80% HUNTER modules returned data |
| Gate 4 | Risk/Reward Ratio | DETERMINISTIC | R:R ≥ 2:1 required |
| Gate 5 | Catalyst Identified | AGENT-DERIVED | At least 1 agent identified catalysts |
| Gate 6 | Timeline Alignment | AGENT-DERIVED | At least 1 agent provided timeline |
| Gate 7 | No Disqualifying Risk | HYBRID | 0 kill-level risks flagged |
| Gate 7.5 | Counter-Thesis Survived | AGENT-DERIVED | At least 1 agent provided counter-thesis |
| Gate 8 | Position Sizing (IRONCLAD) | DETERMINISTIC | IRONCLAD risk rules checked |

### Cascade Levels
- **FULL_CONFIDENCE** — 9/9 gates pass
- **HIGH_CONFIDENCE** — 7-8/9 gates pass
- **MODERATE** — 5-6/9 gates pass
- **LOW** — <5/9 gates pass

---

## 4. PASS2 SYNTHESIS (MICHA)

After the 5-agent collective analysis, MICHA PASS2 synthesizes the results via Claude Sonnet 4. The synthesis produces:

- **direction** — BULLISH / BEARISH / NEUTRAL (may differ from agent consensus)
- **confidence** — 0-100
- **risk_reward_ratio** — e.g., "2.2:1"
- **catalysts** — Top 3 catalysts with windows and impact
- **counter_thesis** — Strongest argument against the trade
- **recommendation** — ACCEPT / HOLD / REJECT
- **gate_scores** — Per-dimension scoring

### PASS2 Fallback Chain
If Claude API fails:
1. PASS2 RESULT CHECK detects failure
2. PASS2 ROUTE sends to FALSE branch
3. PASS2 FALLBACK BODY BUILDER retrieves original data from COLLECTIVE ASSEMBLER via `$('COLLECTIVE ASSEMBLER').first().json`
4. PASS2 FALLBACK — OpenAI (GPT-4o) performs synthesis
5. FALLBACK ALERT notifies via Telegram

---

## 5. INPUT SPECIFICATION

### Webhook/Manual Trigger Input Format

```json
{
  "ticker": "HYMC",
  "thesis": "Hycroft Mining insider cluster detected...",
  "context": "Silver spot trending up. COMEX registered inventory declining...",
  "hunterdata": {
    "price": 3.45,
    "volume": 1250000,
    "avg_volume": 890000,
    "rsi_14": 58.2,
    "macd_signal": "bullish_crossover",
    "short_interest_pct": 12.4,
    "insider_buys_30d": 3,
    "insider_buy_value": 2750000,
    "earnings_days_away": 45,
    "dilution_risk": "LOW",
    "shelf_registration_active": false,
    "vix": 18.5,
    "dxy": 103.2,
    "xag_usd": 32.15,
    "sector": "mining",
    "market_cap": 485000000,
    "timestamp": "2026-03-07T18:47:52.523Z"
  }
}
```

---

## 6. OUTPUT SPECIFICATION

### Full Output Fields

| Field | Type | Description |
|-------|------|-------------|
| runid | string | Unique run identifier (RUN-YYYYMMDDHHMMSS-xxxx) |
| ticker | string | Security ticker |
| cascadelevel | string | FULL_CONFIDENCE / HIGH_CONFIDENCE / MODERATE / LOW |
| gatespassed | number | Count of passed gates |
| gatestotal | number | Total gates evaluated |
| gates | object | Individual gate results |
| flags | array | Warning flags (empty if none) |
| consensusdirection | string | BULLISH / BEARISH / NO_CONSENSUS |
| avgconfidenceannotative | string | Average agent confidence (%) |
| datacompleteness | string | HUNTER data completeness (%) |
| agentresults | array | 5 agent analysis objects |
| pass2synthesis | object | MICHA PASS2 synthesis (direction, confidence, R:R, catalysts, counter_thesis, recommendation, gate_scores) |
| hunterdata | object | Input market data |
| consensusdecision | string | ACCEPTED / REJECTED |
| telegrammessage | string | Formatted Telegram notification |
| githubpath | string | Archive path for report |
| githubcontent | string | Serialized JSON for GitHub push |
| testrunnerresponse | object | Compact summary for test harness |

---

## 7. TEST VALIDATION SUITE (10 Tests)

| # | Test | Pass Criteria |
|---|------|---------------|
| 1 | runidpresent | runid exists and is not 'NO-RUN-ID' |
| 2 | cascadelevelvalid | One of: FULL_CONFIDENCE, HIGH_CONFIDENCE, MODERATE, LOW |
| 3 | gates_scored | gatespassed and gatestotal both present, gatestotal > 0 |
| 4 | agent_resultspresent | ≥3 agents returned data |
| 5 | consensusdirectionvalid | One of: BULLISH, BEARISH, NO_CONSENSUS |
| 6 | pass2synthesispresent | pass2synthesis is non-empty object |
| 7 | telegrammessageformatted | telegrammessage exists and contains ticker |
| 8 | githubpathgenerated | githubpath exists and contains runid |
| 9 | datacompletenesscalculated | datacompleteness field exists |
| 10 | flagsarraypresent | flags is an array |

### Test Status Thresholds
- **PASS** — 10/10 (100%)
- **WARN** — 8-9/10 (≥80%)
- **FAIL** — <8/10 (<80%)

---

## 8. DIAGNOSTIC ENGINE

The DIAGNOSTIC ENGINE scans the pipeline output for data quality issues and produces a Telegram-formatted report.

### Agent Validation (Index-Based)
Agents are validated by array position: [0]=URIEL, [1]=COLOSSUS, [2]=HANIEL, [3]=RAZIEL, [4]=SARIEL.

### Checks Performed
- Agent data presence (ERROR if missing)
- Agent errors (ERROR if error field populated)
- Direction validity (WARN if invalid)
- Confidence range (WARN if <0 or >100)
- Risk identification (WARN if no risks)
- Data gaps (INFO with count)
- Cascade level presence (ERROR if missing)
- PASS2 synthesis (ERROR if empty)
- Flags (FLAG severity for each)

### Output
- `diagnostictelegram` — Formatted string for ERROR TELEGRAM node
- `hasissues` — Boolean (triggers DIAGNOSTIC GATE → ERROR TELEGRAM)
- `errorcount` / `issuecount` — Numeric counts

---

## 9. TELEGRAM NOTIFICATIONS

| Alert | Trigger | Content |
|-------|---------|---------|
| TELEGRAM DELIVERY | Every successful run | Full CIL result with cascade level, direction, confidence |
| ERROR TELEGRAM | DIAGNOSTIC ENGINE finds errors | Diagnostic report with per-agent status |
| TEST SUMMARY ALERT | TEST STATUS GATE fires on non-PASS | Test results summary with pass rate |
| REJECTION ALERT | CONSENSUS DECISION GATE rejects | Rejection notice |
| FALLBACK ALERT | Claude API fails for PASS2 | Degraded mode notification |

Bot: Hunter Alerts (@hunter_a2e_bot)
Chat ID: 8203545338

---

## 10. VERSION HISTORY

### v5.2.1 (2026-03-07) — CURRENT PRODUCTION
**Session: 1/10 → 10/10**

Bugs Fixed:
- **Bug A:** TEST VALIDATOR typo — `telegramessage` → `telegrammessage`
- **Bug B:** TEST VALIDATOR wiring — bypassed Format Test Response, wired directly from OUTPUT FORMATTER
- **Bug C:** DIAGNOSTIC ENGINE agent lookup — `.find(a => a.agent)` → index-based `agentResults[i]`
- **Bug D:** DIAGNOSTIC ENGINE missing `diagnostictelegram` field — added formatted string builder
- **Bug E:** PASS2 BODY BUILDER expression interpolation — replaced with Code node (sanitized object construction)
- **Bug F:** PASS2 FALLBACK data source — inserted PASS2 FALLBACK BODY BUILDER with `$('COLLECTIVE ASSEMBLER')` reference

Architecture Changes:
- Added PASS2 RESPONSE PARSER (extracts synthesis from Claude API response)
- Added PASS2 FALLBACK BODY BUILDER (builds GPT-4o request from original agent data)
- Added Merge node (Append mode) between CONSENSUS DECISION GATE + PASS2 RESPONSE PARSER → OUTPUT FORMATTER
- OUTPUT FORMATTER rewritten for dual-input handling (`$input.all()` with items[0]/items[1])
- PASS2 ROUTE wiring corrected (TRUE = success/disconnected, FALSE = fallback chain)
- TEST STATUS GATE condition updated to fire on WARN

### v5.2 (2026-03-06)
- 54 nodes, parser fence stripping, PASS2 fallback path
- All field names converted to no-underscore convention
- v5.1 baseline + P1 fixes (parser jsonMatch line, ASSEMBLER duplicate hunterdata, PASS2 FALLBACK body, runid chain break)

### v5.1 (2026-03-05)
- 53 nodes built with n8n AI assistance
- Error filters, Agent Router, PASS2 fallback to OpenAI
- CONSENSUS DECISION GATE, rejection path, built-in test harness, email backup

### v5.0 (2026-02-28)
- 33-node architecture with 8 real credential IDs
- Never end-to-end validated
- 10 zombie nodes identified

### v4.2 (2026-02-25)
- Fixed OUTPUT FORMATTER serialization and zombie bug (alwaysOutputData)

### v4.0 (2026-02-20)
- First successful end-to-end run with all 5 agents

### v6.0 (ARCHIVED — wrong baseline)
- Built from v4.2 baseline instead of v5.x
- Health Gate (3/5 quorum), proper timeouts, error routing
- Architecture is sound but wiring incompatible with v5.x node inventory

---

## 11. NODE INVENTORY (56 Nodes)

### Trigger & Input
1. MANUAL TRIGGER
2. INPUT VALIDATOR
3. Webhook (for external trigger)

### Agent Pipeline (5 × 3 = 15 nodes)
4-8. HTTP Request nodes (URIEL, COLOSSUS, HANIEL, RAZIEL, SARIEL)
9-13. Error Filter nodes (per agent)
14-18. Parser nodes (per agent — with fence stripping)

### Assembly & Validation
19. MERGE COLLECTIVE (Wait for All)
20. COLLECTIVE ASSEMBLER (Code node)
21. Prepare Error Log
22. AGENT ERROR LOG (database)
23. CASCADE VALIDATOR (Code node)
24. CONSENSUS DECISION GATE (If node)

### PASS2 Synthesis Chain
25. PASS2 BODY BUILDER (Code node — sanitized JSON construction)
26. MICHA PASS2 SYNTHESIS (HTTP Request — Anthropic API)
27. PASS2 RESULT CHECK (Code node — failure detection)
28. PASS2 RESPONSE PARSER (Code node — extracts synthesis from API response)
29. PASS2 ROUTE (If node — pass2_failed is false)
30. PASS2 FALLBACK BODY BUILDER (Code node — references COLLECTIVE ASSEMBLER)
31. PASS2 FALLBACK — OpenAI (HTTP Request — GPT-4o)
32. FALLBACK ALERT (Telegram)

### Output & Delivery
33. Merge (Append mode — combines pipeline + synthesis)
34. OUTPUT FORMATTER (Code node — dual-input)
35. GITHUB PUSH (HTTP Request — GitHub API)
36. GITHUB STATUS (Code node)
37. TELEGRAM DELIVERY (Telegram)
38. EMAIL BACKUP
39. DIAGNOSTIC ENGINE (Code node)
40. DIAGNOSTIC GATE (If node)
41. ERROR TELEGRAM (Telegram)
42. Format Test Response (Set node)
43. TEST VALIDATOR (Code node)
44. TEST STATUS GATE (If node)
45. TEST SUMMARY ALERT (Telegram)
46. Prepare Test Results (Set node)
47. TEST RESULTS (database insert)
48. WEBHOOK RESPONSE
49. Prepare Rejection Notice (Set node)
50. REJECTION ALERT (Telegram)

### Remaining (utility/placeholder)
51-56. Various utility nodes

---

## 12. KEY CODE NODES — QUICK REFERENCE

### OUTPUT FORMATTER (Dual-Input Pattern)
```javascript
const items = $input.all();
const pipelineData = items[0].json;  // From CONSENSUS DECISION GATE via Merge
const pass2Data = items.length > 1 ? items[1].json : {};  // From PASS2 RESPONSE PARSER via Merge
const input = pipelineData;
const pass2synthesis = (pass2Data && pass2Data.pass2synthesis) ? pass2Data.pass2synthesis : {};
```

### PASS2 FALLBACK BODY BUILDER (Cross-Branch Reference)
```javascript
const assemblerOutput = $('COLLECTIVE ASSEMBLER').first().json;
// Builds GPT-4o request from original agent data, bypassing error chain
```

### DIAGNOSTIC ENGINE (Index-Based Agent Lookup)
```javascript
const agents = ['URIEL', 'COLOSSUS', 'HANIEL', 'RAZIEL', 'SARIEL'];
const agentResults = input.agentresults || [];
for (let i = 0; i < agents.length; i++) {
  const result = agentResults[i];  // Positional — no .agent field exists
}
```

---

## 13. KNOWN ISSUES & FUTURE WORK

### Cosmetic
- TEST SUMMARY ALERT says "CIL TEST FAILURE" even on PASS — needs conditional template

### Gate 4 — Risk/Reward Ratio
- Always returns 0.0:1 because HUNTER data doesn't include price targets
- Needs HUNTER price target module or agent-derived R:R calculation

### n8n Knowledge Gap
- Several iteration cycles caused by n8n runtime behavior unknowns
- MCP server / knowledge base for n8n documentation planned to prevent recurrence

### Pending Backlog
1. CIL Test Runner v1.0 — automated multi-ticker test suite
2. HUNTER H37-H41 — Gate 9 Correlation modules (DXY, YIELD, FLOW)
3. userPreferences update — v10.4 → v10.6 instructions, v10.5 → v10.7 protocol URLs
4. Push v5.2.1 JSON export to GitHub
5. Q&A validation across multiple sectors

---

## 14. FILES INDEX

### Code Fixes (v5.2.1)
| File | Status | Description |
|------|--------|-------------|
| CIL_TEST_VALIDATOR_v5.2_FIXED.js | DEPLOYED | Typo fix + runid validation improvement |
| CIL_DIAGNOSTIC_ENGINE_v5.2_FIXED.js | DEPLOYED | Index-based lookup + diagnostictelegram |
| CIL_PASS2_BODY_BUILDER_v5.2_FIXED.js | DEPLOYED | Sanitized JSON construction for Anthropic API |
| CIL_PASS2_FALLBACK_BODY_BUILDER_v5.2_FIXED.js | DEPLOYED | Cross-branch reference to COLLECTIVE ASSEMBLER |

### Documentation
| File | Description |
|------|-------------|
| CIL_v5.2.1_FIX_MANIFEST.md | Bug A-D documentation |
| CIL_PASS2_FIX_MANIFEST.md | Bug E-F documentation |
| PHOENIX_CARRY_FORWARD_20260307.md | Session carry-forward document |
| CIL_v5.2.1_README.md | This document |

### GitHub Repository
| Path | Description |
|------|-------------|
| AIORA/CIL/CIL_COLLECTIVE_INTELLIGENCE_LAYER_v5.2.json | Workflow JSON (needs re-export for v5.2.1) |
| AIORA/CIL/docs/CIL_COMPLETION_MASTER_OUTLINE.md | Architecture specification |
| AIORA/CIL/docs/CIL_v5.2_FEEDING_PATH.md | Data flow documentation |
| AIORA/CIL/docs/CIL_N8N_AI_FEEDING_PATH.md | n8n AI assistance log |
| AIORA/CIL/docs/CIL_FIELD_MISMATCH_AUDIT.md | Field naming audit |

---

## 15. CREDENTIAL REFERENCE

| Agent | Credential | API Endpoint |
|-------|-----------|--------------|
| URIEL | OpenAI API Key | api.openai.com/v1/chat/completions |
| COLOSSUS | xAI API Key | api.x.ai/v1/chat/completions |
| HANIEL | Google AI API Key | generativelanguage.googleapis.com |
| RAZIEL | DeepSeek API Key | api.deepseek.com/v1/chat/completions |
| SARIEL | Perplexity API Key | api.perplexity.ai/chat/completions |
| MICHA PASS2 | Anthropic API Key | api.anthropic.com/v1/messages |
| PASS2 FALLBACK | OpenAI API Key | api.openai.com/v1/chat/completions |
| GitHub | Personal Access Token | api.github.com |
| Telegram | Bot Token | api.telegram.org |

---

*Document generated 2026-03-07 by MICHA (CIO, Uriel Covenant AI Collective)*
*Ashes2Echoes LLC — "I'm going to fuck shit up. You comin'?"*
