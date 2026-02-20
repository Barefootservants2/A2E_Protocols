// ============================================================
// GATE 5: AGENT CONSENSUS SCORING
// n8n Code Node (JavaScript)
// Position: AFTER Collective Merge (all 4+ agents responded)
// ============================================================
// PURPOSE: Score how many agents agree on direction/action.
// 4/4 = STRONG CONSENSUS. 2/4 = SPLIT → filter.
// Agents that received empty data are excluded from scoring.
//
// CONFIDENCE CASCADE: Gate 5 of 8
// METATRON v10.6 | AIORA Confidence Cascade v1.0
// ============================================================

const items = $input.all();
const CONSENSUS_THRESHOLD = 0.70; // 3/4 minimum to pass

// ============================================================
// STEP 1: Parse agent responses
// ============================================================

const agentResponses = {};
const agents = ['URIEL', 'COLOSSUS', 'HANIEL', 'RAZIEL'];

for (const item of items) {
  const data = item.json;
  const agentName = identifyAgent(data);
  
  if (agentName && agents.includes(agentName)) {
    agentResponses[agentName] = {
      name: agentName,
      responded: true,
      has_data: hasSubstantiveData(data),
      recommendations: extractRecommendations(data),
      confidence: extractConfidence(data),
      raw_length: JSON.stringify(data).length
    };
  }
}

// Mark non-responding agents
for (const agent of agents) {
  if (!agentResponses[agent]) {
    agentResponses[agent] = {
      name: agent,
      responded: false,
      has_data: false,
      recommendations: [],
      confidence: 0,
      raw_length: 0
    };
  }
}

// ============================================================
// STEP 2: Score consensus per ticker
// ============================================================

// Collect all tickers mentioned across agents
const tickerConsensus = {};

for (const [agentName, agent] of Object.entries(agentResponses)) {
  if (!agent.has_data) continue;
  
  for (const rec of agent.recommendations) {
    const sym = rec.ticker?.toUpperCase();
    if (!sym) continue;
    
    if (!tickerConsensus[sym]) {
      tickerConsensus[sym] = {
        symbol: sym,
        bullish_agents: [],
        bearish_agents: [],
        neutral_agents: [],
        no_opinion: [],
        total_voting: 0,
        consensus_direction: null,
        consensus_score: 0,
        pass_gate_5: false,
        agent_details: {}
      };
    }
    
    const direction = rec.direction?.toUpperCase() || 'NEUTRAL';
    
    if (['LONG', 'BUY', 'BULLISH', 'ACCUMULATE'].includes(direction)) {
      tickerConsensus[sym].bullish_agents.push(agentName);
    } else if (['SHORT', 'SELL', 'BEARISH', 'REDUCE', 'AVOID'].includes(direction)) {
      tickerConsensus[sym].bearish_agents.push(agentName);
    } else {
      tickerConsensus[sym].neutral_agents.push(agentName);
    }
    
    tickerConsensus[sym].agent_details[agentName] = {
      direction: direction,
      confidence: rec.confidence || agent.confidence,
      thesis: rec.thesis || '',
      target: rec.target || null,
      stop: rec.stop || null
    };
  }
}

// ============================================================
// STEP 3: Calculate consensus scores
// ============================================================

for (const [sym, consensus] of Object.entries(tickerConsensus)) {
  const active = Object.values(agentResponses).filter(a => a.has_data).length;
  const bullCount = consensus.bullish_agents.length;
  const bearCount = consensus.bearish_agents.length;
  const totalVoting = bullCount + bearCount + consensus.neutral_agents.length;
  
  consensus.total_voting = totalVoting;
  
  if (totalVoting === 0) {
    consensus.consensus_direction = 'NO_DATA';
    consensus.consensus_score = 0;
    consensus.pass_gate_5 = false;
    continue;
  }
  
  // Determine direction
  if (bullCount > bearCount) {
    consensus.consensus_direction = 'BULLISH';
    consensus.consensus_score = Math.round((bullCount / Math.max(active, totalVoting)) * 100) / 100;
  } else if (bearCount > bullCount) {
    consensus.consensus_direction = 'BEARISH';
    consensus.consensus_score = Math.round((bearCount / Math.max(active, totalVoting)) * 100) / 100;
  } else {
    consensus.consensus_direction = 'SPLIT';
    consensus.consensus_score = 0.5;
  }
  
  // Classification
  if (consensus.consensus_score >= 1.0) {
    consensus.classification = 'UNANIMOUS';
    consensus.pass_gate_5 = true;
  } else if (consensus.consensus_score >= CONSENSUS_THRESHOLD) {
    consensus.classification = 'CONSENSUS';
    consensus.pass_gate_5 = true;
  } else if (consensus.consensus_score >= 0.5) {
    consensus.classification = 'SPLIT';
    consensus.pass_gate_5 = false;
  } else {
    consensus.classification = 'MINORITY';
    consensus.pass_gate_5 = false;
  }
}

// ============================================================
// STEP 4: Build output
// ============================================================

const allTickers = Object.values(tickerConsensus);
const passing = allTickers.filter(t => t.pass_gate_5);
const filtered = allTickers.filter(t => !t.pass_gate_5);

const report = {
  gate: 'GATE_5_CONSENSUS_SCORING',
  timestamp: new Date().toISOString(),
  protocol: 'CONFIDENCE_CASCADE_v1.0',
  
  agent_status: Object.fromEntries(
    Object.entries(agentResponses).map(([name, a]) => [
      name, { responded: a.responded, has_data: a.has_data, confidence: a.confidence }
    ])
  ),
  
  active_agents: Object.values(agentResponses).filter(a => a.has_data).length,
  total_agents: agents.length,
  
  summary: {
    tickers_scored: allTickers.length,
    passing_gate_5: passing.length,
    filtered_out: filtered.length,
    unanimous: allTickers.filter(t => t.classification === 'UNANIMOUS').length,
    consensus: allTickers.filter(t => t.classification === 'CONSENSUS').length,
    split: allTickers.filter(t => t.classification === 'SPLIT').length,
    minority: allTickers.filter(t => t.classification === 'MINORITY').length
  },
  
  actionable: passing.map(t => ({
    symbol: t.symbol,
    direction: t.consensus_direction,
    consensus_score: t.consensus_score,
    classification: t.classification,
    bullish: t.bullish_agents,
    bearish: t.bearish_agents,
    neutral: t.neutral_agents,
    details: t.agent_details
  })),
  
  splits: filtered.filter(t => t.classification === 'SPLIT').map(t => ({
    symbol: t.symbol,
    bullish: t.bullish_agents,
    bearish: t.bearish_agents,
    _note: 'Split decision — requires Principal review if Gate 3 score > 90%'
  })),
  
  full_consensus_data: tickerConsensus
};

return [{ json: report }];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function identifyAgent(data) {
  // Identify which agent produced this response
  const text = JSON.stringify(data).toUpperCase();
  if (data.agent) return data.agent.toUpperCase();
  if (data.model?.includes('gpt') || text.includes('URIEL')) return 'URIEL';
  if (data.model?.includes('claude') || text.includes('MICHA')) return 'MICHA';
  if (data.model?.includes('grok') || text.includes('COLOSSUS')) return 'COLOSSUS';
  if (data.model?.includes('gemini') || text.includes('HANIEL')) return 'HANIEL';
  if (data.model?.includes('deepseek') || text.includes('RAZIEL')) return 'RAZIEL';
  return null;
}

function hasSubstantiveData(data) {
  const text = JSON.stringify(data);
  // Check for zombie output indicators
  if (text.length < 100) return false;
  if (text.includes('no data') || text.includes('no actionable') || 
      text.includes('empty') || text.includes('CATASTROPHIC')) return false;
  return true;
}

function extractRecommendations(data) {
  const recs = [];
  const text = typeof data.content === 'string' ? data.content : 
               typeof data.message === 'string' ? data.message : 
               JSON.stringify(data);
  
  // Try to parse structured recommendations
  if (data.recommendations && Array.isArray(data.recommendations)) {
    return data.recommendations;
  }
  
  // Extract ticker mentions with direction from unstructured text
  const tickerPattern = /\$?([A-Z]{1,5})\s*(?:—|-)?\s*(BUY|SELL|LONG|SHORT|BULLISH|BEARISH|ACCUMULATE|AVOID|HOLD|NEUTRAL)/gi;
  let match;
  while ((match = tickerPattern.exec(text)) !== null) {
    recs.push({
      ticker: match[1].toUpperCase(),
      direction: match[2].toUpperCase(),
      confidence: 0.5,
      thesis: ''
    });
  }
  
  return recs;
}

function extractConfidence(data) {
  if (data.confidence) return parseFloat(data.confidence);
  const text = JSON.stringify(data).toLowerCase();
  if (text.includes('high confidence')) return 0.85;
  if (text.includes('moderate confidence') || text.includes('medium confidence')) return 0.65;
  if (text.includes('low confidence')) return 0.35;
  return 0.5;
}
