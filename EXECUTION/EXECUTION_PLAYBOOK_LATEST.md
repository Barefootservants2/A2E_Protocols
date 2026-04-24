# EXECUTION PLAYBOOK v1.0
**Classification:** A2E Internal · Principal Eyes
**Owner:** MICHA (CIO) on behalf of William Earl Lemon
**Last revised:** 2026-04-24 · S3c (live trading verified via pyetrade/bash on 2026-04-22)

---

## WHY THIS DOC EXISTS

Trading execution has three failure modes that IRONCLAD, HUNTER, and SENTINEL do not directly cover:

1. **Execution path fails mid-order.** API times out, token expires, broker rejects, the n8n workflow breaks at 09:31 ET on a gap-down Monday. The rule is triggered, the decision is made, and the keystroke doesn't land.
2. **Decision vs execution mismatch.** The gate cascade approves a trim. The operator freezes. The price moves two levels before the order reaches the book.
3. **Operator-under-pressure context switching.** IRA rollover, taxable, Roth each have different tax/wash-sale implications. Hot keys on Power E*TRADE don't know which account is active. Tired principal at 03:40 ET on a Shanghai-premium breakout makes account-selection mistakes.

This playbook codifies the **order of operations** so that when the decision is already made, execution is mechanical — not another place to lose money.

---

## PRIMARY: API via pyetrade from bash

### When to use
- Order size > $500
- Decision has > 60 seconds of runway (not a "click it NOW" scalp)
- Outside of 09:30–09:45 ET opening rotation chaos
- Both legs of a multi-leg move (trim + trailing stop adjust)
- Any time you want a verifiable paper trail that lands in Supabase with a timestamp

### Procedure
```bash
# Re-auth daily — tokens expire midnight ET
cd ~/a2e-platform
source .venv/bin/activate
python -m etrade.auth --account {4898|5267|6685|5536}

# Preview order first — ALWAYS
python -m etrade.preview --account 6685 --symbol PSLV --action SELL --qty 230 --price-type LIMIT --limit 26.15

# Review preview output. Confirm:
#  - correct account
#  - correct symbol
#  - correct action (SELL not BUY)
#  - correct quantity (trim = 25% of position, not full)
#  - limit price within bid/ask
#  - estimated commission / regulatory fees
#  - settlement date doesn't trigger wash sale or good-faith violation

# Place only after visual confirm
python -m etrade.place --preview-id {preview_id_from_above}
```

### Sell-Only Guard (already codified)
All production pyetrade wrappers enforce `action in {'SELL', 'SELL_TO_CLOSE'}` at the preview and place layers. **BUY orders are routed through a separate, manually-gated module.** This prevents a typo from opening a new position by accident.

### Post-execution required
1. **BULLSEYE update** — new cushion, new trim ladder, new HH/HL
2. **Sentinel alert check** — did the SELL trigger a Telegram confirmation? If silent within 60s, the workflow is broken — investigate before placing another order.
3. **Supabase log write** — `trades` table, `executed_at`, `method='api'`, `preview_id`, `place_id`
4. **Google Sheets mirror** — for tax-season export

---

## FALLBACK: Manual via Power E*TRADE web or app

### When to use
- API auth has failed twice in a row (likely token issue or IP blocking — this was the exact reason n8n cloud couldn't trade)
- Order urgency is higher than re-auth latency (~30s to get a fresh token)
- Order is for 5536 (Roth IRA — inventory unknown until pulled, don't assume)
- Complex order type that pyetrade doesn't wrap cleanly (spread, conditional, contingent)
- Market is in liquidation-tape mode (VIX +9%+ simultaneous gold down — spreads widen, API latency spikes)

### Procedure
1. Login to Power E*TRADE (use password manager, **never** paste creds in chat)
2. Explicitly switch to the target account from the dropdown — **verify the account number on-screen matches your intent** before placing
3. Use LIMIT orders at current bid+0.01 for sells, ask-0.01 for buys (never MARKET unless the instrument is a major ETF during core hours)
4. Screenshot the order confirmation page — image goes into the session journal
5. Manually log the trade to Supabase via `python -m etrade.log_manual --account … --symbol … --action … --qty … --price … --note "manual: reason"`
6. Tell MICHA in the console: `TRADE LOGGED: SYMBOL ACTION QTY @ PRICE · ACCT · note` so the session record captures it

### Known manual-only situations
- **5536 Roth IRA** — account manifest still unknown as of S3c. Do not attempt API execution on 5536 until the positions have been pulled and the account is mapped in `a2e-platform/etrade/accounts.py`.
- **Any options order** — sell-to-close on LEAPS like 266CVR018 goes through manual until the options wrapper ships.
- **Short-dated SPX / XSP credit spreads** — the current paper-trade discipline runs manual. Do not automate this path until the options learning progression (watch GEX → paper XSP → live XSP → scale SPX) has been cleared at each tier.

---

## DECISION TREE — Which path?

```
                     ┌─────────────────────┐
                     │  Decision is made   │
                     │  (Gate cascade OK)  │
                     └──────────┬──────────┘
                                │
                   ┌────────────┴────────────┐
                   │                         │
            Is it 5536?                 All other accts
             │                              │
             │                              │
            Manual only              Is order > $500 AND
             │                       > 60s runway AND
             │                       outside 09:30-09:45 ET?
             │                              │
             │                   ┌──────────┴──────────┐
             │                   │                     │
             │                  YES                    NO
             │                   │                     │
             │                   │              Small or fast →
             │              API path             Manual preferred
             │                   │                     │
             │         Has API failed twice?           │
             │                   │                     │
             │           ┌───────┴───────┐             │
             │           │               │             │
             │          YES             NO             │
             │           │               │             │
             │      Fall to manual   Execute API       │
             │           │               │             │
             └───────────┴───────┬───────┴─────────────┘
                                 │
                         Post-execution chain:
                      BULLSEYE → Sentinel → Supabase → Sheets
```

---

## KILL SWITCH OVERRIDES EVERYTHING

When METATRON fires Kill Switch (DXY + yields adverse simultaneously, or manual `KILLSWITCH` command), the playbook changes:

1. **All BUY orders halt.** Principal can override only by typing the literal phrase `KILLSWITCH ACKNOWLEDGED — OVERRIDE FOR {symbol} {reason}` in the MICHA console command bar. No implicit override.
2. **Metals positions trim 50% within 4 trading hours.** This is the codified IRONCLAD v3.0 Kill Switch rule — not a suggestion.
3. **No new positions in Rings 2–4.** Ring 1 (VOO anchor) remains untouched.
4. **Post-event review required.** Within 24 hours, the Kill Switch event must be logged with market data snapshot, the decision path, and whether the automated trim executed or required manual intervention.

---

## RESILIENCE CHECKLIST

Before placing any order, mental checklist (30 seconds, out loud is better):

- [ ] Correct account selected? (4898 / 5267 / 5536 / 6685)
- [ ] Correct action? (SELL vs SELL_TO_CLOSE for options)
- [ ] Quantity is the intended fraction? (25% trim = quarter of current holding, not whole)
- [ ] Stop / trailing stop adjustment queued for after fill?
- [ ] BULLSEYE row prepared for update?
- [ ] Time of day acceptable? (Not 09:30-09:45 opening or 15:55-16:00 close unless specifically trading the close)
- [ ] Kill Switch status GREEN?

Skip the checklist, skip the trade. The checklist takes 30 seconds. Losing money on a mistake takes a year to earn back.

---

## CARRY-FORWARD

This playbook is authoritative until the next version. The next version should add:

- **E*TRADE options wrapper** once codified
- **5536 Roth manifest** once pulled
- **BULLSEYE action buttons** once the FastAPI bridge ships (Trim / UpdateStop / Alert / Close)
- **Paper-to-live XSP promotion criteria** once the progression ladder is formalized

— MICHA
