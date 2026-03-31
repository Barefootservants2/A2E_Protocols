// ============================================================================
// SENTINEL Correlation Monitor — METATRON v10.8 FIX
// CHANGE: Replaced UUP/TLT proxies with DX=F (ICE Dollar Index) + ZB=F (30Y Bond Futures)
// Per METATRON v10.8: Kill Switch proxies must be 24-hour futures, not overnight-illiquid ETFs
// ============================================================================

const TEST_MODE = $('Token Check').first().json.test_mode || false;

let marketData;

if (TEST_MODE) {
  // Mock futures data for testing
  marketData = {
    'DX=F':  { lastPrice: 104.2,  changePercent: 0.35, name: 'ICE US Dollar Index Futures' },
    'ZB=F':  { lastPrice: 114.5,  changePercent: -0.42, name: '30-Year US Treasury Bond Futures' },
    'GC=F':  { lastPrice: 2385.0, changePercent: -0.18, name: 'Gold Futures' },
    'SI=F':  { lastPrice: 28.45,  changePercent: -0.25, name: 'Silver Futures' },
    'CL=F':  { lastPrice: 82.30,  changePercent: 1.10,  name: 'WTI Crude Oil Futures' },
    'VIX':   { lastPrice: 16.5,   changePercent: 2.10,  name: 'CBOE Volatility Index' }
  };
} else {
  // Parse live E*TRADE quote response
  const apiResponse = $input.first().json;
  marketData = {};
  if (apiResponse.QuoteResponse && apiResponse.QuoteResponse.QuoteData) {
    const quotes = Array.isArray(apiResponse.QuoteResponse.QuoteData)
      ? apiResponse.QuoteResponse.QuoteData
      : [apiResponse.QuoteResponse.QuoteData];
    for (const quote of quotes) {
      const sym = quote.Product?.symbol || '';
      marketData[sym] = {
        lastPrice: quote.All?.lastTrade || quote.All?.close || 0,
        changePercent: quote.All?.changePercent || 0,
        name: quote.Product?.description || sym
      };
    }
  }
}

// ── DXY DIRECTION (DX=F — ICE Dollar Index Futures, 24hr) ────────────────────
// v10.8 fix: was UUP (ETF, overnight-illiquid) — now DX=F (futures, 24hr)
const dxf_change = marketData['DX=F']?.changePercent || 0;
const dxf_price  = marketData['DX=F']?.lastPrice    || 0;
// Dollar RISING = adverse for metals
const dxy_direction = dxf_change > 0.3 ? 'UP' : (dxf_change < -0.3 ? 'DOWN' : 'FLAT');
const dxy_adverse   = dxy_direction === 'UP';

// ── YIELD DIRECTION (ZB=F — 30Y Bond Futures, 24hr) ─────────────────────────
// v10.8 fix: was TLT (ETF, overnight-illiquid) — now ZB=F (futures, 24hr)
// ZB=F FALLING = yields RISING (bond price and yield move inversely)
const zbf_change    = marketData['ZB=F']?.changePercent || 0;
const zbf_price     = marketData['ZB=F']?.lastPrice     || 0;
const yield_direction = zbf_change < -0.3 ? 'UP' : (zbf_change > 0.3 ? 'DOWN' : 'FLAT');
const yield_adverse   = yield_direction === 'UP';

// ── OIL DIRECTION (CL=F — WTI Crude Futures) ────────────────────────────────
const clf_change  = marketData['CL=F']?.changePercent || 0;
const oil_direction = clf_change > 0.5 ? 'UP' : (clf_change < -0.5 ? 'DOWN' : 'FLAT');

// ── VIX LEVEL ─────────────────────────────────────────────────────────────────
const vix_price = marketData['VIX']?.lastPrice || 16;
let vix_level;
if      (vix_price < 15) vix_level = 'LOW';
else if (vix_price < 20) vix_level = 'MODERATE';
else if (vix_price < 30) vix_level = 'ELEVATED';
else if (vix_price < 40) vix_level = 'HIGH';
else                     vix_level = 'EXTREME';

// ── METALS PRESSURE ──────────────────────────────────────────────────────────
// Adverse = Dollar UP AND Yields UP simultaneously
const metals_pressure = dxy_adverse && yield_adverse;

// ── KILL SWITCH TRIGGER ───────────────────────────────────────────────────────
// Kill switch fires on metals pressure + elevated/high/extreme VIX
const kill_switch_triggered = metals_pressure && ['ELEVATED', 'HIGH', 'EXTREME'].includes(vix_level);

// ── GATE 9 CORRELATION STATUS ─────────────────────────────────────────────────
// H37 = DXY (DX=F), H38 = YIELD (ZB=F), H39 = FLOW (oil/metals)
const gate_9_status = kill_switch_triggered ? 'TRIGGERED' : metals_pressure ? 'PRESSURE' : 'NORMAL';

return [{
  json: {
    // Core correlation signals
    dxy_direction,
    dxy_adverse,
    dxf_price,
    dxf_change: parseFloat(dxf_change.toFixed(3)),

    yield_direction,
    yield_adverse,
    zbf_price,
    zbf_change: parseFloat(zbf_change.toFixed(3)),

    oil_direction,
    vix_level,
    vix_price,

    // Kill switch logic
    metals_pressure,
    kill_switch_triggered,
    gate_9_status,

    // Audit trail
    proxy_fix: 'v10.8 — DX=F replaces UUP, ZB=F replaces TLT (24hr futures)',
    market_data: marketData,
    timestamp: new Date().toISOString()
  }
}];
