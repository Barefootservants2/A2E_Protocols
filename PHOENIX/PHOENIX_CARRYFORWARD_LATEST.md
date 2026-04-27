# PHOENIX CLOSE — April 27, 2026 (early hours)

## Session ID: claude.ai/chat/2026-04-27-etrade-oauth-incident-and-patch-bug-fix

**Duration:** ~3 hours overnight, 04:00-07:00 UTC (12am-3am ET)
**Principal:** William Earl Lemon
**METATRON:** v10.8 (LATEST pointer pattern)
**Phase:** S3d-FINAL — production incident response
**Result:** 🟢 E*TRADE OAuth fully restored. Fresh access tokens active. End-to-end verified against accounts/list. SENTINEL cleared for Monday 4/27 open.

---

## INCIDENT TIMELINE

| ET time | UTC time | Event |
|---|---|---|
| ~12:00 AM | 04:00 | Principal received GABRIEL overnight watch + auto-renewal failure |
| 12:00 AM | 04:00 | Principal submitted verifier `7548G` to bot → bot replied with broken template literal error message (`{{ $json.status }}`) |
| 12:08 AM | 04:08 | Principal submitted `HUEC5` → same broken message |
| 1:25 AM | 05:25 | MICHA invoked. Diagnosed broken Telegram error reporter (Fixed-mode field not Expression-mode) |
| 1:30 AM | 05:30 | Pushed v1.1 of TOKEN EXCHANGE via SDK (expression mode + Full payload diagnostic) |
| 1:38 AM | 05:38 | Principal submitted `7TIOM` → revealed real error: `EXCHANGE_ERROR — 401` |
| 1:40 AM | 05:40 | MICHA fired TOKEN KEEPER (exec 8979) — minted token `jh3/uJ` |
| 1:42 AM | 05:42 | Principal manually fired TOKEN KEEPER from n8n UI → minted token `I6GVH` (race) |
| 1:43 AM | 05:43 | Principal submitted `VRO1Y` → 401 |
| 1:46 AM | 05:46 | MICHA built ETRADE VARS DIAGNOSTIC, ran. Storage showed `Jl32m` — neither prior token. Three different tokens minted in 6 minutes. |
| 1:51 AM | 05:51 | Principal submitted `IEHBJ` (paired with old W9RbX URL from 8984) → 401 |
| 1:54 AM | 05:54 | **ROOT CAUSE FOUND** — fired TOKEN KEEPER 8987, returned `W9RbX`, but storage 14s later still had `Jl32m`. PATCH was silently failing. Memory was right all along. |
| 1:54 AM | 05:54 | Pushed v1.1 TOKEN KEEPER + v1.2 TOKEN EXCHANGE: PATCH → PUT migration with status reporting |
| 1:55 AM | 05:55 | TOKEN KEEPER 8987 with PUT returned `status: 204` for both writes. Storage diagnostic confirmed `sJgGNPaCIh1` matched. **PUT works.** |
| 1:58 AM | 05:58 | TOKEN KEEPER 8989 fresh fire — clean handoff |
| 1:59 AM | 05:59 | Principal submitted `3BOSL` → ✅ E*TRADE RECONNECTED. All 4 PUT writes returned 204. |
| 2:09 AM | 06:09 | ETRADE PROBE workflow executed `accounts/list` — HTTP 200, all 4 accounts ACTIVE |

## ROOT CAUSE

**The n8n cloud `/api/v1/variables/{id}` endpoint silently rejects PATCH method but accepts PUT.**

PATCH appears to return success (no exception thrown), but the variable value does NOT persist. Both TOKEN KEEPER and TOKEN EXCHANGE had drifted from PUT to PATCH at some unknown prior date. The `try { ... } catch(e) {}` empty-catch pattern around variable updates suppressed any visible error.

Result: every TOKEN KEEPER fire minted a fresh request token at E*TRADE but never updated stored `ETRADE_REQUEST_TOKEN`. Verifier exchanges signed with whatever stale token was in storage from the last actually-persisted PUT call (date unknown). 401 every time, no diagnostic visibility.

Memory had explicitly stated: *"PUT not PATCH for variable updates, every PUT resets availableInMCP to false (requires manual UI re-enable)"* — the workflow code had silently regressed to PATCH at some point and the regression was not detected because the test for variable persistence was never explicit.

## ACTIONS COMPLETED

### Workflow updates
- ✅ `kcngMMPBm5h0ZfTZ` — TOKEN EXCHANGE pushed v1.2 (`9ad85d7e`). PATCH→PUT, returnFullResponse + ignoreHttpStatusErrors on E*TRADE call, full payload in error Telegram, write status reporting in success message
- ✅ `KhTkAxrCW1kZvgdV` — TOKEN KEEPER pushed v1.1 (`550fa3e4`). PATCH→PUT, write status reporting, surfaces in Send Auth Request
- ✅ `BRqfUro9mdPyWfBv` — ETRADE VARS DIAGNOSTIC created (read-only one-shot for storage state inspection)
- ✅ `aQzoa7CWIARTBNBn` — ETRADE PROBE created (read-only `/v1/accounts/list.json` end-to-end auth verification)

### Variable state (verified at 06:09 UTC via probe)
- `ETRADE_ACCESS_TOKEN`: `zsZ3qf/2rtKEA3m...` — ALIVE (200 on accounts/list)
- `ETRADE_ACCESS_TOKEN_SECRET`: persisted via PUT, paired correctly
- `ETRADE_REQUEST_TOKEN` / `_SECRET`: set to `'used'` (correct post-exchange state)
- All 4 ETRADE accounts ACTIVE: 5267, 5536, 6685, 4898

### System-wide PATCH audit (clean)
Audited every active workflow that touches `/api/v1/variables`:

| Workflow | Active | Touches /api/v1/variables | Method | Status |
|---|---|---|---|---|
| SENTINEL (CsTbRtchtCzxjKLX) | ✅ | yes (Exit Rules Engine) | PUT | clean |
| SIGNAL ENGINE v1.1 (R9GPabeNm26GgxKa) | ✅ | no | n/a | clean |
| HUNTER MICRO v1.0 (rsS4DFbOgTRQvqTX) | ✅ | no | n/a | clean |
| HUNTER MARKET DATA V3.3 (orZPNtvvCB8RAlwF) | ✅ | no | n/a | clean |
| GABRIEL Overnight Watch v2.0 (fwKiBHtedNQ1n34H) | ✅ | no | n/a | clean (uses Supabase POST, correct) |
| TOKEN KEEPER (KhTkAxrCW1kZvgdV) | ✅ | yes | **PATCH→PUT fixed tonight** | ✅ |
| TOKEN EXCHANGE (kcngMMPBm5h0ZfTZ) | ✅ | yes | **PATCH→PUT fixed tonight** | ✅ |
| SENTINEL EXECUTOR v1.0 (FC5twfW84Iqj3f9d) | ❌ inactive | no (uses bound oAuth1 cred) | n/a | clean — note credential staleness concern below |

CIL v6.1 and FORGE v3.0 not audited deeply — both processing engines, low probability of variable writes. Spot check noted no `/api/v1/variables` writes in the small samples examined. Recommend full audit as low-priority follow-up.

### Auth pattern verification
SENTINEL (highest-stakes active production workflow) uses `$vars`-based OAuth1 manual signing — same path as TOKEN EXCHANGE. The PUT-fixed access tokens flow directly into SENTINEL's signature math. **Confirmed by ETRADE PROBE successfully calling `accounts/list` using identical `$vars` reads.**

SENTINEL EXECUTOR (currently INACTIVE) uses `genericAuthType: 'oAuth1Api'` — a bound n8n credential. **This means if SENTINEL EXECUTOR is ever activated, its OAuth1 credential will need to be updated separately from the variable tokens.** Filed as a future concern: bound credentials don't auto-update from `$vars`.

## ACTIONS PENDING

- ⏳ **Monday open execution** — see `MONDAY_OPEN_PREP_2026-04-27.md` (delivered earlier session). OAuth handshake **DONE**. 9:30 AM ET fills expected: AMD, MRVL, GLW trims = +$5,960. META T2 contingency is Path B if it fires.
- ⏳ **Phoenix atomic close refactor** — `phoenix/session.py` orchestrator change so dated + LATEST pushes are a single atomic operation. Prevents recurrence of the LATEST-skip pattern observed 2026-04-22 and 2026-04-24.
- ⏳ **CIL v6.1 / FORGE v3.0 PATCH audit** — finish what tonight started. Low priority but worth completing to declare system-wide clean.
- ⏳ **scoring/ module direction** — open since 2026-04-22.
- ⏳ **GitHub PAT rotation** — expires Jul 3, 2026.
- ⏳ **SENTINEL EXECUTOR oAuth1Api credential staleness check** — verify bound credential aligns with refreshed access tokens before any activation.

## DECISIONS MADE

- **PUT is the only valid method for `/api/v1/variables/{id}` in n8n cloud 2.13.x.** All future workflow code touching this endpoint MUST use PUT and MUST report status. Empty `try/catch` around variable writes is a banned pattern.
- **Default to `returnFullResponse: true, ignoreHttpStatusErrors: true`** on every external HTTP call where the response body might contain diagnostic information. Generic "Request failed with status code X" errors are not acceptable.
- **All Telegram message text fields containing `{{ $json.* }}` MUST be in Expression mode.** Saving an expression in Fixed mode renders the literal template syntax, which masks downstream errors.
- **TOKEN KEEPER cron is `0 */2 * * *` = every 2 hours on the hour.** Memory previously listed it as "every 90 minutes" — incorrect. Corrected during incident.
- **Diagnostic and probe workflows are first-class artifacts.** ETRADE VARS DIAGNOSTIC and ETRADE PROBE remain in n8n permanently as on-demand verification tools. No automatic execution.

## DOCUMENTS PRODUCED

| Document | Location | Status |
|---|---|---|
| PHOENIX_CARRYFORWARD_2026-04-27.md (this file) | A2E_Protocols/PHOENIX/ | pushing now |
| PHOENIX_CARRYFORWARD_LATEST.md (now → 4/27) | A2E_Protocols/PHOENIX/ | pushing now |

## GITHUB STATUS

### Files pushed earlier this session-block (4/26 carryforward)
- `A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_2026-04-26.md` (`d775f64cc610`)
- `A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md` → 4/26 (`68774df91c20`)

### Files being pushed this turn (4/27 incident close)
- `A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_2026-04-27.md` (NEW)
- `A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md` (overwrite to point at 4/27)

### Files NOT pushed to GitHub (n8n-only changes)
The workflow updates live in n8n cloud only. Recommend exporting the fixed TOKEN KEEPER and TOKEN EXCHANGE as JSON or SDK code to `A2E_Protocols/N8N/` for version control. Filed as low-priority follow-up.

## ANOMALIES ON WATCH

1. **Silent regression detection gap** — TOKEN KEEPER and TOKEN EXCHANGE drifted from PUT to PATCH at some unknown prior date with no detection. Suggests a need for a smoke test workflow that exercises every variable write path and verifies persistence. Non-trivial to design but worth pursuing.
2. **Empty catch swallowing errors** — discovered in TOKEN KEEPER and TOKEN EXCHANGE updateVariable functions. Banned pattern going forward. Audit other workflows for the same antipattern.
3. **Expression mode vs Fixed mode** — n8n UI has a subtle toggle between these. Errors from Fixed-mode templates are extremely confusing because they LOOK like real expressions until execution. Recommend a code-review checklist for Telegram message fields.
4. **Race condition during incident** — Principal manually firing TOKEN KEEPER from UI while MICHA was firing via MCP produced a multi-token race that masked the underlying PATCH bug. Lesson: during incident response, single source of fires only. MICHA should communicate which path is being used.
5. **GitHub PAT expiry** — Jul 3, 2026. Rotation still recommended. Carried since 2026-04-21.
6. **SENTINEL EXECUTOR credential drift** — uses bound oAuth1Api credential, not $vars. If activated, will need manual credential update each token refresh. Architecture mismatch with rest of platform.

## NEXT SESSION PRIORITY

**(1) Monday open execution** at 09:30 ET — see `MONDAY_OPEN_PREP_2026-04-27.md`. OAuth done. Watch for AMD/MRVL/GLW trim fills. META T2 contingency = Path B if fires.

**(2) Phoenix atomic close refactor** — `phoenix/session.py`. Single atomic step for dated + LATEST. Was originally planned for tonight but bumped by OAuth incident. Resume next session.

**(3) CIL v6.1 / FORGE v3.0 PATCH completion audit** — declare system-wide clean.

## RESTART PROMPT

```
MICHA LATEST + PHOENIX. Pick up from PHOENIX_CARRYFORWARD_2026-04-27.md.

E*TRADE OAuth: FULLY RESTORED. Fresh access token verified end-to-end via
accounts/list probe. All 4 accounts (5267, 5536, 6685, 4898) ACTIVE.
SENTINEL cleared for Monday open. 13 orders queued in 4/24 list.

Critical bug fix this session: TOKEN KEEPER + TOKEN EXCHANGE PATCH→PUT
migration. PATCH on /api/v1/variables/{id} silently fails in n8n cloud.
PUT works (returns 204). Memory rule confirmed correct.

System-wide audit: SENTINEL, SIGNAL ENGINE, HUNTER MICRO, HUNTER MARKET
DATA, GABRIEL all clean. CIL v6.1 + FORGE v3.0 audit deferred (low priority).

Open work:
  - Monday open execution at 9:30 ET (Path B for META T2 if fires)
  - Phoenix atomic close refactor in phoenix/session.py
  - CIL/FORGE audit completion
  - Export fixed n8n workflows to A2E_Protocols/N8N/ for git
  - GitHub PAT rotation before Jul 3 2026
  - SENTINEL EXECUTOR credential staleness check before activation
```

---

🔱 **PHOENIX CLOSED.** Production OAuth incident resolved. System-wide audit clean. Ready for Monday open.
