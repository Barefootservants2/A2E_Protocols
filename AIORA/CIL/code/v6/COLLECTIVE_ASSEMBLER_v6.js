// ============================================================================
// CIL v6.0 — COLLECTIVE ASSEMBLER (MODIFIED)
// n8n Code Node | REPLACES existing COLLECTIVE ASSEMBLER code
// ============================================================================
// CHANGES FROM v5.2.1:
//   1. References `domaindata` instead of `hunterdata`
//   2. Passes through `routing`, `domain`, `gate_config` fields
//   3. Uses `systemprompt_<AGENT>` and `userprompt` from PROMPT BUILDER
//   4. Builds the payload that feeds all 5 agent HTTP nodes
//
// INPUT:   $json from PROMPT BUILDER containing:
//          { domain, query, context, domaindata, routing, runid,
//            systemprompt_URIEL, systemprompt_COLOSSUS, ..., userprompt }
//
// OUTPUT:  Assembled payload ready for 5 parallel agent HTTP nodes
// ============================================================================

const input = $input.first().json;

// ============================================================================
// ASSEMBLE AGENT PAYLOADS
// ============================================================================
// Each agent HTTP node will read:
//   - $json.systemprompt_<AGENTNAME> for its system prompt
//   - $json.userprompt for the user message
//   - $json.domaindata for any structured data it needs
//
// The ASSEMBLER's job is to ensure all fields are present and properly formatted.
// ============================================================================

const agents = ["URIEL", "COLOSSUS", "HANIEL", "RAZIEL", "SARIEL"];
const assemblyWarnings = [];

// Validate all system prompts exist
for (const agent of agents) {
  const key = `systemprompt_${agent}`;
  if (!input[key] || input[key].startsWith("ERROR:")) {
    assemblyWarnings.push(`Missing or errored system prompt for ${agent}`);
  }
}

// Validate user prompt exists
if (!input.userprompt || input.userprompt.trim().length === 0) {
  assemblyWarnings.push("User prompt is empty — agents will have no query to analyze");
}

// ============================================================================
// DOMAINDATA PACKAGING
// ============================================================================
// For MARKET domain, include the full HUNTER data blob
// For GENERAL, include whatever context was provided
// For any domain, include the raw domaindata object

const domaindata = input.domaindata || {};
const domaindataStr = JSON.stringify(domaindata);

// Size check — warn if domaindata is very large (>50KB might impact API calls)
if (domaindataStr.length > 50000) {
  assemblyWarnings.push(`domaindata is ${Math.round(domaindataStr.length / 1024)}KB — may approach API token limits`);
}

// ============================================================================
// OUTPUT
// ============================================================================
// Pass through everything. Agent HTTP nodes reference specific fields:
//   System prompt: {{ $json.systemprompt_URIEL }}
//   User content:  {{ $json.userprompt }}
//
// All routing, gate_config, and metadata flow through untouched for
// downstream CASCADE VALIDATOR, GATE CONFIG, PASS2, OUTPUT TEMPLATE.
// ============================================================================

return [{
  json: {
    ...input,
    // Ensure domaindata is present (not hunterdata)
    domaindata: domaindata,
    // Assembly metadata
    _assembler: {
      version: "6.0",
      agents_configured: agents.length,
      userprompt_length: (input.userprompt || "").length,
      domaindata_size_bytes: domaindataStr.length,
      warnings: assemblyWarnings,
      domain: input.domain,
      runid: input.runid,
      _timestamp: new Date().toISOString()
    }
  }
}];
