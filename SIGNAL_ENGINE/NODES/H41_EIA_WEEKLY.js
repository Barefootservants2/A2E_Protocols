// H41 — EIA WEEKLY PETROLEUM STATUS REPORT
// n8n Code Node — runs Wednesday after 10:30 AM ET release
// Source: EIA API v2 (free, requires API key — register at eia.gov)
// API Key: NEEDS REGISTRATION — free at https://www.eia.gov/opendata/register.php
//
// PURPOSE: The single most market-moving weekly energy data point.
// Crude inventory builds/draws directly drive WTI price.
// Refinery utilization signals demand. Production signals supply.
// This should have been in the stack from day one for any energy thesis.

// REGISTER FOR FREE KEY AT: https://www.eia.gov/opendata/register.php
// Then store in n8n credentials or workflow static data
const EIA_API_KEY = $vars?.EIA_API_KEY || 'REGISTER_AT_EIA_GOV';
const BASE_URL = 'https://api.eia.gov/v2';

// SERIES IDs — the critical weekly petroleum data points
const SERIES = {
  // Commercial crude oil inventories (excluding SPR)
  crude_inventory: {
    id: 'PET.WCESTUS1.W',
    name: 'US Commercial Crude Stocks',
    unit: 'thousand barrels',
    impact: 'Draw = bullish crude, Build = bearish crude'
  },
  // Crude oil production
  crude_production: {
    id: 'PET.WCRFPUS2.W',
    name: 'US Crude Production',
    unit: 'thousand barrels/day',
    impact: 'Rising = bearish (more supply), Falling = bullish'
  },
  // Refinery utilization
  refinery_utilization: {
    id: 'PET.WPULEUS3.W',
    name: 'US Refinery Utilization',
    unit: 'percent',
    impact: 'High = strong demand signal, Low = weak demand'
  },
  // Crude oil imports
  crude_imports: {
    id: 'PET.WCEIMUS2.W',
    name: 'US Crude Imports',
    unit: 'thousand barrels/day',
    impact: 'Falling imports + Hormuz closure = supply squeeze'
  },
  // Gasoline inventories
  gasoline_inventory: {
    id: 'PET.WGTSTUS1.W',
    name: 'US Gasoline Stocks',
    unit: 'thousand barrels',
    impact: 'Low gasoline + summer demand = crack spread widens'
  },
  // Distillate inventories (diesel/heating oil)
  distillate_inventory: {
    id: 'PET.WDISTUS1.W',
    name: 'US Distillate Stocks',
    unit: 'thousand barrels',
    impact: 'Diesel shortage = inflationary, supports crude'
  },
  // SPR levels
  spr_inventory: {
    id: 'PET.WCSSTUS1.W',
    name: 'SPR Crude Stocks',
    unit: 'thousand barrels',
    impact: 'SPR release = bearish near-term, signals gov concern'
  },
  // Cushing OK inventory (WTI delivery point)
  cushing_inventory: {
    id: 'PET.WCRSTUS1.W',
    name: 'Cushing OK Stocks',
    unit: 'thousand barrels',
    impact: 'Low Cushing = physical tightness, supports WTI specifically'
  }
};

async function fetchEIASeries(seriesId, periods = 8) {
  // EIA API v2 format
  const url = `${BASE_URL}/seriesid/${seriesId}?api_key=${EIA_API_KEY}&num=${periods}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return { error: `HTTP ${response.status}`, data: null };
    const json = await response.json();
    return { error: null, data: json };
  } catch (e) {
    return { error: e.message, data: null };
  }
}

function calculateChange(current, prior) {
  if (!current || !prior) return { absolute: 0, percent: 0 };
  const abs = current - prior;
  const pct = (abs / Math.abs(prior)) * 100;
  return {
    absolute: Math.round(abs * 10) / 10,
    percent: Math.round(pct * 100) / 100
  };
}

// Score energy supply picture for Signal Generator
function scoreSupply(data) {
  let supplyScore = 5; // neutral baseline
  let flags = [];

  // Crude inventory change
  if (data.crude_inventory) {
    const change = data.crude_inventory.weeklyChange;
    if (change < -3000) { // 3M+ barrel draw
      supplyScore += 3;
      flags.push(`LARGE_DRAW_${(change/1000).toFixed(1)}M`);
    } else if (change < -1000) {
      supplyScore += 1;
      flags.push(`DRAW_${(change/1000).toFixed(1)}M`);
    } else if (change > 3000) { // 3M+ barrel build
      supplyScore -= 3;
      flags.push(`LARGE_BUILD_${(change/1000).toFixed(1)}M`);
    } else if (change > 1000) {
      supplyScore -= 1;
      flags.push(`BUILD_${(change/1000).toFixed(1)}M`);
    }
  }

  // Cushing — delivery point tightness
  if (data.cushing_inventory) {
    const cushingLevel = data.cushing_inventory.latest;
    if (cushingLevel < 25000) { // Below 25M barrels = very tight
      supplyScore += 2;
      flags.push('CUSHING_TIGHT');
    }
  }

  // Refinery utilization — demand signal
  if (data.refinery_utilization) {
    const util = data.refinery_utilization.latest;
    if (util > 94) {
      supplyScore += 1;
      flags.push(`HIGH_UTILIZATION_${util}%`);
    } else if (util < 88) {
      supplyScore -= 1;
      flags.push(`LOW_UTILIZATION_${util}%`);
    }
  }

  // Import drop — Hormuz effect
  if (data.crude_imports) {
    const importChange = data.crude_imports.weeklyChangePct;
    if (importChange < -10) {
      supplyScore += 2;
      flags.push(`IMPORT_COLLAPSE_${importChange.toFixed(1)}%`);
    }
  }

  return {
    score: Math.max(0, Math.min(10, supplyScore)),
    flags,
    direction: supplyScore > 6 ? 'BULLISH_SUPPLY' : supplyScore < 4 ? 'BEARISH_SUPPLY' : 'NEUTRAL_SUPPLY'
  };
}

// MAIN EXECUTION
const results = {
  timestamp: new Date().toISOString(),
  source: 'EIA Weekly Petroleum',
  series: {},
  errors: [],
  supplyScore: null
};

if (EIA_API_KEY === 'REGISTER_AT_EIA_GOV') {
  results.errors.push({
    critical: true,
    message: 'EIA API key not configured. Register free at https://www.eia.gov/opendata/register.php',
    action: 'Store key in n8n workflow static data as EIA_API_KEY'
  });
} else {
  for (const [key, series] of Object.entries(SERIES)) {
    const { error, data } = await fetchEIASeries(series.id);

    if (error) {
      results.errors.push({ series: key, error });
      continue;
    }

    // Extract latest and prior values
    const values = data?.response?.data || data?.series?.[0]?.data || [];
    if (values.length >= 2) {
      const latest = parseFloat(values[0][1] || values[0].value);
      const prior = parseFloat(values[1][1] || values[1].value);
      const change = calculateChange(latest, prior);

      results.series[key] = {
        name: series.name,
        latest,
        prior,
        weeklyChange: change.absolute,
        weeklyChangePct: change.percent,
        unit: series.unit,
        impact: series.impact,
        reportDate: values[0][0] || values[0].period
      };
    }
  }

  // Calculate supply score
  results.supplyScore = scoreSupply(results.series);

  // Summary
  results.summary = {
    crude_change: results.series.crude_inventory ?
      `${results.series.crude_inventory.weeklyChange > 0 ? '+' : ''}${(results.series.crude_inventory.weeklyChange/1000).toFixed(1)}M barrels` :
      'unavailable',
    cushing_level: results.series.cushing_inventory ?
      `${(results.series.cushing_inventory.latest/1000).toFixed(1)}M barrels` :
      'unavailable',
    refinery_util: results.series.refinery_utilization ?
      `${results.series.refinery_utilization.latest}%` :
      'unavailable',
    supply_direction: results.supplyScore?.direction || 'unknown',
    supply_score: results.supplyScore?.score || 5,
    flags: results.supplyScore?.flags || []
  };
}

return [{ json: results }];
