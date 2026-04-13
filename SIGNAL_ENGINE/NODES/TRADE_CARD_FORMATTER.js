// TRADE CARD FORMATTER v1.0
// n8n Code Node — formats Signal Generator output for Telegram delivery
// Fires immediately after Signal Generator
//
// PURPOSE: Convert Trade Cards into clean, actionable Telegram messages.
// The Principal reads this at 6:45 AM and knows exactly what to do at 9:30.

const signalData = $input.first().json;
const cards = signalData.tradeCards || [];
const summary = signalData.summary || {};
const feedStatus = signalData.dataFeedStatus || {};

// Timestamp
const now = new Date();
const timeStr = now.toLocaleString('en-US', {
  timeZone: 'America/New_York',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});

let messages = [];

// ═══════════════════════════════════════
// HEADER MESSAGE
// ═══════════════════════════════════════

let header = `⚡ SIGNAL ENGINE v1.0\n`;
header += `${timeStr} ET\n`;
header += `━━━━━━━━━━━━━━━━━━━━━━\n`;
header += `Feeds: ${summary.dataFeeds}\n`;
header += `Kill Switch: ${signalData.killSwitch === 'CLEAR' ? '🟢 CLEAR' : '🔴 FIRING'}\n`;
header += `Candidates: ${summary.aboveThreshold}/${summary.totalCandidatesScored} above threshold\n`;
header += `Cards: ${summary.cardsGenerated}\n`;
header += `━━━━━━━━━━━━━━━━━━━━━━`;

messages.push({ text: header, type: 'header' });

// ═══════════════════════════════════════
// KILL SWITCH ALERT (if firing)
// ═══════════════════════════════════════

const killAlert = cards.find(c => c.type === 'KILL_SWITCH_ALERT');
if (killAlert) {
  let killMsg = `🔴 KILL SWITCH ACTIVE\n`;
  killMsg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  killMsg += `Action: ${killAlert.action}\n`;
  killMsg += `Reason: ${killAlert.reason}\n`;
  killMsg += `Embargo: ${killAlert.embargo}\n`;
  killMsg += `━━━━━━━━━━━━━━━━━━━━━━`;
  messages.push({ text: killMsg, type: 'kill_switch' });
}

// ═══════════════════════════════════════
// TRADE CARDS
// ═══════════════════════════════════════

const tradeCards = cards.filter(c => c.type !== 'KILL_SWITCH_ALERT');

if (tradeCards.length === 0) {
  messages.push({
    text: `📊 No signals above ${signalData.minConfidence || 70}% threshold today.\nStand by for next scan.`,
    type: 'no_signal'
  });
} else {
  for (const card of tradeCards) {
    const s = card.sizing;
    const d = card.signalDrivers;
    const blocked = card.blocked;

    let cardMsg = '';

    if (blocked) {
      cardMsg += `🚫 TRADE CARD #${card.cardNumber} — BLOCKED\n`;
      cardMsg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      cardMsg += `${card.symbol} — ${card.name}\n`;
      cardMsg += `Confidence: ${card.confidence}%\n`;
      cardMsg += `Blocked: ${card.blockReasons.join(', ')}\n`;
      cardMsg += `━━━━━━━━━━━━━━━━━━━━━━`;
    } else {
      cardMsg += `🎯 TRADE CARD #${card.cardNumber}\n`;
      cardMsg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      cardMsg += `${card.symbol} — ${card.action}\n`;
      cardMsg += `Ring ${card.ring} | Track ${card.track} ${card.track === 1 ? '(Daily Grind)' : '(Thesis)'}\n`;
      cardMsg += `Confidence: ${card.confidence}%\n\n`;

      cardMsg += `ENTRY: $${card.entry}\n`;
      cardMsg += `  T1: ${s.t1Shares} shares @ open ($${s.t1Dollars})\n`;
      cardMsg += `  T2: ${s.t2Shares} shares @ first pullback ($${s.t2Dollars})\n`;
      cardMsg += `STOP: $${s.stopPrice} (-${s.stopPct}%)\n`;
      cardMsg += `TARGETS:\n`;
      cardMsg += `  +5%  $${s.target1} → trim 25%\n`;
      cardMsg += `  +10% $${s.target2} → trim 25%\n`;
      cardMsg += `  +15% $${s.target3} → trim 25%\n`;
      cardMsg += `MAX LOSS: $${s.maxLoss}\n`;
      cardMsg += `ACCOUNT: ${s.accountId}\n\n`;

      cardMsg += `SIGNAL DRIVERS:\n`;
      cardMsg += `  Flow:        ${d.flow.score}/10 ${d.flow.flags.join(', ') || '-'}\n`;
      cardMsg += `  Positioning: ${d.positioning.score}/10 ${d.positioning.flags.join(', ') || '-'}\n`;
      cardMsg += `  Supply:      ${d.supply.score}/10 ${d.supply.flags.join(', ') || '-'}\n`;
      cardMsg += `  Thesis:      ${d.thesis.score}/10 ${d.thesis.flags.join(', ') || '-'}\n`;
      cardMsg += `  Macro:       ${d.macro.score}/10 ${d.macro.flags.join(', ') || '-'}\n`;
      cardMsg += `  Sentiment:   ${d.sentiment.score}/10 ${d.sentiment.flags.join(', ') || '-'}\n\n`;

      cardMsg += `COUNTER-THESIS:\n${card.counterThesis}\n`;
      cardMsg += `━━━━━━━━━━━━━━━━━━━━━━`;
    }

    messages.push({ text: cardMsg, type: blocked ? 'blocked' : 'trade_card' });
  }
}

// ═══════════════════════════════════════
// DATA FEED STATUS (compact)
// ═══════════════════════════════════════

let statusMsg = `📡 FEED STATUS:\n`;
for (const [feed, status] of Object.entries(feedStatus)) {
  const icon = status === 'CONNECTED' ? '🟢' : '🔴';
  statusMsg += `${icon} ${feed.replace(/_/g, ' ')}\n`;
}

messages.push({ text: statusMsg, type: 'status' });

// Return array of messages for Telegram node
// In n8n, wire each message to a Telegram Send Message node
// Use a Split In Batches node if needed to avoid rate limits
return messages.map(m => ({ json: m }));
