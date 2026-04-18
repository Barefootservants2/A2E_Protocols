# 🔱 A2E Protocols — INDEX

**Repository:** `Barefootservants2/A2E_Protocols`
**Owner:** Ashes2Echoes LLC | William Earl Lemon, Principal
**Single entry point for the Uriel Covenant AI Collective documentation surface.**

Closes issue #13.

---

## 🧭 Start here

These five LATEST-pointer documents auto-resolve to the current version. Every session begins by fetching these.

| Document | Purpose | Path |
|---|---|---|
| **METATRON** | Prime directive — universal orchestration protocol | [`PROTOCOLS/PRODUCTION/METATRON_LATEST_PRIME_DIRECTIVE.md`](PROTOCOLS/PRODUCTION/METATRON_LATEST_PRIME_DIRECTIVE.md) |
| **MICHA Instructions** | CIO agent specification (Claude Opus 4.7) | [`COLLECTIVE/MICHA/MICHA_INSTRUCTIONS_LATEST.md`](COLLECTIVE/MICHA/MICHA_INSTRUCTIONS_LATEST.md) |
| **IRONCLAD** | Position management + risk rules (v3.0) | [`PROTOCOLS/IRONCLAD/IRONCLAD_LATEST.md`](PROTOCOLS/IRONCLAD/IRONCLAD_LATEST.md) |
| **PHOENIX Protocol** | Session management + carry-forward spec | [`PHOENIX/PHOENIX_PROTOCOL_LATEST.md`](PHOENIX/PHOENIX_PROTOCOL_LATEST.md) |
| **PHOENIX Carry-Forward** | Most recent session close — what was in-flight | [`PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md`](PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md) |

---

## 🏛 Protocols (governance surface)

Active protocols defining Collective behavior.

- [`PROTOCOLS/PRODUCTION/METATRON_LATEST_PRIME_DIRECTIVE.md`](PROTOCOLS/PRODUCTION/METATRON_LATEST_PRIME_DIRECTIVE.md) — Prime directive, unified governance (v10.8)
- [`PROTOCOLS/IRONCLAD/IRONCLAD_LATEST.md`](PROTOCOLS/IRONCLAD/IRONCLAD_LATEST.md) — Position management (v3.0): hard stops, tranche entry, trim schedule
- [`PROTOCOLS/IRONCLAD/IRONCLAD_QUICK_REFERENCE.md`](PROTOCOLS/IRONCLAD/IRONCLAD_QUICK_REFERENCE.md) — One-page reference card
- [`PROTOCOLS/GATES/AIORA_GATE_9.5_EARNINGS_CHECK.md`](PROTOCOLS/GATES/AIORA_GATE_9.5_EARNINGS_CHECK.md) — Earnings-aware gate spec
- [`ROUTING/ROUTING_LOGIC_v10.2.md`](ROUTING/ROUTING_LOGIC_v10.2.md) — Inter-agent routing decisions

---

## 🪽 Collective (agent roster)

The seven-agent Uriel Covenant, each governed by a LATEST instruction pointer + a short bootstrap.

### Instructions (LATEST pointers)

| Agent | Role | Model | Instructions |
|---|---|---|---|
| **MICHA** | CIO / Grand Synthesizer | Claude Opus 4.7 | [`COLLECTIVE/MICHA/MICHA_INSTRUCTIONS_LATEST.md`](COLLECTIVE/MICHA/MICHA_INSTRUCTIONS_LATEST.md) |
| **URIEL** | Fundamental Analyst | GPT-5.x (OpenAI) | [`COLLECTIVE/URIEL/URIEL_INSTRUCTIONS_LATEST.md`](COLLECTIVE/URIEL/URIEL_INSTRUCTIONS_LATEST.md) |
| **COLOSSUS** | Technical Analyst | Grok 4.x (xAI) | [`COLLECTIVE/COLOSSUS/COLOSSUS_INSTRUCTIONS_LATEST.md`](COLLECTIVE/COLOSSUS/COLOSSUS_INSTRUCTIONS_LATEST.md) |
| **HANIEL** | Macro / Regime | Gemini (Google) | [`COLLECTIVE/HANIEL/HANIEL_INSTRUCTIONS_LATEST.md`](COLLECTIVE/HANIEL/HANIEL_INSTRUCTIONS_LATEST.md) |
| **RAZIEL** | CAO / Counter-Thesis | DeepSeek | [`COLLECTIVE/RAZIEL/RAZIEL_INSTRUCTIONS_LATEST.md`](COLLECTIVE/RAZIEL/RAZIEL_INSTRUCTIONS_LATEST.md) |
| **SARIEL** | Citation Research | Perplexity | [`COLLECTIVE/SARIEL/SARIEL_INSTRUCTIONS_LATEST.md`](COLLECTIVE/SARIEL/SARIEL_INSTRUCTIONS_LATEST.md) |
| **GABRIEL** | Overnight Watch | n8n (workflow, not LLM) | [`COLLECTIVE/GABRIEL/GABRIEL_INSTRUCTIONS_LATEST.md`](COLLECTIVE/GABRIEL/GABRIEL_INSTRUCTIONS_LATEST.md) |

### Bootstraps (lightweight session starters)

All in [`COLLECTIVE/BOOTSTRAP/`](COLLECTIVE/BOOTSTRAP/) — ~1000-char pointer prompts that dispatch to the LATEST instruction file.

---

## ⚙️ Workflows (active specs)

### HUNTER (market scanner)
- [`HUNTER/MODULES/GAP1_H4_H17_H22_MANDATORY_CHECK_SPEC_v1.1.md`](HUNTER/MODULES/GAP1_H4_H17_H22_MANDATORY_CHECK_SPEC_v1.1.md) — Filing check rule
- [`HUNTER/MODULES/HUNTER_13F_WATCHLIST_v2.0.md`](HUNTER/MODULES/HUNTER_13F_WATCHLIST_v2.0.md) — Elite investor tracking
- See also: [`a2e-platform/hunter/`](https://github.com/Barefootservants2/a2e-platform/tree/main/hunter) (Python implementation)

### SENTINEL (portfolio monitor)
- [`SENTINEL/SENTINEL_STACK_v1.0.md`](SENTINEL/SENTINEL_STACK_v1.0.md) — Architecture
- [`SENTINEL/SENTINEL_AUDIT_2026-03-22.md`](SENTINEL/SENTINEL_AUDIT_2026-03-22.md) — Most recent audit
- See also: [`a2e-platform/sentinel/`](https://github.com/Barefootservants2/a2e-platform/tree/main/sentinel)

### GABRIEL (overnight watch)
- [`GABRIEL/OVERNIGHT_WATCH_SPEC_v2.0.md`](GABRIEL/OVERNIGHT_WATCH_SPEC_v2.0.md) — Current spec
- [`GABRIEL/GABRIEL_BUILD_THESIS_v1.0.md`](GABRIEL/GABRIEL_BUILD_THESIS_v1.0.md) — Rationale
- Kill switch now uses DX=F + ZB=F (futures), not UUP/TLT

### CIL (consensus engine)
- [`AIORA/CIL/docs/CIL_v5.2.1_README.md`](AIORA/CIL/docs/CIL_v5.2.1_README.md) — Production baseline
- [`AIORA/CIL/docs/PHOENIX_CIL_UNIVERSAL_PIVOT.md`](AIORA/CIL/docs/PHOENIX_CIL_UNIVERSAL_PIVOT.md) — v6.1 universal abstraction pivot
- See also: [`a2e-platform/cil/`](https://github.com/Barefootservants2/a2e-platform/tree/main/cil)

### SIGNAL ENGINE
- [`SIGNAL_ENGINE/SIGNAL_ENGINE_v1.0_ARCHITECTURE.md`](SIGNAL_ENGINE/SIGNAL_ENGINE_v1.0_ARCHITECTURE.md) — v1.1 live (Mon-Fri 6:30 AM ET)
- [`SIGNAL_ENGINE/DEPLOY/DEPLOYMENT_STATUS.md`](SIGNAL_ENGINE/DEPLOY/DEPLOYMENT_STATUS.md) — Current state

---

## 🐍 Python migration (declared P0)

All n8n workflows porting to Python. Target: standalone `a2e-platform` repo.

- [`PYTHON_MIGRATION/CLAUDE_CODE_BUILD_INSTRUCTIONS.md`](PYTHON_MIGRATION/CLAUDE_CODE_BUILD_INSTRUCTIONS.md) — Build conventions
- [`PYTHON_MIGRATION/CIL_PYTHON_BUILD_SPEC.md`](PYTHON_MIGRATION/CIL_PYTHON_BUILD_SPEC.md) — CIL spec
- [`PYTHON_MIGRATION/A2E_DATA_SOURCES_AND_CONSENSUS_SCANNER.md`](PYTHON_MIGRATION/A2E_DATA_SOURCES_AND_CONSENSUS_SCANNER.md) — Data layer
- [`PYTHON_MIGRATION/COWORK_TASKS.md`](PYTHON_MIGRATION/COWORK_TASKS.md) — Cowork-appropriate task queue
- Repo: **[`Barefootservants2/a2e-platform`](https://github.com/Barefootservants2/a2e-platform)** — 300+ tests, tagged releases

---

## 🔨 FORGE (commercial product)

The ANVIL + ASSAY + AUTOPSY prompting framework as a standalone product.

- [`BOOK/FORGE_STANDALONE_BOOK_SPEC.md`](BOOK/FORGE_STANDALONE_BOOK_SPEC.md) — Full book spec
- [`BOOK/BOOK_MANIFEST.md`](BOOK/BOOK_MANIFEST.md) — Chapter manifest
- [`BOOK/FORGE_BOOK_CH2_CASE_STUDY.md`](BOOK/FORGE_BOOK_CH2_CASE_STUDY.md) — Case-study chapter
- [`FORGE/ARSENAL/FORGE_PROMPT_ARSENAL_v1.md`](FORGE/ARSENAL/FORGE_PROMPT_ARSENAL_v1.md) — Prompt library
- [`FORGE/ARSENAL/A2E_vs_HORIZON_BATTLE_MAP.md`](FORGE/ARSENAL/A2E_vs_HORIZON_BATTLE_MAP.md) — Competitive analysis
- [`FORGE_FIELD_MANUALS/README.md`](FORGE_FIELD_MANUALS/README.md) — Applied field manuals (vol. 1: market intelligence)
- [`forge-v2/FORGE_V2_ARCHITECTURE.md`](forge-v2/FORGE_V2_ARCHITECTURE.md) — v2 landing experience
- Landing page: [forge-landing-theta.vercel.app](https://forge-landing-theta.vercel.app)

---

## 🎯 Platform domains

- **AIORA** (trading) — [`AIORA/`](AIORA/) — Five-Ring framework, CIL, Oracle Lightning elite-investor tracker
- **BULLSEYE** (interactive UI skill) — [`BULLSEYE/A2E_BULLSEYE_DESIGN_SKILL_v1.0.md`](BULLSEYE/A2E_BULLSEYE_DESIGN_SKILL_v1.0.md)
- **WORKFORCE** — [`WORKFORCE/A2E_WORKFORCE_SPEC_v1.0.md`](WORKFORCE/A2E_WORKFORCE_SPEC_v1.0.md)

---

## 🏢 Enterprise / business

- [`enterprise/uriel-covenant-enterprise-whitepaper.md`](enterprise/uriel-covenant-enterprise-whitepaper.md) — The whitepaper
- [`enterprise/siemens-one-pager.md`](enterprise/siemens-one-pager.md) — Siemens-facing brief
- [`enterprise/CODECHECK_PROTOCOL_v1.0.md`](enterprise/CODECHECK_PROTOCOL_v1.0.md) — Code-check protocol
- [`CREDENTIALS/A2E_CREDENTIAL_REGISTRY.md`](CREDENTIALS/A2E_CREDENTIAL_REGISTRY.md) — API-key + credential inventory

---

## 📋 Issue tracking + revision control

- **Open issues:** [github.com/Barefootservants2/A2E_Protocols/issues](https://github.com/Barefootservants2/A2E_Protocols/issues)
- **Snapshot CSV:** [`a2e-platform/issues/data/snapshot.csv`](https://github.com/Barefootservants2/a2e-platform/blob/main/issues/data/snapshot.csv)
- **Revision log:** [`a2e-platform/issues/data/REVISION_LOG.md`](https://github.com/Barefootservants2/a2e-platform/blob/main/issues/data/REVISION_LOG.md)
- **Stage tag:** `DEV-BASELINE-2026-04-18` — we are in DEV; TST cut pending gate criteria

---

## 📼 Session continuity

- [`PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md`](PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md) — Most recent close
- [`PHOENIX/PHOENIX_PROTOCOL_LATEST.md`](PHOENIX/PHOENIX_PROTOCOL_LATEST.md) — Protocol spec
- [`PHOENIX/PHOENIX_QUICKSTART_FOR_AGENTS.md`](PHOENIX/PHOENIX_QUICKSTART_FOR_AGENTS.md) — Onboarding for new agents
- [`PHOENIX/PHOENIX_RESUME_PROTOCOL_v1.0.md`](PHOENIX/PHOENIX_RESUME_PROTOCOL_v1.0.md) — Keyword protocol (RESUME / CLOSE SESSION / KILLSWITCH)
- Dated session archives: [`PHOENIX/CLOSES/`](PHOENIX/CLOSES/) and [`PHOENIX/PHOENIX_CARRYFORWARD_*.md`](PHOENIX/) — ~60+ dated carry-forwards, not enumerated here

---

## 🗄 Archive

[`ARCHIVE/`](ARCHIVE/) — 58 historical instruction/spec files preserved for audit. Not actively referenced; LATEST pointers supersede. Examples:
- Historical agent instructions (v9.0, v10.2, v10.3)
- Deprecated workflow specs
- Superseded protocols

---

## 🧭 Conventions

- **LATEST pointers** are authoritative for current-state. Versioned files (`*_v10.2.md`) are pinned snapshots.
- **Naming:** `{COMPONENT}_{DESCRIPTOR}_v{VERSION}.md` for pinned; `{COMPONENT}_LATEST.md` or `{COMPONENT}_{DESCRIPTOR}_LATEST.md` for pointers.
- **Protocol docs** live in [`PROTOCOLS/`](PROTOCOLS/)
- **Agent governance** lives in [`COLLECTIVE/{AGENT}/`](COLLECTIVE/)
- **Workflow specs** live at top-level per workflow: [`HUNTER/`](HUNTER/), [`SENTINEL/`](SENTINEL/), [`GABRIEL/`](GABRIEL/)
- **Session artifacts** live in [`PHOENIX/`](PHOENIX/)
- **Python implementations** live in the `a2e-platform` repo, not here

---

## 🔗 Related repositories

- **[`Barefootservants2/a2e-platform`](https://github.com/Barefootservants2/a2e-platform)** — Python platform (HUNTER, SENTINEL, CIL, PHOENIX session manager, issues DB)
- **[`Barefootservants2/A2E_Intelligence`](https://github.com/Barefootservants2/A2E_Intelligence)** — Intelligence archive (PRIVATE)
- **[`Barefootservants2/A2E_Career`](https://github.com/Barefootservants2/A2E_Career)** — LinkedIn / resumes / job applications (PRIVATE)

---

*Generated 2026-04-18. Refreshed when new LATEST pointers or top-level domains are added.*
