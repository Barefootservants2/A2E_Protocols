# PHOENIX CLOSE — April 24, 2026
## Session ID: claude.ai/chat/9dac64c8-b772-4799-b6d4-f75013805d26

**Duration:** Full EOD review through live execution
**Principal:** William Earl Lemon
**METATRON:** v10.8 (LATEST pointer pattern)
**Phase:** S3d-FINAL
**Context usage:** Reconstructed retroactively from recent_chats summary (2026-04-26 session)

---

## ACTIONS COMPLETED

- ✅ **OAuth restoration** — Restored E*TRADE OAuth handshake-first pattern at session start. Principal corrected MICHA's drop of the established rule: any session involving E*TRADE checks must begin with token verification; if no valid token, provide authorize URL, receive five-character verifier, complete handshake, then proceed.
- ✅ **Diagnosis: Error 1037** — Root-caused "not enough available shares for closing order" to pre-existing stop orders covering 100% of share positions, leaving zero unencumbered shares for new SELL trim orders.
- ✅ **Pattern lock: 75/25 universal rule** — New IRONCLAD operational rule established: buy shares → immediately set stop on 75% → leave 25% released → trim the 25% at +5% target → reset 75/25 split on remaining position. This is now the standing rule for all new positions and the remediation pattern for all existing 100%-stopped positions.
- ✅ **Pattern lock: trailing-to-fixed exception** — Trailing stops cannot be converted to fixed stops via the modify endpoint (E*TRADE Error 2064). Required path: cancel trailing → place fresh fixed stop. Safe when markets are closed.
- ✅ **Execution: 13 orders queued, 0 failures across 3 accounts** — All orders placed successfully via pyetrade in Claude sandbox after the pattern correction.
- ✅ **Memory updated** — 75/25 IRONCLAD pattern + corrected account manifest (5536 confirmed real Roth IRA, just unfunded) committed to userMemories.

### Order detail by account

**6685 (Rollover IRA) — 6 orders**
- AMD: stop modified 40 → 30 shares @ $330 (tightened from -18% to -5%) + 10-share trim limit @ $345 (+15% locked on AMD's runner)
- GOOGL: 11-share stop @ $327 + 3-share trim @ $352.41 (tightened from -7% to -5%)
- AGIX: trailing stop CANCELED (Error 2064 path) + fresh 159-share fixed stop @ $37.76 breakeven + 53-share trim @ $39.65

**4898 (Taxable) — 5 orders**
- META: T2 BUY $650 × 31 shares (order 1034) **LEFT UNTOUCHED** — preserved
- META: trailing stop canceled + 23-share fixed stop @ $641.91 + 7-share trim @ $709.47 (+5% locked)
- MRVL: stop modified 38 → 28 shares @ $156.14 + 10-share trim @ $163.50

**5267 (Taxable) — 3 orders**
- GEV: existing MARKET_ON_CLOSE 2-share full-exit **LEFT UNTOUCHED** (+$286 locked Monday; below $5K min for trim cascading per DUST rule)
- GLW: 15-share stop @ $167 + 5-share trim @ $175

### Risk math at session close

| Scenario | Net P&L vs entry |
|---|---|
| All stops fire Monday (worst case) | **+$47 still green** |
| All trims fill + 75% runners hold | **+$1,242 locked, runners alive** |

AMD's runner (+$925 over entry at the stop) covers the cost of every other stop firing simultaneously.

## ACTIONS PENDING

- ⏳ **Monday open watch** — Auto-cron Gate 0 at 9:30 ET. Expected fills at open: MRVL trim (closed >$163.50), GLW trim (closed >$175), AMD trim likely (opens near $347, limit $345).
- ⏳ **META T2 contingency** — If META T2 fills on a dip, bump stop from $641.91 to $629 (5% below new blended $662.50).
- ✅ **phoenix/ingest.py — RESOLVED** (built and pushed in 2026-04-22 session, chat `18a496af`, commits `92258fc2` and `575d31a0`, 42 tests passing). Was incorrectly listed as pending in earlier draft of this carryforward; corrected during 2026-04-26 PHOENIX RESUME.

## DECISIONS MADE

- **75/25 IRONCLAD rule is now universal** — applies to all new positions and remediates all existing 100%-locked positions
- **Stop modification order**: ALWAYS modify in place (reduce qty 100% → 75%) rather than cancel+replace; cancel+replace exposes the position to gap risk between cancel and replace fills
- **Trailing-to-fixed conversion**: cancel + place fresh fixed stop, ONLY safe during market closed hours
- **GEV exception**: MARKET_ON_CLOSE 2-share full exit is IRONCLAD-correct because position is below $5K DUST minimum for proper trim fractionation
- **5536 Roth IRA** confirmed real account, just unfunded (corrected manifest)

## DOCUMENTS PRODUCED

| Document | Location | Status |
|----------|----------|--------|
| PHOENIX CLOSE — 2026-04-24 (E*TRADE 75/25 universal) | A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_2026-04-24.md | pushing now |
| LATEST pointer | A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md | pushing now |

## GITHUB STATUS

### Files pushed (this carryforward push)
- A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_2026-04-24.md
- A2E_Protocols/PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md (overwrite)

### Files pending
- a2e-platform/phoenix/ingest.py (next session, P2 data path)

## TOOL KNOWLEDGE CAPTURED

### pyetrade OAuth in Claude sandbox

The Python OAuth object does not persist between bash executions in the sandbox. Working flow:

1. Use `pyetrade.ETradeOAuth` → `get_request_token()` → returns authorize URL
2. **Immediately** persist `resource_owner_key` and `resource_owner_secret` from `oauth.session._client.client` to `/home/claude/_etrade_oauth_state.json`
3. After Principal returns the verifier, reconstruct the session via `OAuth1Session` from `requests_oauthlib` using the saved key/secret
4. Call `fetch_access_token("https://api.etrade.com/oauth/access_token")` directly on the reconstructed `OAuth1Session`
5. Verifier codes are **single-use** — re-pasting a consumed verifier does nothing; need fresh authorize URL + new verifier

### pyetrade order method quirks

- `preview_equity_order` and `place_equity_order`: require `accountIdKey` as kwarg (not positional) AND require `allOrNone=False` explicitly
- `change_preview_equity_order`: takes `account_id_key` and `order_id` as first two **positional** args AND **also** requires `accountIdKey` repeated in **kwargs** (internal `check_order` validator quirk)
- `place_changed_equity_order`: requires `accountIdKey`, `orderId`, and `previewId` all as kwargs
- `cancel_order`: standard kwarg pattern, no quirks observed in this session

### Error codes encountered

| Code | Meaning | Resolution |
|---|---|---|
| 1037 | Not enough available shares for closing order | Modify existing stops 100% → 75% to release shares; do NOT cancel + replace |
| 2064 | Cannot modify trailing stop to fixed stop | Cancel the trailing order + place fresh fixed stop; safe only when market closed |

## ANOMALIES ON WATCH

1. **GitHub token expiry** — current PAT (stored in Claude memory; redacted here) expires Jul 3, 2026. Rotation still recommended. Carried over from 2026-04-21 close.
2. **Carryforward gap (now closed by this file)** — 2026-04-24 session was not closed to LATEST in real time. Detected by 2026-04-26 PHOENIX RESUME against recent_chats. Pattern: end-of-session PHOENIX close discipline must NOT be skipped, especially after live-execution sessions where operational learnings are highest.
3. **CIO drift** — MICHA initially deflected toward Power E*TRADE manual workaround instead of solving the API path. Principal corrected. Re-anchor: when API blocks, diagnose the block, do not route around the API.

## NEXT SESSION PRIORITY

**(1) Monday open watch (9:30 ET, 2026-04-27)** — Verify expected trim fills (MRVL, GLW, AMD). If META T2 fires on dip, execute the stop bump to $629.

**(2) Carryforward gap audit** — 2026-04-22 session also never closed to LATEST despite shipping phoenix/ingest.py + tests. Push retroactive PHOENIX_CARRYFORWARD_2026-04-22.md so the build trail is complete.

**(3) Optional: ingest.py enhancement** — A 2026-04-26 build attempt produced a defensive variant with zip/directory/wrapper-key support and IngestResult error collection. Existing module lacks these; enhancement could be merged in if useful. Existing module's strengths (markdown rendering, GitHub archive layer, transcript slugging) must be preserved.

## RESTART PROMPT

```
MICHA LATEST + PHOENIX. Pick up from PHOENIX_CARRYFORWARD_2026-04-24.md.
Account state: all positions IRONCLAD-compliant under 75/25 rule.
13 orders queued for Monday 2026-04-27 open across 6685, 4898, 5267.
Watch: MRVL/GLW/AMD trims at open. META T2 contingency stop bump if fills.
Open audit item: 2026-04-22 carryforward (ingest.py build) was never pushed to LATEST.
```

---

🔱 **PHOENIX CLOSED RETROACTIVELY.** Baseline integrity restored.
