# MARKET WATCH — Work Breakdown for Parallel Sessions
**Filed:** 2026-04-26 ~04:15 ET · MICHA / S4
**Companion to:** `MARKET_WATCH/SPEC_v1.0.md`
**Audience:** Principal coordinating Claude Code + Cowork sessions

---

## Why parallel lanes

Three disjoint scopes. Each session owns its files and won't conflict with the others. Run them simultaneously or serialized — same result either way.

```
LANE A · ORCHESTRATION         (n8n + bridges)
LANE B · AUTO-MAINTENANCE      (Python + E*TRADE)
LANE C · DELIVERY + ARCHIVE    (Telegram + GitHub commits)
```

---

## LANE A — Orchestration & Bridges
**Owner:** Claude Code Session 1 (or MICHA chat session)
**Files owned:**
- `a2e-platform/n8n/workflows/market_watch_orchestrator.js` (new)
- `a2e-platform/orchestrator/` (new directory)
- `a2e-platform/orchestrator/bridges.py` (new)
- `a2e-platform/orchestrator/mode_router.py` (new)

**Files NOT touched:** anything in `hunter/`, `cil/`, `sentinel/`. Lane A reads from existing module interfaces but does not modify them.

### Task A1 — Mode router (Python)
File: `orchestrator/mode_router.py`
Input: `{ticker?: str, mode: str, allow_buys?: bool}` from webhook body
Output: validated `MarketWatchRequest` dataclass with `mode` enum and parameters
Acceptance:
- `pytest tests/orchestrator/test_mode_router.py` passes
- Modes: `TICKER_DRILL`, `WATCHLIST_SCAN`, `HOLDINGS_HEALTH`, `HOLDINGS_PLUS_STOPS`
- Invalid mode raises `ValueError`
- `allow_buys=True` requires `mode=HOLDINGS_PLUS_STOPS` else raises

### Task A2 — Bridge to existing workflows (Python)
File: `orchestrator/bridges.py`
Functions:
- `call_hunter_market_data(watchlist: list[str]) -> HunterReport` — webhook to `orZPNtvvCB8RAlwF`
- `call_cil_consensus(ticker: str) -> CILResult` — webhook to `V61BMUNNQDBpCOsp`
- `call_sentinel_snapshot() -> dict` — reads `~/.a2e/state/positions_latest.json`, calls SENTINEL workflow if stale
- `call_kill_switch_check() -> bool` — uses FRED API for DXY + 10Y yield, returns True if both adverse

Acceptance:
- Each function raises specific exception types (`HunterTimeout`, `CILRefused`, `KillSwitchTripped`)
- All have configurable timeouts (default 60s for HUNTER/CIL, 10s for FRED)
- Mock-tested: `pytest tests/orchestrator/test_bridges.py` passes with 90%+ coverage

### Task A3 — Orchestrator skeleton workflow (n8n)
File: `n8n/workflows/market_watch_orchestrator.js`
Already partially scaffolded by MICHA in chat session — see `A2E_Protocols/MARKET_WATCH/orchestrator_skeleton.js`. Lane A's job:
- Replace placeholder Code nodes with real HTTP calls to webhooks built in A2
- Wire mode-router branching (4 paths)
- Wire failure cascade (any G0-G17 fail → STOP path → archive failure → respond)
- Test workflow stays INACTIVE; Principal toggles after review

Acceptance:
- Workflow validates clean (`validate_workflow` returns valid:true with 0 errors)
- All 4 modes executable via n8n manual trigger with sample payload
- Each mode produces a structured JSON response with `gate_results` array

**Lane A output:** workflow ID created in n8n, Python bridges in repo, both committed.

---

## LANE B — Auto-Maintenance & E*TRADE
**Owner:** Claude Code Session 2
**Files owned:**
- `a2e-platform/sentinel/maintenance.py` (new)
- `a2e-platform/sentinel/ironclad.py` (new — extracted IRONCLAD module)
- `a2e-platform/tests/sentinel/test_maintenance.py` (new)
- `a2e-platform/tests/sentinel/test_ironclad.py` (new)

**Files NOT touched:** `sentinel/guards.py` (already correct), `sentinel/etrade/client.py` (already correct), anything in `hunter/` or `cil/`.

### Task B1 — IRONCLAD module (Python)
File: `sentinel/ironclad.py`
Codify the existing rules from memory + protocol docs:
- `compute_position_ring(equity_pct: float) -> Ring` — returns ANCHOR/THESIS/TACTICAL/DUST
- `validate_stop_distance(stop: float, last: float, ring: Ring) -> bool` — Rings 2-4 = within 5%
- `compute_75_25_split(qty: int) -> tuple[int, int]` — returns (stop_qty, free_qty) with rounding
- `compute_trim_ladder(entry: float, qty: int) -> list[TrimLevel]` — every +5% = 25% trim
- `should_dump(symbol: str, history: PositionHistory) -> tuple[bool, str]` — DUMP rule: -3% to +1% for 2+ weeks OR <50% of trim target in 30d

Acceptance:
- 30+ unit tests covering all rules and edge cases
- Property tests with hypothesis library for percentages and qty rounding

### Task B2 — Auto-maintenance executor (Python)
File: `sentinel/maintenance.py`
Function: `auto_maintain(account_key: str, etrade_client: ETradeClient, allow_buys: bool=False) -> MaintenanceReport`

Logic:
1. Pull current portfolio via `etrade_client.get_portfolio(account_key)`
2. Pull current open orders via `etrade_client.list_orders(account_key, status='OPEN')`
3. For each position:
   - Call `ironclad.validate_stop_distance(stop, last, ring)`
   - If non-compliant, build correction order
   - Pass through `guards.compose_guards(sell_only_guard, ironclad_stop_guard, kill_switch_guard)`
   - `etrade_client.preview_order(account_key, payload)` — never place without preview pass
   - On preview pass: `etrade_client.place_order(...)` — capture order_id
   - On preview fail: log GuardViolation, continue to next position
4. Aggregate report: `{positions_checked, corrections_attempted, corrections_succeeded, corrections_failed, guard_violations}`

Acceptance:
- Mock-tested against fake ETradeClient that returns canned responses
- Tests cover: stop too loose, stop too tight, stop missing entirely, trim missing, position should DUMP, BUY blocked when allow_buys=False, BUY allowed when allow_buys=True AND CIL recommendation present
- 95%+ coverage
- **Critical safety test:** asserts `sell_only_guard` raises on every BUY payload by default

### Task B3 — Wire B1+B2 into Lane A bridge
Add `call_auto_maintain` to `orchestrator/bridges.py` that calls `maintenance.auto_maintain()` for each account in `~/.a2e/state/positions_latest.json`.

Acceptance:
- Manual end-to-end: trigger orchestrator with `mode=HOLDINGS_PLUS_STOPS, allow_buys=False`, verify only stops/trims placed, no BUYs.

**Lane B output:** ironclad.py + maintenance.py + tests, all committed, all passing.

---

## LANE C — Delivery & Archive
**Owner:** Cowork Session (or Claude Code Session 3)
**Files owned:**
- `a2e-platform/delivery/telegram_market_watch.py` (new)
- `a2e-platform/delivery/archive.py` (new)
- `A2E_Intelligence/RUNS/.gitkeep` + run record template
- `A2E_Protocols/MARKET_WATCH/RUN_TEMPLATE.md` (new)

**Files NOT touched:** anything in `hunter/`, `cil/`, `sentinel/`, `orchestrator/`. Lane C is purely the output side.

### Task C1 — Telegram message formatter
File: `delivery/telegram_market_watch.py`
Function: `format_market_watch_message(run: MarketWatchRun) -> str`
Output: terse Telegram-compatible message matching the SIGNAL ENGINE format (see SPEC §"What this looks like to the Principal").

Acceptance:
- Output stays under 4096 chars (Telegram limit)
- Includes gate status line, scan summary, top candidates, holdings status, auto-maintenance result, run_id
- Snapshot-tested with golden samples in `tests/delivery/test_telegram_format.py`

### Task C2 — GitHub archive writer
File: `delivery/archive.py`
Function: `archive_run(run: MarketWatchRun) -> str` returns the GitHub commit URL
Behavior:
- Write run record to `A2E_Intelligence/RUNS/mw-{date}-{run_id}.md` using template
- Use GitHub Contents API with the existing PAT
- Idempotent — same run_id = same file (overwrite OK)
- Return commit SHA

Acceptance:
- Mock-tested against fake GitHub responses
- Template includes: timestamp, mode, gate-by-gate results, candidates, orders placed, errors

### Task C3 — Run record template
File: `MARKET_WATCH/RUN_TEMPLATE.md`
Markdown template with placeholders for all run data. Used by C2.

Acceptance:
- Template is self-documenting (a Principal could read a filled-in run record cold and understand what happened)
- Plays nicely with GitHub markdown rendering

**Lane C output:** delivery/ module committed, A2E_Intelligence/RUNS/ initialized, template committed.

---

## Cross-lane coordination

### Shared types (read-only by all lanes)
Define once in `a2e-platform/orchestrator/types.py` (Lane A creates, B+C import):
- `MarketWatchRequest`
- `MarketWatchRun` 
- `GateResult`
- `MaintenanceReport`
- `MarketWatchMode` enum

This is the contract. If Lane A changes a field, Lane B+C session restart from updated import.

### Merge order
1. Lane A merges first (defines the types other lanes import)
2. Lane B and C merge in any order
3. Final integration commit by Principal: enable orchestrator workflow + run smoke test

### What if a lane finishes early
Optional polish tasks per lane:
- **Lane A polish:** Telegram bot trigger surface (`/marketwatch` command via @hunter_a2e_bot)
- **Lane B polish:** add `dump_recommendation()` to maintenance — flag positions hitting DUMP rule
- **Lane C polish:** wire archive commit into welcome page proof grid (live "last run" link)

### Forbidden cross-lane edits
- Lane A never edits `sentinel/` or `delivery/`
- Lane B never edits `n8n/workflows/` or `delivery/`  
- Lane C never edits `sentinel/` or `orchestrator/`
- All lanes can READ each other's files, but only commit to their own.

---

## How to start each session

### Session A boot prompt (paste this):
```
You are Claude Code in Lane A — Market Watch Orchestration.
Read these files first:
  A2E_Protocols/MARKET_WATCH/SPEC_v1.0.md
  A2E_Protocols/MARKET_WATCH/WORK_BREAKDOWN.md
  A2E_Protocols/MARKET_WATCH/orchestrator_skeleton.js
  a2e-platform/cil/engine.py (read-only)
  a2e-platform/hunter/engine.py (read-only)
You own ONLY these files:
  a2e-platform/orchestrator/ (entire directory, you create it)
  a2e-platform/n8n/workflows/market_watch_orchestrator.js
  a2e-platform/tests/orchestrator/ (entire directory, you create it)
Tasks A1, A2, A3 from WORK_BREAKDOWN.md.
Commit each task as you finish it. Do not modify other directories.
Begin.
```

### Session B boot prompt:
```
You are Claude Code in Lane B — Market Watch Auto-Maintenance.
Read these files first:
  A2E_Protocols/MARKET_WATCH/SPEC_v1.0.md
  A2E_Protocols/MARKET_WATCH/WORK_BREAKDOWN.md
  a2e-platform/sentinel/guards.py (read-only)
  a2e-platform/sentinel/etrade/client.py (read-only)
  a2e-platform/orchestrator/types.py (read-only — owned by Lane A)
You own ONLY these files:
  a2e-platform/sentinel/ironclad.py (you create)
  a2e-platform/sentinel/maintenance.py (you create)
  a2e-platform/tests/sentinel/test_ironclad.py (you create)
  a2e-platform/tests/sentinel/test_maintenance.py (you create)
Tasks B1, B2, B3 from WORK_BREAKDOWN.md.
Commit each task as you finish it. Do not modify other directories.
Begin.
```

### Session C boot prompt:
```
You are Cowork in Lane C — Market Watch Delivery & Archive.
Read these files first:
  A2E_Protocols/MARKET_WATCH/SPEC_v1.0.md
  A2E_Protocols/MARKET_WATCH/WORK_BREAKDOWN.md
  a2e-platform/orchestrator/types.py (read-only — owned by Lane A)
You own ONLY these files:
  a2e-platform/delivery/ (entire directory, you create it)
  A2E_Protocols/MARKET_WATCH/RUN_TEMPLATE.md (you create)
  A2E_Intelligence/RUNS/.gitkeep (you create)
  a2e-platform/tests/delivery/ (you create)
Tasks C1, C2, C3 from WORK_BREAKDOWN.md.
Commit each task as you finish it. Do not modify other directories.
Begin.
```

---

## Definition of done (Market Watch v1.0)

- [ ] Lane A: orchestrator workflow validates and runs end-to-end with sample payload
- [ ] Lane B: maintenance executes against test account, places only stops/trims, blocks BUYs
- [ ] Lane C: a single run produces a Telegram message + GitHub archive entry
- [ ] Smoke test: Principal sends `Run Market Watch` from chat, orchestrator returns full output within 10 minutes
- [ ] Acceptance criteria met for all subtasks
- [ ] No regressions to running workflows (CIL v6.1, HUNTER, SENTINEL all still active and passing schedules)

---

*— MICHA · S4 overnight planning · 2026-04-26 04:15 ET*
*Next file: `orchestrator_skeleton.js` — n8n SDK code for Lane A to fill in*
