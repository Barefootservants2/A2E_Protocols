// PASS2 FALLBACK BODY BUILDER — Constructs OpenAI GPT-4o request body
// [FIX v5.2.1] Pulls original agent data from COLLECTIVE ASSEMBLER, NOT from PASS2 error chain
//
// CRITICAL: This node receives the error object from PASS2 ROUTE, but we DON'T use that.
// Instead we reference the COLLECTIVE ASSEMBLER output directly using n8n's $() syntax.
//
// DEPLOY AS: Code node, placed BETWEEN PASS2 ROUTE and PASS2 FALLBACK — OpenAI
// WIRING: PASS2 ROUTE → [this node] → PASS2 FALLBACK — OpenAI
//
// If your COLLECTIVE ASSEMBLER node has a different name, update the reference below.

// Get the ORIGINAL agent data from COLLECTIVE ASSEMBLER (upstream node reference)
// This bypasses the error chain entirely
let assemblerOutput;
try {
  assemblerOutput = $('COLLECTIVE ASSEMBLER').first().json;
} catch (e) {
  // Fallback: try alternate node names
  try {
    assemblerOutput = $('COLLECTIVE_ASSEMBLER').first().json;
  } catch (e2) {
    return {
      json: {
        error: 'FALLBACK BODY BUILDER: Cannot reference COLLECTIVE ASSEMBLER output. Check node name.',
        pass2failed: true,
        failurereason: 'Node reference failed: ' + e2.message
      }
    };
  }
}

// Extract agent outputs
const agentOutputs = assemblerOutput.agent_outputs || {};
const sanitizedAgents = {};

for (const [agentName, agentData] of Object.entries(agentOutputs)) {
  if (agentData && agentData.status === 'success' && agentData.data) {
    sanitizedAgents[agentName] = {
      direction: agentData.data.direction || 'UNKNOWN',
      confidence: agentData.data.confidence || 0,
      catalysts: agentData.data.catalysts || [],
      risks: agentData.data.risks || [],
      counter_thesis: agentData.data.counter_thesis || '',
      timeline: agentData.data.timeline || ''
    };
  }
}

const ticker = assemblerOutput.ticker || 'UNKNOWN';
const hunterdata = assemblerOutput.hunterdata || {};

const promptContent = `Synthesize these 5 agent responses for ticker ${ticker}:

HUNTER DATA: Price $${hunterdata.price || 'N/A'}, RSI ${hunterdata.rsi_14 || 'N/A'}, Volume ${hunterdata.volume || 'N/A'}, VIX ${hunterdata.vix || 'N/A'}, DXY ${hunterdata.dxy || 'N/A'}

AGENT RESPONSES:
${JSON.stringify(sanitizedAgents, null, 2)}

Provide your synthesis as valid JSON with these fields:
- direction: BULLISH, BEARISH, or NEUTRAL
- confidence: 0-100
- risk_reward_ratio: string like "2.5:1"
- catalysts: array of top 3 catalysts with windows
- counter_thesis: strongest counter-argument
- recommendation: ACCEPT, REJECT, or HOLD
- gate_scores: object with gate assessments`;

// Build OpenAI-format request body
const requestBody = {
  model: "gpt-4o",
  max_tokens: 16384,
  messages: [
    {
      role: "system",
      content: "You are MICHA PASS2 SYNTHESIS FALLBACK for AIORA CIL v5.2. Claude API is unavailable. Synthesize the agent responses into a unified assessment. Output ONLY valid JSON, no markdown fences, no preamble."
    },
    {
      role: "user",
      content: promptContent
    }
  ]
};

return { json: requestBody };
