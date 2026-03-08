// ============================================================================
// CIL v6.0 — PROMPT BUILDER
// n8n Code Node | Position: After DOMAIN ROUTER, Before COLLECTIVE ASSEMBLER
// ============================================================================
// PURPOSE: Takes domain routing config and builds 5 complete system prompts
//          plus the user prompt. Each agent HTTP node reads its prompt from
//          the output fields instead of hardcoded text.
//
// INPUT:   $json from DOMAIN ROUTER containing:
//          { domain, query, context, domaindata, routing, runid, ... }
//
// OUTPUT:  Original input PLUS:
//          systemprompt_URIEL, systemprompt_COLOSSUS, systemprompt_HANIEL,
//          systemprompt_RAZIEL, systemprompt_SARIEL, userprompt
// ============================================================================

const input = $input.first().json;
const routing = input.routing;
const domain = input.domain;
const query = input.query || "";
const context = input.context || "";
const domaindata = input.domaindata || {};

// ============================================================================
// SYSTEM PROMPT TEMPLATE
// ============================================================================
// Each agent gets:
//   1. Identity + role (from routing.agent_roles)
//   2. Output schema (from routing.agent_output_schema) — MUST return valid JSON
//   3. Domain-specific instructions
//   4. Collective protocol rules (universal)
// ============================================================================

function buildSystemPrompt(agentName, agentRole, outputSchema, domainConfig) {
  const schemaFields = Object.entries(outputSchema)
    .map(([key, desc]) => `    "${key}": ${desc}`)
    .join(",\n");

  return `You are ${agentName}, a member of the Uriel Covenant AI Collective operating under the METATRON protocol.

ROLE: ${agentRole}

DOMAIN: ${domainConfig.label}
CONTEXT: ${domainConfig.description}

YOUR TASK:
Analyze the query and all provided data through the lens of your specialized role. You are one of five agents. Your analysis will be synthesized with four other perspectives by a senior synthesis agent. Do NOT try to be comprehensive — focus on YOUR specialty. Other agents cover their domains.

OUTPUT FORMAT — MANDATORY:
You MUST respond with ONLY a valid JSON object. No markdown. No commentary. No code fences. Just the JSON object.

Required JSON schema:
{
${schemaFields}
}

COLLECTIVE PROTOCOL RULES:
1. Evidence before assertion — every claim needs a supporting data point or reasoning chain
2. Acknowledge data gaps explicitly — if you lack data for a field, say so in data_gaps
3. Confidence is calibrated: 90+ means near-certain, 70-89 is strong, 50-69 is moderate, below 50 is speculative
4. Counter-thesis is mandatory — your "risks" field must include at least one scenario where your analysis is wrong
5. Do NOT hallucinate data — if a metric isn't provided, don't invent it
6. Timeframe matters — qualify all assessments with temporal scope
7. You are operating as part of a collective — disagreement with other agents is expected and valued`;
}

// ============================================================================
// USER PROMPT TEMPLATE
// ============================================================================

function buildUserPrompt(query, context, domaindata, domainConfig) {
  let prompt = `QUERY:\n${query}\n`;

  if (context && context.trim().length > 0) {
    prompt += `\nCONTEXT:\n${context}\n`;
  }

  // Format domaindata based on what's present
  const dataEntries = Object.entries(domaindata);
  if (dataEntries.length > 0) {
    prompt += `\nDOMAIN DATA:\n`;

    // For MARKET domain, format financial data cleanly
    if (domainConfig.id === "MARKET") {
      prompt += formatMarketData(domaindata);
    } else {
      // Generic formatting — JSON with readable keys
      prompt += JSON.stringify(domaindata, null, 2);
    }
  }

  prompt += `\n\nRespond with ONLY a valid JSON object matching the required schema. No other text.`;
  return prompt;
}

function formatMarketData(data) {
  let lines = [];

  if (data.ticker) lines.push(`Ticker: ${data.ticker}`);
  if (data.price) lines.push(`Current Price: $${data.price}`);
  if (data.volume) lines.push(`Volume: ${data.volume}`);
  if (data.rsi) lines.push(`RSI(14): ${data.rsi}`);
  if (data.macd) lines.push(`MACD: ${JSON.stringify(data.macd)}`);
  if (data.short_interest) lines.push(`Short Interest: ${data.short_interest}%`);
  if (data.sector) lines.push(`Sector: ${data.sector}`);
  if (data.market_cap) lines.push(`Market Cap: ${data.market_cap}`);
  if (data.earnings_date) lines.push(`Next Earnings: ${data.earnings_date}`);

  // HUNTER modules — pass through as structured block
  if (data.hunter_modules) {
    lines.push(`\nHUNTER MODULE DATA:`);
    if (typeof data.hunter_modules === 'object') {
      for (const [module, moduleData] of Object.entries(data.hunter_modules)) {
        lines.push(`  ${module}: ${typeof moduleData === 'object' ? JSON.stringify(moduleData) : moduleData}`);
      }
    } else {
      lines.push(`  ${data.hunter_modules}`);
    }
  }

  // Any other fields not explicitly handled
  const handledKeys = ['ticker', 'price', 'volume', 'rsi', 'macd', 'short_interest', 'sector', 'market_cap', 'earnings_date', 'hunter_modules'];
  for (const [key, val] of Object.entries(data)) {
    if (!handledKeys.includes(key)) {
      lines.push(`${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`);
    }
  }

  return lines.join("\n");
}

// ============================================================================
// BUILD ALL 5 PROMPTS
// ============================================================================

const agents = ["URIEL", "COLOSSUS", "HANIEL", "RAZIEL", "SARIEL"];
const systemPrompts = {};

for (const agent of agents) {
  const role = routing.agent_roles[agent];
  if (!role) {
    systemPrompts[`systemprompt_${agent}`] = `ERROR: No role defined for ${agent} in domain ${domain}`;
    continue;
  }
  systemPrompts[`systemprompt_${agent}`] = buildSystemPrompt(
    agent,
    role,
    routing.agent_output_schema,
    routing
  );
}

// Build the shared user prompt (all 5 agents get the same query)
const userPrompt = buildUserPrompt(query, context, domaindata, routing);

// ============================================================================
// OUTPUT
// ============================================================================

return [{
  json: {
    ...input,
    ...systemPrompts,
    userprompt: userPrompt,
    _prompt_builder: {
      domain: domain,
      agents_configured: agents.length,
      user_prompt_length: userPrompt.length,
      system_prompt_lengths: Object.fromEntries(
        agents.map(a => [a, systemPrompts[`systemprompt_${a}`].length])
      ),
      timestamp: new Date().toISOString()
    }
  }
}];
