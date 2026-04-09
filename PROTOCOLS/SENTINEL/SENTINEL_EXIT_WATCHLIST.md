# SENTINEL EXIT WATCHLIST — SILVER THESIS CHAIN
## Re-Entry Monitor + Thesis Health Dashboard
**Ashes2Echoes LLC | IRONCLAD v3.0 Addendum**
**Effective: April 9, 2026**

---

## 1. WHAT THIS IS

When a thesis position is sold (stopped out, trimmed to zero, or dumped on event risk), it does NOT leave the system. It moves from ACTIVE POSITIONS to the EXIT WATCHLIST. SENTINEL monitors it for re-entry conditions.

The $2K left on XLE and the missed PSLV re-entry both happened because exited positions went dark. This fixes that.

---

## 2. THE SILVER THESIS CHAIN — FULL VALUE STACK

Silver is not one trade. It's a supply chain thesis. Each layer has a vehicle, a thesis gate, and a kill condition. ALL layers must be monitored whether held or not.

### LAYER 1: PHYSICAL / SPOT PROXY (Speculation)
**What it is:** Direct exposure to silver spot price
**Vehicles:** PSLV (Sprott Physical), SLV (iShares), SIVR (Aberdeen)
**Why PSLV:** Fully allocated physical, no paper leverage, redeemable
**Thesis gate:** Silver spot above 50-day MA + Shanghai premium > 3% + COMEX registered declining
**Kill condition:** Shanghai premium inverts to discount for 5+ consecutive days (physical demand dead)

### LAYER 2: MINERS (Mining)
**What it is:** Operating leverage on silver price through production margins
**Vehicles:** AG (First Majestic), SIL (Silver Miners ETF), PAAS (Pan American), WPM (Wheaton), HL (Hecla)
**Why AG:** Pure-play silver miner, highest beta to spot, Sprott-backed
**Thesis gate:** All-in sustaining cost (AISC) below spot by 30%+ AND production guidance intact AND no dilution/shelf filing
**Kill condition:** AISC exceeds 80% of spot price (margin compression) OR company announces dilutive offering OR production miss > 15%

### LAYER 3: PROCESSING / REFINING (Processing)
**What it is:** The bottleneck — who turns ore into usable silver
**Vehicles:** No pure-play public refiner. Exposure via SIL basket, WPM (streaming), CEF (Sprott closed-end with gold/silver)
**Thesis gate:** Refining capacity utilization > 85% + lease rates elevated (supply stress)
**Kill condition:** Lease rates collapse to normal (< 2%) for 10+ consecutive days (supply stress resolved)

### LAYER 4: INDUSTRIAL DEMAND (What happens after)
**What it is:** The structural demand floor — solar, EVs, electronics, defense
**Vehicles:** No direct silver-demand ETF. Monitor via: TAN (solar), QCLN (clean energy), SMH (semiconductors)
**Why it matters:** 59% of silver demand is industrial. Solar alone = 232M oz/year. This is the floor under the price.
**Thesis gate:** Solar installations growing YoY + EV adoption accelerating + no silver substitute breakthrough
**Kill condition:** Viable silver substitute announced and adopted by 2+ major manufacturers (kills industrial demand thesis)

### LAYER 5: MACRO TAILWIND (Environment)
**What it is:** Dollar weakness, rate cuts, inflation hedge demand, central bank buying
**Vehicles:** DXY (inverse), GLD/PHYS (gold proxy), TLT/ZB=F (rate expectations)
**Thesis gate:** DXY below 100 + real rates negative or declining + central bank net buyers
**Kill condition:** DXY sustained above 105 + real rates rising + Fed hawkish pivot confirmed

### LAYER 6: STRUCTURAL SUPPLY DEFICIT (Foundation)
**What it is:** The base case — 6th consecutive annual deficit, 800M oz cumulative shortfall
**Vehicles:** N/A (this is the thesis itself, not a tradeable layer)
**Thesis gate:** Silver Institute confirms continued deficit + COMEX registered inventory declining + no major new mine supply online
**Kill condition:** Silver Institute projects surplus OR major new mine (500M+ oz/year capacity) announced with <3 year timeline

---

## 3. EXIT WATCHLIST DATA MODEL

When a position exits, SENTINEL stores:

```
{
  symbol: "PSLV",
  layer: 1,
  layer_name: "Physical/Spot Proxy",
  exit_date: "2026-04-01",
  exit_price: 22.50,
  exit_reason: "STOP_LOSS",
  cost_basis: 25.11,
  shares_sold: 865,
  realized_loss: -2257.65,
  wash_sale_window_end: "2026-05-01",
  thesis_status: "INTACT",
  re_entry_conditions: {
    price_above: 23.50,
    silver_spot_above: 72.00,
    shanghai_premium_above: 3,
    comex_registered_declining: true
  },
  monitoring_active: true
}
```

---

## 4. RE-ENTRY ALERT LOGIC

SENTINEL checks EXIT WATCHLIST positions every scan (every 30 min during market hours). Alert fires when ALL conditions met:

### PSLV / Physical Layer:
- Silver spot > $72 (above 50-day support) ✅ (currently $74-77)
- Shanghai premium > 3% ✅ (currently ~10%)
- COMEX registered declining ✅ (down 13.8% last 30 days)
- Price above exit price + 2% (recovery confirmation)
- Wash sale window clear (if taxable account)

### AG / Mining Layer:
- Same silver spot conditions as above
- AG AISC < 70% of spot
- No dilutive filing in last 30 days
- Price above 20-day MA

### Alert message format:
```
RE-ENTRY: [TICKER] — Thesis INTACT
Layer: [Physical/Mining/etc]
Exit: $22.50 on 04/01
Current: $24.70
Silver: $75.19
Shanghai: +10%
COMEX: declining
All gates PASS
IRONCLAD v3.0: T1 = 50% at $24.70, T2 at +2% ($25.19)
Stop: -5% = $23.47
```

---

## 5. THESIS HEALTH DASHBOARD

Every SENTINEL report includes a one-line thesis status per layer:

```
SILVER THESIS CHAIN:
L1 Physical:  ✅ INTACT (spot $75, Shanghai +10%)
L2 Mining:    ✅ INTACT (AG AISC $15 vs $75 spot)
L3 Processing:⚠️ WATCH (lease rates normalizing)
L4 Industrial:✅ INTACT (solar demand +18% YoY)
L5 Macro:     ✅ INTACT (DXY 98.8, falling)
L6 Supply:    ✅ INTACT (6th deficit year, COMEX -13.8%)

CHAIN STATUS: 5/6 GREEN, 1 WATCH
OVERALL: THESIS HOLDS — maintain positions
```

If any layer goes RED (kill condition triggered), the chain is broken. MICHA flags it and recommends:
- 1 RED layer: Reduce exposure 25%, tighten stops
- 2 RED layers: Reduce exposure 50%, move stops to breakeven
- 3+ RED layers: THESIS DEAD. Exit all silver positions. Full stop.

---

## 6. CURRENT THESIS STATUS — APRIL 9, 2026

| Layer | Status | Evidence |
|-------|--------|----------|
| L1 Physical | ✅ INTACT | Silver $74-77, PSLV $24.70, Shanghai premium +10% |
| L2 Mining | ✅ INTACT | AG still operating, AISC ~$15-17, no dilution |
| L3 Processing | ✅ INTACT | Lease rates elevated, refining tight |
| L4 Industrial | ✅ INTACT | Solar demand record, EV adoption accelerating, no substitute |
| L5 Macro | ✅ INTACT | DXY 98.8 (below 99, falling), VIX 21, rate cut expectations returning |
| L6 Supply | ✅ INTACT | 6th consecutive deficit projected, COMEX registered -13.8%, coverage ratio 14% |

**CHAIN: 6/6 GREEN. THESIS FULLY INTACT.**

**VERDICT: PSLV re-entry is warranted. All six layers confirm. Exit was mechanical (stop-out), not thesis failure.**

---

## 7. IMPLEMENTATION — SENTINEL PATCH

Add to SENTINEL workflow as a new Code node: "Exit Watchlist Monitor"

**Position in pipeline:** After Position Analyzer, parallel to Compliance Engine

**Inputs:**
- Current positions from Position Analyzer
- Market data from Market Context Pull
- Stored exit watchlist from Supabase table `sentinel_exit_watchlist`

**Outputs:**
- Re-entry alerts to Telegram
- Updated thesis chain status to Report Builder
- Watchlist state back to Supabase

**Supabase table: `sentinel_exit_watchlist`**
```sql
CREATE TABLE sentinel_exit_watchlist (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  layer INTEGER,
  layer_name TEXT,
  exit_date DATE,
  exit_price DECIMAL,
  exit_reason TEXT,
  cost_basis DECIMAL,
  shares_sold INTEGER,
  realized_pnl DECIMAL,
  wash_sale_window_end DATE,
  thesis_status TEXT DEFAULT 'INTACT',
  re_entry_triggered BOOLEAN DEFAULT FALSE,
  re_entry_date DATE,
  re_entry_price DECIMAL,
  monitoring_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. RULES THAT DO NOT BEND

1. **Exited thesis positions go on the watchlist automatically.** No manual step.
2. **Thesis status is checked every scan.** Not once a day. Every 30 minutes.
3. **Re-entry follows IRONCLAD v3.0.** T1 50%, T2 at +2%, -5% stop. No exceptions.
4. **Wash sale window is enforced.** If the exit was in a taxable account, no re-entry in ANY account for 31 days.
5. **Dead thesis = no re-entry.** 3+ layers RED means the chain is broken. Move on.
6. **MICHA flags re-entry proactively.** Does not wait for Principal to ask.

---

*"The thesis doesn't care about your stop-loss. The stop protects capital. The watchlist protects the thesis."*
