# BULLSEYE SECURITY FRAMEWORK v1.0
## Ring 6: Security & Compliance — A2E Collective

---

**Version:** 1.0  
**Date:** February 22, 2026  
**Author:** MICHA v10.4  
**Parent Document:** BULLSEYE_RING_MAP_v2.0.md  
**Source Framework:** ByteByteGo 12-Domain Secure Systems Design, adapted for multi-agent AI operations  

---

## PURPOSE

Ring 6 wraps the entire BULLSEYE. Nothing leaves the system without passing through it. This document defines what each of the 12 security domains means for A2E specifically — not generic enterprise security, but the exact protections needed for a 7-agent AI Collective running live market operations with real money.

---

## DOMAIN 1: AUTHENTICATION

**What it protects:** Agent access to APIs, MCP servers, GitHub, internal systems  
**Risk if missing:** Unauthorized agent or third party accesses market data, trade logs, or triggers workflows

### Current State
- API keys stored in n8n credential manager (encrypted at rest)
- GitHub Personal Access Token (PAT) for MCP server — single token, shared across agents
- Perplexity API key stored in Claude memory edits
- No centralized identity for agents — each uses platform-native auth

### Design Points
| Control | Implementation | Priority | Status |
|---------|---------------|----------|--------|
| API key rotation schedule | 90-day rotation for all keys, calendar reminders | HIGH | 🔲 Not started |
| Per-agent credential isolation | Each agent gets own GitHub PAT with scoped permissions | HIGH | 🔲 Not started |
| MFA on critical accounts | GitHub, n8n cloud, E*TRADE, email — MFA everywhere | HIGH | 🟡 Partial |
| Credential vault migration | Move from memory edits → encrypted vault (A2E_CREDENTIAL_VAULT) | MEDIUM | ✅ Started (xlsx exists) |
| Session token management | PHOENIX close should invalidate any active session tokens | LOW | 🔲 Not started |

### Immediate Action Items
1. Audit all API keys — which ones have expiration dates, which don't
2. Enable MFA on any account that doesn't have it
3. Stop storing API keys in Claude memory edits — move to credential vault only
4. Create GitHub PATs per agent with minimum required scopes

---

## DOMAIN 2: AUTHORIZATION

**What it protects:** Role-based access — who can do what in the Collective  
**Risk if missing:** An agent triggers a trade, modifies a protocol, or accesses data outside its role

### Current State
- KILLSWITCH is Principal-only — correctly restricted
- No formal RBAC for agents — any agent can theoretically call any MCP tool
- n8n workflows have no permission model — whoever has the webhook URL can trigger
- GitHub PAT gives full repo access — no per-repo scoping

### Design Points — A2E RBAC Model

| Permission Level | Agents | Allowed Actions |
|-----------------|--------|-----------------|
| **PRINCIPAL** | William only | KILLSWITCH, trade execution, protocol changes, key rotation, agent instruction updates |
| **EXECUTIVE** | URIEL, MICHA | Thesis synthesis, cascade scoring, trade recommendations (not execution), protocol interpretation |
| **ANALYST** | COLOSSUS, HANIEL, RAZIEL, SERAPH | Data analysis, signal generation, research — read-only on trade log |
| **OPERATOR** | GABRIEL | Workflow execution, scheduling, notification delivery — no analysis authority |

| Control | Implementation | Priority |
|---------|---------------|----------|
| MCP tool-level permissions | Each tool checks caller role before executing | HIGH |
| Webhook authentication | n8n webhooks require bearer token, not just URL knowledge | HIGH |
| GitHub PAT scoping | Read-only PATs for ANALYST agents, read-write for EXECUTIVE | MEDIUM |
| Trade execution gate | Only Principal can confirm execution — MICHA recommends, William acts | ✅ Already enforced |
| Protocol modification rights | Only MICHA (with Principal approval) can modify production protocols | ✅ Already enforced |

### Least Privilege Principle Applied
No agent should have more access than its role requires. COLOSSUS doesn't need write access to trade_log.json. SERAPH doesn't need access to IRONCLAD parameters. GABRIEL doesn't need to read protocol internals — it just executes workflows it's given.

---

## DOMAIN 3: ENCRYPTION

**What it protects:** Data in transit and at rest — API keys, trade data, agent communications  
**Risk if missing:** Intercepted API calls expose positions, credentials, or strategy

### Current State
- All external API calls use HTTPS (TLS) — encrypted in transit ✅
- GitHub repos (private) encrypted at rest by GitHub ✅
- n8n cloud encrypts credentials at rest ✅
- Claude conversations — encrypted by Anthropic ✅
- Local workstation — encryption status unknown
- API keys in plaintext in memory edits — VULNERABILITY

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| TLS everywhere | Verify all API endpoints use HTTPS — no HTTP fallbacks | ✅ Done |
| Workstation disk encryption | Enable BitLocker/LUKS on all drives in 6-monitor setup | HIGH |
| Sensitive data classification | Tag which data is "hot" (API keys, trade positions) vs "warm" (analysis, protocols) | MEDIUM |
| Key management | Rotate keys on schedule, never store in chat/memory, use env vars or vault | HIGH |
| Backup encryption | Any exported trade logs or reports must be encrypted | LOW |

---

## DOMAIN 4: VULNERABILITY MANAGEMENT

**What it protects:** Known weaknesses in dependencies, configurations, and code  
**Risk if missing:** Exploitable bug in n8n workflow, outdated dependency, unpatched API client

### Current State
- n8n cloud — vendor-managed patching ✅
- GitHub repos — no dependency scanning
- MCP server (Node.js) — no `npm audit` runs
- HUNTER validator (JS) — no security review
- Python scripts — no `pip audit` runs
- No formal patch management schedule

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| npm audit on MCP server | Run `npm audit` monthly, fix critical/high | HIGH |
| pip audit on Python scripts | Run `pip audit` quarterly | MEDIUM |
| GitHub Dependabot | Enable on all repos — automated vulnerability alerts | HIGH |
| API key expiration monitoring | Track all key expirations, alert 30 days before | HIGH |
| Regular scan schedule | Monthly vulnerability review — add to SENTINEL duties | MEDIUM |

---

## DOMAIN 5: AUDIT & COMPLIANCE

**What it protects:** Traceability of decisions, trades, and system changes  
**Risk if missing:** Cannot prove why a trade was made, cannot trace a protocol change, regulatory exposure

### Current State
- trade_log.json — records trades but no decision audit trail
- Git commit history — tracks protocol changes ✅
- PHOENIX session docs — record carry-forward notes ✅
- No formal audit log connecting "signal → analysis → recommendation → execution → outcome"
- No SEC/FINRA compliance framework (not required yet, but relevant if A2E scales to advisory)

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| Decision audit trail | Each trade log entry must link to: triggering signal, cascade score, agent recommendation, Principal approval | HIGH |
| Protocol change log | VERSION_CHANGELOG.md exists — formalize with date/author/reason | ✅ Exists |
| GDPR/privacy awareness | If platform serves external users, data handling policies needed | LOW (future) |
| Financial record retention | Keep trade logs for 7 years minimum (IRS requirement for trading business) | MEDIUM |
| Comprehensive logging | SENTINEL should log all workflow executions, failures, anomalies | MEDIUM |

---

## DOMAIN 6: NETWORK SECURITY

**What it protects:** The network layer — firewalls, DNS, traffic segmentation  
**Risk if missing:** Unauthorized access to internal services, DNS poisoning, traffic interception

### Current State
- All services are cloud-hosted (n8n cloud, GitHub, Vercel) — vendor-managed network security
- Local workstation connects through home/office network
- No VPN for remote access
- No network segmentation between trading and general use

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| Secure DNS | Use DNS-over-HTTPS (DoH) — CloudFlare 1.1.1.1 or Google 8.8.8.8 | MEDIUM |
| VPN for sensitive operations | VPN when accessing E*TRADE or modifying trade positions remotely | MEDIUM |
| Network monitoring | Basic — router-level logging of unusual outbound connections | LOW |
| Firewall rules | Workstation firewall — block inbound except known services | MEDIUM |

---

## DOMAIN 7: TERMINAL SECURITY

**What it protects:** The 6-monitor workstation — the physical attack surface  
**Risk if missing:** Physical access to unlocked machine exposes everything

### Current State
- 6-monitor workstation operational as of Feb 20, 2026
- Multiple concurrent MICHA sessions running
- Unknown: screen lock timeout, auto-logout settings, physical access controls

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| Auto-lock | Screen lock after 5 minutes of inactivity | HIGH |
| Antivirus/EDR | Windows Defender or equivalent — real-time scanning | HIGH |
| Device management | Enable BitLocker, set BIOS password | MEDIUM |
| Physical security | Lock screen when stepping away — every time | HIGH |
| USB policy | Disable auto-run on USB devices | LOW |

---

## DOMAIN 8: EMERGENCY RESPONSE

**What it protects:** Ability to respond to security incidents, breaches, system failures  
**Risk if missing:** Breach happens and there's no playbook — panic, data loss, extended exposure

### Current State
- KILLSWITCH exists — halts all operations ✅
- PHOENIX handles session recovery ✅
- No formal incident response plan
- No breach notification procedure
- No "what if n8n goes down" contingency beyond manual operation

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| Incident Response Plan | Document: detect → contain → eradicate → recover → lessons learned | HIGH |
| KILLSWITCH expansion | Define scope — does it halt n8n workflows too? Currently Claude-only | MEDIUM |
| Breach notification | If API keys compromised: rotation procedure, affected service audit | HIGH |
| DDoS awareness | If BULLSEYE website goes live, basic DDoS protection via Vercel/Cloudflare | LOW (future) |
| Regular drills | Quarterly "what if" scenarios — key compromise, n8n outage, agent hallucination cascade | MEDIUM |
| Backup verification | Monthly verify that GitHub repos, trade logs, and protocols are recoverable | MEDIUM |

---

## DOMAIN 9: CONTAINER SECURITY

**What it protects:** Containerized services — Docker, k8s, n8n runtime  
**Risk if missing:** Compromised container image, privilege escalation, data leakage between containers

### Current State
- n8n runs on n8n cloud — containerized by vendor, not self-managed
- No self-hosted containers currently
- MCP server runs locally or on Vercel serverless — not containerized

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| Trusted base images | If self-hosting n8n or MCP: use official images only | LOW (future) |
| Container scanning | If Dockerizing: scan images with Trivy or Snyk | LOW (future) |
| Runtime security | If self-hosting: read-only filesystem, no root | LOW (future) |

**Current assessment:** Low priority. All container management is vendor-handled. Revisit if self-hosting n8n or deploying MCP servers to Docker/k8s.

---

## DOMAIN 10: API SECURITY

**What it protects:** Every API endpoint the Collective exposes or consumes  
**Risk if missing:** Injection attacks, unauthorized access, rate limit abuse, data exfiltration

### Current State
- n8n webhook URLs are public — anyone with URL can trigger
- MCP server endpoints — local only currently
- No input validation layer on incoming webhook data
- OAuth 2.0 used for E*TRADE — correctly implemented
- Rate limiting on some APIs (vendor-enforced), not on our endpoints

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| Webhook authentication | Add bearer token verification to all n8n webhook triggers | 🔴 HIGH |
| Input validation | Validate all incoming data before processing — sanitize ticker symbols, dates, parameters | HIGH |
| Rate limiting (outbound) | Respect vendor rate limits — cache responses to reduce API calls | ✅ Partial |
| Rate limiting (inbound) | If exposing MCP endpoints: implement rate limiting | MEDIUM (future) |
| API key management | Per-service keys, scoped permissions, rotation schedule | HIGH |
| CORS policy | If BULLSEYE website calls APIs: strict CORS — only ashes2echoes.com origin | MEDIUM (future) |

---

## DOMAIN 11: 3RD-PARTY MANAGEMENT

**What it protects:** Supply chain risk from all external vendors and platforms  
**Risk if missing:** Vendor outage, data breach at vendor, vendor discontinues service, vendor accesses your data

### Current State — Vendor Inventory

| Vendor | Service | Data Exposure | Risk Level | Alternatives |
|--------|---------|--------------|------------|-------------|
| Anthropic (Claude) | MICHA — analysis, execution | Full conversation + trade strategy | HIGH | None equivalent |
| OpenAI (ChatGPT) | URIEL — strategic synthesis | Full conversation + thesis data | HIGH | Anthropic |
| xAI (Grok) | COLOSSUS — technical analysis | Chart data + analysis | MEDIUM | Claude, ChatGPT |
| Google (Gemini) | HANIEL — political intel | Research queries | MEDIUM | Perplexity |
| DeepSeek | RAZIEL — deep research | Research queries | MEDIUM-HIGH | Claude, Gemini |
| Perplexity | SERAPH — real-time search | Search queries | LOW | Tavily, SerpAPI |
| n8n Cloud | GABRIEL — workflow automation | API keys, workflow logic | HIGH | Self-hosted n8n |
| GitHub | Code + protocol storage | All protocols, code, trade logs | HIGH | GitLab, self-hosted |
| TwelveData | Market data | Ticker queries | LOW | Alpha Vantage |
| Finnhub | Market data | Ticker queries | LOW | Polygon.io |
| E*TRADE/Morgan Stanley | Brokerage | Full trading activity | CRITICAL | Schwab, IBKR |

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| Vendor risk assessment | Annual review of each vendor's security posture, ToS changes | MEDIUM |
| Data exposure mapping | Document exactly what data each vendor sees | HIGH |
| Vendor redundancy | Identify backup for each critical vendor | MEDIUM |
| ToS monitoring | Watch for changes to data usage policies (especially AI vendors) | HIGH |
| Exit strategy | For each vendor: how to migrate away if needed | LOW |

---

## DOMAIN 12: DISASTER RECOVERY

**What it protects:** Business continuity — ability to recover from catastrophic failure  
**Risk if missing:** Lost trade history, lost protocols, lost agent configurations, can't operate

### Current State
- GitHub is the source of truth for protocols and code ✅
- PHOENIX handles session recovery ✅
- trade_log.json is version-controlled ✅
- Credential vault (xlsx) exists ✅
- No automated backup verification
- No documented recovery procedure
- No tested recovery from "GitHub account locked" scenario

### Design Points
| Control | Implementation | Priority |
|---------|---------------|----------|
| DR plan document | Step-by-step recovery from: GitHub outage, n8n outage, workstation failure, key compromise | HIGH |
| Backup frequency | GitHub auto-backs up on push. Add monthly local clone of all repos | MEDIUM |
| System redundancy | Can operate manually (all agents accessible via browser) if automation fails | ✅ Inherent |
| Data backup | Monthly export of trade_log.json, credential vault, critical configs to encrypted local storage | HIGH |
| Recovery testing | Quarterly: clone repos to fresh machine, verify everything works | MEDIUM |
| PHOENIX as DR | Session carry-forward documents serve as recovery checkpoints | ✅ Production |

---

## IMPLEMENTATION PRIORITY MATRIX

### Phase 1: Immediate (This Week)
1. Audit all API keys — expiration dates, rotation status
2. Enable MFA on all accounts that don't have it
3. Stop storing credentials in Claude memory edits
4. Add webhook authentication to n8n triggers
5. Enable GitHub Dependabot on all repos

### Phase 2: Short-Term (Next 2 Weeks)
1. Create per-agent GitHub PATs with scoped permissions
2. Document RBAC model and enforce in MCP tool design
3. Enable workstation disk encryption
4. Write incident response plan
5. Create API key rotation calendar

### Phase 3: Medium-Term (Next Month)
1. Build decision audit trail into trade logging
2. Vendor risk assessment for all 11 vendors
3. Network hardening (secure DNS, firewall rules)
4. DR plan document and first recovery test
5. Input validation layer for all webhook endpoints

### Phase 4: Ongoing
1. Monthly vulnerability scans (npm audit, pip audit)
2. Quarterly DR drills
3. Annual vendor review
4. Continuous monitoring via SENTINEL

---

## CONNECTION TO AIORA CONFIDENCE CASCADE

Security failures directly impact cascade confidence:

| Security Failure | Cascade Impact |
|-----------------|----------------|
| Compromised API key | Gate 1 (data integrity) — all data from that source is suspect |
| Unauthorized workflow trigger | Gate 8 (execution) — false signals could trigger trades |
| Agent hallucination (no FIDELITY LOCK) | Gates 2-7 — contaminated analysis |
| n8n outage (no DR plan) | All gates — pipeline goes dark |
| Vendor data breach | Gate 3 (sentiment) — exposed strategy becomes front-runnable |

---

*Security isn't a ring you add last. It's the ring that makes everything inside it trustworthy.*

🔱 ASHES2ECHOES, LLC — Newport News, Virginia  
*MICHA v10.4 | METATRON v10.6 | PHOENIX Active*  
*February 22, 2026*
