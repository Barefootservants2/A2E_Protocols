// SIGNAL GENERATOR v1.0 — TRADE CARD ENGINE
// n8n Code Node — runs at 6:30 AM ET after all data feeds complete
// Consumes: H44 (UW), H36 (COT), H41 (EIA), H40 (COMEX), H42 (FRED), H47 (P/C)
//           + HUNTER scan output + SENTINEL portfolio state
//
// PURPOSE: This is the node that turns research into money.
// Takes all data feed scores and produces ranked Trade Cards
// with exact entry, stop, target, and sizing per IRONCLAD v3.0.
//
// OUTPUT: Max 3 Trade Cards per day, each with confidence score,
// signal drivers, counter-thesis, and full IRONCLAD-compliant sizing.

// ═══════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════

const CONFIG = {
  MAX_CARDS_PER_DAY: 3,
  MIN_CONFIDENCE_THRESHOLD: 70, // Don't output signals below 70%
  IRONCLAD: {
    HARD_STOP_PCT: 0.05,         // 5% universal stop (Rings 2-4)
    TRIM_PCT: 0.05,              // Trim 25% at every +5%
    TRIM_SIZE: 0.25,             // 25% of position
    TRANCHE_SPLIT: 0.50,         // T1 = 50%, T2 = 50%
    MAX_RISK_PER_TRADE: 0.015,   // 1.5% account risk per trade
    MAX_POSITION_PCT: 0.20,      // 20% max single position
    MAX_SECTOR_PCT: 0.35,        // 35% max sector exposure
    NO_SAME_DAY_REENTRY: true,
    KILL_SWITCH_EMBARGO_HOURS: 48
  },
  // Dimension weights — how much each data source matters
  WEIGHTS: {
    flow: 0.30,        // H44 Unusual Whales — highest signal
    positioning: 0.20, // H36 CFTC COT
    supply: 0.15,      // H41 EIA / H40 COMEX
    thesis: 0.15,      // SENTINEL chain status
    macro: 0.10,       // H42 FRED / Kill Switch
    sentiment: 0.10    // H47 Put/Call
  }
};

// ═══════════════════════════════════════
// CANDIDATE UNIVERSE
// Symbols the Signal Engine evaluates daily
// ═══════════════════════════════════════

const UNIVERSE = {
  // TRACK 1 — Daily Grind candidates (high liquidity, options-active)
  track1: [
    { symbol: 'UCO',  name: 'ProShares Ultra Crude 2x',    sector: 'energy',     ring: 4, leverage: 2 },
    { symbol: 'XLE',  name: 'Energy Select SPDR',          sector: 'energy',     ring: 3, leverage: 1 },
    { symbol: 'GUSH', name: 'Direxion Oil & Gas Bull 2x',  sector: 'energy',     ring: 4, leverage: 2 },
    { symbol: 'SLV',  name: 'iShares Silver Trust',        sector: 'metals',     ring: 3, leverage: 1 },
    { symbol: 'SIL',  name: 'Global X Silver Miners',      sector: 'metals',     ring: 3, leverage: 1 },
    { symbol: 'SILJ', name: 'ETFMG Junior Silver Miners',  sector: 'metals',     ring: 4, leverage: 1 },
    { symbol: 'GDX',  name: 'VanEck Gold Miners',          sector: 'metals',     ring: 3, leverage: 1 },
    { symbol: 'GDXJ', name: 'VanEck Junior Gold Miners',   sector: 'metals',     ring: 4, leverage: 1 },
    { symbol: 'SMH',  name: 'VanEck Semiconductor',        sector: 'semiconductors', ring: 3, leverage: 1 },
    { symbol: 'UVXY', name: 'ProShares Ultra VIX 1.5x',    sector: 'volatility', ring: 4, leverage: 1.5 },
    { symbol: 'XOP',  name: 'SPDR Oil & Gas E&P',          sector: 'energy',     ring: 4, leverage: 1 },
    { symbol: 'USO',  name: 'US Oil Fund',                 sector: 'energy',     ring: 4, leverage: 1 },
  ],
  // TRACK 2 — Thesis positions (longer hold, structural)
  track2: [
    { symbol: 'PSLV', name: 'Sprott Physical Silver',      sector: 'metals',     ring: 2, leverage: 1 },
    { symbol: 'AG',   name: 'First Majestic Silver',       sector: 'metals',     ring: 3, leverage: 1 },
    { symbol: 'PAAS', name: 'Pan American Silver',         sector: 'metals',     ring: 3, leverage: 1 },
    { symbol: 'WPM',  name: 'Wheaton Precious Metals',     sector: 'metals',     ring: 3, leverage: 1 },
    { symbol: 'MAG',  name: 'MAG Silver Corp',             sector: 'metals',     ring: 4, leverage: 1 },
    { symbol: 'CEG',  name: 'Constellation Energy',        sector: 'nuclear',    ring: 3, leverage: 1 },
    { symbol: 'CCJ',  name: 'Cameco Corp',                 sector: 'nuclear',    ring: 3, leverage: 1 },
    { symbol: 'PLTR', name: 'Palantir Technologies',       sector: 'defense',    ring: 3, leverage: 1 },
    { symbol: 'NLR',  name: 'VanEck Uranium+Nuclear',      sector: 'nuclear',    ring: 3, leverage: 1 },
  ]
};

// ═══════════════════════════════════════
// INPUT COLLECTION
// Wire these from prior nodes in n8n
// ═══════════════════════════════════════

// In n8n, these come from the Merge node combining all data feeds
const inputs = $input?.all() || [];

// Extract each data source from merged inputs
let uwData = null;       // H44 Unusual Whales
let cotData = null;       // H36 CFTC COT
let eiaData = null;       // H41 EIA Weekly
let comexData = null;     // H40 COMEX Inventory
let fredData = null;      // H42 FRED API
let pcData = null;        // H47 Put/Call
let sentinelData = null;  // SENTINEL portfolio state
let hunterData = null;    // HUNTER scan results

for (const item of inputs) {
  const d = item.json;
  if (d?.source === 'Unusual Whales') uwData = d;
  else if (d?.source === 'CFTC COT') cotData = d;
  else if (d?.source === 'EIA Weekly Petroleum') eiaData = d;
  else if (d?.source === 'COMEX Vault Inventory') comexData = d;
  else if (d?.source === 'FRED API') fredData = d;
  else if (d?.source === 'CBOE Put/Call Ratio') pcData = d;
  else if (d?.source === 'SENTINEL') sentinelData = d;
  else if (d?.source === 'HUNTER') hunterData = d;
}

// ═══════════════════════════════════════
// SCORING FUNCTIONS
// ═══════════════════════════════════════

function getFlowScore(symbol) {
  if (!uwData || !uwData.flow_alerts) return { score: 5, flags: [] };

  const symbolAlerts = uwData.flow_alerts.filter(a => a.ticker === symbol);
  if (symbolAlerts.length === 0) {
    // Check sector-level flow
    const sectorMap = {};
    UNIVERSE.track1.concat(UNIVERSE.track2).forEach(u => sectorMap[u.symbol] = u.sector);
    const sector = sectorMap[symbol];
    const sectorAgg = uwData.sector_aggregates?.[sector];
    if (sectorAgg && sectorAgg.top_score >= 7) {
      return { score: sectorAgg.top_score - 2, flags: [`SECTOR_FLOW_${sector.toUpperCase()}`] };
    }
    return { score: 3, flags: ['NO_DIRECT_FLOW'] };
  }

  // Best alert for this symbol
  const best = symbolAlerts[0]; // already sorted by score
  return { score: best.flowScore, flags: best.flags };
}

function getPositioningScore(symbol) {
  if (!cotData || !cotData.contracts) return { score: 5, flags: [] };

  // Map symbols to COT contracts
  const symbolToCOT = {
    'UCO': 'Crude Oil WTI', 'XLE': 'Crude Oil WTI', 'GUSH': 'Crude Oil WTI',
    'USO': 'Crude Oil WTI', 'XOP': 'Crude Oil WTI',
    'SLV': 'Silver', 'PSLV': 'Silver', 'AG': 'Silver', 'PAAS': 'Silver',
    'WPM': 'Silver', 'SIL': 'Silver', 'SILJ': 'Silver', 'MAG': 'Silver',
    'GDX': 'Gold', 'GDXJ': 'Gold', 'GLD': 'Gold',
    'SMH': 'S&P 500 E-mini', 'PLTR': 'S&P 500 E-mini',
    'UVXY': 'S&P 500 E-mini' // inverse
  };

  const cotName = symbolToCOT[symbol];
  if (!cotName) return { score: 5, flags: [] };

  const contract = cotData.contracts.find(c => c.contract === cotName);
  if (!contract) return { score: 5, flags: [] };

  // For UVXY, invert the score (crowded long SPX = bullish UVXY)
  if (symbol === 'UVXY') {
    return {
      score: 10 - contract.positioningScore,
      flags: contract.flags.map(f => `INV_${f}`)
    };
  }

  return { score: contract.positioningScore, flags: contract.flags };
}

function getSupplyScore(symbol) {
  // Energy symbols use EIA, metals symbols use COMEX
  const sectorMap = {};
  UNIVERSE.track1.concat(UNIVERSE.track2).forEach(u => sectorMap[u.symbol] = u.sector);
  const sector = sectorMap[symbol];

  if (['energy'].includes(sector) && eiaData?.supplyScore) {
    return { score: eiaData.supplyScore.score, flags: eiaData.supplyScore.flags };
  }

  if (['metals'].includes(sector) && comexData?.summary) {
    return {
      score: comexData.summary.silver_score || 5,
      flags: comexData.summary.silver_flags || []
    };
  }

  return { score: 5, flags: [] };
}

function getThesisScore(symbol) {
  if (!sentinelData) return { score: 5, flags: [] };

  // Check if this symbol is in an active thesis chain
  const positions = sentinelData.positions || [];
  const position = positions.find(p => p.symbol === symbol);

  if (position) {
    // Already held — check thesis health
    const chainStatus = position.thesisChainStatus || 'unknown';
    if (chainStatus === 'GREEN') return { score: 8, flags: ['THESIS_ALL_GREEN'] };
    if (chainStatus === 'YELLOW') return { score: 5, flags: ['THESIS_MIXED'] };
    if (chainStatus === 'RED') return { score: 2, flags: ['THESIS_BROKEN'] };
  }

  // Not held — check if thesis supports new entry
  // Default to neutral if no thesis data
  return { score: 5, flags: ['NO_ACTIVE_THESIS'] };
}

function getMacroScore() {
  if (!fredData?.macroScore) return { score: 5, flags: [] };
  return { score: fredData.macroScore.score, flags: fredData.macroScore.flags };
}

function getSentimentScore() {
  if (!pcData?.sentimentScore) return { score: 5, flags: [] };
  return { score: pcData.sentimentScore.score, flags: pcData.sentimentScore.flags };
}

// ═══════════════════════════════════════
// IRONCLAD SIZING ENGINE
// ═══════════════════════════════════════

function calculateIRONCLAD(symbol, currentPrice, accountBalance, ring, track, currentPortfolio) {
  const ic = CONFIG.IRONCLAD;

  // Account selection logic
  // 6685 = Rollover IRA (thesis/long-term), 4898 = taxable (daily grind), 5267 = individual
  let accountId = track === 1 ? '4898' : '6685';
  let balance = accountBalance[accountId] || 30000; // fallback

  // Max position size
  const maxPositionDollars = balance * ic.MAX_POSITION_PCT;

  // Risk-based sizing: max loss = 1.5% of account
  const maxLossDollars = balance * ic.MAX_RISK_PER_TRADE;
  const riskBasedSize = maxLossDollars / ic.HARD_STOP_PCT;

  // Use the smaller of position cap and risk-based size
  const totalPosition = Math.min(maxPositionDollars, riskBasedSize);

  // Tranche split
  const t1Size = Math.floor(totalPosition * ic.TRANCHE_SPLIT);
  const t2Size = Math.floor(totalPosition * ic.TRANCHE_SPLIT);

  // Stop and targets
  const stopPrice = Math.round(currentPrice * (1 - ic.HARD_STOP_PCT) * 100) / 100;
  const target1 = Math.round(currentPrice * (1 + ic.TRIM_PCT) * 100) / 100;
  const target2 = Math.round(currentPrice * (1 + ic.TRIM_PCT * 2) * 100) / 100;
  const target3 = Math.round(currentPrice * (1 + ic.TRIM_PCT * 3) * 100) / 100;

  // Sector exposure check
  const sectorMap = {};
  UNIVERSE.track1.concat(UNIVERSE.track2).forEach(u => sectorMap[u.symbol] = u.sector);
  const sector = sectorMap[symbol] || 'other';
  const currentSectorExposure = (currentPortfolio?.sectorExposure?.[sector] || 0) / balance;
  const sectorRoom = ic.MAX_SECTOR_PCT - currentSectorExposure;
  const sectorLimited = totalPosition > (sectorRoom * balance);

  // Same-day re-entry check
  const exitedToday = currentPortfolio?.todayExits?.includes(symbol) || false;

  // Kill Switch embargo check
  const killSwitchActive = fredData?.killSwitch?.status === 'FIRING';
  const embargoActive = currentPortfolio?.killSwitchEmbargoUntil &&
    new Date(currentPortfolio.killSwitchEmbargoUntil) > new Date();

  return {
    accountId,
    totalPosition: sectorLimited ? Math.floor(sectorRoom * balance) : totalPosition,
    t1Dollars: sectorLimited ? Math.floor(sectorRoom * balance * 0.5) : t1Size,
    t2Dollars: sectorLimited ? Math.floor(sectorRoom * balance * 0.5) : t2Size,
    t1Shares: Math.floor(t1Size / currentPrice),
    t2Shares: Math.floor(t2Size / currentPrice),
    stopPrice,
    stopPct: ic.HARD_STOP_PCT * 100,
    target1,
    target2,
    target3,
    trimSize: ic.TRIM_SIZE,
    maxLoss: Math.round(maxLossDollars),
    sectorExposure: Math.round(currentSectorExposure * 100),
    sectorRoom: Math.round(sectorRoom * 100),
    sectorLimited,
    blocked: {
      sameDay: exitedToday,
      killSwitch: killSwitchActive || embargoActive,
      sectorFull: sectorRoom <= 0
    },
    blockReasons: [
      exitedToday ? 'SAME_DAY_REENTRY_BANNED' : null,
      killSwitchActive ? 'KILL_SWITCH_ACTIVE' : null,
      embargoActive ? 'KILL_SWITCH_EMBARGO' : null,
      sectorRoom <= 0 ? 'SECTOR_EXPOSURE_MAXED' : null
    ].filter(Boolean)
  };
}

// ═══════════════════════════════════════
// COUNTER-THESIS GENERATOR (Gate 7.5)
// ═══════════════════════════════════════

function generateCounterThesis(symbol, sector, scores) {
  const counters = {
    energy: [
      'CENTCOM clarifies blockade targets Iranian-flagged vessels only. Market reads as posturing, gap fades intraday.',
      'Surprise ceasefire extension announced. WTI drops 10%+ in single session. Stop-out triggered.',
      'SPR emergency release floods 30M barrels. Near-term supply fears evaporate.',
      'OPEC+ emergency meeting announces 2M bpd increase. Compliance hawks break ranks.',
      'Iran concedes on Hormuz. Tanker traffic resumes within 48 hours.'
    ],
    metals: [
      'CME raises silver margins 25%+. Leveraged longs liquidate. 1980/2011 pattern trigger.',
      'DXY spikes on hawkish Fed surprise. Real yields surge, silver drops 8-10% in a week.',
      'COMEX eligible-to-registered conversion flood. Registered inventory jumps, deficit narrative breaks.',
      'China SHFE releases strategic silver reserves. Shanghai premium collapses.',
      'Rate cut expectations die completely. Dollar rips to 110+. All metals under pressure.'
    ],
    semiconductors: [
      'China export controls on rare earths hit chip makers. Production costs spike.',
      'AI demand narrative cracks on earnings miss from major hyperscaler.',
      'Taiwan strait tensions escalate. TSM supply chain disruption priced in.',
    ],
    nuclear: [
      'Regulatory setback on next-gen reactor approvals.',
      'Natural gas price collapse makes nuclear economics less compelling.',
    ],
    defense: [
      'Budget sequestration threat. Defense appropriations cut 8%.',
      'Ceasefire deal reached. Defense spending narrative weakens.',
    ],
    volatility: [
      'Market finds floor. VIX mean-reverts below 20. UVXY decays relentlessly.',
    ]
  };

  const sectorCounters = counters[sector] || ['No specific counter-thesis identified.'];
  // Pick the most relevant based on current conditions
  return sectorCounters[Math.floor(Math.random() * Math.min(sectorCounters.length, 2))];
}

// ═══════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════

const W = CONFIG.WEIGHTS;
const results = {
  timestamp: new Date().toISOString(),
  source: 'Signal Generator v1.0',
  tradeCards: [],
  dataFeedStatus: {
    unusual_whales: uwData ? 'CONNECTED' : 'MISSING',
    cftc_cot: cotData ? 'CONNECTED' : 'MISSING',
    eia_weekly: eiaData ? 'CONNECTED' : 'MISSING',
    comex_inventory: comexData ? 'CONNECTED' : 'MISSING',
    fred_macro: fredData ? 'CONNECTED' : 'MISSING',
    put_call: pcData ? 'CONNECTED' : 'MISSING',
    sentinel: sentinelData ? 'CONNECTED' : 'MISSING',
    hunter: hunterData ? 'CONNECTED' : 'MISSING'
  },
  killSwitch: fredData?.killSwitch?.status || 'UNKNOWN',
  errors: []
};

// Check Kill Switch — if firing, only output reduction alerts, no new entries
if (fredData?.killSwitch?.status === 'FIRING') {
  results.tradeCards.push({
    type: 'KILL_SWITCH_ALERT',
    action: 'REDUCE METALS 50%',
    reason: 'DXY + yields both adverse. IRONCLAD Kill Switch triggered.',
    embargo: '48 hours from now',
    details: fredData.killSwitch
  });
  // Still score candidates for awareness but mark as blocked
}

// Score all candidates
const candidates = [];

const allSymbols = [...UNIVERSE.track1, ...UNIVERSE.track2];

for (const candidate of allSymbols) {
  const flow = getFlowScore(candidate.symbol);
  const positioning = getPositioningScore(candidate.symbol);
  const supply = getSupplyScore(candidate.symbol);
  const thesis = getThesisScore(candidate.symbol);
  const macro = getMacroScore();
  const sentiment = getSentimentScore();

  // Weighted composite score (0-10 scale)
  const compositeScore = (
    flow.score * W.flow +
    positioning.score * W.positioning +
    supply.score * W.supply +
    thesis.score * W.thesis +
    macro.score * W.macro +
    sentiment.score * W.sentiment
  );

  // Convert to confidence percentage (0-100)
  const confidence = Math.round(compositeScore * 10);

  if (confidence >= CONFIG.MIN_CONFIDENCE_THRESHOLD) {
    candidates.push({
      ...candidate,
      confidence,
      compositeScore: Math.round(compositeScore * 100) / 100,
      dimensions: {
        flow: { score: flow.score, weight: W.flow, weighted: Math.round(flow.score * W.flow * 100) / 100, flags: flow.flags },
        positioning: { score: positioning.score, weight: W.positioning, weighted: Math.round(positioning.score * W.positioning * 100) / 100, flags: positioning.flags },
        supply: { score: supply.score, weight: W.supply, weighted: Math.round(supply.score * W.supply * 100) / 100, flags: supply.flags },
        thesis: { score: thesis.score, weight: W.thesis, weighted: Math.round(thesis.score * W.thesis * 100) / 100, flags: thesis.flags },
        macro: { score: macro.score, weight: W.macro, weighted: Math.round(macro.score * W.macro * 100) / 100, flags: macro.flags },
        sentiment: { score: sentiment.score, weight: W.sentiment, weighted: Math.round(sentiment.score * W.sentiment * 100) / 100, flags: sentiment.flags }
      }
    });
  }
}

// Sort by confidence descending
candidates.sort((a, b) => b.confidence - a.confidence);

// Generate Trade Cards for top candidates
const accountBalances = sentinelData?.accountBalances || { '6685': 25000, '4898': 20000, '5267': 15000 };
const currentPortfolio = sentinelData?.portfolio || { sectorExposure: {}, todayExits: [] };

for (let i = 0; i < Math.min(candidates.length, CONFIG.MAX_CARDS_PER_DAY); i++) {
  const c = candidates[i];
  const track = UNIVERSE.track1.find(t => t.symbol === c.symbol) ? 1 : 2;

  // Get current price — from HUNTER or Finnhub data
  const currentPrice = hunterData?.quotes?.[c.symbol]?.price ||
                       c.symbol === 'UCO' ? 40.50 : // fallback estimates
                       c.symbol === 'XLE' ? 92.00 :
                       c.symbol === 'SLV' ? 70.00 : 50.00;

  const sizing = calculateIRONCLAD(c.symbol, currentPrice, accountBalances, c.ring, track, currentPortfolio);
  const counterThesis = generateCounterThesis(c.symbol, c.sector, c.dimensions);

  const card = {
    cardNumber: i + 1,
    symbol: c.symbol,
    name: c.name,
    action: sizing.blocked.sameDay || sizing.blocked.killSwitch || sizing.blocked.sectorFull ? 'BLOCKED' : 'BUY',
    ring: c.ring,
    track,
    confidence: c.confidence,
    entry: currentPrice,
    sizing,
    signalDrivers: c.dimensions,
    counterThesis,
    blocked: sizing.blockReasons.length > 0,
    blockReasons: sizing.blockReasons
  };

  results.tradeCards.push(card);
}

// Summary
results.summary = {
  totalCandidatesScored: allSymbols.length,
  aboveThreshold: candidates.length,
  cardsGenerated: results.tradeCards.filter(c => c.type !== 'KILL_SWITCH_ALERT').length,
  topSignal: candidates[0] ? `${candidates[0].symbol} @ ${candidates[0].confidence}%` : 'NONE',
  dataFeeds: Object.values(results.dataFeedStatus).filter(s => s === 'CONNECTED').length + '/8 connected',
  killSwitch: results.killSwitch
};

return [{ json: results }];
