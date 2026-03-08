// ============================================================================
// CIL v6.0 — OUTPUT TEMPLATE
// n8n Code Node | Position: After Merge (pipeline + PASS2), Before OUTPUT FORMATTER
// ============================================================================
// PURPOSE: Takes the merged pipeline+synthesis data and the domain routing
//          config, then produces a domain-formatted output ready for
//          Telegram alerting, GitHub archival, and database logging.
//
// INPUT:   $json containing merged data from:
//          - Pipeline branch: cascade_result, agent_outputs, gate_config
//          - PASS2 branch: synthesis text (or fallback)
//          Plus: routing, domain, query, domaindata, runid
//
// OUTPUT:  Original input PLUS `formatted_output` object with:
//          - telegram_message — formatted string for Telegram
//          - github_payload — structured JSON for archival
//          - db_record — flat object for database insert
//          - summary — one-line human-readable result
// ============================================================================

const input = $input.first().json;
const domain = input.domain || "GENERAL";
const routing = input.routing || {};
const outputLabels = routing.output_labels || {};
const cascadeResult = input.cascade_result || {};
const synthesis = input.synthesis || input.pass2_output || "";
const agentOutputs = input.agent_outputs || {};
const runid = input.runid || "UNKNOWN";
const query = input.query || "";
const timestamp = new Date().toISOString();

// ============================================================================
// EXTRACT KEY METRICS FROM CASCADE
// ============================================================================

const gateResults = cascadeResult.gate_results || [];
const overallScore = cascadeResult.overall_score || 0;
const overallPassed = cascadeResult.passed || false;
const gatesPassed = gateResults.filter(g => g.passed).length;
const gatesTotal = gateResults.length;

// ============================================================================
// EXTRACT CONSENSUS FROM AGENT OUTPUTS
// ============================================================================

const agents = Object.values(agentOutputs);
const agentNames = Object.keys(agentOutputs);

// Primary direction/position
const dirField = domain === "MARKET" ? "direction" : "position";
const directions = agents.map(a => (a[dirField] || "UNKNOWN").toUpperCase());
const dirCounts = {};
for (const d of directions) { dirCounts[d] = (dirCounts[d] || 0) + 1; }
const consensusDir = Object.entries(dirCounts).sort((a,b) => b[1] - a[1])[0] || ["UNKNOWN", 0];

// Confidence
const confidences = agents.map(a => a.confidence || 0);
const avgConfidence = agents.length > 0
  ? Math.round(confidences.reduce((s,c) => s + c, 0) / agents.length)
  : 0;

// Data completeness
const dataGaps = agents.reduce((sum, a) => sum + (a.data_gaps || []).length, 0);

// ============================================================================
// DOMAIN-SPECIFIC FORMATTERS
// ============================================================================

function formatMarketTelegram() {
  const ticker = (input.domaindata || {}).ticker || "N/A";
  const price = (input.domaindata || {}).price || "N/A";
  const passEmoji = overallPassed ? "✅" : "❌";
  const dirEmoji = consensusDir[0] === "BULLISH" ? "🟢" : consensusDir[0] === "BEARISH" ? "🔴" : "🟡";

  let msg = `🔱 CIL v6.0 | MARKET ANALYSIS\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📌 ${ticker} @ $${price}\n`;
  msg += `${dirEmoji} DIRECTION: ${consensusDir[0]} (${consensusDir[1]}/${agents.length})\n`;
  msg += `📊 CONFIDENCE: ${avgConfidence}%\n`;
  msg += `${passEmoji} CASCADE: ${overallScore}% (${gatesPassed}/${gatesTotal} gates)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;

  // Gate breakdown
  for (const gate of gateResults) {
    const gEmoji = gate.passed ? "✅" : (gate.score >= 40 ? "⚠️" : "❌");
    msg += `${gEmoji} G${gate.id} ${gate.name}: ${gate.score}%\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;

  // Agent votes
  msg += `📋 AGENT VOTES:\n`;
  for (const name of agentNames) {
    const a = agentOutputs[name];
    msg += `  ${name}: ${(a.direction || 'N/A').toUpperCase()} @ ${a.confidence || 0}%\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📝 SYNTHESIS:\n${truncate(synthesis, 800)}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🔗 Run: ${runid}\n`;
  msg += `⏱️ ${timestamp}`;

  return msg;
}

function formatGeneralTelegram() {
  const passEmoji = overallPassed ? "✅" : "❌";
  const posEmoji = consensusDir[0] === "SUPPORT" ? "🟢" : consensusDir[0] === "OPPOSE" ? "🔴" : "🟡";

  let msg = `🔱 CIL v6.0 | COLLECTIVE ASSESSMENT\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📌 QUERY: ${truncate(query, 100)}\n`;
  msg += `${posEmoji} POSITION: ${consensusDir[0]} (${consensusDir[1]}/${agents.length})\n`;
  msg += `📊 CONFIDENCE: ${avgConfidence}%\n`;
  msg += `${passEmoji} CASCADE: ${overallScore}% (${gatesPassed}/${gatesTotal} gates)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;

  // Gate breakdown
  for (const gate of gateResults) {
    const gEmoji = gate.passed ? "✅" : (gate.score >= 40 ? "⚠️" : "❌");
    msg += `${gEmoji} G${gate.id} ${gate.name}: ${gate.score}%\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;

  // Agent positions
  msg += `📋 AGENT POSITIONS:\n`;
  for (const name of agentNames) {
    const a = agentOutputs[name];
    msg += `  ${name}: ${(a.position || 'N/A').toUpperCase()} @ ${a.confidence || 0}%\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📝 SYNTHESIS:\n${truncate(synthesis, 800)}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;

  // Recommended actions (if present in synthesis or agents)
  const allRecs = agents.flatMap(a => a.recommendations || []);
  if (allRecs.length > 0) {
    msg += `🎯 ACTIONS:\n`;
    const uniqueRecs = [...new Set(allRecs)].slice(0, 5);
    for (const rec of uniqueRecs) {
      msg += `  • ${truncate(rec, 120)}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  }

  msg += `🔗 Run: ${runid}\n`;
  msg += `⏱️ ${timestamp}`;

  return msg;
}

// ============================================================================
// GITHUB ARCHIVAL PAYLOAD
// ============================================================================

function buildGitHubPayload() {
  return {
    runid,
    domain,
    timestamp,
    query: query,
    domaindata: input.domaindata || {},
    consensus: {
      primary: consensusDir[0],
      votes: consensusDir[1],
      total_agents: agents.length,
      avg_confidence: avgConfidence
    },
    cascade: {
      overall_score: overallScore,
      passed: overallPassed,
      gates_passed: gatesPassed,
      gates_total: gatesTotal,
      gate_results: gateResults
    },
    agent_outputs: agentOutputs,
    synthesis: synthesis,
    metadata: {
      cil_version: "6.0",
      pipeline_version: "v5.2.1-universal",
      domain_config: routing.id,
      data_gaps: dataGaps
    }
  };
}

// ============================================================================
// DATABASE RECORD (flat for SQL/Airtable)
// ============================================================================

function buildDBRecord() {
  return {
    runid,
    domain,
    timestamp,
    query: truncate(query, 500),
    primary_result: consensusDir[0],
    confidence: avgConfidence,
    cascade_score: overallScore,
    cascade_passed: overallPassed,
    gates_passed: gatesPassed,
    gates_total: gatesTotal,
    agent_count: agents.length,
    data_gaps: dataGaps,
    synthesis_length: synthesis.length,
    ticker: domain === "MARKET" ? (input.domaindata || {}).ticker || null : null,
    cil_version: "6.0"
  };
}

// ============================================================================
// SUMMARY LINE
// ============================================================================

function buildSummary() {
  const label = outputLabels.primary_field || "RESULT";
  const action = outputLabels.action_field || "ACTION";
  if (domain === "MARKET") {
    const ticker = (input.domaindata || {}).ticker || "N/A";
    return `[${domain}] ${ticker}: ${consensusDir[0]} @ ${avgConfidence}% confidence | CASCADE: ${overallScore}% (${gatesPassed}/${gatesTotal})`;
  }
  return `[${domain}] ${label}: ${consensusDir[0]} @ ${avgConfidence}% confidence | CASCADE: ${overallScore}% (${gatesPassed}/${gatesTotal})`;
}

// ============================================================================
// UTILITY
// ============================================================================

function truncate(str, maxLen) {
  if (!str || typeof str !== 'string') return '';
  return str.length > maxLen ? str.substring(0, maxLen - 3) + '...' : str;
}

// ============================================================================
// EXECUTE
// ============================================================================

const telegramMessage = domain === "MARKET" ? formatMarketTelegram() : formatGeneralTelegram();
const githubPayload = buildGitHubPayload();
const dbRecord = buildDBRecord();
const summary = buildSummary();

return [{
  json: {
    ...input,
    formatted_output: {
      telegram_message: telegramMessage,
      github_payload: githubPayload,
      db_record: dbRecord,
      summary: summary,
      domain: domain,
      _template_version: "6.0",
      _timestamp: timestamp
    }
  }
}];
