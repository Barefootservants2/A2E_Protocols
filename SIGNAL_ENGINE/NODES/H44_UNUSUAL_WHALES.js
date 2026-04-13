// H44 — UNUSUAL WHALES OPTIONS FLOW SCANNER
// n8n Code Node — drops into HUNTER workflow
// API Key: Bearer token from memory
// Endpoint: https://api.unusualwhales.com/api
// Method: GET only
//
// PURPOSE: Detect smart money positioning via unusual options activity.
// This is the single highest-signal data source for daily trade generation.
// When someone buys $2M in crude calls on a Friday afternoon, this catches it.

const API_KEY = '33128e70-c3c6-4ef2-9bc1-d7e7a802aed5';
const BASE_URL = 'https://api.unusualwhales.com/api';

// WATCHLIST — aligned with HUNTER universe + thesis positions
// Energy (Hormuz/crude thesis)
// Metals (silver structural thesis)
// Semiconductors (helium/supply chain thesis)
// Defense (structural plays)
const WATCHLIST_TICKERS = [
  // Energy
  'UCO', 'XLE', 'USO', 'GUSH', 'XOP', 'OXY', 'CVX', 'XOM',
  // Metals
  'SLV', 'PSLV', 'AG', 'PAAS', 'WPM', 'SIL', 'GLD', 'GDX', 'GDXJ',
  'SILJ', 'MAG', 'FSM', 'EXK', 'HL', 'CDE',
  // Semiconductors
  'SMH', 'MU', 'TSM', 'NVDA', 'AMD', 'INTC',
  // Nuclear/Energy Infrastructure
  'NLR', 'CEG', 'VST', 'CCJ',
  // Defense
  'PLTR', 'LMT', 'RTX', 'NOC', 'GD',
  // Indices (broad sentiment)
  'SPY', 'QQQ', 'IWM', 'DIA',
  // Volatility
  'VIX', 'UVXY', 'VXX'
];

// FLOW SCORING THRESHOLDS
const THRESHOLDS = {
  PREMIUM_SIGNIFICANT: 500000,    // $500K+ premium = significant
  PREMIUM_MASSIVE: 2000000,       // $2M+ premium = massive (9-10 score)
  VOLUME_OI_RATIO: 3.0,           // Volume > 3x open interest = unusual
  SWEEP_MINIMUM: 3,               // 3+ exchanges swept = aggressive fill
  DTE_SHORT: 7,                   // <7 DTE = urgent bet
  DTE_MEDIUM: 30,                 // <30 DTE = near-term conviction
};

async function fetchFlowData(endpoint, params = {}) {
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  const url = `${BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return { error: `HTTP ${response.status}`, data: null };
    }

    return { error: null, data: await response.json() };
  } catch (e) {
    return { error: e.message, data: null };
  }
}

// MAIN EXECUTION
const results = {
  timestamp: new Date().toISOString(),
  flow_alerts: [],
  sector_aggregates: {},
  errors: []
};

// 1. Pull recent flow for watchlist tickers
//    UW endpoint: /stock/{ticker}/options-flow
for (const ticker of WATCHLIST_TICKERS) {
  const { error, data } = await fetchFlowData(`/stock/${ticker}/options-flow`, {
    limit: 20,
    order: 'desc'
  });

  if (error) {
    results.errors.push({ ticker, error });
    continue;
  }

  if (!data || !data.data || data.data.length === 0) continue;

  for (const flow of data.data) {
    const premium = parseFloat(flow.premium || 0);
    const volume = parseInt(flow.volume || 0);
    const openInterest = parseInt(flow.open_interest || 1);
    const volOiRatio = volume / Math.max(openInterest, 1);
    const dte = parseInt(flow.dte || 999);
    const isSweep = (flow.option_activity_type || '').toLowerCase() === 'sweep';
    const side = (flow.sentiment || flow.put_call || '').toUpperCase();

    // SCORE THIS FLOW
    let flowScore = 0;
    let flags = [];

    // Premium size
    if (premium >= THRESHOLDS.PREMIUM_MASSIVE) {
      flowScore += 4;
      flags.push(`MASSIVE_PREMIUM_$${(premium/1000000).toFixed(1)}M`);
    } else if (premium >= THRESHOLDS.PREMIUM_SIGNIFICANT) {
      flowScore += 2;
      flags.push(`SIG_PREMIUM_$${(premium/1000).toFixed(0)}K`);
    }

    // Volume vs OI
    if (volOiRatio >= THRESHOLDS.VOLUME_OI_RATIO) {
      flowScore += 2;
      flags.push(`VOL_OI_${volOiRatio.toFixed(1)}x`);
    }

    // Sweep (aggressive multi-exchange fill)
    if (isSweep) {
      flowScore += 2;
      flags.push('SWEEP');
    }

    // DTE urgency
    if (dte <= THRESHOLDS.DTE_SHORT) {
      flowScore += 2;
      flags.push(`URGENT_${dte}DTE`);
    } else if (dte <= THRESHOLDS.DTE_MEDIUM) {
      flowScore += 1;
      flags.push(`NEAR_${dte}DTE`);
    }

    // Only keep scored flows (minimum 3/10)
    if (flowScore >= 3) {
      const normalizedScore = Math.min(10, flowScore);

      results.flow_alerts.push({
        ticker,
        side,
        strike: flow.strike_price,
        expiry: flow.expiry,
        dte,
        premium,
        volume,
        openInterest,
        volOiRatio: Math.round(volOiRatio * 10) / 10,
        isSweep,
        flowScore: normalizedScore,
        flags,
        timestamp: flow.created_at || flow.date,
        raw_type: flow.option_activity_type
      });
    }
  }
}

// 2. Aggregate by sector
const sectorMap = {
  'UCO': 'energy', 'XLE': 'energy', 'USO': 'energy', 'GUSH': 'energy',
  'XOP': 'energy', 'OXY': 'energy', 'CVX': 'energy', 'XOM': 'energy',
  'SLV': 'metals', 'PSLV': 'metals', 'AG': 'metals', 'PAAS': 'metals',
  'WPM': 'metals', 'SIL': 'metals', 'GLD': 'metals', 'GDX': 'metals',
  'GDXJ': 'metals', 'SILJ': 'metals', 'MAG': 'metals', 'FSM': 'metals',
  'EXK': 'metals', 'HL': 'metals', 'CDE': 'metals',
  'SMH': 'semiconductors', 'MU': 'semiconductors', 'TSM': 'semiconductors',
  'NVDA': 'semiconductors', 'AMD': 'semiconductors', 'INTC': 'semiconductors',
  'NLR': 'nuclear', 'CEG': 'nuclear', 'VST': 'nuclear', 'CCJ': 'nuclear',
  'PLTR': 'defense', 'LMT': 'defense', 'RTX': 'defense', 'NOC': 'defense', 'GD': 'defense',
  'SPY': 'index', 'QQQ': 'index', 'IWM': 'index', 'DIA': 'index',
  'VIX': 'volatility', 'UVXY': 'volatility', 'VXX': 'volatility'
};

for (const alert of results.flow_alerts) {
  const sector = sectorMap[alert.ticker] || 'other';
  if (!results.sector_aggregates[sector]) {
    results.sector_aggregates[sector] = {
      total_premium: 0,
      call_premium: 0,
      put_premium: 0,
      alert_count: 0,
      top_score: 0,
      tickers: new Set()
    };
  }
  const agg = results.sector_aggregates[sector];
  agg.total_premium += alert.premium;
  if (alert.side === 'CALL' || alert.side === 'BULLISH') agg.call_premium += alert.premium;
  if (alert.side === 'PUT' || alert.side === 'BEARISH') agg.put_premium += alert.premium;
  agg.alert_count++;
  agg.top_score = Math.max(agg.top_score, alert.flowScore);
  agg.tickers.add(alert.ticker);
}

// Convert Sets to arrays for JSON serialization
for (const sector of Object.keys(results.sector_aggregates)) {
  results.sector_aggregates[sector].tickers = [...results.sector_aggregates[sector].tickers];
}

// 3. Sort alerts by score descending
results.flow_alerts.sort((a, b) => b.flowScore - a.flowScore);

// 4. Summary stats
results.summary = {
  total_alerts: results.flow_alerts.length,
  top_3: results.flow_alerts.slice(0, 3).map(a => ({
    ticker: a.ticker,
    side: a.side,
    score: a.flowScore,
    premium: `$${(a.premium/1000).toFixed(0)}K`,
    flags: a.flags.join(', ')
  })),
  hottest_sector: Object.entries(results.sector_aggregates)
    .sort((a, b) => b[1].total_premium - a[1].total_premium)[0]?.[0] || 'none',
  total_premium_tracked: results.flow_alerts.reduce((sum, a) => sum + a.premium, 0),
  error_count: results.errors.length
};

return [{ json: results }];
