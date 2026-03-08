// ============================================================================
// CIL v6.0 — GATE CONFIG
// n8n Code Node | Position: After 5 Agent responses merge, Before CASCADE VALIDATOR
// ============================================================================
// PURPOSE: Takes domain routing config + merged agent outputs and produces
//          the gate evaluation array with scoring functions. CASCADE VALIDATOR
//          iterates this array instead of hardcoding 9 specific checks.
//
// INPUT:   $json containing:
//          { routing (from DOMAIN ROUTER), agent_outputs (from COLLECTIVE ASSEMBLER merge),
//            domain, query, domaindata, runid, ... }
//
// OUTPUT:  Original input PLUS `gate_config` object with:
//          - gates[] — ordered array of gate definitions with evaluation logic
//          - target_score — overall pass threshold (default 90%)
//          - scoring_method — how gates combine into final score
// ============================================================================

const input = $input.first().json;
const routing = input.routing;
const domain = input.domain;
const agentOutputs = input.agent_outputs || {};

// ============================================================================
// GATE EVALUATION FUNCTIONS
// ============================================================================
// Each gate has an `evaluate` function that receives agent outputs and returns
// { passed: bool, score: 0-100, detail: string }
//
// These are SERIALIZED as function bodies so CASCADE VALIDATOR can execute them.
// CASCADE VALIDATOR will wrap each in: new Function('agentOutputs', 'domaindata', body)
// ============================================================================

// ── UNIVERSAL GATES (all domains) ──

const UNIVERSAL_GATE_EVALUATORS = {

  DATA_SUFFICIENCY: `
    // Gate 1: Do agents have enough data to form opinions?
    const agents = Object.values(agentOutputs);
    if (agents.length === 0) return { passed: false, score: 0, detail: "No agent outputs received" };

    let totalGaps = 0;
    let totalFields = 0;
    for (const agent of agents) {
      const gaps = (agent.data_gaps || []).length;
      const schema = Object.keys(agent).filter(k => k !== 'data_gaps' && k !== '_agent' && k !== '_raw');
      const filled = schema.filter(k => agent[k] !== null && agent[k] !== undefined && agent[k] !== '' && agent[k] !== 'INSUFFICIENT_DATA').length;
      totalGaps += gaps;
      totalFields += schema.length;
    }
    const gapRatio = totalFields > 0 ? (totalFields - totalGaps) / totalFields : 0;
    const score = Math.round(gapRatio * 100);
    return { passed: score >= threshold, score, detail: \`\${totalGaps} data gaps across \${agents.length} agents, \${totalFields} total fields\` };
  `,

  DIRECTIONAL_CONSENSUS: `
    // Gate 2: Do agents agree on primary direction/position?
    const agents = Object.values(agentOutputs);
    if (agents.length === 0) return { passed: false, score: 0, detail: "No agent outputs" };

    // Get the primary directional field (direction for MARKET, position for others)
    const dirField = agents[0].direction !== undefined ? 'direction' : 'position';
    const directions = agents.map(a => (a[dirField] || 'UNKNOWN').toUpperCase()).filter(d => d !== 'INSUFFICIENT_DATA' && d !== 'UNKNOWN');

    if (directions.length === 0) return { passed: false, score: 0, detail: "No directional signals from any agent" };

    // Count consensus
    const counts = {};
    for (const d of directions) { counts[d] = (counts[d] || 0) + 1; }
    const maxCount = Math.max(...Object.values(counts));
    const consensusDir = Object.entries(counts).find(([k,v]) => v === maxCount)[0];
    const consensusPct = Math.round((maxCount / agents.length) * 100);

    return {
      passed: consensusPct >= threshold,
      score: consensusPct,
      detail: \`\${maxCount}/\${agents.length} agents say \${consensusDir} (\${consensusPct}%)\`
    };
  `,

  CATALYST_PRESENT: `
    // Gate 3: Is there at least one identifiable catalyst or evidence point?
    const agents = Object.values(agentOutputs);
    const catalystField = agents[0].catalysts !== undefined ? 'catalysts' : 'recommendations';

    let totalCatalysts = 0;
    let datedCatalysts = 0;
    for (const agent of agents) {
      const items = agent[catalystField] || [];
      totalCatalysts += items.length;
      // Check for date-like strings in catalyst descriptions
      const datePattern = /\\d{4}|\\d{1,2}\\/\\d{1,2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|q[1-4]|week|tomorrow|monday|tuesday|wednesday|thursday|friday/i;
      datedCatalysts += items.filter(c => datePattern.test(c)).length;
    }

    const hasCatalysts = totalCatalysts > 0;
    const hasDated = datedCatalysts > 0;
    const score = hasDated ? 100 : (hasCatalysts ? 70 : 0);

    return {
      passed: score >= threshold,
      score,
      detail: \`\${totalCatalysts} total catalysts/recommendations, \${datedCatalysts} with dates\`
    };
  `,

  TIMELINE_ALIGNMENT: `
    // Gate 5: Do agent timeframes/complexity assessments roughly align?
    const agents = Object.values(agentOutputs);
    const tfField = agents[0].timeframe !== undefined ? 'timeframe' : 'complexity';

    const values = agents.map(a => (a[tfField] || 'UNKNOWN').toUpperCase()).filter(v => v !== 'UNKNOWN');
    if (values.length <= 1) return { passed: true, score: 70, detail: "Insufficient timeframe data — passing with reduced score" };

    // Map to numeric for spread calculation
    const TIMEFRAME_MAP = { INTRADAY: 1, SHORT: 1, LOW: 1, SWING: 2, MEDIUM: 2, POSITION: 3, HIGH: 3, LONG: 4, CRITICAL: 4 };
    const numeric = values.map(v => TIMEFRAME_MAP[v] || 2);
    const spread = Math.max(...numeric) - Math.min(...numeric);

    // Spread of 0 = perfect, 1 = acceptable, 2 = concerning, 3 = misaligned
    const score = Math.max(0, 100 - (spread * 25));

    return {
      passed: score >= threshold,
      score,
      detail: \`Timeframe spread: \${spread} (values: \${values.join(', ')})\`
    };
  `,

  COUNTER_THESIS_ADDRESSED: `
    // Gate 7 / 7.5: Has each agent identified risks (counter-thesis)?
    const agents = Object.values(agentOutputs);
    let agentsWithRisks = 0;
    let totalRisks = 0;

    for (const agent of agents) {
      const risks = agent.risks || [];
      if (risks.length > 0) {
        agentsWithRisks++;
        totalRisks += risks.length;
      }
    }

    const coverage = agents.length > 0 ? Math.round((agentsWithRisks / agents.length) * 100) : 0;
    const depth = totalRisks >= 5 ? 100 : Math.round((totalRisks / 5) * 100);
    const score = Math.round((coverage * 0.6) + (depth * 0.4));

    return {
      passed: score >= threshold,
      score,
      detail: \`\${agentsWithRisks}/\${agents.length} agents identified risks, \${totalRisks} total risk factors\`
    };
  `
};

// ── MARKET-SPECIFIC GATES ──

const MARKET_GATE_EVALUATORS = {

  RISK_REWARD_RATIO: `
    // Gate 4 (MARKET): Risk/Reward assessment from agent confidence + direction
    const agents = Object.values(agentOutputs);
    const confidences = agents.map(a => a.confidence || 0);
    const avgConfidence = confidences.reduce((s,c) => s + c, 0) / Math.max(confidences.length, 1);

    // R:R is favorable if average confidence > 60 and direction consensus exists
    const directions = agents.map(a => (a.direction || '').toUpperCase());
    const bullish = directions.filter(d => d === 'BULLISH').length;
    const bearish = directions.filter(d => d === 'BEARISH').length;
    const hasDirection = Math.max(bullish, bearish) >= 3;

    const score = hasDirection ? Math.round(avgConfidence) : Math.round(avgConfidence * 0.6);

    return {
      passed: score >= threshold,
      score,
      detail: \`Avg confidence: \${avgConfidence.toFixed(1)}, Direction: \${bullish}B/\${bearish}S, R:R score: \${score}\`
    };
  `,

  SECTOR_CONTEXT: `
    // Gate 6 (MARKET): Sector/macro alignment
    const agents = Object.values(agentOutputs);
    let sectorMentions = 0;
    let macroMentions = 0;

    const sectorKeywords = /sector|industry|peer|relative|index|s&p|nasdaq|dow|russell/i;
    const macroKeywords = /fed|rate|inflation|gdp|cpi|ppi|employment|yield|dxy|dollar|treasury|macro/i;

    for (const agent of agents) {
      const text = JSON.stringify(agent);
      if (sectorKeywords.test(text)) sectorMentions++;
      if (macroKeywords.test(text)) macroMentions++;
    }

    const score = Math.min(100, Math.round(((sectorMentions + macroMentions) / (agents.length * 2)) * 100));

    return {
      passed: score >= threshold,
      score,
      detail: \`\${sectorMentions} sector refs, \${macroMentions} macro refs across \${agents.length} agents\`
    };
  `,

  IRONCLAD_POSITION_SIZE: `
    // Gate 8 (MARKET): Position sizing within IRONCLAD limits
    // This gate checks that the collective isn't recommending outsized exposure
    const agents = Object.values(agentOutputs);
    const confidences = agents.map(a => a.confidence || 0);
    const avgConfidence = confidences.reduce((s,c) => s + c, 0) / Math.max(confidences.length, 1);

    // IRONCLAD v2.0: risk/trade=1.5%, position=20%, sector=35%
    // If avg confidence < 70, position should be reduced
    // We check if the data supports taking a position at all
    const directions = agents.map(a => (a.direction || '').toUpperCase());
    const insufficient = directions.filter(d => d === 'INSUFFICIENT_DATA').length;

    let score = 100;
    if (insufficient >= 3) score = 20; // Majority says insufficient — cannot size
    else if (insufficient >= 2) score = 50;
    else if (avgConfidence < 50) score = 40;
    else if (avgConfidence < 70) score = 65;
    else score = Math.min(100, Math.round(avgConfidence * 1.1));

    return {
      passed: score >= threshold,
      score,
      detail: \`Avg confidence: \${avgConfidence.toFixed(1)}, Insufficient signals: \${insufficient}/\${agents.length}\`
    };
  `,

  HUNTER_COMPLETENESS: `
    // Gate 3b (MARKET): HUNTER module data coverage
    const dd = domaindata || {};
    const hunterModules = dd.hunter_modules || {};

    // Core HUNTER modules expected
    const coreModules = ['H1','H2','H3','H4','H5','H6','H7','H8','H9','H10','H11','H12','H13','H14','H15','H16','H17','H18','H19','H20'];
    const extModules = ['H30','H31','H32','H33','H34','H35','H37','H38','H39'];
    const allExpected = [...coreModules, ...extModules];

    const present = Object.keys(hunterModules);
    const corePresent = present.filter(k => coreModules.includes(k)).length;
    const extPresent = present.filter(k => extModules.includes(k)).length;

    // Core weighted 70%, extended 30%
    const coreScore = (corePresent / coreModules.length) * 70;
    const extScore = (extPresent / extModules.length) * 30;
    const score = Math.round(coreScore + extScore);

    return {
      passed: score >= threshold,
      score,
      detail: \`HUNTER core: \${corePresent}/\${coreModules.length}, extended: \${extPresent}/\${extModules.length}\`
    };
  `
};

// ── GENERAL-SPECIFIC GATES ──

const GENERAL_GATE_EVALUATORS = {

  FEASIBILITY_CHECK: `
    // Gate 4 (GENERAL): Are recommended actions achievable?
    const agents = Object.values(agentOutputs);
    let hasRecs = 0;
    let totalRecs = 0;

    for (const agent of agents) {
      const recs = agent.recommendations || [];
      if (recs.length > 0) hasRecs++;
      totalRecs += recs.length;
    }

    const coverage = agents.length > 0 ? Math.round((hasRecs / agents.length) * 100) : 0;
    const score = totalRecs >= 3 ? Math.min(100, coverage + 20) : coverage;

    return {
      passed: score >= threshold,
      score,
      detail: \`\${hasRecs}/\${agents.length} agents provided recommendations, \${totalRecs} total items\`
    };
  `,

  CONSISTENCY_CHECK: `
    // Gate 6 (GENERAL): No major contradictions across agents
    const agents = Object.values(agentOutputs);
    const positions = agents.map(a => (a.position || '').toUpperCase()).filter(p => p && p !== 'INSUFFICIENT_DATA');

    if (positions.length <= 1) return { passed: true, score: 75, detail: "Insufficient data for consistency check" };

    const counts = {};
    for (const p of positions) { counts[p] = (counts[p] || 0) + 1; }
    const values = Object.values(counts);
    const maxCount = Math.max(...values);
    const hasOpposition = counts['SUPPORT'] > 0 && counts['OPPOSE'] > 0;

    let score;
    if (!hasOpposition) score = 100;
    else if (maxCount >= 4) score = 80;
    else if (maxCount >= 3) score = 65;
    else score = 40; // 2-2 split or worse

    return {
      passed: score >= threshold,
      score,
      detail: \`Position distribution: \${JSON.stringify(counts)}\`
    };
  `,

  COMPLETENESS_SCORE: `
    // Gate 8 (GENERAL): All aspects of the query addressed
    const agents = Object.values(agentOutputs);
    const schemaKeys = ['analysis', 'key_factors', 'risks', 'recommendations', 'confidence', 'complexity'];

    let filledCount = 0;
    let totalChecks = agents.length * schemaKeys.length;

    for (const agent of agents) {
      for (const key of schemaKeys) {
        const val = agent[key];
        if (val !== null && val !== undefined && val !== '' && val !== 'INSUFFICIENT_DATA') {
          if (Array.isArray(val) && val.length > 0) filledCount++;
          else if (!Array.isArray(val)) filledCount++;
        }
      }
    }

    const score = totalChecks > 0 ? Math.round((filledCount / totalChecks) * 100) : 0;

    return {
      passed: score >= threshold,
      score,
      detail: \`\${filledCount}/\${totalChecks} schema fields populated\`
    };
  `,

  SOURCE_QUALITY: `
    // Gate 3b (GENERAL): Evidence quality assessment
    const agents = Object.values(agentOutputs);
    let factorsCount = 0;
    let evidenceDepth = 0;

    for (const agent of agents) {
      const factors = agent.key_factors || [];
      factorsCount += factors.length;
      // Rough heuristic: longer factors = more substantive
      for (const f of factors) {
        if (typeof f === 'string' && f.length > 30) evidenceDepth++;
      }
    }

    const breadth = Math.min(100, Math.round((factorsCount / 15) * 100)); // Expect ~15 total factors
    const depth = Math.min(100, Math.round((evidenceDepth / 10) * 100));
    const score = Math.round((breadth * 0.5) + (depth * 0.5));

    return {
      passed: score >= threshold,
      score,
      detail: \`\${factorsCount} factors cited, \${evidenceDepth} substantive (>30 chars)\`
    };
  `
};

// ============================================================================
// BUILD GATE ARRAY FOR THIS DOMAIN
// ============================================================================

const domainEvaluators = domain === "MARKET" ? MARKET_GATE_EVALUATORS : GENERAL_GATE_EVALUATORS;

// Map gate definitions to full config with evaluators
const allGates = routing.all_gates.map(gate => {
  // Find evaluator — check universal first, then domain-specific
  let evaluator = UNIVERSAL_GATE_EVALUATORS[gate.name] || domainEvaluators[gate.name];

  if (!evaluator) {
    evaluator = `return { passed: true, score: 50, detail: "No evaluator defined for ${gate.name}" };`;
  }

  return {
    ...gate,
    evaluator: evaluator.trim()
  };
});

// ============================================================================
// OUTPUT
// ============================================================================

return [{
  json: {
    ...input,
    gate_config: {
      gates: allGates,
      gate_count: allGates.length,
      target_score: 90,
      scoring_method: "WEIGHTED_AVERAGE",
      pass_threshold: 70,    // Individual gate minimum to not flag warning
      fail_threshold: 40,    // Individual gate score below this = hard fail
      domain: domain,
      _timestamp: new Date().toISOString()
    }
  }
}];
