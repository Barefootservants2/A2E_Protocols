// ============================================================
// GATE 6: COUNTER-THESIS SCORING (RAZIEL)
// n8n Code Node (JavaScript)
// Position: AFTER Gate 5 Consensus, processes RAZIEL output
// ============================================================
// PURPOSE: Score the STRENGTH of the bear case. If RAZIEL can't
// kill the thesis, the thesis is strong. If RAZIEL finds
// compelling data-backed reasons to avoid, filter the trade.
//
// BAYESIAN LOGIC: Absence of disconfirming evidence IS
// confirming evidence. A weak bear case = strong bull case.
//
// CONFIDENCE CASCADE: Gate 6 of 8
// METATRON v10.6 | AIORA Confidence Cascade v1.0
// ============================================================

const items = $input.all();

// ============================================================
// STEP 1: Parse RAZIEL counter-thesis output
// ============================================================

// Gate 5 output contains consensus data + RAZIEL's response
const gate5Data = items[0]?.json;
const actionableTickers = gate5Data?.actionable || [];

// RAZIEL's analysis should be in the agent_details or separate input
const razielData = extractRazielAnalysis(items);

// ============================================================
// STEP 2: Score each ticker's bear case
// ============================================================

const scoredTickers = [];

for (const ticker of actionableTickers) {
  const sym = ticker.symbol;
  const bearCase = razielData[sym] || null;
  
  const scoring = {
    symbol: sym,
    consensus_from_gate5: ticker.consensus_score,
    direction: ticker.direction,
    bear_case_present: false,
    bear_case_score: 0,
    bear_case_factors: [],
    pass_gate_6: false,
    action: 'FILTERED'
  };
  
  if (!bearCase) {
    // RAZIEL didn't analyze this ticker — no bear case found
    scoring.bear_case_present = false;
    scoring.bear_case_score = 0;
    scoring.pass_gate_6 = true;
    scoring.action = 'PASS_NO_BEAR_CASE';
    scoring.note = 'RAZIEL found no counter-thesis. Bull case stands by default.';
  } else {
    scoring.bear_case_present = true;
    
    // Score individual bear case factors
    const factors = [];
    
    // Factor 1: Data-backed risks (highest weight)
    if (bearCase.data_backed_risks && bearCase.data_backed_risks.length > 0) {
      factors.push({
        type: 'DATA_BACKED_RISK',
        weight: 0.35,
        count: bearCase.data_backed_risks.length,
        score: Math.min(bearCase.data_backed_risks.length * 0.25, 1.0),
        details: bearCase.data_backed_risks
      });
    }
    
    // Factor 2: Macro headwinds
    if (bearCase.macro_headwinds) {
      factors.push({
        type: 'MACRO_HEADWIND',
        weight: 0.20,
        score: bearCase.macro_severity || 0.5,
        details: bearCase.macro_headwinds
      });
    }
    
    // Factor 3: Technical weakness
    if (bearCase.technical_weakness) {
      factors.push({
        type: 'TECHNICAL_WEAKNESS',
        weight: 0.15,
        score: bearCase.technical_severity || 0.5,
        details: bearCase.technical_weakness
      });
    }
    
    // Factor 4: Catalyst risk (earnings miss, FDA, etc.)
    if (bearCase.catalyst_risk) {
      factors.push({
        type: 'CATALYST_RISK',
        weight: 0.20,
        score: bearCase.catalyst_severity || 0.5,
        details: bearCase.catalyst_risk
      });
    }
    
    // Factor 5: Historical precedent (this pattern failed before)
    if (bearCase.historical_failure) {
      factors.push({
        type: 'HISTORICAL_FAILURE',
        weight: 0.10,
        score: bearCase.failure_rate || 0.5,
        details: bearCase.historical_failure
      });
    }
    
    scoring.bear_case_factors = factors;
    
    // Calculate weighted bear case score
    if (factors.length > 0) {
      const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
      scoring.bear_case_score = Math.round(
        factors.reduce((s, f) => s + (f.score * f.weight), 0) / totalWeight * 100
      ) / 100;
    }
    
    // Gate decision
    if (scoring.bear_case_score >= 0.75) {
      // Strong bear case — FILTER the trade
      scoring.pass_gate_6 = false;
      scoring.action = 'FILTERED_STRONG_BEAR';
      scoring.note = 'RAZIEL found compelling counter-thesis. Trade filtered.';
    } else if (scoring.bear_case_score >= 0.50) {
      // Moderate bear case — CAUTION, reduce size
      scoring.pass_gate_6 = true;
      scoring.action = 'PASS_WITH_CAUTION';
      scoring.note = 'Moderate bear case. Recommend NIBBLE size, not full position.';
      scoring.size_recommendation = 'NIBBLE';
    } else {
      // Weak bear case — thesis is strong
      scoring.pass_gate_6 = true;
      scoring.action = 'PASS_WEAK_BEAR';
      scoring.note = 'Bear case is weak. Bull thesis confirmed by absence of strong counter.';
    }
  }
  
  scoredTickers.push(scoring);
}

// ============================================================
// STEP 3: Build output
// ============================================================

const passing = scoredTickers.filter(t => t.pass_gate_6);
const filtered = scoredTickers.filter(t => !t.pass_gate_6);

const report = {
  gate: 'GATE_6_COUNTER_THESIS_SCORING',
  timestamp: new Date().toISOString(),
  protocol: 'CONFIDENCE_CASCADE_v1.0',
  
  summary: {
    tickers_evaluated: scoredTickers.length,
    passing_gate_6: passing.length,
    filtered_strong_bear: filtered.length,
    pass_with_caution: passing.filter(t => t.action === 'PASS_WITH_CAUTION').length,
    pass_clean: passing.filter(t => 
      t.action === 'PASS_WEAK_BEAR' || t.action === 'PASS_NO_BEAR_CASE'
    ).length
  },
  
  actionable: passing.map(t => ({
    symbol: t.symbol,
    direction: t.direction,
    consensus_score: t.consensus_from_gate5,
    bear_case_score: t.bear_case_score,
    action: t.action,
    size_recommendation: t.size_recommendation || 'STANDARD',
    note: t.note,
    bear_factors: t.bear_case_factors.map(f => f.type)
  })),
  
  filtered: filtered.map(t => ({
    symbol: t.symbol,
    bear_case_score: t.bear_case_score,
    reason: t.note,
    key_risks: t.bear_case_factors.filter(f => f.score >= 0.5).map(f => ({
      type: f.type,
      score: f.score,
      detail: f.details
    }))
  })),
  
  full_scoring: scoredTickers
};

return [{ json: report }];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function extractRazielAnalysis(items) {
  const analysis = {};
  
  for (const item of items) {
    const data = item.json;
    
    // Try to find RAZIEL's per-ticker analysis
    if (data.agent === 'RAZIEL' || data.model?.includes('deepseek')) {
      // Parse RAZIEL's output for per-ticker bear cases
      if (data.counter_theses && typeof data.counter_theses === 'object') {
        Object.assign(analysis, data.counter_theses);
      }
      
      // Try parsing from text content
      if (data.content && typeof data.content === 'string') {
        const parsed = parseRazielText(data.content);
        Object.assign(analysis, parsed);
      }
    }
    
    // Also check if RAZIEL data is nested in gate 5 full consensus
    if (data.full_consensus_data) {
      for (const [sym, consensus] of Object.entries(data.full_consensus_data)) {
        if (consensus.agent_details?.RAZIEL) {
          const rd = consensus.agent_details.RAZIEL;
          if (['BEARISH', 'SELL', 'AVOID', 'SHORT'].includes(rd.direction)) {
            analysis[sym] = {
              data_backed_risks: [rd.thesis || 'RAZIEL bearish'],
              macro_headwinds: null,
              technical_weakness: null,
              catalyst_risk: null,
              historical_failure: null,
              macro_severity: 0.5,
              technical_severity: 0.5,
              catalyst_severity: 0.5,
              failure_rate: 0.5
            };
          }
        }
      }
    }
  }
  
  return analysis;
}

function parseRazielText(text) {
  // Basic extraction of bear cases from unstructured RAZIEL output
  const analysis = {};
  const sections = text.split(/(?=\$[A-Z]{1,5})/);
  
  for (const section of sections) {
    const tickerMatch = section.match(/\$([A-Z]{1,5})/);
    if (!tickerMatch) continue;
    
    const sym = tickerMatch[1];
    const risks = [];
    
    // Look for risk indicators
    if (/risk|danger|warning|caution|concern|negative|declining|weakness/i.test(section)) {
      risks.push(section.trim().substring(0, 200));
    }
    
    if (risks.length > 0) {
      analysis[sym] = {
        data_backed_risks: risks,
        macro_headwinds: null,
        technical_weakness: /resistance|breakdown|death cross|bearish/i.test(section) ? section.substring(0, 100) : null,
        catalyst_risk: /earnings|fda|trial|lawsuit|investigation/i.test(section) ? section.substring(0, 100) : null,
        historical_failure: null
      };
    }
  }
  
  return analysis;
}
