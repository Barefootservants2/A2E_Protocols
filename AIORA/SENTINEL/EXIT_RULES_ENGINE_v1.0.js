// ============================================================================
// SENTINEL EXIT RULES ENGINE v1.0
// IRONCLAD v2.1 | METATRON v10.8
// Position: After VIX Scaling, before Compliance Engine
// ============================================================================
// EXIT RULES:
// 1. STOP LOSS:     -5% from cost basis (VIX-adjusted via upstream node)
// 2. PROFIT LOCK 1: +10% gain → sell 50% of position
// 3. PROFIT LOCK 2: +20% gain → sell 60% of position (cumulative)
// 4. VWAP EXIT:     Price crosses below VWAP for Track 1 (intraday confirmation)
// 5. TWO-CHECK:     Stop breach must be confirmed on 2 consecutive scans
// 6. TIME STOP:     Track 1 positions → EOD exit signal at 3:45 PM ET
// 7. RE-ENTRY BAN:  Same-day re-entry BANNED (flag only — no re-entry if exited today)
// ============================================================================

const positions = $input.all().map(item => item.json);
const now = new Date();

// ── TIME CONTEXT ──────────────────────────────────────────────────────────────
// Convert to ET
const etOffset = -5; // EST; adjust to -4 for EDT if needed
const etHour = (now.getUTCHours() + 24 + etOffset) % 24;
const etMinute = now.getUTCMinutes();
const etTimeDecimal = etHour + etMinute / 60;
const isMarketHours = etTimeDecimal >= 9.5 && etTimeDecimal < 16.0;
const isEODWindow = etTimeDecimal >= 15.75 && etTimeDecimal < 16.0; // 3:45–4:00 PM ET
const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

// ── VWAP DATA (from Market Context Pull if available) ─────────────────────────
let vwapData = {};
try {
  const marketContext = $('Market Context Pull').first().json;
  vwapData = marketContext.vwap || {};
} catch(e) {
  // VWAP not available — degrade gracefully, skip VWAP check
  vwapData = {};
}

// ── PERSISTENT STOP BREACH COUNTER (from previous scan, stored in workflow static) ──
// n8n doesn't have true persistence within a node, so we use a workaround:
// Breach count is stored in position data from previous cycle via Snapshot Database
let previousBreachCounts = {};
try {
  const snapshotData = $('Snapshot Database').first().json;
  previousBreachCounts = snapshotData.breach_counts || {};
} catch(e) {
  previousBreachCounts = {};
}

// ── PROCESS EACH POSITION ─────────────────────────────────────────────────────
const exitSignals = [];
const processedPositions = [];

for (const pos of positions) {
  const symbol = pos.symbol || '';
  const costBasis = parseFloat(pos.costBasis) || parseFloat(pos.pricePaid) || 0;
  const currentPrice = parseFloat(pos.currentPrice) || 0;
  const quantity = parseFloat(pos.quantity) || 0;
  const marketValue = parseFloat(pos.marketValue) || 0;
  const ring = pos.ring || 4;
  const track = pos.track || 2;
  const effectiveStop = parseFloat(pos.effective_stop_threshold) || 5; // from VIX Scaling

  // Skip Ring 1 (no stops on core income)
  if (ring === 1) {
    processedPositions.push({ json: { ...pos, exit_rules: { skipped: true, reason: 'Ring 1 — no stops' } } });
    continue;
  }

  // Skip if no cost basis
  if (costBasis <= 0 || currentPrice <= 0) {
    processedPositions.push({ json: { ...pos, exit_rules: { skipped: true, reason: 'Missing price data' } } });
    continue;
  }

  // ── GAIN/LOSS CALCULATION ─────────────────────────────────────────────────
  const gainPct = ((currentPrice - costBasis) / costBasis) * 100;
  const gainDollar = (currentPrice - costBasis) * quantity;

  // ── RULE 1: STOP LOSS (-5% VIX-adjusted) ──────────────────────────────────
  const stopBreachRaw = gainPct < -effectiveStop;
  
  // Two-Check: increment breach count, only fire on 2nd consecutive breach
  const prevBreachCount = previousBreachCounts[symbol] || 0;
  const newBreachCount = stopBreachRaw ? prevBreachCount + 1 : 0;
  const stopBreachConfirmed = newBreachCount >= 2; // Two consecutive scans required
  
  let stopSignal = null;
  if (stopBreachConfirmed) {
    stopSignal = {
      rule: 'STOP_LOSS',
      action: 'SELL_ALL',
      quantity_to_sell: quantity,
      reason: `Price -${gainPct.toFixed(2)}% from cost (threshold: -${effectiveStop.toFixed(1)}%) — confirmed on scan ${newBreachCount}`,
      priority: 'HIGH',
      breach_count: newBreachCount
    };
  } else if (stopBreachRaw && newBreachCount === 1) {
    stopSignal = {
      rule: 'STOP_LOSS_WARNING',
      action: 'WATCH',
      reason: `First stop breach detected at -${gainPct.toFixed(2)}%. Waiting for Two-Check confirmation on next scan.`,
      priority: 'MEDIUM',
      breach_count: 1
    };
  }

  // ── RULE 2: PROFIT LOCK 1 (+10% → sell 50%) ────────────────────────────────
  let profitLock1Signal = null;
  if (gainPct >= 10.0 && gainPct < 20.0 && !pos.profit_lock_1_executed) {
    const sellQty = Math.floor(quantity * 0.50);
    if (sellQty > 0) {
      profitLock1Signal = {
        rule: 'PROFIT_LOCK_1',
        action: 'SELL_50_PCT',
        quantity_to_sell: sellQty,
        reason: `+${gainPct.toFixed(2)}% gain — IRONCLAD Profit Lock 1: sell 50% at +10%`,
        priority: 'MEDIUM',
        estimated_proceeds: sellQty * currentPrice
      };
    }
  }

  // ── RULE 3: PROFIT LOCK 2 (+20% → sell 60%) ────────────────────────────────
  let profitLock2Signal = null;
  if (gainPct >= 20.0 && !pos.profit_lock_2_executed) {
    const sellQty = Math.floor(quantity * 0.60);
    if (sellQty > 0) {
      profitLock2Signal = {
        rule: 'PROFIT_LOCK_2',
        action: 'SELL_60_PCT',
        quantity_to_sell: sellQty,
        reason: `+${gainPct.toFixed(2)}% gain — IRONCLAD Profit Lock 2: sell 60% at +20%`,
        priority: 'MEDIUM',
        estimated_proceeds: sellQty * currentPrice
      };
    }
  }

  // ── RULE 4: VWAP EXIT (Track 1 only) ──────────────────────────────────────
  let vwapSignal = null;
  if (track === 1 && vwapData[symbol] && isMarketHours) {
    const vwap = parseFloat(vwapData[symbol]) || 0;
    if (vwap > 0 && currentPrice < vwap * 0.9975) { // 0.25% below VWAP
      vwapSignal = {
        rule: 'VWAP_EXIT',
        action: 'SELL_ALL',
        quantity_to_sell: quantity,
        reason: `Price $${currentPrice.toFixed(2)} crossed below VWAP $${vwap.toFixed(2)} (-${(((vwap - currentPrice) / vwap) * 100).toFixed(2)}%)`,
        priority: 'MEDIUM',
        vwap
      };
    }
  }

  // ── RULE 5: TIME STOP (Track 1 → EOD exit at 3:45 PM ET) ──────────────────
  let timeStopSignal = null;
  if (track === 1 && isEODWindow && gainPct > 0) {
    // Only fire time stop if position is profitable (lock in gains at EOD)
    timeStopSignal = {
      rule: 'TIME_STOP_EOD',
      action: 'SELL_ALL',
      quantity_to_sell: quantity,
      reason: `Track 1 EOD exit window (3:45-4:00 PM ET). Position +${gainPct.toFixed(2)}%. Daily Grind = EOD exit.`,
      priority: 'LOW',
      et_time: `${etHour}:${String(etMinute).padStart(2,'0')} ET`
    };
  } else if (track === 1 && isEODWindow && gainPct <= 0) {
    // Loss at EOD — flag for Principal decision, don't auto-exit
    timeStopSignal = {
      rule: 'TIME_STOP_EOD_LOSS',
      action: 'REVIEW_REQUIRED',
      reason: `Track 1 EOD window. Position ${gainPct.toFixed(2)}% — loss at EOD. Principal decision required.`,
      priority: 'HIGH',
      et_time: `${etHour}:${String(etMinute).padStart(2,'0')} ET`
    };
  }

  // ── RULE 6: SAME-DAY RE-ENTRY BAN FLAG ────────────────────────────────────
  const reentryBanned = pos.exited_today === true;
  let reentryFlag = null;
  if (reentryBanned) {
    reentryFlag = {
      rule: 'REENTRY_BAN',
      action: 'BLOCK',
      reason: `Same-day re-entry BANNED. Position was exited today (${todayStr}).`,
      priority: 'HIGH'
    };
  }

  // ── COLLECT ALL ACTIVE SIGNALS ─────────────────────────────────────────────
  const activeSignals = [stopSignal, profitLock1Signal, profitLock2Signal, vwapSignal, timeStopSignal, reentryFlag]
    .filter(s => s !== null);

  // Determine highest priority action
  const hasCritical = activeSignals.some(s => s.action === 'SELL_ALL' && s.priority === 'HIGH');
  const hasMedium = activeSignals.some(s => ['SELL_50_PCT','SELL_60_PCT'].includes(s.action));
  const hasWarning = activeSignals.some(s => s.action === 'WATCH' || s.action === 'REVIEW_REQUIRED');

  let recommendedAction = 'HOLD';
  if (reentryBanned) recommendedAction = 'BLOCKED';
  else if (hasCritical) recommendedAction = 'SELL_ALL';
  else if (hasMedium) recommendedAction = activeSignals.find(s => s.action === 'SELL_60_PCT') ? 'SELL_60_PCT' : 'SELL_50_PCT';
  else if (hasWarning) recommendedAction = 'WATCH';

  // Build exit rules summary
  const exitRules = {
    gain_pct: parseFloat(gainPct.toFixed(2)),
    gain_dollar: parseFloat(gainDollar.toFixed(2)),
    effective_stop_threshold: effectiveStop,
    stop_breach_raw: stopBreachRaw,
    stop_breach_count: newBreachCount,
    stop_breach_confirmed: stopBreachConfirmed,
    recommended_action: recommendedAction,
    active_signals: activeSignals,
    signal_count: activeSignals.length,
    vwap_available: !!vwapData[symbol],
    is_eod_window: isEODWindow,
    track,
    ring,
    timestamp: now.toISOString()
  };

  // Track for exit signal summary
  if (activeSignals.length > 0) {
    exitSignals.push({
      symbol,
      recommended_action: recommendedAction,
      gain_pct: parseFloat(gainPct.toFixed(2)),
      signals: activeSignals.map(s => s.rule)
    });
  }

  processedPositions.push({
    json: {
      ...pos,
      gain_pct: parseFloat(gainPct.toFixed(2)),
      gain_dollar: parseFloat(gainDollar.toFixed(2)),
      stop_breach_confirmed: stopBreachConfirmed,
      stop_breach_count: newBreachCount,
      recommended_action: recommendedAction,
      exit_rules: exitRules,
      _breach_count_update: { symbol, count: newBreachCount } // for Snapshot to persist
    }
  });
}

// ── SUMMARY HEADER ────────────────────────────────────────────────────────────
const summary = {
  _exit_rules_summary: true,
  total_positions: positions.length,
  positions_with_signals: exitSignals.length,
  sell_all_count: exitSignals.filter(s => s.recommended_action === 'SELL_ALL').length,
  trim_count: exitSignals.filter(s => ['SELL_50_PCT','SELL_60_PCT'].includes(s.recommended_action)).length,
  watch_count: exitSignals.filter(s => s.recommended_action === 'WATCH').length,
  exit_signals: exitSignals,
  is_eod_window: isEODWindow,
  et_time: `${etHour}:${String(etMinute).padStart(2,'0')} ET`,
  market_hours: isMarketHours,
  scan_timestamp: now.toISOString(),
  version: 'EXIT_RULES_ENGINE_v1.0'
};

// Prepend summary, then positions
return [{ json: summary }, ...processedPositions];
