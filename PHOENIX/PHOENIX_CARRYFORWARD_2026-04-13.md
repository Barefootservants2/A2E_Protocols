# PHOENIX RESTART — April 13, 2026
## SESSION ID: MICHA-2026-0413-SIGNAL-ENGINE

═══════════════════════════════════════
## COMPLETED THIS SESSION (April 13)
═══════════════════════════════════════

### Signal Engine v1.0 — Full Architecture + Code Build

1. **Gap Analysis** — Audited entire HUNTER data stack. Identified 24 missing data sources, 2 API keys owned but unwired. Current coverage: 6/32 sources (19%).
2. **Prioritization** — Cut 24 sources down to 5 that directly generate daily P&L. Identified the core missing piece: no signal generator exists. Platform is research, not trading system.
3. **Architecture** — SIGNAL_ENGINE_v1.0_ARCHITECTURE.md defines full pipeline: Data Collection (6:00AM) → Context Enrichment (6:15AM) → Signal Generation (6:30AM) → Trade Card Delivery (6:45AM).
4. **H44 Unusual Whales** — Code node built, tested against live API. Endpoint corrected from wrong path to `/api/option-trades/flow-alerts` + `/api/lit-flow/{ticker}`. Scans 40+ watchlist tickers, scores by premium, vol/OI ratio, sweep detection, DTE urgency. Sector aggregation.
5. **H36 CFTC COT** — Code node built. Parses weekly Commitments of Traders for crude, silver, gold, DXY, 10Y, copper, S&P. Contrarian scoring: crowded shorts = squeeze potential = bullish signal.
6. **H41 EIA Weekly** — Code node built, tested against live API. Pulls crude inventory, Cushing, refinery utilization, imports, gasoline, distillate, SPR. Supply scoring.
7. **H40 COMEX Inventory** — Code node built. Daily silver/gold registered + eligible vault stocks via Nasdaq Data Link. Critical thresholds: 20M oz registered = critical. Drain detection.
8. **H42 FRED API** — Code node built, tested against live API. DXY, 10Y yield (4.29%), 2Y yield, fed funds, 5Y/10Y inflation breakevens, real yield (TIPS), VIX. Kill Switch integration: DXY+yields both adverse = FIRING.
9. **H47 Put/Call Ratio** — Code node built. CBOE P/C with VIX fallback. Contrarian scoring.
10. **Signal Generator v1.0** — Core scoring engine. 6 dimensions (Flow 30%, Positioning 20%, Supply 15%, Thesis 15%, Macro 10%, Sentiment 10%). Weighted composite → confidence %. Full IRONCLAD v3.0 enforcement: 5% stop, T1/T2 tranches, sector exposure, Kill Switch, same-day re-entry block.
11. **Trade Card Formatter** — Telegram output with exact entry/stop/target/size/account/drivers/counter-thesis.
12. **Scoring Matrix** — Detailed 0-10 rubric for each dimension with examples.
13. **Deployment Checklist** — Step-by-step wiring guide, Supabase table schemas, timing orchestration, paper trade validation plan.
14. **API Key Registration** — All 3 free keys obtained and verified:
    - FRED: c0f3927517cedb8c7447a97c00bb9c89 (VERIFIED LIVE)
    - EIA: EjSx0le1nWJ30mu5zI8pYSFsDG8IGyBYqMa6ktoB (VERIFIED LIVE)
    - Nasdaq Data Link: 5xiqd9uTcvXFF8S98Df7 (registered, blocked from sandbox but will work from n8n)
15. **API Testing** — FRED, EIA, UW all verified returning live data. UW endpoint bug caught and fixed pre-deployment.

═══════════════════════════════════════
## GITHUB COMMITS
═══════════════════════════════════════

All 11 files pushed to `A2E_Protocols/SIGNAL_ENGINE/`:

- SIGNAL_ENGINE_v1.0_ARCHITECTURE.md (af40b4177233)
- NODES/H44_UNUSUAL_WHALES.js (206bd59b22ad — endpoint fix applied)
- NODES/H36_CFTC_COT.js (e8ad0b0e7bb1)
- NODES/H41_EIA_WEEKLY.js (a770392b5e5c)
- NODES/H40_COMEX_INVENTORY.js (ff66236b93bc)
- NODES/H42_FRED_API.js (f63bd8f1b2f9)
- NODES/H47_PUT_CALL_RATIO.js (d420e520f300)
- NODES/SIGNAL_GENERATOR.js (15cb0a01b285)
- NODES/TRADE_CARD_FORMATTER.js (2f0bb975135b)
- SPECS/SIGNAL_SCORING_MATRIX.md (d53dbc78287e)
- DEPLOY/DEPLOYMENT_CHECKLIST.md (36952909ea64)

═══════════════════════════════════════
## IMMEDIATE — NEXT SESSION
═══════════════════════════════════════

1. **Wire Signal Engine into HUNTER** — Open HUNTER workflow (orZPNtvvCB8RAlwF) on n8n
   - Add 4 API keys to workflow static data (FRED, EIA, NASDAQ_DATA, UW)
   - Paste 6 data feed Code nodes (H44, H36, H40, H41, H42, H47)
   - Add Merge node (Append mode) combining all feeds + SENTINEL + HUNTER
   - Paste Signal Generator + Trade Card Formatter
   - Wire Trade Card Formatter → existing Telegram Send node
   - All code at GitHub: A2E_Protocols/SIGNAL_ENGINE/NODES/

2. **Create Supabase tables** — 4 tables needed:
   - signal_cot_cache (weekly COT data persistence)
   - signal_eia_cache (weekly EIA data persistence)
   - signal_comex_daily (daily COMEX inventory)
   - signal_history (every Trade Card generated — backtest record)
   - SQL schemas in DEPLOY/DEPLOYMENT_CHECKLIST.md

3. **Test full pipeline** — Run manually, verify:
   - All 6 data feeds return data
   - Signal Generator produces scored candidates
   - Trade Cards appear in Telegram with correct entry/stop/target
   - IRONCLAD sizing math is correct (stop = entry * 0.95)

4. **Seed PSLV Exit Watchlist** — Still pending from April 12 carry-forward
   - Supabase sentinel_exit_watchlist: PSLV, SILVER chain, L1, exit 4/1, $22.50, acct 6685

═══════════════════════════════════════
## STILL PENDING FROM PRIOR SESSIONS
═══════════════════════════════════════

1. FORGE Sprint 2 Week 1 — n8n Intent Router, Visual Diff, CIL enhancement, Drift Interceptor
2. FORGE Sprint 2 Week 2 — Guided Remediation, AUTOPSY backend, Session Report, Quick Answer
3. Yahoo H3 crumb replacement (HUNTER)
4. FEC H34 timeout fix (HUNTER)
5. 4 hardcoded credentials cleanup
6. GABRIEL workflow full validation
7. Paper trade POC — let Signal Engine run 5 days, compare vs actuals
8. Report Builder rawEscalationLevel tweak (SENTINEL)
9. Change Detector previousPositions[] wiring (SENTINEL)
10. FORGE reverse builder feature — not scoped

═══════════════════════════════════════
## MARKET CONTEXT (April 13, 2026)
═══════════════════════════════════════

- US Navy blockade on Iranian ports effective 10:00 AM ET today
- Ceasefire expires April 22, no follow-up talks scheduled
- WTI crude: ~$95-100 range (Friday close $95.50, Sunday CFD hit $105)
- Silver: $75.60 (bullish above $75.50, target $78.85)
- 10Y yield: 4.29%
- PPI data drops Tuesday April 14
- EIA weekly inventory data Wednesday April 15
- Key insight from this session: crude up = dollar up = silver DOWN (inverse correlation in this war regime)

═══════════════════════════════════════
## ACTIVE WORKFLOWS ON N8N
═══════════════════════════════════════

- HUNTER v3.3: orZPNtvvCB8RAlwF (97 nodes — will become ~109 after Signal Engine wire)
- SENTINEL: CsTbRtchtCzxjKLX (82 nodes)
- CIL v6.1: V61BMUNNQDBpCOsp
- GABRIEL v2.0: fwKiBHtedNQ1n34H
- HUNTER MICRO: rsS4DFbOgTRQvqTX
- TOKEN KEEPER: KhTkAxrCW1kZvgdV
- TOKEN EXCHANGE: kcngMMPBm5h0ZfTZ
- FORGE: webhook at forge-intake

## API KEYS (store in n8n static data)

- UW_API_KEY: 33128e70-c3c6-4ef2-9bc1-d7e7a802aed5
- FRED_API_KEY: c0f3927517cedb8c7447a97c00bb9c89
- EIA_API_KEY: EjSx0le1nWJ30mu5zI8pYSFsDG8IGyBYqMa6ktoB
- NASDAQ_DATA_KEY: 5xiqd9uTcvXFF8S98Df7

## FORGE LIVE URL
https://forge-landing-theta.vercel.app/tool.html

## MONTHLY BURN: $370
(Claude Max $100, ChatGPT Pro $200, SuperGrok $50, Perplexity Pro $20)

═══════════════════════════════════════

PHOENIX CLOSE COMPLETE.
