// ============================================================
// GATE 8: TRAJECTORY ALIGNMENT (TIMING)
// n8n Code Node (JavaScript)
// Position: FINAL GATE before Principal delivery
// ============================================================
// PURPOSE: Separate "good trade" from "good trade RIGHT NOW."
// A trade can pass Gates 1-7 but if timing is wrong, WAIT.
// This gate confirms entry timing, not thesis quality.
//
// INPUTS: Gate 6 survivors + COLOSSUS technical analysis
// OUTPUTS: Final actionable trades with timing classification
//
// CONFIDENCE CASCADE: Gate 8 of 8
// METATRON v10.6 | AIORA Confidence Cascade v1.0
// ============================================================

const items = $input.all();

// ============================================================
// STEP 1: Parse Gate 6 survivors + COLOSSUS technical data
// ============================================================

const gate6Data = items[0]?.json;
const actionable = gate6Data?.actionable || [];

const scoredTrades = [];

for (const ticker of actionable) {
  const sym = ticker.symbol;
  const direction = ticker.direction;
  
  // Get COLOSSUS technical assessment for this ticker
  const techData = extractTechnicalData(items, sym);
  
  const timing = {
    symbol: sym,
    direction: direction,
    consensus_score: ticker.consensus_score,
    bear_case_score: ticker.bear_case_score,
    size_recommendation: ticker.size_recommendation || 'STANDARD',
    
    // Timing factors
    trend_aligned: false,
    volume_confirming: false,
    support_holding: false,
    momentum_positive: false,
    entry_zone_active: false,
    
    timing_score: 0,
    timing_classification: 'WAIT',
    pass_gate_8: false,
    
    // Composite across ALL gates
    composite_confidence: 0,
    gates_passed: 0,
    final_action: 'WAIT'
  };
  
  // ============================================================
  // STEP 2: Score timing factors
  // ============================================================
  
  if (techData) {
    // Factor 1: Trend alignment
    // For LONG: price above key MAs, MAs in bullish order
    // For SHORT: opposite
    if (direction === 'BULLISH') {
      timing.trend_aligned = (
        techData.price_vs_20sma === 'ABOVE' &&
        techData.price_vs_50sma === 'ABOVE' &&
        techData.ma_20_vs_50 === 'ABOVE'
      );
    } else if (direction === 'BEARISH') {
      timing.trend_aligned = (
        techData.price_vs_20sma === 'BELOW' &&
        techData.price_vs_50sma === 'BELOW'
      );
    }
    
    // Factor 2: Volume confirmation
    // Recent volume should confirm the move direction
    timing.volume_confirming = techData.volume_trend === 'INCREASING' || 
                                techData.volume_ratio > 1.2;
    
    // Factor 3: Support/resistance holding
    // For LONG: price bouncing off support, not hitting resistance
    // For SHORT: price failing at resistance
    if (direction === 'BULLISH') {
      timing.support_holding = techData.near_support && !techData.near_resistance;
    } else {
      timing.support_holding = techData.near_resistance && !techData.near_support;
    }
    
    // Factor 4: Momentum (RSI, MACD direction)
    if (direction === 'BULLISH') {
      timing.momentum_positive = (
        (techData.rsi > 40 && techData.rsi < 70) && // Not overbought, not oversold
        techData.macd_signal === 'BULLISH'
      );
    } else {
      timing.momentum_positive = (
        (techData.rsi > 30 && techData.rsi < 60) &&
        techData.macd_signal === 'BEARISH'
      );
    }
    
    // Factor 5: Entry zone
    // Price is within acceptable entry range (not chasing)
    timing.entry_zone_active = techData.distance_from_entry <= 0.03; // Within 3% of ideal entry
    
  } else {
    // No technical data available — can't score timing
    // Pass through with CAUTION flag (data gap, not thesis failure)
    timing.timing_classification = 'NO_TECH_DATA';
    timing.pass_gate_8 = true; // Don't filter on missing data
    timing.final_action = 'REVIEW_TIMING_MANUALLY';
    timing.note = 'COLOSSUS technical data unavailable. Timing unconfirmed. Principal review required.';
    scoredTrades.push(timing);
    continue;
  }
  
  // ============================================================
  // STEP 3: Calculate timing score
  // ============================================================
  
  const factorScores = [
    { name: 'trend_aligned', value: timing.trend_aligned, weight: 0.30 },
    { name: 'volume_confirming', value: timing.volume_confirming, weight: 0.20 },
    { name: 'support_holding', value: timing.support_holding, weight: 0.20 },
    { name: 'momentum_positive', value: timing.momentum_positive, weight: 0.20 },
    { name: 'entry_zone_active', value: timing.entry_zone_active, weight: 0.10 }
  ];
  
  timing.timing_score = Math.round(
    factorScores.reduce((s, f) => s + (f.value ? f.weight : 0), 0) * 100
  ) / 100;
  
  const trueCount = factorScores.filter(f => f.value).length;
  
  // Timing classification
  if (trueCount >= 4) {
    timing.timing_classification = 'ENTER_NOW';
    timing.pass_gate_8 = true;
  } else if (trueCount === 3) {
    timing.timing_classification = 'ENTER_ACCEPTABLE';
    timing.pass_gate_8 = true;
  } else if (trueCount === 2 && timing.trend_aligned) {
    timing.timing_classification = 'WAIT_FOR_PULLBACK';
    timing.pass_gate_8 = false;
    timing.note = 'Thesis valid but timing premature. Set alert for pullback entry.';
  } else {
    timing.timing_classification = 'WAIT';
    timing.pass_gate_8 = false;
    timing.note = 'Thesis valid but timing wrong. Do NOT chase. Wait for setup.';
  }
  
  // ============================================================
  // STEP 4: Calculate composite confidence (ALL 8 gates)
  // ============================================================
  
  // Collect gate scores from upstream
  const gateScores = {
    gate_1: 1.0, // If we got here, data is valid
    gate_2: ticker.convergence_score || 0.7, // From Gate 2
    gate_3: ticker.pattern_match || 0.5, // From Gate 3 (bootstrap until ML ready)
    gate_4: ticker.regime_aligned ? 1.0 : 0.5, // From Gate 4
    gate_5: ticker.consensus_score || 0.7, // From Gate 5
    gate_6: 1.0 - (ticker.bear_case_score || 0), // Inverse of bear case
    gate_7: ticker.cross_sector_confirmed ? 1.0 : 0.5, // From Gate 7
    gate_8: timing.timing_score // This gate
  };
  
  timing.gates_passed = Object.values(gateScores).filter(s => s >= 0.6).length;
  timing.composite_confidence = Math.round(
    Object.values(gateScores).reduce((s, v) => s + v, 0) / 8 * 100
  ) / 100;
  
  // Final action determination
  if (timing.pass_gate_8 && timing.composite_confidence >= 0.85) {
    timing.final_action = 'EXECUTE';
    timing.size_recommendation = timing.size_recommendation || 'STANDARD';
  } else if (timing.pass_gate_8 && timing.composite_confidence >= 0.70) {
    timing.final_action = 'EXECUTE_NIBBLE';
    timing.size_recommendation = 'NIBBLE';
  } else if (!timing.pass_gate_8 && timing.composite_confidence >= 0.70) {
    timing.final_action = 'WATCHLIST_WAIT';
    timing.note = (timing.note || '') + ' Thesis strong. Timing not ready. Add to watchlist with alerts.';
  } else {
    timing.final_action = 'PASS';
  }
  
  scoredTrades.push(timing);
}

// ============================================================
// STEP 5: Final output — what the Principal sees
// ============================================================

const execute = scoredTrades.filter(t => 
  t.final_action === 'EXECUTE' || t.final_action === 'EXECUTE_NIBBLE'
);
const watchlist = scoredTrades.filter(t => t.final_action === 'WATCHLIST_WAIT');
const passed = scoredTrades.filter(t => t.final_action === 'PASS');
const reviewManual = scoredTrades.filter(t => t.final_action === 'REVIEW_TIMING_MANUALLY');

const report = {
  gate: 'GATE_8_TRAJECTORY_ALIGNMENT',
  timestamp: new Date().toISOString(),
  protocol: 'CONFIDENCE_CASCADE_v1.0',
  cascade_version: '1.0.0',
  
  // THE MONEY OUTPUT
  executive_summary: {
    total_evaluated: scoredTrades.length,
    ready_to_execute: execute.length,
    watchlist: watchlist.length,
    passed_on: passed.length,
    needs_manual_review: reviewManual.length,
    highest_confidence: execute.length > 0 
      ? Math.max(...execute.map(t => t.composite_confidence)) 
      : 0
  },
  
  // EXECUTE — These passed ALL 8 gates
  execute_now: execute.map(t => ({
    symbol: t.symbol,
    direction: t.direction,
    composite_confidence: t.composite_confidence,
    gates_passed: t.gates_passed + '/8',
    size: t.size_recommendation,
    timing: t.timing_classification,
    consensus: t.consensus_score,
    bear_case_strength: t.bear_case_score,
    note: t.note || 'All gates passed. Ready for execution.'
  })),
  
  // WATCHLIST — Good thesis, bad timing
  watch_and_wait: watchlist.map(t => ({
    symbol: t.symbol,
    direction: t.direction,
    composite_confidence: t.composite_confidence,
    timing_issue: t.timing_classification,
    note: t.note,
    alert_trigger: 'Set price alert for entry zone pullback'
  })),
  
  // MANUAL REVIEW — Missing data
  manual_review: reviewManual.map(t => ({
    symbol: t.symbol,
    note: t.note
  })),
  
  // FULL CASCADE DATA (for trade log)
  full_cascade: scoredTrades
};

return [{ json: report }];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function extractTechnicalData(items, symbol) {
  // Look for COLOSSUS technical analysis in the data stream
  for (const item of items) {
    const data = item.json;
    
    // Check if this is COLOSSUS output with technical data
    if (data.technical && data.technical[symbol]) {
      return data.technical[symbol];
    }
    
    // Check in agent_details from Gate 5
    if (data.full_consensus_data?.[symbol]?.agent_details?.COLOSSUS) {
      const cd = data.full_consensus_data[symbol].agent_details.COLOSSUS;
      return {
        price_vs_20sma: cd.above_20sma ? 'ABOVE' : 'BELOW',
        price_vs_50sma: cd.above_50sma ? 'ABOVE' : 'BELOW',
        ma_20_vs_50: cd.ma_bullish_order ? 'ABOVE' : 'BELOW',
        volume_trend: cd.volume_trend || 'UNKNOWN',
        volume_ratio: cd.volume_ratio || 1.0,
        near_support: cd.near_support || false,
        near_resistance: cd.near_resistance || false,
        rsi: cd.rsi || 50,
        macd_signal: cd.macd_signal || 'NEUTRAL',
        distance_from_entry: cd.distance_from_entry || 0.05
      };
    }
  }
  
  return null;
}
