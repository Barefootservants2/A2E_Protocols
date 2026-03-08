// ============================================================================
// CIL v6.0 — CASCADE VALIDATOR (MODIFIED)
// n8n Code Node | REPLACES existing CASCADE VALIDATOR code
// ============================================================================
// CHANGE: Was hardcoded 9 MARKET gates. Now iterates gate_config.gates[]
//         with evaluator functions from GATE CONFIG node.
//
// INPUT:   $json containing:
//          { agent_outputs, gate_config, domaindata, routing, runid, ... }
//
// OUTPUT:  Original input PLUS `cascade_result` object
// ============================================================================

const input = $input.first().json;
const gateConfig = input.gate_config || {};
const gates = gateConfig.gates || [];
const agentOutputs = input.agent_outputs || {};
const domaindata = input.domaindata || {};
const targetScore = gateConfig.target_score || 90;
const failThreshold = gateConfig.fail_threshold || 40;
const scoringMethod = gateConfig.scoring_method || "WEIGHTED_AVERAGE";

// ============================================================================
// EVALUATE EACH GATE
// ============================================================================

const gateResults = [];
let weightedSum = 0;
let totalWeight = 0;
let hardFails = 0;
let warnings = [];

for (const gate of gates) {
  let result;

  try {
    // Build evaluator function from serialized body
    // Function receives: agentOutputs, domaindata, threshold
    const evalFn = new Function('agentOutputs', 'domaindata', 'threshold', gate.evaluator);
    result = evalFn(agentOutputs, domaindata, gate.threshold);
  } catch (err) {
    result = {
      passed: false,
      score: 0,
      detail: `EVALUATOR ERROR: ${err.message}`
    };
    warnings.push(`Gate ${gate.id} (${gate.name}) evaluator threw: ${err.message}`);
  }

  const gateResult = {
    id: gate.id,
    name: gate.name,
    weight: gate.weight,
    threshold: gate.threshold,
    score: result.score || 0,
    passed: result.passed || false,
    detail: result.detail || "",
    description: gate.description
  };

  gateResults.push(gateResult);

  // Weighted scoring
  weightedSum += (gateResult.score * gate.weight);
  totalWeight += gate.weight;

  // Track hard fails
  if (gateResult.score < failThreshold) {
    hardFails++;
    warnings.push(`HARD FAIL: Gate ${gate.id} ${gate.name} scored ${gateResult.score}% (below ${failThreshold}% threshold)`);
  }
}

// ============================================================================
// COMPUTE OVERALL SCORE
// ============================================================================

let overallScore = 0;

if (scoringMethod === "WEIGHTED_AVERAGE" && totalWeight > 0) {
  overallScore = Math.round(weightedSum / totalWeight);
} else if (scoringMethod === "SIMPLE_AVERAGE" && gates.length > 0) {
  overallScore = Math.round(gateResults.reduce((s, g) => s + g.score, 0) / gates.length);
} else if (scoringMethod === "MINIMUM") {
  overallScore = gateResults.length > 0 ? Math.min(...gateResults.map(g => g.score)) : 0;
}

// Overall pass: score >= target AND no hard fails (unless overridden)
const passed = overallScore >= targetScore && hardFails === 0;

// ============================================================================
// CONFIDENCE CLASSIFICATION
// ============================================================================

let confidenceLevel;
if (overallScore >= 90) confidenceLevel = "HIGH";
else if (overallScore >= 70) confidenceLevel = "MODERATE";
else if (overallScore >= 50) confidenceLevel = "LOW";
else confidenceLevel = "INSUFFICIENT";

// ============================================================================
// DATA COMPLETENESS (for backward compat with v5.2.1 output)
// ============================================================================

const agents = Object.values(agentOutputs);
const totalFields = agents.reduce((sum, a) => sum + Object.keys(a).filter(k => !k.startsWith('_')).length, 0);
const filledFields = agents.reduce((sum, a) => {
  return sum + Object.entries(a).filter(([k, v]) => {
    if (k.startsWith('_')) return false;
    if (v === null || v === undefined || v === '') return false;
    if (v === 'INSUFFICIENT_DATA') return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }).length;
}, 0);
const dataCompleteness = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

// ============================================================================
// OUTPUT
// ============================================================================

return [{
  json: {
    ...input,
    cascade_result: {
      overall_score: overallScore,
      passed: passed,
      confidence_level: confidenceLevel,
      target_score: targetScore,
      hard_fails: hardFails,
      gates_passed: gateResults.filter(g => g.passed).length,
      gates_total: gateResults.length,
      gate_results: gateResults,
      data_completeness: dataCompleteness,
      scoring_method: scoringMethod,
      warnings: warnings,
      domain: input.domain,
      runid: input.runid,
      _timestamp: new Date().toISOString()
    }
  }
}];
