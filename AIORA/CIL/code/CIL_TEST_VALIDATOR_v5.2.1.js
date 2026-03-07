// CIL v5.2 TEST VALIDATOR — Validates output structure and data quality
// [FIX v5.2.1] Corrected typo: telegramessage → telegrammessage
// [FIX v5.2.1] Added pass2synthesis empty-object detection
// [NOTE] This node MUST receive input from OUTPUT FORMATTER, not CONSENSUS DECISION GATE

const input = $input.first().json;
const runId = input.runid || 'NO-RUN-ID';
const ticker = input.ticker || 'UNKNOWN';

// Test suite
const tests = [];

// Test 1: Run ID present
tests.push({
  test: 'runidpresent',
  pass: !!input.runid && input.runid !== 'NO-RUN-ID',
  detail: input.runid || 'Missing'
});

// Test 2: Cascade level valid
const validLevels = ['FULL_CONFIDENCE', 'HIGH_CONFIDENCE', 'MODERATE', 'LOW'];
tests.push({
  test: 'cascadelevelvalid',
  pass: validLevels.includes(input.cascadelevel),
  detail: input.cascadelevel || 'Missing'
});

// Test 3: Gates scored
tests.push({
  test: 'gates_scored',
  pass: input.gatespassed !== undefined && input.gatestotal !== undefined && input.gatestotal > 0,
  detail: `${input.gatespassed || 0}/${input.gatestotal || 0}`
});

// Test 4: Agent results present
const agentCount = (input.agentresults || []).length;
tests.push({
  test: 'agent_resultspresent',
  pass: agentCount >= 3,
  detail: `${agentCount}/5 agents returned data`
});

// Test 5: Consensus direction valid
const validDirections = ['BULLISH', 'BEARISH', 'NO_CONSENSUS'];
tests.push({
  test: 'consensusdirectionvalid',
  pass: validDirections.includes(input.consensusdirection),
  detail: input.consensusdirection || 'Missing'
});

// Test 6: Pass2 synthesis present (empty object {} = NOT present)
const pass2HasContent = input.pass2synthesis && Object.keys(input.pass2synthesis).length > 0;
tests.push({
  test: 'pass2synthesispresent',
  pass: pass2HasContent,
  detail: pass2HasContent ? 'Present' : 'Missing'
});

// Test 7: Telegram message formatted
// [FIX v5.2.1] TYPO FIXED — was "telegramessage" (missing m), now "telegrammessage" on both sides
tests.push({
  test: 'telegrammessageformatted',
  pass: !!input.telegrammessage && input.telegrammessage.includes(ticker),
  detail: input.telegrammessage ? 'Formatted' : 'Missing'
});

// Test 8: GitHub path generated
tests.push({
  test: 'githubpathgenerated',
  pass: !!input.githubpath && input.githubpath.includes(runId),
  detail: input.githubpath || 'Missing'
});

// Test 9: Data completeness calculated
tests.push({
  test: 'datacompletenesscalculated',
  pass: !!input.datacompleteness,
  detail: input.datacompleteness || 'Missing'
});

// Test 10: Flags array present
tests.push({
  test: 'flagsarraypresent',
  pass: Array.isArray(input.flags),
  detail: `${(input.flags || []).length} flags`
});

// Calculate pass rate
const passCount = tests.filter(t => t.pass).length;
const totalTests = tests.length;
const passRate = (passCount / totalTests * 100).toFixed(1);

return {
  json: {
    runid: runId,
    ticker: ticker,
    testtimestamp: new Date().toISOString(),
    testspassed: passCount,
    teststotal: totalTests,
    passrate: passRate + '%',
    teststatus: passCount === totalTests ? 'PASS' : passCount >= totalTests * 0.8 ? 'WARN' : 'FAIL',
    testdetails: tests,
    fulloutput: input
  }
};
