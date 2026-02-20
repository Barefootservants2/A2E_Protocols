// ============================================================
// GATE 2: SIGNAL VALIDATION — MULTI-SIGNAL CONVERGENCE
// n8n Code Node (JavaScript)
// Position: AFTER Master Merge, BEFORE Agent Distribution
// ============================================================
// PURPOSE: Score each ticker by how many H-modules flagged it.
// Single signals = noise. 3+ signals = actionable.
// This gate eliminates ~60% of false positives.
//
// CONFIDENCE CASCADE: Gate 2 of 8
// METATRON v10.6 | AIORA Confidence Cascade v1.0
// ============================================================

const items = $input.all();
const tickerMap = {};
const MIN_CONVERGENCE = 3; // Minimum signals to pass

// ============================================================
// STEP 1: Extract tickers from all H-module outputs
// ============================================================

for (const item of items) {
  const data = item.json;
  const source = data.source || data.module || 'UNKNOWN';
  
  // Extract tickers from different H-module output formats
  const tickers = extractTickers(data, source);
  
  for (const ticker of tickers) {
    if (!tickerMap[ticker.symbol]) {
      tickerMap[ticker.symbol] = {
        symbol: ticker.symbol,
        signals: [],
        signal_count: 0,
        convergence_score: 0,
        categories: new Set(),
        first_seen: source,
        data_points: []
      };
    }
    
    tickerMap[ticker.symbol].signals.push({
      module: source,
      signal_type: ticker.signal_type || 'GENERAL',
      strength: ticker.strength || 0.5,
      timestamp: data.timestamp || new Date().toISOString()
    });
    
    tickerMap[ticker.symbol].categories.add(categorizeSignal(source));
    tickerMap[ticker.symbol].data_points.push({
      module: source,
      raw: ticker.raw_data || null
    });
  }
}

// ============================================================
// STEP 2: Score convergence
// ============================================================

const scoredTickers = [];

for (const [symbol, info] of Object.entries(tickerMap)) {
  info.signal_count = info.signals.length;
  info.categories = [...info.categories]; // Convert Set to Array
  
  // Convergence score considers:
  // 1. Number of signals (raw count)
  // 2. Category diversity (different types of signals = stronger)
  // 3. Average signal strength
  
  const countScore = Math.min(info.signal_count / 5, 1.0); // Max at 5 signals
  const diversityScore = Math.min(info.categories.length / 4, 1.0); // Max at 4 categories
  const avgStrength = info.signals.reduce((s, sig) => s + sig.strength, 0) / info.signal_count;
  
  // Weighted convergence: 40% count, 35% diversity, 25% strength
  info.convergence_score = Math.round(
    (countScore * 0.40 + diversityScore * 0.35 + avgStrength * 0.25) * 100
  ) / 100;
  
  // Classification
  if (info.signal_count >= 4) {
    info.classification = 'STRONG';
    info.pass_gate_2 = true;
  } else if (info.signal_count >= MIN_CONVERGENCE) {
    info.classification = 'INTERESTING';
    info.pass_gate_2 = true;
  } else if (info.signal_count === 2) {
    info.classification = 'WATCH';
    info.pass_gate_2 = false;
  } else {
    info.classification = 'NOISE';
    info.pass_gate_2 = false;
  }
  
  scoredTickers.push(info);
}

// ============================================================
// STEP 3: Sort and split
// ============================================================

scoredTickers.sort((a, b) => b.convergence_score - a.convergence_score);

const passing = scoredTickers.filter(t => t.pass_gate_2);
const filtered = scoredTickers.filter(t => !t.pass_gate_2);

// ============================================================
// STEP 4: Build output report
// ============================================================

const report = {
  gate: 'GATE_2_SIGNAL_VALIDATION',
  timestamp: new Date().toISOString(),
  protocol: 'CONFIDENCE_CASCADE_v1.0',
  
  summary: {
    total_tickers_scanned: scoredTickers.length,
    passing_gate_2: passing.length,
    filtered_out: filtered.length,
    filter_rate: scoredTickers.length > 0 
      ? Math.round((filtered.length / scoredTickers.length) * 100) + '%'
      : '0%',
    classification_breakdown: {
      STRONG: scoredTickers.filter(t => t.classification === 'STRONG').length,
      INTERESTING: scoredTickers.filter(t => t.classification === 'INTERESTING').length,
      WATCH: scoredTickers.filter(t => t.classification === 'WATCH').length,
      NOISE: scoredTickers.filter(t => t.classification === 'NOISE').length
    }
  },
  
  // Tickers that PASS Gate 2 — sent to agents for analysis
  actionable: passing.map(t => ({
    symbol: t.symbol,
    signal_count: t.signal_count,
    convergence_score: t.convergence_score,
    classification: t.classification,
    signals: t.signals.map(s => s.module),
    categories: t.categories
  })),
  
  // Tickers FILTERED — logged but not analyzed
  watch_list: filtered.filter(t => t.classification === 'WATCH').map(t => ({
    symbol: t.symbol,
    signal_count: t.signal_count,
    signals: t.signals.map(s => s.module)
  })),
  
  // Full data for passing tickers (sent downstream to agents)
  full_data: passing
};

return [{ json: report }];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function extractTickers(data, source) {
  const tickers = [];
  
  // Handle different H-module output formats
  // H1 Volume: typically has results array with ticker field
  if (data.results && Array.isArray(data.results)) {
    for (const r of data.results) {
      if (r.ticker || r.symbol || r.T) {
        tickers.push({
          symbol: (r.ticker || r.symbol || r.T).toUpperCase(),
          signal_type: getSignalType(source),
          strength: r.strength || r.score || 0.5,
          raw_data: r
        });
      }
    }
  }
  
  // Finnhub format: symbol field directly
  if (data.symbol) {
    tickers.push({
      symbol: data.symbol.toUpperCase(),
      signal_type: getSignalType(source),
      strength: 0.5,
      raw_data: data
    });
  }
  
  // Array of tickers at top level
  if (Array.isArray(data) && data.length > 0 && data[0]?.ticker) {
    for (const item of data) {
      tickers.push({
        symbol: item.ticker.toUpperCase(),
        signal_type: getSignalType(source),
        strength: item.strength || 0.5,
        raw_data: item
      });
    }
  }
  
  // SEC EDGAR format
  if (data.filings && Array.isArray(data.filings)) {
    for (const f of data.filings) {
      if (f.ticker || f.issuerTradingSymbol) {
        tickers.push({
          symbol: (f.ticker || f.issuerTradingSymbol).toUpperCase(),
          signal_type: 'INSIDER',
          strength: 0.6,
          raw_data: f
        });
      }
    }
  }
  
  // NewsAPI format — extract tickers from articles
  if (data.articles && Array.isArray(data.articles)) {
    // News articles need NLP ticker extraction — placeholder
    // In practice, this would use regex for $TICKER patterns
    for (const a of data.articles) {
      const found = extractTickersFromText(a.title + ' ' + (a.description || ''));
      for (const t of found) {
        tickers.push({
          symbol: t,
          signal_type: 'NEWS_SENTIMENT',
          strength: 0.4,
          raw_data: { title: a.title, source: a.source?.name }
        });
      }
    }
  }
  
  return tickers;
}

function extractTickersFromText(text) {
  if (!text) return [];
  // Match $TICKER or common ticker patterns (1-5 uppercase letters)
  const dollarSign = text.match(/\$([A-Z]{1,5})/g) || [];
  return dollarSign.map(t => t.replace('$', ''));
}

function getSignalType(source) {
  const typeMap = {
    'H1': 'VOLUME', 'H2': 'BREAKOUT', 'H3': 'SECTOR_MOMENTUM',
    'H4': 'INSIDER', 'H5': 'EARNINGS', 'H7': 'NEWS_SENTIMENT',
    'H8': 'ANALYST', 'H9': 'VOLATILITY', 'H11': 'SHORT_INTEREST',
    'H12': 'SQUEEZE', 'H14': 'DARK_POOL', 'H24': 'ETF_FLOW',
    'H27': 'MACRO', 'H30': 'LOBBYING', 'H31': 'CONGRESS',
    'H33': 'GOV_CONTRACT', 'H35': 'INFLUENCE'
  };
  
  for (const [prefix, type] of Object.entries(typeMap)) {
    if (source.startsWith(prefix)) return type;
  }
  return 'GENERAL';
}

function categorizeSignal(source) {
  // Group signals into categories for diversity scoring
  const categories = {
    TECHNICAL: ['H1', 'H2', 'H9', 'H11', 'H12'],
    FUNDAMENTAL: ['H5', 'H8', 'H24', 'H27'],
    SENTIMENT: ['H3', 'H7', 'H14'],
    INSIDER: ['H4', 'H30', 'H31', 'H33', 'H35']
  };
  
  for (const [cat, prefixes] of Object.entries(categories)) {
    if (prefixes.some(p => source.startsWith(p))) return cat;
  }
  return 'OTHER';
}
