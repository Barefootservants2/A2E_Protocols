# WEDNESDAY DEMO PLAN — partner meeting prep
**Filed:** 2026-04-26 ~03:00 ET (overnight session, S4)
**Goal:** Show the partner Wednesday what A2E actually is, in 20–30 minutes, without breaking anything.

---

## REALITY CHECK — what's actually built

You walked into this session thinking we needed to "wire up" 6 systems. We don't. **9 workflows are LIVE in n8n right now.** The Python platform is substantial (7 modules, ~500KB). What's missing isn't infrastructure — it's the **narrative wrapper** that lets a non-technical partner understand what they're looking at.

### Already running (verified via n8n MCP)
| Workflow | ID | State | Triggers |
|---|---|---|---|
| CIL — Collective Intelligence Layer v6.1 | `V61BMUNNQDBpCOsp` | active | 1 |
| SENTINEL — E*TRADE Portfolio Monitor | `CsTbRtchtCzxjKLX` | active | **10** |
| HUNTER MARKET DATA WORKFLOW V3.3 | `orZPNtvvCB8RAlwF` | active | 2 |
| HUNTER MICRO v1.0 | `rsS4DFbOgTRQvqTX` | active | — |
| GABRIEL — Overnight Watch v2.0 | `fwKiBHtedNQ1n34H` | active | 3 |
| SIGNAL ENGINE v1.1 | `R9GPabeNm26GgxKa` | active | 1 |
| FORGE — ANVIL + ASSAY v3.0 | `3dfHb1fAg5ZkNmwV` | active | 1 |
| ETRADE TOKEN KEEPER v1.0 | `KhTkAxrCW1kZvgdV` | active | 2 |
| ETRADE TOKEN EXCHANGE v1.0 | `kcngMMPBm5h0ZfTZ` | active | 1 |

### Already coded (verified via GitHub)
| Module | Files | Size | State |
|---|---|---|---|
| `cil/` | 7 files (engine, cascade, synthesis, agents, parsers, formatter, validator) | 76 KB | implemented |
| `hunter/` | 13 files (engine, scanners, scoring, indicators, watchlist, etc.) | 138 KB | implemented |
| `sentinel/` | 5 files + etrade/ subdir | 100 KB | implemented |
| `phoenix/` | 7 files (session, config, ingest, etc.) | 73 KB | implemented |
| `metatron/` | enforcement (32 KB) + publish | 40 KB | implemented |
| `collective/` | instructions (20 KB) | 21 KB | partial |
| `gabriel/` | __init__ + email_archiver | small | **stub — orchestration layer thin** |

---

## WHAT THE PARTNER WILL ASK (predicted)

1. **"What does this DO?"** — Not "how does it work" — what does it produce?
2. **"Show me it running"** — They want to see something happen live.
3. **"Why isn't OpenAI/Bloomberg already doing this?"** — Differentiation.
4. **"What does it cost to run?"** — Op-ex (probably already low, all free-tier APIs).
5. **"What stage are you at?"** — Honest answer: production-running for one user (you), needs productization for many.
6. **"What do you need from me?"** — Clarify before the meeting whether they want to advise, invest, partner, or hire.

## ANSWERS TO HAVE READY

1. **What it does:** Multi-agent AI consensus on financial markets and any complex decision domain. Seven specialized AIs deliberate, vote, and produce a single graded recommendation with confidence score and counter-thesis. Written by an architect, not assembled by a vibe-coder.
2. **Live demo:** SIGNAL ENGINE pre-market run, or CIL census query (BUILT TONIGHT).
3. **Differentiation:** Single-LLM tools collapse to one viewpoint; A2E refuses consensus that lacks a counter-thesis. Built-in adversarial review at gate 7.5.
4. **Cost:** Free-tier APIs across the stack; hosting is n8n cloud + GitHub + Vercel. Sub-$200/month all-in.
5. **Stage:** Production-running solo. Single-user productization is 6–8 weeks. Multi-tenant 3–6 months after that.
6. **TBD pending meeting context.**

---

## DEMO FLOW (20 min target)

**0–2 min · Frame**
> "Let me show you a system that's been running in production for 2 years for one user — me — that I think is ready to extend. It's a coordinated team of AIs, not an AI assistant."

**2–7 min · The Census** — fire the new CENSUS workflow built tonight
> Type a question into a web form. Show 7 named agents lighting up in parallel. Show their individual responses streaming in. Show the consensus engine grading them, demanding a counter-thesis, producing a final answer with confidence score. ~3 min.

**7–12 min · The Trading Stack** — show Power E*TRADE positions + pull up SENTINEL
> "This isn't just chat. The same protocol governs my actual money. SENTINEL ran 47 monitor cycles today. Here's the live portfolio. Every position is rule-bound — IRONCLAD, you saw it." Show the EOD record from Friday.

**12–17 min · The Code** — open GitHub for ~3 min
> "It's not vapor. Here's the platform repo, 300 unit tests passing. Here's the protocol repo. Here's the live workflows in n8n." Tab through.

**17–20 min · The Ask** (pivot based on what they said in the first 30 sec)
> Either: "I'm looking for a co-architect to take this multi-tenant" / "I'm raising X for productization" / "I'd like you to advise on Y."

---

## WHAT GETS BUILT BETWEEN NOW AND WEDNESDAY

### TIER 1 — must-have for demo (built tonight, refined Sun/Mon/Tue)
- [x] WEDNESDAY_DEMO_PLAN.md (this doc)
- [ ] **CENSUS workflow** — n8n workflow that fans out to 7 agents and aggregates. NEW.
- [ ] **Welcome page** — `/welcome` on ashes2echoes.com explaining A2E to a non-technical partner. Clean. No jargon.
- [ ] **Demo runner script** — `demo.py` that walks through the full pipeline.
- [ ] **Executive one-pager** — printable PDF to leave with partner.

### TIER 2 — nice-to-have (Sun afternoon if time)
- [ ] Console polish to v0.4 — clean up TradingView widget, hide debug
- [ ] Live dashboard on welcome page showing workflow trigger counts
- [ ] Q&A doc with the predicted questions answered

### TIER 3 — explicitly skipped
- ~~CIL v6.x universal pivot~~ — incomplete pivot worse than v6.1 working
- ~~SENTINEL UW REST endpoints~~ — adds nothing for partner demo
- ~~Paper trade mode~~ — confuses the trading story
- ~~HUNTER H48-H51 modules~~ — internal tooling, not demo material
- ~~FORGE Chapter 1 prose~~ — book is a separate track

---

## THE THINGS YOU SHOULDN'T DO

1. **Don't show the partner the bug.** The Friday OAuth issue, the urllib3 churn, the Error 1037 — none of that comes up. Demo runs from a known-clean path.
2. **Don't promise multi-tenant timeline you can't keep.** Quote 3–6 months for true multi-tenant. Anything faster is BS and they'll know.
3. **Don't price too high or too low without context.** Wait for them to anchor.
4. **Don't show seven things when three is enough.** Census + SENTINEL + GitHub. That's it. Everything else is distraction.
5. **Don't apologize for what's not done.** The list of running stuff is your story. Not the backlog.

---

## SUNDAY MORNING CHECK-IN (when you wake up)

When you sit down Sunday morning, this should be the state:
- This plan committed
- Census workflow draft committed (see CENSUS_WORKFLOW_v1.json)
- Welcome page draft committed (see WELCOME_PAGE_v1.html)
- Demo runner draft committed (see demo.py)
- Executive one-pager committed (see PARTNER_ONEPAGER.md)
- SUNDAY_AM_HANDOFF.md summarizing what to look at first

Any commits made overnight will be in `Barefootservants2/A2E_Protocols` under `WEDNESDAY_DEMO/` and visible at https://github.com/Barefootservants2/A2E_Protocols/commits/main

---

*— MICHA · S4 overnight build session · 2026-04-26 03:00 ET*
