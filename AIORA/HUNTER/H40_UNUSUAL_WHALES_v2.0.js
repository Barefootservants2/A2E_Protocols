// ============================================================================
// H40 — OPTIONS SWEEP DETECTOR v2.0
// HUNTER v3.2 | METATRON v10.8
// Primary: Unusual Whales API (requires $40-80/mo subscription)
// Fallback: Barchart free tier (GEX on key symbols only)
// ============================================================================
// PURPOSE: Detect real-time options sweeps and unusual flow that signals
// institutional positioning BEFORE price moves. Smart money shows up in
// options 24-72 hours before the equity move.
//
// OUTPUT FIELDS:
//   sweeps[]         — Large sweep orders detected (size, direction, premium)
//   top_tickers[]    — Most active unusual flow by ticker today
//   bullish_flow[]   — Net bullish positioning (calls > puts, premium-weighted)
//   bearish_flow[]   — Net bearish positioning
//   gex_exposure     — Gamma exposure by symbol (market maker hedging pressure)
//   watchlist_hits[] — Any sweep activity on our active watchlist
// ============================================================================

const WATCHLIST = [
  // Ring 2: Metals/Strategic
  'PSLV', 'AG', 'SIL', 'HYMC', 'IBIT', 'GLD', 'SLV',
  // Ring 3: Defense/Tech
  'PLTR', 'LHX', 'RTX', 'ITA',
  // Ring 4: Tactical
  'XLE', 'RKLB', 'UFO',
  // Indices
  'SPY', 'QQQ', 'IWM',
  // Macro
  'TLT', 'GLD', 'USO'
];

// ── CREDENTIAL CHECK ──────────────────────────────────────────────────────────
const UW_API_KEY = $env.UNUSUAL_WHALES_API_KEY || '';
const USE_UW = UW_API_KEY.length > 10;

if (!USE_UW) {
  // FALLBACK: Barchart GEX on key symbols only
  // This path fires when UW subscription is not active
  const fallbackData = {
    source: 'BARCHART_FALLBACK',
    warning: 'Unusual Whales API key not configured. Using Barchart fallback (limited coverage).',
    subscription_required: 'https://unusualwhales.com — $40-80/mo for full sweep detection',
    sweeps: [],
    top_tickers: [],
    bullish_flow: [],
    bearish_flow: [],
    gex_exposure: {},
    watchlist_hits: [],
    data_quality: 'DEGRADED',
    timestamp: new Date().toISOString()
  };

  // Try Barchart for GEX on top metals/defense names
  // (HTTP node handles the actual API call — this node formats)
  const barchartInput = $input.first().json;
  if (barchartInput && barchartInput.data) {
    const chain = Array.isArray(barchartInput.data) ? barchartInput.data : [];
    let totalCallOI = 0, totalPutOI = 0;
    let totalCallVol = 0, totalPutVol = 0;

    for (const option of chain) {
      if (option.optionType === 'Call') {
        totalCallOI += parseInt(option.openInterest) || 0;
        totalCallVol += parseInt(option.volume) || 0;
      } else {
        totalPutOI += parseInt(option.openInterest) || 0;
        totalPutVol += parseInt(option.volume) || 0;
      }
    }

    const pcRatio = totalPutOI > 0 ? (totalPutOI / totalCallOI) : 1;
    const netDirection = totalCallVol > totalPutVol * 1.5 ? 'BULLISH' : totalPutVol > totalCallVol * 1.5 ? 'BEARISH' : 'NEUTRAL';

    fallbackData.gex_exposure = { SLV: { put_call_ratio: parseFloat(pcRatio.toFixed(3)), net_direction: netDirection, call_oi: totalCallOI, put_oi: totalPutOI, call_vol: totalCallVol, put_vol: totalPutVol } };
    fallbackData.data_quality = 'FALLBACK_PARTIAL';
  }

  return [{ json: fallbackData }];
}

// ── UNUSUAL WHALES PROCESSING ──────────────────────────────────────────────────
// This node processes UW API response (HTTP node makes the actual call)
// Expected input: Response from GET https://api.unusualwhales.com/api/flow/live

const uwResponse = $input.first().json;

// Handle UW API errors
if (uwResponse.error || uwResponse.statusCode >= 400) {
  return [{ json: {
    source: 'UNUSUAL_WHALES',
    error: true,
    error_detail: uwResponse.error || uwResponse.message || 'UW API error',
    sweeps: [], top_tickers: [], bullish_flow: [], bearish_flow: [],
    gex_exposure: {}, watchlist_hits: [],
    data_quality: 'ERROR',
    timestamp: new Date().toISOString()
  }}];
}

const flowData = uwResponse.data || uwResponse || [];
const flows = Array.isArray(flowData) ? flowData : [];

// ── SWEEP DETECTION ────────────────────────────────────────────────────────────
// Sweep criteria: Premium > $50K, executed rapidly (sweep_type = 'sweep' or large block)
const sweeps = [];
const tickerFlow = {};

for (const flow of flows) {
  const symbol = flow.symbol || flow.ticker || '';
  const premium = parseFloat(flow.premium || flow.total_premium || 0);
  const side = (flow.side || flow.sentiment || flow.type || '').toLowerCase();
  const isSweep = flow.is_sweep || flow.type === 'sweep' || premium > 50000;
  const expiry = flow.expiry || flow.expiration_date || '';
  const strike = flow.strike || flow.strike_price || 0;
  const optionType = (flow.put_call || flow.option_type || flow.type || '').toLowerCase();
  const size = parseInt(flow.size || flow.volume || 0);

  // Track by ticker for aggregation
  if (!tickerFlow[symbol]) {
    tickerFlow[symbol] = { calls: 0, puts: 0, call_premium: 0, put_premium: 0, sweep_count: 0 };
  }

  if (optionType.includes('call') || side === 'bullish' || side === 'call') {
    tickerFlow[symbol].calls += size;
    tickerFlow[symbol].call_premium += premium;
  } else if (optionType.includes('put') || side === 'bearish' || side === 'put') {
    tickerFlow[symbol].puts += size;
    tickerFlow[symbol].put_premium += premium;
  }

  // Flag as sweep if it qualifies
  if (isSweep && premium > 50000) {
    tickerFlow[symbol].sweep_count++;
    sweeps.push({
      symbol,
      direction: optionType.includes('call') || side === 'bullish' ? 'BULLISH' : 'BEARISH',
      premium: parseFloat(premium.toFixed(0)),
      size,
      strike,
      expiry,
      option_type: optionType,
      is_sweep: true,
      sentiment: side,
      raw: flow
    });
  }
}

// ── AGGREGATED FLOW ────────────────────────────────────────────────────────────
const bullishFlow = [];
const bearishFlow = [];

for (const [sym, data] of Object.entries(tickerFlow)) {
  const netPremium = data.call_premium - data.put_premium;
  const pcRatio = data.puts > 0 ? (data.puts / data.calls) : 0;
  const direction = netPremium > 0 ? 'BULLISH' : 'BEARISH';

  const flowItem = {
    symbol: sym,
    direction,
    call_premium: parseFloat(data.call_premium.toFixed(0)),
    put_premium: parseFloat(data.put_premium.toFixed(0)),
    net_premium: parseFloat(netPremium.toFixed(0)),
    put_call_ratio: parseFloat(pcRatio.toFixed(3)),
    sweep_count: data.sweep_count,
    on_watchlist: WATCHLIST.includes(sym)
  };

  if (direction === 'BULLISH') bullishFlow.push(flowItem);
  else bearishFlow.push(flowItem);
}

// Sort by net premium
bullishFlow.sort((a, b) => b.net_premium - a.net_premium);
bearishFlow.sort((a, b) => a.net_premium - b.net_premium);

// ── WATCHLIST HITS ─────────────────────────────────────────────────────────────
const watchlistHits = sweeps.filter(s => WATCHLIST.includes(s.symbol));

// ── TOP TICKERS BY TOTAL PREMIUM ─────────────────────────────────────────────
const topTickers = Object.entries(tickerFlow)
  .map(([sym, data]) => ({
    symbol: sym,
    total_premium: data.call_premium + data.put_premium,
    net_direction: data.call_premium > data.put_premium ? 'BULLISH' : 'BEARISH',
    sweep_count: data.sweep_count,
    on_watchlist: WATCHLIST.includes(sym)
  }))
  .sort((a, b) => b.total_premium - a.total_premium)
  .slice(0, 20);

// ── OUTPUT ────────────────────────────────────────────────────────────────────
return [{ json: {
  source: 'UNUSUAL_WHALES',
  data_quality: flows.length > 0 ? 'LIVE' : 'EMPTY',
  raw_flow_count: flows.length,
  sweeps: sweeps.slice(0, 50),           // Top 50 sweeps
  sweep_count: sweeps.length,
  top_tickers: topTickers,
  bullish_flow: bullishFlow.slice(0, 20),
  bearish_flow: bearishFlow.slice(0, 20),
  gex_exposure: {},                       // Populated by separate GEX call if available
  watchlist_hits: watchlistHits,
  watchlist_hit_count: watchlistHits.length,
  highest_premium_sweep: sweeps.length > 0 ? sweeps.reduce((a, b) => a.premium > b.premium ? a : b) : null,
  timestamp: new Date().toISOString(),
  version: 'H40_v2.0_UNUSUAL_WHALES'
}}];
