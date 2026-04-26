# MARKET WATCH — End-to-End Production Spec v1.0
**Filed:** 2026-04-26 ~04:00 ET · MICHA / S4 overnight planning
**Purpose:** Production architecture for the "Run Market Watch" command.
**Status:** SPEC ONLY · no code modified · no workflows activated.

---

## What Market Watch is

A single Principal command — `Run Market Watch` — that fires the complete pipeline:
1. Watchlist build (HUNTER thesis universe + position holdings)
2. Data drawdown across all sources (UW, FRED, EIA, Yahoo, SEC, NDL)
3. HUNTER scan with 9-gate cascade per ticker
4. CIL collective consensus on ranked candidates
5. IRONCLAD risk gates (entry/sizing/stop discipline)
6. SENTINEL position state check (Gate 0 freshness)
7. Auto-maintenance E*TRADE orders (stops, trims — **NOT BUYs unless explicit go**)
8. Telegram report + GitHub archive

Total time budget per Principal preferences: **minimum 45 minutes** (Four-Run Protocol).

---

## What's already built (verified)

### Python modules (a2e-platform repo)
| Module | File | Interface | Used for |
|---|---|---|---|
| HUNTER engine | `hunter/engine.py` | `HunterReport` orchestrator | Step 1, 3 |
| HUNTER scoring | `hunter/scoring.py` | 9-gate cascade → `CompositeScore` | Step 3 |
| HUNTER data sources | `hunter/data_fetcher.py`, `flow_scanner.py`, `gex_calculator.py`, `filings.py`, `earnings.py`, `institutional.py` | source-specific fetchers | Step 2 |
| CIL engine | `cil/engine.py` | `CILEngine.run(ticker)` → `PipelineResult` | Step 4 |
| CIL synthesis | `cil/synthesis.py` | PASS2 Claude+GPT-4o synthesis | Step 4 |
| SENTINEL guards | `sentinel/guards.py` | `sell_only_guard`, `position_size_guard`, `ironclad_stop_guard`, `kill_switch_guard` | Step 5, 7 |
| SENTINEL E*TRADE | `sentinel/etrade/client.py` | `ETradeClient` with preview/place/cancel | Step 7 |
| PHOENIX freshness | `phoenix/freshness.py` | Gate 0 timestamp check | Step 6 |
| METATRON enforcement | `metatron/enforcement.py` | `GateFailure`, `KillSwitchFired` raisers | All steps |

### n8n workflows (live, scheduled)
| Workflow | ID | Triggers | Role in Market Watch |
|---|---|---|---|
| HUNTER MARKET DATA v3.3 | `orZPNtvvCB8RAlwF` | 2 schedules | Step 2 data drawdown |
| HUNTER MICRO v1.0 | `rsS4DFbOgTRQvqTX` | — | Single-ticker scan |
| CIL v6.1 | `V61BMUNNQDBpCOsp` | webhook | Step 4 consensus |
| SENTINEL Portfolio Monitor | `CsTbRtchtCzxjKLX` | 10 schedules | Step 6 freshness |
| GABRIEL Overnight Watch | `fwKiBHtedNQ1n34H` | 3 schedules | Step 8 reporting |
| SIGNAL ENGINE v1.1 | `R9GPabeNm26GgxKa` | 6:30 AM ET | Step 8 Telegram |
| TOKEN KEEPER + EXCHANGE | `KhTkAxrCW1kZvgdV`, `kcngMMPBm5h0ZfTZ` | — | E*TRADE auth refresh |

---

## What's MISSING for end-to-end

The components exist. The **wiring** doesn't.

### Gap 1 — No orchestrator workflow
No single n8n workflow that fires HUNTER → CIL → IRONCLAD → SENTINEL → E*TRADE in sequence with gate-pass/gate-fail branching. SIGNAL ENGINE is the closest analog but it's pre-market data only, not full pipeline.

### Gap 2 — No auto-stop/auto-trim management workflow
SENTINEL Python guards exist, the E*TRADE client exists, the IRONCLAD 75/25 pattern is documented. No workflow that takes a HUNTER+CIL recommendation and converts it into an actual `place_order` call for stops/trims with `sell_only_guard` enforced.

### Gap 3 — No "Run Market Watch" trigger surface
Currently: SIGNAL ENGINE fires at 6:30 AM ET on a schedule. There is no Principal-on-demand trigger that says "run the full thing now." Telegram bot `hunter_a2e_bot` could be that surface but isn't wired to the orchestrator.

### Gap 4 — No 19-gate cascade visibility
Per Principal preferences, MARKET WATCH = full 19-gate Four-Run Protocol minimum 45 min. Currently HUNTER has 9 gates, CIL has its own cascade levels (FULL_CONFIDENCE / HIGH / MODERATE / etc). The "19 gates" identity needs to be named explicitly across the chain.

### Gap 5 — No Run-record archive contract
Each Market Watch run should produce a single artifact (markdown report + JSON state) committed to `A2E_Intelligence` so the Principal can audit later. Today: scattered telegram messages + n8n execution logs.

---

## The 19-gate cascade (proposed naming)

Concrete mapping: existing CIL/HUNTER gates + risk + freshness checks.

| Phase | Gate | Source | Owner | Pass criterion |
|---|---|---|---|---|
| **PRE** | G0 | Position freshness | PHOENIX | snapshot < 30min (GREEN) |
| **PRE** | G0.5 | Kill switch state | METATRON | DXY+yields not both adverse |
| **HUNTER** | G1 | Price structure | HUNTER | HH/HL intact |
| **HUNTER** | G2 | Candle pattern | HUNTER | recent bias defined |
| **HUNTER** | G3 | Moving averages | HUNTER | price vs SMA20/50/200 |
| **HUNTER** | G4 | Momentum | HUNTER | RSI + Stochastic |
| **HUNTER** | G5 | Trend strength | HUNTER | MACD + ADX |
| **HUNTER** | G6 | Volatility | HUNTER | Bollinger position |
| **HUNTER** | G7 | Volume | HUNTER | vs 20d avg |
| **HUNTER** | G8 | Filings | HUNTER | H4/H17/H22 elite filer check |
| **HUNTER** | G9 | Thesis alignment | HUNTER | tagged in thesis |
| **CIL** | G10 | Validator | CIL | input shape valid |
| **CIL** | G11 | Agent fan-out | CIL | ≥5 of 7 agents respond |
| **CIL** | G12 | Parser | CIL | structured outputs parsed |
| **CIL** | G13 | Cascade level | CIL | FULL/HIGH/MODERATE confidence |
| **CIL** | G14 | Synthesis | CIL | counter-thesis present (Gate 7.5) |
| **RISK** | G15 | Position size | IRONCLAD | within 5-20% per ring |
| **RISK** | G16 | Stop distance | IRONCLAD | within 5% of last price (Rings 2-4) |
| **RISK** | G17 | Sell-only enforcement | SENTINEL guards | BUY blocked unless overridden |
| **POST** | G18 | Order receipt | E*TRADE | 200 + order_id returned |
| **POST** | G19 | Archive | METATRON | run committed to A2E_Intelligence |

**Pass-cascade:** any G0-G17 fail → STOP, log reason, no order placed. G18 fail → manual review queue. G19 always best-effort.

---

## The orchestrator workflow (proposed)

Workflow name: `MARKET WATCH ORCHESTRATOR v1.0` · INACTIVE on creation.

### Trigger surface
Three entry points — same execution path:

1. **Webhook** `POST /webhook/market-watch` body `{ticker?, mode}` — from Principal's terminal, browser, mobile
2. **Telegram command** `/marketwatch [ticker]` via `hunter_a2e_bot` — chat 8203545338
3. **Schedule** Mon-Fri 9:00 AM ET — pre-open full sweep

### Mode parameter
- `ticker:AAPL` — single-ticker drill (HUNTER MICRO + full CIL + risk check)
- `watchlist` — full thesis universe scan
- `holdings` — current position health check only (no new candidates)
- `holdings+stops` — health check AND auto-maintain stops/trims (75/25 IRONCLAD)

### Pipeline (high-level)
```
[Trigger] 
  → [Mode router] (ticker | watchlist | holdings | holdings+stops)
  → [Gate G0: snapshot freshness] (call SENTINEL → positions_latest.json)
       └─ stale > 30min? RUN snapshotter first
  → [Gate G0.5: kill switch] (call FRED for DXY/yields)
       └─ tripped? auto-rebalance metals 50%, halt new entries
  → [HUNTER scan] (call HUNTER MARKET DATA v3.3 webhook)
       └─ produces ranked candidates with G1-G9 results
  → [CIL consensus] (call CIL v6.1 webhook for top N candidates in parallel)
       └─ produces G10-G14 cascade + counter-thesis
  → [IRONCLAD risk] (Code node calls a2e-platform IRONCLAD module)
       └─ G15-G17 sizing/stop/sell-only enforcement
  → [Branch by mode]
       ├─ ticker/watchlist → just report (no orders)
       └─ holdings+stops → SENTINEL auto-maintenance
  → [E*TRADE auto-maintenance] (only if mode=holdings+stops)
       └─ for each position needing stop adjustment:
            G17 sell-only check → preview → place → G18 receipt
       └─ NEVER places BUY without explicit `--allow-buys` flag
  → [Archive] (commit run record to A2E_Intelligence)
       └─ G19 archive contract
  → [Report] (Telegram message + webhook response + GitHub commit)
```

### Auto-maintenance contract (the critical piece)

When `mode=holdings+stops`, for each position:

1. Read current state from `positions_latest.json`
2. Check IRONCLAD compliance:
   - Has a stop? (Rings 2-4 require)
   - Stop within 5% of last price?
   - Trim laddered at +5% intervals?
3. If non-compliant, build correction order:
   - **Stop missing or wrong price** → `change_preview_equity_order` with new stop, 75% of position
   - **Trim missing** → `place_equity_order` LIMIT SELL 25% above next +5%
   - **Stop wrong type** (trailing → fixed): `cancel_order` then `place_equity_order` fresh
4. Pass through `sell_only_guard` (raises GuardViolation if BUY)
5. Pass through `ironclad_stop_guard` (raises if stop > 5% from last)
6. Preview, then place, then verify order_id returned
7. Log to telegram with order_id + symbol + qty + price

**BUYs:** workflow only places BUYs when caller explicitly sets `allow_buys: true` AND a valid CIL recommendation with HIGH/FULL confidence exists for that symbol AND IRONCLAD position-size guard passes. Default: BUYs blocked, output is "BUY queued for Principal review" + Telegram alert.

---

## Credentials needed (all should already exist)

| Credential | Purpose | Already in n8n? |
|---|---|---|
| OpenAI API | URIEL via CIL | yes (used by CIL v6.1) |
| Anthropic API | MICHA via CIL + synthesis | yes |
| Google Gemini | HANIEL | yes |
| Perplexity | SARIEL | yes |
| xAI | COLOSSUS | yes (used by SIGNAL) |
| DeepSeek | RAZIEL | yes |
| FRED API | DXY/yields/macro for kill switch | yes (key in memory) |
| Unusual Whales | flow/GEX/dark pool | yes (key in memory) |
| EIA | crude/energy macro | yes (key in memory) |
| E*TRADE OAuth | order management | yes via TOKEN KEEPER |
| Telegram Bot | report delivery | yes (`hunter_a2e_bot`) |
| GitHub PAT | archive commits | yes |

---

## What this looks like to the Principal

Principal types: **`Run Market Watch`**

System responds (terse, like SIGNAL):
```
🎯 MARKET WATCH · run_id mw-2026-04-26-1230
GATE STATUS: G0 ✓ (snap 4min) · G0.5 ✓ kill-switch armed
SCAN: 47 tickers · 12 passed G1-G9 · top 5: PLTR, AGIX, GLW, MRVL, META
CONSENSUS: 5/7 agents responded · cascade=HIGH on PLTR, MODERATE on others
RISK: G15 ✓ G16 ✓ G17 ✓ on all
HOLDINGS: 8 stops verified · 1 stop drift detected (AMD: stop $284 vs IRONCLAD $312)
AUTO-MAINTENANCE: AMD stop modified to $312.45 (75% of pos) · order #366
NEW CANDIDATES (no auto-buy): PLTR-add (HIGH conf), GLW-add (MOD conf)
RUN COMPLETE · 6m23s · archive: A2E_Intelligence/RUNS/mw-2026-04-26-1230.md
```

That output is the demo. The partner doesn't need slides. They need to see this go.

---

## Effort estimate (honest)

| Component | Effort | Best owner |
|---|---|---|
| Orchestrator skeleton workflow | 30 min | MICHA chat session |
| Mode router + parameter parsing | 1 hour | Claude Code |
| Gate G0/G0.5 wiring | 1.5 hours | Claude Code |
| HUNTER → CIL bridge (webhook chain) | 1 hour | Claude Code |
| IRONCLAD risk module wrapper | 2 hours | Claude Code |
| E*TRADE auto-maintenance logic | 3 hours | Claude Code (most complex) |
| Sell-only enforcement integration | 1 hour | Claude Code |
| Archive + Telegram delivery | 1 hour | Cowork |
| Webhook + Telegram trigger surfaces | 2 hours | Claude Code |
| End-to-end smoke test | 2 hours | MICHA chat session |
| **Total** | **~15 hours engineering** | **2-3 sessions** |

If you run 2 parallel Claude Code sessions, this is 7-8 hours of wallclock (assuming clean lane separation). If you run Claude Code + Cowork in parallel, depending on Cowork's capacity, similar.

**Realistic delivery:** end-to-end with manual mode triggers Sun-Tue. Polish + partner-demo-ready Wed AM.

---

*Spec written by MICHA · S4 overnight · 2026-04-26 04:00 ET*
*Next file: `WORK_BREAKDOWN.md` — discrete tasks for parallel sessions*
