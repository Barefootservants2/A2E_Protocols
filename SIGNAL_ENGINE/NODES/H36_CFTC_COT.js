// H36 — CFTC COMMITMENTS OF TRADERS (COT) REPORT
// n8n Code Node — weekly pull (runs Friday evening after 3:30PM ET release)
// Source: CFTC.gov via Quandl/Nasdaq Data Link (free) or direct CFTC API
// No API key needed for direct CFTC access
//
// PURPOSE: Show who is positioned and how before the next move.
// Large specs loading long crude = move is priced in, you're buying the top.
// Large specs short crude + catalyst = short squeeze, you ride it.
// This is THE difference between chasing and front-running.

// CFTC publishes COT every Friday at 3:30 PM ET for positions as of prior Tuesday
// Data URL: https://www.cftc.gov/dea/newcot/deafut.txt (futures only)
// Or disaggregated: https://www.cftc.gov/dea/newcot/f_disagg.txt

const COT_URL = 'https://www.cftc.gov/dea/newcot/deafut.txt';
const DISAGG_URL = 'https://www.cftc.gov/dea/newcot/f_disagg.txt';

// CONTRACT CODES we care about — mapped to our thesis positions
const CONTRACTS = {
  // Silver (COMEX) — code 084691
  '084691': {
    name: 'Silver',
    thesis: 'SILVER',
    sector: 'metals',
    ring: 2
  },
  // Gold (COMEX) — code 088691
  '088691': {
    name: 'Gold',
    thesis: 'SILVER', // correlated
    sector: 'metals',
    ring: 2
  },
  // Crude Oil WTI (NYMEX) — code 067651
  '067651': {
    name: 'Crude Oil WTI',
    thesis: 'ENERGY',
    sector: 'energy',
    ring: 3
  },
  // Natural Gas (NYMEX) — code 023651
  '023651': {
    name: 'Natural Gas',
    thesis: 'ENERGY',
    sector: 'energy',
    ring: 4
  },
  // US Dollar Index — code 098662
  '098662': {
    name: 'US Dollar Index',
    thesis: 'MACRO',
    sector: 'macro',
    ring: 0  // Kill Switch component
  },
  // 10-Year Treasury — code 043602
  '043602': {
    name: '10-Year T-Note',
    thesis: 'MACRO',
    sector: 'macro',
    ring: 0  // Kill Switch component
  },
  // Copper (COMEX) — code 085692
  '085692': {
    name: 'Copper',
    thesis: 'METALS',
    sector: 'metals',
    ring: 3
  },
  // S&P 500 E-mini — code 13874A
  '13874A': {
    name: 'S&P 500 E-mini',
    thesis: 'MACRO',
    sector: 'index',
    ring: 0
  }
};

// Parse the fixed-width COT report
function parseCOTLine(line) {
  // COT report is comma-delimited (despite .txt extension)
  const fields = line.split(',').map(f => f.trim().replace(/"/g, ''));

  if (fields.length < 17) return null;

  return {
    marketName: fields[0],
    reportDate: fields[2],
    contractCode: fields[3],
    // Commercial positions (hedgers — producers, refiners)
    commercialLong: parseInt(fields[8]) || 0,
    commercialShort: parseInt(fields[9]) || 0,
    // Non-commercial positions (large speculators — hedge funds, CTAs)
    nonCommercialLong: parseInt(fields[5]) || 0,
    nonCommercialShort: parseInt(fields[6]) || 0,
    nonCommercialSpreads: parseInt(fields[7]) || 0,
    // Non-reportable (small speculators — retail)
    nonReportableLong: parseInt(fields[15]) || 0,
    nonReportableShort: parseInt(fields[16]) || 0,
    // Open interest
    openInterest: parseInt(fields[10]) || 0,
    // Changes from prior week
    changeLong: parseInt(fields[11]) || 0,
    changeShort: parseInt(fields[12]) || 0,
    changeOI: parseInt(fields[13]) || 0
  };
}

// Score positioning for trade signal generation
function scorePositioning(data, contractInfo) {
  const netSpecPosition = data.nonCommercialLong - data.nonCommercialShort;
  const netCommercialPosition = data.commercialLong - data.commercialShort;
  const specLongPct = data.nonCommercialLong / Math.max(data.openInterest, 1) * 100;
  const specShortPct = data.nonCommercialShort / Math.max(data.openInterest, 1) * 100;

  // Positioning score: -10 (max bearish crowding) to +10 (max bullish crowding)
  // CONTRARIAN: extreme readings favor opposite trade
  let positioningScore = 0;
  let signal = 'NEUTRAL';
  let flags = [];

  const netPct = (netSpecPosition / Math.max(data.openInterest, 1)) * 100;

  // Extreme long crowding = bearish signal (contrarian)
  if (netPct > 30) {
    positioningScore = -3; // crowded long, risky to buy
    signal = 'CROWDED_LONG';
    flags.push('SPECS_EXTREME_LONG');
  } else if (netPct > 15) {
    positioningScore = -1;
    signal = 'LEAN_LONG';
  }
  // Extreme short crowding = bullish signal (squeeze potential)
  else if (netPct < -15) {
    positioningScore = 8; // short squeeze setup
    signal = 'CROWDED_SHORT';
    flags.push('SQUEEZE_POTENTIAL');
  } else if (netPct < -5) {
    positioningScore = 5;
    signal = 'LEAN_SHORT';
    flags.push('FAVORABLE_POSITIONING');
  }
  // Neutral
  else {
    positioningScore = 3;
    signal = 'NEUTRAL';
  }

  // Commercial positioning — smart money hedging
  if (netCommercialPosition > 0 && netSpecPosition < 0) {
    positioningScore += 2;
    flags.push('COMMERCIAL_ACCUMULATING');
  }

  // Normalize to 0-10 scale
  positioningScore = Math.max(0, Math.min(10, positioningScore));

  return {
    contract: contractInfo.name,
    thesis: contractInfo.thesis,
    sector: contractInfo.sector,
    ring: contractInfo.ring,
    reportDate: data.reportDate,
    openInterest: data.openInterest,
    netSpecPosition,
    netCommercialPosition,
    specLongPct: Math.round(specLongPct * 10) / 10,
    specShortPct: Math.round(specShortPct * 10) / 10,
    netPct: Math.round(netPct * 10) / 10,
    positioningScore,
    signal,
    flags,
    raw: {
      nonCommLong: data.nonCommercialLong,
      nonCommShort: data.nonCommercialShort,
      commLong: data.commercialLong,
      commShort: data.commercialShort,
      smallLong: data.nonReportableLong,
      smallShort: data.nonReportableShort
    }
  };
}

// MAIN EXECUTION
const results = {
  timestamp: new Date().toISOString(),
  source: 'CFTC COT',
  contracts: [],
  errors: [],
  killSwitchInputs: {}
};

try {
  const response = await fetch(COT_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const text = await response.text();
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const parsed = parseCOTLine(lines[i]);
    if (!parsed) continue;

    // Check if this contract is in our watch list
    const contractInfo = CONTRACTS[parsed.contractCode];
    if (!contractInfo) continue;

    const scored = scorePositioning(parsed, contractInfo);
    results.contracts.push(scored);

    // Extract Kill Switch inputs
    if (contractInfo.name === 'US Dollar Index') {
      results.killSwitchInputs.dxy_spec_positioning = scored.signal;
      results.killSwitchInputs.dxy_net_pct = scored.netPct;
    }
    if (contractInfo.name === '10-Year T-Note') {
      results.killSwitchInputs.tnote_spec_positioning = scored.signal;
      results.killSwitchInputs.tnote_net_pct = scored.netPct;
    }
  }

  // Summary
  results.summary = {
    contracts_tracked: results.contracts.length,
    squeeze_candidates: results.contracts
      .filter(c => c.signal === 'CROWDED_SHORT')
      .map(c => c.contract),
    crowded_longs: results.contracts
      .filter(c => c.signal === 'CROWDED_LONG')
      .map(c => c.contract),
    highest_conviction: results.contracts
      .sort((a, b) => b.positioningScore - a.positioningScore)
      .slice(0, 3)
      .map(c => ({
        contract: c.contract,
        score: c.positioningScore,
        signal: c.signal
      }))
  };

} catch (e) {
  results.errors.push({
    source: 'CFTC COT fetch',
    error: e.message,
    fallback: 'Use cached data from prior week if available'
  });
}

return [{ json: results }];
