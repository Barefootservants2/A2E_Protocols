# EXECUTION BLOCKER BRIEF — 2026-04-24 post-close
**Context:** Attempted to queue 10 orders Friday night after market close. 2/10 passed, 8/10 rejected with E*TRADE Code 1037 ("not enough available shares for closing order"). E*TRADE API then entered 503 maintenance window before we could finish diagnosis.

## ROOT CAUSE
Pre-existing OPEN stop orders cover the full share count on multiple positions, leaving zero shares available for any new SELL order.

## CONFIRMED BLOCKERS (6685 Rollover IRA)

| Order ID | Symbol | Type | Stop/Trail | Qty | Status |
|---|---|---|---|---|---|
| 359 | AMD | STOP GTC | $284.45 | 40 | OPEN — blocks all AMD sells |
| 364 | GOOGL | STOP GTC | $318.85 | 14 | OPEN — blocks all GOOGL sells |
| 342 | AGIX | TRAILING_STOP_PRCT | (trailing) | 212 | OPEN — blocks all AGIX sells |

## SUSPECTED BLOCKERS (4898, 5267 — 503'd before confirmation)
- **4898 MRVL** — likely has existing stop tying up all 38 shares
- **4898 META** — possibly has stop from T1 hedge
- **5267 GEV** — possibly has stop

## IRONCLAD COMPLIANCE GAP
Existing stops are set too loose per IRONCLAD v3.0 (5% hard stop):
- AMD $284.45 vs current $347.81 = **-18.2% stop** (should be -5% = ~$330)
- GOOGL $318.85 vs current $344.40 = **-7.4% stop** (should be -5% = ~$327)
- AGIX trailing (exact trail % unknown) — needs audit

## MONDAY OPEN SEQUENCE (per ticker, atomic)

**AMD (6685):**
1. Preview + confirm: CANCEL order 359 (old $284.45 stop)
2. Preview + place: SELL LIMIT 10 @ $345 GTC (trim 1, lock gain)
3. Preview + place: SELL STOP 30 @ $330 GTC (new IRONCLAD-compliant stop)
4. Verify: 40 shares accounted for (10 in trim limit + 30 in new stop)

**GOOGL (6685):**
1. Cancel order 364 ($318.85 stop)
2. Place: SELL LIMIT 3 @ $352.41 GTC (trim 1 trigger)
3. Place: SELL STOP 11 @ $327 GTC (new stop on remaining)

**AGIX (6685):**
1. Cancel order 342 (trailing stop)
2. Place: SELL LIMIT 53 @ $39.65 GTC (trim trigger)
3. Place: SELL STOP 159 @ $37.76 GTC (breakeven stop)

**MRVL (4898) — once existing stop confirmed:**
1. Cancel existing (if present)
2. Place: SELL LIMIT 10 @ $163.50 GTC (Trim 1 hit)
3. Place: SELL STOP 28 @ $156.21 GTC (breakeven)

**META (4898):**
1. Confirm if existing stop present (list_orders)
2. Place: SELL STOP 30 @ $641.91 GTC (revise to $629 after T2 fills)

**GEV (5267):**
1. Confirm if existing stop present
2. Place: SELL LIMIT 1 @ $1145 GTC (partial exit, keep 1 runner)

**GLW (5267):**
1. Re-preview (tonight's previews may have expired):
   - SELL LIMIT 5 @ $175 GTC (Trim 1)
   - SELL STOP 15 @ $167 GTC (breakeven)

## API NOTES
- E*TRADE API 503'd during Friday night maintenance (~9 PM ET onward)
- Monday morning API stable during market hours
- Fresh OAuth handshake required Monday (tokens expire midnight ET Friday)
- Use auto-cron or `python -m phoenix.etrade_startup` for fresh tokens

## MONDAY KICKOFF PROMPT
"MICHA. Execute blocker brief from 2026-04-24. Re-auth fresh OAuth, pull open orders on 4898+5267 to confirm MRVL/META/GEV blockers, then run cancel+replace sequence per atomic per-ticker plan. Preview + my confirm per order. Refresh Gate 0 after."
