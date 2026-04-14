// ============================================================
// FIX 01: CONFIDENCE SCORING PARSER
// Location: HUNTER SYNTHESIS — MICHA (Code node)
// Problem: All opportunities score 1% confidence, PROBE tier
//          because AI agents return text, not numbers
// Fix: Parse confidence from agent text responses
// ============================================================
// PASTE THIS FUNCTION at the top of the HUNTER SYNTHESIS code node,
// then call it when building each opportunity object.
// ============================================================

function extractConfidence(agentText) {
  if (!agentText || typeof agentText !== 'string') return 50;
  
  // Pattern 1: "confidence: 85%" or "confidence score: 85"
  const confMatch = agentText.match(/confidence[\s:]*(\d{1,3})\s*%?/i);
  if (confMatch) return Math.min(parseInt(confMatch[1]), 100);
  
  // Pattern 2: "probability: 0.85" or "likelihood: 0.75"
  const probMatch = agentText.match(/(?:probability|likelihood)[\s:]*(\d*\.?\d+)/i);
  if (probMatch) {
    const val = parseFloat(probMatch[1]);
    return val <= 1 ? Math.round(val * 100) : Math.min(Math.round(val), 100);
  }
  
  // Pattern 3: "high confidence" / "moderate confidence" / "low confidence"
  if (/very\s+high\s+confidence|strongly\s+recommend/i.test(agentText)) return 90;
  if (/high\s+confidence|recommend|bullish/i.test(agentText)) return 80;
  if (/moderate\s+confidence|neutral|mixed/i.test(agentText)) return 60;
  if (/low\s+confidence|bearish|avoid/i.test(agentText)) return 30;
  if (/very\s+low|strongly\s+against/i.test(agentText)) return 15;
  
  // Pattern 4: Rating scales "8/10" or "4 out of 5"
  const ratingMatch = agentText.match(/(\d+)\s*(?:\/|out\s+of)\s*(\d+)/i);
  if (ratingMatch) {
    const num = parseInt(ratingMatch[1]);
    const den = parseInt(ratingMatch[2]);
    if (den > 0) return Math.min(Math.round((num / den) * 100), 100);
  }
  
  // Default: if agent responded at all, give it 50 (neutral)
  return 50;
}

function assignTier(confidence) {
  if (confidence >= 85) return 'PRIME';
  if (confidence >= 70) return 'STRONG';
  if (confidence >= 50) return 'WATCH';
  return 'PROBE';
}

// ============================================================
// USAGE IN SYNTHESIS:
// Replace the hardcoded confidence: 1 with:
//
// const urielConf = extractConfidence(urielResponse);
// const colossusConf = extractConfidence(colossusResponse);
// const hanielConf = extractConfidence(hanielResponse);
// const razielConf = extractConfidence(razielResponse);
// const sarielConf = extractConfidence(sarielResponse);
// const avgConfidence = Math.round(
//   (urielConf + colossusConf + hanielConf + razielConf + sarielConf) / 5
// );
// const tier = assignTier(avgConfidence);
//
// Then in the opportunity object:
// { ticker, confidence: avgConfidence, tier, ... }
// ============================================================
// ============================================================
// FIX 02: TOP3_FOR_CIL POPULATION
// Location: HUNTER SYNTHESIS — MICHA (Code node)
// Problem: Fire CIL Webhook reads top3_for_cil which never
//          gets populated. CIL gate requires PRIME but nothing
//          reaches PRIME because confidence is always 1.
// Fix: After confidence parser is fixed (FIX_01), populate
//      top3_for_cil with the top 3 opportunities by confidence.
//      Also lower the CIL gate from PRIME-only to STRONG+.
// ============================================================
// ADD THIS after the opportunities array is built in synthesis:
// ============================================================

// Sort opportunities by confidence descending
const sorted = [...opportunities].sort((a, b) => b.confidence - a.confidence);

// Take top 3 that are STRONG or above (confidence >= 70)
const top3_for_cil = sorted
  .filter(opp => opp.confidence >= 70)
  .slice(0, 3)
  .map(opp => ({
    ticker: opp.ticker,
    confidence: opp.confidence,
    tier: opp.tier,
    direction: opp.direction || 'LONG',
    thesis: opp.thesis || opp.reason || '',
    agents_bullish: opp.agents_bullish || [],
    agents_bearish: opp.agents_bearish || [],
    entry_price: opp.entry_price || null,
    stop_price: opp.stop_price || null,
    target_price: opp.target_price || null
  }));

// ============================================================
// ADD top3_for_cil to the final output object:
// return [{
//   json: {
//     regime,
//     breadth,
//     opportunities,
//     top3_for_cil,        // <-- ADD THIS LINE
//     telegram_message,
//     timestamp: new Date().toISOString()
//   }
// }];
// ============================================================


// ============================================================
// FIX 02B: FIRE CIL WEBHOOK node
// Location: Fire CIL Webhook (Code or HTTP Request node)
// Problem: References $json.top10 (doesn't exist) and
//          gate check requires PRIME tier
// Fix: Change reference to $json.top3_for_cil and lower gate
// ============================================================

// If Fire CIL Webhook is a Code node, replace the gate logic with:

const top3 = $input.first().json.top3_for_cil || [];

if (top3.length === 0) {
  return [{ json: { fired: false, reason: 'No STRONG+ opportunities for CIL' } }];
}

// Build CIL payload
const cilPayload = {
  domain: 'MARKET',
  query: `Analyze these HUNTER opportunities: ${top3.map(t => t.ticker).join(', ')}`,
  context: JSON.stringify({
    regime: $input.first().json.regime,
    breadth: $input.first().json.breadth,
    timestamp: new Date().toISOString()
  }),
  candidates: top3,
  source: 'HUNTER_v3.3',
  priority: top3[0].confidence >= 85 ? 'HIGH' : 'NORMAL'
};

return [{ json: { fired: true, payload: cilPayload } }];

// If Fire CIL Webhook is an HTTP Request node, ensure the body
// references {{ $json.top3_for_cil }} not {{ $json.top10 }}
// ============================================================
// FIX 05: FORMAT TELEGRAM BRIEF
// Location: Format Telegram Brief (Code node) in HUNTER workflow
// Problem: Produces empty message. The node doesn't read the
//          synthesis output correctly.
// Fix: Complete rewrite that reads from $json correctly and
//      builds a formatted Telegram message.
// ============================================================
// REPLACE the entire code in Format Telegram Brief with this:
// ============================================================

const input = $input.first().json;

// Extract data from synthesis
const regime = input.regime || 'UNKNOWN';
const breadth = input.breadth || {};
const opportunities = input.opportunities || [];
const top3 = input.top3_for_cil || [];
const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

// Build regime emoji
const regimeEmoji = {
  'RISK_ON': '🟢',
  'RISK_OFF': '🔴',
  'NEUTRAL': '🟡',
  'UNKNOWN': '⚪'
}[regime] || '⚪';

// Build header
let msg = `🎯 HUNTER MARKET WATCH\n`;
msg += `${timestamp} ET\n`;
msg += `${regimeEmoji} Regime: ${regime}\n`;
msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

// Breadth section
if (breadth.advancers || breadth.decliners) {
  msg += `📊 BREADTH\n`;
  msg += `A/D: ${breadth.advancers || '?'}/${breadth.decliners || '?'}\n`;
  if (breadth.vix) msg += `VIX: ${breadth.vix}\n`;
  if (breadth.dxy) msg += `DXY: ${breadth.dxy}\n`;
  msg += `\n`;
}

// Top opportunities
if (opportunities.length > 0) {
  msg += `🏆 TOP ${Math.min(opportunities.length, 10)} OPPORTUNITIES\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  
  opportunities.slice(0, 10).forEach((opp, i) => {
    const tierEmoji = {
      'PRIME': '🔥',
      'STRONG': '💪',
      'WATCH': '👀',
      'PROBE': '🔍'
    }[opp.tier] || '🔍';
    
    msg += `\n${i + 1}. ${tierEmoji} ${opp.ticker} — ${opp.tier} (${opp.confidence}%)\n`;
    
    if (opp.direction) msg += `   Direction: ${opp.direction}\n`;
    if (opp.thesis || opp.reason) msg += `   ${(opp.thesis || opp.reason).slice(0, 80)}\n`;
    if (opp.entry_price) msg += `   Entry: $${opp.entry_price}`;
    if (opp.stop_price) msg += ` | Stop: $${opp.stop_price}`;
    if (opp.target_price) msg += ` | Target: $${opp.target_price}`;
    if (opp.entry_price) msg += `\n`;
    
    // Show which agents are bullish
    if (opp.agents_bullish && opp.agents_bullish.length > 0) {
      msg += `   Bulls: ${opp.agents_bullish.join(', ')}\n`;
    }
  });
  
  msg += `\n`;
}

// CIL candidates
if (top3.length > 0) {
  msg += `🧠 → CIL FIRED: ${top3.map(t => t.ticker).join(', ')}\n`;
} else {
  msg += `🧠 CIL: No STRONG+ candidates\n`;
}

// Footer
msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
msg += `🔱 HUNTER v3.3 | A2E`;

return [{ json: { message: msg, chatId: '8203545338' } }];

// ============================================================
// IMPORTANT: The downstream "Send Telegram Brief" node must
// read {{ $json.message }} for the text field
// and {{ $json.chatId }} for the chat ID field.
//
// If it's using a different field name, update accordingly.
// ============================================================
// ============================================================
// FIX 06: PAPER TRADE LOGGER → SHEETS EXTRACTOR
// Location: NEW Code node between Paper Trade Logger and
//           Google Sheets append node in SENTINEL workflow
// Node Name: "Extract Sheets Rows"
// ============================================================
// The Paper Trade Logger node embeds _sheets_rows inside each
// item but nothing pulls them out. This node extracts them
// into individual rows for Google Sheets.
// ============================================================
// CREATE a new Code node, name it "Extract Sheets Rows"
// Wire: Paper Trade Logger → Extract Sheets Rows → Google Sheets
// Paste this code:
// ============================================================

const items = $input.all();
const rows = [];

for (const item of items) {
  const sheetsRows = item.json._sheets_rows || [];
  
  if (sheetsRows.length > 0) {
    // Each _sheets_rows entry becomes a separate output item
    for (const row of sheetsRows) {
      rows.push({
        json: {
          Timestamp: row.timestamp || new Date().toISOString(),
          Symbol: row.symbol || '',
          Account: row.account || '',
          Signal: row.signal || '',
          Reason: row.reason || '',
          EntryPrice: row.entry_price || '',
          CurrentPrice: row.current_price || '',
          Quantity: row.quantity || '',
          Action: row.action || '',
          PnLPct: row.pnl_pct || '',
          PnLDollars: row.pnl_dollars || '',
          Track: row.track || '',
          Ring: row.ring || '',
          Mode: row.mode || 'PAPER',
          Executed: row.executed || 'NO'
        }
      });
    }
  } else {
    // Fallback: try to build a row from the item itself
    const j = item.json;
    if (j.symbol || j.ticker) {
      rows.push({
        json: {
          Timestamp: j.timestamp || new Date().toISOString(),
          Symbol: j.symbol || j.ticker || '',
          Account: j.account || '',
          Signal: j.signal || j.alert_type || '',
          Reason: j.reason || j.message || '',
          EntryPrice: j.entry_price || j.cost_basis || '',
          CurrentPrice: j.current_price || j.price || '',
          Quantity: j.quantity || j.shares || '',
          Action: j.action || j.recommendation || '',
          PnLPct: j.pnl_pct || j.unrealized_gain_pct || '',
          PnLDollars: j.pnl_dollars || j.unrealized_gain || '',
          Track: j.track || '',
          Ring: j.ring || '',
          Mode: j.mode || 'PAPER',
          Executed: j.executed || 'NO'
        }
      });
    }
  }
}

// Return rows (or empty item if no trades)
if (rows.length === 0) {
  return [{ json: { _no_trades: true } }];
}

return rows;

// ============================================================
// GOOGLE SHEETS NODE CONFIGURATION:
// After creating this Code node, add a Google Sheets node:
//
// Operation: Append Row
// Credential: "GDrive - WEL" (your existing Google OAuth)
// Document ID: 1eDxgY99SRuyHCgjp-Ba-AhV32qQl9Ft7K5z5wovS8Ik
// Sheet Name: TradeLog
// Mapping Mode: Map Automatically
//
// Wire: Extract Sheets Rows → Google Sheets
//
// Add a filter between them to skip _no_trades items:
// Condition: $json._no_trades !== true
// ============================================================
