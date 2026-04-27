// SENTINEL EXECUTOR v1.0
// n8n workflow id: FC5twfW84Iqj3f9d  (INACTIVE)
// URL: https://ashes2echoes.app.n8n.cloud/workflow/FC5twfW84Iqj3f9d
//
// Endpoint: POST /webhook/sentinel-execute
// Body: { account_key, mode, allow_buys, decisions[] }
//
// Modes:
//   DRY_RUN — validate + simulate, no eTrade calls
//   LIVE    — actually preview + place orders via OAuth1
//
// Hard safety rules enforced in Validate Request node:
//   1. Any BUY action in any decision payload → REJECTED, regardless of allow_buys
//   2. decisions[].kind must be PLACE_NEW_STOP / MODIFY_STOP_PRICE / 
//      PLACE_TRIM_LADDER / DUMP_POSITION
//   3. decisions[].payload must contain PreviewOrderRequest
//
// 16 nodes:
//   Webhook → Parse → Validate
//     ↓ (validation fail)
//     → Respond (VALIDATION_FAILED)
//     ↓ (validation pass)
//     → Expand Decisions → Mode branch
//       ↓ (DRY_RUN)
//       → Simulate → Aggregate → Respond
//       ↓ (LIVE)
//       → Preview → Check → Branch
//         ↓ (preview pass)
//         → Place → Check → Aggregate → Respond
//         ↓ (preview fail)
//         → Record failure → Aggregate
//
// Credentials needed: eTrade OAuth1 (production) — wire manually in n8n UI
// (existing TOKEN KEEPER + TOKEN EXCHANGE workflows manage the OAuth tokens
// already; this workflow consumes them via the standard oAuth1Api credential)
//
// Used by: sentinel/maintenance.py auto_maintain() builds decisions, then
// calls this workflow's webhook with the decisions array.
//
// See sentinel_executor_workflow.js for full SDK source (regenerate from n8n
// if you need to view or modify the actual node code).

