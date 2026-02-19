// ============================================================
// H35 — INFLUENCE CHAIN CORRELATOR
// n8n Code Node (JavaScript)
// Input: Normalized records from H30, H31, H32, H33, H34
// Output: Correlated influence signals ranked by market impact
// ============================================================
// This is the BRAIN of the Influence Chain.
// 7 correlation algorithms cross-reference political activity
// with market-relevant entities to surface actionable signals.
// ============================================================

// Collect ALL normalized inputs from H30-H34

try {
const items = $input.all();

// Separate by source
const bySource = {
  H30_FINNHUB: [],
  H31_CONGRESS: [],
  H32_SENATE_LDA: [],
  H33_USASPENDING: [],
  H34_FEC: []
};

for (const item of items) {
  const src = item.json.source;
  if (bySource[src]) {
    bySource[src].push(item.json);
  }
}

// ============================================================
// ALGORITHM 1: SECTOR CONVERGENCE
// When multiple influence sources point to the same sector
// ============================================================
function sectorConvergence() {
  const sectorHits = {};

  for (const [source, records] of Object.entries(bySource)) {
    for (const record of records) {
      if (record.status === 'ERROR' || record.status === 'EMPTY') continue;
      const tags = record.sector_tags || [];
      for (const tag of tags) {
        if (!sectorHits[tag]) sectorHits[tag] = { sources: new Set(), records: [], total_amount: 0 };
        sectorHits[tag].sources.add(source);
        sectorHits[tag].records.push({
          source,
          type: record.record_type,
          freshness: record.data_freshness,
          amount: record.amount || record.total_obligation || 0
        });
        sectorHits[tag].total_amount += (record.amount || record.total_obligation || 0);
      }
    }
  }

  const signals = [];
  for (const [sector, data] of Object.entries(sectorHits)) {
    if (sector === 'UNCLASSIFIED') continue;
    const sourceCount = data.sources.size;
    if (sourceCount >= 2) {
      signals.push({
        algorithm: 'SECTOR_CONVERGENCE',
        sector: sector,
        source_count: sourceCount,
        sources: [...data.sources],
        record_count: data.records.length,
        total_amount: data.total_amount,
        freshest: getBestFreshness(data.records.map(r => r.freshness)),
        strength: Math.min(sourceCount / 5, 1.0), // Normalized 0-1
        detail: data.records.slice(0, 10)
      });
    }
  }

  return signals.sort((a, b) => b.strength - a.strength);
}

// ============================================================
// ALGORITHM 2: MONEY FLOW CORRELATION
// Large lobbying spend + large contracts + political donations
// pointing to the same entity/sector
// ============================================================
function moneyFlowCorrelation() {
  const entityFlows = {};

  // Aggregate lobbying spend (H30 + H32)
  for (const record of [...bySource.H30_FINNHUB, ...bySource.H32_SENATE_LDA]) {
    if (record.status) continue;
    const entity = (record.client_name || record.entity_name || record.registrant_name || '').toUpperCase();
    if (!entity) continue;
    if (!entityFlows[entity]) entityFlows[entity] = { lobbying: 0, contracts: 0, donations: 0, tickers: new Set(), sectors: new Set() };
    entityFlows[entity].lobbying += (record.amount || 0);
    (record.sector_tags || []).forEach(s => entityFlows[entity].sectors.add(s));
  }

  // Aggregate contract awards (H33)
  for (const record of bySource.H33_USASPENDING) {
    if (record.status) continue;
    const entity = (record.recipient_name || '').toUpperCase();
    if (!entity) continue;
    if (!entityFlows[entity]) entityFlows[entity] = { lobbying: 0, contracts: 0, donations: 0, tickers: new Set(), sectors: new Set() };
    entityFlows[entity].contracts += (record.total_obligation || 0);
    (record.potential_tickers || []).forEach(t => entityFlows[entity].tickers.add(t));
    (record.sector_tags || []).forEach(s => entityFlows[entity].sectors.add(s));
  }

  // Aggregate political donations (H34)
  for (const record of bySource.H34_FEC) {
    if (record.status) continue;
    const entity = (record.contributor_employer || record.connected_org || '').toUpperCase();
    if (!entity) continue;
    if (!entityFlows[entity]) entityFlows[entity] = { lobbying: 0, contracts: 0, donations: 0, tickers: new Set(), sectors: new Set() };
    entityFlows[entity].donations += (record.amount || 0);
    if (record.employer_ticker || record.connected_org_ticker) {
      entityFlows[entity].tickers.add(record.employer_ticker || record.connected_org_ticker);
    }
    (record.sector_tags || []).forEach(s => entityFlows[entity].sectors.add(s));
  }

  const signals = [];
  for (const [entity, flows] of Object.entries(entityFlows)) {
    const activeChannels = [flows.lobbying > 0, flows.contracts > 0, flows.donations > 0].filter(Boolean).length;
    if (activeChannels >= 2) {
      const totalFlow = flows.lobbying + flows.contracts + flows.donations;
      signals.push({
        algorithm: 'MONEY_FLOW',
        entity: entity,
        lobbying_total: flows.lobbying,
        contract_total: flows.contracts,
        donation_total: flows.donations,
        total_flow: totalFlow,
        active_channels: activeChannels,
        tickers: [...flows.tickers].filter(Boolean),
        sectors: [...flows.sectors],
        strength: Math.min(activeChannels / 3, 1.0)
      });
    }
  }

  return signals.sort((a, b) => b.total_flow - a.total_flow);
}

// ============================================================
// ALGORITHM 3: LEGISLATIVE CATALYST DETECTION
// Bills moving through committee + related lobbying surge
// ============================================================
function legislativeCatalyst() {
  const signals = [];
  const freshBills = bySource.H31_CONGRESS.filter(r => 
    r.record_type === 'BILL' && 
    ['BREAKING', 'FRESH'].includes(r.data_freshness)
  );

  for (const bill of freshBills) {
    const billSectors = bill.sector_tags || [];
    
    // Find matching lobbying activity in same sectors
    const matchingLobbying = [...bySource.H30_FINNHUB, ...bySource.H32_SENATE_LDA]
      .filter(r => {
        if (r.status) return false;
        const lobbySectors = r.sector_tags || [];
        return lobbySectors.some(s => billSectors.includes(s));
      });

    if (matchingLobbying.length > 0) {
      const totalLobbySpend = matchingLobbying.reduce((sum, r) => sum + (r.amount || 0), 0);
      signals.push({
        algorithm: 'LEGISLATIVE_CATALYST',
        bill_number: bill.bill_number,
        bill_title: bill.title,
        bill_status: bill.latest_action,
        sponsor: bill.sponsor_name,
        sponsor_party: bill.sponsor_party,
        sectors: billSectors,
        market_relevance: bill.market_relevance,
        related_lobbying_count: matchingLobbying.length,
        related_lobbying_spend: totalLobbySpend,
        freshness: bill.data_freshness,
        strength: bill.market_relevance * (matchingLobbying.length > 3 ? 1.0 : 0.6)
      });
    }
  }

  return signals.sort((a, b) => b.strength - a.strength);
}

// ============================================================
// ALGORITHM 4: REVOLVING DOOR TRACKER
// Lobbyists with former government positions → policy influence
// ============================================================
function revolvingDoor() {
  const signals = [];
  const rdRecords = bySource.H32_SENATE_LDA.filter(r => r.revolving_door_flag === true);

  for (const record of rdRecords) {
    const coveredLobbyists = (record.lobbyists || []).filter(l => l.covered_position);
    signals.push({
      algorithm: 'REVOLVING_DOOR',
      client: record.client_name,
      registrant: record.registrant_name,
      amount: record.amount,
      lobbyists_with_gov_positions: coveredLobbyists.length,
      positions: coveredLobbyists.map(l => ({
        name: l.name,
        former_position: l.covered_position
      })),
      sectors: record.sector_tags,
      government_entities: record.government_entities,
      freshness: record.data_freshness,
      strength: Math.min(coveredLobbyists.length / 3, 1.0)
    });
  }

  return signals.sort((a, b) => b.strength - a.strength);
}

// ============================================================
// ALGORITHM 5: CONTRACT ACCELERATION
// Sudden increase in contract awards to specific sectors/companies
// ============================================================
function contractAcceleration() {
  const signals = [];
  const contracts = bySource.H33_USASPENDING.filter(r => r.record_type === 'CONTRACT_AWARD');

  // Group by recipient
  const byRecipient = {};
  for (const c of contracts) {
    const name = c.recipient_name || 'UNKNOWN';
    if (!byRecipient[name]) byRecipient[name] = [];
    byRecipient[name].push(c);
  }

  for (const [recipient, awards] of Object.entries(byRecipient)) {
    if (awards.length < 2) continue;
    const totalValue = awards.reduce((sum, a) => sum + (a.total_obligation || 0), 0);
    const freshAwards = awards.filter(a => ['BREAKING', 'FRESH'].includes(a.data_freshness));
    
    if (freshAwards.length > 0) {
      const tickers = [...new Set(awards.flatMap(a => a.potential_tickers || []))];
      signals.push({
        algorithm: 'CONTRACT_ACCELERATION',
        recipient: recipient,
        total_awards: awards.length,
        fresh_awards: freshAwards.length,
        total_value: totalValue,
        tickers: tickers,
        sectors: [...new Set(awards.flatMap(a => a.sector_tags || []))],
        agencies: [...new Set(awards.map(a => a.awarding_agency).filter(Boolean))],
        strength: Math.min(freshAwards.length / 5, 1.0) * (tickers.length > 0 ? 1.0 : 0.5)
      });
    }
  }

  return signals.sort((a, b) => b.total_value - a.total_value);
}

// ============================================================
// ALGORITHM 6: POLITICAL DONATION CLUSTERING
// Concentration of corporate/PAC money toward specific committees
// ============================================================
function donationClustering() {
  const signals = [];
  const contributions = bySource.H34_FEC.filter(r => r.record_type === 'CONTRIBUTION');

  // Group by committee (recipient of donations)
  const byCommittee = {};
  for (const c of contributions) {
    const committee = c.committee_name || 'UNKNOWN';
    if (!byCommittee[committee]) byCommittee[committee] = { total: 0, donors: new Set(), sectors: new Set(), tickers: new Set() };
    byCommittee[committee].total += (c.amount || 0);
    byCommittee[committee].donors.add(c.contributor_name || 'ANON');
    (c.sector_tags || []).forEach(s => byCommittee[committee].sectors.add(s));
    if (c.employer_ticker) byCommittee[committee].tickers.add(c.employer_ticker);
  }

  for (const [committee, data] of Object.entries(byCommittee)) {
    if (data.donors.size < 3) continue;
    signals.push({
      algorithm: 'DONATION_CLUSTERING',
      committee: committee,
      total_amount: data.total,
      unique_donors: data.donors.size,
      sectors_represented: [...data.sectors],
      linked_tickers: [...data.tickers],
      strength: Math.min(data.donors.size / 10, 1.0)
    });
  }

  return signals.sort((a, b) => b.total_amount - a.total_amount);
}

// ============================================================
// ALGORITHM 7: TICKER CONVERGENCE (THE MONEY SIGNAL)
// When the same ticker appears across multiple influence sources
// THIS IS THE FINAL OUTPUT — actionable ticker signals
// ============================================================
function tickerConvergence() {
  const tickerSignals = {};

  // Scan ALL sources for ticker references
  for (const [source, records] of Object.entries(bySource)) {
    for (const record of records) {
      if (record.status) continue;
      const tickers = [];
      
      if (record.potential_tickers) tickers.push(...record.potential_tickers);
      if (record.employer_ticker) tickers.push(record.employer_ticker);
      if (record.connected_org_ticker) tickers.push(record.connected_org_ticker);
      if (record.symbol) tickers.push(record.symbol);

      for (const ticker of tickers.filter(Boolean)) {
        if (!tickerSignals[ticker]) tickerSignals[ticker] = {
          sources: new Set(), records: 0, total_amount: 0,
          categories: new Set(), sectors: new Set(), freshest: 'ANCIENT'
        };
        tickerSignals[ticker].sources.add(source);
        tickerSignals[ticker].records++;
        tickerSignals[ticker].total_amount += (record.amount || record.total_obligation || 0);
        if (record.influence_category) tickerSignals[ticker].categories.add(record.influence_category);
        (record.sector_tags || []).forEach(s => tickerSignals[ticker].sectors.add(s));
        tickerSignals[ticker].freshest = getBetterFreshness(tickerSignals[ticker].freshest, record.data_freshness);
      }
    }
  }

  const signals = [];
  for (const [ticker, data] of Object.entries(tickerSignals)) {
    signals.push({
      algorithm: 'TICKER_CONVERGENCE',
      ticker: ticker,
      source_count: data.sources.size,
      sources: [...data.sources],
      total_records: data.records,
      total_influence_amount: data.total_amount,
      influence_categories: [...data.categories],
      sectors: [...data.sectors],
      freshest_data: data.freshest,
      // Strength: multi-source + fresh + high dollar = strongest signal
      strength: (data.sources.size / 5) * 
                (freshnessWeight(data.freshest)) * 
                (Math.min(Math.log10(data.total_amount + 1) / 8, 1.0) || 0.1)
    });
  }

  return signals.sort((a, b) => b.strength - a.strength);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getBestFreshness(freshnessArray) {
  const order = ['BREAKING', 'FRESH', 'DIGESTED', 'STALE', 'ANCIENT', 'UNKNOWN', 'REFERENCE'];
  for (const level of order) {
    if (freshnessArray.includes(level)) return level;
  }
  return 'UNKNOWN';
}

function getBetterFreshness(a, b) {
  const order = ['BREAKING', 'FRESH', 'DIGESTED', 'STALE', 'ANCIENT', 'UNKNOWN', 'REFERENCE'];
  return order.indexOf(a) <= order.indexOf(b) ? a : b;
}

function freshnessWeight(freshness) {
  const weights = { 'BREAKING': 1.0, 'FRESH': 0.8, 'DIGESTED': 0.5, 'STALE': 0.2, 'ANCIENT': 0.05, 'UNKNOWN': 0.1, 'REFERENCE': 0.1 };
  return weights[freshness] || 0.1;
}

// ============================================================
// EXECUTE ALL 7 ALGORITHMS
// ============================================================

const allSignals = {
  sector_convergence: sectorConvergence(),
  money_flow: moneyFlowCorrelation(),
  legislative_catalyst: legislativeCatalyst(),
  revolving_door: revolvingDoor(),
  contract_acceleration: contractAcceleration(),
  donation_clustering: donationClustering(),
  ticker_convergence: tickerConvergence()
};

// ============================================================
// BUILD CONSOLIDATED REPORT
// ============================================================

const report = {
  source: 'H35_CORRELATOR',
  timestamp: new Date().toISOString(),
  
  // Summary stats
  summary: {
    total_input_records: items.length,
    records_by_source: Object.fromEntries(
      Object.entries(bySource).map(([k, v]) => [k, v.filter(r => !r.status).length])
    ),
    signals_generated: Object.fromEntries(
      Object.entries(allSignals).map(([k, v]) => [k, v.length])
    )
  },

  // TOP SIGNALS (highest strength across all algorithms)
  top_signals: Object.values(allSignals)
    .flat()
    .sort((a, b) => (b.strength || 0) - (a.strength || 0))
    .slice(0, 20),

  // Top tickers (the money signal)
  top_tickers: allSignals.ticker_convergence.slice(0, 10),

  // Active sectors
  active_sectors: allSignals.sector_convergence.slice(0, 5),

  // Full algorithm outputs
  algorithms: allSignals
};

return [{ json: report }];

} catch (error) {
  // Error handler for H35_CORRELATOR
  console.error(`[H35_CORRELATOR] Error: ${error.message}`);
  return [{
    json: {
      module: 'H35_CORRELATOR',
      error: true,
      error_message: error.message,
      timestamp: new Date().toISOString(),
      data: null
    }
  }];
}