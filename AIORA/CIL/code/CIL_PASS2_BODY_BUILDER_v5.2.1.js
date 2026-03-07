// PASS2 BODY BUILDER — Constructs Anthropic Claude API request body
// [FIX v5.2.1] Replaces expression-based JSON with proper sanitization
// [FIX v5.2.1] This should be a CODE NODE, not an HTTP node with expression body
//
// INPUT: Full COLLECTIVE ASSEMBLER output (agent_outputs, hunterdata, etc.)
// OUTPUT: Clean JSON object ready for MICHA PASS2 SYNTHESIS HTTP node
//
// IMPORTANT: After deploying this code node, change MICHA PASS2 SYNTHESIS to:
//   Body Content Type: JSON
//   Specify Body: Using JSON
//   JSON: {{ JSON.stringify($json) }}
//   (This works because $json is now a pre-built, sanitized object)

const input = $input.first().json;

// Sanitize function — strips characters that break JSON string interpolation
function sanitizeForJSON(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// Extract and sanitize agent outputs for the synthesis prompt
const agentOutputs = input.agent_outputs || {};
const sanitizedAgents = {};

for (const [agentName, agentData] of Object.entries(agentOutputs)) {
  if (agentData && agentData.status === 'success' && agentData.data) {
    sanitizedAgents[agentName] = {
      direction: agentData.data.direction || 'UNKNOWN',
      confidence: agentData.data.confidence || 0,
      catalysts: agentData.data.catalysts || [],
      risks: agentData.data.risks || [],
      counter_thesis: agentData.data.counter_thesis || '',
      timeline: agentData.data.timeline || '',
      data_gaps: agentData.data.data_gaps || []
    };
  }
}

// Build the synthesis prompt content
const promptContent = `Synthesize these 5 agent responses for ticker ${input.ticker || 'UNKNOWN'}:

HUNTER DATA: Price $${input.hunterdata?.price || 'N/A'}, RSI ${input.hunterdata?.rsi_14 || 'N/A'}, Volume ${input.hunterdata?.volume || 'N/A'}, VIX ${input.hunterdata?.vix || 'N/A'}, DXY ${input.hunterdata?.dxy || 'N/A'}

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

// Construct the full API request body as a clean object
const requestBody = {
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "You are MICHA PASS2 SYNTHESIS for AIORA CIL v5.2. Synthesize the collective agent analysis into a unified assessment. Output ONLY valid JSON, no markdown fences, no preamble."
        },
        {
          type: "text",
          text: promptContent
        }
      ]
    }
  ]
};

// Return the pre-built body — MICHA PASS2 SYNTHESIS just sends {{ JSON.stringify($json) }}
return { json: requestBody };
