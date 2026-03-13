// SENTINEL — E*TRADE Portfolio Intelligence Workflow
// Complete Application Specification v1.0
// Ashes2Echoes LLC | Uriel Covenant AI Collective
// March 13, 2026
//
// This document is the full engineering specification for the
// E*TRADE portfolio monitoring, reporting, compliance, and
// protective-sell workflow. It is designed to be used as a
// build prompt for n8n AI Build or as a development handoff.


// ════════════════════════════════════════════════════════════
// SECTION 1: WHAT THIS IS
// ════════════════════════════════════════════════════════════

// SENTINEL is an automated portfolio surveillance system that
// connects to E*TRADE via their REST API (v1) to monitor,
// report, enforce risk protocols, and execute protective sells
// across multiple brokerage accounts 24/7.
//
// It does NOT buy. It does NOT open new positions. It does NOT
// place speculative trades. It monitors and protects.
//
// SENTINEL is the guardian. CIL is the brain. HUNTER is the
// scanner. IRONCLAD is the law. SENTINEL enforces IRONCLAD.


// ════════════════════════════════════════════════════════════
// SECTION 2: E*TRADE API ENDPOINTS USED
// ════════════════════════════════════════════════════════════

// Base URL: https://api.etrade.com
// Auth: OAuth 1.0a (HMAC-SHA1 signatures)
// Format: JSON (append .json to endpoints or set Accept header)
// Rate Limits: Accounts 2/sec (7,000/hr), Market 4/sec (14,000/hr), Orders 2/sec (7,000/hr)

// ACCOUNTS MODULE (READ ONLY)
// GET /v1/accounts/list
//   Returns: accountId, accountIdKey, accountType, accountMode, accountDesc, accountStatus
//   Our accounts: 326695267, 326705536, 451146685 (IRA -6685), 459454898 (MLC -4898)
//
// GET /v1/accounts/{accountIdKey}/balance?instType=BROKERAGE&realTimeNAV=true
//   Returns: accountBalance, cashAvailableForInvestment, netCash, totalAccountValue
//   marginBuyingPower, cashBuyingPower, dayTradingBuyingPower
//
// GET /v1/accounts/{accountIdKey}/portfolio
//   Returns per position: symbol, quantity, costPerShare, totalCost, marketValue,
//   currentPrice, totalGain, totalGainPct, daysGain, daysGainPct, positionType,
//   pctOfPortfolio, securityType
//   View options: PERFORMANCE, FUNDAMENTAL, OPTIONSWATCH, QUICK, COMPLETE
//
// GET /v1/accounts/{accountIdKey}/transactions?startDate=MMDDYYYY&endDate=MMDDYYYY
//   Returns: transaction history (buys, sells, dividends, interest)

// ALERTS MODULE (READ/DELETE)
// GET /v1/user/alerts
//   Returns: alert messages (trade executions, margin calls, order expirations, balance alerts)
// GET /v1/user/alerts/{alertId}
//   Returns: full alert detail
// DELETE /v1/user/alerts/{alertId}
//   Acknowledges/deletes an alert

// MARKET MODULE (READ ONLY)
// GET /v1/market/quote/{symbols}
//   Returns: real-time quotes (bid, ask, last, volume, high, low, open, close, change, changePercent)
//   Can request up to 25 symbols per call (counts as 1 API request)
//   View options: FUNDAMENTAL, INTRADAY, OPTIONS, WEEK_52, ALL
//
// GET /v1/market/optionchains?symbol={symbol}&expiryYear={}&expiryMonth={}&expiryDay={}
//   Returns: option chain data (strikes, bids, asks, greeks, open interest, volume)
//
// GET /v1/market/optionexpiredate?symbol={symbol}
//   Returns: available expiration dates for options on a symbol
//
// GET /v1/market/lookup/{search}
//   Returns: symbol lookup by company name

// ORDERS MODULE (READ + PROTECTIVE ACTIONS ONLY)
// GET /v1/accounts/{accountIdKey}/orders
//   Returns: all open orders (orderType, orderStatus, orderedQuantity, filledQuantity,
//   estimatedCommission, limitPrice, stopPrice, stopLimitPrice, orderTerm, priceType)
//
// POST /v1/accounts/{accountIdKey}/orders/preview
//   Preview an order before placing (shows estimated cost, commission, margin impact)
//   REQUIRED before any Place Order call
//
// POST /v1/accounts/{accountIdKey}/orders/place
//   Place an order (requires previewId from Preview)
//   WE USE THIS ONLY FOR: stop-loss orders, protective sells, trim sells
//   WE NEVER USE THIS FOR: buy orders, speculative positions, new entries
//
// PUT /v1/accounts/{accountIdKey}/orders/cancel
//   Cancel an open order
//
// PUT /v1/accounts/{accountIdKey}/orders/{orderId}/change/preview
//   Preview a change to an existing order
//
// PUT /v1/accounts/{accountIdKey}/orders/{orderId}/change/place
//   Execute a change to an existing order (modify stop price, quantity, etc.)


// ════════════════════════════════════════════════════════════
// SECTION 3: AUTHENTICATION
// ════════════════════════════════════════════════════════════

// E*TRADE uses OAuth 1.0a. Tokens expire at midnight ET daily.
// This is the single biggest engineering challenge.
//
// FLOW:
// 1. Request Token: POST /oauth/request_token (consumer key + secret)
// 2. Authorize: Browser redirect to https://us.etrade.com/e/t/etws/authorize?key={}&token={}
//    User logs in, clicks Accept, receives verifier code
// 3. Access Token: POST /oauth/access_token (request token + verifier)
// 4. Renew: GET /oauth/renew_access_token (every 2 hours, before midnight)
// 5. Revoke: GET /oauth/revoke_access_token (explicit logout)
//
// IMPLEMENTATION:
// Python middleware script (etrade_auth.py) handles the OAuth flow.
// Tokens cached to JSON file or Supabase row.
// n8n Schedule node calls refresh every 2 hours.
// If refresh fails, Telegram alert fires and workflow uses cached data.
//
// CREDENTIALS:
// Consumer Key: [stored in .env on n8n server]
// Consumer Secret: [stored in .env on n8n server]
// No 2FA configured (William confirmed). Puppeteer headless auth viable.
//
// DAILY AUTH SEQUENCE:
// 05:00 ET: Puppeteer script authenticates, caches tokens
// 07:00, 09:00, 11:00, 13:00, 15:00, 17:00, 19:00, 21:00, 23:00 ET: Renew token
// 23:45 ET: Final renew attempt before midnight expiry
// 00:01 ET: Token dead. Wait for 05:00 re-auth.


// ════════════════════════════════════════════════════════════
// SECTION 4: WORKFLOW ARCHITECTURE
// ════════════════════════════════════════════════════════════

// SENTINEL has 6 sub-workflows:
//
// 4A. HEARTBEAT (runs every 30 minutes during market hours)
//     Schedule: 6:00 AM - 8:00 PM ET, Mon-Fri, every 30 min
//     Actions:
//       - Pull account balances (all 4 accounts)
//       - Pull portfolio positions (all accounts)
//       - Pull real-time quotes for all held symbols
//       - Compare positions against IRONCLAD v2.1 rules
//       - Log snapshot to Supabase/GitHub
//       - If any violation detected, trigger ALERT sub-workflow
//
// 4B. STOP MONITOR (runs every 5 minutes during market hours)
//     Schedule: 9:25 AM - 4:05 PM ET, Mon-Fri, every 5 min
//     Actions:
//       - Pull all open orders
//       - Pull real-time quotes for all held symbols
//       - Check if any position has breached its stop level
//       - Check if any stop order needs updating (trailing logic)
//       - If stop triggered and no order exists, ALERT immediately
//       - If breakeven stop condition met (+5%), move stop to cost basis
//
// 4C. TRIM MONITOR (runs every 15 minutes during market hours)
//     Schedule: 9:30 AM - 3:45 PM ET, Mon-Fri, every 15 min
//     Actions:
//       - Calculate unrealized gain % for each position
//       - If +10%: flag for 50% trim (alert, do not auto-execute)
//       - If +20%: flag for 60% trim of remaining (alert, do not auto-execute)
//       - Log all trim candidates to Telegram
//       - IRONCLAD v2.1 trim table enforcement
//
// 4D. COMPLIANCE AUDIT (runs daily at 6:00 AM ET)
//     Schedule: 6:00 AM ET, Mon-Fri
//     Actions:
//       - Pull full portfolio across all accounts
//       - Check position sizing: no single position > 20% of total
//       - Check sector concentration: no sector > 35% of total
//       - Check ring allocation: Ring 1 should be 40-50%
//       - Check cash level: minimum 15% cash recommended
//       - Check all stops are set per IRONCLAD tier
//       - Check for wash sale risk (any sell in last 30 days)
//       - Generate compliance report to Telegram + GitHub
//
// 4E. OVERNIGHT WATCH (runs every hour, 8 PM - 6 AM ET)
//     Schedule: 8:00 PM - 5:30 AM ET, every hour
//     Actions:
//       - Pull after-hours/pre-market quotes for held symbols
//       - Check for gap risk (>3% move from close)
//       - Check for major news events (via SARIEL/Perplexity)
//       - If gap >5%, Telegram alert with CIL analysis option
//       - Monitor futures (ES, NQ, YM) for overnight direction
//       - This is the GABRIEL Overnight Watch spec from earlier
//
// 4F. PROTECTIVE SELL (triggered by STOP MONITOR or manual)
//     NOT scheduled. Event-driven only.
//     Actions:
//       - Receives sell signal from STOP MONITOR or manual trigger
//       - Validates signal against IRONCLAD rules
//       - Preview the sell order via API
//       - If preview passes: Place the sell order
//       - Confirm execution via order status check
//       - Log to trade journal (Supabase + GitHub)
//       - Telegram confirmation with fill details
//       - Check for wash sale implications
//       - Update position tracking
//
//     SELL CONDITIONS (only these trigger auto-sell):
//       - Stop-loss hit (price breaches IRONCLAD stop level)
//       - Correlation Kill Switch (DXY + yields adverse, H37/H38/H39)
//       - Position exceeds 25% of portfolio (emergency trim)
//       - KILLSWITCH command from Principal (manual override)
//
//     SELL RESTRICTIONS:
//       - Same-day re-entry BANNED (IRONCLAD v2.1)
//       - 48hr embargo after Kill Switch activation
//       - Must check wash sale window before executing
//       - Preview required before every place order call
//       - No market orders during first/last 15 min of session
//       - Limit orders only for protective sells


// ════════════════════════════════════════════════════════════
// SECTION 5: IRONCLAD v2.1 RULES ENGINE
// ════════════════════════════════════════════════════════════

// These rules are encoded into the workflow logic.
// They are not suggestions. They are hard constraints.

// TIERED STOP-LOSS MATRIX:
// Ring 1 (SGOV, Dividend Core): NO STOP
// Ring 2 (PSLV, IBIT, GLD): 10% stop from cost basis
// Ring 3 (XLV, Structural): 8.5% stop from cost basis
// Ring 4 (Tactical): 5% stop from cost basis
// Ring 5 (Lottery): NO STOP, written-off capital

// TRIM DISCIPLINE:
// +5% gain: Move stop to breakeven (cost basis)
// +10% gain: Sell 50% of position
// +20% gain: Sell 60% of remaining
// No FOMO re-entry after trim

// POSITION LIMITS:
// Risk per trade: 1.5% of total portfolio
// Single position max: 20% of total portfolio
// Sector concentration max: 35% of total portfolio

// KILL SWITCH:
// Triggered when DXY + yields move adverse simultaneously
// Auto 50% reduction in metals positions
// 48hr embargo on all new entries
// No override allowed

// RE-ENTRY RULES:
// Same-day re-entry: BANNED
// Re-entry after stop-out: Fresh data/facts required
// Re-entry after trim: Only on new catalyst
// Re-entry after Kill Switch: 48hr minimum wait

// RING CLASSIFICATION:
// Ring 1 (40-50%): SGOV, JEPI, SCHD, SPHD (income/fortress)
// Ring 2 (10-15%): PSLV, IBIT, GLD (store of value)
// Ring 3 (15-20%): XLV, structural trends (defensive growth)
// Ring 4 (5-10%): Tactical/event plays (short duration)
// Ring 5 (max 2%): Lottery tickets (binary outcomes)


// ════════════════════════════════════════════════════════════
// SECTION 6: TAX RULES ENGINE
// ════════════════════════════════════════════════════════════

// WASH SALE RULE (IRC Section 1091):
// If you sell a security at a loss and buy the same or
// "substantially identical" security within 30 days before
// OR after the sale, the loss is DISALLOWED.
//
// The window is 61 calendar days total:
//   30 days before sale + sale date + 30 days after
//
// CRITICAL: This applies ACROSS ALL ACCOUNTS including IRAs.
// Selling at a loss in -4898 and buying in -6685 = wash sale.
// The IRA wash sale is the WORST outcome because the loss
// is permanently gone (IRAs don't track cost basis the same way).
//
// SENTINEL WASH SALE PREVENTION:
// - Maintain a 61-day rolling log of all sells at a loss
// - Before any protective sell, check if the symbol was bought
//   in ANY account within the prior 30 days
// - After any sell at a loss, flag the symbol as RESTRICTED
//   for 31 days in ALL accounts
// - Alert if a dividend reinvestment would trigger a wash sale
// - Cross-account tracking: -4898, -6685, and any other accounts
//
// TAXGUARD v1.0 spec was built for this exact purpose.
// Integrate TAXGUARD logic into SENTINEL.

// TAX-LOSS HARVESTING:
// - Sell losing position to realize the loss
// - Buy a DIFFERENT but similar security (not "substantially identical")
// - Example: Sell SIL at a loss, buy SILJ (different index, same sector)
// - Can offset unlimited capital gains with capital losses
// - Can offset up to $3,000 of ordinary income per year
// - Excess losses carry forward indefinitely
// - SENTINEL flags harvesting opportunities in the compliance audit

// SHORT-TERM vs LONG-TERM CAPITAL GAINS:
// Held <1 year: Short-term, taxed as ordinary income (up to 37%)
// Held >1 year: Long-term, taxed at 0%, 15%, or 20%
// SENTINEL tracks holding period for every position
// Alerts when a position is approaching 1-year mark
// "Hold 12 more days to save $X in taxes" type notifications

// IRA vs TAXABLE ACCOUNT:
// -6685 (Rollover IRA): No tax on gains/losses inside the account
//   Wash sales STILL apply if crossing between IRA and taxable
//   No tax-loss harvesting benefit inside IRA
//   Required Minimum Distributions start at age 73
// -4898 (Taxable MLC): All gains/losses are taxable events
//   This is where tax-loss harvesting matters
//   This is where wash sale tracking is critical

// DIVIDEND TAX:
// Qualified dividends: Taxed at LTCG rates (0/15/20%)
//   Must hold stock 61+ days in 121-day window around ex-date
// Non-qualified dividends: Taxed as ordinary income
// SENTINEL tracks holding periods vs ex-dividend dates
// Alerts before selling a position that would disqualify dividends


// ════════════════════════════════════════════════════════════
// SECTION 7: MARKET RULES ENGINE
// ════════════════════════════════════════════════════════════

// TRADING HOURS:
// Regular session: 9:30 AM - 4:00 PM ET
// Pre-market: 7:00 AM - 9:30 AM ET (E*TRADE supports 7 AM)
// After-hours: 4:00 PM - 8:00 PM ET
// Extended hours orders: Limit only, no stops, no market orders
//
// SETTLEMENT:
// Equities: T+1 (trade date + 1 business day)
// Options: T+1
// Mutual funds: T+1 to T+2 depending on fund
// Cash not available for withdrawal until settled
// Can trade with unsettled funds in margin accounts (not cash/IRA)
//
// PATTERN DAY TRADER RULE:
// 4+ day trades in 5 business days = Pattern Day Trader
// Requires $25,000 minimum equity in margin account
// -4898 is not margin. -6685 is IRA. Neither qualifies.
// SENTINEL must prevent >3 day trades per 5 business days
// A day trade = buy and sell same security same day
// SENTINEL tracks round trips per rolling 5-day window
//
// GOOD-TIL-CANCELED (GTC) ORDERS:
// E*TRADE GTC orders expire after 60 calendar days
// SENTINEL re-submits GTC orders before expiry
// All stop orders should be GTC, not day-only
//
// ORDER TYPES USED BY SENTINEL:
// STOP (Stop on Quote): Triggers market order when price hits stop
// STOP_LIMIT: Triggers limit order when price hits stop
// LIMIT: For protective sells during regular hours
// TRAILING_STOP_PCT: Percentage-based trailing stop
//   WARNING: Trailing stop $ is DANGEROUS (the $280 SIL incident)
//   ALWAYS use percentage-based or Stop on Quote
//
// OPTIONS (FUTURE CAPABILITY):
// E*TRADE API supports full options trading
// Preview/Place for single and multi-leg orders
// Option chains and expiration dates available
// XSP paper trade protocol: credit spreads, 50% profit target, 2x stop
// 4 PM gamma reset cycle is core mechanic
// Tier: watch GEX > paper XSP > live XSP > scale SPX
// This is Phase 2. Not in v1.0 build.
//
// MARGIN:
// Not applicable to current accounts (-4898 cash, -6685 IRA)
// If margin account added later, SENTINEL must track:
//   Margin maintenance requirements
//   Margin call alerts
//   Forced liquidation thresholds

// FREE RIDING VIOLATION:
// Buying securities with unsettled funds, then selling
// before the original trade settles.
// IRA and cash accounts are most at risk.
// SENTINEL checks available settled cash before any sell
// that might trigger a cascade of unsettled fund usage.

// GOOD FAITH VIOLATION:
// Selling a security bought with unsettled funds before
// those funds have settled. 3 violations in 12 months
// results in 90-day restriction.
// SENTINEL tracks settlement dates and prevents sells
// that would trigger a good faith violation.


// ════════════════════════════════════════════════════════════
// SECTION 8: DATA MODEL
// ════════════════════════════════════════════════════════════

// SUPABASE TABLES:

// portfolio_snapshots:
//   id, account_id, timestamp, total_value, cash_balance,
//   invested_value, day_gain, day_gain_pct, total_gain,
//   total_gain_pct, position_count

// positions:
//   id, account_id, symbol, quantity, cost_basis, current_price,
//   market_value, unrealized_gain, unrealized_gain_pct,
//   day_gain, day_gain_pct, sector, ring, stop_price,
//   stop_type, date_acquired, holding_days, timestamp

// orders_open:
//   id, account_id, order_id, symbol, order_type, price_type,
//   limit_price, stop_price, quantity, status, placed_time,
//   order_term, last_checked

// trade_journal:
//   id, account_id, symbol, action (SELL/STOP/TRIM),
//   quantity, price, total_value, realized_gain, trigger,
//   ironclad_rule, wash_sale_check, timestamp

// wash_sale_tracker:
//   id, account_id, symbol, sell_date, sell_price, loss_amount,
//   restricted_until (sell_date + 31 days), status (ACTIVE/EXPIRED)

// compliance_log:
//   id, timestamp, check_type, result (PASS/FAIL/WARNING),
//   details, corrective_action

// alerts_sent:
//   id, timestamp, alert_type, message, channel (telegram/email),
//   acknowledged


// ════════════════════════════════════════════════════════════
// SECTION 9: TELEGRAM REPORTING FORMATS
// ════════════════════════════════════════════════════════════

// MORNING BRIEF (6:00 AM):
// Header: SENTINEL Morning Brief | [date]
// Account summaries: total value, cash, day change
// Position table: symbol, shares, cost, current, gain%, ring
// Open orders: all stops and limits with current distance
// Compliance status: PASS/FAIL with details
// Wash sale alerts: any restricted symbols
// Tax status: positions near 1-year mark
// Overnight gaps: any >3% moves

// STOP ALERT (real-time):
// STOP TRIGGERED: [symbol] in [account]
// Price: $X.XX (stop was $Y.YY)
// Action: [SELL executed / ALERT only]
// Fill: [pending/filled at $Z.ZZ]
// Wash sale check: [CLEAR/RESTRICTED]

// TRIM ALERT (real-time):
// TRIM CANDIDATE: [symbol] in [account]
// Gain: +X.X% ($X,XXX unrealized)
// IRONCLAD tier: [+10% = sell 50% / +20% = sell 60%]
// Action required: Manual confirmation

// COMPLIANCE ALERT:
// IRONCLAD VIOLATION: [description]
// Position: [symbol] at [X%] of portfolio (max 20%)
// Required action: [reduce by X shares]

// KILL SWITCH ALERT:
// CORRELATION KILL SWITCH ACTIVATED
// DXY: [level] | 10Y Yield: [level]
// Action: Auto 50% metals reduction
// Embargo: 48hrs from [timestamp]


// ════════════════════════════════════════════════════════════
// SECTION 10: ERROR HANDLING
// ════════════════════════════════════════════════════════════

// AUTH FAILURE:
// If OAuth token expired or invalid:
//   - Telegram alert: "SENTINEL AUTH FAILURE - Manual re-auth required"
//   - Use last cached portfolio snapshot for read operations
//   - Block ALL sell operations (cannot trade without valid auth)
//   - Retry auth every 15 minutes for 2 hours
//   - Escalate to email after 2 hours

// API RATE LIMIT:
// If 429 received:
//   - Back off exponentially (1s, 2s, 4s, 8s, 16s)
//   - Max 5 retries per call
//   - Log rate limit event
//   - Reduce poll frequency temporarily

// API TIMEOUT:
// If call takes >10 seconds:
//   - Cancel and retry once
//   - If second attempt fails, log and alert
//   - Use cached data for reporting
//   - Block sell operations until API confirms reachable

// MARKET DATA STALE:
// If quote timestamp >5 minutes old during market hours:
//   - Flag all dependent calculations as STALE
//   - Do not execute any protective sells on stale data
//   - Alert: "SENTINEL DATA STALE - [symbols]"

// ORDER REJECTION:
// If Place Order returns error:
//   - Log full error response
//   - Telegram alert with error details
//   - Do NOT retry automatically (could be duplicate order)
//   - Require manual intervention


// ════════════════════════════════════════════════════════════
// SECTION 11: CIL INTEGRATION
// ════════════════════════════════════════════════════════════

// SENTINEL feeds CIL in two ways:
//
// 1. AUTOMATED FEED: When COMPLIANCE AUDIT finds a violation,
//    it packages the portfolio data and violation details into
//    a CIL payload and POSTs to the CIL INTAKE webhook. The
//    Collective analyzes the situation and recommends action.
//    Principal reviews the recommendation before any execution.
//
// 2. ON-DEMAND: Principal can request CIL analysis of any
//    position by sending a Telegram command. SENTINEL pulls
//    current position data, enriches with market quotes and
//    HUNTER data, packages into CIL format, and fires the
//    pipeline. Result returns to Telegram.
//
// FORMAT: Same JSON structure as CIL TEST SCENARIO SELECTOR.
//    domain: "MARKET"
//    query: "[thesis/question about the position]"
//    context: "[current market conditions]"
//    domaindata: {
//      ticker, price, volume, rsi, macd, short_interest,
//      cost_basis, unrealized_gain_pct, holding_days, ring,
//      stop_distance, sector_concentration, portfolio_pct
//    }


// ════════════════════════════════════════════════════════════
// SECTION 12: SECURITY
// ════════════════════════════════════════════════════════════

// API credentials stored in .env file on n8n server, never in workflow JSON
// OAuth tokens cached with AES-256 encryption at rest
// All sell orders require Preview before Place (no direct Place calls)
// Telegram bot token is dedicated to SENTINEL (separate from CIL)
// GitHub push uses separate token scoped to AIORA repo only
// No credentials in logs, error messages, or Telegram alerts
// Principal's Telegram chat ID is the only authorized recipient
// All API calls logged with timestamp, endpoint, response code
// Audit trail maintained in Supabase (immutable append-only)


// ════════════════════════════════════════════════════════════
// SECTION 13: PHASE 1 BUILD SCOPE (MVP)
// ════════════════════════════════════════════════════════════

// Phase 1 delivers read-only monitoring + alerting. No sells.
//
// INCLUDED:
//   - OAuth authentication flow (Python middleware)
//   - Account list + balance pull
//   - Portfolio position pull
//   - Real-time quotes for held symbols
//   - Open orders list
//   - IRONCLAD compliance checks
//   - Morning brief to Telegram
//   - Stop distance monitoring + alerts
//   - Trim candidate alerts
//   - Wash sale tracking
//   - GitHub archive of daily snapshots
//
// NOT INCLUDED (Phase 2):
//   - Auto protective sells
//   - Stop order placement/modification
//   - Trailing stop management
//   - Options monitoring
//   - CIL integration
//   - After-hours monitoring
//   - Overnight watch
//
// REASON: Get read-only working and trusted first.
// Prove the data is accurate. Prove the alerts are reliable.
// Then and only then do we add execution capability.


// ════════════════════════════════════════════════════════════
// SECTION 14: n8n NODE MAP (Phase 1)
// ════════════════════════════════════════════════════════════

// NODE 1: Schedule Trigger
//   Cron: */30 6-20 * * 1-5 (every 30 min, 6AM-8PM, Mon-Fri)
//   Timezone: America/New_York
//
// NODE 2: Token Check
//   Code node. Reads cached OAuth tokens.
//   If expired: fires error path. If valid: passes tokens forward.
//
// NODE 3: Account List
//   HTTP Request. GET /v1/accounts/list
//   OAuth 1.0a signed request.
//   Output: array of account objects with accountIdKey.
//
// NODE 4: Loop Accounts
//   Split In Batches. Iterates each account.
//
// NODE 5: Get Balance
//   HTTP Request. GET /v1/accounts/{accountIdKey}/balance
//   Params: instType=BROKERAGE, realTimeNAV=true
//
// NODE 6: Get Portfolio
//   HTTP Request. GET /v1/accounts/{accountIdKey}/portfolio
//   Params: count=250, view=COMPLETE
//
// NODE 7: Get Open Orders
//   HTTP Request. GET /v1/accounts/{accountIdKey}/orders
//   Params: status=OPEN
//
// NODE 8: Get Quotes
//   HTTP Request. GET /v1/market/quote/{symbols}
//   Symbols: comma-separated list of all held symbols (max 25 per call)
//
// NODE 9: Position Analyzer
//   Code node. For each position:
//     - Calculate unrealized gain %
//     - Determine ring classification
//     - Calculate stop distance (current price vs IRONCLAD stop)
//     - Check position size % of total portfolio
//     - Check sector concentration
//     - Check holding period (short-term vs long-term)
//     - Flag wash sale restricted symbols
//     - Flag trim candidates (+10%, +20%)
//     - Flag stop violations (no stop set, stop too far)
//
// NODE 10: Compliance Engine
//   Code node. Evaluates IRONCLAD rules:
//     - Position sizing (max 20%)
//     - Sector concentration (max 35%)
//     - Ring allocation (Ring 1 target 40-50%)
//     - Cash minimum (15% recommended)
//     - Stop coverage (all Ring 2-4 must have stops)
//     - Day trade count (<4 in 5 days)
//     - Good faith violation risk
//
// NODE 11: Report Builder
//   Code node. Assembles Telegram message and GitHub JSON.
//
// NODE 12: Telegram Delivery
//   HTTP Request. POST to Telegram API.
//   Chat ID: 8203545338
//
// NODE 13: GitHub Archive
//   HTTP Request. PUT to GitHub API.
//   Path: AIORA/SENTINEL/snapshots/[date]/[timestamp].json
//
// NODE 14: Supabase Log
//   HTTP Request. POST to Supabase API.
//   Inserts portfolio_snapshot + positions rows.
//
// NODE 15: Alert Router
//   IF node. Routes to alert-specific Telegram messages
//   if any violations, trim candidates, or stop warnings found.
//
// NODE 16: Error Handler
//   Catches all failures. Sends Telegram alert.
//   Logs error to Supabase compliance_log.


// ════════════════════════════════════════════════════════════
// SECTION 15: FILES TO DOWNLOAD / REFERENCE
// ════════════════════════════════════════════════════════════

// E*TRADE API Documentation:
//   https://developer.etrade.com/getting-started
//   https://apisb.etrade.com/docs/api/account/api-account-v1.html
//   https://apisb.etrade.com/docs/api/account/api-portfolio-v1.html
//   https://apisb.etrade.com/docs/api/account/api-balance-v1.html
//   https://apisb.etrade.com/docs/api/account/api-transaction-v1.html
//   https://apisb.etrade.com/docs/api/account/api-alert-v1.html
//   https://apisb.etrade.com/docs/api/market/api-quote-v1.html
//   https://apisb.etrade.com/docs/api/market/api-market-v1.html
//   https://apisb.etrade.com/docs/api/order/api-order-v1.html
//
// pyetrade (Python wrapper):
//   https://github.com/jessecooper/pyetrade
//   pip install pyetrade
//
// IRS Wash Sale Rule:
//   IRC Section 1091
//   IRS Publication 550 (Investment Income and Expenses)
//   https://www.irs.gov/publications/p550
//
// Pattern Day Trader:
//   FINRA Rule 4210
//   https://www.finra.org/investors/learn-to-invest/advanced-investing/day-trading-margin-requirements-know-rules
//
// Settlement Rules:
//   SEC Rule 15c6-1 (T+1 settlement)
//
// Capital Gains Tax Rates:
//   IRS Topic 409
//   https://www.irs.gov/taxtopics/tc409
//
// Good Faith / Free Riding:
//   Federal Reserve Regulation T
//   FINRA Rule 4210


// ════════════════════════════════════════════════════════════
// SECTION 16: SUCCESS CRITERIA
// ════════════════════════════════════════════════════════════

// Phase 1 is COMPLETE when:
//   1. OAuth authenticates and renews for 24hrs without manual intervention
//   2. All 4 accounts return accurate balance and position data
//   3. Morning brief delivers to Telegram by 6:15 AM ET every weekday
//   4. Position data matches E*TRADE web UI within $0.01 per position
//   5. IRONCLAD compliance check runs with zero false positives for 5 consecutive days
//   6. Wash sale tracker correctly identifies all restricted symbols
//   7. Stop distance calculations match manual verification
//   8. GitHub archive accumulates 5 days of clean snapshots
//   9. No auth failures during market hours for 5 consecutive days
//   10. Rate limits never exceeded (all calls within 7,000/hr budget)
//
// Phase 2 is COMPLETE when:
//   1. Protective sell executes correctly in sandbox environment
//   2. Protective sell executes correctly with 1-share live test
//   3. Stop orders place/modify correctly via API
//   4. Kill Switch triggers and executes 50% metals reduction
//   5. Wash sale prevention blocks a sell that would create a violation
//   6. CIL integration returns analysis for any position on demand
//   7. 30 consecutive days of zero errors in production
