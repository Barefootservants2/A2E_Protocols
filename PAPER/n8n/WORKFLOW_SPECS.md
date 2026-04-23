# n8n Workflow Specs — PAPER POC Schedule

**Purpose:** All automated cron workflows for the PAPER POC, per `A2E_Protocols/PAPER/PAPER_POC_SPEC_v1.2.md` §6.
**Target commit:** `A2E_Protocols/PAPER/n8n/WORKFLOW_SPECS.md` + JSON template
**Total workflows:** 16 (12 trading-day + 3 crypto + 1 weekly)
**Design principle:** One canonical template, duplicated per cron schedule. Each workflow is independently enable-able so tiers can be toggled without affecting others.

---

## 1. Common architecture (all workflows)

```
[Cron Trigger]
       │
       ▼
[Set node: scheduled_ts, tier, fire_id=UUID]
       │
       ▼
[HTTP Request: call paper API endpoint for this tier]
       │
       ▼
┌──────┴──────┐
│   SUCCESS   │    FAILURE    
▼             ▼
[Log SUCCESS] [Log FAILED + Telegram alert to ⚡ SYSTEM]
       │
       ▼
[Paper DB: INSERT paper_schedule_log]
```

**Every workflow writes to `paper_schedule_log`** per spec §4 schema:
```sql
INSERT INTO paper_schedule_log
  (tier, scheduled_ts, actual_ts, status, duration_ms, error_message)
VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
```

**Missed-fire detection:** If `actual_ts - scheduled_ts > 5 min`, status = `MISSED`, escalates to `⚡ SYSTEM` Telegram topic.

---

## 2. The 16 workflows

All times Eastern unless noted. Cron expressions use n8n standard (minute hour day-of-month month day-of-week, UTC internally).

### 2.1 Trading-day workflows (12, Mon-Fri)

| # | Workflow Name | Tier | Cron (ET) | Cron (UTC) | Purpose | API Endpoint |
|---|---|---|---|---|---|---|
| 1 | `PAPER_OVERNIGHT_00` | OVERNIGHT | 0 0 * * 1-5 | 0 5 * * 1-5 | Global macro, Asia overnight | `POST /paper/scan/overnight` |
| 2 | `PAPER_OVERNIGHT_04` | OVERNIGHT | 0 4 * * 1-5 | 0 9 * * 1-5 | Asia close / Europe open | `POST /paper/scan/overnight` |
| 3 | `PAPER_OVERNIGHT_08` | OVERNIGHT | 0 8 * * 1-5 | 0 13 * * 1-5 | Pre-market gap analysis | `POST /paper/scan/overnight` |
| 4 | `PAPER_PREOPEN_09` | PREOPEN | 0 9 * * 1-5 | 0 14 * * 1-5 | Day thesis, signal queue prep | `POST /paper/scan/preopen` |
| 5 | `PAPER_RTH_10` | RTH_STRUCT | 0 10 * * 1-5 | 0 15 * * 1-5 | Intraday structure check | `POST /paper/scan/rth` |
| 6 | `PAPER_RTH_11` | RTH_STRUCT | 0 11 * * 1-5 | 0 16 * * 1-5 | Intraday structure check | `POST /paper/scan/rth` |
| 7 | `PAPER_RTH_12` | RTH_STRUCT | 0 12 * * 1-5 | 0 17 * * 1-5 | Intraday structure check | `POST /paper/scan/rth` |
| 8 | `PAPER_RTH_13` | RTH_STRUCT | 0 13 * * 1-5 | 0 18 * * 1-5 | Intraday structure check | `POST /paper/scan/rth` |
| 9 | `PAPER_RTH_14` | RTH_STRUCT | 0 14 * * 1-5 | 0 19 * * 1-5 | Intraday structure check | `POST /paper/scan/rth` |
| 10 | `PAPER_RTH_15` | RTH_STRUCT | 0 15 * * 1-5 | 0 20 * * 1-5 | Intraday structure check | `POST /paper/scan/rth` |
| 11 | `PAPER_EOD_1605` | EOD_CLOSE | 5 16 * * 1-5 | 5 21 * * 1-5 | Full snapshot + digest + git commit | `POST /paper/snapshot/eod` |
| 12 | `PAPER_DAILY_STRUCT_1630` | DAILY_STRUCT | 30 16 * * 1-5 | 30 21 * * 1-5 | HH/HL/LH/LL daily close detection | `POST /paper/structure/daily` |

### 2.2 Weekly rollup (1, Fri only)

| # | Workflow Name | Tier | Cron (ET) | Cron (UTC) | Purpose | API Endpoint |
|---|---|---|---|---|---|---|
| 13 | `PAPER_WEEKLY_FRI_1700` | WEEKLY | 0 17 * * 5 | 0 22 * * 5 | Week-over-week aggregation + per-agent scorecard | `POST /paper/rollup/weekly` |

### 2.3 Crypto workflows (3, 24/7)

| # | Workflow Name | Tier | Cron | Purpose | API Endpoint |
|---|---|---|---|---|---|
| 14 | `PAPER_CRYPTO_HOURLY` | CRYPTO_POLL | `0 * * * *` | Hourly spot poll + structure check | `POST /paper/crypto/poll` |
| 15 | `PAPER_CRYPTO_DAILY_CLOSE` | CRYPTO_CLOSE | `0 0 * * *` (UTC) | Daily bar close, snapshot | `POST /paper/crypto/close` |
| 16 | `PAPER_CRYPTO_REBAL_MONTHLY` | CRYPTO_REBAL | `30 13 1 * *` (UTC = 9:30 AM ET 1st of month, approximation) | Monthly top-5 rebalance | `POST /paper/crypto/rebalance` |

**Note on #16:** The "1st trading day of the month at 9:30 AM ET" requires checking for market holidays. The cron fires the 1st of every month; the workflow's first step verifies market is open via `paper_schedule_log` or a holiday calendar lookup, and no-ops (status=MISSED) if closed. The next valid trading day's 9:30 run picks up via a catch-up flag.

---

## 3. Canonical n8n workflow template (JSON)

This template is duplicated 16 times with varying cron expressions, names, and HTTP URLs. The template below is the `PAPER_EOD_1605` variant (fullest payload); simpler variants omit the structure/digest fanout nodes.

```json
{
  "name": "PAPER_EOD_1605",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "5 21 * * 1-5"
            }
          ]
        }
      },
      "id": "cron-trigger",
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            { "name": "tier", "value": "EOD_CLOSE" },
            { "name": "scheduled_ts", "value": "={{$now.toISO()}}" },
            { "name": "fire_id", "value": "={{$guid}}" }
          ]
        }
      },
      "id": "set-context",
      "name": "Set Context",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [440, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{$env.PAPER_API_BASE}}/paper/snapshot/eod",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "X-Fire-ID", "value": "={{$json.fire_id}}" },
            { "name": "X-Scheduled-Ts", "value": "={{$json.scheduled_ts}}" }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            { "name": "tier", "value": "={{$json.tier}}" },
            { "name": "books", "value": "P1,P2,P3,P4,P5" }
          ]
        },
        "options": {
          "timeout": 120000
        }
      },
      "id": "http-paper-api",
      "name": "Call Paper API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [640, 300],
      "continueOnFail": true
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.error !== undefined}}",
              "value2": true
            }
          ]
        }
      },
      "id": "check-error",
      "name": "Check Error",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [840, 300]
    },
    {
      "parameters": {
        "chatId": "={{$env.TELEGRAM_GROUP_ID}}",
        "text": "⚡ SYSTEM · ⚠️ EOD FAILED · {{$json.error}} · fire_id={{$node[\"Set Context\"].json.fire_id}}",
        "additionalFields": {
          "message_thread_id": "={{$env.TELEGRAM_TOPIC_SYSTEM}}"
        }
      },
      "id": "telegram-alert-failure",
      "name": "Telegram: Failure",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.1,
      "position": [1040, 200]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO paper_schedule_log (tier, scheduled_ts, status, error_message) VALUES ('{{$node[\"Set Context\"].json.tier}}', '{{$node[\"Set Context\"].json.scheduled_ts}}', 'FAILED', '{{$json.error}}')"
      },
      "id": "log-failure",
      "name": "DB: Log Failure",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [1040, 400]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO paper_schedule_log (tier, scheduled_ts, status, duration_ms) VALUES ('{{$node[\"Set Context\"].json.tier}}', '{{$node[\"Set Context\"].json.scheduled_ts}}', 'SUCCESS', {{$node[\"Call Paper API\"].json.duration_ms || 0}})"
      },
      "id": "log-success",
      "name": "DB: Log Success",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [1040, 500]
    }
  ],
  "connections": {
    "Schedule": { "main": [[{ "node": "Set Context", "type": "main", "index": 0 }]] },
    "Set Context": { "main": [[{ "node": "Call Paper API", "type": "main", "index": 0 }]] },
    "Call Paper API": { "main": [[{ "node": "Check Error", "type": "main", "index": 0 }]] },
    "Check Error": {
      "main": [
        [{ "node": "Telegram: Failure", "type": "main", "index": 0 }, { "node": "DB: Log Failure", "type": "main", "index": 0 }],
        [{ "node": "DB: Log Success", "type": "main", "index": 0 }]
      ]
    }
  },
  "settings": { "executionOrder": "v1" },
  "active": false,
  "tags": ["paper-poc", "eod"]
}
```

---

## 4. Environment variables required

Set in n8n instance static data:

| Variable | Purpose |
|---|---|
| `PAPER_API_BASE` | Base URL for paper FastAPI service (e.g., `https://a2e-platform.vercel.app/api` or `http://localhost:8000`) |
| `TELEGRAM_GROUP_ID` | Group ID of "A2E Paper POC" |
| `TELEGRAM_TOPIC_MIRROR` | Thread ID for 🪞 MIRROR |
| `TELEGRAM_TOPIC_SMALL` | Thread ID for 🔹 SMALL |
| `TELEGRAM_TOPIC_HIGH` | Thread ID for 🔥 HIGH-RISK |
| `TELEGRAM_TOPIC_CRYPTO` | Thread ID for ₿ CRYPTO |
| `TELEGRAM_TOPIC_STUDY` | Thread ID for 📚 STUDY |
| `TELEGRAM_TOPIC_SYSTEM` | Thread ID for ⚡ SYSTEM |
| `PAPER_DB_HOST` | PostgreSQL host (if moving off SQLite for n8n access) |
| `PAPER_API_AUTH_TOKEN` | Bearer token for paper API auth |

**Note on DB choice:** SQLite works for single-process paper.db, but n8n's postgres node needs network access. **Recommendation:** Expose paper API via FastAPI rather than direct DB access, keep SQLite file local to paper module, and have n8n hit HTTP endpoints. Simpler security model, same audit trail.

---

## 5. Endpoint contract (paper API, FastAPI)

All endpoints return JSON:
```json
{
  "fire_id": "uuid",
  "tier": "EOD_CLOSE",
  "status": "SUCCESS|PARTIAL|FAILED",
  "duration_ms": 1234,
  "result": { ... tier-specific payload ... },
  "error": "optional error message"
}
```

| Endpoint | Method | Purpose | Spec reference |
|---|---|---|---|
| `/paper/scan/overnight` | POST | Fetch macro indicators, run signal screeners, queue pre-open thesis | §6.1 |
| `/paper/scan/preopen` | POST | Run HUNTER + PAI detector, synthesize day thesis, queue signal fires | §6.1 |
| `/paper/scan/rth` | POST | Intraday structure check, stop watch, trim line monitoring | §6.1 |
| `/paper/snapshot/eod` | POST | Full 5-book snapshot, git commit, Telegram digest | §4 schema, §6.1 |
| `/paper/structure/daily` | POST | HH/HL/LH/LL pivot detection on daily close, fire alerts | §2.6 |
| `/paper/rollup/weekly` | POST | Per-book + per-agent weekly aggregation, commit `/weekly/YYYY-WW.md` | §8 |
| `/paper/crypto/poll` | POST | Spot price poll, crypto structure detection | §6.3 |
| `/paper/crypto/close` | POST | Daily close snapshot (00:00 UTC) | §6.3 |
| `/paper/crypto/rebalance` | POST | Top-5 market cap refresh, rebalance if trading day | §6.3 |

---

## 6. Deployment sequence

1. Build FastAPI service at `a2e-platform/paper/api.py` exposing the endpoints in §5 (defers for Session 5+)
2. Deploy service (Vercel serverless or a persistent VM — Vercel free tier works for polling workload)
3. Import `paper_workflow_template.json` (template file to be exported from n8n after prototyping)
4. Duplicate the template 16 times, set cron + name + endpoint per §2 table
5. Configure env vars per §4
6. Enable workflows in staggered fashion: overnight first, then pre-open, then RTH, then EOD. 24-48h burn-in per tier.
7. Telegram topic wiring verified by Principal
8. `paper_schedule_log` monitored for first 48h for MISSED status

---

## 7. Testing strategy

- Local dev: run `paper/api.py` locally with FastAPI, hit endpoints manually with curl
- n8n test: one workflow per tier activated with `active: false → true` toggle, verify single fire, check DB, check Telegram
- Smoke test full day: enable all workflows on a Sunday (no RTH fires), let overnight-only and crypto workflows run, verify `paper_schedule_log` fills correctly
- Pre-production: run Mon-Fri for 2 days on a simulated signal feed before day-0 launch

---

**End WORKFLOW_SPECS — ready for import sequence.**

🔱
