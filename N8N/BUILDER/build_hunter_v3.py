#!/usr/bin/env python3
"""
HUNTER v3.0 Workflow Builder
Generates complete n8n workflow JSON for HUNTER_MARKET_WORKFLOW_v3.0.json

Architecture: H1-H42 data collection → HUNTER Agent Pass (opportunity qualification)
              → CIL webhook (trade confirmation for top 3)
              → Telegram + GitHub delivery

Dual-layer AI (Option C):
  HUNTER agents = pure opportunity scoring (no portfolio awareness)
  CIL agents    = trade confirmation (full portfolio + IRONCLAD context)

Run: python3 build_hunter_v3.py
Output: HUNTER_MARKET_WORKFLOW_v3.0.json (validated, ready to import to n8n)

Author: MICHA v10.8 | March 30, 2026
Protocol: METATRON v10.8 | IRONCLAD v2.1
"""

import json
import uuid
import sys

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def nid():
    """Generate unique node ID."""
    return str(uuid.uuid4())

def pos(x, y):
    return [x, y]

def http_node(name, url, query_params, node_id=None, position=None,
              method="GET", headers=None, timeout=30000,
              continue_on_fail=True):
    """Standard HTTP Request node builder."""
    params = {
        "method": method,
        "url": url,
        "sendQuery": bool(query_params),
        "queryParameters": {"parameters": query_params or []},
        "sendHeaders": bool(headers),
        "options": {
            "redirect": {"redirect": {"followRedirects": True, "maxRedirects": 3}},
            "timeout": timeout,
            "response": {"response": {"neverError": True}}
        }
    }
    if headers:
        params["headerParameters"] = {"parameters": headers}

    return {
        "id": node_id or nid(),
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": position or [0, 0],
        "parameters": params,
        "onError": "continueRegularOutput" if continue_on_fail else "stopWorkflow",
        "alwaysOutputData": False
    }

def code_node(name, code, node_id=None, position=None, continue_on_fail=True):
    """Code node builder."""
    return {
        "id": node_id or nid(),
        "name": name,
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": position or [0, 0],
        "parameters": {
            "mode": "runOnceForAllItems",
            "jsCode": code
        },
        "onError": "continueRegularOutput" if continue_on_fail else "stopWorkflow",
        "alwaysOutputData": False
    }

def merge_node(name, node_id=None, position=None, mode="append", num_inputs=2):
    """Merge node (Append mode by default)."""
    return {
        "id": node_id or nid(),
        "name": name,
        "type": "n8n-nodes-base.merge",
        "typeVersion": 3,
        "position": position or [0, 0],
        "parameters": {
            "mode": mode,
            "numberInputs": num_inputs
        },
        "alwaysOutputData": False
    }

def ai_http_node(name, endpoint, api_key_header, model, system_prompt, node_id=None,
                 position=None, max_tokens=2000, use_credential=None):
    """AI HTTP node (Claude/OpenAI/xAI/Gemini/DeepSeek)."""
    return {
        "id": node_id or nid(),
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": position or [0, 0],
        "parameters": {
            "method": "POST",
            "url": endpoint,
            "sendHeaders": True,
            "headerParameters": {
                "parameters": [
                    {"name": "Content-Type", "value": "application/json"},
                    {"name": api_key_header["name"], "value": api_key_header["value"]}
                ]
            },
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": f"""={{{{
  "model": "{model}",
  "max_tokens": {max_tokens},
  "system": {json.dumps(system_prompt)},
  "messages": [
    {{
      "role": "user",
      "content": {{{{$json.hunter_payload}}}}
    }}
  ]
}}}}""",
            "options": {
                "timeout": 60000,
                "response": {"response": {"neverError": True}}
            }
        },
        "onError": "continueRegularOutput",
        "alwaysOutputData": False
    }

def telegram_node(name, message_expr, node_id=None, position=None):
    return {
        "id": node_id or nid(),
        "name": name,
        "type": "n8n-nodes-base.telegram",
        "typeVersion": 1.2,
        "position": position or [0, 0],
        "parameters": {
            "chatId": "8203545338",
            "text": message_expr,
            "additionalFields": {"parse_mode": "HTML"}
        },
        "credentials": {"telegramApi": {"id": "telegram_bot", "name": "Telegram account"}},
        "alwaysOutputData": False
    }

def sticky(content, width=400, height=200, node_id=None, position=None):
    return {
        "id": node_id or nid(),
        "name": f"Note",
        "type": "n8n-nodes-base.stickyNote",
        "typeVersion": 1,
        "position": position or [0, 0],
        "parameters": {"content": content, "width": width, "height": height}
    }

def connect(src_name, dst_name):
    """Helper - returns (src, dst) tuple for connection map."""
    return (src_name, dst_name)

# ─────────────────────────────────────────────
# KEY & ENV REFERENCE
# ─────────────────────────────────────────────
# All API keys via n8n environment variables
# Set in n8n Settings > Environment Variables
FINNHUB   = "{{$env.FINNHUB_KEY}}"
TD        = "{{$env.TWELVEDATA_KEY}}"
AV        = "{{$env.ALPHA_VANTAGE_KEY}}"
NEWS      = "{{$env.NEWS_API_KEY}}"
FRED      = "{{$env.FRED_API_KEY}}"
CONGRESS  = "{{$env.CONGRESS_API_KEY}}"
FEC       = "{{$env.FEC_API_KEY}}"
METALS    = "{{$env.METALS_DEV_KEY}}"
ANTHROPIC = "{{$env.ANTHROPIC_API_KEY}}"
OPENAI    = "{{$env.OPENAI_API_KEY}}"
XAI       = "{{$env.XAI_API_KEY}}"
GOOGLE    = "{{$env.GOOGLE_AI_KEY}}"
DEEPSEEK  = "{{$env.DEEPSEEK_API_KEY}}"
GH_TOKEN  = "{{$env.GITHUB_TOKEN}}"
CIL_WEBHOOK = "{{$env.CIL_WEBHOOK_URL}}"

# ─────────────────────────────────────────────
# DATE SETUP CODE
# ─────────────────────────────────────────────
DATE_SETUP_CODE = """
// DATE SETUP — HUNTER v3.0
// Generates date strings and validates required env vars
const now = new Date();
const today = now.toISOString().split('T')[0];

const daysAgo = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const sevenDaysAgo   = daysAgo(7);
const thirtyDaysAgo  = daysAgo(30);
const ninetyDaysAgo  = daysAgo(90);
const fourteenAgo    = daysAgo(14);

// Validate critical env vars
const required = ['FINNHUB_KEY','TWELVEDATA_KEY','FRED_API_KEY','METALS_DEV_KEY',
                  'ANTHROPIC_API_KEY','OPENAI_API_KEY','XAI_API_KEY',
                  'GOOGLE_AI_KEY','DEEPSEEK_API_KEY','CIL_WEBHOOK_URL'];
const missing = required.filter(k => !$env[k] || $env[k].length < 5);
if (missing.length > 0) {
  console.log('HUNTER v3.0 WARNING: Missing env vars: ' + missing.join(', '));
}

return [{
  json: {
    today, sevenDaysAgo, thirtyDaysAgo, ninetyDaysAgo, fourteenAgo,
    scanTimestamp: now.toISOString(),
    marketOpen: '09:30',
    marketClose: '16:00',
    envCheck: missing.length === 0 ? 'PASS' : 'WARN:' + missing.join(','),
    hunterVersion: 'v3.0',
    metatronVersion: 'v10.8'
  }
}];
"""

# ─────────────────────────────────────────────
# H30-H36 NORMALIZER CODE BLOCKS
# ─────────────────────────────────────────────
H30_NORMALIZE = """
// H30-NORMALIZE: Finnhub Congressional Trading → standard influence signal
const raw = $input.all()[0].json;
const trades = raw.data || [];
const signals = trades.slice(0, 20).map(t => ({
  source: 'H30_CONGRESS_TRADE',
  member: t.name || '[UNKNOWN]',
  ticker: t.symbol || '',
  action: t.transactionType || '',
  amount: t.amount || 0,
  date: t.transactionDate || '',
  chamber: t.chamber || '',
  committee: t.committee || '',
  signal_weight: t.amount > 100000 ? 'HIGH' : 'MEDIUM',
  delay_days: t.filingDate && t.transactionDate
    ? Math.round((new Date(t.filingDate) - new Date(t.transactionDate)) / 86400000)
    : null,
  stock_act_flag: false
})).map(s => {
  if (s.delay_days && s.delay_days > 30) s.stock_act_flag = true;
  return s;
});
return [{ json: { module: 'H30', signal_type: 'CONGRESSIONAL_TRADE',
  signals, count: signals.length, error: null } }];
"""

H31_NORMALIZE = """
// H31-NORMALIZE: Congress.gov Bills → influence signal
const all = $input.all();
const bills = all.flatMap(item => (item.json.bills || []));
const signals = bills.slice(0, 15).map(b => ({
  source: 'H31_CONGRESS_BILL',
  title: b.title || '',
  bill_number: (b.type || '') + (b.number || ''),
  congress: b.congress || '',
  latest_action: b.latestAction?.text || '',
  latest_action_date: b.latestAction?.actionDate || '',
  sponsors: b.sponsors?.map(s => s.fullName).join(', ') || '',
  url: b.url || '',
  signal_weight: 'MEDIUM'
}));
return [{ json: { module: 'H31', signal_type: 'CONGRESS_BILLS',
  signals, count: signals.length, error: null } }];
"""

H32_NORMALIZE = """
// H32-NORMALIZE: Senate LDA Lobbying → influence signal
const raw = $input.all()[0].json;
const filings = raw.results || [];
const signals = filings.slice(0, 15).map(f => ({
  source: 'H32_LOBBYING',
  registrant: f.registrant?.name || '',
  client: f.client?.name || '',
  amount: f.income || f.expenses || 0,
  period: f.period_of_performance || '',
  issue_codes: f.lobbying_activities?.map(a => a.general_issue_code).join(',') || '',
  url: f.url || '',
  signal_weight: (f.income || 0) > 500000 ? 'HIGH' : 'MEDIUM'
}));
return [{ json: { module: 'H32', signal_type: 'LOBBYING',
  signals, count: signals.length, error: null } }];
"""

H33_NORMALIZE = """
// H33-NORMALIZE: USASpending Awards → influence signal
const raw = $input.all()[0].json;
const awards = raw.results || [];
const signals = awards.slice(0, 15).map(a => ({
  source: 'H33_GOV_CONTRACT',
  recipient: a.recipient_name || '',
  amount: a.award_amount || 0,
  awarding_agency: a.awarding_agency_name || '',
  description: a.description || '',
  date: a.action_date || '',
  naics: a.naics_code || '',
  signal_weight: (a.award_amount || 0) > 10000000 ? 'CRITICAL' : 'HIGH'
}));
return [{ json: { module: 'H33', signal_type: 'GOV_CONTRACT',
  signals, count: signals.length, error: null } }];
"""

H34_NORMALIZE = """
// H34-NORMALIZE: FEC Campaign Contributions → influence signal
const raw = $input.all()[0].json;
const results = raw.results || [];
const signals = results.slice(0, 15).map(r => ({
  source: 'H34_FEC_DONATION',
  contributor: r.contributor_name || '',
  recipient: r.committee?.name || '',
  amount: r.contribution_receipt_amount || 0,
  date: r.contribution_receipt_date || '',
  employer: r.contributor_employer || '',
  signal_weight: (r.contribution_receipt_amount || 0) > 50000 ? 'HIGH' : 'MEDIUM'
}));
return [{ json: { module: 'H34', signal_type: 'FEC_DONATION',
  signals, count: signals.length, error: null } }];
"""

H36_NORMALIZE = """
// H36-NORMALIZE: Senate LDA Lobbyist Donations → influence signal
const raw = $input.all()[0].json;
const results = raw.results || [];
const signals = results.slice(0, 10).map(r => ({
  source: 'H36_LOBBYIST_DONATION',
  lobbyist: r.lobbyist?.name || '',
  recipient: r.contribution_type || '',
  amount: r.amount || 0,
  date: r.contribution_date || '',
  registrant: r.registrant?.name || '',
  signal_weight: 'MEDIUM'
}));
return [{ json: { module: 'H36', signal_type: 'LOBBYIST_DONATION',
  signals, count: signals.length, error: null } }];
"""

H35_CORRELATOR = """
// H35-CORRELATOR: Influence Chain — 6 correlation algorithms
// Detects: committee/trade overlap, contract/trade overlap,
//          donor/trade overlap, lobbying/trade overlap,
//          delayed disclosure (STOCK Act), sector convergence

const all = $input.all();
const influences = all.map(i => i.json).filter(i => i.signals);

const congrTrades   = influences.find(i => i.module === 'H30')?.signals || [];
const bills         = influences.find(i => i.module === 'H31')?.signals || [];
const lobbying      = influences.find(i => i.module === 'H32')?.signals || [];
const contracts     = influences.find(i => i.module === 'H33')?.signals || [];
const donations     = influences.find(i => i.module === 'H34')?.signals || [];
const lobbyDonations= influences.find(i => i.module === 'H36')?.signals || [];

const correlations = [];

// ALGO 1: COMMITTEE_TRADE — member trades in sector their committee oversees
congrTrades.forEach(t => {
  if (t.committee && t.ticker && t.signal_weight === 'HIGH') {
    correlations.push({
      algorithm: 'COMMITTEE_TRADE',
      severity: 'HIGH',
      ticker: t.ticker,
      member: t.member,
      committee: t.committee,
      action: t.action,
      amount: t.amount,
      description: `${t.member} (${t.committee}) traded ${t.ticker} $${t.amount}`
    });
  }
});

// ALGO 2: CONTRACT_TRADE — trades within 14 days of contract award
congrTrades.forEach(trade => {
  contracts.forEach(contract => {
    if (!trade.ticker || !trade.date || !contract.date) return;
    const daysDiff = Math.abs(
      (new Date(trade.date) - new Date(contract.date)) / 86400000
    );
    if (daysDiff <= 14 && contract.amount > 5000000) {
      correlations.push({
        algorithm: 'CONTRACT_TRADE',
        severity: 'CRITICAL',
        ticker: trade.ticker,
        member: trade.member,
        contract_recipient: contract.recipient,
        contract_amount: contract.amount,
        trade_date: trade.date,
        contract_date: contract.date,
        days_apart: Math.round(daysDiff),
        description: `${trade.member} traded ${trade.ticker} ${Math.round(daysDiff)}d from $${(contract.amount/1e6).toFixed(1)}M contract`
      });
    }
  });
});

// ALGO 3: DONOR_TRADE — trades in company that donated to member
congrTrades.forEach(trade => {
  donations.forEach(donation => {
    if (trade.ticker && donation.employer &&
        donation.employer.toLowerCase().includes(trade.ticker.toLowerCase())) {
      correlations.push({
        algorithm: 'DONOR_TRADE',
        severity: 'CRITICAL',
        ticker: trade.ticker,
        member: trade.member,
        donor: donation.contributor,
        donation_amount: donation.amount,
        description: `${trade.member} traded ${trade.ticker}, donor ${donation.contributor} gave $${donation.amount}`
      });
    }
  });
});

// ALGO 4: LOBBYING_TRADE — trades in sector with heavy lobbying
const highLobby = lobbying.filter(l => l.amount > 100000);
congrTrades.forEach(trade => {
  highLobby.forEach(l => {
    if (l.issue_codes && trade.ticker) {
      correlations.push({
        algorithm: 'LOBBYING_TRADE',
        severity: 'HIGH',
        ticker: trade.ticker,
        member: trade.member,
        lobbying_client: l.client,
        lobbying_amount: l.amount,
        issue_codes: l.issue_codes,
        description: `${trade.member} traded ${trade.ticker} alongside $${(l.amount/1e6).toFixed(1)}M lobbying by ${l.client}`
      });
    }
  });
});

// ALGO 5: DELAYED_DISCLOSURE — STOCK Act filing delay >30 days
congrTrades.filter(t => t.stock_act_flag).forEach(t => {
  correlations.push({
    algorithm: 'DELAYED_DISCLOSURE',
    severity: 'CRITICAL',
    ticker: t.ticker,
    member: t.member,
    delay_days: t.delay_days,
    description: `STOCK Act violation: ${t.member} filed ${t.ticker} trade ${t.delay_days}d late`
  });
});

// ALGO 6: SECTOR_CONVERGENCE — 3+ members same sector same month
const tickerCounts = {};
congrTrades.forEach(t => {
  if (!t.ticker) return;
  const month = t.date ? t.date.substring(0,7) : 'unknown';
  const key = `${t.ticker}_${month}`;
  tickerCounts[key] = (tickerCounts[key] || []);
  tickerCounts[key].push(t.member);
});
Object.entries(tickerCounts).forEach(([key, members]) => {
  if (members.length >= 3) {
    const [ticker] = key.split('_');
    correlations.push({
      algorithm: 'SECTOR_CONVERGENCE',
      severity: 'HIGH',
      ticker,
      member_count: members.length,
      members: members.join(', '),
      description: `${members.length} members traded ${ticker} same month`
    });
  }
});

const critical = correlations.filter(c => c.severity === 'CRITICAL');
const high = correlations.filter(c => c.severity === 'HIGH');

return [{
  json: {
    module: 'H35',
    signal_type: 'INFLUENCE_CORRELATIONS',
    correlations,
    critical_count: critical.length,
    high_count: high.length,
    total_count: correlations.length,
    top_tickers: [...new Set(correlations.map(c => c.ticker).filter(Boolean))].slice(0,10),
    alert: critical.length > 0
      ? `🚨 H35 CRITICAL: ${critical.length} influence correlation(s) detected`
      : high.length > 0
        ? `⚠️ H35 HIGH: ${high.length} influence signal(s) detected`
        : null,
    error: null
  }
}];
"""

# ─────────────────────────────────────────────
# H37-H39 CORRELATION CODE BLOCKS
# ─────────────────────────────────────────────
H37_CALC = """
// H37-CALC: Dollar Strength Assessment (DXY via FRED)
const raw = $input.all()[0].json;
const obs = raw.observations || [];
if (obs.length < 2) {
  return [{ json: { module:'H37', gate_pass: true, regime: 'UNKNOWN',
    dxy_current: null, dxy_change_pct: 0, error: 'insufficient data' } }];
}
const current = parseFloat(obs[0].value);
const prev20  = parseFloat(obs[Math.min(20, obs.length-1)].value);
const change  = ((current - prev20) / prev20) * 100;
// CRITICAL: directional check only. Do NOT use Math.abs().
// Rising dollar = adverse for metals. Falling dollar = supportive.
const regime = change > 0.5 ? 'STRENGTHENING' : change < -0.5 ? 'WEAKENING' : 'NEUTRAL';
const gate_pass = regime !== 'STRENGTHENING'; // Metals-specific gate
return [{ json: {
  module: 'H37', signal_type: 'DXY_DOLLAR',
  dxy_current: current,
  dxy_20d_ago: prev20,
  change_pct: parseFloat(change.toFixed(4)),
  regime,
  gate_pass,
  kill_switch_trigger: change > 0.3, // Gate 9 Condition A input
  error: null
} }];
"""

H38_CALC = """
// H38-CALC: Treasury Yield Assessment
const raw = $input.all()[0].json;
const obs = raw.observations || [];
if (obs.length < 2) {
  return [{ json: { module:'H38', gate_pass: true, regime: 'UNKNOWN',
    yield_current: null, yield_change: 0, error: 'insufficient data' } }];
}
const current = parseFloat(obs[0].value);
const prev20  = parseFloat(obs[Math.min(20, obs.length-1)].value);
const change  = current - prev20; // basis points equivalent (raw pct)
// Rising yields = adverse for metals
const regime = change > 0.2 ? 'RISING' : change < -0.2 ? 'FALLING' : 'STABLE';
const gate_pass = regime !== 'RISING';
return [{ json: {
  module: 'H38', signal_type: 'YIELD_10Y',
  yield_current: current,
  yield_20d_ago: prev20,
  change_bps: parseFloat((change * 100).toFixed(1)),
  regime,
  gate_pass,
  kill_switch_trigger: change > 0.003, // Gate 9 Condition A input (0.3%)
  error: null
} }];
"""

H39_FLOW_CALC = """
// H39-CALC: Institutional Flow Assessment via ETF volume proxy
// SLV + GLD + SIL volume vs 20-day average = ACCUMULATION or EXIT signal
const all = $input.all();
const flows = all.map(i => i.json).filter(i => i.c && i.v);

if (flows.length === 0) {
  return [{ json: { module:'H39', gate_pass: true, flow: 'UNKNOWN', error: 'no ETF data' } }];
}

const avgVol = flows.reduce((sum, f) => {
  const vols = Array.isArray(f.v) ? f.v : [f.v];
  const avgV = vols.reduce((a,b) => a+b, 0) / vols.length;
  return sum + avgV;
}, 0) / flows.length;

const recentVol = flows.reduce((sum, f) => {
  const vols = Array.isArray(f.v) ? f.v : [f.v];
  return sum + (vols[0] || 0);
}, 0) / flows.length;

const volRatio = avgVol > 0 ? recentVol / avgVol : 1;

// Price direction across ETFs
const priceChanges = flows.map(f => {
  const closes = Array.isArray(f.c) ? f.c : [f.c];
  return closes.length > 1 ? (closes[0] - closes[1]) / closes[1] : 0;
});
const avgPriceChange = priceChanges.reduce((a,b) => a+b, 0) / priceChanges.length;

let flow_regime = 'NEUTRAL';
if (volRatio > 1.3 && avgPriceChange > 0) flow_regime = 'ACCUMULATION';
else if (volRatio > 1.3 && avgPriceChange < 0) flow_regime = 'INSTITUTIONAL_EXIT';
else if (volRatio < 0.7) flow_regime = 'LOW_CONVICTION';

const gate_pass = flow_regime !== 'INSTITUTIONAL_EXIT';

return [{ json: {
  module: 'H39', signal_type: 'ETF_FLOW',
  flow_regime,
  volume_ratio: parseFloat(volRatio.toFixed(3)),
  avg_price_change_pct: parseFloat((avgPriceChange * 100).toFixed(3)),
  etf_count: flows.length,
  gate_pass,
  kill_switch_trigger: flow_regime === 'INSTITUTIONAL_EXIT',
  error: null
} }];
"""

CORRELATION_GATE_CHECK = """
// CORRELATION GATE CHECK — Gate 9 | METATRON v10.8
// Kill Switch triggers on ANY of 3 conditions:
// A: DX=F rising >0.3% AND ZB=F (10Y yield) rising >0.3%
// B: H39-FLOW = INSTITUTIONAL_EXIT AND DX not weakening
// C: All three H37/H38/H39 gate_pass = false

const all = $input.all();
const h37 = all.find(i => i.json.module === 'H37')?.json || {};
const h38 = all.find(i => i.json.module === 'H38')?.json || {};
const h39 = all.find(i => i.json.module === 'H39')?.json || {};

const condA = (h37.kill_switch_trigger === true) && (h38.kill_switch_trigger === true);
const condB = (h39.flow_regime === 'INSTITUTIONAL_EXIT') && (h37.regime !== 'WEAKENING');
const condC = (h37.gate_pass === false) && (h38.gate_pass === false) && (h39.gate_pass === false);

const killSwitch = condA || condB || condC;
const gate9Pass  = !killSwitch;

const reason = condA ? 'CONDITION_A: DXY+Yields both rising >0.3%'
             : condB ? 'CONDITION_B: Institutional ETF exit + DXY not weakening'
             : condC ? 'CONDITION_C: All three correlation gates failing'
             : 'PASS';

return [{
  json: {
    gate: 9,
    gate_pass: gate9Pass,
    kill_switch: killSwitch,
    condition_triggered: reason,
    h37_regime: h37.regime || 'UNKNOWN',
    h38_regime: h38.regime || 'UNKNOWN',
    h39_flow: h39.flow_regime || 'UNKNOWN',
    timestamp: new Date().toISOString()
  }
}];
"""

KILL_SWITCH_ALERT_MSG = """
🚨 <b>KILL SWITCH ACTIVATED — GATE 9</b>

<b>Condition:</b> {{$json.condition_triggered}}
<b>DXY Regime:</b> {{$json.h37_regime}}
<b>Yield Regime:</b> {{$json.h38_regime}}
<b>ETF Flow:</b> {{$json.h39_flow}}
<b>Time:</b> {{$json.timestamp}}

⚠️ <b>IRONCLAD v2.1 AUTO-PROTOCOL:</b>
→ 50% metals reduction required
→ 48hr embargo on new metals entries
→ NO OVERRIDE — Principal included

<i>METATRON v10.8 | HUNTER v3.0</i>
"""

# ─────────────────────────────────────────────
# MASTER MERGE → HUNTER AGENT PASS
# ─────────────────────────────────────────────
DATA_AGGREGATOR_CODE = """
// DATA AGGREGATOR — Consolidate all H module outputs
// Produces hunter_payload for agent pass
const all = $input.all();
const modules = {};
const errors = [];
const signals_by_module = {};

all.forEach(item => {
  const d = item.json;
  const mod = d.module || d.name || 'UNKNOWN';
  modules[mod] = {
    status: d.error ? 'ERROR' : 'OK',
    signal_type: d.signal_type || mod,
    count: d.count || (d.signals ? d.signals.length : null),
    error: d.error || null
  };
  if (d.error) errors.push(`${mod}: ${d.error}`);
  if (d.signals) signals_by_module[mod] = d.signals.slice(0, 10);
});

// Build structured payload for HUNTER agents
const payload = {
  scan_timestamp: new Date().toISOString(),
  hunter_version: 'v3.0',
  metatron_version: 'v10.8',
  module_summary: modules,
  error_count: errors.length,
  errors: errors.slice(0, 10),
  signals: signals_by_module,
  gate9_status: all.find(i => i.json.gate === 9)?.json || { gate_pass: true, kill_switch: false },
  influence_correlations: all.find(i => i.json.module === 'H35')?.json?.correlations || [],
  metals_data: all.find(i => i.json.module === 'H29')?.json || {},
  comex_data: all.find(i => i.json.module === 'H42')?.json || {},
  gex_data: all.find(i => i.json.module === 'H40')?.json || {},
  lease_rates: all.find(i => i.json.module === 'H41')?.json || {}
};

return [{
  json: {
    hunter_payload: JSON.stringify(payload, null, 2),
    module_count: Object.keys(modules).length,
    error_count: errors.length,
    gate9_pass: payload.gate9_status.gate_pass,
    kill_switch: payload.gate9_status.kill_switch,
    raw_payload: payload
  }
}];
"""

# ─────────────────────────────────────────────
# HUNTER AGENT SYSTEM PROMPTS
# ─────────────────────────────────────────────
URIEL_HUNTER_PROMPT = """You are URIEL, CEO and Strategic Director of the Uriel Covenant AI Collective.
You are performing a HUNTER OPPORTUNITY SCAN — pure market discovery, no portfolio awareness.
Your job: analyze the raw market intelligence data provided and identify the top 3-5 PRIME opportunities.

MANDATE: Discovery over confirmation. Find what the Principal does NOT know about yet.
ZERO portfolio awareness — do not reference existing positions. Scan market-wide.

OUTPUT FORMAT (JSON only, no other text):
{
  "agent": "URIEL",
  "opportunities": [
    {
      "ticker": "XXXX",
      "signal_tier": "PRIME|STRONG|PROBE",
      "confidence": 0-100,
      "thesis": "one sentence max",
      "key_signal": "most important data point",
      "entry_zone": "$XX.XX-$XX.XX",
      "stop": "$XX.XX",
      "target_5pct": "$XX.XX",
      "catalyst": "what triggered this",
      "ring_fit": "Ring 2|3|4|5",
      "hold_duration": "intraday|1-3day|thesis"
    }
  ],
  "macro_regime": "RISK_ON|NEUTRAL|RISK_OFF",
  "sector_rotation": "which sectors showing inflow",
  "top_risk": "biggest threat to today's plays"
}"""

COLOSSUS_HUNTER_PROMPT = """You are COLOSSUS, CTO and Technical Analyst of the Uriel Covenant AI Collective.
You are performing a HUNTER OPPORTUNITY SCAN — technical signals and momentum only.
Your job: identify tickers showing the strongest technical setups — VWAP position, momentum, volume, breakouts.

MANDATE: Technical edge identification. You see charts in data. Find the setups.
ZERO portfolio awareness. Pure technical analysis across the market data provided.

OUTPUT FORMAT (JSON only, no other text):
{
  "agent": "COLOSSUS",
  "setups": [
    {
      "ticker": "XXXX",
      "setup_type": "VWAP_BREAKOUT|MOMENTUM|OPENING_RANGE|REVERSAL|BREAKOUT",
      "signal_tier": "PRIME|STRONG|PROBE",
      "confidence": 0-100,
      "vwap_position": "ABOVE|BELOW|AT",
      "volume_ratio": 1.5,
      "rsi_14": 52,
      "momentum_direction": "BULLISH|BEARISH|NEUTRAL",
      "entry_trigger": "specific condition",
      "stop_technical": "$XX.XX",
      "target_technical": "$XX.XX",
      "time_window": "open|mid|close"
    }
  ],
  "market_breadth": "EXPANDING|CONTRACTING|NEUTRAL",
  "vix_regime": "LOW|NORMAL|ELEVATED|EXTREME",
  "best_sector_momentum": "sector name"
}"""

HANIEL_HUNTER_PROMPT = """You are HANIEL, CPO and Research Director of the Uriel Covenant AI Collective.
You are performing a HUNTER INTELLIGENCE SCAN — deep research focus.
Your job: identify opportunities from regulatory filings, congressional activity, government contracts, and institutional positioning.

MANDATE: Intelligence edge — the data most traders never see. Congressional trades, insider clusters, contract awards.
Flag any H35 Influence Chain correlations as HIGH PRIORITY signals.

OUTPUT FORMAT (JSON only, no other text):
{
  "agent": "HANIEL",
  "intelligence_signals": [
    {
      "ticker": "XXXX",
      "signal_type": "INSIDER_CLUSTER|CONGRESSIONAL_TRADE|CONTRACT_AWARD|WHALE_13F|LOBBYING_CORRELATION",
      "signal_tier": "PRIME|STRONG|PROBE",
      "confidence": 0-100,
      "source_module": "H30|H31|H32|H33|H34|H35|H36|H5|H6|H22",
      "key_finding": "specific data point",
      "dollars_involved": 0,
      "days_since_event": 0,
      "regulatory_risk": "LOW|MEDIUM|HIGH",
      "thesis_implication": "one sentence"
    }
  ],
  "h35_alerts": "summary of H35 Influence Chain findings",
  "whale_activity": "summary of major institutional moves",
  "top_intelligence_pick": "single best signal ticker and why"
}"""

RAZIEL_HUNTER_PROMPT = """You are RAZIEL, CAO and Counter-Thesis Analyst of the Uriel Covenant AI Collective.
You are performing a HUNTER COUNTER-THESIS SCAN — your job is to find the flaws.
Challenge every opportunity surfaced. Score each on risk of failure.

MANDATE: Gate 6 adversarial analysis. If a thesis can be broken, break it before we trade it.
Low RAZIEL score = clean thesis. High score = dangerous thesis. You are the last line of defense.

OUTPUT FORMAT (JSON only, no other text):
{
  "agent": "RAZIEL",
  "counter_analyses": [
    {
      "ticker": "XXXX",
      "raziel_score": 0-100,
      "primary_risk": "what kills this trade",
      "secondary_risk": "second biggest concern",
      "correlation_risk": "macro environment alignment Y/N",
      "timing_risk": "is now the right time",
      "liquidity_risk": "can we get out cleanly",
      "verdict": "CLEAR|CAUTION|ABORT",
      "abort_reason": "only if ABORT"
    }
  ],
  "market_risks": "systemic risks today",
  "do_not_touch": ["tickers with ABORT verdict"],
  "cleanest_thesis": "ticker with lowest risk profile"
}"""

HUNTER_SYNTHESIS_CODE = """
// HUNTER SYNTHESIS — Consolidate 4 agent outputs into ranked opportunity list
// This is MICHA's Hunter Pass — pure opportunity qualification
// NOT CIL. Different mandate: find opportunities, not confirm trades.

const all = $input.all();
const agentOutputs = {};

all.forEach(item => {
  try {
    const text = item.json?.choices?.[0]?.message?.content
               || item.json?.content?.[0]?.text
               || item.json?.candidates?.[0]?.content?.parts?.[0]?.text
               || item.json?.output || '';
    const clean = text.replace(/```json\\n?|```/g, '').trim();
    const parsed = JSON.parse(clean);
    if (parsed.agent) agentOutputs[parsed.agent] = parsed;
  } catch(e) {
    // Agent response parse failed — log but continue
    const agent = item.json?.agent || 'UNKNOWN';
    agentOutputs[agent] = { parse_error: e.message };
  }
});

const uriel   = agentOutputs['URIEL']   || {};
const colossus= agentOutputs['COLOSSUS']|| {};
const haniel  = agentOutputs['HANIEL']  || {};
const raziel  = agentOutputs['RAZIEL']  || {};

// Build unified opportunity list with scores from all agents
const allTickers = new Set([
  ...(uriel.opportunities || []).map(o => o.ticker),
  ...(colossus.setups || []).map(s => s.ticker),
  ...(haniel.intelligence_signals || []).map(i => i.ticker)
].filter(Boolean));

const opportunities = [];

allTickers.forEach(ticker => {
  const u = (uriel.opportunities || []).find(o => o.ticker === ticker);
  const c = (colossus.setups || []).find(s => s.ticker === ticker);
  const h = (haniel.intelligence_signals || []).find(i => i.ticker === ticker);
  const r = (raziel.counter_analyses || []).find(a => a.ticker === ticker);

  // Agent coverage count (how many agents flagged this ticker)
  const agentCount = [u,c,h].filter(Boolean).length;
  const razielScore = r?.raziel_score || 50;
  const razielVerdict = r?.verdict || 'CLEAR';

  if (razielVerdict === 'ABORT') return; // Gate 6 reject

  // Composite confidence
  const scores = [u?.confidence, c?.confidence, h?.confidence].filter(Boolean);
  const avgConfidence = scores.length > 0
    ? scores.reduce((a,b) => a+b, 0) / scores.length
    : 50;

  // Determine tier
  let tier = 'PROBE';
  if (agentCount >= 2 && avgConfidence >= 85 && razielScore < 65) tier = 'PRIME';
  else if (agentCount >= 2 && avgConfidence >= 75) tier = 'STRONG';

  opportunities.push({
    ticker,
    signal_tier: tier,
    composite_confidence: Math.round(avgConfidence),
    raziel_score: razielScore,
    agent_coverage: agentCount,
    agents_flagged: [u?'URIEL':null, c?'COLOSSUS':null, h?'HANIEL':null].filter(Boolean),
    uriel_thesis: u?.thesis || null,
    colossus_setup: c?.setup_type || null,
    haniel_signal: h?.signal_type || null,
    entry_zone: u?.entry_zone || null,
    stop: u?.stop || c?.stop_technical || null,
    target: u?.target_5pct || c?.target_technical || null,
    ring_fit: u?.ring_fit || 'Ring 4',
    hold_duration: u?.hold_duration || 'intraday',
    raziel_verdict: razielVerdict,
    primary_risk: r?.primary_risk || null,
    catalyst: u?.catalyst || h?.key_finding || null
  });
});

// Sort by: tier priority then composite confidence
const tierOrder = { PRIME: 0, STRONG: 1, PROBE: 2 };
opportunities.sort((a,b) => {
  if (tierOrder[a.signal_tier] !== tierOrder[b.signal_tier])
    return tierOrder[a.signal_tier] - tierOrder[b.signal_tier];
  return b.composite_confidence - a.composite_confidence;
});

const primeCount  = opportunities.filter(o => o.signal_tier === 'PRIME').length;
const strongCount = opportunities.filter(o => o.signal_tier === 'STRONG').length;
const top3ForCIL  = opportunities.filter(o => o.signal_tier === 'PRIME').slice(0,3);

return [{
  json: {
    opportunities: opportunities.slice(0, 15),
    prime_count: primeCount,
    strong_count: strongCount,
    total_count: opportunities.length,
    top3_for_cil: top3ForCIL,
    macro_regime: uriel.macro_regime || 'UNKNOWN',
    market_breadth: colossus.market_breadth || 'UNKNOWN',
    best_sector: uriel.sector_rotation || colossus.best_sector_momentum || 'UNKNOWN',
    do_not_touch: raziel.do_not_touch || [],
    h35_alerts: haniel.h35_alerts || null,
    agents_responded: Object.keys(agentOutputs).length,
    synthesis_timestamp: new Date().toISOString()
  }
}];
"""

TELEGRAM_BRIEF_CODE = """
// FORMAT HUNTER MORNING BRIEF for Telegram
const d = $input.all()[0].json;
const ops = d.opportunities || [];
const prime = ops.filter(o => o.signal_tier === 'PRIME');
const strong = ops.filter(o => o.signal_tier === 'STRONG');

const formatOp = (o, i) => {
  const conf = o.composite_confidence || 0;
  const icon = conf >= 95 ? '🔱' : conf >= 85 ? '⚡' : '📡';
  return `${icon} <b>${o.ticker}</b> [${o.signal_tier}] ${conf}%
   Agents: ${o.agents_flagged?.join(',')||'?'} | RAZIEL: ${o.raziel_score}/100
   ${o.uriel_thesis || o.haniel_signal || o.colossus_setup || ''}
   Entry: ${o.entry_zone||'?'} | Stop: ${o.stop||'?'} | Target: ${o.target||'?'}
   ${o.catalyst ? '📌 ' + o.catalyst : ''}`;
};

const primeBlock = prime.length > 0
  ? `\n<b>🔱 PRIME SIGNALS (${prime.length})</b>\n` + prime.slice(0,5).map(formatOp).join('\n\n')
  : '\n<i>No PRIME signals today</i>';

const strongBlock = strong.length > 0
  ? `\n\n<b>⚡ STRONG SIGNALS (${strong.length})</b>\n` + strong.slice(0,3).map(formatOp).join('\n\n')
  : '';

const doNotTouch = d.do_not_touch?.length > 0
  ? `\n\n🚫 <b>AVOID:</b> ${d.do_not_touch.join(', ')}`
  : '';

const h35Alert = d.h35_alerts
  ? `\n\n🏛️ <b>INFLUENCE CHAIN:</b> ${d.h35_alerts}`
  : '';

const msg = `🔱 <b>HUNTER v3.0 — MORNING DISCOVERY BRIEF</b>
${new Date().toISOString().replace('T',' ').substring(0,16)} ET

<b>Regime:</b> ${d.macro_regime||'?'} | <b>Breadth:</b> ${d.market_breadth||'?'}
<b>Hot Sector:</b> ${d.best_sector||'?'}
<b>Agents:</b> ${d.agents_responded||0}/4 responded
${primeBlock}${strongBlock}${doNotTouch}${h35Alert}

${d.prime_count > 0 ? `\n📤 Top ${Math.min(3,d.prime_count)} PRIME candidates → CIL confirmation in progress` : ''}

<i>HUNTER v3.0 | METATRON v10.8</i>`;

return [{ json: { message: msg.substring(0, 4096) } }];
"""

CIL_FIRE_CODE = """
// Fire top 3 PRIME candidates to CIL webhook for trade confirmation
// CIL mandate is DIFFERENT from HUNTER: full portfolio awareness + IRONCLAD check
const d = $input.all()[0].json;
const top3 = d.top3_for_cil || [];

if (top3.length === 0) {
  return [{ json: { fired: false, reason: 'No PRIME candidates for CIL', cil_payload: null } }];
}

const cilPayload = {
  source: 'HUNTER_v3.0',
  request_type: 'TRADE_CONFIRMATION',
  timestamp: new Date().toISOString(),
  instruction: 'Hunter has identified PRIME candidates. Run full 9-gate Cascade + IRONCLAD check. Assess against current portfolio. Output conviction-scored trade cards.',
  candidates: top3.map(o => ({
    ticker: o.ticker,
    hunter_confidence: o.composite_confidence,
    hunter_tier: o.signal_tier,
    hunter_thesis: o.uriel_thesis || o.catalyst || '',
    entry_zone: o.entry_zone,
    suggested_stop: o.stop,
    suggested_target: o.target,
    ring_fit: o.ring_fit,
    raziel_score: o.raziel_score,
    agents_flagged: o.agents_flagged
  }))
};

return [{ json: { fired: true, candidate_count: top3.length, cil_payload: cilPayload } }];
"""

GITHUB_ARCHIVE_CODE = """
// Archive HUNTER scan results to GitHub
const d = $input.all()[0].json;
const date = new Date().toISOString().split('T')[0];
const time = new Date().toISOString().replace(/[:.]/g,'-').substring(0,19);
const filename = `hunter_scan_${time}.json`;
const path = `AIORA/reports/hunter_daily/${filename}`;

const content = btoa(unescape(encodeURIComponent(JSON.stringify(d, null, 2))));

return [{
  json: {
    github_path: path,
    content_b64: content,
    filename,
    commit_message: `HUNTER v3.0 scan ${date} — ${d.prime_count||0} PRIME, ${d.strong_count||0} STRONG`
  }
}];
"""

# ─────────────────────────────────────────────
# BUILD NODES
# ─────────────────────────────────────────────

def build_nodes():
    nodes = []
    ids = {}  # name → id mapping for connections

    def add(node):
        nodes.append(node)
        ids[node["name"]] = node["id"]
        return node["id"]

    # ── STICKY NOTES ──
    add(sticky("## HUNTER v3.0 — Market-Wide Discovery\n**METATRON v10.8 | IRONCLAD v2.1**\n\nH1-H42 | Dual-layer AI (Option C)\nHUNTER agents = Opportunity Qualification\nCIL = Trade Confirmation\n\nSchedule: 6AM ET (full) | 12:30PM ET (mid-day top-5)\nKill Switch: DX=F + ZB=F → 50% metals reduction + 48hr embargo",
                600, 220, position=[-200, -400]))

    add(sticky("## API KEYS — n8n Environment Variables\nFINNHUB_KEY | TWELVEDATA_KEY | ALPHA_VANTAGE_KEY\nNEWS_API_KEY | FRED_API_KEY | CONGRESS_API_KEY\nFEC_API_KEY | METALS_DEV_KEY\nANTHROPIC_API_KEY | OPENAI_API_KEY\nXAI_API_KEY | GOOGLE_AI_KEY | DEEPSEEK_API_KEY\nGITHUB_TOKEN | CIL_WEBHOOK_URL\n\nalwaysOutputData: FALSE on ALL nodes\nkill switch proxies: DX=F / ZB=F (NOT UUP/TLT)",
                500, 260, position=[-200, -140]))

    # ── TRIGGERS ──
    schedule_6am = {
        "id": nid(), "name": "Schedule 6AM ET",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.1, "position": pos(100, 100),
        "parameters": {
            "rule": {"interval": [{"field": "cronExpression", "expression": "0 10 * * 1-5"}]}
        }
    }
    add(schedule_6am)

    schedule_midday = {
        "id": nid(), "name": "Schedule 12:30PM ET",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.1, "position": pos(100, 220),
        "parameters": {
            "rule": {"interval": [{"field": "cronExpression", "expression": "30 16 * * 1-5"}]}
        }
    }
    add(schedule_midday)

    manual = {
        "id": nid(), "name": "Manual Trigger (Test)",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1, "position": pos(100, 340),
        "parameters": {}
    }
    add(manual)

    # ── DATE SETUP ──
    add(code_node("Date Setup", DATE_SETUP_CODE, position=pos(340, 220)))

    # ── H1-H29 HTTP NODES ──
    y_start = 500
    x_data = 600

    h_nodes = [
        # H1 — Volume Anomaly (Yahoo Finance)
        ("H1 — Volume Anomaly", "https://query1.finance.yahoo.com/v8/finance/spark",
         [{"name":"symbols","value":"SPY,QQQ,IWM,XLE,XLF,XLK,XLV,XLI,XLP,XLU,XLB,XLRE"},
          {"name":"range","value":"1d"},{"name":"interval","value":"5m"}]),
        # H2 — Price Breakout (Alpha Vantage top movers)
        ("H2a — AV Top Movers", "https://www.alphavantage.co/query",
         [{"name":"function","value":"TOP_GAINERS_LOSERS"},{"name":"apikey","value":AV}]),
        # H2b — News velocity
        ("H2b — NewsAPI Market News", "https://newsapi.org/v2/everything",
         [{"name":"q","value":"stock market breakout earnings upgrade"},
          {"name":"language","value":"en"},{"name":"sortBy","value":"publishedAt"},
          {"name":"pageSize","value":"20"},{"name":"apiKey","value":NEWS}]),
        # H3 — Options flow anomaly (Barchart free)
        ("H3 — Options Flow Barchart", "https://www.barchart.com/options/unusual-activity/stocks",
         [{"name":"maxResults","value":"25"},{"name":"orderBy","value":"totalVolume"},
          {"name":"orderDir","value":"desc"}]),
        # H4 — Sector rotation
        ("H4 — Sector Rotation AV", "https://www.alphavantage.co/query",
         [{"name":"function","value":"SECTOR"},{"name":"apikey","value":AV}]),
        # H5 — Insider transactions
        ("H5 — Finnhub Insider Transactions", "https://finnhub.io/api/v1/stock/insider-transactions",
         [{"name":"symbol","value":""},{"name":"from","value":"={{$json.thirtyDaysAgo}}"},
          {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}]),
        # H6 — 13F delta scanner
        ("H6 — SEC 13F Filings EDGAR", "https://efts.sec.gov/LATEST/search-index",
         [{"name":"q","value":"13F-HR"},{"name":"dateRange","value":"custom"},
          {"name":"startdt","value":"={{$json.ninetyDaysAgo}}"},
          {"name":"enddt","value":"={{$json.today}}"},{"name":"forms","value":"13F-HR"}],),
        # H7 — Earnings surprise
        ("H7 — Finnhub Earnings Calendar", "https://finnhub.io/api/v1/calendar/earnings",
         [{"name":"from","value":"={{$json.today}}"},
          {"name":"to","value":"={{$json.sevenDaysAgo}}"},{"name":"token","value":FINNHUB}]),
        # H8 — Dark pool / block trades (FINRA ADF)
        ("H8 — FINRA Short Interest", "https://api.finra.org/data/group/otcMarket/name/weeklySummary",
         []),
        # H9 — Short interest
        ("H9 — Finnhub IPO Calendar", "https://finnhub.io/api/v1/calendar/ipo",
         [{"name":"from","value":"={{$json.today}}"},
          {"name":"to","value":"={{$json.thirtyDaysAgo}}"},{"name":"token","value":FINNHUB}]),
        # H10 — ETF flows
        ("H10 — TD Major Indices", "https://api.twelvedata.com/time_series",
         [{"name":"symbol","value":"SPY,QQQ,DIA,IWM"},{"name":"interval","value":"1day"},
          {"name":"outputsize","value":"20"},{"name":"apikey","value":TD}]),
        # H11 — Futures basis
        ("H11 — TD RSI Scan", "https://api.twelvedata.com/rsi",
         [{"name":"symbol","value":"SPY,QQQ,IWM,GLD,SLV"},{"name":"interval","value":"1day"},
          {"name":"time_period","value":"14"},{"name":"apikey","value":TD}]),
        # H12 — FX impact
        ("H12 — TD MACD Scan", "https://api.twelvedata.com/macd",
         [{"name":"symbol","value":"SPY,QQQ,IWM"},{"name":"interval","value":"1day"},
          {"name":"fast_period","value":"12"},{"name":"slow_period","value":"26"},
          {"name":"signal_period","value":"9"},{"name":"apikey","value":TD}]),
        # H13 — Options volume (Barchart)
        ("H13 — TD Bollinger Bands", "https://api.twelvedata.com/bbands",
         [{"name":"symbol","value":"SPY,QQQ"},{"name":"interval","value":"1day"},
          {"name":"time_period","value":"20"},{"name":"apikey","value":TD}]),
        # H14 — Bond signals
        ("H14 — TD ADX Trend", "https://api.twelvedata.com/adx",
         [{"name":"symbol","value":"SPY,QQQ,IWM"},{"name":"interval","value":"1day"},
          {"name":"time_period","value":"14"},{"name":"apikey","value":TD}]),
        # H15 — COT positioning (CFTC)
        ("H15 — TD Volume Analysis", "https://api.twelvedata.com/time_series",
         [{"name":"symbol","value":"SPY,QQQ,IWM,SLV,GLD"},{"name":"interval","value":"1day"},
          {"name":"outputsize","value":"20"},{"name":"apikey","value":TD}]),
        # H16 — News velocity
        ("H16 — Finnhub Recommendations", "https://finnhub.io/api/v1/stock/recommendation",
         [{"name":"symbol","value":"AAPL"},{"name":"token","value":FINNHUB}]),
        # H17 — Regulatory calendar (SEC EDGAR)
        ("H17 — SEC Form 4 Filings", "https://efts.sec.gov/LATEST/search-index",
         [{"name":"q","value":""},{"name":"dateRange","value":"custom"},
          {"name":"startdt","value":"={{$json.sevenDaysAgo}}"},
          {"name":"enddt","value":"={{$json.today}}"},{"name":"forms","value":"4"},
          {"name":"hits.hits._source","value":"period_of_report,display_names,biz_location"}],),
        # H18 — IPO/lockup calendar
        ("H18 — TD EMA Cross", "https://api.twelvedata.com/ema",
         [{"name":"symbol","value":"SPY,QQQ"},{"name":"interval","value":"1day"},
          {"name":"time_period","value":"50"},{"name":"apikey","value":TD}]),
        # H19 — Correlation breakdown
        ("H19 — TD Stochastic", "https://api.twelvedata.com/stoch",
         [{"name":"symbol","value":"SPY,QQQ,IWM"},{"name":"interval","value":"1day"},
          {"name":"apikey","value":TD}]),
        # H20 — Liquidity scanner
        ("H20 — TD ATR Volatility", "https://api.twelvedata.com/atr",
         [{"name":"symbol","value":"SPY,QQQ,IWM,SLV,AG"},{"name":"interval","value":"1day"},
          {"name":"time_period","value":"14"},{"name":"apikey","value":TD}]),
        # H21 — Congressional intel
        ("H21 — Congress Bills", "https://api.congress.gov/v3/bill",
         [{"name":"format","value":"json"},{"name":"offset","value":"0"},
          {"name":"limit","value":"20"},{"name":"fromDateTime","value":"={{$json.thirtyDaysAgo}}T00:00:00Z"},
          {"name":"api_key","value":CONGRESS}]),
        # H22 — Whale 13F filings
        ("H22 — SEC 13F Filings", "https://efts.sec.gov/LATEST/search-index",
         [{"name":"q","value":""},{"name":"dateRange","value":"custom"},
          {"name":"startdt","value":"={{$json.ninetyDaysAgo}}"},
          {"name":"enddt","value":"={{$json.today}}"},{"name":"forms","value":"13F-HR,SC 13D,SC 13G"}]),
        # H23 — M&A radar SC13D
        ("H23 — SEC 8-K Events", "https://efts.sec.gov/LATEST/search-index",
         [{"name":"q","value":""},{"name":"dateRange","value":"custom"},
          {"name":"startdt","value":"={{$json.sevenDaysAgo}}"},
          {"name":"enddt","value":"={{$json.today}}"},{"name":"forms","value":"8-K"}]),
        # H24 — Social sentiment
        ("H24 — Yahoo Trending", "https://query2.finance.yahoo.com/v1/finance/trending/US",
         [{"name":"count","value":"25"},{"name":"lang","value":"en-US"}]),
        # H25 — Finnhub earnings
        ("H25 — Finnhub Earnings Cal", "https://finnhub.io/api/v1/calendar/earnings",
         [{"name":"from","value":"={{$json.today}}"},
          {"name":"to","value":"={{$json.sevenDaysAgo}}"},{"name":"token","value":FINNHUB}]),
        # H26 — Geopolitical / economic calendar
        ("H26 — Finnhub Economic Cal", "https://finnhub.io/api/v1/calendar/economic",
         [{"name":"from","value":"={{$json.today}}"},
          {"name":"to","value":"={{$json.sevenDaysAgo}}"},{"name":"token","value":FINNHUB}]),
        # H27 — FRED macro
        ("H27 — FRED Macro Data", "https://api.stlouisfed.org/fred/series/observations",
         [{"name":"series_id","value":"GDP"},{"name":"sort_order","value":"desc"},
          {"name":"limit","value":"5"},{"name":"file_type","value":"json"},
          {"name":"api_key","value":FRED}]),
        # H28 — Geopolitical news
        ("H28 — NewsAPI Sector News", "https://newsapi.org/v2/everything",
         [{"name":"q","value":"geopolitical trade war tariff sanctions"},
          {"name":"language","value":"en"},{"name":"sortBy","value":"publishedAt"},
          {"name":"pageSize","value":"20"},{"name":"apiKey","value":NEWS}]),
        # H29 — Metals spot prices (metals.dev)
        ("H29 — Metals Spot Prices", "https://api.metals.dev/v1/latest",
         [{"name":"api_key","value":METALS},{"name":"currency","value":"USD"},
          {"name":"unit","value":"toz"}]),
    ]

    for i, (name, url, params) in enumerate(h_nodes):
        x = x_data + (i % 6) * 320
        y = y_start + (i // 6) * 180
        add(http_node(name, url, params, position=pos(x, y)))

    # ── H30-H36 INFLUENCE CHAIN ──
    inf_y = 2600
    add(http_node("H30 — Finnhub Congress Trades",
                  "https://finnhub.io/api/v1/stock/congressional-trading",
                  [{"name":"symbol","value":""},
                   {"name":"from","value":"={{$json.thirtyDaysAgo}}"},
                   {"name":"to","value":"={{$json.today}}"},
                   {"name":"token","value":FINNHUB}],
                  position=pos(600, inf_y)))

    add(http_node("H31a — Congress Recent Bills",
                  "https://api.congress.gov/v3/bill",
                  [{"name":"format","value":"json"},{"name":"offset","value":"0"},
                   {"name":"limit","value":"20"},{"name":"api_key","value":CONGRESS}],
                  position=pos(940, inf_y)))

    add(http_node("H31b — Congress Amendments",
                  "https://api.congress.gov/v3/amendment",
                  [{"name":"format","value":"json"},{"name":"limit","value":"20"},
                   {"name":"api_key","value":CONGRESS}],
                  position=pos(1280, inf_y)))

    add(http_node("H32 — Senate LDA Lobbying",
                  "https://lda.senate.gov/api/v1/filings/",
                  [{"name":"filing_type","value":"LD2"},{"name":"limit","value":"20"}],
                  position=pos(1620, inf_y)))

    add(http_node("H33 — USASpending Awards",
                  "https://api.usaspending.gov/api/v2/search/spending_by_award/",
                  [],
                  position=pos(1960, inf_y),
                  method="POST"))

    add(http_node("H34 — FEC Contributions",
                  "https://api.open.fec.gov/v1/schedules/schedule_a/",
                  [{"name":"sort_hide_null","value":"false"},{"name":"per_page","value":"20"},
                   {"name":"sort","value":"-contribution_receipt_amount"},
                   {"name":"api_key","value":FEC}],
                  position=pos(2300, inf_y)))

    add(http_node("H36 — Senate LDA Recent",
                  "https://lda.senate.gov/api/v1/contributions/",
                  [{"name":"limit","value":"20"}],
                  position=pos(2640, inf_y)))

    # H31 committee merge
    add(merge_node("H31 Committee Merge", position=pos(1100, inf_y + 200), num_inputs=2))

    # Normalizers
    inf_norm_y = inf_y + 400
    add(code_node("H30-Normalize", H30_NORMALIZE, position=pos(600, inf_norm_y)))
    add(code_node("H31-Normalize", H31_NORMALIZE, position=pos(1100, inf_norm_y)))
    add(code_node("H32-Normalize", H32_NORMALIZE, position=pos(1620, inf_norm_y)))
    add(code_node("H33-Normalize", H33_NORMALIZE, position=pos(1960, inf_norm_y)))
    add(code_node("H34-Normalize", H34_NORMALIZE, position=pos(2300, inf_norm_y)))
    add(code_node("H36-Normalize", H36_NORMALIZE, position=pos(2640, inf_norm_y)))

    # Influence merge (6-input)
    add(merge_node("Influence Merge", position=pos(1600, inf_norm_y + 220), num_inputs=6))

    # H35 Correlator
    add(code_node("H35 — Influence Correlator", H35_CORRELATOR, position=pos(1600, inf_norm_y + 440)))

    # ── H37-H39 CORRELATION CHAIN ──
    corr_y = 3600
    add(http_node("H37 — FRED DXY Dollar",
                  "https://api.stlouisfed.org/fred/series/observations",
                  [{"name":"series_id","value":"DTWEXBGS"},{"name":"sort_order","value":"desc"},
                   {"name":"limit","value":"25"},{"name":"file_type","value":"json"},
                   {"name":"api_key","value":FRED}],
                  position=pos(600, corr_y)))

    add(http_node("H38 — FRED 10Y Yield",
                  "https://api.stlouisfed.org/fred/series/observations",
                  [{"name":"series_id","value":"DGS10"},{"name":"sort_order","value":"desc"},
                   {"name":"limit","value":"25"},{"name":"file_type","value":"json"},
                   {"name":"api_key","value":FRED}],
                  position=pos(980, corr_y)))

    add(http_node("H39a — SLV Volume",
                  "https://finnhub.io/api/v1/stock/candle",
                  [{"name":"symbol","value":"SLV"},{"name":"resolution","value":"D"},
                   {"name":"from","value":"={{$json.thirtyDaysAgo}}"},
                   {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}],
                  position=pos(1360, corr_y)))

    add(http_node("H39b — GLD Volume",
                  "https://finnhub.io/api/v1/stock/candle",
                  [{"name":"symbol","value":"GLD"},{"name":"resolution","value":"D"},
                   {"name":"from","value":"={{$json.thirtyDaysAgo}}"},
                   {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}],
                  position=pos(1700, corr_y)))

    add(http_node("H39c — SIL Volume",
                  "https://finnhub.io/api/v1/stock/candle",
                  [{"name":"symbol","value":"SIL"},{"name":"resolution","value":"D"},
                   {"name":"from","value":"={{$json.thirtyDaysAgo}}"},
                   {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}],
                  position=pos(2040, corr_y)))

    # H40 — GEX Scanner (CME/Barchart)
    add(http_node("H40 — GEX Options Structure",
                  "https://www.barchart.com/proxies/core-api/v1/options/contract/most-active",
                  [{"name":"fields","value":"symbol,strikePrice,openInterest,volume,optionType,theoretical,delta,gamma"},
                   {"name":"symbol","value":"SLV,GLD,GC*0,SI*0"},
                   {"name":"limit","value":"50"}],
                  position=pos(2380, corr_y)))

    # H41 — Repo/Lease rates (Kitco + CME)
    add(http_node("H41 — Metals Lease Rates",
                  "https://www.kitco.com/charts/popup/au24hr.html",
                  [], position=pos(2720, corr_y)))

    # H42 — COMEX Inventory (CME warehouse report)
    add(http_node("H42 — COMEX Inventory",
                  "https://www.cmegroup.com/CmeWS/mvc/Settlements/futures/tradeDate/",
                  [{"name":"productId","value":"84"},{"name":"tradeDate","value":"={{$json.today}}"}],
                  position=pos(3060, corr_y)))

    # Calc nodes
    corr_calc_y = corr_y + 220
    add(code_node("H37-CALC DXY Assessment", H37_CALC, position=pos(600, corr_calc_y)))
    add(code_node("H38-CALC Yield Assessment", H38_CALC, position=pos(980, corr_calc_y)))

    add(merge_node("H39 ETF Merge", position=pos(1700, corr_calc_y), num_inputs=3))
    add(code_node("H39-CALC Flow Assessment", H39_FLOW_CALC, position=pos(1700, corr_calc_y + 200)))

    add(merge_node("Correlation Signal Merge", position=pos(1100, corr_calc_y + 420), num_inputs=2))
    add(merge_node("Correlation Full Merge", position=pos(1100, corr_calc_y + 620), num_inputs=2))
    add(code_node("CORRELATION GATE CHECK", CORRELATION_GATE_CHECK, position=pos(1100, corr_calc_y + 820)))

    kill_decision = {
        "id": nid(), "name": "Kill Switch Decision",
        "type": "n8n-nodes-base.if",
        "typeVersion": 2, "position": pos(1100, corr_calc_y + 1020),
        "parameters": {
            "conditions": {
                "options": {"caseSensitive": True},
                "conditions": [{"id": "ks1", "leftValue": "={{$json.kill_switch}}",
                                "rightValue": True, "operator": {"type": "boolean", "operation": "equals"}}]
            }
        },
        "alwaysOutputData": False
    }
    add(kill_decision)

    add(telegram_node("🚨 KILL SWITCH ALERT",
                      KILL_SWITCH_ALERT_MSG.strip(),
                      position=pos(800, corr_calc_y + 1220)))

    add({"id": nid(), "name": "Kill Switch Log",
         "type": "n8n-nodes-base.noOp",
         "typeVersion": 1, "position": pos(800, corr_calc_y + 1420),
         "parameters": {}})

    # ── MASTER MERGE (all H module outputs) ──
    master_y = corr_calc_y + 1600
    add(merge_node("HUNTER MASTER MERGE", position=pos(1600, master_y), num_inputs=10))
    add(code_node("DATA AGGREGATOR", DATA_AGGREGATOR_CODE, position=pos(1600, master_y + 220)))

    # ── HUNTER AGENT PASS (Option C — Opportunity Qualification) ──
    agent_y = master_y + 500
    add({
        "id": nid(), "name": "URIEL — Strategic Opportunity",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2, "position": pos(900, agent_y),
        "parameters": {
            "method": "POST",
            "url": "https://api.openai.com/v1/chat/completions",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"},
                {"name": "Authorization", "value": f"Bearer {OPENAI}"}
            ]},
            "sendBody": True, "specifyBody": "json",
            "jsonBody": f"""={{"model":"gpt-4.1","max_tokens":2000,"messages":[{{"role":"system","content":{json.dumps(URIEL_HUNTER_PROMPT)}}},{{"role":"user","content":{{$json.hunter_payload}}}}]}}""",
            "options": {"timeout": 60000, "response": {"response": {"neverError": True}}}
        },
        "onError": "continueRegularOutput", "alwaysOutputData": False
    })

    add({
        "id": nid(), "name": "COLOSSUS — Technical Setups",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2, "position": pos(1260, agent_y),
        "parameters": {
            "method": "POST",
            "url": "https://api.x.ai/v1/chat/completions",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"},
                {"name": "Authorization", "value": f"Bearer {XAI}"}
            ]},
            "sendBody": True, "specifyBody": "json",
            "jsonBody": f"""={{"model":"grok-3-fast","max_tokens":2000,"messages":[{{"role":"system","content":{json.dumps(COLOSSUS_HUNTER_PROMPT)}}},{{"role":"user","content":{{$json.hunter_payload}}}}]}}""",
            "options": {"timeout": 60000, "response": {"response": {"neverError": True}}}
        },
        "onError": "continueRegularOutput", "alwaysOutputData": False
    })

    add({
        "id": nid(), "name": "HANIEL — Intelligence Signals",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2, "position": pos(1620, agent_y),
        "parameters": {
            "method": "POST",
            "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendQuery": True,
            "queryParameters": {"parameters": [{"name":"key","value":GOOGLE}]},
            "sendBody": True, "specifyBody": "json",
            "jsonBody": "={\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\": "" + .hunter_payload + ""}]}]}",  # Gemini format
            "options": {"timeout": 60000, "response": {"response": {"neverError": True}}}
        },
        "onError": "continueRegularOutput", "alwaysOutputData": False
    })

    add({
        "id": nid(), "name": "RAZIEL — Counter Thesis",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2, "position": pos(1980, agent_y),
        "parameters": {
            "method": "POST",
            "url": "https://api.deepseek.com/v1/chat/completions",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"},
                {"name": "Authorization", "value": f"Bearer {DEEPSEEK}"}
            ]},
            "sendBody": True, "specifyBody": "json",
            "jsonBody": f"""={{"model":"deepseek-reasoner","max_tokens":2000,"messages":[{{"role":"system","content":{json.dumps(RAZIEL_HUNTER_PROMPT)}}},{{"role":"user","content":{{$json.hunter_payload}}}}]}}""",
            "options": {"timeout": 90000, "response": {"response": {"neverError": True}}}
        },
        "onError": "continueRegularOutput", "alwaysOutputData": False
    })

    add(merge_node("HUNTER AGENT MERGE", position=pos(1440, agent_y + 300), num_inputs=4))
    add(code_node("HUNTER SYNTHESIS — MICHA", HUNTER_SYNTHESIS_CODE, position=pos(1440, agent_y + 500)))

    # ── DELIVERY ──
    delivery_y = agent_y + 800
    add(code_node("FORMAT TELEGRAM BRIEF", TELEGRAM_BRIEF_CODE, position=pos(1000, delivery_y)))
    add(telegram_node("📱 Send Telegram Brief",
                      "={{$json.message}}",
                      position=pos(1000, delivery_y + 220)))

    add(code_node("FIRE CIL WEBHOOK", CIL_FIRE_CODE, position=pos(1600, delivery_y)))
    add(http_node("→ CIL v6.1 Webhook",
                  f"={CIL_WEBHOOK}",
                  [],
                  position=pos(1600, delivery_y + 220),
                  method="POST"))

    add(code_node("GITHUB ARCHIVE PREP", GITHUB_ARCHIVE_CODE, position=pos(2200, delivery_y)))
    add(http_node("📁 GitHub Archive Write",
                  "https://api.github.com/repos/Barefootservants2/AIORA/contents/={{$json.github_path}}",
                  [],
                  position=pos(2200, delivery_y + 220),
                  method="PUT",
                  headers=[{"name":"Authorization","value":f"token {GH_TOKEN}"},
                           {"name":"Accept","value":"application/vnd.github.v3+json"}]))

    return nodes, ids

# ─────────────────────────────────────────────
# BUILD CONNECTIONS
# ─────────────────────────────────────────────

def build_connections(nodes, ids):
    """Build n8n connections map."""
    # Map name → id
    name_to_id = {n["name"]: n["id"] for n in nodes}

    def conn(src, dst, src_output=0, dst_input=0):
        return (src, dst, src_output, dst_input)

    connections_list = [
        # Triggers → Date Setup
        conn("Schedule 6AM ET",          "Date Setup"),
        conn("Schedule 12:30PM ET",       "Date Setup"),
        conn("Manual Trigger (Test)",     "Date Setup"),

        # Date Setup → ALL H collection nodes
        *[conn("Date Setup", h) for h in [
            "H1 — Volume Anomaly", "H2a — AV Top Movers", "H2b — NewsAPI Market News",
            "H3 — Options Flow Barchart", "H4 — Sector Rotation AV",
            "H5 — Finnhub Insider Transactions", "H6 — SEC 13F Filings EDGAR",
            "H7 — Finnhub Earnings Calendar", "H8 — FINRA Short Interest",
            "H9 — Finnhub IPO Calendar", "H10 — TD Major Indices",
            "H11 — TD RSI Scan", "H12 — TD MACD Scan", "H13 — TD Bollinger Bands",
            "H14 — TD ADX Trend", "H15 — TD Volume Analysis",
            "H16 — Finnhub Recommendations", "H17 — SEC Form 4 Filings",
            "H18 — TD EMA Cross", "H19 — TD Stochastic", "H20 — TD ATR Volatility",
            "H21 — Congress Bills", "H22 — SEC 13F Filings",
            "H23 — SEC 8-K Events", "H24 — Yahoo Trending",
            "H25 — Finnhub Earnings Cal", "H26 — Finnhub Economic Cal",
            "H27 — FRED Macro Data", "H28 — NewsAPI Sector News",
            "H29 — Metals Spot Prices",
            # Influence chain
            "H30 — Finnhub Congress Trades",
            "H31a — Congress Recent Bills", "H31b — Congress Amendments",
            "H32 — Senate LDA Lobbying", "H33 — USASpending Awards",
            "H34 — FEC Contributions", "H36 — Senate LDA Recent",
            # Correlation chain
            "H37 — FRED DXY Dollar", "H38 — FRED 10Y Yield",
            "H39a — SLV Volume", "H39b — GLD Volume", "H39c — SIL Volume",
            # New modules
            "H40 — GEX Options Structure", "H41 — Metals Lease Rates",
            "H42 — COMEX Inventory"
        ]],

        # Influence chain
        conn("H31a — Congress Recent Bills",  "H31 Committee Merge", 0, 0),
        conn("H31b — Congress Amendments",    "H31 Committee Merge", 0, 1),
        conn("H30 — Finnhub Congress Trades", "H30-Normalize"),
        conn("H31 Committee Merge",           "H31-Normalize"),
        conn("H32 — Senate LDA Lobbying",     "H32-Normalize"),
        conn("H33 — USASpending Awards",      "H33-Normalize"),
        conn("H34 — FEC Contributions",       "H34-Normalize"),
        conn("H36 — Senate LDA Recent",       "H36-Normalize"),
        conn("H30-Normalize", "Influence Merge", 0, 0),
        conn("H31-Normalize", "Influence Merge", 0, 1),
        conn("H32-Normalize", "Influence Merge", 0, 2),
        conn("H33-Normalize", "Influence Merge", 0, 3),
        conn("H34-Normalize", "Influence Merge", 0, 4),
        conn("H36-Normalize", "Influence Merge", 0, 5),
        conn("Influence Merge", "H35 — Influence Correlator"),

        # Correlation chain
        conn("H37 — FRED DXY Dollar",    "H37-CALC DXY Assessment"),
        conn("H38 — FRED 10Y Yield",     "H38-CALC Yield Assessment"),
        conn("H39a — SLV Volume",        "H39 ETF Merge", 0, 0),
        conn("H39b — GLD Volume",        "H39 ETF Merge", 0, 1),
        conn("H39c — SIL Volume",        "H39 ETF Merge", 0, 2),
        conn("H39 ETF Merge",            "H39-CALC Flow Assessment"),
        conn("H37-CALC DXY Assessment",  "Correlation Signal Merge", 0, 0),
        conn("H38-CALC Yield Assessment","Correlation Signal Merge", 0, 1),
        conn("Correlation Signal Merge", "Correlation Full Merge",   0, 0),
        conn("H39-CALC Flow Assessment", "Correlation Full Merge",   0, 1),
        conn("Correlation Full Merge",   "CORRELATION GATE CHECK"),
        conn("CORRELATION GATE CHECK",   "Kill Switch Decision"),
        conn("Kill Switch Decision",     "🚨 KILL SWITCH ALERT",    0, 0),  # true branch
        conn("Kill Switch Decision",     "HUNTER MASTER MERGE",     1, 0),  # false branch
        conn("🚨 KILL SWITCH ALERT",     "Kill Switch Log"),

        # Master merge inputs (false branch of kill switch = safe to proceed)
        conn("H1 — Volume Anomaly",         "HUNTER MASTER MERGE", 0, 1),
        conn("H2a — AV Top Movers",         "HUNTER MASTER MERGE", 0, 2),
        conn("H5 — Finnhub Insider Transactions", "HUNTER MASTER MERGE", 0, 3),
        conn("H7 — Finnhub Earnings Calendar",    "HUNTER MASTER MERGE", 0, 4),
        conn("H10 — TD Major Indices",       "HUNTER MASTER MERGE", 0, 5),
        conn("H11 — TD RSI Scan",            "HUNTER MASTER MERGE", 0, 6),
        conn("H12 — TD MACD Scan",           "HUNTER MASTER MERGE", 0, 7),
        conn("H17 — SEC Form 4 Filings",     "HUNTER MASTER MERGE", 0, 8),
        conn("H35 — Influence Correlator",   "HUNTER MASTER MERGE", 0, 9),
        conn("H2b — NewsAPI Market News",    "HUNTER MASTER MERGE", 0, 10),
        conn("H3 — Options Flow Barchart",   "HUNTER MASTER MERGE", 0, 11),
        conn("H4 — Sector Rotation AV",      "HUNTER MASTER MERGE", 0, 12),
        conn("H6 — SEC 13F Filings EDGAR",   "HUNTER MASTER MERGE", 0, 13),
        conn("H8 — FINRA Short Interest",    "HUNTER MASTER MERGE", 0, 14),
        conn("H9 — Finnhub IPO Calendar",    "HUNTER MASTER MERGE", 0, 15),
        conn("H13 — TD Bollinger Bands",     "HUNTER MASTER MERGE", 0, 16),
        conn("H14 — TD ADX Trend",           "HUNTER MASTER MERGE", 0, 17),
        conn("H15 — TD Volume Analysis",     "HUNTER MASTER MERGE", 0, 18),
        conn("H16 — Finnhub Recommendations","HUNTER MASTER MERGE", 0, 19),
        conn("H18 — TD EMA Cross",           "HUNTER MASTER MERGE", 0, 20),
        conn("H19 — TD Stochastic",          "HUNTER MASTER MERGE", 0, 21),
        conn("H20 — TD ATR Volatility",      "HUNTER MASTER MERGE", 0, 22),
        conn("H21 — Congress Bills",         "HUNTER MASTER MERGE", 0, 23),
        conn("H22 — SEC 13F Filings",        "HUNTER MASTER MERGE", 0, 24),
        conn("H23 — SEC 8-K Events",         "HUNTER MASTER MERGE", 0, 25),
        conn("H24 — Yahoo Trending",         "HUNTER MASTER MERGE", 0, 26),
        conn("H25 — Finnhub Earnings Cal",   "HUNTER MASTER MERGE", 0, 27),
        conn("H26 — Finnhub Economic Cal",   "HUNTER MASTER MERGE", 0, 28),
        conn("H27 — FRED Macro Data",        "HUNTER MASTER MERGE", 0, 29),
        conn("H28 — NewsAPI Sector News",    "HUNTER MASTER MERGE", 0, 30),
        conn("H29 — Metals Spot Prices",     "HUNTER MASTER MERGE", 0, 31),
        conn("H40 — GEX Options Structure",  "HUNTER MASTER MERGE", 0, 32),
        conn("H41 — Metals Lease Rates",     "HUNTER MASTER MERGE", 0, 33),
        conn("H42 — COMEX Inventory",        "HUNTER MASTER MERGE", 0, 34),

        # Data aggregator
        conn("HUNTER MASTER MERGE", "DATA AGGREGATOR"),

        # HUNTER agent pass (all 4 get the same payload)
        conn("DATA AGGREGATOR", "URIEL — Strategic Opportunity"),
        conn("DATA AGGREGATOR", "COLOSSUS — Technical Setups"),
        conn("DATA AGGREGATOR", "HANIEL — Intelligence Signals"),
        conn("DATA AGGREGATOR", "RAZIEL — Counter Thesis"),

        # Agent merge
        conn("URIEL — Strategic Opportunity",  "HUNTER AGENT MERGE", 0, 0),
        conn("COLOSSUS — Technical Setups",    "HUNTER AGENT MERGE", 0, 1),
        conn("HANIEL — Intelligence Signals",  "HUNTER AGENT MERGE", 0, 2),
        conn("RAZIEL — Counter Thesis",        "HUNTER AGENT MERGE", 0, 3),

        conn("HUNTER AGENT MERGE",            "HUNTER SYNTHESIS — MICHA"),

        # Delivery
        conn("HUNTER SYNTHESIS — MICHA", "FORMAT TELEGRAM BRIEF"),
        conn("HUNTER SYNTHESIS — MICHA", "FIRE CIL WEBHOOK"),
        conn("HUNTER SYNTHESIS — MICHA", "GITHUB ARCHIVE PREP"),
        conn("FORMAT TELEGRAM BRIEF",    "📱 Send Telegram Brief"),
        conn("FIRE CIL WEBHOOK",         "→ CIL v6.1 Webhook"),
        conn("GITHUB ARCHIVE PREP",      "📁 GitHub Archive Write"),
    ]

    # Build n8n connections map format
    conn_map = {}
    for item in connections_list:
        src, dst, src_out, dst_in = (item + (0, 0))[:4]
        if src not in conn_map:
            conn_map[src] = {"main": []}
        # Ensure enough output slots
        while len(conn_map[src]["main"]) <= src_out:
            conn_map[src]["main"].append([])
        conn_map[src]["main"][src_out].append({"node": dst, "type": "main", "index": dst_in})

    return conn_map


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    print("Building HUNTER v3.0 workflow...")

    nodes, ids = build_nodes()
    connections = build_connections(nodes, ids)

    workflow = {
        "name": "HUNTER — Market-Wide Discovery v3.0",
        "nodes": nodes,
        "connections": connections,
        "active": False,
        "settings": {
            "executionOrder": "v1",
            "saveManualExecutions": True,
            "callerPolicy": "workflowsFromSameOwner",
            "errorWorkflow": ""
        },
        "tags": ["HUNTER", "Production", "METATRON-v10.8", "Discovery"],
        "meta": {
            "description": "HUNTER v3.0 — H1-H42 market-wide discovery. Dual-layer AI: HUNTER agents=opportunity qualification, CIL=trade confirmation. METATRON v10.8 | March 30 2026",
            "templateCredsSetupCompleted": False
        }
    }

    # Validate JSON serializable
    try:
        raw = json.dumps(workflow, indent=2)
        json.loads(raw)  # Round-trip validation
        print(f"✅ JSON validation passed")
    except Exception as e:
        print(f"❌ JSON validation FAILED: {e}")
        sys.exit(1)

    outfile = "HUNTER_MARKET_WORKFLOW_v3.0.json"
    with open(outfile, "w") as f:
        f.write(raw)

    print(f"✅ Written: {outfile}")
    print(f"   Nodes:       {len(nodes)}")
    print(f"   Connections: {sum(len(v['main']) for v in connections.values())} source nodes wired")

    # Verify all H nodes have outbound connections
    h_nodes = [n["name"] for n in nodes if n["name"].startswith("H") and
               n["type"] != "n8n-nodes-base.stickyNote"]
    wired = set(connections.keys())
    disconnected = [h for h in h_nodes if h not in wired]
    if disconnected:
        print(f"⚠️  H-nodes with no outbound connections: {disconnected}")
    else:
        print(f"✅ All H-nodes have outbound connections")

    print(f"\nNext: push to GitHub at N8N/WORKFLOWS/HUNTER_MARKET_WORKFLOW_v3.0.json")
    print(f"Import URL: https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/N8N/WORKFLOWS/HUNTER_MARKET_WORKFLOW_v3.0.json")

if __name__ == "__main__":
    main()
