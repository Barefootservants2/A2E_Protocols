// ============================================================================
// CIL v6.0 — DOMAIN ROUTER
// n8n Code Node | Position: After INPUT VALIDATOR, Before PROMPT BUILDER
// ============================================================================
// PURPOSE: Reads `domain` from validated input, produces full routing config
//          that drives PROMPT BUILDER, GATE CONFIG, OUTPUT TEMPLATE, and
//          all downstream domain-aware nodes.
//
// INPUT:   $json from INPUT VALIDATOR containing:
//          { domain, query, context, domaindata, runid, timestamp, ... }
//
// OUTPUT:  Original input PLUS `routing` object with all domain config
// ============================================================================

const DOMAIN_REGISTRY = {

  // ── MARKET (AIORA) ── Existing v5.2.1 behavior, preserved exactly ──
  MARKET: {
    id: "MARKET",
    label: "AIORA Market Analysis",
    description: "Multi-agent market thesis evaluation with HUNTER data integration",

    // Agent role definitions — used by PROMPT BUILDER
    agent_roles: {
      URIEL:    "Senior Quantitative Analyst specializing in technical pattern recognition, price action analysis, and statistical probability assessment",
      COLOSSUS: "Contrarian Risk Strategist specializing in identifying overlooked risks, challenging consensus narratives, and stress-testing assumptions",
      HANIEL:   "Fundamental Research Analyst specializing in macroeconomic context, sector dynamics, earnings quality, and institutional positioning",
      RAZIEL:   "Deep Value / Alternative Data Analyst specializing in unconventional signals, sentiment divergence, flow analysis, and hidden catalysts",
      SARIEL:   "Synthesis Analyst specializing in cross-referencing real-time news, regulatory developments, and event-driven catalysts against base case"
    },

    // Agent output schema — what each agent MUST return
    agent_output_schema: {
      direction: "BULLISH | BEARISH | NEUTRAL | INSUFFICIENT_DATA",
      confidence: "0-100 integer",
      thesis: "string — 2-4 sentence core argument",
      key_factors: "array of strings — top 3-5 driving factors",
      risks: "array of strings — top 3 risks to thesis",
      catalysts: "array of strings — upcoming catalysts with dates if known",
      timeframe: "string — INTRADAY | SWING (2-10 days) | POSITION (2-8 weeks) | LONG (8+ weeks)",
      data_gaps: "array of strings — what data is missing or stale"
    },

    // Gate configuration — used by GATE CONFIG
    gates: {
      universal: [
        { id: 1, name: "DATA_SUFFICIENCY",       weight: 1.0, threshold: 60,  description: "Minimum data completeness across all agents" },
        { id: 2, name: "DIRECTIONAL_CONSENSUS",   weight: 1.5, threshold: 60,  description: ">=3/5 agents agree on direction" },
        { id: 3, name: "CATALYST_PRESENT",         weight: 1.0, threshold: 50,  description: "At least one dated catalyst identified" },
        { id: 5, name: "TIMELINE_ALIGNMENT",       weight: 0.8, threshold: 60,  description: "Agent timeframes don't wildly conflict" },
        { id: 7, name: "COUNTER_THESIS_ADDRESSED", weight: 1.2, threshold: 50,  description: "Gate 7.5 — counter-thesis articulated and weighed" }
      ],
      domain_specific: [
        { id: 4,   name: "RISK_REWARD_RATIO",       weight: 1.2, threshold: 55, description: "Favorable R:R based on agent targets vs stops" },
        { id: 6,   name: "SECTOR_CONTEXT",           weight: 0.8, threshold: 50, description: "Sector/macro alignment confirmed" },
        { id: 8,   name: "IRONCLAD_POSITION_SIZE",   weight: 1.5, threshold: 70, description: "Position sizing within IRONCLAD v2.0 limits" },
        { id: "3b", name: "HUNTER_COMPLETENESS",     weight: 1.0, threshold: 65, description: "HUNTER module data coverage (H1-H20 + H30-H39)" }
      ]
    },

    // PASS2 synthesis instructions
    synthesis_role: "Chief Investment Officer synthesizing a multi-analyst market thesis",
    synthesis_instruction: "Synthesize the 5 analyst reports into a unified market thesis. Produce: DIRECTION (BULLISH/BEARISH/NEUTRAL), CONFIDENCE (0-100), unified thesis statement, consolidated risk factors, recommended action (BUY/SELL/HOLD/WATCH), position sizing guidance per IRONCLAD v2.0, and timeline. If analysts conflict, weight the majority but explicitly note dissent.",

    // Output format labels
    output_labels: {
      primary_field:   "DIRECTION",
      secondary_field: "CONFIDENCE",
      action_field:    "RECOMMENDED ACTION",
      detail_fields:   ["THESIS", "RISKS", "CATALYSTS", "TIMEFRAME", "POSITION SIZE", "DATA COMPLETENESS"]
    },

    // Validation rules for domaindata
    required_domaindata_fields: ["ticker"],
    optional_domaindata_fields: ["price", "volume", "rsi", "macd", "short_interest", "sector", "market_cap", "earnings_date", "hunter_modules"]
  },

  // ── GENERAL (Catch-all) ── Universal query processing ──
  GENERAL: {
    id: "GENERAL",
    label: "General Collective Intelligence",
    description: "Domain-agnostic multi-agent consensus for any complex query",

    agent_roles: {
      URIEL:    "Analytical Reasoner specializing in logical structure, evidence evaluation, and quantitative assessment",
      COLOSSUS: "Critical Challenger specializing in identifying flaws, biases, overlooked alternatives, and stress-testing assumptions",
      HANIEL:   "Research Synthesizer specializing in connecting disparate information sources, identifying patterns, and contextual analysis",
      RAZIEL:   "Creative Problem Solver specializing in unconventional approaches, lateral thinking, and novel frameworks",
      SARIEL:   "Practical Implementer specializing in feasibility assessment, resource requirements, timeline estimation, and actionable recommendations"
    },

    agent_output_schema: {
      position: "SUPPORT | OPPOSE | CONDITIONAL | INSUFFICIENT_DATA",
      confidence: "0-100 integer",
      analysis: "string — 2-4 sentence core analysis",
      key_factors: "array of strings — top 3-5 supporting points",
      risks: "array of strings — top 3 risks or weaknesses",
      recommendations: "array of strings — specific actionable items",
      complexity: "string — LOW | MEDIUM | HIGH | CRITICAL",
      data_gaps: "array of strings — what information is missing"
    },

    gates: {
      universal: [
        { id: 1, name: "DATA_SUFFICIENCY",       weight: 1.0, threshold: 60,  description: "Minimum data completeness across all agents" },
        { id: 2, name: "DIRECTIONAL_CONSENSUS",   weight: 1.5, threshold: 60,  description: ">=3/5 agents agree on position" },
        { id: 3, name: "EVIDENCE_PRESENT",         weight: 1.0, threshold: 50,  description: "Claims backed by specific evidence or reasoning" },
        { id: 5, name: "SCOPE_ALIGNMENT",          weight: 0.8, threshold: 60,  description: "Agent responses address the actual query scope" },
        { id: 7, name: "COUNTER_THESIS_ADDRESSED", weight: 1.2, threshold: 50,  description: "Gate 7.5 — opposing view articulated and weighed" }
      ],
      domain_specific: [
        { id: 4,   name: "FEASIBILITY_CHECK",       weight: 1.0, threshold: 55, description: "Recommended actions are practically achievable" },
        { id: 6,   name: "CONSISTENCY_CHECK",        weight: 1.0, threshold: 50, description: "No internal contradictions across agent outputs" },
        { id: 8,   name: "COMPLETENESS_SCORE",       weight: 1.2, threshold: 60, description: "All aspects of the query addressed" },
        { id: "3b", name: "SOURCE_QUALITY",          weight: 0.8, threshold: 50, description: "Evidence quality and recency assessment" }
      ]
    },

    synthesis_role: "Chief Intelligence Officer synthesizing multi-analyst assessments into unified recommendation",
    synthesis_instruction: "Synthesize the 5 analyst reports into a unified assessment. Produce: POSITION (SUPPORT/OPPOSE/CONDITIONAL), CONFIDENCE (0-100), unified analysis, consolidated risks, recommended actions (prioritized list), complexity assessment, and implementation timeline. If analysts conflict, weight the majority but explicitly note dissent and conditions under which the minority view would prevail.",

    output_labels: {
      primary_field:   "POSITION",
      secondary_field: "CONFIDENCE",
      action_field:    "RECOMMENDED ACTIONS",
      detail_fields:   ["ANALYSIS", "RISKS", "EVIDENCE STRENGTH", "COMPLEXITY", "IMPLEMENTATION", "DATA COMPLETENESS"]
    },

    required_domaindata_fields: [],
    optional_domaindata_fields: ["reference_docs", "constraints", "stakeholders", "deadline", "budget", "prior_decisions"]
  }
};

// ============================================================================
// EXECUTION
// ============================================================================

const input = $input.first().json;

// Extract domain — default to GENERAL if not specified
const requestedDomain = (input.domain || "GENERAL").toUpperCase().trim();

// Validate domain exists
const domainConfig = DOMAIN_REGISTRY[requestedDomain];

if (!domainConfig) {
  // Unknown domain — route to GENERAL with warning
  const fallbackConfig = DOMAIN_REGISTRY["GENERAL"];
  return [{
    json: {
      ...input,
      domain: "GENERAL",
      routing: {
        ...fallbackConfig,
        _routed_from: requestedDomain,
        _fallback: true,
        _warning: `Unknown domain '${requestedDomain}' — routed to GENERAL. Known domains: ${Object.keys(DOMAIN_REGISTRY).join(", ")}`,
        _available_domains: Object.keys(DOMAIN_REGISTRY),
        _timestamp: new Date().toISOString()
      }
    }
  }];
}

// Validate required domaindata fields
const domaindata = input.domaindata || {};
const missingFields = domainConfig.required_domaindata_fields.filter(f => !(f in domaindata));

const validationWarnings = [];
if (missingFields.length > 0) {
  validationWarnings.push(`Missing required domaindata fields: ${missingFields.join(", ")}`);
}

// Compute all gates (universal + domain-specific) as ordered array
const allGates = [
  ...domainConfig.gates.universal,
  ...domainConfig.gates.domain_specific
].sort((a, b) => {
  // Sort by numeric ID, with string IDs (like "3b") after their base number
  const aNum = parseFloat(String(a.id).replace(/[^0-9.]/g, ''));
  const bNum = parseFloat(String(b.id).replace(/[^0-9.]/g, ''));
  if (aNum !== bNum) return aNum - bNum;
  // If same base number, string IDs come after
  return String(a.id).length - String(b.id).length;
});

// Build output
return [{
  json: {
    ...input,
    domain: domainConfig.id,
    routing: {
      ...domainConfig,
      all_gates: allGates,
      gate_count: allGates.length,
      _fallback: false,
      _warnings: validationWarnings,
      _available_domains: Object.keys(DOMAIN_REGISTRY),
      _timestamp: new Date().toISOString()
    }
  }
}];
