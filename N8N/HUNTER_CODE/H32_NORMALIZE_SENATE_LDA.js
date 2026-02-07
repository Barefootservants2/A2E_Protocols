// ============================================================
// H32 — SENATE LOBBYING DISCLOSURE (LDA) NORMALIZER
// n8n Code Node (JavaScript)
// Input: Raw Senate LDA API data from H32 HTTP Request node
// Output: Normalized influence records for H35 Correlator
// ============================================================
// Senate LDA API: https://lda.senate.gov/api/
// Public API — no key required

const items = $input.all();
const normalized = [];

for (const item of items) {
  try {
    const raw = item.json;
    
    // LDA returns { results: [...], count: N, next: url }
    const records = raw.results || raw.data || [];

    if (!Array.isArray(records)) {
      normalized.push({
        json: {
          source: 'H32_SENATE_LDA',
          status: 'NO_DATA',
          timestamp: new Date().toISOString()
        }
      });
      continue;
    }

    for (const record of records) {
      // Extract lobbying activities
      const activities = (record.lobbying_activities || []).map(act => ({
        description: act.general_issue_code_display || act.description || null,
        specific_issues: act.description || null,
        government_entities: (act.government_entities || []).map(ge => ge.name).join('; ')
      }));

      // Calculate total reported income/expenses
      const income = parseFloat(record.income || 0);
      const expenses = parseFloat(record.expenses || 0);
      const amount = income > 0 ? income : expenses;

      // Extract client and registrant
      const client = record.client?.name || record.client_name || null;
      const registrant = record.registrant?.name || record.registrant_name || null;

      // Map lobbying issues to market sectors
      const issueCodes = activities.map(a => a.description).filter(Boolean);
      const sectorTags = mapLDAIssuesToSectors(issueCodes);

      normalized.push({
        json: {
          // === STANDARD INFLUENCE SCHEMA ===
          source: 'H32_SENATE_LDA',
          record_type: 'LOBBYING_DISCLOSURE',
          timestamp: new Date().toISOString(),

          // Filing identification
          filing_uuid: record.filing_uuid || record.url || null,
          filing_type: record.filing_type_display || record.filing_type || null,
          filing_date: record.dt_posted || record.filing_date || null,
          filing_period: record.filing_period_display || null,
          filing_year: record.filing_year || null,

          // Entity information
          client_name: client,
          client_country: record.client?.country || null,
          client_state: record.client?.state || null,
          registrant_name: registrant,
          registrant_id: record.registrant?.id || null,

          // Financial data
          amount: amount,
          amount_type: income > 0 ? 'INCOME' : 'EXPENSES',

          // Lobbying activity details
          activities_count: activities.length,
          activities_summary: activities.slice(0, 5).map(a => a.description).join('; '),
          government_entities: [...new Set(activities.flatMap(a => 
            a.government_entities ? a.government_entities.split('; ') : []
          ))].join('; '),

          // Lobbyist details
          lobbyists: (record.lobbyists || []).map(l => ({
            name: `${l.lobbyist?.first_name || ''} ${l.lobbyist?.last_name || ''}`.trim(),
            covered_position: l.covered_position || null // Former gov positions
          })),
          covered_positions_count: (record.lobbyists || []).filter(l => l.covered_position).length,

          // Sector classification
          sector_tags: sectorTags,

          // Influence categorization for H35
          influence_category: 'LOBBYING_DISCLOSURE',
          data_freshness: calculateFreshness(record.dt_posted || record.filing_date),
          
          // Revolving door flag (lobbyists with former gov positions)
          revolving_door_flag: (record.lobbyists || []).some(l => l.covered_position) ? true : false,

          // Raw ID for audit
          _raw_filing_uuid: record.filing_uuid || null
        }
      });
    }

  } catch (err) {
    normalized.push({
      json: {
        source: 'H32_SENATE_LDA',
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
      source: 'H32_SENATE_LDA',
      status: 'EMPTY',
      timestamp: new Date().toISOString(),
      record_count: 0
    }
  });
}

// === HELPER FUNCTIONS ===

function mapLDAIssuesToSectors(issueCodes) {
  const tags = new Set();
  const issueText = issueCodes.join(' ').toUpperCase();

  const mapping = {
    'TECHNOLOGY': ['COMPUTER', 'TELECOM', 'CYBER', 'SCIENCE', 'CPT', 'SCI'],
    'DEFENSE': ['DEFENSE', 'HOMELAND', 'DEF', 'HOM'],
    'ENERGY': ['ENERGY', 'FUEL', 'ENE', 'FUE', 'NUCLEAR ENERGY'],
    'HEALTHCARE': ['HEALTH', 'PHARMA', 'HCR', 'PHA', 'DRUG'],
    'FINANCE': ['BANKING', 'FINANCIAL', 'BNK', 'FIN', 'SECURITIES', 'TAX', 'INSURANCE'],
    'TRADE': ['TRADE', 'TRD', 'TARIFF', 'FOR', 'FOREIGN'],
    'INFRASTRUCTURE': ['TRANSPORTATION', 'TRA', 'CONSTRUCTION'],
    'AGRICULTURE': ['AGRICULTURE', 'AGR', 'FOOD'],
    'METALS': ['MINING', 'MIN', 'NATURAL RESOURCES', 'NAT']
  };

  for (const [sector, keywords] of Object.entries(mapping)) {
    if (keywords.some(kw => issueText.includes(kw))) {
      tags.add(sector);
    }
  }

  return tags.size > 0 ? [...tags] : ['UNCLASSIFIED'];
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
