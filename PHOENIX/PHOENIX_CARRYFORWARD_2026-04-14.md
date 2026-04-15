# PHOENIX CARRY-FORWARD — April 14, 2026
## SESSION: Platform Pivot to Python + Book Scaffold + Market Operations

---

## DIRECTION CHANGE: FULL PYTHON MIGRATION (Path C → Full Python)

### Decision Made This Session:
n8n is retired as the production platform. ALL workflows migrate to Python. n8n retained ONLY as a prototyping whiteboard for new ideas. The 18 months of logic, rules, and battle-tested protocols transfer. The nodes do not.

### Why:
- TradingAgents (open source competitor) does what CIL does in 2,000 lines of Python
- Public.com has native brokerage execution via agentic AI
- Jenova has multi-model aggregation with polished UI
- A2E has better ideas (scoring, counter-thesis, IRONCLAD) and worse execution
- n8n's single-node-failure architecture is structurally fragile
- Python enables: backtesting, automated testing, options pricing, real-time WebSocket, E*TRADE execution via pyetrade, multi-user FORGE web app, ML training on scored outputs
- Claude Code writes Python. Billy now has a developer on staff.

### Platform Readiness Assessment (Honest):
- Overall: ~45-50% production ready
- No end-to-end automated pipeline has EVER completed without human intervention
- ANVIL/ASSAY/AUTOPSY exist on paper only, not in code
- Zero backtesting capability
- Zero trade execution capability
- No proof the system produces better outcomes than a single ChatGPT conversation

---

## EXTRACTION COMPLETED THIS SESSION

### On GitHub at A2E_Protocols/PYTHON_MIGRATION/:

| File | Contents |
|------|----------|
| A2E_PYTHON_MIGRATION_SPEC.json | Full platform inventory: 292 nodes, 91 code nodes, 177K chars JS, 77 API endpoints |
| HUNTER_CODE_NODES.json | 21 Code nodes extracted, 26,567 chars JS |
| SENTINEL_CODE_NODES.json | 36 Code nodes, 105,220 chars JS (push failed — too large, retry next session) |

### GABRIEL v2.0 — Complete source code retrieved inline:
- 15 nodes, 6 Code nodes
- Overnight Market Data (17 symbols, Yahoo Finance)
- News Scanner (Finnhub, 17 keywords, 6 critical)
- Threshold Engine v2.1 (GREEN/YELLOW/RED, Kill Switch using DX=F + ZB=F)
- Report Builder (HTML Telegram)
- Gabriel Logger (Supabase)
- Morning Brief (12h Supabase query, fresh pre-market, posture calc)

### Still needs extraction next session:
- CIL v6.1 (workflow ID: V61BMUNNQDBpCOsp)
- SIGNAL ENGINE v1.1 (workflow ID: R9GPabeNm26GgxKa)
- FORGE ANVIL v3.0 (workflow ID: 3dfHb1fAg5ZkNmwV)
- SENTINEL code nodes (retry push — file too large for single GitHub API call)

---

## PYTHON TARGET ARCHITECTURE

```
a2e-platform/
├── agents/           # 5 LLM agents (uriel, colossus, haniel, raziel, sariel)
├── cil/              # Consensus engine (9-gate cascade)
├── hunter/           # Market scanner + thesis chain
├── sentinel/         # Portfolio monitor + IRONCLAD enforcement
├── scoring/          # ANVIL, ASSAY, AUTOPSY (NEW — never existed in code)
├── gabriel/          # Overnight watch
├── reporting/        # Telegram, Sheets, PDF
├── backtest/         # Historical simulation (NEW)
├── api/              # FastAPI web backend for FORGE
├── config/           # .env, ironclad.yml
├── tests/            # pytest for every module
└── main.py           # Entry point
```

### Build Order (dependency-driven):
1. CIL (brain — everything depends on it)
2. HUNTER (scanner — calls CIL)
3. SENTINEL (enforcer — validates HUNTER/CIL output)
4. ANVIL/ASSAY/AUTOPSY scoring modules (NEW)
5. GABRIEL (overnight — standalone)
6. Backtesting engine (NEW)
7. FastAPI web layer (FORGE frontend)

### Build Method:
- Chat orchestrates requirements and reviews
- Claude Code writes Python, runs tests, commits to GitHub
- Claude Cowork assists with file management, non-code tasks
- Each module: extract JS logic → translate to Python → add error handling → write tests → commit

---

## BOOK SCAFFOLD — ON GITHUB

### Pushed to A2E_Protocols/FORGE_FIELD_MANUALS/:

| File | Status |
|------|--------|
| README.md | Complete |
| Makefile | Complete (Pandoc + Eisvogel build) |
| shared/metadata.yml | Complete (series branding) |
| shared/00-about-us.md | Complete (A2E story — the voice) |
| vol-01/01-introduction.md | Complete (domain context + 9 source citations) |
| vol-01/02-foundation-prompts.md | 3 of 10 prompts fully developed, 7 placeholders |
| vol-01/03-advanced-chains.md | 3 of 7 chains outlined, all placeholders |
| vol-01/04-anvil-scoring.md | Complete rubric, worked examples placeholder |
| vol-01/05-assay-evaluation.md | Complete framework, examples placeholder |
| vol-01/06-autopsy-red-flags.md | 4 of 12 red flags fully developed, 8 placeholders |
| vol-01/07-real-examples.md | 5 examples outlined, all need production data |
| vol-01/08-appendix.md | Complete (quick ref card, citations, source table) |

### Template: Eisvogel + Pandoc
- Write Markdown → `make vol1-pdf` → Professional PDF
- All 10 volumes follow identical structure
- Build system: Wandmalfarbe/pandoc-latex-template (MIT license)

---

## COMPETITIVE LANDSCAPE (assessed this session)

| Competitor | Threat Level | What they have that we don't |
|---|---|---|
| TradingAgents (Tauric) | HIGH | Open source, backtesting, Python-native, multi-model debate |
| Public.com Agents | HIGH | Native brokerage execution, $310M+ funding |
| Jenova | MEDIUM | Polished multi-model UI, enterprise pricing, production |
| Magai (Dustin Stout) | LOW | Multi-model chat aggregator, no analysis/scoring |
| Darius Lukas Black Book | LOW | Static prompt library, no methodology |

### What we have that NONE of them have:
- ANVIL/ASSAY/AUTOPSY output scoring (genuinely novel)
- Counter-thesis as structural requirement (Gate 7.5)
- IRONCLAD codified risk protocol
- Overnight watch with kill switch correlation detection
- Multi-domain design (10 domains, not finance-only)

### Net: Better ideas, worse execution. Gap is completion, not architecture.

---

## MARKET OPERATIONS — April 14, 2026

### Executed today:
- FCX trimmed per IRONCLAD (was +26.6%, overdue 5 trim levels)
- WPM added (new thesis position)
- VOO pumped in both accounts
- PPI came in +0.5% MoM (feared +1.2%) → relief rally
- Crude dropped 7% on Iran de-escalation signals → metals caught bid
- Silver bounced to $77.89, gold $4,767

### Current portfolio state:
- 6685 IRA: $85K cash, $3,535 unrealized gains, $1,600 day's gain
- 4898 Taxable: $8,700 cash, $685 unrealized
- 5267 Brokerage: $587 cash (+$15K transfer pending), $231 unrealized
- All positions green, 2nd day in a row

### Deployment approved (not yet executed):
- 6685: $17K thesis (PSLV/AG/WPM/NUE), $20K core (VOO/SGOV), $43K reserve
- Per IRONCLAD 2x50% tranche discipline

### Stops: NO mechanical stops. Price ALERTS at -5% from cost, human decision.

---

## NEXT SESSION INSTRUCTIONS

### OPTION A: Python Build Sprint
1. Attach this carry-forward
2. Say: "Build CIL in Python"
3. Open Claude Code in parallel
4. Chat defines the spec → Claude Code writes consensus.py, confidence.py, synthesis.py
5. Chat reviews → Claude Code writes tests → Claude Code commits

### OPTION B: Continue Extraction
1. Pull CIL v6.1, SIGNAL ENGINE, FORGE ANVIL workflow details
2. Extract remaining Code nodes
3. Push SENTINEL code (retry — split into chunks)
4. Complete the migration spec

### OPTION C: Market Operations
1. Execute the $17K thesis deployment in 6685
2. Check $15K transfer status in 5267
3. Morning data review

### RECOMMENDED: Option A. CIL is the brain. Build it first. Everything else depends on it. Extraction for remaining workflows can happen in parallel via Cowork.

---

## MEMORY UPDATES NEEDED

- Platform direction: Python migration, n8n retired to prototyping only
- Book status: FORGE Field Manual Vol 1 scaffold on GitHub, Pandoc+Eisvogel build chain
- Competitive: TradingAgents is closest architectural competitor (open source, Python)
- SENTINEL code: 36 nodes, 105K chars extracted but not yet pushed to GitHub

---

## WORKFLOW IDS (for extraction)

| Workflow | ID | Status |
|---|---|---|
| HUNTER v3.3 | orZPNtvvCB8RAlwF | Extracted |
| SENTINEL | CsTbRtchtCzxjKLX | Extracted (push pending) |
| CIL v6.1 | V61BMUNNQDBpCOsp | Needs extraction |
| GABRIEL v2.0 | fwKiBHtedNQ1n34H | Complete source captured |
| SIGNAL ENGINE v1.1 | R9GPabeNm26GgxKa | Needs extraction |
| FORGE ANVIL v3.0 | 3dfHb1fAg5ZkNmwV | Needs extraction |
| HUNTER MICRO v1.0 | rsS4DFbOgTRQvqTX | Needs extraction |
| TOKEN KEEPER v1.0 | KhTkAxrCW1kZvgdV | Needs extraction |
| TOKEN EXCHANGE v1.0 | kcngMMPBm5h0ZfTZ | Needs extraction |

---

*PHOENIX CLOSE — April 14, 2026, ~11:30 PM ET*
*Principal: William Earl Lemon*
*CIO: MICHA v10.7*
*Status: DIRECTION CHANGE COMMITTED — Python migration greenlit*
