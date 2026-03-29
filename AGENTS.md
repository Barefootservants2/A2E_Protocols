# AGENTS.md — Uriel Covenant AI Collective
# Ashes2Echoes LLC | A2E_Protocols Repository
# This file instructs Codex on how to navigate and contribute to this codebase

---

## WHAT THIS REPO IS

This is the protocol and intelligence library for the Uriel Covenant AI Collective — a multi-agent market research and risk management system. It is NOT a standard software project. It is an operational intelligence platform.

**Principal:** William Earl Lemon, Ashes2Echoes LLC, Newport News, VA  
**Operating Protocol:** METATRON v10.7  
**Active deployment:** n8n cloud (ashes2echoes.app.n8n.cloud)

---

## REPO STRUCTURE — WHAT LIVES WHERE

```
A2E_Protocols/
├── PROTOCOLS/PRODUCTION/     ← LIVE protocols (METATRON, HUNTER, ORACLE, etc.)
│   ├── METATRON_v10.6_PRIME_DIRECTIVE.md   ← Base protocol
│   ├── METATRON_v10.7_AMENDMENT.md         ← Latest delta (Gate 9, Kill Switch)
│   ├── ORACLE_STRUCTURED_FORMAT_v2.0.md    ← ORACLE query standard
│   ├── HUNTER_11SECTOR_SCAN_v4.0.md        ← Market scan protocol
│   └── [others]
├── PROTOCOLS/IRONCLAD/       ← Risk management rules
│   ├── IRONCLAD_PROTOCOL_v1.0.md           ← Base rules
│   └── IRONCLAD_v2.1_AMENDMENT.md          ← Latest (Track 1/2, stops)
├── COLLECTIVE/               ← Agent instructions
│   ├── BOOTSTRAP/            ← Short starter prompts (paste into AI platforms)
│   ├── MICHA/                ← Claude instructions (latest = v10.7)
│   ├── URIEL/                ← ChatGPT instructions
│   ├── COLOSSUS/             ← Grok instructions
│   ├── HANIEL/               ← Gemini instructions
│   ├── RAZIEL/               ← DeepSeek instructions
│   └── SARIEL/               ← Perplexity instructions
├── HUNTER/MODULES/           ← Intelligence module specs (H1-H42+)
├── GABRIEL/                  ← Overnight watch automation spec + n8n JSON
├── AIORA/                    ← CIL code, SENTINEL, pipeline specs
├── FORGE/TEMPLATES/          ← Prompt libraries (FINANCIAL, BRAND, CODE_OPS)
├── BULLSEYE/                 ← Platform UI design spec + design skill
├── PHOENIX/                  ← Session close documents, carry-forwards
├── N8N/                      ← n8n workflow JSONs and patches
├── ARCHIVE/                  ← Historical versions (READ-ONLY — do not modify)
└── AGENTS.md                 ← This file
```

---

## VERSIONING RULES

**NEVER modify files with these in the path:**
- `ARCHIVE/` — historical record, immutable
- Any file with `_v[N]` where N is not the latest version number

**ALWAYS create new versioned files rather than editing:**
- If updating IRONCLAD, create `IRONCLAD_v2.2_AMENDMENT.md` — do not edit v2.1
- If updating METATRON, create `METATRON_v10.8_AMENDMENT.md`
- Latest version wins. Agents fetch the highest version number.

**Version number pattern:** `_v[MAJOR].[MINOR]` or `_v[MAJOR].[MINOR].[PATCH]`

---

## CODING STANDARDS (for n8n JavaScript Code nodes)

**Node naming:** `ALL_CAPS_WITH_UNDERSCORES` — e.g., `THRESHOLD_ENGINE`, `NEWS_SCANNER`  
**Variable naming:** camelCase for JS variables — e.g., `marketData`, `yellowTriggers`  
**Error handling:** ALWAYS wrap external HTTP calls in try/catch. Never throw — return partial data.  
**alwaysOutputData:** ALWAYS `false` on HTTP Request nodes (zombie bug prevention)  
**GitHub PUTs:** ALWAYS GET file first to retrieve SHA before any PUT operation  
**Telegram:** HTML parse mode only. Escape `< > &` in all dynamic content.  
**Supabase project:** `bwtguoaakkmsnzomswem` — never hardcode keys, use n8n credentials  
**Credentials:** Never hardcode API keys. Reference n8n credential names.

---

## WHAT CODEX CAN DO HERE

### HIGH PRIORITY TASKS

1. **Audit and clean ARCHIVE/** — Identify which files are superseded by live versions in PROTOCOLS/. Flag for deletion by Principal. Do NOT delete — only report.

2. **Standardize COLLECTIVE agent files** — Ensure v10.6 files are superseded. Check that all agents have matching v10.7 files. Flag any agent missing current version.

3. **Build missing n8n workflow JSONs** — GABRIEL Overnight Watch JSON exists. HUNTER-DAILY workflow JSON does NOT exist. Spec is at `PROTOCOLS/PRODUCTION/HUNTER_WIRING_DIAGRAM_v11.0.md`. Build the JSON per spec.

4. **Generate test harness** — For any n8n Code node, generate a test spec following `FORGE/TEMPLATES/CODE_OPS/FORGE_CODE_OPS_TEMPLATES_v1.0.md` Template CO-5 standard.

5. **README generation** — Each major directory is missing a README explaining what's in it and which file is current. Generate per-directory READMEs.

### HOW TO APPROACH PROTOCOL CHANGES

When updating a protocol:
1. Read the current highest-version file
2. Identify the delta (what's changing)
3. Write the delta as an AMENDMENT file, not a full rewrite
4. Reference the base document in the amendment header
5. Update VERSION_CHANGELOG.md
6. Do NOT rewrite ARCHIVE files

### WHAT CODEX SHOULD NOT DO

- Do NOT execute any trades or market orders
- Do NOT modify PHOENIX session close documents (historical record)
- Do NOT change IRONCLAD risk parameters without explicit Principal instruction
- Do NOT delete any ARCHIVE files
- Do NOT push directly to main without Principal review — open a PR

---

## TESTING

Test any n8n Code node by:
1. Running with mock input data (empty arrays, null values, missing fields)
2. Confirming output schema matches expected downstream node input
3. Verifying error cases return valid JSON with error field, not thrown exceptions
4. Checking alwaysOutputData is false on all HTTP nodes

Test command (local): `node test_[WORKFLOW_NAME].js`  
Test files location: `test-harness/` (separate repo: `Barefootservants2/test-harness`)

---

## DEPLOYMENT

Workflows deploy to: `https://ashes2echoes.app.n8n.cloud`  
Method: Import JSON via n8n UI (git clone blocked by proxy — use UI import)  
Credentials: Set in n8n credential manager — never in workflow JSON  
Activation: Manual only after Principal review

---

*AGENTS.md v1.0 | March 27, 2026*  
*Ashes2Echoes LLC | Uriel Covenant AI Collective*

