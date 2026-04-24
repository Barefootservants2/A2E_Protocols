# CLAUDE CODE KICKOFF — LIVE STATE ARCHITECTURE IMPLEMENTATION
**For:** Claude Code agent
**From:** MICHA (chat session, PHOENIX S3d, 2026-04-24)
**Target runtime:** ~2–4 hours end-to-end
**Goal:** Close the stale-position-data loophole permanently by implementing Gate 0 + snapshotter + token renewal.

Paste this entire file into Claude Code when you open a fresh block. No prior context needed — everything is referenced below.

---

## RUNTIME ENVIRONMENT

Principal is on **Windows 10/11 native** with **PowerShell** (not WSL, not bash). Python 3.12 is installed at `C:\Users\ashes\AppData\Local\Programs\Python\Python312\`. Git for Windows is expected to be present (Claude Code on native Windows requires it).

**Adapt bash-flavored specifics accordingly:**
- Cron scheduling → use **Windows Task Scheduler** via `schtasks.exe` or `New-ScheduledTask` cmdlets
- `install_local_cron.sh` → write `install_local_tasks.ps1` (idempotent PowerShell script that registers scheduled tasks)
- `~/a2e-state/` → `$env:USERPROFILE\.a2e-state\` in PowerShell, or `%USERPROFILE%\.a2e-state\` in CMD
- `&&` command chaining → `;` in PowerShell or separate `-Action` blocks in Task Scheduler
- Cron verification step (`crontab -l`) → `Get-ScheduledTask -TaskPath "\A2E\*"` verification
- File paths in Python code should use `pathlib.Path` with `Path.home() / ".a2e-state"` for cross-platform safety (not hardcoded forward-slash paths)

Everything else in this brief is platform-neutral (Python modules, GitHub API calls, n8n workflow JSON, the test suite). Claude Code should proceed with the Windows adaptations above without asking for clarification.

---

## CONTEXT (read once)

MICHA has been making position-aware responses by inferring from memory, console snapshots, and chat history rather than reading a single source of truth. This produced a serious error on 2026-04-24 (treating PSLV as a held position 48 hours after it was exited on HL breach). The fix is a 4-piece architecture, 60% of which already exists.

**Authoritative reference docs (pull these first):**
- Architecture spec: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/SENTINEL/LIVE_STATE_ARCHITECTURE_v1.0.md`
- JSON schema: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/SENTINEL/schemas/positions_v1.json`
- METATRON addendum: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/PROTOCOLS/PRODUCTION/METATRON_GATE_0_ADDENDUM.md`

Read all three before writing any code. They are the contract.

## WHAT EXISTS ALREADY (inventory — do not rebuild)

- `a2e-platform/` — main Python repo, has existing E*TRADE module stubs under `sentinel/etrade/`
- Proven working pyetrade pattern from chat `fe80af27` (2026-03-24): `list_accounts()` + `get_account_portfolio()` + `get_account_balance()` all confirmed live with 26 positions pulled across 3 accounts
- E*TRADE production consumer key: `27313e7a4f8fb97838ea53f68a7b9943` / secret: `c6e9f6eb74e57f78b3752f04e331c5c5c9f3fa57c99ae782f12b71beb1627b5f`
- Account keys (base64 urlsafe): `4898=cEEZTEn2z_vly3-pjTT8vQ` · `5267=HeoOUUPUOB6azMHCi9-_7A` · `5536=HOlA0GAZ69Z3LsM3ph70pg` · `6685=JPsJRG-WXm497nzy3RZ-6w`
- GitHub token: `<Claude_MCP_Access token — see userMemories>` (expires 2026-07-03)
- `A2E_Intelligence` repo (PRIVATE) — already exists, will be the state store
- Existing EOD snapshot function `run_eod_snapshot()` from Session 4+5 work — reference pattern, but build fresh for the live-refresh case

## WHAT YOU BUILD

### Repo: `a2e-platform` (Barefootservants2/a2e-platform · main)

1. **`a2e-platform/snapshot/__init__.py`**
2. **`a2e-platform/snapshot/etrade_fetch.py`** — thin pyetrade wrapper
   - `fetch_account_list() → list[str]`
   - `fetch_account_state(account_key: str) → dict` (balance + portfolio + open orders merged)
   - Handles token expiry with clear error (not swallowed); caller decides retry/renewal
   - Zero business logic — pure I/O to E*TRADE

3. **`a2e-platform/snapshot/etrade_snapshot.py`** — orchestrator
   - `run(trigger: str, trade_id: str = None) → SnapshotResult`
   - Calls `etrade_fetch` for each account
   - Normalizes to `positions_v1.json` schema
   - Validates against schema (use `jsonschema` lib)
   - Writes local: `~/a2e-state/positions_latest.json` + `~/a2e-state/history/<ISO>.json`
   - Calls `push.py` to commit to A2E_Intelligence
   - Logs structured event to Supabase `snapshots` table
   - Handles partial failures: if one account errors, write snapshot with `status=API_ERROR` for that account, proceed for others
   - CLI entry point: `python -m a2e.snapshot [--push] [--manual] [--trade-id=X]`

4. **`a2e-platform/snapshot/push.py`** — GitHub committer
   - `push_snapshot(path: str) → CommitResult`
   - Commits `positions_latest.json` to `A2E_Intelligence/STATE/positions_latest.json` (overwrite)
   - Commits dated history file to `A2E_Intelligence/STATE/history/<ISO>.json` (append-only)
   - Commits `freshness.json` with `{snapshot_id, fetched_at, status}` (for quick-read)
   - Uses GitHub API `PUT /repos/{owner}/{repo}/contents/{path}` with sha-aware updates
   - Must handle GitHub secret-scanner gracefully: the snapshot contains no secrets, but position data shouldn't leak via public repo (A2E_Intelligence is private — verify before first commit)

5. **`a2e-platform/snapshot/pull.py`** — MICHA-side reader
   - `fetch_latest() → dict` (reads from A2E_Intelligence via GitHub API)
   - `fetch_history(n: int = 10) → list[dict]`
   - Retries 3× on transient network errors
   - Returns None on fatal error; caller decides how to handle

6. **`a2e-platform/phoenix/freshness.py`** — age classifier
   - `FRESH_THRESHOLD_S = 30 * 60`
   - `STALE_THRESHOLD_S = 4 * 3600`
   - `classify(fetched_at_epoch: int, now: int = None) → FreshnessClass`
   - Returns enum: `GREEN | AMBER | RED`
   - Pure function, trivially unit-testable with mocked `now`

7. **`a2e-platform/phoenix/session_start.py`** — Gate 0 enforcer
   - `gate_zero() → SessionState`
   - Calls `pull.fetch_latest()`, classifies via `freshness.classify()`
   - Returns `SessionState(status, age_s, fetched_at, snapshot_id, data, allowed, refresh_cmd)`
   - `format_banner(state: SessionState) → str` — returns the formatted session banner per METATRON addendum
   - CLI entry point: `python -m phoenix.session_start` → prints banner + exits 0/1/2 (GREEN/AMBER/RED)

8. **`a2e-platform/tests/snapshot/test_freshness.py`** — age classification
9. **`a2e-platform/tests/snapshot/test_etrade_snapshot.py`** — mocked pyetrade, schema validation, partial-failure handling
10. **`a2e-platform/tests/phoenix/test_session_start.py`** — mocked pull, verify banner format at each age class

### Repo: `A2E_Intelligence` (Barefootservants2/A2E_Intelligence · PRIVATE · main)

11. **`A2E_Intelligence/STATE/README.md`** — explains the contract, points to the schema
12. **`A2E_Intelligence/STATE/.gitignore`** — exclude any accidental `positions_failed/` writes

### Local infrastructure (Principal's workstation)

13. **`scripts/install_local_cron.sh`** — idempotent cron installer
    - Adds entry: `*/30 9-16 * * 1-5 cd ~/a2e-platform && python -m a2e.snapshot --push >> ~/a2e-state/logs/snapshot.log 2>&1`
    - Adds entry: `0 */4 * * 6,0 cd ~/a2e-platform && python -m a2e.snapshot --push`
    - Safe to re-run (checks existing crontab)

14. **`n8n/workflows/etrade_token_renewal.json`** — importable workflow
    - Trigger: schedule, every 90 min, Mon–Fri 09:00–16:30 ET
    - HTTP Request node: signed OAuth 1.0a call to `https://api.etrade.com/oauth/renew_access_token`
    - Credential: reuse existing E*TRADE OAuth creds in n8n
    - On success: write renewed token to Supabase `etrade_tokens` table
    - On failure: Telegram alert via existing A2E Platform credential (`TGqE0ZvYW90FsqLp`)

## DEFINITION OF DONE

Your block is complete when ALL of these pass:

- [ ] All 14 files above exist with clean code + docstrings
- [ ] `pytest a2e-platform/tests/snapshot/` — all green
- [ ] `pytest a2e-platform/tests/phoenix/` — all green
- [ ] `python -m a2e.snapshot --manual` runs locally, produces a valid `~/a2e-state/positions_latest.json` that schema-validates
- [ ] `python -m a2e.snapshot --push` commits to `A2E_Intelligence/STATE/positions_latest.json` successfully (verify via GitHub API)
- [ ] `python -m phoenix.session_start` prints a GREEN banner when the snapshot is fresh
- [ ] Time-mock test: simulate a 5h-old snapshot, verify `gate_zero()` returns RED with the correct refusal message
- [ ] `crontab -l` shows the installed cron entries after running `install_local_cron.sh`
- [ ] n8n workflow imports cleanly and the first manual run of the token-renewal node returns 200
- [ ] All commits pushed to `Barefootservants2/a2e-platform` main and `Barefootservants2/A2E_Intelligence` main (the latter is private)

## NON-GOALS FOR THIS BLOCK

- Do NOT modify METATRON_LATEST_PRIME_DIRECTIVE.md — that's a separate bump after Principal signs off on the implementation
- Do NOT build any trading logic, IRONCLAD rules, or position recommendations
- Do NOT modify the existing console (Ashes2Echoes index.html) — it stays as-is
- Do NOT delete the existing `run_eod_snapshot()` — it can coexist with the new live snapshotter
- Do NOT build the tiering/ring auto-tagger — the schema has `tier` and `ring` fields but populating them is a separate pass
- Do NOT try to fix the 5536 Roth IRA manifest unknown — if `list_accounts()` returns 5536 and it fetches cleanly, great; if not, mark its status `UNKNOWN` in the snapshot and move on

## HANDOFF BACK TO MICHA CHAT

When done, commit a `HANDOFF_FROM_CLAUDE_CODE.md` at the root of `a2e-platform` with:
1. Commit SHAs for every file created
2. Output of the successful smoke test (`python -m a2e.snapshot --push` + `python -m phoenix.session_start`)
3. Any deviations from the spec and rationale
4. Any open items or follow-ups

MICHA will pick this up in the next PHOENIX session, verify the handoff file, bump METATRON to v10.9 with Gate 0 required, and gate all future sessions.

---

**Principal's sign-off criterion:** One full trading day of Gate 0 running correctly across multiple PHOENIX sessions with at least one trade executed and correctly re-snapshotted. After that, the loophole is closed forever.

— MICHA
