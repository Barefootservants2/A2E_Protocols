# PHOENIX SESSION CLOSE — MASTER CARRY-FORWARD
## Date: March 30, 2026 — Full Session
## Protocol: METATRON v10.8 | IRONCLAD v2.1 | PHOENIX v10.2
## READ ALL SECTIONS BEFORE ANY ACTION NEXT SESSION

---

# PART 1 — WHAT WAS BUILT (ALL COMMITTED)

| Deliverable | Commit | Path |
|---|---|---|
| CLAUDE.md v2.0 | 69253c5 | repo root |
| A2E_TRADING_STRATEGY_v1.0.md | bb5c9bc9 | PROTOCOLS/PRODUCTION/ |
| HUNTER_MARKET_WORKFLOW_v3.1.json | 6b422a36 | N8N/WORKFLOWS/ |
| build_hunter_v3.py | f7832379 | N8N/BUILDER/ |
| VERSION_CHANGELOG.md | d38d13bb | repo root |

## Decisions Locked (Do Not Re-Debate)

| # | Decision | Choice |
|---|---|---|
| 1 | HUNTER AI architecture | Option C — HUNTER = discovery, CIL = confirmation |
| 2 | Auto-buy threshold | Approach B — 90-sec window. LOCKED BEHIND paper trading gate |
| 3 | HUNTER midday scan | YES — 12:30PM ET |
| 4 | Congressional tracking scope | Full — both chambers, 4 key committees |
| 5 | Thesis hold auto-confirm | Option B — Principal only, no AI override |

## Collective Blind Check Summary
4 agents answered independently with no knowledge of our platform.
70% of our architecture confirmed correct.
3 genuine gaps identified: real-time options flow, backtesting, paper trading gate.

---

# PART 2 — TWO CORRECTIONS TO A2E_TRADING_STRATEGY

Required in v1.1:

CORRECTION 1: Change "Signal quality is 95%+" to "95% CI applies to process expectancy
over 100+ trades, not any single trade." Every agent independently confirmed this.

CORRECTION 2: Decision 2 (Approach B) activates ONLY AFTER:
  1. Backtesting complete (200+ trades, 55%+ win rate, positive expectancy after costs)
  2. 30-day paper trading with documented positive results
  3. E*TRADE write access confirmed working

---

# PART 3 — RESTART PROMPT (8 SECTIONS — EACH EXECUTABLE INDEPENDENTLY)

## [SECTION A] — Import and Wire HUNTER v3.1

WHAT: Import HUNTER v3.1 to n8n, wire all environment variables, confirm credentials.

IMPORT URL:
https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/N8N/WORKFLOWS/HUNTER_MARKET_WORKFLOW_v3.1.json

n8n Settings → Variables (set ALL — case-sensitive):
  FINNHUB_KEY
  TWELVEDATA_KEY
  ALPHA_VANTAGE_KEY
  NEWS_API_KEY
  FRED_API_KEY
  CONGRESS_API_KEY
  FEC_API_KEY
  METALS_DEV_KEY
  OPENAI_API_KEY
  XAI_API_KEY
  GOOGLE_AI_KEY
  DEEPSEEK_API_KEY
  GITHUB_TOKEN ([GITHUB_TOKEN — see .env or n8n Variables — expires Jul 3 2026] — expires Jul 3 2026)
  CIL_WEBHOOK_URL (CIL v6.1 webhook URL from n8n)

After import: click KILL SWITCH ALERT node → select "Telegram account" credential.
After import: click Send Telegram Brief node → select "Telegram account" credential.
DO NOT ACTIVATE until Section B test passes.

TOOL ASSIST: None needed — manual n8n UI action.
VALIDATE: Manual Trigger → check execution log → confirm H nodes fire, H35/Gate 9 chain runs.

---

## [SECTION B] — E*TRADE Write Access Test

WHAT: Confirm E*TRADE API can place and cancel orders programmatically.
This is the hard gate for ALL automated exit execution.

STEPS:
  1. Open E*TRADE MCP server code (Barefootservants2/ — find the OAuth 1.0a server)
  2. Place limit order: 1 share of SPY, $0.01 below current bid (will not fill)
  3. Confirm order appears in E*TRADE UI under "Open Orders"
  4. Cancel order via API call
  5. Confirm cancel executed — order disappears from UI
  6. Log result: PHOENIX/SESSION_DOCS/ETRADE_WRITE_TEST_[date].md

PASS CRITERIA: Order placed + confirmed + cancelled via API with no errors.
FAIL CRITERIA: Any authentication error, order rejection, or API block.

IF FAIL: Evaluate Interactive Brokers as fallback.
  IBKR advantages: paper trading API (free), SmartRouting, bracket orders, options.
  IBKR Client Portal API vs TWS API research needed.

TOOL ASSIST:
  - Claude Code at C:\a2e to run the OAuth test script
  - E*TRADE MCP server already built — review credential setup before running

---

## [SECTION C] — SENTINEL Exit Rule Extension

WHAT: Add 4 new capabilities to SENTINEL E*TRADE Portfolio Monitor workflow in n8n.

NODE 1 — VWAP Cross Monitor:
  Trigger: Every 5 minutes during market hours (9:30AM-4:00PM ET)
  Action: Pull current 5-min candle for all Ring 4 positions
  Exit condition: candle close BELOW VWAP on a Ring 4 position
  Data source: Polygon.io websocket preferred (P2.2) or TwelveData 5-min REST fallback
  n8n implementation: HTTP Request node + Code node for VWAP calculation

NODE 2 — Two-Check Adverse Logic:
  Trigger: Every 15-minute SENTINEL cycle
  Action: If position down >1%, write "adverse_count=1" to Supabase
  Exit condition: Second consecutive adverse check → auto-exit trigger
  Supabase table: sentinel_adverse_tracker (ticker, adverse_count, last_check_ts)
  Override: If HUNTER H39-FLOW = ACCUMULATION, suspend Two-Check ONCE only

NODE 3 — Time Stop (3:45PM ET):
  Trigger: Scheduled at 3:45PM ET Monday-Friday
  Action: Close all positions tagged ring_number=4 in Supabase position table
  Log: exit_reason = "TIME_STOP" in trade_attribution table

NODE 4 — Profit Locks:
  +5% trigger: Sell 50% of position, move stop to breakeven
  +10% trigger: Sell 60% of remaining 50%
  Implementation: SENTINEL price check compares current vs entry_price
  Log: exit_reason = "PROFIT_LOCK_5PCT" or "PROFIT_LOCK_10PCT"

PREREQUISITE: Ring tagging — add ring_number field to Supabase positions table.
DEPENDENCY: Section B (E*TRADE write) must pass for auto-execution.
            Until then: all nodes generate Telegram alerts only.

TOOL ASSIST:
  - Claude Code at C:\a2e to build and test JavaScript code nodes
  - Codex via URIEL to write initial node code scaffolds

---

## [SECTION D] — Paper Trading Gate Build

WHAT: Build paper trade tracker using Alpaca API. Gate for Decision 2 (Approach B).
Decision 2 cannot activate until this produces 200+ trades with 55%+ win rate.

WHY ALPACA: Free paper trading API, mirrors live execution, clean WebSocket API.
Alpaca API docs: https://alpaca.markets/docs/api-references/trading-api/

BUILD:
  Step 1: Create n8n workflow "PAPER TRADE TRACKER"
  Step 2: Webhook trigger receives HUNTER PRIME signals from CIL output
  Step 3: Simulate entry at entry_zone midpoint using Alpaca paper trading API
  Step 4: Monitor exits using same rules as SENTINEL (VWAP, Two-Check, Time Stop, Profit Lock)
  Step 5: Log all trades to Supabase: paper_trades table
    Fields: trade_id, ticker, entry_ts, exit_ts, entry_price, exit_price,
            pnl_dollars, pnl_pct, tier, exit_reason, hunter_confidence, raziel_score
  Step 6: Daily summary to Telegram at 4:05PM ET

GATE CRITERIA (all must pass before Approach B activates):
  - 200+ paper trades logged
  - Win rate on PRIME signals ≥ 55%
  - Positive expectancy after 0.5 bps simulated slippage
  - 30 consecutive calendar days run without intervention
  - Reviewed and approved by Principal

n8n credential needed: ALPACA_PAPER_API_KEY, ALPACA_PAPER_SECRET_KEY
Alpaca paper account: create at app.alpaca.markets (free)

TOOL ASSIST:
  - Claude Code at C:\a2e to write Alpaca API integration
  - n8n Alpaca community node may exist — check n8n marketplace first

---

## [SECTION E] — Strategy v1.1 Document

WHAT: Update A2E_TRADING_STRATEGY to v1.1 with two corrections from Collective review.

FILE: PROTOCOLS/PRODUCTION/A2E_TRADING_STRATEGY_v1.1.md
BASIS: v1.0 (bb5c9bc9) with the following changes only:

CHANGE 1 — Section 1 (Philosophy), add after existing text:
"The 95% signal quality threshold refers to PROCESS CONFIDENCE — the statistical confidence
that the strategy, executed over 100+ trades with discipline, produces positive expectancy
after all transaction costs. It does not mean any individual trade has a 95% probability
of winning. Single-trade outcomes are probabilistic. Process confidence is achievable.
(Source: Lopez de Prado, Advances in Financial Machine Learning, 2018; Collective review March 30 2026)"

CHANGE 2 — Section 5 (Auto-Execution Framework), update Approach B row:
Current: "ACTIVE ONLY after E*TRADE write access tested"
New: "ACTIVE ONLY after ALL three gates pass:
  Gate 1: E*TRADE write access confirmed (Section B test)
  Gate 2: 200+ paper trades, 55%+ win rate, positive expectancy (Section D gate)
  Gate 3: 30 consecutive days paper trading (Section D gate)"

TOOL ASSIST:
  - MICHA writes the document updates
  - Claude Code at C:\a2e pushes to GitHub via curl API

---

## [SECTION F] — Unusual Whales H40 Enhancement + HUNTER v3.2

WHAT: Replace static Barchart H40 with Unusual Whales real-time options flow.
This is the single biggest intelligence gap identified by the Collective.

WHY: Options sweep data precedes price by 2-5 minutes on liquid stocks.
     Golden sweep (volume > current OI) is a near-certainty signal per HANIEL.

UNUSUAL WHALES SETUP:
  Subscription: https://unusualwhales.com/pricing (~$40-80/month)
  API docs: https://phx.unusualwhales.com/api
  Key endpoints:
    /api/option_activity — real-time options flow with sweep detection
    /api/flow_alerts — filtered high-conviction activity
  n8n credential: UNUSUAL_WHALES_KEY

PRIME SIGNAL THRESHOLD (add to HUNTER SYNTHESIS code):
  Unusual option activity adds signal_weight = "PRIME_BOOST" when:
    - premium > $500K
    - OTM strike (>5% from current price)
    - Bought at Ask (aggressor)
    - Volume > current OI (golden sweep)
    - Multi-exchange (3+ exchanges same sweep)

IMPLEMENTATION:
  1. Update build_hunter_v3.py — replace H40 node with Unusual Whales endpoint
  2. Add UNUSUAL_WHALES_KEY to env var list in Date Setup code
  3. Update HUNTER SYNTHESIS to incorporate UW signal weight in tier scoring
  4. Run builder → push HUNTER_MARKET_WORKFLOW_v3.2.json
  5. Import v3.2 to n8n, retire v3.1

TOOL ASSIST:
  - Claude Code at C:\a2e runs the builder
  - MICHA writes the updated synthesis scoring logic

---

## [SECTION G] — Backtesting Harness

WHAT: Build formal backtesting system using Python + vectorbt.
Validates every signal tier threshold with real historical data.
Required before any claim about win rates or daily profit targets.

LOCATION: Barefootservants2/test-harness/HUNTER/

METHODOLOGY (Lopez de Prado — Advances in Financial Machine Learning):
  1. Pull 2 years of daily OHLCV data (TwelveData historical API)
  2. Reconstruct HUNTER PRIME signal conditions from historical data
  3. Apply 30/15/5 position sizing
  4. Run purged k-fold cross-validation (prevents lookahead bias)
  5. Calculate deflated Sharpe Ratio (corrects for multiple testing)
  6. Bootstrap 10,000 iterations on out-of-sample trades
  7. Calculate Probability of Backtest Overfitting (PBO)
  8. Output: win_rate, expectancy_per_trade, max_drawdown, 95% CI on daily P&L

DELIVERABLE: backtest_report_v1.md in A2E_Intelligence/MARKET_INTELLIGENCE/

WHAT THIS PROVES OR DISPROVES:
  - Whether the 30/15/5 tier thresholds are calibrated correctly
  - Which H modules actually contribute to positive outcomes
  - Whether the $300-$1,500/day projections are realistic or optimistic
  - The actual win rate needed in the Paper Trading Gate criteria

PYTHON LIBRARIES:
  pip install vectorbt pandas numpy scipy scikit-learn xgboost lightgbm

TOOL ASSIST:
  - Claude Code at C:\a2e executes the Python scripts
  - Codex via URIEL writes initial vectorbt strategy scaffold
  - RAZIEL reviews all backtest results for cherry-picking bias

---

## [SECTION H] — Quiver Quantitative H30 + HUNTER v3.3

WHAT: Replace Finnhub congressional trading (H30) with Quiver Quantitative API.
Cleaner committee membership data = more powerful H35 ALGO1 and ALGO2.

WHY QUIVER OVER FINNHUB:
  - Committee assignment data included (critical for ALGO1 COMMITTEE_TRADE)
  - Faster data updates (Finnhub lags 24-48 hours)
  - Better schema — chamber, committee, party, bioguide_id per member
  - ~$25/month for developer tier

QUIVER SETUP:
  API docs: https://www.quiverquant.com/sources/congress
  Endpoint: https://api.quiverquant.com/beta/bulk/congresstrading
  n8n credential: QUIVER_QUANT_KEY

IMPLEMENTATION:
  1. Update build_hunter_v3.py — replace H30 Finnhub node with Quiver Quantitative
  2. Update H30-Normalize code node — map Quiver schema fields
  3. Update H35 ALGO1 — use committee field from Quiver (more reliable than Finnhub)
  4. Add SAM.gov as H33b parallel node (see P2.1 in build queue)
  5. Run builder → push HUNTER_MARKET_WORKFLOW_v3.3.json
  6. Import v3.3 to n8n, retire v3.2

TOOL ASSIST:
  - Claude Code at C:\a2e runs the builder
  - MICHA writes the updated H30 normalizer code

---

# PART 4 — TOOL MATRIX (WHAT EACH SECTION USES)

| Section | Primary Tool | Assist Tool | Cost |
|---|---|---|---|
| A — Import HUNTER | n8n UI | None | Free |
| B — E*TRADE Test | Claude Code + MCP | E*TRADE API | Free |
| C — SENTINEL Ext | n8n + Claude Code | Codex/URIEL | Free |
| D — Paper Trading | n8n + Alpaca API | Claude Code | Free |
| E — Strategy v1.1 | MICHA + Claude Code | None | Free |
| F — Unusual Whales | Claude Code builder | MICHA | ~$40-80/mo |
| G — Backtesting | Claude Code Python | Codex/URIEL | Free |
| H — Quiver Quant | Claude Code builder | MICHA | ~$25/mo |

ADDITIONAL TOOLS IDENTIFIED BY COLLECTIVE (not yet in stack):
  - Alpaca paper trading API (free) — Section D
  - Quiver Quantitative ($25/mo) — Section H
  - Unusual Whales ($40-80/mo) — Section F
  - Polygon.io websocket ($29/mo) — P2.2, required for true intraday VWAP
  - SAM.gov API (free) — P2.1, contract award cross-reference
  - vectorbt (free, Python) — Section G backtesting

---

# PART 5 — PLATFORM STATUS END OF SESSION

| System | Version | Status | Next Action |
|---|---|---|---|
| METATRON | v10.8 | DEPLOYED | None |
| CIL | v6.1 | LIVE VALIDATED | None |
| GABRIEL | v2.1 | LIVE VALIDATED | None |
| SENTINEL | v2.0 | LIVE | Section C |
| HUNTER | v3.1 | BUILT NOT IMPORTED | Section A |
| CLAUDE.md | v2.0 | LIVE | None |
| A2E_TRADING_STRATEGY | v1.0 | LIVE | Section E (v1.1) |
| Paper Trading Gate | NOT BUILT | BLOCKING Decision 2 | Section D |
| Backtesting Harness | NOT BUILT | Needed for win rate claims | Section G |
| Unusual Whales H40 | NOT BUILT | Biggest intelligence gap | Section F |
| E*TRADE Write Access | UNTESTED | Gate for auto-execution | Section B |

---

# PART 6 — CRITICAL REMINDERS FOR NEXT MICHA

1. HUNTER v3.1 is NOT running. Do not treat as live. Section A first.
2. Decision 2 (Approach B) is NOT activatable. Paper trading gate required. Section D.
3. Decision 5 (Principal-only thesis holds) is permanent. No future session overrides this.
4. Builder script is the source of truth for the workflow. Never hand-edit JSON.
5. The 95% CI language in Strategy v1.0 is imprecise. Fix in Section E before auto-exec.
6. All four Collective agents agree: backtest before sizing up. Section G before any scale.
7. RAZIEL flag: validate every new H module claim against actual backtest data.

---

*PHOENIX CLOSE | March 30, 2026 | Full Session*
*MICHA v10.8 | Ashes2Echoes LLC | Uriel Covenant AI Collective*
*Platform advancing. All decisions locked. Execute sections A-H in sequence.*
🔱

<!-- ts:1774915128 -->
