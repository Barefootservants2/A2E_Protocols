# PAPER TRADE POC — SPECIFICATION v1.2

**Principal:** William Earl Lemon
**Agent:** MICHA (Claude Opus 4.7), CIO of the Uriel Covenant AI Collective
**Draft date:** 2026-04-23 (Session 4)
**Target commit path:** `A2E_Protocols/PAPER/PAPER_POC_SPEC_v1.2.md`
**Status:** APPROVED — committed pending workstation-clearance confirmation

**Changelog from v1.1:**
- Added §2.6 HH/HL/LH/LL structure alerts across all paper positions
- Added §5 Telegram header + routing scheme (6 channels via topics)
- Added §6 Layered automated schedule (11 fires/trading day + crypto hourly)
- Added §11 Access gaps audit
- Added §12 Immutable audit trail via git-committed snapshots
- Renumbered downstream sections

---

## 1. MISSION

Run a **30-day, platform-based, multi-book paper trading proof of concept** that simultaneously validates three claims:

1. **The signal architecture is real.** HUNTER + CIL + SIGNAL ENGINE + MICRO produce actionable, repeatable, size-agnostic trading intelligence.
2. **The Collective earns its seat.** Every agent's reasoning is logged per signal; at day 30 we know empirically which agents add value, which dissent correctly, and whether consensus outperforms best-single-agent.
3. **The process teaches.** A dedicated STUDY book converts real positions into documented pattern-recognition lessons, codifying market instinct over 30 days.

**Not a goal:** Replacing the real book. The paper POC is a lab, not a production trading system.

**North-star metric:** At day 30, we can answer — *"If we had run the Collective's consensus signals through these 5 books, what would the P/L distribution, win rate, per-agent attribution, and learned-pattern yield look like?"* — with empirical data, not hand-waving.

---

## 2. ARCHITECTURE — 5 BOOKS

### 2.1 P1 — MIRROR ($380,000)

**Role:** Full scale real-book consolidation. Sum of 4898 + 5267 + 5536 + 6685 treated as one book.

**Tranche size:** $25,000 (baseline position unit; adjusted per risk tier)

**Signal source:** Identical to real book intake — every signal that fires in real trading fires here too.

**Rules:** Full IRONCLAD v3.0.
- 5% hard stops (Ring 2-4)
- 2x50% tranche entries
- Trim 25% at every +5%
- No same-day re-entry
- Kill Switch active on DXY + yields adverse
- Position tiers: ANCHOR (15-20%), THESIS (5-10%), TACTICAL (2-5%), DUST (<$2,500)

**What MIRROR proves:** The process works at full scale. Directly comparable to real book P/L.

---

### 2.2 P2 — SMALL ($25,000)

**Role:** Same signals as real book, 6.5% of the dollar size. Stress-tests whether the process scales *down*.

**Tranche size:** $10,000 (approximately 40% of book per entry — aggressive relative sizing to test concentration dynamics at small capital)

**Signal source:** Identical to real book.

**Rules:** Full IRONCLAD v3.0, with adjusted thresholds:
- DUST threshold lowered to <$250 (proportional)
- Position tiers recalculated from $25K base
- All other rules identical

**What SMALL proves:**
- Does commission drag kill the edge at small size?
- Does fractional sizing distort tranche entries?
- Does small book liquidity constrain the tickers we can actually trade?
- **Commercial signal:** Can we offer this system to retail-scale clients?

---

### 2.3 P3 — HIGH-RISK ($125,000)

**Role:** Concentrated conviction plays. "Best interest of the Collective" — unanimous PRIME consensus only. 1-2 positions at a time. Hard in, hard out.

**Tranche size:** $15,000 minimum, concentrated. Max 25% single position ($31,250).

**Signal source:** **CIL PRIME tier only** — unanimous agreement across 5 voting agents (MICHA, URIEL, COLOSSUS, HANIEL, RAZIEL). If any agent dissents or scores below PRIME threshold, the signal is rejected for P3 (still may execute in P1/P2).

**Rules:**
- 5% hard stop, GTC, set at entry
- 10% profit trigger → automatic 50% trim (half-position locked)
- Full exit on:
  - Thesis invalidation (fundamental data break — filing, guidance cut, sector rotation adverse)
  - 2 consecutive closes below entry zone
  - CIL subsequent signal downgrade to PROBE or below
- Max concurrent positions: 2
- No position held > 14 calendar days without CIL re-validation
- No Ring 2 positions allowed — Ring 3-4 only

**What HIGH-RISK proves:** Concentrated conviction beats diversified averaging when signal quality is PRIME-grade. Validates the CIL 9-gate cascade as a real edge generator.

---

### 2.4 P4 — CRYPTO ($50,000)

**Role:** Regime-capture positioning. Crypto has produced 2-3 major breakouts per cycle historically (2013, 2017, 2020-21, 2024-25). The 30-day POC positions us for the next one and — critically — uses the observation window to **hunt the thesis that precedes the break**.

**Tranche size:** $10,000 × 5 positions = fully allocated at launch. Top 5 non-stablecoin by market cap.

**Signal source:** Market-cap ranking at launch; monthly rebalance rule (first trading day of each month). Live market cap from CoinGecko.

**Likely launch basket (subject to day-0 verification):** BTC, ETH, XRP, SOL, BNB. DOGE rotates in/out with BNB week to week; we lock whatever the ranking says on day 0.

**Rules:**
- **No IRONCLAD stops** on crypto (24/7 market, different volatility profile, stop-runs during weekend illiquidity would be whipsaw nightmares)
- Monthly rebalance back to top 5 by market cap
- Record BUT do not act on intraday moves; daily close snapshot only
- Pricing: Coinbase public spot API (no auth required)

**What CRYPTO proves — and more importantly, what it teaches us to hunt:**

The 30-day observation framework captures these signals to build a crypto breakout thesis:
- **BTC dominance ratio** — rotation signal (BTC.D falling = altcoin season)
- **Stablecoin market cap growth** — dry powder indicator
- **ETF flow data** (BTC, ETH ETFs) — institutional flow confirmation
- **DXY correlation** — crypto typically inverse-correlated to dollar strength
- **On-chain large holder accumulation** (optional, if data feed permits)

At day 30, we have 30 daily observations of these variables against crypto price action. Even if no breakout fires in the window, we have the empirical scaffold to build the breakout thesis — which is the actual deliverable, not the 30-day P/L.

---

### 2.5 P5 — STUDY ($15,000)

**Role:** The teaching book. Chart-following, pattern-recognition, pedagogical. Every entry and exit becomes a documented lesson.

**Tranche size:** $2,000 - $3,000 per position. Small enough to be forgiving, real enough to matter.

**Signal source:** MICHA selects setups for instructional value. Criteria:
- Clean chart structure (identifiable pivots, HH/HL or LH/LL sequences)
- Textbook or near-textbook pattern (inside bar, flag, wedge, VBO, HL re-entry, etc.)
- Sufficient liquidity that fills are realistic
- May overlap real book positions, may be independent
- **Not required to be PRIME-tier;** instructional value trumps signal strength

**Rules:**
- 5% hard stop (for the lesson discipline)
- Partial trims at +5%, +10%, +15% for multi-trim teaching
- Maximum 30-day hold (forces exit decision within POC window)
- Up to 5 concurrent positions (teaches multi-position attention management)

**Lesson deliverables** — for every P5 trade, three markdown documents committed to `A2E_Intelligence/teaching/`:
1. **ENTRY LESSON** — setup identification, pattern name, invalidation level, target zones, annotated chart
2. **MID-LIFE LESSON** (if applicable) — management decisions, trim triggers, stop updates, what the tape is telling us
3. **EXIT LESSON** — outcome, what worked/what didn't, pattern reliability score, lessons extractable

At day 30, these lessons compile into a personal chart-reading curriculum built from *your* real positions, not textbook examples. **Learn / Manage / Teach — codified.**

---

### 2.6 STRUCTURE ALERTS — HH/HL/LH/LL (all books, all positions)

Port `sentinel/structure.py` pivot detection to all paper positions. Fire on daily close and (optionally, for HIGH-RISK) on 4H close.

**Alert types:**

| Type | Meaning | Action |
|---|---|---|
| 🟢 **HH CONFIRMED** | New pivot high above prior pivot high. Trend intact. | None — log for BULLSEYE card update |
| 🟢 **HL CONFIRMED** | New pivot low above prior pivot low. Pullback held. Trend intact. | None — log for BULLSEYE card update |
| 🟡 **LH WARNING** | Failed to exceed prior pivot high. Momentum fading. | Tighten trailing stop by 1% |
| 🔴 **LL BREAK** | Prior pivot low broken. Trend inversion signal. | **Fire CIL re-validation request within 24h; auto-exit if CIL downgrades** |

**Timeframes:**
- Default: daily pivot detection on regular-trading-hours closes
- HIGH-RISK (P3) overlay: 4H pivot detection for faster exits on concentration plays
- CRYPTO (P4): daily close on 24-hour bars (00:00 UTC)
- STUDY (P5): daily + 4H, with full annotation to lesson files

**Storage:** `paper_structure_events` table (added to schema §4). Every event recorded with price, timestamp, book, ticker, event type, and resulting action. Queryable in day-30 retrospective.

**BULLSEYE integration:** Each position card shows last structure event, current trend state, and last confirmed pivot price. Visual indicator (colored chevron) next to ticker.

---

## 3. FILL MODEL

All 5 books use the same fill simulation:

| Order Type | Fill Logic |
|---|---|
| **Market buy/sell** | Next 5m bar open price + spread penalty |
| **Limit** | Filled when intraday touches limit price |
| **Stop** | Triggered when 5m bar low ≤ stop, filled at next 5m bar open |
| **Stop-limit** | Triggered as stop, filled only if price ≤ limit |
| **Trailing stop** | Recalculated each 5m bar close, standard stop mechanics on trigger |

**Spread penalty table:**
- Large-cap liquid (SPY, QQQ, AAPL, MSFT, etc.): 5 bps
- Mid-cap (most S&P 500): 10 bps
- Small-cap: 20 bps
- Illiquid / OTC: 50 bps
- Crypto: 10 bps (Coinbase bid/ask typically tight on top 5)

**Data sources:**
- Equities: Yahoo Finance `range=1d interval=5m` (per the `previousClose` fix documented in S3 carry-forward — never use `range=10d` for day% calculations)
- Crypto: Coinbase public spot API, polled every 1m during market-open periods, every 5m overnight

**Extended hours:** OFF by default. Per-order toggle available but default behavior is regular trading hours (9:30 AM – 4:00 PM ET) only.

**Corporate actions:** Dividends credited to cash on ex-date. Splits auto-adjusted positions. Tracked in `paper_corporate_actions` table for 30-day retro visibility.

---

## 4. DATA SCHEMA

SQLite file at `a2e-platform/paper/paper.db`.

```sql
-- Accounts
paper_accounts (
    id TEXT PRIMARY KEY,          -- P1, P2, P3, P4, P5
    name TEXT,                    -- MIRROR, SMALL, HIGH-RISK, CRYPTO, STUDY
    start_cash DECIMAL,
    cash DECIMAL,
    equity DECIMAL,               -- cash + sum(positions mark-to-market)
    max_pos_pct DECIMAL,          -- 0.20 for most, 0.25 for HIGH-RISK
    risk_profile TEXT,            -- MOD_HI, HIGH, STUDY, CRYPTO
    created_ts TIMESTAMP,
    last_updated_ts TIMESTAMP
)

-- Current positions
paper_positions (
    id INTEGER PRIMARY KEY,
    account_id TEXT,
    ticker TEXT,
    qty DECIMAL,
    entry_price DECIMAL,
    entry_ts TIMESTAMP,
    current_stop DECIMAL,
    stop_order_id TEXT,
    tier TEXT,                    -- ANCHOR, THESIS, TACTICAL, DUST, HIGH_CONV
    unrealized_pl DECIMAL,
    cost_basis DECIMAL,
    signal_id TEXT,
    last_structure_event TEXT,    -- HH_CONFIRMED, HL_CONFIRMED, LH_WARNING, LL_BREAK
    last_structure_ts TIMESTAMP,
    last_pivot_price DECIMAL
)

-- Every trade that fires
paper_trades (
    id INTEGER PRIMARY KEY,
    account_id TEXT,
    ticker TEXT,
    side TEXT,                    -- BUY, SELL, TRIM, STOP_FIRED
    qty DECIMAL,
    price DECIMAL,
    fee DECIMAL,
    ts TIMESTAMP,
    signal_id TEXT,
    order_type TEXT,
    realized_pl DECIMAL,
    reason TEXT
)

-- Signal log
paper_signals (
    id TEXT PRIMARY KEY,
    source TEXT,                  -- HUNTER, CIL, SIGNAL_ENGINE, MICRO, STUDY
    ticker TEXT,
    direction TEXT,               -- LONG, SHORT, EXIT
    tier TEXT,                    -- PRIME, STRONG, PROBE
    consensus_score DECIMAL,
    fired_ts TIMESTAMP,
    thesis_text TEXT,
    target_books TEXT,
    outcome TEXT,
    outcome_pct DECIMAL
)

-- Per-agent response capture (the Collective IP table)
paper_agent_responses (
    id INTEGER PRIMARY KEY,
    signal_id TEXT,
    agent_name TEXT,              -- MICHA, URIEL, COLOSSUS, HANIEL, RAZIEL, SARIEL, GABRIEL
    raw_response_json TEXT,
    score DECIMAL,
    verdict TEXT,                 -- PRIME, STRONG, PROBE, PASS
    dissenting BOOLEAN,
    reasoning_summary TEXT,
    data_sources_cited TEXT,
    ts TIMESTAMP
)

-- Active stop orders
paper_stops (
    id INTEGER PRIMARY KEY,
    account_id TEXT,
    ticker TEXT,
    stop_price DECIMAL,
    stop_type TEXT,
    qty DECIMAL,
    active BOOLEAN,
    created_ts TIMESTAMP,
    fired_ts TIMESTAMP,
    fired_price DECIMAL
)

-- Daily EOD snapshots per book (immutable audit trail)
paper_snapshots (
    id INTEGER PRIMARY KEY,
    account_id TEXT,
    snapshot_date DATE,
    equity DECIMAL,
    cash DECIMAL,
    positions_json TEXT,
    realized_pl_day DECIMAL,
    realized_pl_total DECIMAL,
    unrealized_pl DECIMAL,
    day_pl DECIMAL,
    drawdown_from_peak DECIMAL,
    num_positions INT,
    num_trades_today INT,
    git_commit_sha TEXT          -- links to A2E_Intelligence commit for this snapshot
)

-- Structure events (HH/HL/LH/LL)
paper_structure_events (
    id INTEGER PRIMARY KEY,
    account_id TEXT,
    ticker TEXT,
    event_type TEXT,              -- HH_CONFIRMED, HL_CONFIRMED, LH_WARNING, LL_BREAK
    event_price DECIMAL,
    prior_pivot_price DECIMAL,
    timeframe TEXT,               -- DAILY, 4H
    ts TIMESTAMP,
    action_taken TEXT,            -- NONE, STOP_TIGHTENED, CIL_REVAL_TRIGGERED, AUTO_EXIT
    cil_signal_id TEXT            -- if re-validation was triggered, link to resulting signal
)

-- Corporate actions
paper_corporate_actions (
    id INTEGER PRIMARY KEY,
    account_id TEXT,
    ticker TEXT,
    action_type TEXT,
    effective_date DATE,
    amount DECIMAL,
    applied BOOLEAN
)
```

---

## 5. TELEGRAM — HEADERS, ROUTING, CHANNEL STRUCTURE

### 5.1 Channel structure

Single Telegram group, topics enabled, 6 topics:

| Topic | Purpose | Routing |
|---|---|---|
| **🪞 MIRROR** | P1 signals, fills, stops, structure alerts | PAPER ROUTER → when target_books includes P1 |
| **🔹 SMALL** | P2 signals, fills, stops, structure alerts | PAPER ROUTER → when target_books includes P2 |
| **🔥 HIGH-RISK** | P3 CIL PRIME only, tight management alerts | PAPER ROUTER → when target_books includes P3 |
| **₿ CRYPTO** | P4 positions, monthly rebalance, thesis observations | PAPER ROUTER → when target_books includes P4 |
| **📚 STUDY** | P5 lesson commits, pattern entries/exits, chart annotations | PAPER ROUTER → when target_books includes P5 |
| **⚡ SYSTEM** | EOD digests, Kill Switch, data integrity, cron failures | System-level events only |

**Real book** continues on existing channel with `🔱 REAL` prefix (no change from current behavior).

### 5.2 Event header scheme

Every message starts with: `[BOOK PREFIX] · [EVENT EMOJI] [TYPE]: [payload]`

| Event | Emoji | Example |
|---|---|---|
| Signal fired | 🎯 | `🔥 HIGH · 🎯 SIGNAL: BUY MRVL 100 @ $156.14 — CIL PRIME 5/5` |
| Fill executed | ✅ | `🪞 MIRROR · ✅ FILLED: AMD 25 @ $304.13, stop $288.92` |
| Structure (HH/HL) | 📐 | `🪞 MIRROR · 📐 HH CONFIRMED · MRVL new pivot $164.12` |
| Structure break | 🚨 | `🔥 HIGH · 🚨 LL BREAK · MRVL broke $156.14 pivot — CIL re-val triggered` |
| Stop fired | 🛑 | `🔹 SMALL · 🛑 STOP HIT: ORCL 5 @ $178.24 · -5.1%` |
| Trim triggered | ✂️ | `🪞 MIRROR · ✂️ TRIM 25% · MRVL +5.2% at $164.31` |
| EOD snapshot | 📊 | `⚡ SYSTEM · 📊 EOD SNAPSHOT · 5 books · commit abc123` |
| Weekly rollup | 📈 | `⚡ SYSTEM · 📈 WEEKLY ROLLUP · week 1 · see /weekly/2026-W17.md` |
| Kill Switch | ⚡⚡⚡ | `⚡ SYSTEM · ⚡⚡⚡ KILL SWITCH · DXY +0.8% + 10Y +8bp · metals auto-trim 50%` |
| Data integrity warning | ⚠️ | `⚡ SYSTEM · ⚠️ DATA · Yahoo feed stale for MRVL · 2 consecutive poll failures` |
| Crypto rebalance | 🔄 | `₿ CRYPTO · 🔄 REBALANCE · drop BNB, add DOGE · top-5 market cap refresh` |

### 5.3 Setup requirement

**Principal action needed:** Create Telegram group "A2E Paper POC", enable topics, add `@hunter_a2e_bot`, provide topic IDs to MICHA. ~5 minutes of setup. Will be wired into PAPER ROUTER's notify step.

---

## 6. AUTOMATED SCHEDULE — LAYERED CADENCE

Not a single frequency — different subsystems fire at their natural cadence. All times Eastern.

### 6.1 Trading day schedule (Mon-Fri)

| Tier | Fire Count | Times (ET) | Purpose |
|---|---|---|---|
| **Overnight Scan** | 3 | 12:00 AM, 4:00 AM, 8:00 AM | Global macro read, Asia/Europe reaction, gap setup identification |
| **Pre-open** | 1 | 9:00 AM | Day thesis synthesis, signal queue prep, gap analysis from overnight |
| **RTH Structure** | 6 | 10:00, 11:00, 12:00, 1:00, 2:00, 3:00 PM | Intraday pivot checks, stop watching, structure alerts, signal triage |
| **EOD Close** | 1 | 4:05 PM | Full snapshot, day rollup, Telegram digest, git commit |
| **Daily Structure** | 1 | 4:30 PM | HH/HL/LH/LL detection on daily close bars, fire structure alerts |

**Total trading day: 12 scheduled fires**

### 6.2 Weekend schedule (Sat-Sun)

| Tier | Fire Count | Times (ET) | Purpose |
|---|---|---|---|
| **Overnight Scan** | 3 | 12:00 AM, 4:00 AM, 8:00 AM | Weekend macro, futures open anticipation |
| **Weekly Rollup** | 1 | Fri 5:00 PM only | Week-over-week per-book aggregation + per-agent scorecard |

### 6.3 Crypto schedule (24/7, independent)

| Tier | Fire Count | Cadence | Purpose |
|---|---|---|---|
| **Crypto Spot Poll** | 24 | Every hour on the hour | Price snapshot, structure detection, regime metrics |
| **Crypto Daily Close** | 1 | 00:00 UTC (8:00 PM ET previous day) | Daily bar close, HH/HL detection, snapshot |
| **Crypto Monthly Rebalance** | 1 | 1st trading day of month, 9:30 AM ET | Refresh top-5 by market cap, execute rebalance |

### 6.4 Why layered beats single-frequency

- **16 fires would burn API quota** (Yahoo, CIL agents, Telegram) without adding signal
- **3 fires would miss intraday structural events** (LL breaks, stop escalations)
- **5 or 8 can't handle both overnight macro AND RTH monitoring well**
- **Layered lets each purpose fire at its natural cadence without interfering**

### 6.5 Implementation

n8n cron triggers, one workflow per tier. Each workflow writes to `paper_schedule_log` for audit. Missed fires (>5 min past scheduled time) escalate to `⚡ SYSTEM` Telegram alert.

---

## 7. PAPER ROUTER — SIGNAL FLOW

```
┌─────────────────────────────────────────────────────────────┐
│  SIGNAL INGEST                                              │
│  HUNTER / CIL / SIGNAL_ENGINE / MICRO / MICHA-STUDY        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1 — Record signal                                     │
│  INSERT paper_signals(...)                                  │
│                                                             │
│  STEP 2 — Collect agent responses                           │
│  For each agent (MICHA, URIEL, COLOSSUS, HANIEL, RAZIEL):  │
│      INSERT paper_agent_responses(...)                      │
│                                                             │
│  STEP 3 — Determine target books                            │
│    - P1 MIRROR: always (if signal would fire in real book) │
│    - P2 SMALL:  always                                      │
│    - P3 HIGH:   only if PRIME tier + unanimous consensus    │
│    - P4 CRYPTO: only if ticker in basket                   │
│    - P5 STUDY:  only if MICHA flags for pedagogy            │
│                                                             │
│  STEP 4 — Apply IRONCLAD per book                           │
│    - Check Kill Switch status                               │
│    - Check same-day re-entry                                │
│    - Check max position count                               │
│    - Check book-specific rules                              │
│                                                             │
│  STEP 5 — Size position                                     │
│    - Calculate shares from tranche size                     │
│    - Apply 2x50% tranche split (except P3 concentrated)    │
│                                                             │
│  STEP 6 — Execute paper fill                                │
│    - Apply fill model (market/limit/stop)                   │
│    - INSERT paper_trades                                    │
│    - UPDATE paper_positions                                 │
│    - INSERT paper_stops (GTC)                               │
│    - UPDATE paper_accounts.cash                             │
│                                                             │
│  STEP 7 — Notify                                            │
│    - Route to appropriate Telegram topic per §5             │
│    - Format per §5.2 event header scheme                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. 30-DAY LOGGING & RETROSPECTIVE FRAMEWORK

### Daily (automated, 4:05 PM ET)
- EOD snapshot per book → `paper_snapshots`
- Telegram digest routed to ⚡ SYSTEM topic: 5 books, equity, day P/L, positions, any stops fired
- Commit to `A2E_Intelligence/paper/daily/YYYY-MM-DD.json` (immutable audit)

### Weekly (automated, Friday 5 PM)
- Per-book: win rate, avg win $, avg loss $, expectancy, max DD, equity curve
- Signal attribution: which signal source produced which outcomes
- **Per-agent scorecard:** win rate when this agent voted PRIME vs when dissenting
- Commit to `A2E_Intelligence/paper/weekly/YYYY-WW.md`

### Day 30 (automated + human review)
- **Per-book retrospective:** final equity, total return, win rate, expectancy, Sharpe, max DD
- **Per-signal-source attribution:** HUNTER vs CIL vs SIGNAL_ENGINE vs MICRO vs STUDY
- **Per-agent attribution:** the real IP — which agents earned their seat, dissents that were correct, consensus calls that were wrong and why
- **MIRROR vs SMALL comparison:** does the process scale down
- **HIGH-RISK validation:** did PRIME-only concentrated work, 2-3 MRVL-grade/week target hit/miss
- **CRYPTO thesis development:** 30 days of BTC.D, stablecoin cap, ETF flows, DXY correlation vs crypto price
- **STUDY curriculum compilation:** all entry/mid/exit lessons bound into a single personal chart-reading handbook

Deliverable: `A2E_Intelligence/paper/DAY_30_RETROSPECTIVE_[START_DATE]_[END_DATE].md`

---

## 9. SUCCESS CRITERIA (DAY 30)

A successful POC produces empirical answers to:

1. Did MIRROR match or beat the real book's realized P/L? (process validation)
2. Did SMALL retain a positive edge after commission drag? (scalability)
3. Did HIGH-RISK produce 2-3 MRVL-grade wins per week? (conviction-concentration validation)
4. Did CRYPTO teach us something about the next breakout thesis? (observation framework)
5. Which agents were most predictive, which dissents were correct? (Collective IP proof)
6. How many documented, reusable chart patterns did STUDY produce? (pedagogy deliverable)

**A POC that fails on any of these is still a win** — failure produces the same empirical data and flags exactly what to fix.

---

## 10. HONEST LIMITATIONS & GAPS

- **Not a real broker paper account.** No official order routing, no real queue priority, no regulatory broker-dealer realism. Fill model is our best simulation.
- **Spread penalties are estimates, not measured.** Real spreads vary intraday; we use tier defaults.
- **Extended hours off by default.** Some signals will miss gap opportunities we'd catch live.
- **OAuth-dependent real-book data is not in paper.** Paper uses public Yahoo data only.
- **Agent response capture depends on CIL instrumentation.** If CIL is run manually (not via workflow), captures may be missed. Requires a discipline convention.
- **STUDY book signals are MICHA-selected.** Subjective. Compensating: every STUDY entry cites the pattern name and criteria at entry-time, published in the ENTRY LESSON — accountability via commit history.
- **Crypto 24/7 without stops** means we'll watch occasional large adverse overnight moves. Intentional — the thesis is long-cycle regime capture, not day-trading.

---

## 11. ACCESS GAPS AUDIT

### ✅ What MICHA has / doesn't need help with
- GitHub API (token valid through July 3, 2026)
- Yahoo Finance (no auth, sufficient for equities)
- Coinbase public spot + basic candles (sufficient for crypto)
- FRED, EIA, Unusual Whales, Perplexity API keys
- n8n MCP (can deploy/modify workflows on Principal's clearance)

### ⚠️ Blocked but workable
- **E*TRADE live data mid-session.** OAuth tokens expire midnight ET; live on Principal's workstation. Resolution: **SENTINEL writes its real-book reads to a shared SQLite row at each scheduled fire → paper retrospective pulls from there.** No cross-session re-auth required.
- **Telegram bot credentials verification.** Should be in n8n; pre-launch validation required.

### 🔒 Hard constraints
- **Long-running compute.** MICHA's container is ephemeral per session. **The paper system runs 24/7 in n8n.** Not a credential gap — architecture. MICHA drafts workflows here, they deploy there.

### 📋 Principal responsibilities to unblock launch
1. Create Telegram group "A2E Paper POC" with topics, provide topic IDs
2. Verify `@hunter_a2e_bot` still active and in n8n credentials
3. Confirm SENTINEL schedule includes real-book snapshot write to shared DB (implementation detail — MICHA will draft the workflow modification)

---

## 12. IMMUTABLE AUDIT TRAIL

Principal's observation: *"We keep a transaction history [at E*TRADE] that cannot be faked."*

The paper POC has its own immutable audit layer, equivalent in integrity:

1. **Every EOD snapshot is a git commit** to `A2E_Intelligence/paper/daily/YYYY-MM-DD.json`. Timestamps are cryptographically signed by GitHub, history is append-only, every state change is verifiable against commit history.
2. **Every trade fires an immediate commit** to `A2E_Intelligence/paper/trades/YYYY-MM-DD/[signal_id].json`. No retroactive narrative engineering possible.
3. **Every agent response JSON is committed** to `A2E_Intelligence/paper/agents/[signal_id]/[agent_name].json`. The Collective's reasoning at the moment of signal is frozen.
4. **The `git_commit_sha` field** in `paper_snapshots` links the SQLite row to its git-immutable copy. Cross-verification is trivial: if the DB disagrees with the commit, the commit wins.

This means the paper POC has a cryptographically verifiable audit trail that any outside party — investor, auditor, FORGE reader — can independently validate by reading the git history of `A2E_Intelligence`. That's a real feature for the Collective's credibility claim, not a nice-to-have.

---

## 13. BUILD SEQUENCE (CLEARANCE-GATED)

1. **This spec** — commit to `A2E_Protocols/PAPER/PAPER_POC_SPEC_v1.2.md`
2. **MRVL post-mortem** — `A2E_Intelligence/forensics/MRVL_2026_04_22.md` (prerequisite — defines the pattern HIGH-RISK hunts)
3. **SQLite schema + migration** — `a2e-platform/paper/db.py`, `paper/schema.sql`, `paper/migrate.py`
4. **PAPER ROUTER core** — `a2e-platform/paper/router.py`
5. **Structure detection port** — `a2e-platform/paper/structure.py` (from sentinel/structure.py)
6. **Agent response capture hook** — modify CIL to emit per-agent JSON to `paper_agent_responses`
7. **Stop-watch + EOD cron** — n8n workflows per §6 schedule
8. **Crypto feed + rebalance** — `a2e-platform/paper/crypto_feed.py`
9. **BULLSEYE paper view** — 5 tabs with `📝` / `📚` badges
10. **STUDY lesson pipeline** — markdown template + commit automation
11. **Telegram routing + topic wiring** — per §5
12. **Weekly rollup generator** — `a2e-platform/paper/rollup.py`
13. **Day-0 launch + Telegram announce** — seed all 5 books, first snapshot
14. **Day-30 retrospective generator** — `a2e-platform/paper/retrospective.py`

Estimate: **3-4 build sessions post-spec-commit**.

---

## 14. KILL CONDITIONS

The POC halts immediately if any of:
- Principal fires `KILLSWITCH`
- Data integrity failure (Yahoo or Coinbase feed returns nonsense for >2 consecutive polls)
- Agent response capture rate drops below 80% for a week (compromises the Collective IP claim)
- Aggregated paper book drawdown exceeds -20% in any 5-day window (sanity check)

---

## 15. APPENDIX — LOCKED DEFAULTS

| Parameter | Value |
|---|---|
| Crypto book capital | $50,000 |
| Crypto rebalance cadence | Monthly (1st trading day, 9:30 AM ET) |
| STUDY book capital | $15,000 |
| HIGH-RISK stop | 5% hard |
| HIGH-RISK half-trim trigger | +10% unrealized |
| HIGH-RISK exit conditions | Thesis break OR 2 closes under entry zone OR CIL downgrade |
| Agent logging granularity | Full raw JSON + score + dissent flag + reasoning summary |
| CIL threshold for HIGH-RISK entry | Unanimous PRIME from 5 voting agents |
| MIRROR tranche | $25,000 |
| SMALL tranche | $10,000 |
| HIGH-RISK tranche | $15,000 min, $31,250 max single position |
| STUDY tranche | $2,000 - $3,000 |
| POC duration | 30 calendar days from launch |
| Daily snapshot time | 4:05 PM ET |
| Weekly rollup time | Friday 5:00 PM ET |
| Structure detection timeframes | Daily (all books) + 4H overlay (HIGH-RISK, STUDY) |
| Overnight scan times | 12:00 AM, 4:00 AM, 8:00 AM ET |
| RTH scan count | 6 hourly (10 AM – 3 PM ET) |
| Crypto spot poll | Every 1 hour, 24/7 |

---

**End PAPER_POC_SPEC_v1.2 — pending repo commit.**

🔱
