# PHOENIX CARRY-FORWARD — CIL UNIVERSAL ABSTRACTION LAYER
## Session Pivot: 2026-03-07
## Status: CIL v5.2.1 PRODUCTION (10/10) — Pausing domain-specific testing to build universal layer

---

## DECISION

CIL v5.2.1 achieved 10/10 on 2026-03-07. Rather than build a test runner for the current AIORA-locked implementation, Principal decided to build the universal abstraction layer FIRST. Testing a market-specific pipeline that's about to be generalized is wasted effort.

---

## WHAT EXISTS (Working — Do Not Break)

- 56-node n8n pipeline, 10/10 validated
- 5 agents (URIEL/OpenAI, COLOSSUS/xAI, HANIEL/Google, RAZIEL/DeepSeek, SARIEL/Perplexity)
- 9-gate CASCADE VALIDATOR
- PASS2 Claude synthesis + GPT-4o fallback
- Merge node (Append) combining pipeline + synthesis
- OUTPUT FORMATTER (dual-input)
- Full Telegram alerting, GitHub archival, test validation, database logging
- All code nodes, wiring, and error handling stable

---

## WHAT NEEDS TO CHANGE (Market-Locked → Universal)

### 1. AGENT PROMPTS (5 HTTP Request nodes)
- **Current:** Hardcoded system prompts telling agents to analyze as market analysts
- **Needed:** Dynamic system prompts driven by domain identifier
- **Approach:** FORGE or INPUT VALIDATOR sets a `domain` field. A PROMPT BUILDER code node upstream of the 5 agents constructs domain-appropriate system prompts. Agent HTTP nodes reference `$json.systemprompt` instead of hardcoded text.

### 2. INPUT SCHEMA (INPUT VALIDATOR)
- **Current:** Expects `hunterdata` with price, volume, RSI, MACD, short_interest, etc.
- **Needed:** Generic `domaindata` that accepts whatever structured context the domain requires
- **Approach:** INPUT VALIDATOR checks for `domain`, `query`, `context`, and `domaindata` (flexible object). HUNTER-specific validation becomes one branch of a domain router.

### 3. CASCADE VALIDATOR (3 market-locked gates)
- **Current:** Gate 4 = Risk/Reward Ratio, Gate 8 = IRONCLAD Position Sizing, Gate 3b = HUNTER module completeness
- **Needed:** Domain-appropriate quality gates
- **Approach:** Gate definitions become configurable. A GATE CONFIG code node reads the `domain` and produces a gate array. CASCADE VALIDATOR iterates the array instead of hardcoding 9 specific checks. Universal gates stay (Data Sufficiency, Directional Consensus, Catalyst, Timeline, Counter-Thesis). Domain gates swap based on config.

### 4. PASS2 BODY BUILDER
- **Current:** Synthesis prompt says "synthesize market thesis"
- **Needed:** Domain-aware synthesis prompt
- **Approach:** PASS2 BODY BUILDER reads `domain` field and constructs appropriate synthesis instructions.

### 5. OUTPUT FORMATTER
- **Current:** Telegram says "DIRECTION: BULLISH", "DATA COMPLETENESS: 81%"
- **Needed:** Domain-appropriate output labels
- **Approach:** OUTPUT FORMATTER reads `domain` and formats accordingly. Market = DIRECTION/CONFIDENCE. Legal = RECOMMENDATION/RISK LEVEL. Code = APPROACH/QUALITY SCORE. Research = CONCLUSION/EVIDENCE STRENGTH.

### 6. COLLECTIVE ASSEMBLER
- **Current:** References `hunterdata` by name
- **Needed:** References `domaindata` generically
- **Approach:** Change field name from `hunterdata` to `domaindata`. ASSEMBLER passes it through without caring what's inside.

---

## PROPOSED DOMAIN IDENTIFIERS

| Domain | Description | Example Query |
|--------|-------------|---------------|
| MARKET | AIORA market analysis (current) | "Evaluate HYMC for swing entry" |
| CONTRACT | Contract review and risk analysis | "Review this MSA for liability exposure" |
| CODE | Code review, architecture, implementation | "Review this microservice architecture" |
| RESEARCH | Research papers, white papers, deep analysis | "Evaluate the evidence for X" |
| PROPOSAL | RFP responses, business proposals | "Generate proposal for DoD RFI-2026-0431" |
| SPEC | Technical specifications, system design | "Design hookup data from machine specs" |
| FINANCIAL | Financial modeling, cost analysis | "Build cost model from this data lake" |
| CONSULTING | Process review, improvement recommendations | "Review our CI/CD pipeline for bottlenecks" |
| LEGAL | Legal analysis, statute review | "Analyze this licensing agreement against 17 USC" |
| GENERAL | Catch-all for unstructured queries | "What's the best approach to X?" |

---

## BUILD ORDER

### Phase 1: Abstraction Layer (don't touch working nodes)
1. Create DOMAIN ROUTER code node (reads `domain` from input, sets config)
2. Create PROMPT BUILDER code node (generates 5 agent prompts per domain)
3. Create GATE CONFIG code node (generates gate array per domain)
4. Create OUTPUT TEMPLATE code node (generates format labels per domain)

### Phase 2: Wire In (minimal changes to existing nodes)
5. INPUT VALIDATOR — add `domain` field, rename `hunterdata` → `domaindata`
6. Agent HTTP nodes — change system prompt from hardcoded to `{{ $json.systemprompt_URIEL }}` etc.
7. CASCADE VALIDATOR — change from hardcoded gates to configurable gate array
8. PASS2 BODY BUILDER — add domain-aware synthesis prompt
9. OUTPUT FORMATTER — add domain-aware formatting
10. COLLECTIVE ASSEMBLER — rename `hunterdata` → `domaindata`

### Phase 3: Test
11. Run MARKET domain — should produce identical 10/10 results (regression test)
12. Run CONTRACT domain with sample MSA
13. Run CODE domain with sample architecture
14. Build CIL Test Runner v1.0 with multi-domain test suite

---

## FORGE INTEGRATION POINT

FORGE is the query optimizer. In the universal CIL:
1. User submits raw query to FORGE
2. FORGE identifies domain, extracts structured requirements, improves prompt quality
3. FORGE outputs: `{ domain, query, context, domaindata, forge_score }`
4. CIL receives FORGE output, routes through DOMAIN ROUTER, processes through Collective
5. Output returns to user in domain-appropriate format

FORGE → CIL is the primary flow. CIL can also be called directly (API/webhook) with pre-formed input for automation pipelines.

---

## FILES ON GITHUB (Current)
- `AIORA/CIL/docs/CIL_v5.2.1_README.md`
- `AIORA/CIL/docs/CIL_v5.2.1_FIX_MANIFEST.md`
- `AIORA/CIL/docs/CIL_PASS2_FIX_MANIFEST.md`
- `AIORA/CIL/code/CIL_TEST_VALIDATOR_v5.2.1.js`
- `AIORA/CIL/code/CIL_DIAGNOSTIC_ENGINE_v5.2.1.js`
- `AIORA/CIL/code/CIL_PASS2_BODY_BUILDER_v5.2.1.js`
- `AIORA/CIL/code/CIL_PASS2_FALLBACK_BODY_BUILDER_v5.2.1.js`
- `AIORA/CIL/docs/PHOENIX_CARRY_FORWARD_20260307.md`

## REMAINING BACKLOG (Unchanged)
- HUNTER H37-H41 — Gate 9 Correlation modules (MARKET domain only)
- userPreferences update — v10.4 → v10.6 instructions, v10.5 → v10.7 protocol URLs
- Export v5.2.1 workflow JSON to GitHub
- TEST SUMMARY ALERT cosmetic fix (says "FAILURE" on PASS)
- n8n MCP server / knowledge base build

---

**PHOENIX CLOSE. CIL v5.2.1 PRODUCTION. Universal abstraction layer is next build.**
**Target: CIL v6.0 — Domain-Agnostic Collective Intelligence Engine.** 🔱
