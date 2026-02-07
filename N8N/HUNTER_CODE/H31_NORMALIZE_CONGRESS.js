// ============================================================
// H31 — CONGRESS.GOV NORMALIZER
// n8n Code Node (JavaScript)
// Input: Raw Congress.gov API data from H31 HTTP Request node
// Output: Normalized influence records for H35 Correlator
// ============================================================
// Congress.gov API: https://api.congress.gov/v3/
// Requires API key (signup: https://api.congress.gov/sign-up/)

const items = $input.all();
const normalized = [];

for (const item of items) {
  try {
    const raw = item.json;

    // Congress.gov returns { bills: [...] } or { amendments: [...] } etc.
    const bills = raw.bills || [];
    const members = raw.members || [];

    // === PROCESS BILLS ===
    if (Array.isArray(bills)) {
      for (const bill of bills) {
        // Extract committee info
        const committees = (bill.committees || []).map(c => c.name).join('; ');
        
        // Extract sponsor
        const sponsor = bill.sponsor
          ? `${bill.sponsor.firstName || ''} ${bill.sponsor.lastName || ''}`.trim()
          : null;
        const sponsorParty = bill.sponsor?.party || null;
        const sponsorState = bill.sponsor?.state || null;

        // Determine sector impact from title/subject
        const sectorTags = extractSectorTags(bill.title || '', bill.policyArea?.name || '');

        normalized.push({
          json: {
            // === STANDARD INFLUENCE SCHEMA ===
            source: 'H31_CONGRESS',
            record_type: 'BILL',
            timestamp: new Date().toISOString(),

            // Bill identification
            bill_number: bill.number || null,
            bill_type: bill.type || null, // HR, S, HJRES, SJRES
            congress: bill.congress || null,
            title: bill.title || null,

            // Legislative status
            latest_action: bill.latestAction?.text || null,
            latest_action_date: bill.latestAction?.actionDate || null,
            introduced_date: bill.introducedDate || null,

            // Sponsor info (for cross-reference with H32/H34)
            sponsor_name: sponsor,
            sponsor_party: sponsorParty,
            sponsor_state: sponsorState,

            // Committee assignment
            committees: committees || null,

            // Policy classification
            policy_area: bill.policyArea?.name || null,
            sector_tags: sectorTags,

            // Influence categorization for H35
            influence_category: 'LEGISLATION',
            data_freshness: calculateFreshness(bill.latestAction?.actionDate || bill.introducedDate),
            
            // Market relevance score (0-1)
            market_relevance: scoreMarketRelevance(bill.title || '', bill.policyArea?.name || ''),

            // Raw ID for audit
            _raw_url: bill.url || null
          }
        });
      }
    }

    // === PROCESS MEMBER ACTIVITY ===
    if (Array.isArray(members)) {
      for (const member of members) {
        normalized.push({
          json: {
            source: 'H31_CONGRESS',
            record_type: 'MEMBER_ACTIVITY',
            timestamp: new Date().toISOString(),

            member_name: member.name || null,
            member_party: member.partyName || null,
            member_state: member.state || null,
            member_chamber: member.terms?.item?.[0]?.chamber || null,

            // Committee assignments (for influence mapping)
            committees: (member.committees || []).map(c => c.name).join('; '),

            influence_category: 'MEMBER_PROFILE',
            data_freshness: 'REFERENCE',

            _raw_bioguideId: member.bioguideId || null
          }
        });
      }
    }

  } catch (err) {
    normalized.push({
      json: {
        source: 'H31_CONGRESS',
        status: 'ERROR',
        error: err.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Empty marker
if (normalized.length === 0) {
  normalized.push({
    json: {
      source: 'H31_CONGRESS',
      status: 'EMPTY',
      timestamp: new Date().toISOString(),
      record_count: 0
    }
  });
}

// === HELPER FUNCTIONS ===

function extractSectorTags(title, policyArea) {
  const text = `${title} ${policyArea}`.toUpperCase();
  const tags = [];
  
  const sectorMap = {
    'TECHNOLOGY': ['TECH', 'CYBER', 'AI ', 'ARTIFICIAL INTELLIGENCE', 'SEMICONDUCTOR', 'CHIP', 'DATA PRIVACY', 'DIGITAL'],
    'DEFENSE': ['DEFENSE', 'MILITARY', 'ARMED FORCES', 'NATIONAL SECURITY', 'WEAPON', 'PENTAGON'],
    'ENERGY': ['ENERGY', 'OIL', 'GAS', 'SOLAR', 'WIND', 'NUCLEAR', 'RENEWABLE', 'PETROLEUM', 'PIPELINE'],
    'HEALTHCARE': ['HEALTH', 'MEDICAL', 'PHARMA', 'DRUG', 'MEDICARE', 'MEDICAID', 'FDA', 'HOSPITAL'],
    'FINANCE': ['BANK', 'FINANCIAL', 'SEC ', 'SECURITIES', 'WALL STREET', 'CRYPTO', 'STABLECOIN', 'DEBT'],
    'INFRASTRUCTURE': ['INFRASTRUCTURE', 'HIGHWAY', 'BRIDGE', 'BROADBAND', 'RAIL', 'TRANSIT', 'WATER'],
    'AGRICULTURE': ['FARM', 'AGRICULTURE', 'FOOD', 'CROP', 'USDA'],
    'TRADE': ['TARIFF', 'TRADE', 'IMPORT', 'EXPORT', 'SANCTION', 'EMBARGO'],
    'METALS': ['MINING', 'MINERAL', 'RARE EARTH', 'CRITICAL MINERAL', 'GOLD', 'SILVER', 'STRATEGIC RESERVE']
  };

  for (const [sector, keywords] of Object.entries(sectorMap)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(sector);
    }
  }

  return tags.length > 0 ? tags : ['UNCLASSIFIED'];
}

function scoreMarketRelevance(title, policyArea) {
  const highRelevance = ['APPROPRIATION', 'TAX', 'TARIFF', 'SANCTION', 'REGULATION', 'SUBSID'];
  const medRelevance = ['AUTHORIZATION', 'REFORM', 'ACT OF', 'AMENDMENT'];
  
  const text = `${title} ${policyArea}`.toUpperCase();
  
  if (highRelevance.some(kw => text.includes(kw))) return 0.8;
  if (medRelevance.some(kw => text.includes(kw))) return 0.5;
  return 0.3;
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
