// ============================================================
// H34 — FEC (FEDERAL ELECTION COMMISSION) NORMALIZER
// n8n Code Node (JavaScript)
// Input: Raw FEC API data from H34 HTTP Request node
// Output: Normalized influence records for H35 Correlator
// ============================================================
// FEC API: https://api.open.fec.gov/
// Requires API key (free): https://api.data.gov/signup/

const items = $input.all();
const normalized = [];

for (const item of items) {
  try {
    const raw = item.json;
    
    // FEC returns { results: [...], pagination: {} }
    const records = raw.results || [];

    if (!Array.isArray(records)) {
      normalized.push({
        json: {
          source: 'H34_FEC',
          status: 'NO_DATA',
          timestamp: new Date().toISOString()
        }
      });
      continue;
    }

    for (const record of records) {
      // Detect record type based on fields present
      const isContribution = record.contributor_name || record.contribution_receipt_amount;
      const isCommittee = record.committee_id && record.committee_name && !isContribution;
      const isCandidate = record.candidate_id && record.candidate_name && !isContribution;
      const isDisbursement = record.disbursement_amount || record.recipient_name;

      if (isContribution) {
        // === INDIVIDUAL/PAC CONTRIBUTIONS ===
        normalized.push({
          json: {
            source: 'H34_FEC',
            record_type: 'CONTRIBUTION',
            timestamp: new Date().toISOString(),

            // Contributor
            contributor_name: record.contributor_name || null,
            contributor_employer: record.contributor_employer || null,
            contributor_occupation: record.contributor_occupation || null,
            contributor_city: record.contributor_city || null,
            contributor_state: record.contributor_state || null,

            // Contribution details
            amount: parseFloat(record.contribution_receipt_amount || 0),
            contribution_date: record.contribution_receipt_date || null,
            receipt_type: record.receipt_type_full || record.receipt_type || null,
            memo_text: record.memo_text || null,

            // Recipient
            committee_name: record.committee_name || null,
            committee_id: record.committee_id || null,
            candidate_name: record.candidate_name || null,
            candidate_party: record.candidate_party || null,
            candidate_office: record.candidate_office_full || record.candidate_office || null,
            candidate_state: record.candidate_state || null,

            // Employer → potential ticker mapping
            employer_ticker: mapEmployerToTicker(record.contributor_employer || ''),

            // Sector from employer
            sector_tags: classifyEmployerSector(record.contributor_employer || '', record.contributor_occupation || ''),

            // Influence categorization for H35
            influence_category: 'POLITICAL_CONTRIBUTION',
            data_freshness: calculateFreshness(record.contribution_receipt_date),
            
            // Large donor flag (>$2,900 individual or >$5,000 PAC)
            large_donor_flag: parseFloat(record.contribution_receipt_amount || 0) >= 2900,

            _raw_sub_id: record.sub_id || null
          }
        });
      } else if (isDisbursement) {
        // === COMMITTEE DISBURSEMENTS ===
        normalized.push({
          json: {
            source: 'H34_FEC',
            record_type: 'DISBURSEMENT',
            timestamp: new Date().toISOString(),

            committee_name: record.committee_name || null,
            committee_id: record.committee_id || null,

            recipient_name: record.recipient_name || null,
            recipient_city: record.recipient_city || null,
            recipient_state: record.recipient_state || null,

            amount: parseFloat(record.disbursement_amount || 0),
            disbursement_date: record.disbursement_date || null,
            purpose: record.disbursement_description || record.disbursement_purpose || null,
            category: record.disbursement_type_description || null,

            influence_category: 'POLITICAL_SPENDING',
            data_freshness: calculateFreshness(record.disbursement_date),

            _raw_sub_id: record.sub_id || null
          }
        });
      } else if (isCommittee) {
        // === COMMITTEE PROFILES ===
        normalized.push({
          json: {
            source: 'H34_FEC',
            record_type: 'COMMITTEE_PROFILE',
            timestamp: new Date().toISOString(),

            committee_name: record.committee_name || null,
            committee_id: record.committee_id || null,
            committee_type: record.committee_type_full || null,
            designation: record.designation_full || null,
            party: record.party_full || null,
            
            total_receipts: parseFloat(record.total_receipts || 0),
            total_disbursements: parseFloat(record.total_disbursements || 0),
            cash_on_hand: parseFloat(record.cash_on_hand_end_period || 0),
            debts_owed: parseFloat(record.debts_owed_by_committee || 0),

            // Affiliated candidate
            candidate_ids: record.candidate_ids || [],

            // PAC connected org (corporate PACs → ticker mapping)
            connected_org: record.connected_organization_name || null,
            connected_org_ticker: mapEmployerToTicker(record.connected_organization_name || ''),

            influence_category: 'COMMITTEE_PROFILE',
            data_freshness: 'REFERENCE'
          }
        });
      }
    }

  } catch (err) {
    normalized.push({
      json: {
        source: 'H34_FEC',
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
      source: 'H34_FEC',
      status: 'EMPTY',
      timestamp: new Date().toISOString(),
      record_count: 0
    }
  });
}

// === HELPER FUNCTIONS ===

function mapEmployerToTicker(employer) {
  if (!employer) return null;
  const name = employer.toUpperCase();
  
  const employerMap = {
    'GOOGLE': 'GOOGL', 'ALPHABET': 'GOOGL', 'META': 'META', 'FACEBOOK': 'META',
    'APPLE': 'AAPL', 'MICROSOFT': 'MSFT', 'AMAZON': 'AMZN',
    'NVIDIA': 'NVDA', 'INTEL': 'INTC', 'AMD': 'AMD', 'BROADCOM': 'AVGO',
    'GOLDMAN': 'GS', 'JPMORGAN': 'JPM', 'JP MORGAN': 'JPM', 'MORGAN STANLEY': 'MS',
    'BLACKROCK': 'BLK', 'CITADEL': null, 'BRIDGEWATER': null,
    'LOCKHEED': 'LMT', 'RAYTHEON': 'RTX', 'BOEING': 'BA', 'NORTHROP': 'NOC',
    'PFIZER': 'PFE', 'JOHNSON & JOHNSON': 'JNJ', 'UNITEDHEALTH': 'UNH',
    'EXXON': 'XOM', 'CHEVRON': 'CVX', 'CONOCOPHILLIPS': 'COP',
    'WALMART': 'WMT', 'BERKSHIRE': 'BRK.B', 'COMCAST': 'CMCSA',
    'DISNEY': 'DIS', 'NETFLIX': 'NFLX', 'TESLA': 'TSLA',
    'PALANTIR': 'PLTR', 'ORACLE': 'ORCL', 'SALESFORCE': 'CRM',
    'CATERPILLAR': 'CAT', 'DEERE': 'DE', 'GENERAL ELECTRIC': 'GE',
    'HONEYWELL': 'HON', '3M': 'MMM', 'SIEMENS': 'SIEGY'
  };

  for (const [keyword, ticker] of Object.entries(employerMap)) {
    if (name.includes(keyword) && ticker) return ticker;
  }
  return null;
}

function classifyEmployerSector(employer, occupation) {
  const text = `${employer} ${occupation}`.toUpperCase();
  const tags = [];

  if (/TECH|SOFTWARE|ENGINEER|COMPUTER|CYBER|AI |DATA/.test(text)) tags.push('TECHNOLOGY');
  if (/DEFENSE|MILITARY|ARMY|NAVY|MARINE/.test(text)) tags.push('DEFENSE');
  if (/OIL|GAS|ENERGY|PETROL|SOLAR|WIND/.test(text)) tags.push('ENERGY');
  if (/DOCTOR|PHYSICIAN|HOSPITAL|PHARMA|NURSE|HEALTH/.test(text)) tags.push('HEALTHCARE');
  if (/BANK|FINANC|INVEST|HEDGE|TRADER|WALL ST|INSURANCE/.test(text)) tags.push('FINANCE');
  if (/LAWYER|ATTORNEY|LAW FIRM|LEGAL|PARTNER/.test(text)) tags.push('LEGAL');
  if (/REAL ESTATE|PROPERTY|DEVELOPER|CONSTRUC/.test(text)) tags.push('REAL_ESTATE');
  if (/RETAIL|CONSUMER|MARKET/.test(text)) tags.push('CONSUMER');

  return tags.length > 0 ? tags : ['UNCLASSIFIED'];
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
