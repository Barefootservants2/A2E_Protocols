# PHOENIX RESTART — April 13, 2026 (Session 3)
## SESSION ID: MICHA-2026-0413-SE-DEPLOY-FORGE

═══════════════════════════════════════
## COMPLETED THIS SESSION
═══════════════════════════════════════

### 1. SIGNAL ENGINE v1.1 — REBUILT, TESTED, DEPLOYED TO PRODUCTION
- Workflow ID: **R9GPabeNm26GgxKa**
- URL: https://ashes2echoes.app.n8n.cloud/workflow/R9GPabeNm26GgxKa
- 12 nodes: Schedule + Manual + Fan Out + 5 HTTP Request + Merge + Score Engine + Formatter + Telegram
- Schedule: 6:30 AM ET Mon-Fri (cron: 30 10 * * 1-5)
- **PUBLISHED AND ACTIVE** — first automated run Tuesday April 14 at 6:30 AM
- Architecture: ALL API calls use HTTP Request nodes. ZERO fetch() Code nodes. Code nodes only do processing/formatting.

### 2. Two Bugs Fixed
- **Scoring bug:** UW API returns `type: "call"` / `type: "put"`, code was checking `put_call`. Fixed. Now correctly shows "36 calls / 14 puts of 50 alerts"
- **Telegram chatId bug:** Was using `7575518437` (wrong). Corrected to `8203545338` (from working v1.0 published version). Telegram delivery confirmed, message_id 3645.

### 3. Execution Proof
- 5/5 feeds GREEN: UW 176ms, FRED DXY 344ms, FRED VIX 624ms, FRED 10Y 197ms, EIA 1,599ms
- Total execution: 4.6 seconds
- Score Engine output: DXY 120.6565 (BEARISH), VIX 19.23 (NEUTRAL), 10Y 4.29% (MODERATE), Crude Inv 878.0M bbl (DATA), Options Flow 72% calls (BULLISH), Overall NEUTRAL

### 4. Workflow Cleanup
- 4x orphaned SIGNAL ENGINE v1.0 workflows ARCHIVED (zE0HeqpZNUMRoKsp, Ts0xnUCnaLwbEXeK, CIqBtOQiWCyN0Uky, G4mrmnbJyC3qcQ9k)
- 1x SE HTTP Test workflow ARCHIVED (wXduoY9YXd2Ofs0L)
- Only R9GPabeNm26GgxKa remains (active, published)

### 5. UW API Subscription — PURCHASED
- API Basic plan purchased. Key confirmed: [SEE MEMORY]
- 20,000 req/day, 120 req/min. We use 1 req/day.
- Weekly API Trial ($50/week) still active, renews April 16. Billy holding weekly for 1 month to validate Signal Engine before switching to annual ($125/month = $1,500/year, saves $900/year).
- Platform subscription (premium_super_annual) expires June 9, 2026. Autorenewal OFF.
- Coupon codes for future use: TEN-OFF, ASANDFORDX (10% off), TRSTN (5% off)

### 6. Portfolio EOD Review — All 3 Accounts
**Total: $362,257.04 | Day: +$773.61**

**6685 IRA: $289,509.97 (+$443.65)**
- Cash: $38,047.84
- UCO: 106 shares @ $42.23, basis $43.00, -1.79%. Stop $40.85. Blockade live.
- PSLV: 423 shares @ $24.42, basis $24.82, -1.63%. Stop $23.58. War regime pressure.
- VOO: 86.2 shares @ $628.82, basis $612.15, +2.72%. Unrealized gain $1,437.55. Hitting $350/day target.
- ITA: TRIMMED 9 shares per IRONCLAD at +5.11%. Compliant.
- PHYS: 200 shares @ $35.91, basis $34.25, +4.85%. Approaching +5% trim.
- AG: 300 shares @ $20.76, basis $21.06, -1.43%. Same silver pressure as PSLV.
- SGOV: $93,268 (32.22%). Cash anchor.
- MSFT: fractional. IBIT: 24 shares, +1.57%. SPHD: fractional.
- JEPI: 504.8 shares, -1.79%. SCHD: 881.3 shares, -2.40%. XLV: 70.3 shares, -2.50%.

**4898 Taxable: $62,287.92 (+$246.08)**
- Cash: $33,687.70 (54% cash)
- FCX: 110 shares, +10.55%. Two IRONCLAD trim levels passed. **PRINCIPAL OVERRIDE** — position too small ($7,506) for trim to matter.
- CEF: 65 shares, -9.67%. **PRINCIPAL OVERRIDE** — IRONCLAD -5% stop breached, holding through.
- LHX: 20 shares, -2.72%. RKLB: 37 shares, -2.40%. Both defense.
- JEPI: 86.2 shares. SCHD: 80.7 shares. PHYS: 20 shares.

**5267 Brokerage: $10,459.15 (+$83.88, +0.86%)**
- Cash: $586.75
- ALL GREEN: COPX +1.66%, NLR +1.42%, SMH +1.14%, SLX +0.50%, VOO +0.66%
- Thesis basket outperformed S&P. Position sizing is the constraint, not the picks.
- Billy wants to "blow this up" — fund from 4898 cash ($33K available).
- Account is Individual Brokerage (taxable), NOT Roth.

### 7. FORGE Landing Page — PARTIAL UPDATE
- File: forge-landing repo, index.html
- COMPLETED: METATRON v7.2 → v10.8 everywhere. FORGE v2.1 → v3.0. CREATE → ANVIL. CAKE → ASSAY. Disclaimer updated to ANVIL + ASSAY + AUTOPSY. ANVIL acronym (A-N-V-I-L) and ASSAY acronym (A-S-S-A-Y) updated.
- NOT DONE: Tooltip CSS not added. Tooltip HTML on 4 stat blocks not wired. Tooltip HTML on 11 gate cards not wired. File NOT pushed to GitHub. NOT deployed to Vercel.
- Working file at /home/claude/index.html (will not persist). Must redo or push to GitHub from next session.

═══════════════════════════════════════
## IMMEDIATE — NEXT SESSION (PRIORITY 1)
═══════════════════════════════════════

### 1. FORGE Landing Page Completion
- Add tooltip CSS to index.html
- Add tooltips to 4 stat blocks (11 Gates, 50 Drift Indicators, 95%+ Accuracy, 60+ Sources) with detail descriptions
- Add tooltips to 11 gate cards with expanded descriptions
- Push to GitHub (forge-landing repo)
- Deploy to Vercel
- Visual verification

### 2. Verify Signal Engine v1.1 Morning Run
- Check Telegram for 6:30 AM signal card on Tuesday April 14
- If no message, debug the scheduled trigger in n8n

### 3. PHYS Trim Watch
- PHYS at +4.85%. If it crosses +5% ($35.96), IRONCLAD says trim 25% (50 shares)

═══════════════════════════════════════
## REMAINING FROM PRIOR SESSIONS
═══════════════════════════════════════

1. **PSLV Exit Watchlist seed** — Supabase row still pending since April 12
2. **Supabase signal_history table** — needed for paper trade tracking
3. **SENTINEL Telegram credential fix** — "SENTINEL Telegram Bot" returns 401
4. **FORGE Sprint 2** — Intent Router, Visual Diff, Guided Remediation, Drift Interceptor
5. **FORGE test harness** — 150-200 prompts, A/B/C comparison, scoring rubric
6. **Paper trade POC** — 2-3 weeks automated, needs signal_history table
7. **Candlestick modules 2-5** — M1 delivered March 17
8. **Yahoo H3 crumb replacement** — HUNTER
9. **FEC H34 timeout fix** — HUNTER
10. **GABRIEL workflow full validation**
11. **4 hardcoded credentials cleanup**
12. **Tax filing** — deadline April 15. Extension if not done Tuesday night.
13. **5267 funding decision** — transfer from 4898 cash to size thesis positions
14. **Roth IRA consideration** — not opened yet, would shelter thesis gains

═══════════════════════════════════════
## MARKET CONTEXT
═══════════════════════════════════════

- S&P 500 +0.4%, Nasdaq +0.7%, Dow flat
- WTI crude $101+ (blockade live 10 AM ET)
- Ceasefire expires April 22, no follow-up talks scheduled
- DXY at 120.66 (strong dollar, silver pressure)
- VIX 19.23 (moderate)
- 10Y yield 4.29% (moderate)
- War regime correlation confirmed: crude up = dollar up = silver DOWN
- PPI data: Tuesday April 14
- EIA weekly inventory: Wednesday April 15 (also tax deadline)
- TSLA earnings: April 22. GEV earnings: April 22.
- MSFT earnings: April 29. AMZN earnings: May 7.

═══════════════════════════════════════
## ACTIVE N8N WORKFLOWS
═══════════════════════════════════════

| Workflow | ID | Nodes | Status |
|----------|-----|-------|--------|
| SIGNAL ENGINE v1.1 | R9GPabeNm26GgxKa | 12 | **ACTIVE/PUBLISHED** |
| HUNTER v3.3 | orZPNtvvCB8RAlwF | 97 | Active |
| SENTINEL | CsTbRtchtCzxjKLX | 82 | Active |
| CIL v6.1 | V61BMUNNQDBpCOsp | 56 | Active |
| GABRIEL v2.0 | fwKiBHtedNQ1n34H | -- | Active |
| HUNTER MICRO | rsS4DFbOgTRQvqTX | -- | Active |
| TOKEN KEEPER | KhTkAxrCW1kZvgdV | -- | Active |
| TOKEN EXCHANGE | kcngMMPBm5h0ZfTZ | -- | Active |

═══════════════════════════════════════
## IRONCLAD LOG
═══════════════════════════════════════

- ITA: TRIMMED 9 shares at +5.11%. COMPLIANT.
- FCX: +10.55%, two trim levels passed. PRINCIPAL OVERRIDE. Position too small.
- CEF: -9.67%, -5% stop breached. PRINCIPAL OVERRIDE. Holding.
- PHYS: +4.85%. WATCH for +5% trim trigger at $35.96.
- UCO: -1.79% from $43.00 entry. Stop at $40.85 (-5%).
- PSLV: -1.63% from $24.82 entry. Stop at $23.58 (-5%).

═══════════════════════════════════════
## API KEYS
═══════════════════════════════════════

- UW: [SEE MEMORY] (API Basic, 20K req/day)
- FRED: [SEE MEMORY]
- EIA: [SEE MEMORY]
- Nasdaq Data Link: [SEE MEMORY] (BLOCKED from n8n Cloud)
- GitHub: [SEE MEMORY] (expires Jul 3, 2026)

## FORGE LIVE URL
https://forge-landing-theta.vercel.app/index.html

## MONTHLY BURN: $370 + $200 UW API (weekly trial)
(Claude Max $100, ChatGPT Pro $200, SuperGrok $50, Perplexity Pro $20, UW API $200/mo at weekly rate)

═══════════════════════════════════════

PHOENIX CLOSE COMPLETE.
