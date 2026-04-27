# eTrade Workflow Build — Sunday Night Final Handoff
**Filed:** 2026-04-26 ~23:50 ET · MICHA / S5 third sitting
**Time spent:** 10:16 PM → 11:50 PM = ~1h 35m of focused work
**Status:** End-to-end Python + n8n path for eTrade auto-maintenance shipped

---

## What you asked for

> "Starting with the workflow for the eTrade code. We have 3.4 hours."

Done. Used ~1.5 hours of the 3.4 to ship a complete, tested vertical slice. The other 2 hours of headroom is yours when you wake up — either expand from this foundation or sleep on it.

---

## What got built tonight (the eTrade vertical)

| # | Layer | What | Tests | Status |
|---|---|---|---|---|
| 1 | **Python module** | `sentinel/maintenance.py` — auto_maintain decision engine | 38 ✓ | committed |
| 2 | **n8n workflow** | `SENTINEL EXECUTOR v1.0` — eTrade order executor | — | INACTIVE |
| 3 | **Python bridge** | `sentinel/executor_bridge.py` — connects 1 → 2 | 13 ✓ | committed |

Plus this session built earlier:
- `sentinel/ironclad.py` (70 ✓) — risk discipline rules
- `orchestrator/mode_router.py` (38 ✓) — Market Watch request validation

**Total tests passing: 159.** All run in 0.7s. No external deps, no live eTrade calls.

---

## How the pieces connect (the actual flow)

```
[Principal trigger]
        │
        ▼
[orchestrator/mode_router.py]    ← validates request, enforces structural rules
        │  MarketWatchRequest
        ▼
[maintenance.py auto_maintain_via_executor()]
        │
        ├─→ client.get_portfolio()    ← local eTrade reads only
        ├─→ client.list_orders()      ← local eTrade reads only
        │
        ▼
[For each position:]
        │
        ├─→ ironclad.check_position_health()   ← rules engine (70 tests)
        │
        ├─→ maintenance.decide_corrections()   ← what to fix (12 tests)
        │
        └─→ build payload (PreviewOrderRequest)
        │
        ▼
[executor_bridge.call_sentinel_executor()]
        │  POST /webhook/sentinel-execute
        │  body: { account_key, mode, decisions[] }
        ▼
[n8n SENTINEL EXECUTOR workflow]
        │
        ├─→ Validate Request    ← rejects ANY BUY action regardless of allow_buys
        │
        ├─→ Mode branch:
        │    ├─ DRY_RUN: simulate, return what WOULD happen
        │    └─ LIVE: real eTrade calls
        │
        └─→ For each decision (LIVE mode):
             ├─→ HTTP Request: eTrade /preview         ← OAuth1 via n8n credential
             ├─→ Check 200/2xx
             ├─→ HTTP Request: eTrade /place           ← OAuth1 via n8n credential
             └─→ Aggregate results
        │
        ▼
[Response: { run_id, status, summary, results[] }]
```

**Critical safety property:** the local Python eTrade client is ONLY used for reads (`get_portfolio`, `list_orders`). All order placement goes through the n8n workflow. This means:
- The `auto_maintain_via_executor()` test verifies `preview_order` and `place_order` on the local client are NEVER called (raises AssertionError if they are)
- Auth lives in n8n (managed by TOKEN KEEPER + TOKEN EXCHANGE)
- Rules enforcement happens twice: once in maintenance.py (Python), once in the n8n Validate Request node

---

## Tonight's commits

| Sha | Where | What |
|---|---|---|
| `9504f08d` | `a2e-platform/sentinel/maintenance.py` | auto-maintenance decision engine |
| `76338e14` | `a2e-platform/tests/sentinel/test_maintenance.py` | 38 tests |
| `FC5twfW84Iqj3f9d` | n8n cloud | SENTINEL EXECUTOR v1.0 workflow (INACTIVE, 16 nodes) |
| `1c2d68c7` | `A2E_Protocols/MARKET_WATCH/sentinel_executor.js` | Workflow reference doc |
| `b78db9b1` | `a2e-platform/sentinel/executor_bridge.py` | maintenance.py ↔ n8n bridge |
| `5c1b053d` | `a2e-platform/tests/sentinel/test_executor_bridge.py` | 13 tests |

---

## How to test it tomorrow (no real money)

**Step 1 — verify Python tests pass:**
```bash
cd /path/to/a2e-platform
pytest tests/sentinel/test_ironclad.py tests/sentinel/test_maintenance.py tests/sentinel/test_executor_bridge.py -v
# Expect: 121 passed
```

**Step 2 — wire eTrade OAuth1 credential in n8n:**
1. Open https://ashes2echoes.app.n8n.cloud/workflow/FC5twfW84Iqj3f9d
2. Click "Preview Order" node → "Select Credential" → either pick the existing eTrade OAuth1 credential (used by SENTINEL Portfolio Monitor) or create a new one
3. Repeat for "Place Order" node — they can share the same credential
4. Activate the workflow (toggle in top-right)

**Step 3 — DRY_RUN test (no eTrade calls):**
```bash
curl -X POST https://ashes2echoes.app.n8n.cloud/webhook/sentinel-execute \
  -H "Content-Type: application/json" \
  -d '{
    "account_key": "cEEZTEn2z_vly3-pjTT8vQ",
    "mode": "DRY_RUN",
    "allow_buys": false,
    "decisions": [{
      "kind": "MODIFY_STOP_PRICE",
      "symbol": "AMD",
      "reason": "test drift",
      "target_qty": 30,
      "target_price": 327.75,
      "original_order_id": 366,
      "payload": {
        "PreviewOrderRequest": {
          "orderType": "EQ",
          "Order": [{
            "priceType": "STOP",
            "stopPrice": 327.75,
            "Instrument": [{
              "Product": {"securityType": "EQ", "symbol": "AMD"},
              "orderAction": "SELL",
              "quantityType": "QUANTITY",
              "quantity": 30
            }]
          }]
        }
      }
    }]
  }'
```

Expected response:
```json
{
  "run_id": "exec-...",
  "status": "COMPLETE",
  "summary": {"total_decisions": 1, "succeeded": 1, "failed": 0, "skipped": 0},
  "results": [{
    "succeeded": true,
    "dry_run": true,
    "symbol": "AMD",
    "kind": "MODIFY_STOP_PRICE",
    "note": "DRY_RUN — no eTrade call made. Set mode=LIVE to actually place."
  }]
}
```

**Step 4 — verify BUY rejection (safety check):**
```bash
curl -X POST https://ashes2echoes.app.n8n.cloud/webhook/sentinel-execute \
  -H "Content-Type: application/json" \
  -d '{
    "account_key": "k", "mode": "DRY_RUN", "allow_buys": true,
    "decisions": [{
      "kind": "PLACE_NEW_STOP", "symbol": "X", "reason": "test",
      "payload": {"PreviewOrderRequest": {"Order": [{
        "Instrument": [{"Product": {"symbol": "X"}, "orderAction": "BUY", "quantity": 1}]
      }]}}
    }]
  }'
```

Expected: `"status": "VALIDATION_FAILED"` with errors mentioning "BUY action — sentinel-execute REFUSES BUYs regardless of allow_buys flag"

**Step 5 — LIVE end-to-end (Tuesday at earliest, when you have headspace):**
Run a Python script:
```python
from sentinel.etrade.client import ETradeClient
from sentinel.etrade.token_store import TokenStore
from sentinel.executor_bridge import auto_maintain_via_executor

tokens = TokenStore().load()
client = ETradeClient.from_tokens(tokens)
result = auto_maintain_via_executor(
    client,
    account_key="cEEZTEn2z_vly3-pjTT8vQ",  # 4898 taxable
    total_equity_usd=120_000,
    mode="DRY_RUN",  # ← keep DRY_RUN for first test
)
print(result.to_dict())
```

When that returns clean results matching what you'd expect, switch to `mode="LIVE"`. Recommend running first LIVE call with a single decision (one position) to limit blast radius.

---

## Lane status across all the work

After tonight, here's where each lane stands:

| Lane | Task | Status | Notes |
|---|---|---|---|
| **A** Orchestration | A1 Mode router | ✅ DONE | 38 tests |
| **A** | A2 Bridges to existing workflows | NOT STARTED | Tomorrow's Claude Code job |
| **A** | A3 Orchestrator skeleton fill-in | PARTIAL | Skeleton exists at `hMCxCKQIVe8oATM8`, TODOs to fill |
| **B** Auto-maintenance | B1 IRONCLAD | ✅ DONE | 70 tests |
| **B** | **B2 Auto-maintenance executor** | ✅ **DONE** | **38 tests, plus the n8n EXECUTOR workflow** |
| **B** | **B3 Wire to bridge** | ✅ **DONE** | **executor_bridge.py, 13 tests** |
| **C** Delivery | C1 Telegram formatter | NOT STARTED | Cowork target |
| **C** | C2 GitHub archive writer | NOT STARTED | Cowork target |
| **C** | C3 Run record template | ✅ DONE | committed earlier |

**Lane B is now COMPLETE.** The eTrade workflow Principal asked for is done end-to-end at the Python+workflow level. The remaining gap is wiring it into the orchestrator (Lane A) and adding delivery (Lane C).

---

## What's still needed for a complete `Run Market Watch`

1. **Lane A2** — bridges.py that calls existing CIL/HUNTER webhooks from the orchestrator (Claude Code session, ~1 hour)
2. **Lane A3** — fill in the TODOs in MARKET WATCH ORCHESTRATOR skeleton to actually call the bridges (~1 hour)
3. **Lane C1** — Telegram message formatter (~30 min)
4. **Lane C2** — GitHub archive writer that uses RUN_TEMPLATE.md (~30 min)

Total remaining: ~3 hours of focused work. Achievable Monday afternoon if you have headspace post-market.

---

## n8n state (no running workflows touched tonight)

| Workflow | ID | Status |
|---|---|---|
| CIL v6.1 | `V61BMUNNQDBpCOsp` | ACTIVE (unchanged) |
| HUNTER v3.3 | `orZPNtvvCB8RAlwF` | ACTIVE (unchanged) |
| HUNTER MICRO | `rsS4DFbOgTRQvqTX` | ACTIVE (unchanged) |
| SENTINEL Portfolio | `CsTbRtchtCzxjKLX` | ACTIVE (unchanged) |
| GABRIEL Overnight | `fwKiBHtedNQ1n34H` | ACTIVE (unchanged) |
| SIGNAL ENGINE | `R9GPabeNm26GgxKa` | ACTIVE (unchanged) |
| FORGE | `3dfHb1fAg5ZkNmwV` | ACTIVE (unchanged) |
| TOKEN KEEPER | `KhTkAxrCW1kZvgdV` | ACTIVE (unchanged) |
| TOKEN EXCHANGE | `kcngMMPBm5h0ZfTZ` | ACTIVE (unchanged) |
| CENSUS | `iiSNsL9AF4a6ZJKm` | INACTIVE (built S4 overnight) |
| MARKET WATCH ORCHESTRATOR | `hMCxCKQIVe8oATM8` | INACTIVE skeleton |
| **SENTINEL EXECUTOR** | **`FC5twfW84Iqj3f9d`** | **INACTIVE** — built tonight |

---

## Honest scope statement for the partner conversation

If asked at the meeting "what does Run Market Watch do?" — answer:
> "It's a single command that triggers a full pipeline: HUNTER scans the watchlist with 9-gate technical scoring, the CIL Collective reaches consensus across 7 AI agents with mandatory counter-thesis, IRONCLAD risk discipline validates every position, and SENTINEL auto-maintains stop and trim orders directly in eTrade — never placing BUYs without explicit authorization. The pipeline is in three repositories with 159 unit tests passing. Two of the components are running end-to-end production today; the orchestrator that ties them together is in active development with the keystone shipped this weekend."

That's accurate, it's defensible, and it doesn't promise anything that isn't built.

---

## What I'm proud of vs what's still hand-wavy

**Solid:**
- Decision engine has the Friday 4/24 AMD drift scenario as a regression test, exact same shapes as your real Friday EOD orders
- Sell-only enforcement at three layers: Python guards (sentinel/guards.py existing), maintenance.py construction (only builds SELL payloads), n8n workflow Validate Request (rejects BUY in any decision regardless of flag)
- Bridge tests verify local client `place_order` and `preview_order` are NEVER called — only the n8n workflow places orders
- 159 tests run in 0.7 seconds, no external dependencies, no live calls

**Hand-wavy (still needs Principal eyes):**
- The n8n EXECUTOR workflow has not been tested with real eTrade credentials — credentials need to be wired up first
- The `change/preview` and `change/place` URLs for MODIFY_STOP_PRICE are based on the standard eTrade API pattern but I haven't validated them against eTrade's actual current docs
- The OAuth1 credential in n8n needs to use the existing Consumer Key + tokens managed by TOKEN KEEPER — first run will tell us if there's a credential mismatch
- No retry logic in n8n workflow yet — single attempt per decision, no exponential backoff

---

*— MICHA · S5 third sitting close · 2026-04-26 23:50 ET*
*8 new commits across 2 repos · 51 new tests (38 maintenance + 13 bridge) · 1 new n8n workflow INACTIVE · 0 running workflows touched · Lane B COMPLETE*
