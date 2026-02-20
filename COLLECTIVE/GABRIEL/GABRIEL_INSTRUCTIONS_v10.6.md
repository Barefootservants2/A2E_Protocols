# 🔱 GABRIEL v10.6 — CHIEF AUTOMATION INSTRUCTIONS
## Uriel Covenant AI Collective | Workflow Execution & Infrastructure
## Platform: n8n Cloud
## Effective: February 20, 2026
## Supersedes: GABRIEL_INSTRUCTIONS_v10.3.md

---

## IDENTITY

**GABRIEL** is the Chief Automation Officer of the Uriel Covenant AI Collective. GABRIEL is not an AI model — GABRIEL is the n8n workflow automation platform that executes scheduled tasks, manages API integrations, and runs the HUNTER module pipeline.

**Principal:** William Earl Lemon — Authority: ABSOLUTE
**Entity:** Ashes2Echoes LLC — AI Research Institution, Newport News, Virginia

## 🔒 GATE 0.75: EXECUTION FIDELITY LOCK (v10.6)

All workflow outputs and data transformations must adhere to:

1. **VERBATIM GATE** — Pass raw data through unchanged
2. **SINGLE PASS RULE** — Process once, no redundant operations
3. **SEARCH BEFORE CLAIM** — Verify API responses before reporting failure
4. **PERMISSION GATE** — No data transformations beyond spec
5. **INSTRUCTION PRIORITY** — Execute workflow as designed
6. **EVIDENCE + NULL** — Failed API = [NULL — error code]. Never fabricate responses.
7. **ATTESTATION BLOCK** — Log execution status for every node.

**Override:** NONE. Structural integrity requirement.

## ⚡ CONFIDENCE CASCADE ROLE (v10.6)

GABRIEL executes the Cascade code in the n8n pipeline:

| Gate | GABRIEL's Job | Code Location |
|------|--------------|---------------|
| Gate 1: DATA VALIDITY | **ENFORCE** | FIDELITY_LOCK — zombie bug fix must be applied first. `alwaysOutputData: false` on all agent nodes. |
| Gate 2: SIGNAL CONVERGENCE | **EXECUTE** | `PIPELINE/CASCADE/GATE_2_SIGNAL_VALIDATION.js` — Wire after consolidation merge node |
| Gate 5: AGENT CONSENSUS | **EXECUTE** | `PIPELINE/CASCADE/GATE_5_CONSENSUS_SCORING.js` — Wire after collective agent responses merge |
| Gate 6: COUNTER-THESIS | **EXECUTE** | `PIPELINE/CASCADE/GATE_6_COUNTER_THESIS.js` — Wire after Gate 5 |
| Gate 7: CROSS-SECTOR | **EXECUTE** | Existing `H35_CORRELATOR.js` — Wire data flow into Gate 7 check |
| Gate 8: TRAJECTORY | **EXECUTE** | `PIPELINE/CASCADE/GATE_8_TRAJECTORY_ALIGNMENT.js` — Final gate before delivery |

**P0 BLOCKER — ZOMBIE BUG FIX:**
Before ANY Cascade gate can function, the 10 agent nodes must be fixed per `ZOMBIE_BUG_FIX_v2.1.0.md`:
- Set `alwaysOutputData: false` on: URIEL, COLOSSUS, HANIEL, RAZIEL, SARIEL 1-4, MICHA Pass 1, MICHA Pass 2
- Set `continueErrorOutput: false` on same nodes
- Without this fix, Gate 1 passes garbage data through the entire pipeline

**Cascade Wiring Sequence (after zombie fix):**
1. Wire Gate 2 after MASTER MERGE / DATA AGGREGATOR
2. Wire Gate 5 after Collective Agent Merge
3. Wire Gate 6 after Gate 5
4. Wire Gate 8 as final gate before Telegram/GitHub delivery
5. Gates 3, 4, 7 are manual/future — no n8n code yet

## CORE FUNCTION: WORKFLOW EXECUTION

### Primary Workflows

| Workflow | Function | Trigger | Status |
|----------|----------|---------|--------|
| HUNTER-DAILY | Full H1-H29 scan + collective synthesis | 6:00 AM ET daily | 🔧 Zombie fix pending |
| HUNTER-INFLUENCE | H30-H35 Influence Chain | After HUNTER-DAILY | ✅ Code complete |
| HUNTER-CASCADE | Gates 2→5→6→8 qualification | After HUNTER-DAILY | 📋 Wiring pending (after zombie fix) |
| HUNTER-OVERNIGHT | HG1-HG8 Global Markets | 4:00 AM ET daily | 📋 Spec'd, not built |
| RESEARCH_MONITOR | arXiv/blog scraper | Sunday 6:00 AM ET | 📋 Planned |
| EMAIL_INTEL | 750+ email processing | Continuous | ✅ Operational |
| TRADE_LOG | Log outcomes to trade_log.json | After each trade | 📋 Template ready, wiring pending |

### Delivery Nodes

| Node | Function | Status |
|------|----------|--------|
| Telegram Daily Brief | Send 6:30 AM summary | ✅ Ready |
| Telegram ALERT | Real-time material events | ✅ Ready |
| GitHub Daily Log | Push to AIORA/logs/ | ✅ Ready |
| Cascade Report | Qualified trades only — with gate scores | 📋 Pending |

## API CREDENTIALS MANAGED

| Credential | Service | Status |
|-----------|---------|--------|
| Finnhub API | H4, H5, H6, H7-H9, H13, H15-H17, H28, H30 | ✅ Wired |
| TwelveData API | H7, H8, H10, H11, H14, H15, H16, H18-H20 | ✅ Wired |
| Alpha Vantage API | H2a, H3, H12, H19, H20 | ✅ Wired |
| NewsAPI | H2b, H26 | ✅ Wired |
| SEC EDGAR | H1, H5, H6, H17, H23 | ✅ Wired |
| Congress.gov | H21 | ✅ Wired |
| OpenAI API | URIEL agent | ✅ Wired |
| Anthropic API | MICHA Pass 1 + Pass 2 | ✅ Wired |
| xAI API | COLOSSUS agent | ✅ Wired |
| Google AI API | HANIEL agent | 🔧 Auth fix pending |
| DeepSeek API | RAZIEL agent | 🔧 Key needed |
| Perplexity API | SARIEL 1-4 agents | ✅ Wired |
| Telegram Bot | Delivery | ✅ Wired |
| GitHub Token | Push/archive | ✅ Wired |
| FRED API | H27 | 🔧 Key needed |
| metals.dev | H29 | 🔧 Key needed |
| Senate LDA | H32 | ✅ No key needed |
| USASpending | H33 | ✅ No key needed |
| FEC | H34 | ✅ Key wired |

## MONITORING RESPONSIBILITIES

- System health checks on all active workflows
- Execution logging for audit trail
- Error handling and retry logic
- Rate limit management across APIs
- Credential rotation alerts
- **NEW v10.6:** Cascade gate execution logging — every gate pass/fail recorded

## CRITICAL RULES

1. **Never execute trades** — GABRIEL gathers and delivers intelligence only
2. **Rate limit compliance** — Respect every API's limits
3. **Error handling** — `alwaysOutputData: false` on agent nodes. Failed nodes = pipeline halts, not garbage passthrough
4. **Data integrity** — Pass raw data through; never modify or interpret
5. **VERBATIM data passing**
6. **No unauthorized transformations**
7. **CASCADE GATE EXECUTION** — Run gates in order. No skipping. Log every result. ⚡ v10.6

---

🔱 **GABRIEL v10.6 — OPERATIONAL**
