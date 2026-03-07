// CIL v5.2 DIAGNOSTIC ENGINE — Validates data correctness, not just execution
// [FIX v5.2.1] Agent lookup: agentresults array has no .agent field — use index mapping
// [FIX v5.2.1] Added diagnostictelegram field for ERROR TELEGRAM node

const input = $input.first().json;
const issues = [];
const runId = input.runid || 'NO-RUN-ID';

// Agent name-to-index mapping (matches OUTPUT FORMATTER array order)
const agents = ['URIEL', 'COLOSSUS', 'HANIEL', 'RAZIEL', 'SARIEL'];
const agentResults = input.agentresults || [];

// [FIX v5.2.1] Use index-based lookup since agentresults is a positional array
// agentresults[0] = URIEL, [1] = COLOSSUS, [2] = HANIEL, [3] = RAZIEL, [4] = SARIEL
for (let i = 0; i < agents.length; i++) {
  const agent = agents[i];
  const result = agentResults[i]; // positional — no .agent field exists

  if (!result) {
    issues.push({ severity: 'ERROR', node: agent, detail: 'Agent returned no data' });
  } else if (result.error) {
    issues.push({ severity: 'ERROR', node: agent, detail: `Agent error: ${result.error}` });
  } else {
    if (!result.direction || !['BULLISH', 'BEARISH', 'NEUTRAL'].includes(result.direction.toUpperCase())) {
      issues.push({ severity: 'WARN', node: agent, detail: `Invalid direction: ${result.direction}` });
    }
    if (result.confidence !== undefined && (result.confidence < 0 || result.confidence > 100)) {
      issues.push({ severity: 'WARN', node: agent, detail: `Confidence out of range: ${result.confidence}` });
    }
    if (!result.risks || result.risks.length === 0) {
      issues.push({ severity: 'WARN', node: agent, detail: 'No risks identified (possible analysis gap)' });
    }
    if (result.data_gaps && result.data_gaps.length > 0) {
      issues.push({ severity: 'INFO', node: agent, detail: `Data gaps reported: ${result.data_gaps.length} items` });
    }
  }
}

// Check cascade integrity
if (!input.cascadelevel) {
  issues.push({ severity: 'ERROR', node: 'CASCADE VALIDATOR', detail: 'No cascade level produced' });
}

// Check for PASS2 synthesis failure
if (!input.pass2synthesis || Object.keys(input.pass2synthesis).length === 0) {
  issues.push({ severity: 'ERROR', node: 'MICHA PASS2', detail: 'Synthesis returned empty — possible API failure' });
}

// Check for flags
if (input.flags && input.flags.length > 0) {
  for (const flag of input.flags) {
    issues.push({ severity: 'FLAG', node: 'CASCADE', detail: flag });
  }
}

const errorIssues = issues.filter(i => i.severity === 'ERROR');
const warnIssues = issues.filter(i => i.severity === 'WARN');
const hasErrors = errorIssues.length > 0;
const hasWarnings = warnIssues.length > 0;

// [FIX v5.2.1] Build diagnostictelegram string for ERROR TELEGRAM node
let diagnosticLines = [];
diagnosticLines.push(`🔧 CIL DIAGNOSTIC REPORT`);
diagnosticLines.push(`━━━━━━━━━━━━━━━━`);
diagnosticLines.push(`RUN: ${runId}`);
diagnosticLines.push(`ERRORS: ${errorIssues.length} | WARNINGS: ${warnIssues.length}`);
diagnosticLines.push(``);

for (const issue of issues) {
  const icon = issue.severity === 'ERROR' ? '🔴' : issue.severity === 'WARN' ? '🟡' : issue.severity === 'FLAG' ? '🚩' : 'ℹ️';
  diagnosticLines.push(`${icon} [${issue.node}] ${issue.detail}`);
}

diagnosticLines.push(``);
diagnosticLines.push(`━━━━━━━━━━━━━━━━`);

return {
  json: {
    runid: runId,
    hasissues: hasErrors,
    haswarnings: hasWarnings,
    issuecount: issues.length,
    errorcount: errorIssues.length,
    issues: issues,
    diagnostictelegram: diagnosticLines.join('\n'),
    diagnostictimestamp: new Date().toISOString()
  }
};
