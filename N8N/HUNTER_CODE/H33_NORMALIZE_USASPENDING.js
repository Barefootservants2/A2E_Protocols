// ============================================================
// H33 — USASPENDING NORMALIZER
// n8n Code Node (JavaScript)
// Input: Raw USASpending.gov API data from H33 HTTP Request node
// Output: Normalized influence records for H35 Correlator
// ============================================================
// USASpending API: https://api.usaspending.gov/
// Public API — no key required

const items = $input.all();
const normalized = [];

for (const item of items) {
  try {
    const raw = item.json;
    
    // USASpending endpoints return { results: [...] }
    const records = raw.results || [];

    if (!Array.isArray(records)) {
      normalized.push({
        json: {
          source: 'H33_USASPENDING',
          status: 'NO_DATA',
          timestamp: new Date().toISOString()
        }
      });
      continue;
    }

    for (const record of records) {
      // Determine record type based on available fields
      const isContract = record.Award_ID || record.generated_internal_id;
      const isAgencySpend = record.agency_name || record.toptier_agency_name;

      if (isContract) {
        normalized.push({
          json: {
            source: 'H33_USASPENDING',
            record_type: 'CONTRACT_AWARD',
            timestamp: new Date().toISOString(),

            // Award identification
            award_id: record.Award_ID || record.generated_internal_id || null,
            award_type: record.Award_Type || record.type_description || null,
            
            // Financial data
            total_obligation: parseFloat(record.Award_Amount || record.total_obligation || 0),
            total_outlay: parseFloat(record.total_outlay || 0),
            
            // Dates
            start_date: record.Start_Date || record.period_of_performance_start_date || null,
            end_date: record.End_Date || record.period_of_performance_current_end_date || null,
            last_modified: record.last_modified_date || null,

            // Recipient (publicly traded company mapping)
            recipient_name: record.Recipient || record.recipient_name || null,
            recipient_duns: record.recipient_duns || null,
            recipient_uei: record.recipient_uei || null,
            recipient_state: record.recipient_state_code || null,

            // Awarding agency
            awarding_agency: record.Awarding_Agency || record.awarding_toptier_agency_name || null,
            awarding_sub_agency: record.awarding_subtier_agency_name || null,
            funding_agency: record.funding_toptier_agency_name || null,

            // Contract details
            naics_code: record.naics_code || null,
            naics_description: record.naics_description || null,
            psc_code: record.product_or_service_code || null,
            description: record.Description || record.description || null,

            // Sector classification
            sector_tags: mapNAICSToSectors(record.naics_code, record.naics_description || ''),

            // Influence categorization for H35
            influence_category: 'GOVERNMENT_CONTRACT',
            data_freshness: calculateFreshness(record.last_modified_date || record.Start_Date),

            // Ticker mapping (attempt to match recipient to publicly traded companies)
            potential_tickers: mapRecipientToTickers(record.Recipient || record.recipient_name || ''),

            _raw_id: record.generated_internal_id || null
          }
        });
      } else if (isAgencySpend) {
        // Agency spending summary records
        normalized.push({
          json: {
            source: 'H33_USASPENDING',
            record_type: 'AGENCY_SPENDING',
            timestamp: new Date().toISOString(),

            agency_name: record.agency_name || record.toptier_agency_name || null,
            total_budgetary_resources: parseFloat(record.total_budgetary_resources || 0),
            total_obligations: parseFloat(record.total_obligations || record.obligated_amount || 0),
            total_outlays: parseFloat(record.total_outlays || 0),
            fiscal_year: record.fiscal_year || null,
            fiscal_period: record.fiscal_period || null,

            sector_tags: mapAgencyToSectors(record.agency_name || record.toptier_agency_name || ''),
            influence_category: 'AGENCY_BUDGET',
            data_freshness: 'REFERENCE'
          }
        });
      }
    }

  } catch (err) {
    normalized.push({
      json: {
        source: 'H33_USASPENDING',
        status: 'ERROR',
        error: err.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

if (normalized.length === 0) {
  normalized.push({
    json: {
      source: 'H33_USASPENDING',
      status: 'EMPTY',
      timestamp: new Date().toISOString(),
      record_count: 0
    }
  });
}

// === HELPER FUNCTIONS ===

function mapNAICSToSectors(code, description) {
  if (!code && !description) return ['UNCLASSIFIED'];
  const tags = new Set();
  const codeStr = String(code || '');
  const desc = (description || '').toUpperCase();

  // NAICS 2-digit sector mapping
  const naicsMap = {
    '33': 'TECHNOLOGY',    // Manufacturing — electronics, computers
    '51': 'TECHNOLOGY',    // Information
    '54': 'TECHNOLOGY',    // Professional, Scientific, Technical Services
    '33': 'DEFENSE',       // Also defense manufacturing
    '92': 'DEFENSE',       // Public Administration
    '21': 'ENERGY',        // Mining, Oil & Gas
    '22': 'ENERGY',        // Utilities
    '62': 'HEALTHCARE',    // Health Care
    '52': 'FINANCE',       // Finance and Insurance
    '48': 'INFRASTRUCTURE', // Transportation
    '23': 'INFRASTRUCTURE', // Construction
    '11': 'AGRICULTURE'    // Agriculture
  };

  const prefix2 = codeStr.substring(0, 2);
  if (naicsMap[prefix2]) tags.add(naicsMap[prefix2]);

  // Keyword overlay
  if (desc.includes('DEFENSE') || desc.includes('MILITARY')) tags.add('DEFENSE');
  if (desc.includes('SEMICONDUCTOR') || desc.includes('COMPUTER')) tags.add('TECHNOLOGY');
  if (desc.includes('AIRCRAFT') || desc.includes('SHIP')) tags.add('DEFENSE');
  if (desc.includes('PHARMA') || desc.includes('MEDICAL')) tags.add('HEALTHCARE');

  return tags.size > 0 ? [...tags] : ['UNCLASSIFIED'];
}

function mapAgencyToSectors(agencyName) {
  const name = (agencyName || '').toUpperCase();
  const tags = [];

  if (name.includes('DEFENSE') || name.includes('ARMY') || name.includes('NAVY') || name.includes('AIR FORCE')) tags.push('DEFENSE');
  if (name.includes('ENERGY')) tags.push('ENERGY');
  if (name.includes('HEALTH') || name.includes('FDA') || name.includes('NIH')) tags.push('HEALTHCARE');
  if (name.includes('TREASURY') || name.includes('SEC')) tags.push('FINANCE');
  if (name.includes('TRANSPORTATION') || name.includes('FAA')) tags.push('INFRASTRUCTURE');
  if (name.includes('AGRICULTURE') || name.includes('USDA')) tags.push('AGRICULTURE');
  if (name.includes('COMMERCE') || name.includes('TRADE')) tags.push('TRADE');
  if (name.includes('NASA') || name.includes('NSF') || name.includes('DARPA')) tags.push('TECHNOLOGY');

  return tags.length > 0 ? tags : ['GOVERNMENT'];
}

function mapRecipientToTickers(recipientName) {
  // Known defense/tech contractor mapping
  // This is a lookup table — extend as needed
  const name = (recipientName || '').toUpperCase();
  const tickerMap = {
    'LOCKHEED': 'LMT', 'RAYTHEON': 'RTX', 'NORTHROP': 'NOC',
    'BOEING': 'BA', 'GENERAL DYNAMICS': 'GD', 'L3HARRIS': 'LHX',
    'BAE SYSTEMS': 'BAESY', 'HUNTINGTON INGALLS': 'HII',
    'LEIDOS': 'LDOS', 'BOOZ ALLEN': 'BAH', 'SAIC': 'SAIC',
    'PALANTIR': 'PLTR', 'MICROSOFT': 'MSFT', 'AMAZON': 'AMZN',
    'GOOGLE': 'GOOGL', 'ORACLE': 'ORCL', 'IBM': 'IBM',
    'PFIZER': 'PFE', 'MODERNA': 'MRNA', 'JOHNSON': 'JNJ',
    'DELOITTE': null, 'ACCENTURE': 'ACN', 'MCKESSON': 'MCK'
  };

  const matches = [];
  for (const [keyword, ticker] of Object.entries(tickerMap)) {
    if (name.includes(keyword) && ticker) {
      matches.push(ticker);
    }
  }
  return matches;
}

function calculateFreshness(dateStr) {
  if (!dateStr) return 'UNKNOWN';
  const now = new Date();
  const d = new Date(dateStr);
  const daysDiff = (now - d) / (1000 * 60 * 60 * 24);
  
  if (daysDiff < 1) return 'BREAKING';
  if (daysDiff <= 7) return 'FRESH';
  if (daysDiff <= 28) return 'DIGESTED';
  if (daysDiff <= 180) return 'STALE';
  return 'ANCIENT';
}

return normalized;
