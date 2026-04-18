# PHOENIX CLOSE — 2026-04-18

**Session ID:** 2026-04-18-issues-db-genesis
**Principal:** William Earl Lemon
**MICHA:** Claude Opus 4.7 (platform reports v10.7 still in userPreferences — P0 #1)
**METATRON:** LATEST (resolves to v10.8)
**Context usage:** approaching ceiling, close initiated cleanly
**Duration:** ~6 hours

---

## ACTIONS COMPLETED

### Audit + strategic assessment
- ✅ Audited userPreferences — 4 URLs verified live, 3 stale (MICHA v10.7, METATRON v10.8 pin, IRONCLAD v2.1), 1 current (PHOENIX v10.2)
- ✅ Drafted corrected userPreferences block (LATEST pointers, PHOENIX RESUME keyword added, Rule 12 on LATEST authority added)
- ✅ Researched Claude Opus 4.7 release (April 16 2026 — two days ago): 87.6% SWE-bench, 94.2% GPQA, 3.75MP vision, new task_budgets beta, /ultrareview command, advisor tool public beta, breaking changes on temperature/top_p/extended_thinking
- ✅ Researched AI model landscape April 2026: GPT-5.4, Gemini 3.1 Pro, Grok 4.20 Beta 2 (four-agent architecture), DeepSeek V3.2/V4, Llama 4 Scout (10M context)
- ✅ Delivered 90th-percentile assessment: solo-builder 97th+, small-team engineering ~75th
- ✅ SARIEL (Perplexity) confirmed defined-but-unused across all workflows
- ✅ Missing data sources inventory: SEC Form 4, STOCK Act, OCC, FINRA short interest, SAM.gov, CourtListener, USPTO, etc.

### Issues DB v1.0 build (GATHER → CREATE → TEST → DELIVER)
- ✅ 22 labels created on A2E_Protocols (5 severity + 12 component + 5 type)
- ✅ 3 milestones created (TST-BASELINE-2026-04-18, SP1-2026-Q2, SP2-2026-Q3); #1 description corrected post-hoc to reflect "issues that close to promote DEV → TST"
- ✅ 15 seed issues filed (1 P0, 2 P1, 6 P2, 6 P3); #16 added later (Google consolidation)
- ✅ Python module pushed to a2e-platform/issues/ (8 files: __init__, fetcher, exporter, reporter, cli, plus tests + data)
- ✅ 21 tests: 19 unit (fixtures, offline) + 2 live integration (real GitHub API) — ALL GREEN
- ✅ CSV snapshot + markdown revision log committed to issues/data/
- ✅ Tag `issues-db-v1.0` @ `03ca8544e6` cut on a2e-platform

### Tag correction (acknowledged error)
- ✅ Initial `TST-BASELINE-2026-04-18` tag WAS MISNAMED — we are still in DEV
- ✅ Corrected: deleted `TST-BASELINE-2026-04-18`, created `DEV-BASELINE-2026-04-18` @ `78f2bef4d2` on A2E_Protocols
- ✅ Milestone #1 description updated to "issues that must close to promote DEV → TST"

### Issue #7 (rotator) refinements
- ✅ Updated #7 body with three-tier architecture: AUTO (API-native) / EDGE-WINDOW (Claude in Chrome drives dashboard) / PROMPTED (Telegram deep-link bundle)
- ✅ Patched #7 with main-Chrome-profile decision (not dedicated), Sunday 07:00 ET window, busy-tab detection (15-min defer, max 3 retries, then skip cycle)
- ✅ 9-key inventory mapped to tiers: 3 AUTO (GitHub, Supabase, E*TRADE), 3 EDGE-WINDOW (Telegram, Perplexity, UW), 3 PROMPTED (FRED, EIA, Nasdaq)

### Strategic decisions ratified
- ✅ Google stack consolidation approved (OneNote retained as governed exception)
- ✅ AI model defaults unchanged (Claude primary, not switching to Gemini/etc.)
- ✅ Operating mode locked: "pick one and finish it" — no parallel chasing
- ✅ 18-item ranked work plan delivered (ascending by effort)

---

## ACTIONS PENDING

- ❌ **P0 #1 — Principal pastes rewritten userPreferences into claude.ai Settings → Profile.** Only Principal can do this (lives in Anthropic user settings). Block text delivered in session.
- ❌ **DEV → TST promotion gate decision** — Principal to confirm Strict (all 16 close) vs Tiered (6 hard gates: #1, #2, #3, #6, #7, #15 close → cut TST → rest as SP1 tickets). MICHA recommended Tiered.
- ❌ **Next session item selection** — Principal to pick one from 18-item list.

---

## DECISIONS MADE

- **Three-tier rotator architecture** replaces binary AUTO/MANUAL model
- **Main Chrome profile** used for EDGE-WINDOW tier (Claude in Chrome already aligned)
- **Sunday 07:00 ET** proposed rotation window (quiet time, low collision risk)
- **Busy-tab detection** mandatory before every EDGE-WINDOW rotation
- **Canary-before-revoke** invariant on every rotation path
- **Keys never in logs** invariant (audit records `{timestamp, key_name, tier, outcome}` only)
- **Google consolidation** approved, OneNote excepted (ADM-3 multi-account intake has no Google equivalent)
- **GDrive backup** will be one-way, service-account auth, secrets excluded, private→private folder visibility
- **FORGE ship/freeze decision** deferred to post-Phase 4 with artifacts in hand
- **Advanced Protection Program** enrollment added as Google consolidation sub-task
- **TST naming correction** — we don't name things "TST" until we've earned it. `DEV-BASELINE` is the honest label for catalogued-DEV-state.

---

## DOCUMENTS PRODUCED

- `a2e-platform/issues/__init__.py`
- `a2e-platform/issues/fetcher.py` — GitHub Issues API client, Issue dataclass, label-taxonomy parsers, pagination
- `a2e-platform/issues/exporter.py` — deterministic CSV exporter
- `a2e-platform/issues/reporter.py` — markdown revision log with summary table + milestone grouping + severity ordering
- `a2e-platform/issues/cli.py` — `snapshot` / `report` / `sync` / `stats` commands
- `a2e-platform/issues/data/snapshot.csv` — current issue state
- `a2e-platform/issues/data/REVISION_LOG.md` — human-readable log
- `a2e-platform/tests/test_issues.py` — 21-test suite (19 unit + 2 live)
- Rewritten userPreferences block (delivered in chat, not yet pasted)
- 18-item ranked work plan (preserved below)

---

## GITHUB STATUS

### Commits pushed (a2e-platform)
- 8 files delivered via Contents API (git clone proxy-blocked)
- Head @ `03ca8544e6`

### Tags
- 🏷️ `issues-db-v1.0` @ `03ca8544e6` on Barefootservants2/a2e-platform
- 🏷️ `DEV-BASELINE-2026-04-18` @ `78f2bef4d2` on Barefootservants2/A2E_Protocols
- 🗑️ `TST-BASELINE-2026-04-18` DELETED (was misnamed, corrected)

### Issues filed (16 total, all open)
| # | Sev | Component | Milestone | Title |
|---|---|---|---|---|
| 1 | P0 | MICHA | TST-BASELINE | userPreferences still references MICHA v10.7 |
| 2 | P1 | HUNTER | TST-BASELINE | data_fetcher.pct_change returns 1-year-ago close |
| 3 | P1 | MICHA | TST-BASELINE | Instruction file lists Sonnet 4.6, actual is Opus 4.7 |
| 4 | P2 | IRONCLAD | TST-BASELINE | No LATEST pointer |
| 5 | P2 | SARIEL | SP1 | Not wired into any workflow |
| 6 | P2 | infrastructure | SP1 | 300-test suite not gated on push |
| 7 | P2 | infrastructure | SP1 | API key rotation not automated (three-tier scoped) |
| 8 | P3 | METATRON | SP1 | v10.8 body references IRONCLAD v2.1 + PHOENIX v10.2 inline |
| 9 | P3 | PHOENIX | SP1 | Protocol has no LATEST pointer |
| 10 | P3 | SENTINEL | TST-BASELINE | Seven Telegram nodes returning 401 |
| 11 | P3 | infrastructure | SP1 | Opus 4.7 migration: audit temperature/top_p usage |
| 12 | P2 | infrastructure | SP2 | No alerting when workflows fail |
| 13 | P3 | docs | SP2 | No single documentation index |
| 14 | P3 | docs | SP2 | No public-facing proof |
| 15 | P2 | infrastructure | TST-BASELINE | No DEV/TST/PRD environment separation |
| 16 | P3 | infrastructure | TST-BASELINE | Google web-services consolidation (OneNote excepted) |

---

## ANOMALIES ON WATCH

1. **userPreferences drift** (#1, P0) — Principal-only fix, block delivered
2. **Initial TST-BASELINE tag mislabel** — corrected same session, but flagged as a drift example for future review (industry-default bias overrode Principal's stated model)
3. **SARIEL underutilization** (#5) — agent defined in every bootstrap, API key present, zero execution traces in any workflow
4. **18-session scope delivered** — Principal confirmed full commitment, not trying to do multiple in one session. Cadence + sequence TBD.
5. **Curriculum thread: Emmanuel Malyarovich / SMA 20/200** — noted but NOT filed as issue. Principal flagged this as a continuous-filter overlay on discrete HH/HL market-structure theory. Reserve for Sunday Module 2 (patterns) or Module 4 (indicators).
6. **Memory slot usage** — no slots modified this session; all 30 existing memory edits intact.

---

## 18-ITEM RANKED WORK PLAN (CARRY FORWARD VERBATIM)

Ranked ascending by sessions-left-to-complete. "Pick one and finish it" operating mode.

| # | Item | Sessions left | What's actually left |
|---:|---|:---:|---|
| 1 | Fast fixes sweep (issues #1, #2, #3, #4, #8, #9, #11) | **0.5–1** | userPreferences paste, 10-line pct_change fix, MICHA instruction bump to Opus 4.7, create IRONCLAD_LATEST, create PHOENIX_PROTOCOL_LATEST, strip inline version refs from METATRON v10.8, grep temperature/top_p in Claude calls |
| 2 | Docs index (#13) | **1** | Write A2E_Protocols/INDEX.md: one-line description + link + status for every protocol, instruction, spec doc |
| 3 | SARIEL wiring (#5) | **1** | Build ONE Perplexity-backed feed. Recommend SEC Form 4 insider transactions. Citations → HUNTER enrichment |
| 4 | CI/CD gate (#6) | **1** | GitHub Actions workflow, branch protection, ruff/mypy baselines, Telegram failure alert, verify 300 tests pass in clean CI env |
| 5 | Environment separation (#15) | **1** | Branch protection on main, promotion path documented, tag discipline, rollback test on canary commit |
| 6 | Alerting (#12) | **1** | Failure detection on n8n + Python workflows, Telegram pages, dedup logic |
| 7 | Public-facing proof (#14) | **1–2** | One write-up: architecture diagram + MARKET WATCH walkthrough. Post to Ashes2Echoes or Substack |
| 8 | Google consolidation (#16) | **1–2** | OneDrive audit + migrate, GitHub → GDrive nightly backup, Advanced Protection, quarterly app-review via rotator |
| 9 | FORGE landing + ship/freeze decision | **1–2** | Landing copy pass, ANVIL/ASSAY/AUTOPSY formalized, waitlist plumbing, Chapter 1 publish decision |
| 10 | UAT scripts build | **2** | Pass/fail walkthroughs for 7 workflows: MARKET WATCH, CLOSE/RESUME, SENTINEL report, GABRIEL cycle, CIL query, E*TRADE sync, HUNTER scan |
| 11 | API key rotator (#7) | **2** | Three-tier build: manifest, canary, audit, GitHub (AUTO), Supabase (AUTO), edge-window via Claude in Chrome (Perplexity, UW, Telegram), prompted tier, cron, tests |
| 12 | HUNTER final polish | **2** | Enrichment hardening, H4/H17/H22 mandatory filing check wired, per-scan test coverage, decommission n8n HUNTER |
| 13 | CIL v6.1 lockdown | **2–3** | Universal abstraction (DOMAIN ROUTER/PROMPT BUILDER/GATE CONFIG/OUTPUT TEMPLATE) integration-tested. RAZIEL post-synthesis fix (PRIME tier blocker). Cascade timing measured |
| 14 | E*TRADE integration completion | **2–3** | Port TOKEN KEEPER + TOKEN EXCHANGE to Python, OAuth integration tests, 3-account sync validated, token-refresh runbook |
| 15 | SENTINEL Python finalization | **3** | Remaining 36-code-node port, Compliance Engine resolution, GitHub Archive SHA 422 fix, PSLV dedup, #10 401s verified, decommission n8n |
| 16 | GABRIEL Python port | **3** | Full source port, kill switch DX=F/ZB=F, 21-cycle baseline re-verified, decommission n8n |
| 17 | UAT execution + TST cut | **1 (variable)** | Run every UAT script, file issues on failure, tag TST-BASELINE once all green |
| 18 | FORGE book chapters 2–10 | **5–8** | 9 chapters, CREATE/CAKE rubric per domain with cited research, MagAI demo integration |

**Dependency notes:**
- #4 (CI/CD) + #5 (env separation) pair naturally — same session
- #11 (rotator) cleanest after #4 ships
- #10 (UAT scripts) must exist before #17 (TST cut)
- Everything else parallel-safe after #4

**MICHA recommendations:**
- **Visible win in one session:** #1 (fast fixes, 7 issues closed)
- **Highest single-session leverage:** #4 + #5 paired (every future commit gets test-gated discipline)
- **Hardest-out-of-the-way-first:** #16 (GABRIEL port unblocks SENTINEL dependency chain)

---

## NEXT SESSION PRIORITY

1. **P0: Principal pastes userPreferences** (30 seconds, closes #1)
2. **Pick one item** from the 18-item list. Fire `PHOENIX RESUME`, state the pick, MICHA executes that and ONLY that.
3. **Promotion gate decision (Strict vs Tiered)** can wait until first chosen item ships — decision gets clearer with fewer open issues.

---

## RESTART PROMPT

```
MICHA — PHOENIX RESUME.

Baseline after 2026-04-18 session:
  - Issues DB v1.0 live (16 open issues, 3 milestones, 22 labels)
  - DEV-BASELINE-2026-04-18 tag @ 78f2bef4d2 on A2E_Protocols
  - issues-db-v1.0 tag @ 03ca8544e6 on a2e-platform
  - 18-item ranked work plan committed to carry-forward
  - Operating mode: pick one and finish it
  - MICHA is on Opus 4.7 (platform updated April 16 2026)

Pending Principal action:
  - userPreferences paste (P0 #1)
  - Next-item selection from 18-item list
  - Promotion gate decision (Strict vs Tiered) — can defer

First action: Fetch PHOENIX_CARRYFORWARD_LATEST.md, summarize 18-item list,
ask Principal which item to work on this session. DO NOT execute without go-ahead.
```

---

🔱 **PHOENIX CLOSED.**
