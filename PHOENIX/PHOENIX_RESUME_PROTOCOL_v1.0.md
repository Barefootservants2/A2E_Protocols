# PHOENIX RESUME Keyword Protocol v1.0

**Effective:** April 18, 2026
**Author:** MICHA (CIO)
**Module:** `phoenix/session.py` in `a2e-platform` repo
**Storage:** `A2E_Protocols/PHOENIX/` — every close is persistent on GitHub

---

## THE MECHANIC

Every PHOENIX close now pushes the carry-forward to **two files**:

1. **Dated file** — `PHOENIX_CARRYFORWARD_{YYYY-MM-DD}.md` (historical record)
2. **LATEST pointer** — `PHOENIX_CARRYFORWARD_LATEST.md` (stable resume URL)

The dated file is the permanent archive. The LATEST file is always overwritten with the most recent close, giving us a **stable URL** to fetch from on any new session.

**Canonical resume URL:**
```
https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md
```

---

## KEYWORDS

The Principal fires one of three keywords to trigger deterministic behavior:

| Keyword | Action | Implementation |
|---|---|---|
| **`PHOENIX RESUME`** | Fetch latest carry-forward, summarize sections, ask where to pick up | `phoenix.fetch_latest_carry_forward()` |
| **`CLOSE SESSION`** | Generate carry-forward, push dated + LATEST, mark closed | `phoenix.close_session(maintain_latest=True)` |
| **`KILLSWITCH`** | Halt everything immediately — no override, including Principal | `metatron.KillSwitchFired` raised |

---

## PHOENIX RESUME — WHAT IT DOES

When MICHA sees `PHOENIX RESUME` from Principal:

```python
from phoenix import fetch_latest_carry_forward, summarize_carry_forward

fetch = fetch_latest_carry_forward()   # Uses $GITHUB_TOKEN env var
print(summarize_carry_forward(fetch))
```

Returns a summary including:
- Filename + char count + GitHub URL
- Top section headers with first line of content:
  - **ACTIONS COMPLETED** — top commit from last session
  - **ACTIONS PENDING** — what wasn't finished
  - **DECISIONS MADE** — key decisions
  - **ANOMALIES ON WATCH** — drift / open bugs
  - **NEXT SESSION PRIORITY** — what to do first

MICHA then confirms state and asks Principal where to pick up — does NOT start executing without explicit go-ahead.

---

## FETCH ORDER

`fetch_latest_carry_forward()` uses this priority:

1. **Fast path** — try `PHOENIX_CARRYFORWARD_LATEST.md` directly (single API call)
2. **Fallback** — if LATEST missing, list the `PHOENIX/` directory and pick the file with the newest `YYYY-MM-DD` suffix
3. **No match** — return `CarryForwardFetch(found=False, error=...)` — MICHA reports empty state to Principal

---

## GUARANTEES

- **Persistence:** Every close is permanent on GitHub. No state loss from session rotation.
- **Deterministic fetch:** A function call replaces "Claude tries to remember what we were doing."
- **History preserved:** Dated files are never overwritten — full audit trail.
- **Stable resume URL:** LATEST file is the single source of truth for "where did we leave off."
- **Token-free read:** Raw GitHub URL (raw.githubusercontent.com) works without auth; API calls only needed for write.

---

## OPERATIONAL NOTES

**Environment:**
- `$GITHUB_TOKEN` needs to be set for `fetch_latest_carry_forward()` in private-repo contexts (A2E_Protocols is private). Without the token, the GitHub API will return 404 (can't distinguish "missing" from "no auth").
- For read-only access via raw GitHub URL, no token is needed.

**Bootstrap integration:**
MICHA_BOOTSTRAP.md should reference the LATEST URL as part of the session-start fetch list. Principal's next-session task: update MICHA bootstrap to include LATEST fetch automatically.

**Self-hosting:**
`phoenix.close_session()` now defaults to `maintain_latest=True` — every close maintains the LATEST pointer automatically. Set `maintain_latest=False` to push the dated file only (for experimental / non-canonical closes).

---

## EXAMPLE SESSION FLOW

```
[Session N — 2026-04-20 9:15 PM]
Principal: CLOSE SESSION

MICHA:
  phoenix.close_session(
      state,
      push_to_github=True,
      maintain_latest=True,
  )
  → Dated: PHOENIX_CARRYFORWARD_2026-04-20.md pushed
  → LATEST: PHOENIX_CARRYFORWARD_LATEST.md overwritten
  🔱 PHOENIX CLOSED.


[Session N+1 — 2026-04-21 6:30 AM — new chat, fresh context]
Principal: PHOENIX RESUME

MICHA:
  fetch = phoenix.fetch_latest_carry_forward()
  summary = phoenix.summarize_carry_forward(fetch)
  → 📄 PHOENIX_CARRYFORWARD_LATEST.md — 4,986 chars
  → **NEXT SESSION PRIORITY** — Fix MICHA drift, port FastAPI, ...
  →
  → Principal — resumed from 2026-04-20 close. Top priority was "X".
  → Where do you want to pick up?
```

---

## TESTS

`tests/test_phoenix.py` covers all resume functionality:
- `TestCarryForwardFetch::test_latest_file_hit` — LATEST file fast path
- `TestCarryForwardFetch::test_fallback_to_dated_listing` — newest-by-date fallback
- `TestCarryForwardFetch::test_empty_directory_returns_not_found` — graceful empty state
- `TestCarryForwardFetch::test_skip_latest_pointer_when_disabled` — opt-out path
- `TestPushWithLatest::test_pushes_both_dated_and_latest` — dual-push verified
- `TestSummarizeCarryForward` — section extraction, max-sections cap, not-found fallback
- `TestCloseSessionMaintainLatest` — `close_session(maintain_latest=True)` default

10 new tests added; full suite 270 passing.

---

🔱 *PHOENIX RESUME v1.0 — deterministic session continuity*
*Uriel Covenant AI Collective | Ashes2Echoes LLC*
