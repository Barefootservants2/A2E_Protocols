# CIL v6.0 — UNIVERSAL ABSTRACTION LAYER
# MASTER WIRING DOCUMENT
## Build Date: 2026-03-07
## Status: Phase 1 (Code Nodes) + Phase 2 (Wiring) Complete Specification

---

## PIPELINE ARCHITECTURE COMPARISON

### v5.2.1 (Current — MARKET ONLY)
```
TRIGGER → INPUT VALIDATOR → COLLECTIVE ASSEMBLER → [5 Agent HTTP] → CASCADE VALIDATOR → PASS2 BODY BUILDER → PASS2 HTTP → (error) PASS2 FALLBACK BB → PASS2 FALLBACK HTTP → Merge → OUTPUT FORMATTER → [Telegram, GitHub, DB]
```

### v6.0 (Universal)
```
TRIGGER → INPUT VALIDATOR* → DOMAIN ROUTER [NEW] → PROMPT BUILDER [NEW] → COLLECTIVE ASSEMBLER* → [5 Agent HTTP*] → GATE CONFIG [NEW] → CASCADE VALIDATOR* → PASS2 BODY BUILDER* → PASS2 HTTP → (error) PASS2 FALLBACK BB* → PASS2 FALLBACK HTTP → Merge → OUTPUT TEMPLATE [NEW] → OUTPUT FORMATTER* → [Telegram, GitHub, DB]
```

`*` = modified existing node
`[NEW]` = new node

---

## SECTION 1: NEW NODES — n8n SETTINGS

### 1.1 DOMAIN ROUTER

| Setting | Value |
|---------|-------|
| **Node Type** | Code |
| **Node Name** | `DOMAIN ROUTER` |
| **Language** | JavaScript |
| **Mode** | Run Once for All Items |
| **Continue On Fail** | true |
| **Code** | Paste contents of `nodes/DOMAIN_ROUTER.js` |

**n8n Position:** Place between INPUT VALIDATOR and PROMPT BUILDER
**Input connection:** INPUT VALIDATOR → DOMAIN ROUTER (main output 0 → main input 0)
**Output connection:** DOMAIN ROUTER → PROMPT BUILDER (main output 0 → main input 0)

**What it does:**
- Reads `domain` field from validated input
- Looks up full domain config from internal DOMAIN_REGISTRY
- Produces `routing` object containing: agent_roles, agent_output_schema, gates (universal + domain-specific), synthesis instructions, output labels
- Unknown domains fall back to GENERAL with a warning flag
- Validates required domaindata fields per domain

**Key output fields added:**
- `routing` — full domain configuration object
- `routing.all_gates` — sorted gate array (universal + domain merged)
- `routing.agent_roles` — 5 agent role strings
- `routing.output_labels` — primary/secondary/action/detail field names

---

### 1.2 PROMPT BUILDER

| Setting | Value |
|---------|-------|
| **Node Type** | Code |
| **Node Name** | `PROMPT BUILDER` |
| **Language** | JavaScript |
| **Mode** | Run Once for All Items |
| **Continue On Fail** | true |
| **Code** | Paste contents of `nodes/PROMPT_BUILDER.js` |

**n8n Position:** Place between DOMAIN ROUTER and COLLECTIVE ASSEMBLER
**Input connection:** DOMAIN ROUTER → PROMPT BUILDER (main output 0 → main input 0)
**Output connection:** PROMPT BUILDER → COLLECTIVE ASSEMBLER (main output 0 → main input 0)

**What it does:**
- Reads `routing.agent_roles` and `routing.agent_output_schema`
- Builds 5 complete system prompts (one per agent) with: identity, role, output schema (mandatory JSON), collective protocol rules
- Builds 1 shared user prompt from: query + context + formatted domaindata
- MARKET domain gets special financial data formatting (ticker, price, RSI, etc.)
- GENERAL domain gets generic JSON formatting

**Key output fields added:**
- `systemprompt_URIEL` — full system prompt for URIEL agent
- `systemprompt_COLOSSUS` — full system prompt for COLOSSUS agent
- `systemprompt_HANIEL` — full system prompt for HANIEL agent
- `systemprompt_RAZIEL` — full system prompt for RAZIEL agent
- `systemprompt_SARIEL` — full system prompt for SARIEL agent
- `userprompt` — shared user message for all 5 agents

---

### 1.3 GATE CONFIG

| Setting | Value |
|---------|-------|
| **Node Type** | Code |
| **Node Name** | `GATE CONFIG` |
| **Language** | JavaScript |
| **Mode** | Run Once for All Items |
| **Continue On Fail** | true |
| **Code** | Paste contents of `nodes/GATE_CONFIG.js` |

**n8n Position:** Place between the 5-agent merge point and CASCADE VALIDATOR

**IMPORTANT — TIMING NOTE:**
In v5.2.1, the 5 agent HTTP responses merge back together before CASCADE VALIDATOR. GATE CONFIG must be placed AFTER that merge but BEFORE CASCADE VALIDATOR. The merge node output feeds GATE CONFIG, which feeds CASCADE VALIDATOR.

**Input connection:** Agent Merge Node → GATE CONFIG (main output 0 → main input 0)
**Output connection:** GATE CONFIG → CASCADE VALIDATOR (main output 0 → main input 0)

**What it does:**
- Reads `routing.all_gates` (gate definitions from DOMAIN ROUTER)
- Attaches evaluator function BODIES (as strings) to each gate definition
- Universal evaluators: DATA_SUFFICIENCY, DIRECTIONAL_CONSENSUS, CATALYST_PRESENT, TIMELINE_ALIGNMENT, COUNTER_THESIS_ADDRESSED
- MARKET evaluators: RISK_REWARD_RATIO, SECTOR_CONTEXT, IRONCLAD_POSITION_SIZE, HUNTER_COMPLETENESS
- GENERAL evaluators: FEASIBILITY_CHECK, CONSISTENCY_CHECK, COMPLETENESS_SCORE, SOURCE_QUALITY
- CASCADE VALIDATOR will execute each evaluator via `new Function()`

**Key output fields added:**
- `gate_config.gates[]` — array of gate objects with `.evaluator` function body strings
- `gate_config.target_score` — 90 (overall pass threshold)
- `gate_config.scoring_method` — "WEIGHTED_AVERAGE"
- `gate_config.pass_threshold` — 70 (individual gate warning level)
- `gate_config.fail_threshold` — 40 (individual gate hard fail level)

---

### 1.4 OUTPUT TEMPLATE

| Setting | Value |
|---------|-------|
| **Node Type** | Code |
| **Node Name** | `OUTPUT TEMPLATE` |
| **Language** | JavaScript |
| **Mode** | Run Once for All Items |
| **Continue On Fail** | true |
| **Code** | Paste contents of `nodes/OUTPUT_TEMPLATE.js` |

**n8n Position:** Place between the Merge node (pipeline + PASS2) and OUTPUT FORMATTER

**Input connection:** Merge (Append) → OUTPUT TEMPLATE (main output 0 → main input 0)
**Output connection:** OUTPUT TEMPLATE → OUTPUT FORMATTER (main output 0 → main input 0)

**What it does:**
- Takes merged pipeline + synthesis data
- Builds 4 output formats based on domain:
  1. `telegram_message` — emoji-formatted Telegram alert with domain-appropriate labels
  2. `github_payload` — structured JSON for archival
  3. `db_record` — flat record for database insert
  4. `summary` — one-line human-readable result
- MARKET format: DIRECTION, CONFIDENCE, ticker, agent votes, gate breakdown
- GENERAL format: POSITION, CONFIDENCE, query, agent positions, recommendations

**Key output fields added:**
- `formatted_output.telegram_message`
- `formatted_output.github_payload`
- `formatted_output.db_record`
- `formatted_output.summary`

---

## SECTION 2: MODIFIED NODES — EXACT CHANGES

### 2.1 INPUT VALIDATOR

| Change | Detail |
|--------|--------|
| **Code** | Replace entire code with `mods/INPUT_VALIDATOR_v6.js` |
| **Node Settings** | No changes needed |
| **Wiring** | No changes — still receives from Trigger, outputs to next node |

**What changed:**
- Accepts `domain` field (defaults to "GENERAL")
- Backward compat: `hunterdata` accepted and mapped to `domaindata`
- Accepts `query`, `prompt`, or `message` as the primary input
- Generates `runid` in format `CIL-{DOMAIN}-{timestamp}-{random}`
- MARKET-specific validation: normalizes ticker, casts numeric strings

---

### 2.2 COLLECTIVE ASSEMBLER

| Change | Detail |
|--------|--------|
| **Code** | Replace entire code with `mods/COLLECTIVE_ASSEMBLER_v6.js` |
| **Node Settings** | No changes needed |
| **Wiring** | Input now comes from PROMPT BUILDER (was INPUT VALIDATOR) |

**What changed:**
- References `domaindata` instead of `hunterdata`
- Validates all 5 `systemprompt_<AGENT>` fields exist
- Validates `userprompt` exists
- Passes through ALL fields including `routing`, `gate_config` metadata
- Size warning if `domaindata` exceeds 50KB

---

### 2.3 FIVE AGENT HTTP REQUEST NODES (URIEL, COLOSSUS, HANIEL, RAZIEL, SARIEL)

These are the 5 HTTP Request nodes that call external APIs. Each needs ONE change:

| Change | Detail |
|--------|--------|
| **System Prompt Field** | Change from hardcoded text to expression |
| **User Prompt Field** | Change from hardcoded text to expression |

**For each agent HTTP node, change the request body:**

**URIEL (OpenAI):**
```
Body → JSON → messages[0].content (system):
  OLD: "You are a senior quantitative analyst..."  (hardcoded)
  NEW: {{ $json.systemprompt_URIEL }}

Body → JSON → messages[1].content (user):
  OLD: "Analyze the following market data: {{ $json.hunterdata }}..."
  NEW: {{ $json.userprompt }}
```

**COLOSSUS (xAI):**
```
Body → JSON → system prompt field:
  OLD: hardcoded text
  NEW: {{ $json.systemprompt_COLOSSUS }}

Body → JSON → user message:
  OLD: hardcoded text referencing hunterdata
  NEW: {{ $json.userprompt }}
```

**HANIEL (Google AI):**
```
Body → JSON → system instruction:
  OLD: hardcoded text
  NEW: {{ $json.systemprompt_HANIEL }}

Body → JSON → user content:
  OLD: hardcoded text referencing hunterdata
  NEW: {{ $json.userprompt }}
```

**RAZIEL (DeepSeek):**
```
Body → JSON → messages[0].content (system):
  OLD: hardcoded text
  NEW: {{ $json.systemprompt_RAZIEL }}

Body → JSON → messages[1].content (user):
  OLD: hardcoded text referencing hunterdata
  NEW: {{ $json.userprompt }}
```

**SARIEL (Perplexity):**
```
Body → JSON → messages[0].content (system):
  OLD: hardcoded text
  NEW: {{ $json.systemprompt_SARIEL }}

Body → JSON → messages[1].content (user):
  OLD: hardcoded text referencing hunterdata
  NEW: {{ $json.userprompt }}
```

**NOTE:** The exact JSON body structure varies by API provider (OpenAI format, Google Gemini format, etc.). The KEY CHANGE is replacing the hardcoded system prompt string with the expression `{{ $json.systemprompt_<AGENTNAME> }}` and the hardcoded user message with `{{ $json.userprompt }}`. Everything else about the HTTP node (URL, auth headers, model selection, timeout) stays the same.

---

### 2.4 CASCADE VALIDATOR

| Change | Detail |
|--------|--------|
| **Code** | Replace entire code with `mods/CASCADE_VALIDATOR_v6.js` |
| **Node Settings** | No changes needed |
| **Wiring** | Input now comes from GATE CONFIG (was directly from agent merge) |

**What changed:**
- No longer hardcodes 9 specific market gates
- Iterates `gate_config.gates[]` array
- Executes each gate's `evaluator` function body via `new Function()`
- Weighted average scoring (configurable via `gate_config.scoring_method`)
- Hard fail detection (score below `gate_config.fail_threshold` = 40)
- Backward-compatible `cascade_result` output structure
- `data_completeness` field preserved for test validator compatibility

---

### 2.5 PASS2 BODY BUILDER

| Change | Detail |
|--------|--------|
| **Code** | Replace entire code with `mods/PASS2_BODY_BUILDER_v6.js` |
| **Node Settings** | No changes needed |
| **Wiring** | No changes |

**What changed:**
- System prompt reads `routing.synthesis_role` and `routing.synthesis_instruction`
- Includes full cascade gate results in synthesis context
- Output format instructions use `routing.output_labels` field names
- Domain label included in prompt header

---

### 2.6 PASS2 FALLBACK BODY BUILDER

| Change | Detail |
|--------|--------|
| **Code** | Replace entire code with `mods/PASS2_FALLBACK_BODY_BUILDER_v6.js` |
| **Node Settings** | No changes needed |
| **Wiring** | No changes |

**What changed:**
- Same domain-awareness as PASS2 BODY BUILDER
- Mirrors synthesis prompt structure but formatted for OpenAI API
- Explicitly marks output as FALLBACK synthesis

---

### 2.7 OUTPUT FORMATTER

| Change | Detail |
|--------|--------|
| **Code** | Replace entire code with `mods/OUTPUT_FORMATTER_v6.js` |
| **Node Settings** | No changes needed |
| **Wiring** | Input now comes from OUTPUT TEMPLATE (was directly from Merge) |

**What changed:**
- Reads pre-formatted output from `formatted_output` (built by OUTPUT TEMPLATE)
- No longer builds Telegram formatting inline
- GitHub archival path is now domain-routed: `AIORA/CIL/runs/{DOMAIN}/{date}_{runid}.json`
- Test validation fields preserved for backward compat
- Three clean output fields: `telegram_message`, `github_content`, `db_record`

---

## SECTION 3: WIRING CHANGES — CONNECTION MAP

### Connections to ADD (new nodes):

| From | To | Connection Type |
|------|----|-----------------|
| INPUT VALIDATOR | DOMAIN ROUTER | main 0 → main 0 |
| DOMAIN ROUTER | PROMPT BUILDER | main 0 → main 0 |
| PROMPT BUILDER | COLLECTIVE ASSEMBLER | main 0 → main 0 |
| Agent Merge | GATE CONFIG | main 0 → main 0 |
| GATE CONFIG | CASCADE VALIDATOR | main 0 → main 0 |
| Merge (pipeline+PASS2) | OUTPUT TEMPLATE | main 0 → main 0 |
| OUTPUT TEMPLATE | OUTPUT FORMATTER | main 0 → main 0 |

### Connections to REMOVE (replaced by new routing):

| From | To | Reason |
|------|----|--------|
| INPUT VALIDATOR | COLLECTIVE ASSEMBLER | Replaced: IV → DOMAIN ROUTER → PROMPT BUILDER → CA |
| Agent Merge | CASCADE VALIDATOR | Replaced: Merge → GATE CONFIG → CASCADE VALIDATOR |
| Merge (pipeline+PASS2) | OUTPUT FORMATTER | Replaced: Merge → OUTPUT TEMPLATE → OUTPUT FORMATTER |

### Connections UNCHANGED:

| From | To |
|------|----|
| Trigger | INPUT VALIDATOR |
| COLLECTIVE ASSEMBLER | 5 Agent HTTP nodes (parallel fan-out) |
| 5 Agent HTTP nodes | Agent Merge (fan-in) |
| CASCADE VALIDATOR | PASS2 BODY BUILDER |
| PASS2 BODY BUILDER | PASS2 HTTP Request |
| PASS2 HTTP Request | PASS2 FALLBACK BB (error branch) |
| PASS2 FALLBACK BB | PASS2 FALLBACK HTTP |
| PASS2 HTTP / PASS2 FALLBACK HTTP | Merge (Append) |
| OUTPUT FORMATTER | Telegram Send |
| OUTPUT FORMATTER | GitHub Archive |
| OUTPUT FORMATTER | Database Insert |

---

## SECTION 4: IMPLEMENTATION ORDER

Execute in this exact order to minimize risk:

### Step 1: Create new nodes (no wiring yet)
1. Add Code node "DOMAIN ROUTER" — paste `nodes/DOMAIN_ROUTER.js`
2. Add Code node "PROMPT BUILDER" — paste `nodes/PROMPT_BUILDER.js`
3. Add Code node "GATE CONFIG" — paste `nodes/GATE_CONFIG.js`
4. Add Code node "OUTPUT TEMPLATE" — paste `nodes/OUTPUT_TEMPLATE.js`
5. Set all 4 to Continue On Fail = true
6. Position them in the canvas near their connection points

### Step 2: Update existing code nodes (still using old wiring)
7. Update INPUT VALIDATOR code → `mods/INPUT_VALIDATOR_v6.js`
8. Update COLLECTIVE ASSEMBLER code → `mods/COLLECTIVE_ASSEMBLER_v6.js`
9. Update CASCADE VALIDATOR code → `mods/CASCADE_VALIDATOR_v6.js`
10. Update PASS2 BODY BUILDER code → `mods/PASS2_BODY_BUILDER_v6.js`
11. Update PASS2 FALLBACK BB code → `mods/PASS2_FALLBACK_BODY_BUILDER_v6.js`
12. Update OUTPUT FORMATTER code → `mods/OUTPUT_FORMATTER_v6.js`

### Step 3: Update Agent HTTP nodes
13. URIEL HTTP: Change system prompt to `{{ $json.systemprompt_URIEL }}`, user to `{{ $json.userprompt }}`
14. COLOSSUS HTTP: Change system prompt to `{{ $json.systemprompt_COLOSSUS }}`, user to `{{ $json.userprompt }}`
15. HANIEL HTTP: Change system prompt to `{{ $json.systemprompt_HANIEL }}`, user to `{{ $json.userprompt }}`
16. RAZIEL HTTP: Change system prompt to `{{ $json.systemprompt_RAZIEL }}`, user to `{{ $json.userprompt }}`
17. SARIEL HTTP: Change system prompt to `{{ $json.systemprompt_SARIEL }}`, user to `{{ $json.userprompt }}`

### Step 4: Rewire connections
18. Disconnect INPUT VALIDATOR → COLLECTIVE ASSEMBLER
19. Connect INPUT VALIDATOR → DOMAIN ROUTER → PROMPT BUILDER → COLLECTIVE ASSEMBLER
20. Disconnect Agent Merge → CASCADE VALIDATOR
21. Connect Agent Merge → GATE CONFIG → CASCADE VALIDATOR
22. Disconnect Merge (Append) → OUTPUT FORMATTER
23. Connect Merge (Append) → OUTPUT TEMPLATE → OUTPUT FORMATTER

### Step 5: Validation
24. Save workflow
25. Run with MARKET domain test payload (Section 5 below) — MUST match v5.2.1 behavior
26. Run with GENERAL domain test payload — verify new domain works
27. Compare gate scores, agent outputs, synthesis quality

---

## SECTION 5: TEST PAYLOADS

### 5.1 MARKET Domain (Regression Test)

```json
{
  "domain": "MARKET",
  "query": "Evaluate PSLV for swing entry based on silver deficit thesis",
  "context": "Shanghai premium elevated, COMEX inventory declining, DXY weakening",
  "domaindata": {
    "ticker": "PSLV",
    "price": 11.42,
    "volume": 3200000,
    "rsi": 58.3,
    "sector": "Precious Metals",
    "short_interest": 2.1,
    "hunter_modules": {
      "H1": "Price above 20/50 SMA",
      "H4": "No recent insider filings",
      "H17": "No 13F changes detected",
      "H37": "DXY: 103.2, trending down",
      "H38": "10Y yield: 4.21%, stable",
      "H39": "Flow: Net institutional buying detected"
    }
  }
}
```

### 5.2 GENERAL Domain (New Capability Test)

```json
{
  "domain": "GENERAL",
  "query": "Evaluate whether migrating our n8n workflows to a Kubernetes-based deployment would improve reliability and scalability for the Collective Intelligence Layer",
  "context": "Currently running n8n on single VPS. 56-node CIL pipeline. 5 external API calls per run. Exploring horizontal scaling.",
  "domaindata": {
    "current_infra": "Single VPS, 4 CPU, 16GB RAM, Ubuntu 24",
    "pipeline_complexity": "56 nodes, 5 parallel HTTP calls, 2 fallback branches",
    "run_frequency": "10-20 runs per day currently, scaling to 50-100",
    "budget_constraint": "$200/month max infrastructure spend",
    "team_size": 1,
    "constraints": ["Single operator", "No Kubernetes experience", "Must maintain uptime during migration"]
  }
}
```

### 5.3 Backward Compatibility Test (old v5.2.1 format)

```json
{
  "query": "Evaluate AG for position entry",
  "hunterdata": {
    "ticker": "AG",
    "price": 12.85,
    "volume": 5400000,
    "rsi": 62.1
  }
}
```

This should auto-detect: no `domain` → defaults to GENERAL, `hunterdata` → mapped to `domaindata`. If the intent is MARKET, the user needs to specify `"domain": "MARKET"`.

---

## SECTION 6: FILE MANIFEST

### New Node Code (paste into n8n Code nodes):
| File | Node | Type |
|------|------|------|
| `nodes/DOMAIN_ROUTER.js` | DOMAIN ROUTER | NEW |
| `nodes/PROMPT_BUILDER.js` | PROMPT BUILDER | NEW |
| `nodes/GATE_CONFIG.js` | GATE CONFIG | NEW |
| `nodes/OUTPUT_TEMPLATE.js` | OUTPUT TEMPLATE | NEW |

### Modified Node Code (replace existing n8n Code node contents):
| File | Node | Change |
|------|------|--------|
| `mods/INPUT_VALIDATOR_v6.js` | INPUT VALIDATOR | Full replace |
| `mods/COLLECTIVE_ASSEMBLER_v6.js` | COLLECTIVE ASSEMBLER | Full replace |
| `mods/CASCADE_VALIDATOR_v6.js` | CASCADE VALIDATOR | Full replace |
| `mods/PASS2_BODY_BUILDER_v6.js` | PASS2 BODY BUILDER | Full replace |
| `mods/PASS2_FALLBACK_BODY_BUILDER_v6.js` | PASS2 FALLBACK BB | Full replace |
| `mods/OUTPUT_FORMATTER_v6.js` | OUTPUT FORMATTER | Full replace |

### Agent HTTP Nodes (expression changes only — no code files):
| Node | System Prompt Expression | User Prompt Expression |
|------|-------------------------|----------------------|
| URIEL HTTP | `{{ $json.systemprompt_URIEL }}` | `{{ $json.userprompt }}` |
| COLOSSUS HTTP | `{{ $json.systemprompt_COLOSSUS }}` | `{{ $json.userprompt }}` |
| HANIEL HTTP | `{{ $json.systemprompt_HANIEL }}` | `{{ $json.userprompt }}` |
| RAZIEL HTTP | `{{ $json.systemprompt_RAZIEL }}` | `{{ $json.userprompt }}` |
| SARIEL HTTP | `{{ $json.systemprompt_SARIEL }}` | `{{ $json.userprompt }}` |

---

## SECTION 7: RISK NOTES

1. **`new Function()` in CASCADE VALIDATOR** — Gate evaluators are executed via `new Function()`. This is safe in n8n's sandboxed Code node environment but would be a security concern if gate definitions ever came from untrusted external input. Currently they only come from GATE CONFIG (internal code node), so this is fine.

2. **Field cascade dependency** — Every node depends on upstream fields passing through. If any node strips fields (returns only partial data), downstream nodes break. All node code uses `...input` spread to preserve the full payload. Do NOT use n8n's "Set" node to overwrite the payload between any of these nodes.

3. **Continue On Fail** — All new and modified Code nodes should have Continue On Fail = true. This is how v5.2.1 achieved stability. The error routing still works because nodes check for error states in their inputs.

4. **Backward compatibility** — The INPUT VALIDATOR accepts `hunterdata` and maps it to `domaindata`. But without an explicit `domain: "MARKET"`, it defaults to GENERAL. Old payloads that relied on implied MARKET behavior need to add `"domain": "MARKET"` to their webhook calls. This is the ONE breaking change.

5. **Agent API differences** — Each agent uses a different API format (OpenAI, xAI, Google Gemini, DeepSeek, Perplexity). The expression `{{ $json.systemprompt_URIEL }}` works in the JSON body regardless of API format because it's just a string substitution. But verify that each API's body structure accepts a dynamic string where the hardcoded text was.

---

## SECTION 8: NEXT — POST-WIRING COMPLEXITY REVIEW

Once wired and validated (MARKET regression = 10/10, GENERAL domain produces coherent output):

1. **Gate Complexity Expansion** — Current 9 gates per domain is the FLOOR. MARKET domain should grow to 19+ gates matching full METATRON v10.7 (30 gates = 9 cascade + 21 METATRON). GATE CONFIG can expand the gate array without touching CASCADE VALIDATOR.

2. **Domain Addition** — Adding a new domain = adding one block to DOMAIN_REGISTRY in DOMAIN ROUTER + one block of evaluators in GATE CONFIG. No other nodes change. Target: CONTRACT, CODE, RESEARCH next.

3. **FORGE Integration** — FORGE becomes the primary input path. FORGE output feeds directly into INPUT VALIDATOR with pre-identified domain, optimized query, and structured domaindata. Webhook remains for direct/API access.

4. **Agent Weighting** — Not all agents are equal on all domains. Future: DOMAIN ROUTER could include `agent_weights` that CASCADE VALIDATOR uses to weight agent outputs differently. E.g., RAZIEL gets 1.5x weight on MARKET (alternative data specialist) but 0.8x on GENERAL.

5. **Dynamic Gate Thresholds** — Gate thresholds could adapt based on query complexity, data availability, or user-specified confidence requirements. GATE CONFIG already has the structure for this.

---

**END OF MASTER WIRING DOCUMENT**
**CIL v6.0 — Universal Abstraction Layer**
**🔱 The Collective serves everything.**
