# AGENTS.md — Uriel Covenant AI Collective
# Ashes2Echoes LLC | A2E_Protocols Repository
# v1.1 | March 29, 2026
# This file instructs Codex on how to navigate and contribute to this codebase

---

## WHAT THIS REPO IS

This is the protocol and intelligence library for the Uriel Covenant AI Collective — a multi-agent market research, risk management, and automation platform. It is NOT a standard software project. It is an operational intelligence platform governed by METATRON protocol.

**Principal:** William Earl Lemon, Ashes2Echoes LLC, Newport News, VA
**Operating Protocol:** METATRON v10.7
**Active deployment:** n8n Cloud (ashes2echoes.app.n8n.cloud)
**CIL version:** v6.1 (LIVE, VALIDATED)
**GABRIEL version:** v2.1 (LIVE, VALIDATED March 29, 2026)

---

## THE COLLECTIVE — WHO YOU ARE WORKING WITH

| Agent | Platform | Role | Model |
|---|---|---|---|
| MICHA | Claude (Anthropic) | CIO — synthesis, enforcement, session management | Claude Sonnet 4.6 |
| URIEL | ChatGPT (OpenAI) | CEO — strategic synthesis, Codex integration | GPT-5.2 |
| COLOSSUS | Grok (xAI) | CTO — real-time monitoring, X sentiment | Grok 4 |
| HANIEL | Gemini (Google AI) | CPO — product, brand, multimodal | Gemini 3.0 Pro |
| RAZIEL | DeepSeek | Chief Adjudication — counter-thesis, evidence | DeepSeek R1 |
| SARIEL | Perplexity | Chief Intelligence — real-time research | Sonar Pro |
| GABRIEL | n8n | Chief Automation — all workflow execution | n8n Cloud |

**CODEX** is the build execution arm. URIEL directs strategy. Codex executes builds.
MICHA governs. Codex does not make trading or risk decisions.

---

## REPO STRUCTURE — WHAT LIVES WHERE

```
A2E_Protocols/
├── PROTOCOLS/
│   ├── PRODUCTION/           ← LIVE protocols — READ THESE FIRST
│   │   ├── METATRON_v10.6_PRIME_DIRECTIVE.md   ← Base protocol (30 gates)
│   │   ├── METATRON_v10.7_AMENDMENT.md         ← CURRENT DELTA (Gate 9, Kill Switch)
│   │   ├── ORACLE_STRUCTURED_FORMAT_v2.0.md    ← Market analysis standard
│   │   └── HUNTER_11SECTOR_SCAN_v4.0.md        ← Market scan protocol
│   └── IRONCLAD/             ← Risk management rules
│       ├── IRONCLAD_PROTOCOL_v1.0.md           ← Base rules
│       └── IRONCLAD_v2.1_AMENDMENT.md          ← CURRENT (stops, position limits)
├── COLLECTIVE/               ← Agent instructions
│   ├── BOOTSTRAP/            ← Paste these into AI platforms (short starters)
│   ├── MICHA/                ← Claude — CURRENT: MICHA_INSTRUCTIONS_v10.7.md
│   ├── URIEL/                ← ChatGPT — CURRENT: v10.7
│   ├── COLOSSUS/             ← Grok — CURRENT: v10.7
│   ├── HANIEL/               ← Gemini — CURRENT: v10.7
│   ├── RAZIEL/               ← DeepSeek — CURRENT: v10.7
│   └── SARIEL/               ← Perplexity — CURRENT: v10.7
├── GABRIEL/                  ← Overnight Watch automation
│   ├── GABRIEL_OVERNIGHT_WATCH_v2.0.json       ← CURRENT n8n workflow (v2.1 live in n8n)
│   └── GABRIEL_OVERNIGHT_WATCH_README.md
├── AIORA/                    ← CIL, SENTINEL pipeline specs
│   └── CIL/                  ← CIL architecture docs (JSON lives in AIORA private repo)
├── HUNTER/                   ← Intelligence module specs
│   └── MODULES/              ← H1-H42 module specs
├── FORGE/TEMPLATES/          ← Prompt libraries
├── BULLSEYE/                 ← Platform UI design spec
├── PHOENIX/                  ← Session close documents (READ-ONLY historical)
├── N8N/                      ← n8n workflow patches and utilities
├── ARCHIVE/                  ← Historical versions (IMMUTABLE — do not modify)
├── .agents/skills/           ← Codex skills (see CODEX SKILLS section below)
├── AGENTS.md                 ← This file
├── README.md
└── VERSION_CHANGELOG.md
```

**Related repos:**
- `Barefootservants2/AIORA` (PRIVATE) — CIL v6.1 JSON, n8n workflow JSONs, trade logs
- `Barefootservants2/test-harness` (PUBLIC) — TypeScript test harness for validation
- `Barefootservants2/A2E_Intelligence` (PRIVATE) — Intelligence archive, articles, research
- `Barefootservants2/A2E_Career` (PRIVATE) — Job applications, resume, cover letters

---

## CURRENT PRODUCTION STATE

| System | Version | Status | Location |
|---|---|---|---|
| CIL | v6.1 | LIVE, VALIDATED | AIORA/CIL/ (private) |
| GABRIEL Overnight Watch | v2.1 | LIVE, VALIDATED | GABRIEL/ + n8n |
| SENTINEL | v2.0 | LIVE | AIORA/SENTINEL/ (private) |
| METATRON | v10.7 | ACTIVE | PROTOCOLS/PRODUCTION/ |
| IRONCLAD | v2.1 | ACTIVE | PROTOCOLS/IRONCLAD/ |
| HUNTER | v2.0 | BUILT, NOT DEPLOYED | HUNTER/ (canvas exists, H30-H35 incomplete) |

---

## VERSIONING RULES

**NEVER modify files with these in the path:**
- `ARCHIVE/` — historical record, immutable
- `PHOENIX/` — session close documents, historical record

**ALWAYS create new versioned files rather than editing:**
- If updating IRONCLAD, create `IRONCLAD_v2.2_AMENDMENT.md` — do not edit v2.1
- If updating METATRON, create `METATRON_v10.8_AMENDMENT.md`
- Latest version wins. Agents fetch the highest version number.

**Version number pattern:** `_v[MAJOR].[MINOR]` or `_v[MAJOR].[MINOR].[PATCH]`

---

## CODING STANDARDS (n8n JavaScript Code nodes)

**Node naming:** `ALL_CAPS_WITH_UNDERSCORES` — e.g., `THRESHOLD_ENGINE`, `NEWS_SCANNER`
**Variable naming:** camelCase — e.g., `marketData`, `yellowTriggers`
**Error handling:** ALWAYS wrap external HTTP calls in try/catch. Never throw. Return partial data with error field.
**alwaysOutputData:** ALWAYS `false` on Code nodes and HTTP Request nodes (zombie bug prevention)
**GitHub PUTs:** ALWAYS GET file first to retrieve SHA before any PUT operation
**Telegram:** HTML parse mode only. Escape `< > &` in all dynamic content.
**Supabase:** Project ID `bwtguoaakkmsnzomswem` — NEVER hardcode keys, use n8n credentials
**Credentials:** NEVER hardcode API keys in workflow JSON. Reference n8n credential names.
**Data flow:** When downstream nodes need upstream data, use `$('NODE_NAME').first().json.field` not `$json.field` — `$json` contains the immediate upstream output only.
**Multi-signal logic:** Add news alerts to yellowTriggers AFTER multi-signal count check. News cannot inflate market signal counts toward escalation thresholds.
**Kill Switch proxies:** Use 24hr futures (DX=F for dollar, ZB=F for bonds) not ETFs (UUP, TLT) for overnight monitoring. ETFs have near-zero overnight volume.

---

## CODEX SKILLS

Skills live in `.agents/skills/` (repo-specific) or `~/.codex/skills/` (user global).
Each skill is a folder with a `SKILL.md` file.

### Current skills in this repo (.agents/skills/):

**n8n-code-node** — Build a JavaScript code node for n8n following A2E standards
Triggers: "write a code node", "build an n8n node", "write the JavaScript for"
Standards: zombie bug check, try/catch on all HTTP, HTML Telegram escaping, data flow patterns

**hunter-module** — Build a HUNTER intelligence module (H-series)
Triggers: "build H[N]", "write module H", "create HUNTER module"
Standards: Finnhub/Yahoo/SEC endpoint patterns, normalizer output schema, error passthrough

**protocol-amendment** — Write a METATRON or IRONCLAD amendment
Triggers: "update METATRON", "amend IRONCLAD", "write protocol change"
Standards: Amendment format (not full rewrite), reference base doc, update VERSION_CHANGELOG

**test-spec** — Write a test spec for an n8n code node
Triggers: "write a test", "test this node", "validate this code"
Standards: Mock input data, null/empty cases, output schema validation, no thrown exceptions

### How to add a new skill:
1. Create `.agents/skills/[skill-name]/` directory
2. Add `SKILL.md` with YAML frontmatter (name, description, triggers)
3. Add any supporting scripts in `scripts/` subfolder
4. Codex picks it up automatically on next session

---

## WHAT CODEX CAN DO HERE

### HIGH PRIORITY TASKS (P0-P1)

**P0 — Fix HUNTER credentials (do not build new modules until data flows)**
Files: `HUNTER/MODULES/` and `AIORA/N8N/` (private repo)
Broken: Finnhub keys on H4, H5, H6, H25, H30 (concatenated, 80 chars, should be 40)
Broken: TwelveData key expired on H7-H9, H11, H14, H15, H18-H20, H22
Broken: metals.dev on H29 (corrupted, returns 401)
Action: Identify which nodes have bad keys, flag for Principal to re-enter credentials in n8n UI

**P1 — Write H30-H35 normalizer JavaScript**
Spec: `PROTOCOLS/PRODUCTION/HUNTER_WIRING_DIAGRAM_v11.0.md`
These 6 nodes are on the canvas, wired, but have no JavaScript code.
Output schema must match what H35 Correlator expects as input.
Each normalizer takes raw API response, extracts signal value 0-100, outputs: `{ module, signal_value, raw, timestamp }`

**P1 — Wire HUNTER → CIL webhook**
HUNTER consolidation node should POST to CIL Production webhook:
`https://ashes2echoes.app.n8n.cloud/webhook/9d360d66-4d0e-46e4-9f24-dea7170e1ebe`
Payload schema: `{ query, domain: "MARKET", urgency: "STANDARD", source: "HUNTER_DAILY", opportunities: [...] }`

**P2 — Build AGENTS.md Codex skills (.agents/skills/)**
See CODEX SKILLS section. Create the 4 skill directories with SKILL.md files.

**P2 — Build GABRIEL test harness**
Separate n8n workflow that injects mock market data, bypasses Yahoo Finance and Finnhub.
Must simulate: GREEN run, YELLOW (news), YELLOW (market), RED (multi-signal), RED (Kill Switch), Kill Switch pre-alert.
Location: `N8N/GABRIEL_TEST_HARNESS.json`

**P3 — README generation**
Each major directory is missing a README explaining what's in it and which file is current.
Priority: PROTOCOLS/PRODUCTION, COLLECTIVE, HUNTER/MODULES, GABRIEL, AIORA/CIL

### HOW TO APPROACH PROTOCOL CHANGES

1. Read the current highest-version file first
2. Identify the delta
3. Write delta as AMENDMENT file, not full rewrite
4. Reference the base document in the amendment header
5. Update `VERSION_CHANGELOG.md`
6. Do NOT rewrite ARCHIVE files

### WHAT CODEX MUST NOT DO

- Do NOT execute trades or market orders
- Do NOT modify PHOENIX session close documents
- Do NOT change IRONCLAD risk parameters without explicit Principal instruction
- Do NOT delete any ARCHIVE files
- Do NOT push directly to main — open a PR for Principal review
- Do NOT hardcode API keys or credentials in any file pushed to GitHub
- Do NOT use `Math.abs()` for directional checks on DXY/dollar — rising dollar and falling dollar are different signals

---

## TESTING

**n8n Code node test pattern:**
1. Run with mock input (empty arrays, null values, missing fields)
2. Confirm output schema matches expected downstream node input
3. Verify error cases return `{ error: "message" }` JSON, not thrown exceptions
4. Check alwaysOutputData is false on all nodes

**Test harness repo:** `Barefootservants2/test-harness`
**Test files location:** `test-harness/src/`
**Test command (local):** `npm test`

---

## DEPLOYMENT

**Workflows deploy to:** `https://ashes2echoes.app.n8n.cloud`
**Method:** Import JSON via n8n UI — git clone is blocked by proxy, use UI import
**Credentials:** Set in n8n credential manager, NEVER in workflow JSON
**Activation:** Manual only after Principal review
**GitHub push pattern:** GET file for SHA first, then PUT with new content + SHA

---

## FIVE-RING PORTFOLIO FRAMEWORK (trading context)

| Ring | Asset Class | Allocation | Purpose |
|---|---|---|---|
| 1 | SGOV/dividend core | 40-50% | Capital preservation |
| 2 | PSLV+IBIT | 10-15% | Asymmetric thesis |
| 3 | Structural trends (PLTR-class) | 15-20% | Long-term growth |
| 4 | Tactical/event plays | 5-10% | 5% daily targets, EOD exit |
| 5 | Lottery | max 2% | 10x or zero |

**IRONCLAD rules Codex must respect:**
- Risk per trade: 1.5% of capital maximum
- Position maximum: 20%
- Sector maximum: 35%
- Same-day re-entry: BANNED
- Kill Switch triggers: DX=F rising >0.3% + ZB=F falling >0.3% + VIX >30 simultaneously

---

*AGENTS.md v1.1 | March 29, 2026*
*Ashes2Echoes LLC | Uriel Covenant AI Collective*
*METATRON v10.7 | CIL v6.1 | GABRIEL v2.1*
