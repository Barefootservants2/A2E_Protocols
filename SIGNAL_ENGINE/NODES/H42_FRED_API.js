// H42 — FEDERAL RESERVE ECONOMIC DATA (FRED) API
// n8n Code Node — runs daily at 6:00 AM ET
// Source: FRED API v2 (free, requires API key)
// Register free at: https://fred.stlouisfed.org/docs/api/api_key.html
//
// PURPOSE: Feed the Kill Switch with actual macro data instead of proxies.
// DXY movements, yield curve shape, inflation expectations, and rate
// probabilities directly impact every thesis position.

const FRED_API_KEY = $vars?.FRED_API_KEY || 'REGISTER_AT_FRED_STLOUISFED_ORG';
const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

// SERIES we need for Kill Switch and Signal Engine
const SERIES = {
  // DXY proxy — Trade Weighted Dollar Index (Broad)
  dxy: {
    id: 'DTWEXBGS',
    name: 'Trade-Weighted Dollar (Broad)',
    frequency: 'daily',
    killSwitch: true,
    component: 'H37'
  },
  // 10-Year Treasury Yield
  ust10y: {
    id: 'DGS10',
    name: '10-Year Treasury Yield',
    frequency: 'daily',
    killSwitch: true,
    component: 'H38'
  },
  // 2-Year Treasury Yield (for yield curve)
  ust2y: {
    id: 'DGS2',
    name: '2-Year Treasury Yield',
    frequency: 'daily',
    killSwitch: false,
    component: 'context'
  },
  // Fed Funds Effective Rate
  fedfunds: {
    id: 'DFF',
    name: 'Fed Funds Effective Rate',
    frequency: 'daily',
    killSwitch: false,
    component: 'context'
  },
  // 5-Year Breakeven Inflation Rate
  inflation5y: {
    id: 'T5YIE',
    name: '5-Year Breakeven Inflation',
    frequency: 'daily',
    killSwitch: false,
    component: 'thesis'
  },
  // 10-Year Breakeven Inflation Rate
  inflation10y: {
    id: 'T10YIE',
    name: '10-Year Breakeven Inflation',
    frequency: 'daily',
    killSwitch: false,
    component: 'thesis'
  },
  // Real Yield (10Y TIPS)
  realYield: {
    id: 'DFII10',
    name: '10-Year Real Yield (TIPS)',
    frequency: 'daily',
    killSwitch: true,
    component: 'metals_signal'
  },
  // VIX (CBOE Volatility Index)
  vix: {
    id: 'VIXCLS',
    name: 'VIX',
    frequency: 'daily',
    killSwitch: false,
    component: 'sentiment'
  }
};

async function fetchFRED(seriesId, limit = 10) {
  const url = `${BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&sort_order=desc&limit=${limit}&file_type=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) return { error: `HTTP ${response.status}`, data: null };
    const json = await response.json();
    return { error: null, data: json.observations || [] };
  } catch (e) {
    return { error: e.message, data: null };
  }
}

// Score macro environment for Signal Generator
function scoreMacro(data) {
  let macroScore = 5; // neutral
  let flags = [];

  // DXY direction — rising dollar = headwind for commodities
  if (data.dxy) {
    const dxyChange = data.dxy.change5d;
    if (dxyChange > 1.5) {
      macroScore -= 2;
      flags.push('DXY_RISING_STRONG');
    } else if (dxyChange > 0.5) {
      macroScore -= 1;
      flags.push('DXY_RISING');
    } else if (dxyChange < -1.5) {
      macroScore += 2;
      flags.push('DXY_FALLING_STRONG');
    } else if (dxyChange < -0.5) {
      macroScore += 1;
      flags.push('DXY_FALLING');
    }
  }

  // Yields direction — rising yields = headwind for metals
  if (data.ust10y) {
    const yieldChange = data.ust10y.change5d;
    if (yieldChange > 0.15) {
      macroScore -= 1;
      flags.push('YIELDS_RISING');
    } else if (yieldChange < -0.15) {
      macroScore += 1;
      flags.push('YIELDS_FALLING');
    }
  }

  // Real yield — negative real yields = bullish metals
  if (data.realYield) {
    if (data.realYield.latest < 0) {
      macroScore += 2;
      flags.push('NEGATIVE_REAL_YIELD');
    } else if (data.realYield.latest < 1.0) {
      macroScore += 1;
      flags.push('LOW_REAL_YIELD');
    }
  }

  // Yield curve — inversion = recession signal
  if (data.ust10y && data.ust2y) {
    const curve = data.ust10y.latest - data.ust2y.latest;
    if (curve < -0.5) {
      flags.push('YIELD_CURVE_DEEPLY_INVERTED');
    } else if (curve < 0) {
      flags.push('YIELD_CURVE_INVERTED');
    }
  }

  // Inflation expectations — rising = bullish commodities
  if (data.inflation5y) {
    if (data.inflation5y.latest > 3.0) {
      macroScore += 1;
      flags.push('HIGH_INFLATION_EXPECTATIONS');
    }
  }

  // VIX level
  if (data.vix) {
    if (data.vix.latest > 30) {
      flags.push('VIX_ELEVATED');
    } else if (data.vix.latest > 40) {
      flags.push('VIX_EXTREME');
    }
  }

  // KILL SWITCH CHECK — DXY AND yields both adverse
  let killSwitchStatus = 'CLEAR';
  if (data.dxy && data.ust10y) {
    const dxyAdverse = data.dxy.change5d > 1.0;
    const yieldsAdverse = data.ust10y.change5d > 0.10;
    if (dxyAdverse && yieldsAdverse) {
      killSwitchStatus = 'FIRING';
      macroScore -= 3;
      flags.push('KILL_SWITCH_CORRELATION_ADVERSE');
    }
  }

  return {
    score: Math.max(0, Math.min(10, macroScore)),
    flags,
    killSwitchStatus,
    direction: macroScore > 6 ? 'MACRO_TAILWIND' : macroScore < 4 ? 'MACRO_HEADWIND' : 'MACRO_NEUTRAL'
  };
}

// MAIN EXECUTION
const results = {
  timestamp: new Date().toISOString(),
  source: 'FRED API',
  data: {},
  errors: [],
  macroScore: null,
  killSwitch: null
};

if (FRED_API_KEY === 'REGISTER_AT_FRED_STLOUISFED_ORG') {
  results.errors.push({
    critical: true,
    message: 'FRED API key not configured. Register free at https://fred.stlouisfed.org/docs/api/api_key.html',
    action: 'Store key in n8n workflow static data as FRED_API_KEY'
  });
} else {
  for (const [key, series] of Object.entries(SERIES)) {
    const { error, data } = await fetchFRED(series.id);

    if (error) {
      results.errors.push({ series: key, error });
      continue;
    }

    if (data && data.length >= 2) {
      // Filter out periods with "." (missing data)
      const validData = data.filter(d => d.value !== '.');
      if (validData.length < 2) continue;

      const latest = parseFloat(validData[0].value);
      const prior = parseFloat(validData[1].value);
      // 5-day change if available
      const fiveDayAgo = validData.length >= 5 ? parseFloat(validData[4]?.value || validData[validData.length-1].value) : prior;

      results.data[key] = {
        name: series.name,
        latest,
        prior,
        change1d: Math.round((latest - prior) * 1000) / 1000,
        change5d: Math.round((latest - fiveDayAgo) * 1000) / 1000,
        date: validData[0].date,
        killSwitch: series.killSwitch,
        component: series.component
      };
    }
  }

  // Score macro environment
  results.macroScore = scoreMacro(results.data);
  results.killSwitch = {
    status: results.macroScore.killSwitchStatus,
    dxy_5d: results.data.dxy?.change5d || 'unavailable',
    yields_5d: results.data.ust10y?.change5d || 'unavailable',
    action: results.macroScore.killSwitchStatus === 'FIRING'
      ? 'AUTO 50% METALS REDUCTION — 48HR EMBARGO STARTS'
      : 'No action required'
  };

  // Summary
  results.summary = {
    macro_score: results.macroScore.score,
    macro_direction: results.macroScore.direction,
    kill_switch: results.macroScore.killSwitchStatus,
    flags: results.macroScore.flags,
    dxy: results.data.dxy?.latest || 'N/A',
    ust10y: results.data.ust10y?.latest || 'N/A',
    real_yield: results.data.realYield?.latest || 'N/A',
    vix: results.data.vix?.latest || 'N/A',
    inflation_5y: results.data.inflation5y?.latest || 'N/A'
  };
}

return [{ json: results }];
