// ============================================================================
// CIL v6.0 — OUTPUT FORMATTER (MODIFIED)
// n8n Code Node | REPLACES existing OUTPUT FORMATTER code
// ============================================================================
// CHANGES FROM v5.2.1:
//   1. Reads `formatted_output` from OUTPUT TEMPLATE instead of building
//      market-specific formatting inline
//   2. Dual-input merge preserved — pipeline branch + PASS2 branch
//   3. Outputs separate fields for Telegram, GitHub, and DB downstream nodes
//
// INPUT:   $json from Merge node containing:
//          { formatted_output (from OUTPUT TEMPLATE), all upstream data }
//
// OUTPUT:  Structured output for Telegram, GitHub archive, and database
// ============================================================================

const input = $input.first().json;
const formatted = input.formatted_output || {};
const runid = input.runid || "UNKNOWN";
const domain = input.domain || "GENERAL";

// ============================================================================
// TELEGRAM OUTPUT
// ============================================================================

const telegramMessage = formatted.telegram_message || `🔱 CIL v6.0 | ${domain}\n❌ OUTPUT TEMPLATE produced no telegram message\nRun: ${runid}`;

// ============================================================================
// GITHUB ARCHIVAL
// ============================================================================

const githubPayload = formatted.github_payload || {
  runid,
  domain,
  error: "OUTPUT TEMPLATE produced no github payload",
  timestamp: new Date().toISOString()
};

// GitHub file path — domain-routed archival
const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
const githubPath = `AIORA/CIL/runs/${domain}/${dateStr}_${runid}.json`;

// ============================================================================
// DATABASE RECORD
// ============================================================================

const dbRecord = formatted.db_record || {
  runid,
  domain,
  error: "OUTPUT TEMPLATE produced no db record",
  timestamp: new Date().toISOString()
};

// ============================================================================
// TEST VALIDATION FIELDS (backward compat with CIL Test Validator)
// ============================================================================

const cascadeResult = input.cascade_result || {};
const testFields = {
  runid: runid,
  domain: domain,
  overall_score: cascadeResult.overall_score || 0,
  cascade_passed: cascadeResult.passed || false,
  gates_passed: cascadeResult.gates_passed || 0,
  gates_total: cascadeResult.gates_total || 0,
  data_completeness: cascadeResult.data_completeness || 0,
  agent_count: Object.keys(input.agent_outputs || {}).length,
  synthesis_present: !!(input.synthesis || input.pass2_output),
  summary: formatted.summary || "No summary generated"
};

// ============================================================================
// OUTPUT — Three separate output paths
// ============================================================================

return [{
  json: {
    // Telegram
    telegram_message: telegramMessage,

    // GitHub
    github_path: githubPath,
    github_content: JSON.stringify(githubPayload, null, 2),
    github_commit_message: `CIL v6.0 | ${domain} | ${runid} | Score: ${cascadeResult.overall_score || 0}%`,

    // Database
    db_record: dbRecord,

    // Test validation
    test_fields: testFields,

    // Summary
    summary: formatted.summary || "",

    // Pass through for any downstream nodes
    runid: runid,
    domain: domain,
    cascade_result: cascadeResult,

    _output_formatter: {
      version: "6.0",
      domain: domain,
      telegram_length: telegramMessage.length,
      github_path: githubPath,
      _timestamp: new Date().toISOString()
    }
  }
}];
