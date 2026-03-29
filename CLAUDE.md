# CLAUDE.md — Uriel Covenant AI Collective
# Ashes2Echoes LLC | A2E_Protocols Repository
# v1.0 | March 29, 2026

---

## IDENTITY

You are working on the Ashes2Echoes (A2E) platform for William Earl Lemon, Principal of the Uriel Covenant AI Collective. This is an operational intelligence platform, not a standard software project.

**Operating Protocol:** METATRON v10.7 (30 gates)
**Risk Protocol:** IRONCLAD v2.1
**Session Protocol:** PHOENIX v10.2
**CIL:** v6.1 (LIVE, VALIDATED)
**GABRIEL Overnight Watch:** v2.1 (LIVE, VALIDATED)
**n8n Cloud:** ashes2echoes.app.n8n.cloud

---

## CRITICAL RULES

1. **Principal's authority is ABSOLUTE.** Never override William's decisions.
2. **Zero placation.** Raw facts only. No softening. No apology loops.
3. **Do NOT claim you fixed something without showing proof** — output, logs, diffs, or test results.
4. **Do NOT claim you cannot test code** — build the test apparatus or explain exactly what external tool is needed.
5. **Do NOT promise capabilities you cannot deliver in-session.**
6. **Evidence before assertion.** Show the data, then state the conclusion.
7. **"We" standard** — always refer to collective work as "we."

---

## REPO STRUCTURE

```
A2E_Protocols/
├── PROTOCOLS/
│   ├── PRODUCTION/           ← LIVE protocols — READ THESE FIRST
│   │   ├── METATRON_v10.6_PRIME_DIRECTIVE.md   ← Base protocol (30 gates)
│   │   ├── METATRON_v10.7_AMENDMENT.md         ← CURRENT DELTA
│   │   └── ORACLE_STRUCTURED_FORMAT_v2.0.md    ← Market analysis standard
│   └── IRONCLAD/             ← Risk management rules
│       ├── IRONCLAD_PROTOCOL_v1.0.md           ← Base rules
│       └── IRONCLAD_v2.1_AMENDMENT.md          ← CURRENT
├── COLLECTIVE/               ← Agent instructions per platform
├── GABRIEL/                  ← Overnight Watch automation
├── AIORA/                    ← CIL, SENTINEL pipeline specs
├── HUNTER/                   ← Intelligence module specs (H1-H42)
├── PHOENIX/                  ← Session close documents (READ-ONLY)
├── ARCHIVE/                  ← Historical versions (IMMUTABLE)
├── AGENTS.md                 ← Codex instructions
├── CLAUDE.md                 ← This file (Claude Code instructions)
└── VERSION_CHANGELOG.md
```

**Related private repos:**
- `Barefootservants2/AIORA` — CIL JSON, n8n workflows, trade logs
- `Barefootservants2/A2E_Intelligence` — Intelligence archive
- `Barefootservants2/A2E_Career` — Job applications
- `Barefootservants2/test-harness` — TypeScript test harness

---

## VERSIONING — MANDATORY

- **NEVER modify** files in `ARCHIVE/` or `PHOENIX/` — these are immutable historical records.
- **ALWAYS create new versioned files** rather than editing existing protocol docs.
  - Example: `IRONCLAD_v2.2_AMENDMENT.md` not editing `v2.1`
- **Update `VERSION_CHANGELOG.md`** with every protocol change.
- **Latest version number wins.** Agents fetch the highest version.

---

## n8n CODE NODE STANDARDS

All JavaScript written for n8n Code nodes must follow these patterns:

- **Node naming:** `ALL_CAPS_WITH_UNDERSCORES` (e.g., `THRESHOLD_ENGINE`)
- **Variable naming:** camelCase (e.g., `marketData`, `yellowTriggers`)
- **Error handling:** ALWAYS wrap external HTTP calls in try/catch. Never throw. Return partial data with error field.
- **alwaysOutputData:** ALWAYS set to `false` on Code nodes and HTTP Request nodes. Setting to `true` causes zombie bugs — silent failures that pass empty data downstream.
- **GitHub API PUTs:** ALWAYS GET the file first to retrieve SHA before any PUT operation.
- **Telegram messages:** HTML parse mode only. Escape `< > &` in all dynamic content.
- **Supabase:** Project ID `bwtguoaakkmsnzomswem`. NEVER hardcode keys — use n8n credential names.
- **Data flow:** Use `$('NODE_NAME').first().json.field` not `$json.field` when referencing upstream nodes that are not the immediate predecessor.
- **News alerts:** Add to yellowTriggers AFTER multi-signal count check. News cannot inflate market signal counts toward escalation thresholds.
- **Kill Switch proxies:** Use 24hr futures (DX=F for dollar, ZB=F for bonds) not ETFs (UUP, TLT) for overnight monitoring.

---

## METATRON v10.7 — GATE SUMMARY

30 total gates: 9 Cascade + 21 METATRON.

**Cascade Gates (AIORA pipeline):**
- Gate 1: Source Quality (authority score)
- Gate 2: Data Freshness (staleness check)
- Gate 3: Consensus Score (3/5 agent minimum)
- Gate 4: Confidence Threshold (70% minimum)
- Gate 5: Catalyst Freshness (<7 days)
- Gate 5.5: Catalyst Staleness (>30 days = reject)
- Gate 6: Risk/Reward Ratio (minimum 2:1)
- Gate 7: Position Sizing (IRONCLAD compliance)
- Gate 7.5: Counter-Thesis (mandatory opposing view)

**METATRON Gates:**
- Gate 0.5: Premise Challenge (question the question)
- Gate 8: Regulatory Shock Check
- Gate 8.5: Regulatory Freshness
- Gate 9: Correlation (H37-DXY, H38-YIELD, H39-FLOW)
- Gate 9.5: Earnings Check
- Gates 10-30: HUNTER module validation chain

**Kill Switch:** No override. Auto 50% metals reduction + 48hr embargo when DXY+yields adverse simultaneously.

---

## IRONCLAD v2.1 — RISK RULES

- Risk per trade: 1.5% of capital maximum
- Position maximum: 20%
- Sector maximum: 35%
- Trim rules: -5% STOP, +10% sell 50%, +20% sell 60%
- Binary events: correlation-driven (H37/H38/H39)
- Same-day re-entry: **BANNED**
- Correlation Kill Switch: auto 50% metals reduction when DXY+yields adverse
- 48hr embargo after kill switch trigger
- Re-entry only on fresh data/facts

---

## FIVE-RING PORTFOLIO FRAMEWORK

| Ring | Asset Class | Allocation | Purpose |
|---|---|---|---|
| 1 | SGOV/dividend core | 40-50% | Capital preservation |
| 2 | PSLV+IBIT | 10-15% | Asymmetric thesis |
| 3 | Structural trends (PLTR-class) | 15-20% | Long-term growth |
| 4 | Tactical/event plays | 5-10% | 5% daily targets, EOD exit |
| 5 | Lottery | max 2% | 10x or zero |

---

## TESTING PATTERNS

**n8n Code node tests:**
1. Run with mock input (empty arrays, null values, missing fields)
2. Confirm output schema matches expected downstream node input
3. Verify error cases return `{ error: "message" }` JSON, not thrown exceptions
4. Check alwaysOutputData is `false` on all nodes

**Test harness:** `Barefootservants2/test-harness`
**Test command:** `npm test`

**CIL validation pattern:**
1. Send test query to CIL webhook
2. Verify all 5 agents respond (URIEL, COLOSSUS, HANIEL, RAZIEL, SARIEL)
3. Verify HEALTH GATE passes (3/5 quorum)
4. Verify PASS2 synthesis produces structured output
5. Verify Telegram delivery and GitHub archive write

---

## DEPLOYMENT

- **n8n workflows:** Import JSON via n8n UI — git clone blocked by proxy
- **Credentials:** Set in n8n credential manager, NEVER in workflow JSON
- **Activation:** Manual only after Principal review
- **GitHub push:** GET file for SHA first, then PUT with new content + SHA
- **GitHub token:** Use environment variable, never hardcode

---

## WHAT YOU MUST NOT DO

- Do NOT execute trades or market orders
- Do NOT modify PHOENIX session close documents
- Do NOT change IRONCLAD risk parameters without explicit Principal instruction
- Do NOT delete any ARCHIVE files
- Do NOT hardcode API keys or credentials
- Do NOT use `Math.abs()` for directional checks on DXY/dollar — rising and falling are different signals
- Do NOT rewrite full protocol docs — write amendments referencing base version

---

## PHOENIX SESSION PROTOCOL

When Principal says "CLOSE SESSION":
1. Summarize all work completed with evidence
2. List all pending items with status
3. Identify carry-forward items for next session
4. Write session close document

When context is running long:
- Warn: "PHOENIX CHECKPOINT — context running long. Recommend close + carry-forward."
- Do NOT wait until locked out.

"KILLSWITCH" = halt everything immediately. No questions.

---

*CLAUDE.md v1.0 | March 29, 2026*
*Ashes2Echoes LLC | Uriel Covenant AI Collective*
*METATRON v10.7 | IRONCLAD v2.1 | CIL v6.1*
