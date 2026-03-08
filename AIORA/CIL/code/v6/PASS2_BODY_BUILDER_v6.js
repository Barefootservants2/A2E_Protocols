// ============================================================================
// CIL v6.0 — PASS2 BODY BUILDER (MODIFIED)
// n8n Code Node | REPLACES existing PASS2 BODY BUILDER code
// ============================================================================
// CHANGES FROM v5.2.1:
//   1. Reads `routing.synthesis_role` and `routing.synthesis_instruction`
//      instead of hardcoded market thesis synthesis prompt
//   2. Includes cascade_result in synthesis context so PASS2 knows gate scores
//   3. Domain-aware output format instructions
//
// INPUT:   $json from CASCADE VALIDATOR containing:
//          { agent_outputs, cascade_result, routing, domain, query, domaindata, runid, ... }
//
// OUTPUT:  { body } — ready for PASS2 HTTP Request node (Claude API call)
// ============================================================================

const input = $input.first().json;
const routing = input.routing || {};
const domain = input.domain || "GENERAL";
const query = input.query || "";
const cascadeResult = input.cascade_result || {};
const agentOutputs = input.agent_outputs || {};
const outputLabels = routing.output_labels || {};

// ============================================================================
// BUILD SYNTHESIS SYSTEM PROMPT
// ============================================================================

const synthesisRole = routing.synthesis_role ||
  "Senior Intelligence Analyst synthesizing multi-agent assessments";

const synthesisInstruction = routing.synthesis_instruction ||
  "Synthesize the agent reports into a unified assessment with clear recommendations.";

const systemPrompt = `You are the ${synthesisRole} for the Uriel Covenant AI Collective, operating under the METATRON protocol.

DOMAIN: ${routing.label || domain}

YOUR TASK:
${synthesisInstruction}

CASCADE GATE RESULTS (for your awareness — factor into confidence):
Overall Score: ${cascadeResult.overall_score || 0}%
Passed: ${cascadeResult.passed ? "YES" : "NO"}
Hard Fails: ${cascadeResult.hard_fails || 0}
Gate Breakdown:
${(cascadeResult.gate_results || []).map(g =>
  `  Gate ${g.id} (${g.name}): ${g.score}% — ${g.passed ? "PASS" : "FAIL"} — ${g.detail}`
).join("\n")}

OUTPUT FORMAT:
Provide a structured synthesis. Use clear section headers. Include:
1. ${outputLabels.primary_field || "PRIMARY ASSESSMENT"}: Your unified conclusion
2. ${outputLabels.secondary_field || "CONFIDENCE"}: Your calibrated confidence (0-100)
3. ${outputLabels.action_field || "RECOMMENDED ACTIONS"}: Specific, actionable items
4. DISSENT: Where agents disagreed and why it matters
5. RISKS: Top 3 risks to this assessment
6. DATA GAPS: What's missing that would change your conclusion

PROTOCOL RULES:
- Evidence before assertion
- Acknowledge uncertainty explicitly
- Counter-thesis must be addressed
- If cascade FAILED, your synthesis MUST explain why and whether the failure is material
- Do NOT manufacture confidence — if the data is weak, say so`;

// ============================================================================
// BUILD USER MESSAGE WITH ALL AGENT OUTPUTS
// ============================================================================

const agentEntries = Object.entries(agentOutputs);
let userMessage = `QUERY: ${query}\n\n`;
userMessage += `DOMAIN: ${domain}\n\n`;
userMessage += `5 AGENT REPORTS:\n`;
userMessage += `━━━━━━━━━━━━━━━━━━━━\n`;

for (const [agentName, output] of agentEntries) {
  userMessage += `\n── ${agentName} ──\n`;
  userMessage += JSON.stringify(output, null, 2);
  userMessage += `\n`;
}

userMessage += `\n━━━━━━━━━━━━━━━━━━━━\n`;
userMessage += `\nSynthesize these ${agentEntries.length} reports into a unified ${outputLabels.primary_field || "assessment"}.`;

// ============================================================================
// BUILD CLAUDE API REQUEST BODY
// ============================================================================

const body = {
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  system: systemPrompt,
  messages: [
    {
      role: "user",
      content: userMessage
    }
  ]
};

// ============================================================================
// OUTPUT
// ============================================================================

return [{
  json: {
    ...input,
    pass2_body: body,
    _pass2_builder: {
      version: "6.0",
      domain: domain,
      synthesis_role: synthesisRole.substring(0, 100),
      agent_count: agentEntries.length,
      system_prompt_length: systemPrompt.length,
      user_message_length: userMessage.length,
      cascade_score: cascadeResult.overall_score || 0,
      _timestamp: new Date().toISOString()
    }
  }
}];
