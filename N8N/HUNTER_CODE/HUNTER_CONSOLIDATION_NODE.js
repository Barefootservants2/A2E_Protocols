// ============================================================
// HUNTER CONSOLIDATION NODE — DISCOVERY / CONFIRMATION SPLIT
// n8n Code Node (JavaScript)
// Place AFTER all HUNTER module outputs merge
// ============================================================
// PURPOSE: Enforce sector-blind discovery by splitting output
// into two categories BEFORE the Principal sees results.
//
// DISCOVERY = Things NOT on the watchlist (new opportunities)
// CONFIRMATION = Things ON the watchlist (position validation)
//
// DRIFT GUARD: HUNTER = market-wide, NEVER thesis-specific.
// Wide net. Data leads, Principal decides.
// ============================================================

// === CONFIGURATION ===
// Update this watchlist to match current holdings + watchlist
// This is the ONLY place portfolio awareness enters HUNTER output

try {
const PORTFOLIO_TICKERS = [
  // Current holdings
  'GOOG', 'GOOGL', 'AVGO', 'QQQ', 'GLD', 'SIL', 'SOXX',
  // Watchlist
  'NVDA', 'AMD', 'INTC', 'TSM', 'MSFT', 'AAPL',
  // Silver thesis
  'HYMC', 'PSLV', 'AG', 'SLV',
  // Crypto
  'BTC', 'ETH', 'XRP', 'SOL', 'XLM',
  // Staged
  'IEMG', 'XAR', 'VBR', 'SPYD',
  // Recent additions
  'COIN', 'JPM'
];

const PORTFOLIO_SECTORS = [
  'TECHNOLOGY', 'SEMICONDUCTORS', 'PRECIOUS_METALS'
];

// === PROCESS ALL HUNTER OUTPUTS ===
const items = $input.all();

const discovery = [];
const confirmation = [];
const errors = [];
const gaps = [];

for (const item of items) {
  const data = item.json;

  // Route errors and empty results to gaps
  if (data.status === 'ERROR') {
    errors.push(data);
    continue;
  }
  if (data.status === 'EMPTY' || data.status === 'NO_DATA') {
    gaps.push(data);
    continue;
  }

  // Check for portfolio overlap
  const hasPortfolioTicker = checkTickerOverlap(data);
  const hasPortfolioSector = checkSectorOverlap(data);

  if (hasPortfolioTicker) {
    confirmation.push({
      ...data,
      _consolidation: {
        category: 'CONFIRMATION',
        matched_tickers: getMatchedTickers(data),
        reason: 'Ticker match with portfolio/watchlist'
      }
    });
  } else {
    discovery.push({
      ...data,
      _consolidation: {
        category: 'DISCOVERY',
        sector_overlap: hasPortfolioSector,
        reason: hasPortfolioSector 
          ? 'New ticker in familiar sector' 
          : 'New ticker in NEW sector — highest discovery value'
      }
    });
  }
}

// === RANK DISCOVERY BY VALUE ===
// Prioritize: new sectors > familiar sectors, fresh > stale
discovery.sort((a, b) => {
  // New sectors first
  const aNewSector = !a._consolidation.sector_overlap ? 1 : 0;
  const bNewSector = !b._consolidation.sector_overlap ? 1 : 0;
  if (aNewSector !== bNewSector) return bNewSector - aNewSector;

  // Then by freshness
  const freshnessOrder = { 'BREAKING': 5, 'FRESH': 4, 'DIGESTED': 3, 'STALE': 2, 'ANCIENT': 1, 'UNKNOWN': 0 };
  const aFresh = freshnessOrder[a.data_freshness] || 0;
  const bFresh = freshnessOrder[b.data_freshness] || 0;
  return bFresh - aFresh;
});

// === BUILD CONSOLIDATED REPORT ===
const report = {
  timestamp: new Date().toISOString(),
  scan_type: 'HUNTER_CONSOLIDATED',

  // Executive summary
  summary: {
    total_items_processed: items.length,
    discovery_count: discovery.length,
    confirmation_count: confirmation.length,
    error_count: errors.length,
    gap_count: gaps.length,
    new_sector_discoveries: discovery.filter(d => !d._consolidation.sector_overlap).length
  },

  // === DISCOVERY SECTION (SHOW FIRST) ===
  // These are the opportunities the Principal doesn't know about yet
  discovery: {
    header: '🔍 DISCOVERY — Items NOT on portfolio/watchlist',
    new_sectors: discovery.filter(d => !d._consolidation.sector_overlap),
    familiar_sectors: discovery.filter(d => d._consolidation.sector_overlap)
  },

  // === CONFIRMATION SECTION (SHOW SECOND) ===
  // These validate existing positions
  confirmation: {
    header: '✅ CONFIRMATION — Portfolio/watchlist items with new data',
    items: confirmation
  },

  // === DATA GAPS ===
  data_gaps: {
    header: '⚠️ DATA GAPS — Modules that returned no data',
    modules: gaps.map(g => ({
      source: g.source,
      status: g.status
    })),
    errors: errors.map(e => ({
      source: e.source,
      error: e.error
    }))
  },

  // Portfolio awareness disclosure
  _portfolio_tickers_checked: PORTFOLIO_TICKERS.length,
  _drift_guard: 'ACTIVE — Discovery prioritized over confirmation'
};

// === HELPER FUNCTIONS ===

function checkTickerOverlap(data) {
  const tickerFields = [
    data.symbol, data.ticker,
    ...(data.potential_tickers || []),
    data.employer_ticker,
    data.connected_org_ticker
  ].filter(Boolean).map(t => t.toUpperCase());

  return tickerFields.some(t => PORTFOLIO_TICKERS.includes(t));
}

function checkSectorOverlap(data) {
  const sectors = (data.sector_tags || []).map(s => s.toUpperCase());
  return sectors.some(s => PORTFOLIO_SECTORS.includes(s));
}

function getMatchedTickers(data) {
  const tickerFields = [
    data.symbol, data.ticker,
    ...(data.potential_tickers || []),
    data.employer_ticker,
    data.connected_org_ticker
  ].filter(Boolean).map(t => t.toUpperCase());

  return tickerFields.filter(t => PORTFOLIO_TICKERS.includes(t));
}

// Return the consolidated report
return [{ json: report }];

} catch (error) {
  // Error handler for HUNTER_CONSOLIDATION
  console.error(`[HUNTER_CONSOLIDATION] Error: ${error.message}`);
  return [{
    json: {
      module: 'HUNTER_CONSOLIDATION',
      error: true,
      error_message: error.message,
      timestamp: new Date().toISOString(),
      data: null
    }
  }];
}