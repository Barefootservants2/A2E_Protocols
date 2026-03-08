// ============================================================================
// CIL v6.0 — INPUT VALIDATOR (MODIFIED)
// n8n Code Node | REPLACES existing INPUT VALIDATOR code
// ============================================================================
// CHANGES FROM v5.2.1:
//   1. Accepts `domain` field (defaults to "GENERAL")
//   2. Renames `hunterdata` → `domaindata` (backward compat: hunterdata still accepted)
//   3. Required fields: query (string). Everything else optional.
//   4. Generates runid if not provided
//   5. Passes through all fields for downstream routing
//
// INPUT:   Raw webhook/manual trigger payload
// OUTPUT:  Validated, normalized input for DOMAIN ROUTER
// ============================================================================

const input = $input.first().json;

// ============================================================================
// FIELD EXTRACTION + BACKWARD COMPATIBILITY
// ============================================================================

// Domain — new field, defaults to GENERAL
const domain = (input.domain || "GENERAL").toUpperCase().trim();

// Query — required
const query = input.query || input.prompt || input.message || "";
if (!query || query.trim().length === 0) {
  return [{
    json: {
      error: true,
      error_message: "INPUT VALIDATOR: Missing required field 'query'. Provide a query, prompt, or message.",
      input_received: Object.keys(input),
      _timestamp: new Date().toISOString()
    }
  }];
}

// Context — optional supplementary text
const context = input.context || input.additional_context || "";

// Domain data — backward compat: accept both `domaindata` and `hunterdata`
let domaindata = input.domaindata || input.hunterdata || input.data || {};

// If MARKET domain and hunterdata was used, normalize the field name
if (input.hunterdata && !input.domaindata) {
  // Backward compatibility — hunterdata is now domaindata
  domaindata = input.hunterdata;
}

// Run ID — generate if not provided
const runid = input.runid || `CIL-${domain}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

// Timestamp
const timestamp = input.timestamp || new Date().toISOString();

// ============================================================================
// MARKET-SPECIFIC VALIDATION (when domain = MARKET)
// ============================================================================

const validationWarnings = [];

if (domain === "MARKET") {
  if (!domaindata.ticker) {
    validationWarnings.push("MARKET domain: 'ticker' field missing from domaindata. Agents will operate with reduced context.");
  }
  // Normalize ticker to uppercase
  if (domaindata.ticker) {
    domaindata.ticker = domaindata.ticker.toUpperCase().trim();
  }
  // Ensure numeric fields are numbers
  const numericFields = ['price', 'volume', 'rsi', 'short_interest'];
  for (const field of numericFields) {
    if (domaindata[field] !== undefined && typeof domaindata[field] === 'string') {
      const parsed = parseFloat(domaindata[field]);
      if (!isNaN(parsed)) domaindata[field] = parsed;
    }
  }
}

// ============================================================================
// OUTPUT — Normalized payload for DOMAIN ROUTER
// ============================================================================

return [{
  json: {
    domain: domain,
    query: query.trim(),
    context: context,
    domaindata: domaindata,
    runid: runid,
    timestamp: timestamp,
    _input_validator: {
      version: "6.0",
      original_fields: Object.keys(input),
      backward_compat: input.hunterdata ? "hunterdata → domaindata" : "none",
      warnings: validationWarnings,
      query_length: query.trim().length,
      domaindata_fields: Object.keys(domaindata),
      _timestamp: new Date().toISOString()
    }
  }
}];
