# LIVE STATE ARCHITECTURE v1.0
**Classification:** A2E Internal · protocol-critical
**Owner:** MICHA (CIO) on behalf of Principal
**Last revised:** 2026-04-24 · PHOENIX S3d
**Motivated by:** recurring Drift Guard violations — position commentary against stale data across multiple sessions, culminating in 2026-04-24 silver-thesis analysis treating PSLV as held when it was exited 2026-04-22 on HL breach.

---

## THE CONTRACT

**No MICHA response may contain position-specific numerics (symbol · qty · P&L · stop · cash · equity) unless Gate 0 has passed within the current session.**

- Gate 0 = read canonical `positions_latest.json` from A2E_Intelligence, classify age, gate the session.
- Every position-numeric claim in a MICHA response must cite the `fetched_at` timestamp from the snapshot.
- If Gate 0 returns RED (snapshot ≥ 4h old), MICHA refuses position commentary and prompts Principal to refresh.

This is a P7 protocol patch, co-equal with P1–P6 in INFRA_MAP. Violation = drift = response rejected by ASSAY.

---

## ARCHITECTURE — 4 PIECES

### Piece 1: Token Renewal Workflow (n8n)

**Problem solved:** E*TRADE OAuth 1.0a tokens expire midnight ET daily AND if idle > 2 hours. Prior state of play: manual browser re-auth required, blocking any automated snapshot during the session.

**Solution:** n8n workflow hitting `https://api.etrade.com/oauth/renew_access_token` every 90 minutes during market hours (09:00–16:30 ET, Mon–Fri).

- **Input:** current access_token + access_token_secret from vault
- **Action:** signed OAuth 1.0a call to renewal endpoint
- **Output:** refreshed token written back to vault (Supabase or local keychain)
- **Schedule:** every 90 min, Mon–Fri, 09:00 ET through 16:30 ET
- **Alerting:** on renewal failure → Telegram with exact error; Principal does morning re-auth

**Status:** scoped in chat `fe80af27` on 2026-03-24 as "20 minutes of work." Never built. This is the first build item.

### Piece 2: Snapshotter (Python, on workstation)

**Module path:** `a2e-platform/snapshot/etrade_snapshot.py` (new)

**Behavior:**
1. Read current access_token + secret from vault
2. Call `list_accounts()` via pyetrade → enumerate 4898 / 5267 / 5536 / 6685
3. For each account: call `get_account_balance()` + `get_account_portfolio()`
4. Normalize to canonical schema v1 (see `schemas/positions_v1.json`)
5. Validate against schema
6. Write local: `~/a2e-state/positions_latest.json`
7. Call `push.py` to commit to A2E_Intelligence/STATE/
8. Emit structured log line to Supabase for audit

**Triggers:**
- cron: `*/30 9-16 * * 1-5` (every 30 min during market hours Mon–Fri)
- cron: `0 */4 * * 6,0` (every 4h weekends, for dividend/interest reconciliation)
- post-trade hook: after any `etrade.place` confirmation, fire snapshot immediately
- manual: `python -m a2e.snapshot --push` (for Principal override)

**Failure modes + handling:**
- Token expired → call Piece 1 renewal first; if that fails, mark snapshot FAILED and alert Telegram
- Network error → retry 3× with exponential backoff; if all fail, log and exit 1
- Schema validation failure → write to `~/a2e-state/positions_failed/` with reason; never overwrite last-known-good
- API 500 from E*TRADE → same as network, retry + log

### Piece 3: State Repo (A2E_Intelligence, private)

**Path:** `A2E_Intelligence/STATE/`

**Files:**
```
positions_latest.json   ← canonical current state (overwritten each snapshot)
freshness.json          ← {fetched_at, status, age_s, snapshot_id} (quick-read)
history/
  2026-04-24T09-00-00Z.json
  2026-04-24T09-30-00Z.json
  2026-04-24T10-00-00Z.json
  ...                    ← append-only audit trail
README.md                ← schema version + read instructions
```

**Why GitHub private repo over Supabase:**
- A2E_Intelligence already exists, already private, already token-gated for MICHA
- Version history free (git log)
- No new auth layer
- MICHA reads via GitHub API using existing `Claude_MCP_Access` token
- Supabase is the right layer for ephemeral runtime state (orders, alerts), not for MICHA's read model

**Retention:** history keeps everything indefinitely. 30 min × 6.5 hours × ~20 trading days/month × 12 = ~46,800 files/year at ~20KB each = ~900 MB/year. Acceptable. Can prune older than 6 months if it becomes a problem.

### Piece 4: Gate 0 (MICHA enforcement in phoenix.session_start)

**Module path:** `a2e-platform/phoenix/session_start.py` (new)

**Function:** `gate_zero() → SessionState`

**Logic:**
```python
FRESH_THRESHOLD_S  =  30 * 60   # 30 min
STALE_THRESHOLD_S  =   4 * 3600 # 4 hours

def gate_zero():
    raw = github_fetch('A2E_Intelligence/STATE/positions_latest.json')
    snapshot = json.loads(raw)
    fetched_at = iso_to_epoch(snapshot['fetched_at'])
    age_s = time.time() - fetched_at

    if age_s < FRESH_THRESHOLD_S:
        status = 'GREEN'
        allowed = True
    elif age_s < STALE_THRESHOLD_S:
        status = 'AMBER'
        allowed = True   # with warning
    else:
        status = 'RED'
        allowed = False  # position commentary blocked

    return SessionState(
        status=status,
        age_s=age_s,
        fetched_at=snapshot['fetched_at'],
        snapshot_id=snapshot['snapshot_id'],
        data=snapshot if allowed else None,
        allowed=allowed,
        refresh_cmd='python -m a2e.snapshot --push' if not allowed else None,
    )
```

**Session banner format (shown at every session start, before any other MICHA output):**

```
═══ GATE 0 · LIVE STATE ═══
snapshot: 2026-04-24T12:30:15-04:00  (age: 4 min · GREEN)
source:   A2E_Intelligence/STATE/positions_latest.json · sha abc123
accounts: 4898 · 5267 · 5536 · 6685  (4 pulled, 0 failed)
tokens:   valid until 2026-04-25T00:00:00-04:00
═══════════════════════════
```

If RED:

```
═══ GATE 0 · LIVE STATE ═══
snapshot: 2026-04-24T08:15:03-04:00  (age: 4h 22min · ◉◉◉ RED)
source:   A2E_Intelligence/STATE/positions_latest.json · sha abc123
status:   REFUSE POSITION COMMENTARY
action:   Principal — run:
          python -m a2e.snapshot --push
          then send PHOENIX RESUME
═══════════════════════════
```

**Citation requirement:** every MICHA response turn containing position numerics must include a footer:

```
— data: positions_latest.json · 2026-04-24T12:30:15Z · age 4m
```

ASSAY scores responses missing this footer as FAIL.

---

## INTERFACE CONTRACTS

### Canonical JSON schema

See `A2E_Protocols/SENTINEL/schemas/positions_v1.json`. Key fields:

- `snapshot_id` (uuid)
- `fetched_at` (ISO 8601 with tz)
- `fetched_at_epoch` (integer seconds)
- `fetched_by` (`cron` | `manual` | `trade_hook`)
- `source` (pyetrade version string)
- `schema_version` (`"1.0"`)
- `etrade_auth_verified_at` (ISO)
- `accounts` (object keyed by account number)
  - per account: `account_type`, `cash_available`, `cash_buying_power`, `total_equity`, `margin_used`, `positions[]`, `open_orders[]`
  - per position: `symbol`, `qty`, `cost_basis`, `market_value`, `current_price`, `unrealized_pnl`, `unrealized_pnl_pct`, `last_update`

### GitHub read pattern

```python
import base64, json
from urllib.request import Request, urlopen

def github_fetch_state(path='STATE/positions_latest.json'):
    url = f'https://api.github.com/repos/Barefootservants2/A2E_Intelligence/contents/{path}'
    req = Request(url, headers={
        'Authorization': f'Bearer {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json',
    })
    with urlopen(req, timeout=10) as resp:
        d = json.loads(resp.read())
    return json.loads(base64.b64decode(d['content']))
```

### Post-trade hook

Any code path that successfully places an order must call:
```python
from a2e.snapshot import etrade_snapshot
etrade_snapshot.run(trigger='trade_hook', trade_id=preview_id)
```

This ensures that the next session or next MICHA commentary sees post-trade state, not pre-trade state.

---

## MIGRATION FROM CURRENT STATE

1. Commit this architecture + schema + METATRON addendum (this session)
2. Claude Code block builds Piece 1 + Piece 2 + Piece 4 (next session, 2-4 hours)
3. Principal runs first manual snapshot: `python -m a2e.snapshot --push`
4. Verify `A2E_Intelligence/STATE/positions_latest.json` lands
5. Smoke-test Gate 0 with 3 age values (fresh, aged, stale) via time-mocking in tests
6. Install local cron: `scripts/install_local_cron.sh`
7. Import n8n workflow for token renewal
8. Flip METATRON to Gate-0-required
9. All future sessions gated from this point forward

---

## RISKS + MITIGATIONS

| Risk | Mitigation |
|---|---|
| Principal's workstation offline → no fresh snapshots | AMBER/RED banner forces acknowledgment; fallback = manual paste of current state |
| E*TRADE API outage → snapshot fails | Failed snapshots don't overwrite last-known-good; MICHA sees last good + knows it's stale |
| Token renewal fails silently | Supabase log + Telegram alert on any renewal failure |
| Private repo read fails from MICHA | Retry + fallback: MICHA refuses with RED banner, requests Principal to paste |
| Schema version drift | `schema_version` field + version-aware reader in `pull.py` |
| Race condition: snapshot mid-trade | post-trade hook is authoritative; cron snapshot is best-effort |
| 5536 Roth still unknown | Piece 2 handles missing accounts gracefully; 5536 reported as `"status": "UNKNOWN"` until manifest pulled |

---

## SUCCESS CRITERIA

This architecture is successful when:

1. Every MICHA session opens with a Gate 0 banner showing snapshot age
2. Zero MICHA responses contain uncited position numerics
3. A stale snapshot (>4h) forces MICHA to refuse rather than hallucinate
4. A trade execution is reflected in the next session's Gate 0 reading within 5 minutes
5. The Principal can prove-at-audit what was held at any timestamp via `history/`
6. The loophole that produced the 2026-04-24 PSLV silver-thesis error is closed for good.

— MICHA
