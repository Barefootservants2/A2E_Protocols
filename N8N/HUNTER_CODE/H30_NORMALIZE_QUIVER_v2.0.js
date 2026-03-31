// ============================================================================
// H30 — CONGRESSIONAL TRADE TRACKER v2.0
// HUNTER v3.3 | METATRON v10.8
// UPGRADE: Replaces Finnhub lobbying (/stock/lobbying) with Quiver Quantitative
// WHY: Finnhub returns CORPORATE lobbying spend. Quiver returns CONGRESSIONAL
//      STOCK TRADES — what members of Congress actually bought/sold.
//      These are different signals. Congressional trades are actionable.
// ============================================================================
// Quiver Quantitative API:
//   Base:  https://api.quiverquant.com/beta/
//   Auth:  Authorization: Token {QUIVER_API_KEY}
//   Plan:  Premium (~$25/mo) — required for full historical data
//   Docs:  https://api.quiverquant.com/docs
//
// Key endpoints used:
//   GET /live/congresstrading         — All recent trades (last 6 months)
//   GET /historical/congresstrading/{ticker} — Trade history for specific symbol
// ============================================================================

const QUIVER_KEY = $env.QUIVER_API_KEY || '';
const USE_QUIVER = QUIVER_KEY.length > 10;

// Watchlist for cross-referencing congressional activity
const WATCHLIST = [
  'PSLV', 'AG', 'SIL', 'HYMC', 'IBIT', 'GLD', 'SLV',
  'PLTR', 'LHX', 'RTX', 'NOC', 'GD', 'ITA',
  'XLE', 'MSFT', 'NVDA', 'AMZN', 'GOOGL',
  'SPY', 'QQQ'
];

// Committee → Sector mapping for H35 correlation
const COMMITTEE_SECTOR_MAP = {
  // Armed Services → Defense
  'Armed Services': ['defense', 'aerospace', 'cybersecurity'],
  'Defense': ['defense', 'aerospace'],
  // Finance/Banking → Financial, Tech
  'Banking': ['financials', 'fintech'],
  'Finance': ['financials', 'tech'],
  'Financial Services': ['financials', 'fintech'],
  // Intelligence → Tech, Defense, Cybersecurity
  'Intelligence': ['tech', 'defense', 'cybersecurity'],
  // Energy → Energy, Utilities
  'Energy': ['energy', 'utilities', 'materials'],
  'Natural Resources': ['energy', 'materials', 'mining'],
  // Health → Healthcare, Pharma
  'Health': ['healthcare', 'pharma'],
  // Commerce/Science → Tech
  'Commerce': ['tech', 'telecom'],
  'Science': ['tech', 'biotech'],
};

function getSectorTags(committees, ticker) {
  const tags = new Set();

  // Map committees to sectors
  if (committees && Array.isArray(committees)) {
    for (const committee of committees) {
      for (const [key, sectors] of Object.entries(COMMITTEE_SECTOR_MAP)) {
        if (committee.toLowerCase().includes(key.toLowerCase())) {
          sectors.forEach(s => tags.add(s));
        }
      }
    }
  }

  // Map ticker to sector
  const tickerSectorMap = {
    'PLTR': ['tech', 'defense', 'cybersecurity'],
    'LHX': ['defense'], 'RTX': ['defense'], 'NOC': ['defense'], 'GD': ['defense'], 'ITA': ['defense'],
    'XLE': ['energy'], 'USO': ['energy'], 'CL=F': ['energy'],
    'PSLV': ['metals', 'precious_metals'], 'AG': ['metals', 'silver'], 'SIL': ['metals', 'silver'],
    'GLD': ['metals', 'gold'], 'SLV': ['metals', 'silver'],
    'IBIT': ['crypto'], 'BITO': ['crypto'],
    'NVDA': ['tech', 'semiconductors'], 'AMD': ['tech', 'semiconductors'],
    'MSFT': ['tech'], 'GOOGL': ['tech'], 'AMZN': ['tech', 'ecommerce'],
    'XLV': ['healthcare'], 'ABBV': ['healthcare', 'pharma'],
    'SGOV': ['bonds', 'core'], 'TLT': ['bonds'],
    'SPY': ['broad_market'], 'QQQ': ['tech', 'broad_market'],
  };

  if (ticker && tickerSectorMap[ticker]) {
    tickerSectorMap[ticker].forEach(s => tags.add(s));
  }

  return [...tags];
}

function calculateFreshness(tradeDateStr) {
  if (!tradeDateStr) return 'STALE';
  const tradeDate = new Date(tradeDateStr);
  const now = new Date();
  const daysDiff = Math.floor((now - tradeDate) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 7)  return 'FRESH';
  if (daysDiff <= 30) return 'RECENT';
  if (daysDiff <= 90) return 'AGED';
  return 'STALE';
}

function parseAmountRange(amountStr) {
  // Quiver returns ranges like "$1,001 - $15,000" or "$100,001 - $250,000"
  if (!amountStr) return { min: 0, max: 0, midpoint: 0 };
  const nums = amountStr.replace(/[$,]/g, '').match(/[\d.]+/g);
  if (!nums || nums.length === 0) return { min: 0, max: 0, midpoint: 0 };
  const min = parseFloat(nums[0]) || 0;
  const max = parseFloat(nums[1]) || min;
  return { min, max, midpoint: (min + max) / 2 };
}

// ── FALLBACK: No Quiver key ────────────────────────────────────────────────
if (!USE_QUIVER) {
  return [{ json: {
    source: 'H30_QUIVER_CONGRESSIONAL',
    status: 'NO_KEY',
    warning: 'QUIVER_API_KEY not configured. Congressional trade data unavailable.',
    subscription_url: 'https://quiverquant.com — ~$25/mo for Premium API access',
    upgrade_note: 'Quiver provides actual congressional stock trades. Finnhub /stock/lobbying only returned corporate lobbying spend — different signal.',
    trades: [],
    watchlist_hits: [],
    critical_signals: [],
    record_count: 0,
    timestamp: new Date().toISOString()
  }}];
}

// ── PROCESS QUIVER RESPONSE ────────────────────────────────────────────────
const quiverResp = $input.first().json;

if (quiverResp.error || quiverResp.statusCode >= 400) {
  return [{ json: {
    source: 'H30_QUIVER_CONGRESSIONAL',
    status: 'API_ERROR',
    error: quiverResp.error || quiverResp.message || 'Quiver API error',
    trades: [], watchlist_hits: [], critical_signals: [],
    record_count: 0,
    timestamp: new Date().toISOString()
  }}];
}

const rawTrades = Array.isArray(quiverResp) ? quiverResp :
                  Array.isArray(quiverResp.data) ? quiverResp.data : [];

const trades = [];
const watchlistHits = [];
const criticalSignals = [];

for (const trade of rawTrades) {
  // Quiver congressional trade schema:
  // { Representative, Transaction, Ticker, Range, Date, House, Party, Committees[] }
  const ticker       = (trade.Ticker || trade.ticker || '').toUpperCase().trim();
  const txType       = (trade.Transaction || trade.transaction || '').toLowerCase();
  const tradeDate    = trade.Date || trade.date || trade.TransactionDate || '';
  const representative = trade.Representative || trade.representative || trade.Name || '';
  const party        = trade.Party || trade.party || '';
  const house        = trade.House || trade.house || trade.Chamber || ''; // Senate/House
  const committees   = trade.Committees || trade.committees || [];
  const amountRange  = trade.Range || trade.range || trade.Amount || '';
  const amount       = parseAmountRange(amountRange);
  const freshness    = calculateFreshness(tradeDate);
  const sectorTags   = getSectorTags(committees, ticker);
  const onWatchlist  = WATCHLIST.includes(ticker);

  // Skip stale data unless on watchlist
  if (freshness === 'STALE' && !onWatchlist) continue;

  // Determine direction
  const isBuy  = txType.includes('purchase') || txType.includes('buy');
  const isSell = txType.includes('sale') || txType.includes('sell');
  const direction = isBuy ? 'BUY' : isSell ? 'SELL' : 'UNKNOWN';

  // CRITICAL signal detection:
  // 1. Committee member trades in sector their committee oversees
  // 2. Large transaction (>$100K midpoint)
  // 3. Multiple members same ticker same month
  let isCritical = false;
  const criticalReasons = [];

  if (committees.length > 0 && sectorTags.length > 0) {
    for (const committee of committees) {
      for (const [key, sectors] of Object.entries(COMMITTEE_SECTOR_MAP)) {
        if (committee.toLowerCase().includes(key.toLowerCase())) {
          const overlap = sectors.filter(s => sectorTags.includes(s));
          if (overlap.length > 0) {
            isCritical = true;
            criticalReasons.push(`Committee-sector overlap: ${committee} → ${overlap.join(',')}`);
          }
        }
      }
    }
  }

  if (amount.midpoint > 100000) {
    isCritical = true;
    criticalReasons.push(`Large transaction: $${amount.midpoint.toLocaleString()}`);
  }

  const normalizedTrade = {
    // H35 standard schema
    source:              'H30_QUIVER_CONGRESSIONAL',
    record_type:         'CONGRESSIONAL_TRADE',
    timestamp:           new Date().toISOString(),

    // Entity
    representative,
    party,
    house,
    committees,
    ticker,
    direction,

    // Transaction
    transaction_type:    txType,
    trade_date:          tradeDate,
    amount_range:        amountRange,
    amount_min:          amount.min,
    amount_max:          amount.max,
    amount_midpoint:     amount.midpoint,

    // Classification
    sector_tags:         sectorTags,
    on_watchlist:        onWatchlist,
    data_freshness:      freshness,
    is_critical:         isCritical,
    critical_reasons:    criticalReasons,
    influence_category:  'CONGRESSIONAL_TRADE',

    // H35 compatibility
    entity_name:         representative,
    amount:              amount.midpoint,
  };

  trades.push(normalizedTrade);
  if (onWatchlist) watchlistHits.push(normalizedTrade);
  if (isCritical)  criticalSignals.push(normalizedTrade);
}

// Sort by freshness then amount
trades.sort((a, b) => {
  const freshnessOrder = { FRESH: 0, RECENT: 1, AGED: 2, STALE: 3 };
  const fDiff = (freshnessOrder[a.data_freshness] || 3) - (freshnessOrder[b.data_freshness] || 3);
  return fDiff !== 0 ? fDiff : b.amount_midpoint - a.amount_midpoint;
});

return [{ json: {
  source: 'H30_QUIVER_CONGRESSIONAL',
  status:               trades.length > 0 ? 'OK' : 'EMPTY',
  record_count:         trades.length,
  watchlist_hit_count:  watchlistHits.length,
  critical_signal_count: criticalSignals.length,
  trades:               trades.slice(0, 100), // Top 100 sorted by freshness/amount
  watchlist_hits:       watchlistHits,
  critical_signals:     criticalSignals,
  summary: {
    total_buys:    trades.filter(t => t.direction === 'BUY').length,
    total_sells:   trades.filter(t => t.direction === 'SELL').length,
    fresh_trades:  trades.filter(t => t.data_freshness === 'FRESH').length,
    senate_trades: trades.filter(t => t.house?.toLowerCase().includes('senate')).length,
    house_trades:  trades.filter(t => t.house?.toLowerCase().includes('house')).length,
  },
  data_quality:         'LIVE',
  timestamp:            new Date().toISOString(),
  version:              'H30_v2.0_QUIVER'
}}];
