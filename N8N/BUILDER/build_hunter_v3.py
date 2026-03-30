#!/usr/bin/env python3
"""
HUNTER v3.1 Workflow Builder
Generates HUNTER_MARKET_WORKFLOW_v3.1.json

SECTION LAYOUT (flows top to bottom):
  S0 — CONTROL         Triggers + Date Setup
  S1 — MARKET DATA     H1-H7
  S2 — TECHNICAL       H8-H20 (2 rows)
  S3 — INTELLIGENCE    H21-H24
  S4 — MACRO           H25-H29
  S5 — INFLUENCE CHAIN H30-H36 + Normalizers + H35 Correlator (3 rows)
  S6 — CORRELATION     H37-H42 + Calc + Gate 9 + Kill Switch (3 rows)
  S7 — CONSOLIDATION   Master Merge + Data Aggregator
  S8 — AGENT PASS      URIEL/COLOSSUS/HANIEL/RAZIEL + Synthesis (2 rows)
  S9 — DELIVERY        Telegram + CIL Webhook + GitHub Archive

GAPS FIXED v3.0 -> v3.1:
  GAP1  Telegram credential name matched to "Telegram account"
  GAP2  HANIEL broken body: added HANIEL Payload Format code node, clean Gemini request
  GAP3  CIL webhook no body: sendBody=True, body=cil_payload
  GAP4  GitHub Archive no body: http_put with body expression
  GAP5  H33 POST no body: USASpending filter JSON added
  GAP6  COLOSSUS model: grok-3
  GAP7  RAZIEL model: deepseek-reasoner (correct for R1)
  GAP8  SEC User-Agent: added to H6/H17/H22/H23
  GAP9  H3 Barchart browser page: replaced with Yahoo Finance options
  GAP10 H8 FINRA wrong endpoint: replaced with regShoDaily
  GAP11 H41 Kitco browser page: replaced with FRED gold series
  GAP12 GOOGLE_AI_KEY documented in config sticky

Author: MICHA v10.8 | March 30, 2026
"""
import json, uuid, sys

# ── LAYOUT ──────────────────────────────────
NODE_X0   = 0
XGAP      = 500
YGAP      = 260
BANNER_X  = -300
BANNER_W  = 4500

S = { 0:0, 1:700, 2:1400, 3:2300, 4:2900,
      5:3600, 6:5100, 7:6700, 8:7300, 9:8400 }

def xp(col):        return NODE_X0 + col * XGAP
def yp(sec, row=0): return S[sec] + 120 + row * YGAP
def nid():          return str(uuid.uuid4())

# ── ENV VARS ─────────────────────────────────
FINNHUB  = "{{$env.FINNHUB_KEY}}"
TD       = "{{$env.TWELVEDATA_KEY}}"
AV       = "{{$env.ALPHA_VANTAGE_KEY}}"
NEWS     = "{{$env.NEWS_API_KEY}}"
FRED_KEY = "{{$env.FRED_API_KEY}}"
CONGRESS = "{{$env.CONGRESS_API_KEY}}"
FEC      = "{{$env.FEC_API_KEY}}"
METALS   = "{{$env.METALS_DEV_KEY}}"
OPENAI   = "{{$env.OPENAI_API_KEY}}"
XAI      = "{{$env.XAI_API_KEY}}"
GOOGLE   = "{{$env.GOOGLE_AI_KEY}}"
DEEPSEEK = "{{$env.DEEPSEEK_API_KEY}}"
GH_TOKEN = "{{$env.GITHUB_TOKEN}}"
CIL_WH   = "{{$env.CIL_WEBHOOK_URL}}"
SEC_UA   = "Ashes2Echoes-HUNTER/3.1 admin@ashes2echoes.com"

# ── NODE HELPERS ─────────────────────────────

def banner(title, sec, rows=1):
    h = 80 + (rows - 1) * YGAP + 160
    return {"id": nid(), "name": f"_B{sec}",
            "type": "n8n-nodes-base.stickyNote", "typeVersion": 1,
            "position": [BANNER_X, S[sec] - 20],
            "parameters": {"content": f"## {title}", "width": BANNER_W, "height": h, "color": 3}}

def note(text, px, py, w=420, h=140):
    return {"id": nid(), "name": f"_N{nid()[:4]}",
            "type": "n8n-nodes-base.stickyNote", "typeVersion": 1,
            "position": [px, py],
            "parameters": {"content": text, "width": w, "height": h}}

def http_get(name, url, qp, px, py, hdrs=None, to=30000):
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2, "position": [px, py], "alwaysOutputData": False,
            "onError": "continueRegularOutput",
            "parameters": {
                "method": "GET", "url": url,
                "sendQuery": bool(qp), "queryParameters": {"parameters": qp or []},
                "sendHeaders": bool(hdrs), "headerParameters": {"parameters": hdrs or []},
                "options": {"redirect": {"redirect": {"followRedirects": True, "maxRedirects": 3}},
                            "timeout": to, "response": {"response": {"neverError": True}}}}}

def http_post(name, url, body, px, py, hdrs=None, to=60000):
    bh = [{"name": "Content-Type", "value": "application/json"}] + (hdrs or [])
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2, "position": [px, py], "alwaysOutputData": False,
            "onError": "continueRegularOutput",
            "parameters": {
                "method": "POST", "url": url,
                "sendHeaders": True, "headerParameters": {"parameters": bh},
                "sendBody": True, "specifyBody": "json", "jsonBody": body,
                "options": {"redirect": {"redirect": {"followRedirects": True, "maxRedirects": 3}},
                            "timeout": to, "response": {"response": {"neverError": True}}}}}

def http_put(name, url, body, px, py, hdrs=None, to=30000):
    bh = [{"name": "Content-Type", "value": "application/json"}] + (hdrs or [])
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2, "position": [px, py], "alwaysOutputData": False,
            "onError": "continueRegularOutput",
            "parameters": {
                "method": "PUT", "url": url,
                "sendHeaders": True, "headerParameters": {"parameters": bh},
                "sendBody": True, "specifyBody": "json", "jsonBody": body,
                "options": {"redirect": {"redirect": {"followRedirects": True, "maxRedirects": 3}},
                            "timeout": to, "response": {"response": {"neverError": True}}}}}

def code(name, js, px, py):
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.code",
            "typeVersion": 2, "position": [px, py], "alwaysOutputData": False,
            "onError": "continueRegularOutput",
            "parameters": {"mode": "runOnceForAllItems", "jsCode": js}}

def merge(name, px, py, n=2):
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.merge",
            "typeVersion": 3, "position": [px, py], "alwaysOutputData": False,
            "parameters": {"mode": "append", "numberInputs": n}}

def ifnode(name, expr, val, px, py):
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.if",
            "typeVersion": 2, "position": [px, py], "alwaysOutputData": False,
            "parameters": {"conditions": {"options": {"caseSensitive": True},
                "conditions": [{"id": "c1", "leftValue": expr, "rightValue": val,
                                "operator": {"type": "boolean", "operation": "equals"}}]}}}

def tg(name, msg, px, py):
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.telegram",
            "typeVersion": 1.2, "position": [px, py], "alwaysOutputData": False,
            "credentials": {"telegramApi": {"id": "", "name": "Telegram account"}},
            "parameters": {"chatId": "8203545338", "text": msg,
                           "additionalFields": {"parse_mode": "HTML"}}}

def noop(name, px, py):
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.noOp",
            "typeVersion": 1, "position": [px, py], "parameters": {}}

def sched(name, cron, px, py):
    return {"id": nid(), "name": name, "type": "n8n-nodes-base.scheduleTrigger",
            "typeVersion": 1.1, "position": [px, py],
            "parameters": {"rule": {"interval": [{"field": "cronExpression",
                                                   "expression": cron}]}}}

# ── CODE BLOCKS ──────────────────────────────

DATE_SETUP = r"""
const now=new Date(), fmt=d=>d.toISOString().split('T')[0];
const ago=n=>{const d=new Date(now);d.setDate(d.getDate()-n);return fmt(d);};
const req=['FINNHUB_KEY','TWELVEDATA_KEY','METALS_DEV_KEY','FRED_API_KEY',
  'ALPHA_VANTAGE_KEY','NEWS_API_KEY','CONGRESS_API_KEY','FEC_API_KEY',
  'OPENAI_API_KEY','XAI_API_KEY','GOOGLE_AI_KEY','DEEPSEEK_API_KEY',
  'GITHUB_TOKEN','CIL_WEBHOOK_URL'];
const missing=req.filter(k=>!$env[k]||$env[k].length<4);
return [{json:{today:fmt(now),sevenDaysAgo:ago(7),fourteenAgo:ago(14),
  thirtyDaysAgo:ago(30),ninetyDaysAgo:ago(90),scanTimestamp:now.toISOString(),
  envCheck:missing.length===0?'PASS':'WARN:'+missing.join(','),
  missingVars:missing,hunterVersion:'v3.1',metatronVersion:'v10.8'}}];
"""

H30N = r"""
const t=($input.first().json.data||[]);
return [{json:{module:'H30',signal_type:'CONGRESSIONAL_TRADE',signals:t.slice(0,20).map(x=>({
  source:'H30',member:x.name||'',ticker:x.symbol||'',action:x.transactionType||'',
  amount:x.amount||0,date:x.transactionDate||'',chamber:x.chamber||'',committee:x.committee||'',
  signal_weight:x.amount>100000?'HIGH':'MEDIUM',
  delay_days:(x.filingDate&&x.transactionDate)?Math.round((new Date(x.filingDate)-new Date(x.transactionDate))/86400000):null,
  stock_act_flag:(x.filingDate&&x.transactionDate)?Math.round((new Date(x.filingDate)-new Date(x.transactionDate))/86400000)>30:false
})),count:t.length,error:null}}];
"""

H31N = r"""
const b=$input.all().flatMap(i=>i.json.bills||[]);
return [{json:{module:'H31',signal_type:'CONGRESS_BILLS',signals:b.slice(0,15).map(x=>({
  source:'H31',title:x.title||'',bill_number:(x.type||'')+(x.number||''),congress:x.congress||'',
  latest_action:x.latestAction?.text||'',latest_action_date:x.latestAction?.actionDate||'',
  url:x.url||'',signal_weight:'MEDIUM'
})),count:b.length,error:null}}];
"""

H32N = r"""
const f=($input.first().json.results||[]);
return [{json:{module:'H32',signal_type:'LOBBYING',signals:f.slice(0,15).map(x=>({
  source:'H32',registrant:x.registrant?.name||'',client:x.client?.name||'',
  amount:x.income||x.expenses||0,period:x.period_of_performance||'',
  issue_codes:x.lobbying_activities?.map(a=>a.general_issue_code).join(','),
  signal_weight:(x.income||0)>500000?'HIGH':'MEDIUM'
})),count:f.length,error:null}}];
"""

H33N = r"""
const a=($input.first().json.results||[]);
return [{json:{module:'H33',signal_type:'GOV_CONTRACT',signals:a.slice(0,15).map(x=>({
  source:'H33',recipient:x.recipient_name||'',amount:x.award_amount||0,
  awarding_agency:x.awarding_agency_name||'',description:x.description||'',
  date:x.action_date||'',naics:x.naics_code||'',
  signal_weight:(x.award_amount||0)>10000000?'CRITICAL':'HIGH'
})),count:a.length,error:null}}];
"""

H34N = r"""
const r=($input.first().json.results||[]);
return [{json:{module:'H34',signal_type:'FEC_DONATION',signals:r.slice(0,15).map(x=>({
  source:'H34',contributor:x.contributor_name||'',recipient:x.committee?.name||'',
  amount:x.contribution_receipt_amount||0,date:x.contribution_receipt_date||'',
  employer:x.contributor_employer||'',
  signal_weight:(x.contribution_receipt_amount||0)>50000?'HIGH':'MEDIUM'
})),count:r.length,error:null}}];
"""

H36N = r"""
const r=($input.first().json.results||[]);
return [{json:{module:'H36',signal_type:'LOBBYIST_DONATION',signals:r.slice(0,10).map(x=>({
  source:'H36',lobbyist:x.lobbyist?.name||'',amount:x.amount||0,
  date:x.contribution_date||'',registrant:x.registrant?.name||'',signal_weight:'MEDIUM'
})),count:r.length,error:null}}];
"""

H35C = r"""
const all=$input.all();
const byM=m=>all.find(i=>i.json.module===m)?.json?.signals||[];
const cT=byM('H30'),bills=byM('H31'),lob=byM('H32'),con=byM('H33'),don=byM('H34'),ld=byM('H36');
const C=[];
cT.forEach(t=>{if(t.committee&&t.ticker&&t.signal_weight==='HIGH')
  C.push({algorithm:'COMMITTEE_TRADE',severity:'HIGH',ticker:t.ticker,member:t.member,
    committee:t.committee,amount:t.amount,description:`${t.member} (${t.committee}) traded ${t.ticker} $${t.amount}`});
});
cT.forEach(tr=>{con.forEach(ct=>{
  if(!tr.ticker||!tr.date||!ct.date)return;
  const d=Math.abs((new Date(tr.date)-new Date(ct.date))/86400000);
  if(d<=14&&ct.amount>5000000)C.push({algorithm:'CONTRACT_TRADE',severity:'CRITICAL',
    ticker:tr.ticker,member:tr.member,contract_recipient:ct.recipient,
    contract_amount:ct.amount,days_apart:Math.round(d),
    description:`${tr.member} traded ${tr.ticker} ${Math.round(d)}d from $${(ct.amount/1e6).toFixed(1)}M contract`});
});});
cT.forEach(tr=>{don.forEach(d=>{
  if(tr.ticker&&d.employer&&d.employer.toLowerCase().includes(tr.ticker.toLowerCase()))
    C.push({algorithm:'DONOR_TRADE',severity:'CRITICAL',ticker:tr.ticker,member:tr.member,
      donor:d.contributor,donation_amount:d.amount,
      description:`${tr.member} traded ${tr.ticker}, donor ${d.contributor} gave $${d.amount}`});
});});
lob.filter(l=>l.amount>100000).forEach(l=>{cT.forEach(tr=>{
  if(l.issue_codes&&tr.ticker)C.push({algorithm:'LOBBYING_TRADE',severity:'HIGH',
    ticker:tr.ticker,member:tr.member,lobbying_client:l.client,lobbying_amount:l.amount,
    description:`${tr.member} traded ${tr.ticker} alongside $${(l.amount/1e6).toFixed(1)}M lobbying`});
});});
cT.filter(t=>t.stock_act_flag).forEach(t=>C.push({algorithm:'DELAYED_DISCLOSURE',severity:'CRITICAL',
  ticker:t.ticker,member:t.member,delay_days:t.delay_days,
  description:`STOCK Act: ${t.member} filed ${t.ticker} ${t.delay_days}d late`}));
const tc={};cT.forEach(t=>{if(!t.ticker)return;const k=t.ticker+'_'+(t.date||'').substring(0,7);
  tc[k]=(tc[k]||[]);tc[k].push(t.member);});
Object.entries(tc).forEach(([k,m])=>{if(m.length>=3){const[ti]=k.split('_');
  C.push({algorithm:'SECTOR_CONVERGENCE',severity:'HIGH',ticker:ti,member_count:m.length,
    members:m.join(', '),description:`${m.length} members traded ${ti} same month`});}});
const crit=C.filter(c=>c.severity==='CRITICAL'),hi=C.filter(c=>c.severity==='HIGH');
return [{json:{module:'H35',signal_type:'INFLUENCE_CORRELATIONS',correlations:C,
  critical_count:crit.length,high_count:hi.length,total_count:C.length,
  top_tickers:[...new Set(C.map(c=>c.ticker).filter(Boolean))].slice(0,10),
  alert:crit.length>0?`\u{1F6A8} H35 CRITICAL: ${crit.length} correlation(s)`:
        hi.length>0?`\u26A0\uFE0F H35 HIGH: ${hi.length} signal(s)`:null,error:null}}];
"""

H37C = r"""
const obs=($input.first().json.observations||[]);
if(obs.length<2)return [{json:{module:'H37',gate_pass:true,regime:'UNKNOWN',
  dxy_current:null,change_pct:0,kill_switch_trigger:false,error:'no data'}}];
const cur=parseFloat(obs[0].value),prev=parseFloat(obs[Math.min(20,obs.length-1)].value);
const chg=((cur-prev)/prev)*100;
// CRITICAL: directional check only — NEVER use Math.abs() here
const regime=chg>0.5?'STRENGTHENING':chg<-0.5?'WEAKENING':'NEUTRAL';
return [{json:{module:'H37',signal_type:'DXY_DOLLAR',dxy_current:cur,dxy_20d_ago:prev,
  change_pct:parseFloat(chg.toFixed(4)),regime,gate_pass:regime!=='STRENGTHENING',
  kill_switch_trigger:chg>0.3,error:null}}];
"""

H38C = r"""
const obs=($input.first().json.observations||[]);
if(obs.length<2)return [{json:{module:'H38',gate_pass:true,regime:'UNKNOWN',
  yield_current:null,change_bps:0,kill_switch_trigger:false,error:'no data'}}];
const cur=parseFloat(obs[0].value),prev=parseFloat(obs[Math.min(20,obs.length-1)].value);
const chg=cur-prev;
const regime=chg>0.2?'RISING':chg<-0.2?'FALLING':'STABLE';
return [{json:{module:'H38',signal_type:'YIELD_10Y',yield_current:cur,yield_20d_ago:prev,
  change_bps:parseFloat((chg*100).toFixed(1)),regime,gate_pass:regime!=='RISING',
  kill_switch_trigger:chg>0.003,error:null}}];
"""

H39C = r"""
const all=$input.all(),flows=all.map(i=>i.json).filter(i=>i.c&&i.v);
if(!flows.length)return [{json:{module:'H39',gate_pass:true,flow_regime:'UNKNOWN',
  volume_ratio:1,error:'no ETF data'}}];
const avgV=flows.reduce((s,f)=>{const vs=Array.isArray(f.v)?f.v:[f.v];
  return s+(vs.reduce((a,b)=>a+b,0)/vs.length);},0)/flows.length;
const recV=flows.reduce((s,f)=>{const vs=Array.isArray(f.v)?f.v:[f.v];
  return s+(vs[0]||0);},0)/flows.length;
const ratio=avgV>0?recV/avgV:1;
const pc=flows.map(f=>{const cs=Array.isArray(f.c)?f.c:[f.c];
  return cs.length>1?(cs[0]-cs[1])/cs[1]:0;}).reduce((a,b)=>a+b,0)/flows.length;
const regime=ratio>1.3&&pc>0?'ACCUMULATION':ratio>1.3&&pc<0?'INSTITUTIONAL_EXIT':
  ratio<0.7?'LOW_CONVICTION':'NEUTRAL';
return [{json:{module:'H39',signal_type:'ETF_FLOW',flow_regime:regime,
  volume_ratio:parseFloat(ratio.toFixed(3)),avg_price_change_pct:parseFloat((pc*100).toFixed(3)),
  gate_pass:regime!=='INSTITUTIONAL_EXIT',kill_switch_trigger:regime==='INSTITUTIONAL_EXIT',error:null}}];
"""

GATE9 = r"""
const all=$input.all();
const h37=all.find(i=>i.json.module==='H37')?.json||{};
const h38=all.find(i=>i.json.module==='H38')?.json||{};
const h39=all.find(i=>i.json.module==='H39')?.json||{};
const A=(h37.kill_switch_trigger===true)&&(h38.kill_switch_trigger===true);
const B=(h39.flow_regime==='INSTITUTIONAL_EXIT')&&(h37.regime!=='WEAKENING');
const C=(h37.gate_pass===false)&&(h38.gate_pass===false)&&(h39.gate_pass===false);
const kill=A||B||C;
const reason=A?'COND_A: DXY+Yields both rising >0.3%':
             B?'COND_B: Institutional exit + DXY not weakening':
             C?'COND_C: All three gates failing':'PASS';
return [{json:{gate:9,gate_pass:!kill,kill_switch:kill,condition:reason,
  h37_regime:h37.regime||'UNKNOWN',h38_regime:h38.regime||'UNKNOWN',
  h39_flow:h39.flow_regime||'UNKNOWN',timestamp:new Date().toISOString()}}];
"""

KILL_MSG = ("=('<b>\U0001F6A8 KILL SWITCH \u2014 GATE 9 ACTIVATED</b>\\n'"
            "+'<b>Condition:</b> '+$json.condition+'\\n'"
            "+'<b>DXY:</b> '+$json.h37_regime+' | <b>Yield:</b> '+$json.h38_regime"
            "+'  | <b>Flow:</b> '+$json.h39_flow+'\\n\\n'"
            "+'<b>IRONCLAD AUTO-PROTOCOL:</b>\\n'"
            "+'\\u2192 50% metals reduction required\\n'"
            "+'\\u2192 48hr embargo on metals entries\\n'"
            "+'\\u2192 NO OVERRIDE\\n\\n'"
            "+'<i>METATRON v10.8 | HUNTER v3.1</i>')")

DATA_AGG = r"""
const all=$input.all(),mods={},errs=[],sigs={};
all.forEach(item=>{const d=item.json,mod=d.module||'UNKNOWN';
  mods[mod]={status:d.error?'ERROR':'OK',signal_type:d.signal_type||mod,
    count:d.count||(d.signals?.length)||null,error:d.error||null};
  if(d.error)errs.push(`${mod}: ${d.error}`);
  if(d.signals)sigs[mod]=d.signals.slice(0,10);
});
const g9=all.find(i=>i.json.gate===9)?.json||{gate_pass:true,kill_switch:false};
const payload={scan_timestamp:new Date().toISOString(),hunter_version:'v3.1',
  metatron_version:'v10.8',module_summary:mods,error_count:errs.length,
  errors:errs.slice(0,10),signals:sigs,gate9_status:g9,
  influence_correlations:all.find(i=>i.json.module==='H35')?.json?.correlations||[],
  metals_data:all.find(i=>i.json.module==='H29')?.json||{},
  comex_data:all.find(i=>i.json.module==='H42')?.json||{},
  gex_data:all.find(i=>i.json.module==='H40')?.json||{},
  lease_data:all.find(i=>i.json.module==='H41')?.json||{}};
return [{json:{hunter_payload:JSON.stringify(payload,null,2),
  module_count:Object.keys(mods).length,error_count:errs.length,
  gate9_pass:g9.gate_pass,kill_switch:g9.kill_switch,raw:payload}}];
"""

# GAP2 FIX: code node formats Gemini payload before HANIEL HTTP call
HANIEL_FMT = r"""
const sys=`You are HANIEL, CPO and Research Director of the Uriel Covenant AI Collective.
HUNTER INTELLIGENCE SCAN. Identify opportunities from filings, congressional activity, contracts, institutional positioning.
Flag H35 Influence Chain correlations as HIGH PRIORITY. ZERO portfolio awareness.
OUTPUT: JSON only.
{"agent":"HANIEL","intelligence_signals":[{"ticker":"","signal_type":"INSIDER_CLUSTER|CONGRESSIONAL_TRADE|CONTRACT_AWARD|WHALE_13F|LOBBYING_CORRELATION","signal_tier":"PRIME|STRONG|PROBE","confidence":0,"source_module":"","key_finding":"","dollars_involved":0,"days_since_event":0,"regulatory_risk":"LOW|MEDIUM|HIGH","thesis_implication":""}],"h35_alerts":"","whale_activity":"","top_intelligence_pick":""}`;
const fullText=sys+'\n\nDATA:\n'+($json.hunter_payload||'{}');
return [{json:{gemini_body:JSON.stringify({
  contents:[{role:'user',parts:[{text:fullText}]}],
  generationConfig:{maxOutputTokens:2000,temperature:0.3}
})}}];
"""

U_SYS = json.dumps("You are URIEL, CEO/Strategic Director of the Uriel Covenant AI Collective. HUNTER OPPORTUNITY SCAN — pure market discovery, ZERO portfolio awareness. Find what the Principal does NOT know about. OUTPUT: JSON only. {\"agent\":\"URIEL\",\"opportunities\":[{\"ticker\":\"\",\"signal_tier\":\"PRIME|STRONG|PROBE\",\"confidence\":0,\"thesis\":\"\",\"key_signal\":\"\",\"entry_zone\":\"$XX-$XX\",\"stop\":\"$XX\",\"target_5pct\":\"$XX\",\"catalyst\":\"\",\"ring_fit\":\"Ring 2|3|4|5\",\"hold_duration\":\"intraday|1-3day|thesis\"}],\"macro_regime\":\"RISK_ON|NEUTRAL|RISK_OFF\",\"sector_rotation\":\"\",\"top_risk\":\"\"}")

C_SYS = json.dumps("You are COLOSSUS, CTO/Technical Analyst of the Uriel Covenant AI Collective. HUNTER TECHNICAL SCAN — identify strongest setups: VWAP position, momentum, volume, breakouts. ZERO portfolio awareness. OUTPUT: JSON only. {\"agent\":\"COLOSSUS\",\"setups\":[{\"ticker\":\"\",\"setup_type\":\"VWAP_BREAKOUT|MOMENTUM|OPENING_RANGE|REVERSAL\",\"signal_tier\":\"PRIME|STRONG|PROBE\",\"confidence\":0,\"vwap_position\":\"ABOVE|BELOW|AT\",\"volume_ratio\":0,\"rsi_14\":0,\"momentum_direction\":\"BULLISH|BEARISH|NEUTRAL\",\"entry_trigger\":\"\",\"stop_technical\":\"$XX\",\"target_technical\":\"$XX\",\"time_window\":\"open|mid|close\"}],\"market_breadth\":\"EXPANDING|CONTRACTING|NEUTRAL\",\"vix_regime\":\"LOW|NORMAL|ELEVATED|EXTREME\",\"best_sector_momentum\":\"\"}")

R_SYS = json.dumps("You are RAZIEL, CAO/Counter-Thesis Analyst of the Uriel Covenant AI Collective. Gate 6 adversarial analysis. Challenge every opportunity. Find failure modes before we trade. Low score = clean thesis. High score = dangerous. OUTPUT: JSON only. {\"agent\":\"RAZIEL\",\"counter_analyses\":[{\"ticker\":\"\",\"raziel_score\":0,\"primary_risk\":\"\",\"secondary_risk\":\"\",\"correlation_risk\":\"Y|N\",\"timing_risk\":\"\",\"liquidity_risk\":\"\",\"verdict\":\"CLEAR|CAUTION|ABORT\",\"abort_reason\":\"\"}],\"market_risks\":\"\",\"do_not_touch\":[],\"cleanest_thesis\":\"\"}")

SYNTH = r"""
const all=$input.all(),ag={};
all.forEach(item=>{let p=null;
  try{const r=item.json,t=r?.choices?.[0]?.message?.content||r?.content?.[0]?.text
    ||r?.candidates?.[0]?.content?.parts?.[0]?.text||r?.output||'';
    p=JSON.parse(t.replace(/```json\n?|```/g,'').trim());}catch(e){p={parse_error:e.message};}
  if(p?.agent)ag[p.agent]=p;
});
const U=ag['URIEL']||{},C=ag['COLOSSUS']||{},H=ag['HANIEL']||{},R=ag['RAZIEL']||{};
const tks=new Set([...(U.opportunities||[]).map(o=>o.ticker),
  ...(C.setups||[]).map(s=>s.ticker),
  ...(H.intelligence_signals||[]).map(i=>i.ticker)].filter(Boolean));
const ops=[];
tks.forEach(tk=>{
  const u=(U.opportunities||[]).find(o=>o.ticker===tk);
  const c=(C.setups||[]).find(s=>s.ticker===tk);
  const h=(H.intelligence_signals||[]).find(i=>i.ticker===tk);
  const r=(R.counter_analyses||[]).find(a=>a.ticker===tk);
  if(r?.verdict==='ABORT')return;
  const sc=[u?.confidence,c?.confidence,h?.confidence].filter(Boolean);
  const avg=sc.length?sc.reduce((a,b)=>a+b,0)/sc.length:50;
  const cnt=[u,c,h].filter(Boolean).length;
  const rs=r?.raziel_score||50;
  const tier=cnt>=2&&avg>=85&&rs<65?'PRIME':cnt>=2&&avg>=75?'STRONG':'PROBE';
  ops.push({ticker:tk,signal_tier:tier,composite_confidence:Math.round(avg),raziel_score:rs,
    agent_coverage:cnt,agents_flagged:[u?'URIEL':null,c?'COLOSSUS':null,h?'HANIEL':null].filter(Boolean),
    uriel_thesis:u?.thesis||null,colossus_setup:c?.setup_type||null,haniel_signal:h?.signal_type||null,
    entry_zone:u?.entry_zone||null,stop:u?.stop||c?.stop_technical||null,
    target:u?.target_5pct||c?.target_technical||null,ring_fit:u?.ring_fit||'Ring 4',
    hold_duration:u?.hold_duration||'intraday',raziel_verdict:r?.verdict||'CLEAR',
    primary_risk:r?.primary_risk||null,catalyst:u?.catalyst||h?.key_finding||null});
});
const ord={PRIME:0,STRONG:1,PROBE:2};
ops.sort((a,b)=>ord[a.signal_tier]-ord[b.signal_tier]||b.composite_confidence-a.composite_confidence);
const prime=ops.filter(o=>o.signal_tier==='PRIME');
return [{json:{opportunities:ops.slice(0,15),prime_count:prime.length,
  strong_count:ops.filter(o=>o.signal_tier==='STRONG').length,total_count:ops.length,
  top3_for_cil:prime.slice(0,3),macro_regime:U.macro_regime||'UNKNOWN',
  market_breadth:C.market_breadth||'UNKNOWN',
  best_sector:U.sector_rotation||C.best_sector_momentum||'UNKNOWN',
  do_not_touch:R.do_not_touch||[],h35_alerts:H.h35_alerts||null,
  agents_responded:Object.keys(ag).length,synthesis_timestamp:new Date().toISOString()}}];
"""

FMT_TG = r"""
const d=$input.first().json,ops=d.opportunities||[];
const prime=ops.filter(o=>o.signal_tier==='PRIME');
const strong=ops.filter(o=>o.signal_tier==='STRONG');
const fmt=o=>{const ic=o.composite_confidence>=95?'\uD83D\uDD31':o.composite_confidence>=85?'\u26A1':'\uD83D\uDCE1';
  return `${ic} <b>${o.ticker}</b> [${o.signal_tier}] ${o.composite_confidence}%`
    +`\n   Agents: ${o.agents_flagged?.join(',')||'?'} | RAZIEL: ${o.raziel_score}/100`
    +`\n   ${o.uriel_thesis||o.colossus_setup||o.haniel_signal||''}`
    +`\n   Entry: ${o.entry_zone||'?'} | Stop: ${o.stop||'?'} | Target: ${o.target||'?'}`
    +(o.catalyst?`\n   \uD83D\uDCCC ${o.catalyst}`:'');};
const pb=prime.length>0?`\n<b>\uD83D\uDD31 PRIME (${prime.length})</b>\n`+prime.slice(0,5).map(fmt).join('\n\n'):'\n<i>No PRIME signals today</i>';
const sb=strong.length>0?`\n\n<b>\u26A1 STRONG (${strong.length})</b>\n`+strong.slice(0,3).map(fmt).join('\n\n'):'';
const av=d.do_not_touch?.length?`\n\n\uD83D\uDEAB <b>AVOID:</b> ${d.do_not_touch.join(', ')}`:'';
const h35=d.h35_alerts?`\n\n\uD83C\uDFDB\uFE0F <b>INFLUENCE:</b> ${d.h35_alerts}`:'';
const cil=d.prime_count>0?`\n\n\uD83D\uDCE4 Top ${Math.min(3,d.prime_count)} PRIME \u2192 CIL confirming`:'';
const msg=`\uD83D\uDD31 <b>HUNTER v3.1 \u2014 DISCOVERY BRIEF</b>\n`
  +`${new Date().toISOString().replace('T',' ').substring(0,16)} ET\n\n`
  +`<b>Regime:</b> ${d.macro_regime} | <b>Breadth:</b> ${d.market_breadth}\n`
  +`<b>Hot Sector:</b> ${d.best_sector} | <b>Agents:</b> ${d.agents_responded}/4`
  +pb+sb+av+h35+cil+`\n\n<i>HUNTER v3.1 | METATRON v10.8</i>`;
return [{json:{message:msg.substring(0,4096)}}];
"""

FIRE_CIL = r"""
const d=$input.first().json,top3=d.top3_for_cil||[];
if(!top3.length)return [{json:{fired:false,reason:'No PRIME candidates',cil_payload:null}}];
const payload={source:'HUNTER_v3.1',request_type:'TRADE_CONFIRMATION',
  timestamp:new Date().toISOString(),
  instruction:'Hunter PRIME signals. Run full 9-gate Cascade + IRONCLAD. Portfolio-aware confirmation required.',
  candidates:top3.map(o=>({ticker:o.ticker,hunter_confidence:o.composite_confidence,
    hunter_tier:o.signal_tier,hunter_thesis:o.uriel_thesis||o.catalyst||'',
    entry_zone:o.entry_zone,suggested_stop:o.stop,suggested_target:o.target,
    ring_fit:o.ring_fit,raziel_score:o.raziel_score,agents_flagged:o.agents_flagged}))};
return [{json:{fired:true,candidate_count:top3.length,cil_payload:JSON.stringify(payload)}}];
"""

GH_PREP = r"""
const d=$input.first().json;
const ts=new Date().toISOString().replace(/[:.]/g,'-').substring(0,19);
const path=`AIORA/reports/hunter_daily/hunter_scan_${ts}.json`;
const content=btoa(unescape(encodeURIComponent(JSON.stringify(d,null,2))));
return [{json:{github_path:path,content_b64:content,
  github_put_body:JSON.stringify({
    message:`HUNTER v3.1 scan ${ts} — ${d.prime_count||0} PRIME`,content})}}];
"""

# ── BUILD ────────────────────────────────────

def build():
    nodes, ids = [], {}
    def add(n): nodes.append(n); ids[n["name"]] = n["id"]; return n

    # ── S0 CONTROL ──
    add(banner("S0 — CONTROL  |  Triggers  +  Date Setup  +  Environment Config", 0))
    add(note("**ENV VARS** (n8n Settings → Variables)\n"
             "FINNHUB_KEY | TWELVEDATA_KEY | ALPHA_VANTAGE_KEY\n"
             "NEWS_API_KEY | FRED_API_KEY | CONGRESS_API_KEY | FEC_API_KEY\n"
             "METALS_DEV_KEY | OPENAI_API_KEY | XAI_API_KEY\n"
             "GOOGLE_AI_KEY | DEEPSEEK_API_KEY | GITHUB_TOKEN | CIL_WEBHOOK_URL\n\n"
             "**After import:** click Telegram nodes → select 'Telegram account'",
             xp(4), yp(0)-10, w=680, h=210))
    add(sched("Schedule 6AM ET",    "0 10 * * 1-5", xp(0), yp(0)))
    add(sched("Schedule 12:30PM ET","30 16 * * 1-5", xp(0), yp(0,1)))
    add({"id":nid(),"name":"Manual Trigger","type":"n8n-nodes-base.manualTrigger",
         "typeVersion":1,"position":[xp(0),yp(0,2)],"parameters":{}})
    add(code("Date Setup", DATE_SETUP, xp(2), yp(0,1)))

    # ── S1 MARKET DATA H1-H7 ──
    add(banner("S1 — MARKET DATA  |  H1 Volume · H2 Breakout · H3 Options Flow · H4 Sector · H5 Insider · H6 13F · H7 Earnings", 1))
    add(http_get("H1 — Volume Anomaly","https://query1.finance.yahoo.com/v8/finance/spark",
        [{"name":"symbols","value":"SPY,QQQ,IWM,XLE,XLF,XLK,XLV,XLI,XLP,XLU,XLB,XLRE"},
         {"name":"range","value":"1d"},{"name":"interval","value":"5m"}], xp(0),yp(1)))
    add(http_get("H2a — AV Top Movers","https://www.alphavantage.co/query",
        [{"name":"function","value":"TOP_GAINERS_LOSERS"},{"name":"apikey","value":AV}], xp(1),yp(1)))
    add(http_get("H2b — News Velocity","https://newsapi.org/v2/everything",
        [{"name":"q","value":"stock breakout momentum earnings"},{"name":"language","value":"en"},
         {"name":"sortBy","value":"publishedAt"},{"name":"pageSize","value":"20"},
         {"name":"apiKey","value":NEWS}], xp(2),yp(1)))
    # GAP9 FIX: Yahoo Finance options (not Barchart browser page)
    add(http_get("H3 — Options Flow","https://query2.finance.yahoo.com/v7/finance/options/SPY",
        [{"name":"lang","value":"en-US"}], xp(3),yp(1)))
    add(http_get("H4 — Sector Rotation","https://www.alphavantage.co/query",
        [{"name":"function","value":"SECTOR"},{"name":"apikey","value":AV}], xp(4),yp(1)))
    add(http_get("H5 — Insider Transactions","https://finnhub.io/api/v1/stock/insider-transactions",
        [{"name":"symbol","value":""},{"name":"from","value":"={{$json.thirtyDaysAgo}}"},
         {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}], xp(5),yp(1)))
    # GAP8 FIX: SEC User-Agent
    add(http_get("H6 — SEC 13F EDGAR","https://efts.sec.gov/LATEST/search-index",
        [{"name":"q","value":""},{"name":"dateRange","value":"custom"},
         {"name":"startdt","value":"={{$json.ninetyDaysAgo}}"},
         {"name":"enddt","value":"={{$json.today}}"},{"name":"forms","value":"13F-HR"}],
        xp(6),yp(1), hdrs=[{"name":"User-Agent","value":SEC_UA}]))
    add(http_get("H7 — Earnings Calendar","https://finnhub.io/api/v1/calendar/earnings",
        [{"name":"from","value":"={{$json.today}}"},{"name":"to","value":"={{$json.sevenDaysAgo}}"},
         {"name":"token","value":FINNHUB}], xp(7),yp(1)))

    # ── S2 TECHNICAL H8-H20 (2 rows) ──
    add(banner("S2 — TECHNICAL  |  H8-H20  Short Interest · ETF/Indices · RSI · MACD · BB · ADX · ATR · EMA · Stoch · Form 4", 2, rows=2))
    # GAP10 FIX: correct FINRA short sale endpoint
    add(http_get("H8 — FINRA Short Sale","https://api.finra.org/data/group/otcMarket/name/regShoDaily",
        [], xp(0),yp(2)))
    add(http_get("H9 — IPO Calendar","https://finnhub.io/api/v1/calendar/ipo",
        [{"name":"from","value":"={{$json.today}}"},{"name":"to","value":"={{$json.thirtyDaysAgo}}"},
         {"name":"token","value":FINNHUB}], xp(1),yp(2)))
    add(http_get("H10 — TD Indices","https://api.twelvedata.com/time_series",
        [{"name":"symbol","value":"SPY,QQQ,DIA,IWM"},{"name":"interval","value":"1day"},
         {"name":"outputsize","value":"20"},{"name":"apikey","value":TD}], xp(2),yp(2)))
    add(http_get("H11 — TD RSI","https://api.twelvedata.com/rsi",
        [{"name":"symbol","value":"SPY,QQQ,IWM,GLD,SLV"},{"name":"interval","value":"1day"},
         {"name":"time_period","value":"14"},{"name":"apikey","value":TD}], xp(3),yp(2)))
    add(http_get("H12 — TD MACD","https://api.twelvedata.com/macd",
        [{"name":"symbol","value":"SPY,QQQ,IWM"},{"name":"interval","value":"1day"},
         {"name":"fast_period","value":"12"},{"name":"slow_period","value":"26"},
         {"name":"signal_period","value":"9"},{"name":"apikey","value":TD}], xp(4),yp(2)))
    add(http_get("H13 — TD Bollinger","https://api.twelvedata.com/bbands",
        [{"name":"symbol","value":"SPY,QQQ"},{"name":"interval","value":"1day"},
         {"name":"time_period","value":"20"},{"name":"apikey","value":TD}], xp(5),yp(2)))
    add(http_get("H14 — TD ADX","https://api.twelvedata.com/adx",
        [{"name":"symbol","value":"SPY,QQQ,IWM"},{"name":"interval","value":"1day"},
         {"name":"time_period","value":"14"},{"name":"apikey","value":TD}], xp(6),yp(2)))
    # Row 2
    add(http_get("H15 — TD ATR","https://api.twelvedata.com/atr",
        [{"name":"symbol","value":"SPY,QQQ,IWM,SLV,AG"},{"name":"interval","value":"1day"},
         {"name":"time_period","value":"14"},{"name":"apikey","value":TD}], xp(0),yp(2,1)))
    add(http_get("H16 — TD EMA","https://api.twelvedata.com/ema",
        [{"name":"symbol","value":"SPY,QQQ"},{"name":"interval","value":"1day"},
         {"name":"time_period","value":"50"},{"name":"apikey","value":TD}], xp(1),yp(2,1)))
    # GAP8 FIX: SEC User-Agent
    add(http_get("H17 — SEC Form 4","https://efts.sec.gov/LATEST/search-index",
        [{"name":"q","value":""},{"name":"dateRange","value":"custom"},
         {"name":"startdt","value":"={{$json.sevenDaysAgo}}"},
         {"name":"enddt","value":"={{$json.today}}"},{"name":"forms","value":"4"}],
        xp(2),yp(2,1), hdrs=[{"name":"User-Agent","value":SEC_UA}]))
    add(http_get("H18 — TD Stochastic","https://api.twelvedata.com/stoch",
        [{"name":"symbol","value":"SPY,QQQ,IWM"},{"name":"interval","value":"1day"},
         {"name":"apikey","value":TD}], xp(3),yp(2,1)))
    add(http_get("H19 — Finnhub Recs","https://finnhub.io/api/v1/stock/recommendation",
        [{"name":"symbol","value":"AAPL"},{"name":"token","value":FINNHUB}], xp(4),yp(2,1)))
    add(http_get("H20 — TD Volume","https://api.twelvedata.com/time_series",
        [{"name":"symbol","value":"SPY,QQQ,IWM,SLV,GLD"},{"name":"interval","value":"1day"},
         {"name":"outputsize","value":"20"},{"name":"apikey","value":TD}], xp(5),yp(2,1)))

    # ── S3 INTELLIGENCE H21-H24 ──
    add(banner("S3 — INTELLIGENCE  |  H21 Congress Bills · H22 Whale 13F · H23 M&A 8-K · H24 Social Trending", 3))
    add(http_get("H21 — Congress Bills","https://api.congress.gov/v3/bill",
        [{"name":"format","value":"json"},{"name":"offset","value":"0"},{"name":"limit","value":"20"},
         {"name":"fromDateTime","value":"={{$json.thirtyDaysAgo}}T00:00:00Z"},
         {"name":"api_key","value":CONGRESS}], xp(0),yp(3)))
    # GAP8 FIX: SEC User-Agent
    add(http_get("H22 — SEC Whale 13F","https://efts.sec.gov/LATEST/search-index",
        [{"name":"q","value":""},{"name":"dateRange","value":"custom"},
         {"name":"startdt","value":"={{$json.ninetyDaysAgo}}"},
         {"name":"enddt","value":"={{$json.today}}"},
         {"name":"forms","value":"13F-HR,SC 13D,SC 13G"}],
        xp(1),yp(3), hdrs=[{"name":"User-Agent","value":SEC_UA}]))
    # GAP8 FIX: SEC User-Agent
    add(http_get("H23 — SEC 8-K","https://efts.sec.gov/LATEST/search-index",
        [{"name":"q","value":""},{"name":"dateRange","value":"custom"},
         {"name":"startdt","value":"={{$json.sevenDaysAgo}}"},
         {"name":"enddt","value":"={{$json.today}}"},{"name":"forms","value":"8-K"}],
        xp(2),yp(3), hdrs=[{"name":"User-Agent","value":SEC_UA}]))
    add(http_get("H24 — Yahoo Trending","https://query2.finance.yahoo.com/v1/finance/trending/US",
        [{"name":"count","value":"25"},{"name":"lang","value":"en-US"}], xp(3),yp(3)))

    # ── S4 MACRO H25-H29 ──
    add(banner("S4 — MACRO  |  H25 Earnings · H26 Economic Calendar · H27 FRED · H28 Geopolitical News · H29 Metals Spot", 4))
    add(http_get("H25 — Earnings Cal","https://finnhub.io/api/v1/calendar/earnings",
        [{"name":"from","value":"={{$json.today}}"},{"name":"to","value":"={{$json.sevenDaysAgo}}"},
         {"name":"token","value":FINNHUB}], xp(0),yp(4)))
    add(http_get("H26 — Economic Cal","https://finnhub.io/api/v1/calendar/economic",
        [{"name":"from","value":"={{$json.today}}"},{"name":"to","value":"={{$json.sevenDaysAgo}}"},
         {"name":"token","value":FINNHUB}], xp(1),yp(4)))
    add(http_get("H27 — FRED Macro","https://api.stlouisfed.org/fred/series/observations",
        [{"name":"series_id","value":"UNRATE"},{"name":"sort_order","value":"desc"},
         {"name":"limit","value":"5"},{"name":"file_type","value":"json"},
         {"name":"api_key","value":FRED_KEY}], xp(2),yp(4)))
    add(http_get("H28 — Geopolitical","https://newsapi.org/v2/everything",
        [{"name":"q","value":"trade war tariff sanctions geopolitical"},{"name":"language","value":"en"},
         {"name":"sortBy","value":"publishedAt"},{"name":"pageSize","value":"20"},
         {"name":"apiKey","value":NEWS}], xp(3),yp(4)))
    add(http_get("H29 — Metals Spot","https://api.metals.dev/v1/latest",
        [{"name":"api_key","value":METALS},{"name":"currency","value":"USD"},
         {"name":"unit","value":"toz"}], xp(4),yp(4)))

    # ── S5 INFLUENCE CHAIN H30-H36 (3 rows) ──
    add(banner("S5 — INFLUENCE CHAIN  |  H30 Congress Trades · H31 Bills · H32 Lobbying · H33 Contracts · H34 FEC · H36 LDA  →  H35 Correlator", 5, rows=3))
    add(http_get("H30 — Congress Trades","https://finnhub.io/api/v1/stock/congressional-trading",
        [{"name":"symbol","value":""},{"name":"from","value":"={{$json.thirtyDaysAgo}}"},
         {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}], xp(0),yp(5)))
    add(http_get("H31a — Congress Bills","https://api.congress.gov/v3/bill",
        [{"name":"format","value":"json"},{"name":"offset","value":"0"},{"name":"limit","value":"20"},
         {"name":"api_key","value":CONGRESS}], xp(1),yp(5)))
    add(http_get("H31b — Congress Amend","https://api.congress.gov/v3/amendment",
        [{"name":"format","value":"json"},{"name":"limit","value":"20"},
         {"name":"api_key","value":CONGRESS}], xp(2),yp(5)))
    add(http_get("H32 — LDA Lobbying","https://lda.senate.gov/api/v1/filings/",
        [{"name":"filing_type","value":"LD2"},{"name":"limit","value":"20"}], xp(3),yp(5)))
    # GAP5 FIX: POST body for USASpending
    add(http_post("H33 — USASpending","https://api.usaspending.gov/api/v2/search/spending_by_award/",
        ('={"filters":{"time_period":[{"start_date":"{{$json.thirtyDaysAgo}}",'
         '"end_date":"{{$json.today}}"}],"award_type_codes":["A","B","C","D"]},'
         '"fields":["Award ID","Recipient Name","Award Amount","Awarding Agency",'
         '"Description","Action Date","NAICS Code"],"page":1,"limit":15,'
         '"sort":"Award Amount","order":"desc"}'),
        xp(4),yp(5), to=45000))
    add(http_get("H34 — FEC","https://api.open.fec.gov/v1/schedules/schedule_a/",
        [{"name":"sort_hide_null","value":"false"},{"name":"per_page","value":"20"},
         {"name":"sort","value":"-contribution_receipt_amount"},{"name":"api_key","value":FEC}],
        xp(5),yp(5)))
    add(http_get("H36 — LDA Recent","https://lda.senate.gov/api/v1/contributions/",
        [{"name":"limit","value":"20"}], xp(6),yp(5)))

    # Row 1: H31 committee merge + normalizers
    add(merge("H31 Committee Merge", xp(1)+250, yp(5,1), n=2))
    add(code("H30-Normalize", H30N, xp(0), yp(5,1)))
    add(code("H31-Normalize", H31N, xp(2), yp(5,1)))
    add(code("H32-Normalize", H32N, xp(3), yp(5,1)))
    add(code("H33-Normalize", H33N, xp(4), yp(5,1)))
    add(code("H34-Normalize", H34N, xp(5), yp(5,1)))
    add(code("H36-Normalize", H36N, xp(6), yp(5,1)))

    # Row 2: Influence merge → H35
    add(merge("Influence Merge", xp(3), yp(5,2), n=6))
    add(code("H35 — Influence Correlator", H35C, xp(3), yp(5,2)+290))

    # ── S6 CORRELATION + KILL SWITCH (3 rows) ──
    add(banner("S6 — CORRELATION & KILL SWITCH  |  H37 DXY · H38 10Y Yield · H39 ETF Flow · H40 GEX · H41 Lease Rates · H42 COMEX  →  Gate 9", 6, rows=3))
    add(http_get("H37 — FRED DXY","https://api.stlouisfed.org/fred/series/observations",
        [{"name":"series_id","value":"DTWEXBGS"},{"name":"sort_order","value":"desc"},
         {"name":"limit","value":"25"},{"name":"file_type","value":"json"},
         {"name":"api_key","value":FRED_KEY}], xp(0),yp(6)))
    add(http_get("H38 — FRED 10Y","https://api.stlouisfed.org/fred/series/observations",
        [{"name":"series_id","value":"DGS10"},{"name":"sort_order","value":"desc"},
         {"name":"limit","value":"25"},{"name":"file_type","value":"json"},
         {"name":"api_key","value":FRED_KEY}], xp(1),yp(6)))
    add(http_get("H39a — SLV","https://finnhub.io/api/v1/stock/candle",
        [{"name":"symbol","value":"SLV"},{"name":"resolution","value":"D"},
         {"name":"from","value":"={{$json.thirtyDaysAgo}}"},
         {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}], xp(2),yp(6)))
    add(http_get("H39b — GLD","https://finnhub.io/api/v1/stock/candle",
        [{"name":"symbol","value":"GLD"},{"name":"resolution","value":"D"},
         {"name":"from","value":"={{$json.thirtyDaysAgo}}"},
         {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}], xp(3),yp(6)))
    add(http_get("H39c — SIL","https://finnhub.io/api/v1/stock/candle",
        [{"name":"symbol","value":"SIL"},{"name":"resolution","value":"D"},
         {"name":"from","value":"={{$json.thirtyDaysAgo}}"},
         {"name":"to","value":"={{$json.today}}"},{"name":"token","value":FINNHUB}], xp(4),yp(6)))
    add(http_get("H40 — GEX Options","https://api.barchart.com/v2/options/chain/getChain",
        [{"name":"symbol","value":"SLV"},
         {"name":"fields","value":"delta,gamma,openInterest,volume"},
         {"name":"expirationType","value":"weekly"}], xp(5),yp(6)))
    # GAP11 FIX: FRED gold series instead of Kitco browser page
    add(http_get("H41 — FRED Gold Series","https://api.stlouisfed.org/fred/series/observations",
        [{"name":"series_id","value":"GOLDAMGBD228NLBM"},{"name":"sort_order","value":"desc"},
         {"name":"limit","value":"5"},{"name":"file_type","value":"json"},
         {"name":"api_key","value":FRED_KEY}], xp(6),yp(6)))
    add(http_get("H42 — COMEX Inventory","https://www.metalcharts.org/api/comex/silver/inventory",
        [], xp(7),yp(6)))

    # Row 1: Calc nodes
    add(code("H37-CALC DXY", H37C, xp(0), yp(6,1)))
    add(code("H38-CALC Yield", H38C, xp(1), yp(6,1)))
    add(merge("H39 ETF Merge", xp(3), yp(6,1), n=3))
    add(code("H39-CALC Flow", H39C, xp(3), yp(6,1)+290))

    # Row 2: Merge chain → Gate 9 → Kill Switch (centered under row 1)
    add(merge("Correlation Signal Merge", xp(0)+250, yp(6,2), n=2))
    add(merge("Correlation Full Merge",   xp(1)+250, yp(6,2)+270, n=2))
    add(code("GATE 9 — Correlation Check", GATE9, xp(2), yp(6,2)+540))
    add(ifnode("Kill Switch Decision","={{$json.kill_switch}}",True, xp(2),yp(6,2)+810))
    add(tg("KILL SWITCH ALERT", KILL_MSG, xp(0)+250, yp(6,2)+1080))
    add(noop("Kill Switch Log", xp(0)+250, yp(6,2)+1350))

    # ── S7 CONSOLIDATION ──
    add(banner("S7 — CONSOLIDATION  |  All H modules + Correlation Gate output  →  Master Merge  →  Data Aggregator", 7))
    add(merge("HUNTER MASTER MERGE", xp(3), yp(7), n=10))
    add(code("DATA AGGREGATOR", DATA_AGG, xp(3), yp(7,1)))

    # ── S8 AGENT PASS ──
    add(banner("S8 — HUNTER AGENT PASS  |  URIEL · COLOSSUS · HANIEL · RAZIEL  →  Synthesis  (pure opportunity discovery — no portfolio context)", 8, rows=2))
    add(note("**Option C — Dual Layer**\n"
             "HUNTER agents: opportunity discovery, no portfolio awareness\n"
             "CIL (S9): trade confirmation with IRONCLAD + portfolio context\n"
             "Same Collective, different mandates, different instructions.",
             xp(6), yp(8)-10, w=600, h=150))

    # URIEL — OpenAI (gpt-4.1)
    add(http_post("URIEL — Strategic Opportunity","https://api.openai.com/v1/chat/completions",
        f'={{"model":"gpt-4.1","max_tokens":2000,"messages":[{{"role":"system","content":{U_SYS}}},{{"role":"user","content":{{{{$json.hunter_payload}}}}}}]}}',
        xp(0),yp(8), hdrs=[{"name":"Authorization","value":f"Bearer {OPENAI}"}], to=60000))

    # COLOSSUS — xAI (GAP6 FIX: grok-3)
    add(http_post("COLOSSUS — Technical Setups","https://api.x.ai/v1/chat/completions",
        f'={{"model":"grok-3","max_tokens":2000,"messages":[{{"role":"system","content":{C_SYS}}},{{"role":"user","content":{{{{$json.hunter_payload}}}}}}]}}',
        xp(1),yp(8), hdrs=[{"name":"Authorization","value":f"Bearer {XAI}"}], to=60000))

    # GAP2 FIX: Formatter code node before Gemini HTTP call
    add(code("HANIEL Payload Format", HANIEL_FMT, xp(2), yp(8)))
    add(http_post("HANIEL — Intelligence Signals",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        "={{$json.gemini_body}}",
        xp(2),yp(8,1), hdrs=[{"name":"x-goog-api-key","value":GOOGLE}], to=60000))

    # RAZIEL — DeepSeek (GAP7: deepseek-reasoner is correct for R1)
    add(http_post("RAZIEL — Counter Thesis","https://api.deepseek.com/v1/chat/completions",
        f'={{"model":"deepseek-reasoner","max_tokens":2000,"messages":[{{"role":"system","content":{R_SYS}}},{{"role":"user","content":{{{{$json.hunter_payload}}}}}}]}}',
        xp(3),yp(8), hdrs=[{"name":"Authorization","value":f"Bearer {DEEPSEEK}"}], to=90000))

    add(merge("HUNTER AGENT MERGE", xp(1)+250, yp(8,1)+270, n=4))
    add(code("HUNTER SYNTHESIS — MICHA", SYNTH, xp(1)+250, yp(8,1)+540))

    # ── S9 DELIVERY ──
    add(banner("S9 — DELIVERY  |  Telegram Morning Brief  ·  CIL v6.1 Webhook (Top 3 PRIME → Trade Confirmation)  ·  GitHub Archive", 9))
    add(code("Format Telegram Brief", FMT_TG, xp(0), yp(9)))
    add(tg("Send Telegram Brief","={{$json.message}}", xp(0),yp(9,1)))
    # GAP3 FIX: CIL fires with body
    add(code("Fire CIL Webhook", FIRE_CIL, xp(2), yp(9)))
    add(http_post("CIL v6.1 Webhook", f"={CIL_WH}", "={{$json.cil_payload}}",
        xp(2),yp(9,1), to=60000))
    # GAP4 FIX: GitHub uses http_put with body
    add(code("GitHub Archive Prep", GH_PREP, xp(4), yp(9)))
    add(http_put("GitHub Archive Write",
        "https://api.github.com/repos/Barefootservants2/AIORA/contents/={{$json.github_path}}",
        "={{$json.github_put_body}}",
        xp(4),yp(9,1),
        hdrs=[{"name":"Authorization","value":f"token {GH_TOKEN}"},
              {"name":"Accept","value":"application/vnd.github.v3+json"}]))

    return nodes, ids


# ── CONNECTIONS ──────────────────────────────

def connections(nodes):
    cm = {}
    def e(src, dst, so=0, di=0):
        if src not in cm: cm[src]={"main":[]}
        while len(cm[src]["main"])<=so: cm[src]["main"].append([])
        cm[src]["main"][so].append({"node":dst,"type":"main","index":di})

    ALL_H = [
        "H1 — Volume Anomaly","H2a — AV Top Movers","H2b — News Velocity",
        "H3 — Options Flow","H4 — Sector Rotation","H5 — Insider Transactions",
        "H6 — SEC 13F EDGAR","H7 — Earnings Calendar",
        "H8 — FINRA Short Sale","H9 — IPO Calendar","H10 — TD Indices",
        "H11 — TD RSI","H12 — TD MACD","H13 — TD Bollinger","H14 — TD ADX",
        "H15 — TD ATR","H16 — TD EMA","H17 — SEC Form 4","H18 — TD Stochastic",
        "H19 — Finnhub Recs","H20 — TD Volume",
        "H21 — Congress Bills","H22 — SEC Whale 13F","H23 — SEC 8-K","H24 — Yahoo Trending",
        "H25 — Earnings Cal","H26 — Economic Cal","H27 — FRED Macro",
        "H28 — Geopolitical","H29 — Metals Spot",
        "H30 — Congress Trades","H31a — Congress Bills","H31b — Congress Amend",
        "H32 — LDA Lobbying","H33 — USASpending","H34 — FEC","H36 — LDA Recent",
        "H37 — FRED DXY","H38 — FRED 10Y",
        "H39a — SLV","H39b — GLD","H39c — SIL",
        "H40 — GEX Options","H41 — FRED Gold Series","H42 — COMEX Inventory",
    ]

    # S0 → Date Setup
    for t in ["Schedule 6AM ET","Schedule 12:30PM ET","Manual Trigger"]:
        e(t,"Date Setup")
    # Date Setup → all H nodes
    for h in ALL_H:
        e("Date Setup",h)

    # S5 Influence chain
    e("H31a — Congress Bills",  "H31 Committee Merge",0,0)
    e("H31b — Congress Amend",  "H31 Committee Merge",0,1)
    e("H30 — Congress Trades",  "H30-Normalize")
    e("H31 Committee Merge",    "H31-Normalize")
    e("H32 — LDA Lobbying",     "H32-Normalize")
    e("H33 — USASpending",      "H33-Normalize")
    e("H34 — FEC",              "H34-Normalize")
    e("H36 — LDA Recent",       "H36-Normalize")
    e("H30-Normalize","Influence Merge",0,0)
    e("H31-Normalize","Influence Merge",0,1)
    e("H32-Normalize","Influence Merge",0,2)
    e("H33-Normalize","Influence Merge",0,3)
    e("H34-Normalize","Influence Merge",0,4)
    e("H36-Normalize","Influence Merge",0,5)
    e("Influence Merge","H35 — Influence Correlator")

    # S6 Correlation chain
    e("H37 — FRED DXY","H37-CALC DXY")
    e("H38 — FRED 10Y","H38-CALC Yield")
    e("H39a — SLV","H39 ETF Merge",0,0)
    e("H39b — GLD","H39 ETF Merge",0,1)
    e("H39c — SIL","H39 ETF Merge",0,2)
    e("H39 ETF Merge","H39-CALC Flow")
    e("H37-CALC DXY",  "Correlation Signal Merge",0,0)
    e("H38-CALC Yield","Correlation Signal Merge",0,1)
    e("Correlation Signal Merge","Correlation Full Merge",0,0)
    e("H39-CALC Flow",           "Correlation Full Merge",0,1)
    e("Correlation Full Merge","GATE 9 — Correlation Check")
    e("GATE 9 — Correlation Check","Kill Switch Decision")
    e("Kill Switch Decision","KILL SWITCH ALERT",0,0)   # true = kill
    e("Kill Switch Decision","HUNTER MASTER MERGE",1,0) # false = proceed
    e("KILL SWITCH ALERT","Kill Switch Log")

    # S7 Master merge: all H data nodes + H35 + H40/H41/H42 correlation modules
    MASTER_FEEDS = [
        "H1 — Volume Anomaly","H2a — AV Top Movers","H2b — News Velocity",
        "H3 — Options Flow","H4 — Sector Rotation","H5 — Insider Transactions",
        "H6 — SEC 13F EDGAR","H7 — Earnings Calendar",
        "H8 — FINRA Short Sale","H9 — IPO Calendar","H10 — TD Indices",
        "H11 — TD RSI","H12 — TD MACD","H13 — TD Bollinger","H14 — TD ADX",
        "H15 — TD ATR","H16 — TD EMA","H17 — SEC Form 4","H18 — TD Stochastic",
        "H19 — Finnhub Recs","H20 — TD Volume",
        "H21 — Congress Bills","H22 — SEC Whale 13F","H23 — SEC 8-K","H24 — Yahoo Trending",
        "H25 — Earnings Cal","H26 — Economic Cal","H27 — FRED Macro",
        "H28 — Geopolitical","H29 — Metals Spot",
        "H35 — Influence Correlator",
        "H40 — GEX Options","H41 — FRED Gold Series","H42 — COMEX Inventory",
    ]
    for i,h in enumerate(MASTER_FEEDS):
        e(h,"HUNTER MASTER MERGE",0,i+1)
    e("HUNTER MASTER MERGE","DATA AGGREGATOR")

    # S8 Agent pass
    e("DATA AGGREGATOR","URIEL — Strategic Opportunity")
    e("DATA AGGREGATOR","COLOSSUS — Technical Setups")
    e("DATA AGGREGATOR","HANIEL Payload Format")
    e("HANIEL Payload Format","HANIEL — Intelligence Signals")
    e("DATA AGGREGATOR","RAZIEL — Counter Thesis")
    e("URIEL — Strategic Opportunity", "HUNTER AGENT MERGE",0,0)
    e("COLOSSUS — Technical Setups",   "HUNTER AGENT MERGE",0,1)
    e("HANIEL — Intelligence Signals", "HUNTER AGENT MERGE",0,2)
    e("RAZIEL — Counter Thesis",       "HUNTER AGENT MERGE",0,3)
    e("HUNTER AGENT MERGE","HUNTER SYNTHESIS — MICHA")

    # S9 Delivery
    e("HUNTER SYNTHESIS — MICHA","Format Telegram Brief")
    e("HUNTER SYNTHESIS — MICHA","Fire CIL Webhook")
    e("HUNTER SYNTHESIS — MICHA","GitHub Archive Prep")
    e("Format Telegram Brief","Send Telegram Brief")
    e("Fire CIL Webhook","CIL v6.1 Webhook")
    e("GitHub Archive Prep","GitHub Archive Write")

    return cm


# ── MAIN ─────────────────────────────────────

def main():
    print("Building HUNTER v3.1...")
    nodes, ids = build()
    cm = connections(nodes)

    wf = {
        "name": "HUNTER — Market-Wide Discovery v3.1",
        "nodes": nodes, "connections": cm, "active": False,
        "settings": {"executionOrder":"v1","saveManualExecutions":True,
                     "callerPolicy":"workflowsFromSameOwner"},
        "tags": ["HUNTER","Production","METATRON-v10.8","v3.1"],
        "meta": {"description":
            "HUNTER v3.1 — H1-H42, 10 sections S0-S9, dual-layer AI (Option C), "
            "all 12 v3.0 gaps fixed. METATRON v10.8 | March 30 2026"}
    }

    try:
        raw = json.dumps(wf, indent=2)
        json.loads(raw)
        print("JSON round-trip: PASS")
    except Exception as ex:
        print(f"JSON FAILED: {ex}"); sys.exit(1)

    h_names = [n["name"] for n in nodes if n["name"].startswith("H")
               and n["type"] != "n8n-nodes-base.stickyNote"]
    disc = [h for h in h_names if h not in cm]
    if disc: print(f"WARN disconnected: {disc}")
    else:    print("All H-nodes wired: PASS")

    http_ct  = sum(1 for n in nodes if n["type"]=="n8n-nodes-base.httpRequest")
    code_ct  = sum(1 for n in nodes if n["type"]=="n8n-nodes-base.code")
    total_e  = sum(len(ol) for v in cm.values() for ol in v.get("main",[]))

    out = "HUNTER_MARKET_WORKFLOW_v3.1.json"
    with open(out,"w") as f: f.write(raw)

    print(f"\nWritten: {out}")
    print(f"  Nodes total : {len(nodes)}")
    print(f"  HTTP nodes  : {http_ct}")
    print(f"  Code nodes  : {code_ct}")
    print(f"  Edge count  : {total_e}")
    print(f"\nImport URL (after push):")
    print("  https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols"
          "/main/N8N/WORKFLOWS/HUNTER_MARKET_WORKFLOW_v3.1.json")

if __name__ == "__main__":
    main()
