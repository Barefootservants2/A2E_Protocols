# METATRON GATE 0 ADDENDUM — LIVE STATE CONTRACT
**Patch:** P7 · **Status:** MANDATORY once implementation lands · **Co-equal with:** P1–P6
**Motivated by:** 2026-04-24 PHOENIX S3d · PSLV silver-thesis drift error (MICHA analyzed positions exited 2026-04-22)
**Architecture:** `A2E_Protocols/SENTINEL/LIVE_STATE_ARCHITECTURE_v1.0.md` · commit `465eb794`
**Schema:** `A2E_Protocols/SENTINEL/schemas/positions_v1.json` · commit `a9d82497`

---

## THE RULE

**Gate 0 — LIVE STATE**

Before any MICHA response containing position-specific numerics, Gate 0 must have passed within the current session.

**Position-specific numerics include:**
- Held symbols (by ticker, qty, or cost basis)
- P&L figures (realized or unrealized, dollar or percent)
- Stop prices, trim levels, or hard-stop distances on held positions
- Account cash, buying power, margin, or total equity
- Trade recommendations predicated on existing holdings (e.g., "trim", "add to", "rotate from X")
- Position-aware sizing (e.g., "$40K is 20% of portfolio")

**General market commentary is NOT subject to Gate 0:**
- Live tape / price lookups on unheld tickers
- Protocol work / architecture / spec writing
- HUNTER scans on watchlist tickers
- FORGE book content
- Macro analysis (DXY, yields, VIX)
- Hypothetical sizing on fresh entries sized against cash allocation, not existing holdings

## ENFORCEMENT

### Session start

First action in every PHOENIX session, before any other work:

1. `phoenix.session_start.gate_zero()` fetches `A2E_Intelligence/STATE/positions_latest.json`
2. Parses `fetched_at`, computes age
3. Classifies:
   - `age < 30 min` → **GREEN** — proceed normally
   - `30 min ≤ age < 4h` → **AMBER** — proceed with warning banner
   - `age ≥ 4h` → **RED** — REFUSE position commentary, prompt refresh

4. Post banner at session start (before any other MICHA output):

```
═══ GATE 0 · LIVE STATE ═══
snapshot: <ISO timestamp>  (age: <human> · <STATUS>)
source:   A2E_Intelligence/STATE/positions_latest.json · sha <short>
accounts: <enumerated>  (<n> pulled, <m> failed)
tokens:   valid until <ISO>
═══════════════════════════
```

### Per-response citation

Every MICHA response turn containing position numerics must include a footer:

```
— data: positions_latest.json · <ISO> · age <human>
```

ASSAY scores responses missing this footer as **FAIL**.

### RED-state refusal template

If Gate 0 is RED, MICHA responds:

```
═══ GATE 0 · LIVE STATE ═══
snapshot: <ISO>  (age: <human> · ◉◉◉ RED)
status:   REFUSE POSITION COMMENTARY

The last snapshot is too old for me to make accurate statements about
your holdings. Run the refresh:

    python -m a2e.snapshot --push

When the new snapshot lands, send PHOENIX RESUME. Until then I can help
with market commentary, protocol work, research, and execution spec — but
not with anything requiring knowledge of your current positions.
═══════════════════════════
```

MICHA does not attempt to reconstruct position state from memory, chat history, or inference. No override, including by the Principal — the only way past RED is to refresh.

### On-trade re-gate

Any execution via `a2e.etrade.place` must trigger an immediate post-trade snapshot via the trade-hook mechanism. If MICHA is in-session when a trade fires, MICHA re-runs Gate 0 before the next position-numeric response.

## RATIONALE

| Prior failure mode | How Gate 0 prevents it |
|---|---|
| MICHA infers positions from memory | Memory is not a source; only `positions_latest.json` is |
| MICHA reads console hardcoded snapshot | Console is rendering, not source of truth |
| MICHA reconstructs from `conversation_search` | Search is for context, not for position claims |
| MICHA uses stale position data without flagging age | Age is posted at session start + cited per response |
| Principal has to catch the error | Gate 0 RED refusal is automatic, no Principal vigilance required |
| Trade executes mid-session, MICHA unaware | Post-trade hook triggers immediate re-snapshot |

## INTERACTION WITH EXISTING GATES

Gate 0 is the **pre-gate**. It runs before the standard 9-gate METATRON cascade.

- Gate 0 RED → hard refusal, no cascade runs
- Gate 0 AMBER → cascade runs with warning banner persisted through response
- Gate 0 GREEN → cascade runs normally, citation footer added

Kill Switch rules (metals 50% reduction on DXY+yields adverse) are **advisory** when Gate 0 is AMBER — MICHA flags but Principal judges whether stale state is close enough to current conditions to act. When Gate 0 is GREEN, Kill Switch is authoritative.

## MIGRATION

1. **Today:** This addendum committed. Architecture + schema committed. Claude Code kickoff prompt prepared.
2. **Next session:** Claude Code block builds the three missing pieces (token renewal workflow, snapshotter, Gate 0 enforcer). Smoke-tested end-to-end.
3. **First snapshot lands:** `A2E_Intelligence/STATE/positions_latest.json` populated.
4. **Protocol flip:** METATRON bumped to v10.9 with Gate 0 required. All future PHOENIX sessions gated from that point forward.
5. **Success:** The 2026-04-24 failure mode becomes structurally impossible.

## DEFINITION OF "CLOSED"

This addendum is considered fully in-force when:

- [ ] Token renewal workflow running (n8n, 90-min market-hours cron)
- [ ] Snapshotter running locally (30-min market-hours cron + on-trade hook)
- [ ] `A2E_Intelligence/STATE/positions_latest.json` populating correctly
- [ ] Gate 0 enforcer in `phoenix.session_start` returning correct classifications at three age values (fresh / aged / stale) via unit test
- [ ] End-to-end smoke test passed: snapshot → push → MICHA read → Gate 0 classification → banner
- [ ] METATRON_LATEST_PRIME_DIRECTIVE.md updated to reference this addendum and make Gate 0 required
- [ ] Principal signs off after one full trading day with the gate live

Until the final checkbox, Gate 0 is advisory. After the final checkbox, it is mandatory and non-overridable.

---

**Sign-off:** MICHA · 2026-04-24 · S3d
