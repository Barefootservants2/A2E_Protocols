# SIGNAL ENGINE v1.0 — DEPLOYMENT CHECKLIST
## Step-by-Step Wiring Guide
### Date: April 13, 2026

---

## PREREQUISITES (Before Building)

### API Keys to Register (all FREE)

- [ ] **EIA API Key** — https://www.eia.gov/opendata/register.php
  - Register, get key immediately
  - Store in n8n workflow static data as `EIA_API_KEY`

- [ ] **FRED API Key** — https://fred.stlouisfed.org/docs/api/api_key.html
  - Register, get key immediately
  - Store in n8n workflow static data as `FRED_API_KEY`

- [ ] **Nasdaq Data Link Key** — https://data.nasdaq.com/ (for COMEX data)
  - Register free tier, get key
  - Store in n8n workflow static data as `NASDAQ_DATA_KEY`

### Already Owned (confirm accessible)

- [x] **Unusual Whales API Key** — `33128e70-c3c6-4ef2-9bc1-d7e7a802aed5`
  - Bearer token, GET only
  - Store in n8n workflow static data as `UW_API_KEY`

- [x] **Telegram Bot Token** — already in HUNTER/SENTINEL

### Supabase Tables to Create

```sql
-- COT data cache (updated weekly)
CREATE TABLE signal_cot_cache (
  id SERIAL PRIMARY KEY,
  contract_name TEXT NOT NULL,
  report_date DATE NOT NULL,
  net_spec_position BIGINT,
  net_commercial_position BIGINT,
  open_interest BIGINT,
  positioning_score INT,
  signal TEXT,
  flags JSONB,
  raw_data JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contract_name, report_date)
);

-- EIA data cache (updated weekly)
CREATE TABLE signal_eia_cache (
  id SERIAL PRIMARY KEY,
  report_date DATE NOT NULL,
  crude_inventory DECIMAL,
  crude_change DECIMAL,
  cushing_inventory DECIMAL,
  refinery_utilization DECIMAL,
  crude_imports DECIMAL,
  supply_score INT,
  supply_direction TEXT,
  flags JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_date)
);

-- COMEX inventory (updated daily)
CREATE TABLE signal_comex_daily (
  id SERIAL PRIMARY KEY,
  metal TEXT NOT NULL,
  report_date DATE NOT NULL,
  registered DECIMAL,
  eligible DECIMAL,
  total DECIMAL,
  daily_change DECIMAL,
  inventory_score INT,
  flags JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metal, report_date)
);

-- Signal history (every card generated)
CREATE TABLE signal_history (
  id SERIAL PRIMARY KEY,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  symbol TEXT NOT NULL,
  action TEXT,
  confidence INT,
  entry_price DECIMAL,
  stop_price DECIMAL,
  target1 DECIMAL,
  ring INT,
  track INT,
  dimensions JSONB,
  counter_thesis TEXT,
  was_executed BOOLEAN DEFAULT FALSE,
  actual_result DECIMAL,
  notes TEXT
);

-- Index for performance
CREATE INDEX idx_signal_history_symbol ON signal_history(symbol);
CREATE INDEX idx_signal_history_date ON signal_history(generated_at);
CREATE INDEX idx_comex_metal_date ON signal_comex_daily(metal, report_date);
```

---

## BUILD SEQUENCE

### Phase 1: Data Feed Nodes (Session 1 — ~3 hours)

**Step 1: Wire H44 Unusual Whales into HUNTER**

1. Open HUNTER workflow (`orZPNtvvCB8RAlwF`)
2. Add new Code node: `H44 Unusual Whales Flow`
3. Paste contents of `NODES/H44_UNUSUAL_WHALES.js`
4. Set to execute after the initial Schedule Trigger
5. Wire output to a new Merge node (will combine all feeds)
6. Test: Run manually, confirm flow_alerts array populated
7. Verify: Check that UW API key returns data (GET only, Bearer token)

**Step 2: Add H36 CFTC COT**

1. Add new Code node: `H36 CFTC COT`
2. Paste contents of `NODES/H36_CFTC_COT.js`
3. Set Schedule: runs ONLY on Friday evenings (separate trigger or conditional)
4. On non-Friday runs, pull from Supabase cache: `signal_cot_cache`
5. Wire output to the Merge node
6. Test: Run manually on any day, verify it fetches from CFTC.gov

**Step 3: Add H40 COMEX Inventory**

1. Add new Code node: `H40 COMEX Inventory`
2. Paste contents of `NODES/H40_COMEX_INVENTORY.js`
3. Requires Nasdaq Data Link key (or CME XLS scrape path)
4. Add Supabase write: store daily values in `signal_comex_daily`
5. Wire output to the Merge node
6. Test: Verify silver registered/eligible values make sense

**Step 4: Add H41 EIA Weekly**

1. Add new Code node: `H41 EIA Weekly`
2. Paste contents of `NODES/H41_EIA_WEEKLY.js`
3. Set Schedule: runs ONLY Wednesday after 10:30 AM ET (separate trigger)
4. On non-Wednesday runs, pull from Supabase cache: `signal_eia_cache`
5. Wire output to the Merge node
6. Test: Verify crude inventory numbers match EIA website

**Step 5: Add H42 FRED API**

1. Add new Code node: `H42 FRED Macro`
2. Paste contents of `NODES/H42_FRED_API.js`
3. Runs daily — fresh data every run
4. Wire output to the Merge node
5. Test: Verify DXY, 10Y yield, VIX values match reality

**Step 6: Add H47 Put/Call**

1. Add new Code node: `H47 Put/Call`
2. Paste contents of `NODES/H47_PUT_CALL_RATIO.js`
3. Wire AFTER H42 (needs VIX data as fallback)
4. Wire output to the Merge node
5. Test: Verify put/call or VIX sentiment score generated

### Phase 2: Signal Engine Core (Session 2 — ~3 hours)

**Step 7: Create the Merge Node**

1. Add Merge node set to "Append" mode
2. Wire ALL data feed outputs into it:
   - H44 (UW) → Merge
   - H36 (COT) → Merge
   - H40 (COMEX) → Merge
   - H41 (EIA) → Merge
   - H42 (FRED) → Merge
   - H47 (P/C) → Merge
   - SENTINEL portfolio state → Merge
   - HUNTER existing scan output → Merge
3. Merge output goes to Signal Generator

**Step 8: Add Signal Generator**

1. Add new Code node: `Signal Generator v1.0`
2. Paste contents of `NODES/SIGNAL_GENERATOR.js`
3. Wire from Merge node output
4. Confirm it receives all 8 data source inputs
5. Test: Run full pipeline, verify Trade Cards generated
6. Check: Confidence scores reasonable? IRONCLAD sizing correct?

**Step 9: Add Trade Card Formatter**

1. Add new Code node: `Trade Card Formatter`
2. Paste contents of `NODES/TRADE_CARD_FORMATTER.js`
3. Wire from Signal Generator output
4. Wire to existing Telegram Send node
5. Test: Verify Telegram messages formatted correctly
6. Check: Entry/stop/target numbers match Signal Generator output

**Step 10: Add Signal History Write**

1. Add Supabase Insert node after Signal Generator
2. Write each Trade Card to `signal_history` table
3. This builds your signal track record for backtesting

### Phase 3: Integration and Testing (Session 3 — ~2 hours)

**Step 11: Timing Orchestration**

```
6:00 AM ET — Schedule Trigger fires
6:00-6:15   — All data feed nodes execute in parallel
6:15        — Merge node collects all outputs
6:15-6:25   — Signal Generator scores candidates
6:25-6:30   — Trade Card Formatter builds Telegram messages
6:30        — Telegram delivery
6:45        — Signal history written to Supabase
```

1. Verify data feed nodes can complete within 15 minutes
2. Add error handling: if any feed fails, Signal Generator uses defaults
3. Add timeout: if total pipeline > 20 minutes, send "delayed" alert

**Step 12: Paper Trade Validation**

1. Run Signal Engine for 5 trading days without executing
2. Track: Did the signals align with actual price movement?
3. Log in `signal_history`: mark `was_executed = false`, fill `actual_result` EOD
4. After 5 days: calculate theoretical P&L from top signals
5. Target: 60%+ of signals should have hit T1 (first +5% target)

**Step 13: Live Validation**

1. Start executing T1 only (50% position) on top signal
2. Track for 2 weeks
3. If hit rate > 55%: graduate to full T1+T2
4. If hit rate < 45%: review dimension weights, adjust scoring

---

## VERIFICATION TESTS

For each node, run these checks before considering it production-ready:

| Test | What to verify |
|------|----------------|
| Data freshness | Latest data point is from today (or most recent available) |
| Score range | All scores between 0-10 |
| IRONCLAD math | Stop = entry * 0.95, targets = entry * 1.05/1.10/1.15 |
| Sector check | Sector exposure doesn't exceed 35% after proposed trade |
| Kill Switch | DXY+yields adverse = no new metal entries |
| Same-day | Previously exited symbol blocked from re-entry |
| Telegram | Message renders correctly in mobile Telegram |
| Supabase | History row written with all fields populated |

---

## ROLLBACK PLAN

If Signal Engine produces bad signals:

1. Remove Signal Generator and Trade Card Formatter nodes
2. HUNTER continues to run its existing scan normally
3. No other workflows are affected
4. Signal Engine is entirely additive — removing it restores baseline

---

## ESTIMATED FINAL NODE COUNT

HUNTER current: 97 nodes
New nodes: ~12 (6 data feeds + merge + signal generator + formatter + 3 supabase writes)
HUNTER target: ~109 nodes

---

## POST-DEPLOYMENT ENHANCEMENTS (Not blocking go-live)

- [ ] SHFE premium scraper (H45) — requires web scraping
- [ ] CME margin change monitor (H46) — event-driven, low priority
- [ ] GEX integration from SpotGamma — paid service
- [ ] SEC Form 4 RSS real-time feed — low priority
- [ ] Capitol Trades congressional tracker — low priority
- [ ] FINRA short interest — bi-monthly, enhancement
- [ ] AAII sentiment survey — weekly, enhancement
- [ ] CNN Fear & Greed composite — daily, enhancement
- [ ] ETF fund flows — daily, enhancement
- [ ] FINRA dark pool volume — weekly, enhancement
