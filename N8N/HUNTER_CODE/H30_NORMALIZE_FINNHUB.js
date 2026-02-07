// ============================================================
// H30 — FINNHUB NORMALIZER
// n8n Code Node (JavaScript)
// Input: Raw Finnhub lobbying data from H30 HTTP Request node
// Output: Normalized influence records for H35 Correlator
// ============================================================

const items = $input.all();
const normalized = [];

for (const item of items) {
  try {
    const raw = item.json;
    
    // Handle Finnhub lobbying endpoint response
    // Endpoint: /stock/lobbying?symbol=AAPL&from=2024-01-01&to=2026-02-07
    const records = raw.data || raw || [];
    
    if (!Array.isArray(records)) {
      normalized.push({
        json: {
          source: 'H30_FINNHUB',
          status: 'NO_DATA',
          timestamp: new Date().toISOString(),
          error: 'Response is not an array'
        }
      });
      continue;
    }

    for (const record of records) {
      normalized.push({
        json: {
          // === STANDARD INFLUENCE SCHEMA ===
          source: 'H30_FINNHUB',
          record_type: 'LOBBYING',
          timestamp: new Date().toISOString(),
          
          // Entity identification
          symbol: record.symbol || null,
          entity_name: record.name || record.registrant || null,
          
          // Influence metrics
          amount: parseFloat(record.income || record.expenses || 0),
          period: record.period || record.year || null,
          
          // Activity details
          description: record.description || record.specificIssue || null,
          government_entity: record.governmentEntity || null,
          
          // Categorization for H35 correlation
          influence_category: 'CORPORATE_LOBBYING',
          data_freshness: calculateFreshness(record.period || record.year),
          
          // Raw preserved for audit
          _raw_id: record.id || null
        }
      });
    }
  } catch (err) {
    normalized.push({
      json: {
        source: 'H30_FINNHUB',
        status: 'ERROR',
        error: err.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// If no records processed, output empty marker
if (normalized.length === 0) {
  normalized.push({
    json: {
      source: 'H30_FINNHUB',
      status: 'EMPTY',
      timestamp: new Date().toISOString(),
      record_count: 0
    }
  });
}

function calculateFreshness(period) {
  if (!period) return 'UNKNOWN';
  const now = new Date();
  const periodDate = new Date(period);
  const daysDiff = (now - periodDate) / (1000 * 60 * 60 * 24);
  
  if (daysDiff < 1) return 'BREAKING';
  if (daysDiff <= 7) return 'FRESH';
  if (daysDiff <= 28) return 'DIGESTED';
  if (daysDiff <= 180) return 'STALE';
  return 'ANCIENT';
}

return normalized;
