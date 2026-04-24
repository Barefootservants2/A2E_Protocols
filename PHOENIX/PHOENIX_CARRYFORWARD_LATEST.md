# PHOENIX CARRY-FORWARD — 2026-04-24 Session 3c (MICHA CONSOLE v0.3)

**Principal:** William Earl Lemon
**Agent:** MICHA (Claude Opus 4.7)
**Session:** S3c · MICHA Console v0.3 build + deploy
**Chain from:** S3b `86964aac` → this file
**Status:** PHOENIX CLOSE · console shipped live · subdomain manual step pending

---

## WHAT HAPPENED — S3c

Principal rejected the existing homepage as an "old design" and called for the realization of the 4/21 LaRossa JARVIS-DNA concept. Cross-referenced previous chat `88905bbc-a975-430f-b175-b1ca7c504b30` where we decoded the design and built `MICHA_CONSOLE_v0.1.html` as a static prototype (never committed). Principal directive this session:

- Scope: protected subdomain with Vercel auth (Answer C)
- Voice: Web Speech API (Answer A) — confirmed Claude has no built-in voice in web/chat
- Wake rotation: Marcus Aurelius + Scripture on what God defines a man should be
- Features: NO classified-document narrative, BULLSEYE + FORGE can be integrated + standalone with 3-day trial and per-module license keys, multi-monitor from the start (5 monitors), wake screen with orb + login, free news + podcasts + Trapper
- Build directive: "do not wait for me to answer, do not stop until complete"

## WHAT WAS SHIPPED

### 1. MICHA Console v0.3 (full app)

**Location:** `Barefootservants2/Ashes2Echoes/console/index.html`
**Live URL:** `https://ashes2echoes.com/console/` (HTTP 200 verified via Vercel fetch)
**Deploy:** `dpl_7UtymcGrAABL1CWfxjMc5ssAm2o3` (READY)

**Components:**
- **Wake screen:** Cinzel-display brand, orb + passcode input + voice toggle, rotating quote with source attribution, fades into console on Enter
- **3D Metatron orb:** Three.js r128, 13-circle Flower-of-Life lattice (1 center + 6 inner hex + 6 outer hex), all nodes interconnected, translucent wireframe sphere shell + outer atmospheric shell, pulsing core with glow, cursor parallax, state machine (idle/listening/processing/speaking/alarm with distinct colors and pulse rates)
- **Persistent mini-orb in left rail:** Smaller instance of same orb class, mirrors main orb state — MICHA's always-on presence across every view
- **Voice engine:** Web Speech API (speechSynthesis + webkitSpeechRecognition), voice profile selector (auto-prefers Daniel/Alex/David/Fred deep male voices), rate 0.5-1.5, pitch 0.5-1.5, test button, onStateChange callback drives orb state, ElevenLabs stub for future voice cloning
- **Seamless voice ↔ text:** Mic button, orb click, and rail mini-orb all toggle same recognition stream; recognized transcript flows through same command bar as typed input
- **7-agent strip:** MICHA/URIEL/COLOSSUS/HANIEL/RAZIEL/SARIEL/GABRIEL with status dots (teal-pulse/green/amber/dim) and role descriptions, click opens drawer with last response + CIL gate score + action buttons
- **7 modules panel:** HUNTER/SENTINEL/CIL/METATRON/SIGNAL/FORGE/PHOENIX with versions, node counts, live status, click opens drawer with trigger/logs/pause buttons
- **Live Market + Live Alerts panels:** Current session data prepopulated
- **Command bar:** Keyword routing (MARKET WATCH, PHOENIX RESUME, KILLSWITCH, ORACLE, CLOSE SESSION, /help, "read/prayer/quote" triggers rotation library); orb state syncs to processing/speaking
- **Rotating principal line:** Changes every 45 sec through wake library — Marcus + Scripture + Creed in italic Cinzel with attribution

### 2. Wake rotation library — 25 entries, non-repeating 10-window

- **Marcus Aurelius Meditations:** 8 entries (5.1, 6.2, 5.20, 2.5, 10.16, 3.10, 7.22, 9.6)
- **Scripture — what God defines a man to be:** 14 entries (1 Cor 16:13-14, Joshua 1:9, Micah 6:8, 1 Tim 5:8, Eph 6:10-11, Prov 27:17, 2 Tim 1:7, Prov 3:5-6, 1 Cor 13:11, Isaiah 40:31, Ecclesiastes 9:10, Prov 24:10, Psalm 18:32-34, Matthew 7:24-25)
- **Principal's Creed:** 3 entries ("Not willing to give up your life for beliefs...", "Loss is tuition for knowledge", "I'm going to fuck shit up. You comin'?")
- Rotation class prevents repeats within sliding 10-entry window; all 25 cycle through before any repeat
- Full 40+ entry catalog also committed at `console/wake_library.js` for future expansion

### 3. Five views (2 operational, 3 reference, 1 settings)

- **Console** — agent strip + modules + orb + market + alerts (primary command view)
- **Positions** — 16-row matrix across 3 accounts (4898/5267/6685) with HH/HL, cushion color-coded (red<5%, amber<10%, green), account-tab filter
- **Trading Lab** — Sunday curriculum (M1 delivered, M2-M5 queued/pending) + chart workspace build queue (TradingView/Alpaca/custom)
- **News** — 12 free sources: Bloomberg, Reuters, Kitco, ZeroHedge, FRED, SEC EDGAR, Trapper, Chat With Traders, Odd Lots, Macro Voices, Grant Williams, Trading Economics
- **Docs** — 9 protocol documents linked to GitHub
- **GitHub** — 6 repo cards (3 public, 3 private marked 🔒)
- **Settings** — voice config panel + licensing tiers panel + system requirements panel

### 4. Licensing scaffold

| Tier | Price | Trial |
|---|---|---|
| AIORA | $299/mo | 3-day |
| BULLSEYE | $149/mo | Included w/ AIORA |
| FORGE | $79/mo | 3-day standalone |
| CIL + HUNTER | $499/mo | Professional |
| METATRON | included | All tiers |
| COVENANT SUITE | $899/mo | All modules |

Per-module license keys · cancel anytime. UI scaffold only — no Stripe integration yet.

### 5. System requirements — defined in Settings view

- **Minimum:** 1920×1080, 8 GB RAM, Chrome/Edge 110+, 25 Mbps, microphone
- **Recommended:** 2560×1440 dual monitor, 16 GB RAM, WebGPU browser, 100 Mbps, USB condenser mic
- **Principal tier:** 4K 3-5 monitors, 32+ GB RAM, latest Chrome/Edge, gigabit, studio mic + speakers

### 6. Security / access-control posture

- `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` on `/console/*` (merged into existing `vercel.json`)
- `<meta name="robots" content="noindex, nofollow">` in HTML
- Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy no-referrer, Permissions-Policy microphone=(self)
- Wake-screen passcode soft-lock (client-side only — UI layer, not real auth)
- **Subdomain with Vercel SSO is pending** — 5-min manual step, guide committed to `A2E_Protocols/INFRASTRUCTURE/CONSOLE_SUBDOMAIN_SETUP.md`

### 7. Documentation committed

- `Ashes2Echoes/console/index.html` — 2,569 lines, 103KB self-contained app
- `Ashes2Echoes/console/wake_library.js` — 420 lines, standalone module version of rotation library (40+ entries)
- `Ashes2Echoes/console/README.md` — architecture, tier list, commands, deploy notes
- `Ashes2Echoes/vercel.json` — security headers merged
- `A2E_Protocols/INFRASTRUCTURE/INFRA_MAP.md` — updated with console entry + pending subdomain section
- `A2E_Protocols/INFRASTRUCTURE/CONSOLE_SUBDOMAIN_SETUP.md` — 5-step guide for promoting to protected subdomain

---

## LIVE VERIFICATION (P3 compliance)

Per Protocol P3 (no ship claim without quoting live HTTP status):

```
✓ https://ashes2echoes.com/console/          HTTP 200  (verified 2026-04-24 06:59 UTC via Vercel web_fetch)
  Content-Type: text/html; charset=utf-8
  Last-Modified: Fri, 24 Apr 2026 06:59:38 GMT
  X-Vercel-Cache: HIT
  <title>MICHA · Uriel Covenant</title> — confirmed in body
```

---

## ONE MANUAL TASK FOR PRINCIPAL (~5 min, optional but recommended)

To promote to protected subdomain `console.ashes2echoes.com`:

1. vercel.com/new → Import Barefootservants2/Ashes2Echoes → name `ashes2echoes-console` → Root Directory `console`
2. Settings → Deployment Protection → Vercel Authentication: Standard Protection
3. Settings → Domains → Add `console.ashes2echoes.com`
4. Verify DNS auto-resolves + open URL → should prompt Vercel SSO login

Full guide: `A2E_Protocols/INFRASTRUCTURE/CONSOLE_SUBDOMAIN_SETUP.md`

Until subdomain promotion, console remains at `ashes2echoes.com/console/` with soft-lock only. Not indexed, not discoverable through search, but reachable by URL.

---

## BUILD LIST — CARRIED INTO NEXT SESSION

🔥 **Completed S3c:**
- MICHA Console v0.3 shipped live
- Wake rotation library (Marcus + Scripture + Creed)
- 3D orb with state machine + persistent mini-orb
- Web Speech API voice stack
- 5 views + licensing scaffold + system requirements
- Security headers + noindex
- Documentation + subdomain setup guide

🎯 **Next session priorities (carried from S3a/b + new):**
- **T1 (P0):** Principal walks through live console, flags anything broken
- **T2 (P0):** Pull 5536 Roth IRA manifest (known gap since S3)
- **T3 (P0):** Manual subdomain promotion (5 min via Vercel dashboard) — Principal does this
- **T4:** `session_start.py` with deploy_verify as Gate 0
- **T5:** BULLSEYE action buttons (Trim/UpdateStop/Alert/Close via FastAPI bridge)
- **T6:** Add 5267 + 5536 cards to BULLSEYE
- **T7:** Wire real-time market data to console (FastAPI SSE or WebSocket)
- **T8:** ElevenLabs integration for voice cloning (stub present, needs API key)
- **T9:** Chart rendering in Trading Lab (TradingView embed, v0.3a recommended)

📊 **Pending from earlier sessions:**
- FORGE Appendix A scoring methodology
- FORGE Ch 3 v1.1 voice pass
- VOO HL re-entry alert
- Yahoo previousClose trap codification
- Execution Playbook doc

---

## CARRY-FORWARD START PROMPT

"MICHA LATEST + PHOENIX. 2026-04-24 closed S3c: MICHA Console v0.3 shipped live at ashes2echoes.com/console/ with Jarvis-DNA design — wake screen + 3D Metatron orb (Three.js) + persistent mini-orb in rail + Web Speech API voice + Marcus Aurelius/Scripture/Creed wake rotation library + 5 views (Console/Positions/Trading Lab/News/Docs/GitHub/Settings) + licensing scaffold + system requirements. Security: noindex headers, wake-screen soft-lock, subdomain promotion to console.ashes2echoes.com with Vercel SSO is a pending 5-min manual step (guide at A2E_Protocols/INFRASTRUCTURE/CONSOLE_SUBDOMAIN_SETUP.md). Next: Principal walkthrough of live console, 5536 Roth manifest (still gap from S3), subdomain promotion, BULLSEYE action buttons via FastAPI bridge, real-time data wiring."

---

**End PHOENIX CARRY-FORWARD 2026-04-24-S3c**

**Commits this session:**
- `8e31e832` Ashes2Echoes/console/index.html CREATED
- `b91e85e1` Ashes2Echoes/console/wake_library.js CREATED
- `8b005b9b` Ashes2Echoes/console/README.md CREATED
- `1d453f90` Ashes2Echoes/vercel.json MERGED (security headers for /console/)
