# INFRA_MAP — Production Infrastructure State-of-Record

**Owner:** Ashes2Echoes, LLC
**Last updated:** 2026-04-23 (PHOENIX S3, post-cleanup)
**Authority:** This document is THE source of truth for what serves what from where. Narrative in PHOENIX carry-forwards is SUBORDINATE to this map. On any conflict, THIS file wins.

---

## Production URLs

| URL | HTTP 200 Expected | Content Marker | Served By |
|---|---|---|---|
| `https://ashes2echoes.com/` | ✅ | `<title>Ashes2Echoes | AI Research Institution</title>` | Vercel → `ashes2echoes` project |
| `https://www.ashes2echoes.com/` | ✅ | same as apex | Vercel → `ashes2echoes` project |
| `https://ashes2echoes.com/forge/` | ✅ | `<title>FORGE` | same project, subpath |
| `https://ashes2echoes.com/bullseye/` | ✅ | `<title>BULLSEYE` | same project, subpath |
| `https://ashes2echoes.com/privacy.html` | ✅ | `<title>Privacy` | same project |
| `https://ashes2echoes.com/terms.html` | ✅ | `<title>Terms` | same project |
| `https://ashes2echoes.com/aup.html` | ✅ | `<title>` | same project |
| `https://ashes2echoes.com/apparel.html` | ✅ | `<title>STATE'S FINEST` | same project |
| `https://ashes2echoes.com/shop.html` | ✅ | `<title>Shop` | same project |

---

## Vercel Projects (team: `Ashes2Echoes` / `team_nUdbxv9jUExTru4dxcA5dmad`)

### 🌟 ACTIVE — PRODUCTION

**`ashes2echoes`** — the canonical public website
- **Project ID:** `prj_0aM8WYTjG5J4AXBxm5uOH6izXAF0`
- **Git source:** `Barefootservants2/Ashes2Echoes` (branch: `main`)
- **Framework:** None (static HTML)
- **Custom domains:** `ashes2echoes.com`, `www.ashes2echoes.com`
- **Auto-deploys on:** Any push to main
- **Created:** 2026-04-23 (replaced misconfigured `aiora_v1.0`)

**`forge-landing`** — separate FORGE product site
- **Project ID:** `prj_1YVLxoxQzRqyIXwANVrJjKswSJB8`
- **Git source:** `Barefootservants2/forge-landing`
- **Custom domains:** none currently (uses `*.vercel.app`)
- **Purpose:** Separate product experiment, NOT the main website

**`n8n-docs`** — separate
- **Project ID:** `prj_24G6gpX2MytBx1F2m3jzZAtpY2hx`
- **Purpose:** Documentation site

### ⚠️ QUARANTINED — DO NOT USE

**`aiora-legacy-donotuse`** (formerly `aiora_v1.0`)
- **Project ID:** `prj_wpl6e1u8GHtAUxw9o38ux81FGW8a`
- **Git source:** `Barefootservants2/AIORA` (backend repo — NOT a website)
- **Reason quarantined:** This project served `ashes2echoes.com` from February through April 2026 and produced 10+ weeks of silent 404s. AIORA repo is backend Python code with zero HTML; the project was misconfigured. Renamed 2026-04-23 to prevent re-use.
- **Do not:** assign any custom domain to this project. Do not use as a deploy target. Do not re-point.
- **Deletion plan:** Can be deleted after production release is stable (keeping for 30 days as historical reference).

### 🗑️ DELETED

- `a2e_website_v7.4` — deleted 2026-04-23 (3+ months dormant, ERROR state)
- `a2e_website_v7.4.3` — deleted 2026-04-23 (3+ months dormant, ERROR state)

---

## GitHub Repos — Production Website SoT Hierarchy

| Repo | Status | Role |
|---|---|---|
| `Barefootservants2/Ashes2Echoes` | **ACTIVE — SINGLE SOURCE OF TRUTH** for the public website. All homepage + subpath content lives here. Auto-deploys to `ashes2echoes` Vercel project on push to `main`. |
| `Barefootservants2/forge-landing` | Active, separate product. Has its own Vercel project. Do not cross-connect to main site. |
| `Barefootservants2/A2E_Website` | **DEPRECATED** — Jan 2026 Next.js attempt, abandoned Jan 27. Archived mentally; NEVER connect to any Vercel project. If it must exist for history, archive it on GitHub. |
| `Barefootservants2/AIORA` | **BACKEND ONLY** — Python code, NEVER deploy as a website source. Contains `{{$json.github_path}}` template-string garbage files from n8n misconfigurations that look like index files but aren't. **If you see this repo linked to a Vercel project serving a domain, that is a bug — disconnect immediately.** |

---

## DNS

Apex + www both point to Vercel (nameservers managed by the domain registrar). Vercel's edge network handles SSL cert issuance + renewal automatically. No CNAME conflicts.

---

## Verification Procedure — run on every session start and before any "shipped" claim

```bash
cd /path/to/a2e-platform
python -m phoenix.deploy_verify
```

This script:
1. Reads this INFRA_MAP.md
2. Queries Vercel API: does each listed project still exist and have its expected git source?
3. For each production URL, issues HTTP GET and verifies 200 + content marker
4. Returns exit code 0 if all pass, non-zero on ANY drift
5. Pastes live results into PHOENIX carry-forward template automatically

No PHOENIX session may declare "deployed" or "shipped" without the latest deploy_verify output pasted into the carry-forward.

---

## Protocol Failure Patches (from 2026-04-23 post-mortem)

All patches are in effect as of this commit. Any session that violates one is drifting and should be stopped.

| ID | Rule |
|---|---|
| **P1** | INFRA_MAP.md is canonical. PHOENIX narrative subordinate. |
| **P2** | `deploy_verify` runs before any ship claim. |
| **P3** | No ship/live claim without quoting live HTTP status code. |
| **P4** | Credentials never travel via screenshot — text paste only. |
| **P5** | Vercel git sources never change without corresponding INFRA_MAP commit. |
| **P6** | AIORA repo never connects to any Vercel project. If detected, disconnect on sight. |

---

## Change log

- **2026-04-23 22:00Z** — INFRA_MAP created. `ashes2echoes` project created, domains transferred from quarantined `aiora-legacy-donotuse`. Dormant `a2e_website_v7.4` and `a2e_website_v7.4.3` deleted. First deploy from `Ashes2Echoes` main sha `80598c27` verified READY, serving HTTP 200 on all production URLs.
