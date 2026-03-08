// ============================================================================
// CIL v6.0 — PASS2 FALLBACK BODY BUILDER (MODIFIED)
// n8n Code Node | REPLACES existing PASS2 FALLBACK BODY BUILDER code
// ============================================================================
// CHANGES FROM v5.2.1:
//   1. Reads routing config for domain-aware synthesis prompt
//   2. Same structure as PASS2 BODY BUILDER but targets GPT-4o
//   3. Fires only when Claude PASS2 fails/times out
//
// INPUT:   $json (same as PASS2 BODY BUILDER input — cascaded from error branch)
// OUTPUT:  { body } — ready for GPT-4o HTTP Request node
// ============================================================================

const input = $input.first().json;
const routing = input.routing || {};
const domain = input.domain || "GENERAL";
const query = input.query || "";
const cascadeResult = input.cascade_result || {};
const agentOutputs = input.agent_outputs || {};
const outputLabels = routing.output_labels || {};

// ============================================================================
// BUILD GPT-4o SYNTHESIS PROMPT (mirrors Claude prompt, adapted for OpenAI format)
// ============================================================================

const synthesisRole = routing.synthesis_role ||
  "Senior Intelligence Analyst synthesizing multi-agent assessments";

const synthesisInstruction = routing.synthesis_instruction ||
  "Synthesize the agent reports into a unified assessment with clear recommendations.";

const systemPrompt = `You are the ${synthesisRole} for the Uriel Covenant AI Collective (FALLBACK synthesis — primary agent unavailable).

DOMAIN: ${routing.label || domain}

YOUR TASK:
${synthesisInstruction}

CASCADE RESULTS:
Overall Score: ${cascadeResult.overall_score || 0}% | Passed: ${cascadeResult.passed ? "YES" : "NO"}

OUTPUT FORMAT:
1. ${outputLabels.primary_field || "PRIMARY ASSESSMENT"}
2. ${outputLabels.secondary_field || "CONFIDENCE"} (0-100)
3. ${outputLabels.action_field || "RECOMMENDED ACTIONS"}
4. DISSENT
5. RISKS
6. DATA GAPS

Evidence before assertion. Acknowledge uncertainty. Address counter-thesis.`;

// Build user message
const agentEntries = Object.entries(agentOutputs);
let userMessage = `QUERY: ${query}\n\n5 AGENT REPORTS:\n`;

for (const [agentName, output] of agentEntries) {
  userMessage += `\n── ${agentName} ──\n`;
  userMessage += JSON.stringify(output, null, 2);
  userMessage += `\n`;
}

userMessage += `\nSynthesize into unified ${outputLabels.primary_field || "assessment"}.`;

// ============================================================================
// BUILD OPENAI API REQUEST BODY
// ============================================================================

const body = {
  model: "gpt-4o",
  max_tokens: 4096,
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ]
};

return [{
  json: {
    ...input,
    pass2_fallback_body: body,
    _pass2_fallback_builder: {
      version: "6.0",
      domain: domain,
      model: "gpt-4o",
      fallback_reason: "Claude PASS2 failed or timed out",
      _timestamp: new Date().toISOString()
    }
  }
}];
