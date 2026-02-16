# 🔧 A2E LAPTOP MIGRATION PLAYBOOK
## Old Laptop → New Laptop | F:Drive Sync to GitHub
## Date: February 16, 2026
## Prepared By: MICHA (CIO) for Principal William Earl Lemon

---

## REALITY CHECK

MICHA cannot access your local filesystem, browser, or installed applications remotely. This document is the execution checklist. Work through it section by section on the new laptop. Check boxes as you go.

**Priority:** Get accounts + Collective access first, files second, polish third.

---

# PHASE 1: ACCOUNTS & COLLECTIVE ACCESS (Do First — 30 min)

## 1.1 Browser Setup (Edge or Chrome — Kill Bing)

```
□ Open Edge → Settings → Start, home, and new tabs
  → Set "When Edge starts" to "Open these pages"
  → Add these as startup/pinned tabs:
    1. https://claude.ai (MICHA)
    2. https://chatgpt.com (URIEL)
    3. https://grok.com (COLOSSUS — formerly x.ai/grok)
    4. https://gemini.google.com (HANIEL)
    5. https://chat.deepseek.com (RAZIEL)
    6. https://www.perplexity.ai (SERAPH)
    7. https://ashes2echoes.com (A2E Website)
    8. https://github.com/Barefootservants2 (GitHub)
  → Set Home page to https://ashes2echoes.com (NOT Bing)
  → Under "New tab page" → set to "Blank" or custom
  → Settings → Default browser → make sure Edge or Chrome is default
  → Settings → Privacy → Turn OFF Bing sidebar/copilot if unwanted
```

**If using Chrome instead of Edge:**
```
□ Download Chrome: https://www.google.com/chrome/
□ Settings → On Startup → Open specific pages → add same 8 URLs
□ Set Chrome as default browser
```

## 1.2 Sign Into Collective Accounts

```
□ Claude.ai — sign in (MICHA)
    Check: User Preferences still contain MICHA instructions
    Check: Memory items intact
□ ChatGPT — sign in (URIEL)  
    Check: Custom instructions for URIEL still set
□ Grok — sign in via X account (COLOSSUS)
    Check: Grok instructions set
□ Gemini — sign in via Google account (HANIEL)
    Check: Gems or custom instructions set
□ DeepSeek — sign in (RAZIEL)
    Check: System prompt configured
□ Perplexity — sign in (SERAPH)
□ GitHub — sign in as Barefootservants2
    Check: Can access A2E_Protocols repo
□ n8n — sign in to your n8n instance
    Check: AIORA workflow accessible
    Check: HUNTER modules visible
```

## 1.3 Email Accounts

```
□ Gmail — ashes2echoes.platform@gmail.com
    Password: TGqE0ZvYW90FsqLp
    Add to browser or Outlook
□ Gmail — personal account (if separate)
□ Microsoft 365 — sign in
    Check: OneNote accessible
    Check: OneDrive accessible
□ E*TRADE — sign in, verify 2FA works on new device
```

---

# PHASE 2: APPLICATIONS (30-60 min)

## 2.1 Essential Applications — Install on New Laptop

**From Old Laptop:** Before wiping, check what's installed. Below is what you NEED based on A2E operations:

```
□ Visual Studio Code (code editing, markdown preview)
    Download: https://code.visualstudio.com/
    Extensions to install: Markdown Preview Enhanced, GitHub Pull Requests, REST Client
□ Git for Windows (even though clone is proxy-blocked, local git is useful)
    Download: https://git-scm.com/download/win
□ Node.js (required for n8n local and script execution)
    Download: https://nodejs.org/ (LTS version)
□ Python 3.x (for scripts, data processing)
    Download: https://www.python.org/downloads/
    Check "Add to PATH" during install
□ Telegram Desktop (daily briefs + alerts)
    Download: https://desktop.telegram.org/
□ Discord (SENTINEL alerts when deployed)
    Download: https://discord.com/download
□ OneNote (if using desktop app, not just web)
    Should come with M365
□ Adobe Acrobat Reader (for PDFs, Oracle reports)
    Download: https://get.adobe.com/reader/
```

**DO NOT install:**
```
✗ Anything Bing-related as a standalone app
✗ Random browser toolbars
✗ Antivirus beyond Windows Defender (it's sufficient)
✗ Anything that doesn't directly serve A2E or daily operations
```

## 2.2 Optional / Evaluate

```
□ Claude Desktop App — check https://claude.ai/download
    If available, may be faster than browser tab
□ ChatGPT Desktop App — check https://openai.com/chatgpt/download/
□ Obsidian (if you want local markdown knowledge base)
    Download: https://obsidian.md/
    Could replace OneNote for protocol reference
```

---

# PHASE 3: F:DRIVE ↔ GITHUB SYNC (1-2 hours)

## 3.1 F:Drive Structure (Target State)

The F:Drive should mirror GitHub as the authoritative backup. Create this folder structure:

```
F:\A2E\
├── A2E_Protocols\           ← Mirror of GitHub repo (download ZIP)
│   ├── PROTOCOLS\
│   │   ├── PRODUCTION\      ← All v10.5 files live here
│   │   ├── IRONCLAD\
│   │   └── GATES\
│   ├── COLLECTIVE\          ← All 7 agent instructions
│   ├── SENTINEL\
│   ├── PHOENIX\
│   ├── N8N\
│   ├── FORGE\
│   ├── ROUTING\
│   ├── ARCHIVE\
│   └── enterprise\
├── AIORA\                   ← Mirror of AIORA private repo
├── A2E_Website\             ← Mirror of website repo
├── A2E_Apparel\             ← Mirror of apparel private repo
├── A2E_Infrastructure\      ← Mirror of infrastructure repo
├── A2E_EmailArchive\        ← Mirror of email archive repo
├── AllChats\                ← Mirror of chat archive repo
├── github-mcp-server\       ← Mirror of MCP server repo
├── etrade-oauth-debug\      ← Mirror of OAuth debug tool
├── test-harness\            ← Mirror of test harness repo
├── forge-landing\           ← Mirror of FORGE landing page
├── n8n-docs\                ← Mirror of n8n docs fork
├── A2E_Metrics\             ← NEW — Create when metrics repo is set up
├── LOCAL_ONLY\              ← Files NOT in GitHub (OneNote exports, personal notes)
│   ├── OneNote_Exports\
│   ├── Trading_Screenshots\
│   └── PhD_Materials\
└── MIGRATION_LOG.md         ← Track what's been moved/synced
```

## 3.2 Download All Repos from GitHub

Since git clone is proxy-blocked, download ZIPs:

```
□ For EACH repository listed below, go to:
    https://github.com/Barefootservants2/[REPO_NAME]
    → Click green "Code" button → "Download ZIP"
    → Extract to F:\A2E\[REPO_NAME]\

REPOSITORIES (13 total):
  □ A2E_Protocols (PUBLIC) — https://github.com/Barefootservants2/A2E_Protocols
  □ AIORA (PRIVATE) — https://github.com/Barefootservants2/AIORA
  □ A2E_Website (PUBLIC) — https://github.com/Barefootservants2/A2E_Website
  □ A2E_Apparel (PRIVATE) — https://github.com/Barefootservants2/A2E_Apparel
  □ A2E_Infrastructure (PUBLIC) — https://github.com/Barefootservants2/A2E_Infrastructure
  □ A2E_EmailArchive (PRIVATE) — https://github.com/Barefootservants2/A2E_EmailArchive
  □ AllChats (PRIVATE) — https://github.com/Barefootservants2/AllChats
  □ github-mcp-server (PRIVATE) — https://github.com/Barefootservants2/github-mcp-server
  □ etrade-oauth-debug (PUBLIC) — https://github.com/Barefootservants2/etrade-oauth-debug
  □ test-harness (PUBLIC) — https://github.com/Barefootservants2/test-harness
  □ forge-landing (PUBLIC) — https://github.com/Barefootservants2/forge-landing
  □ n8n-docs (PUBLIC) — https://github.com/Barefootservants2/n8n-docs
  □ Ashes2Echoes (PRIVATE) — https://github.com/Barefootservants2/Ashes2Echoes
```

## 3.3 Sync Checklist — Verify Critical Files

After downloading, confirm these key files exist on F:Drive:

```
□ F:\A2E\A2E_Protocols\PROTOCOLS\PRODUCTION\METATRON_v10.5_PRIME_DIRECTIVE.md
□ F:\A2E\A2E_Protocols\PROTOCOLS\PRODUCTION\FIDELITY_LOCK_v10.5.md
□ F:\A2E\A2E_Protocols\PROTOCOLS\PRODUCTION\METRICS_PIPELINE_v1.0.md
□ F:\A2E\A2E_Protocols\PROTOCOLS\PRODUCTION\BUILD_SEQUENCE_v10.5.md
□ F:\A2E\A2E_Protocols\PROTOCOLS\PRODUCTION\ENHANCEMENT_BACKLOG_v10.5.md
□ F:\A2E\A2E_Protocols\PROTOCOLS\IRONCLAD\IRONCLAD_PROTOCOL_v1.0.md
□ F:\A2E\A2E_Protocols\SENTINEL\SENTINEL_STACK_v1.0.md
□ F:\A2E\A2E_Protocols\N8N\HUNTER_CODE\H30_NORMALIZE_FINNHUB.js (+ H31-H35, consolidation)
□ F:\A2E\A2E_Protocols\COLLECTIVE\MICHA\MICHA_INSTRUCTIONS_v10.3.md (all 7 agents)
```

---

# PHASE 4: OLD LAPTOP — EXTRACT BEFORE WIPE

## 4.1 Files to GRAB from Old Laptop

Before the old laptop goes away, copy these to F:Drive or USB:

```
□ OneNote notebooks — Export ALL A2E-related notebooks
    OneNote → File → Export → choose "Notebook" → save as .onepkg or .pdf
    Target: F:\A2E\LOCAL_ONLY\OneNote_Exports\
    
□ Browser favorites/bookmarks
    Edge: Settings → Profiles → Import/Export → Export to HTML
    Chrome: Bookmarks → Bookmark Manager → ⋮ → Export
    Target: F:\A2E\LOCAL_ONLY\Browser_Bookmarks.html
    ONLY grab A2E-relevant favorites. Ignore everything else.

□ Desktop files — anything A2E related sitting on Desktop
□ Documents folder — scan for any scripts, code, protocol drafts
□ Downloads folder — scan for any keeper files (PDFs, reports, Oracle outputs)

□ Trading screenshots / charts
    Target: F:\A2E\LOCAL_ONLY\Trading_Screenshots\

□ SSH keys (if any exist)
    Location: C:\Users\[username]\.ssh\
    Target: F:\A2E\LOCAL_ONLY\.ssh\ (keep secure)

□ .env files or API key files from any local development
    Search for: *.env, *.key, api_key*, credentials*
    Target: F:\A2E\LOCAL_ONLY\Credentials\ (keep VERY secure)

□ n8n local config (if running local n8n)
    Location: C:\Users\[username]\.n8n\
    Target: F:\A2E\LOCAL_ONLY\n8n_config\

□ VS Code settings + extensions list
    Open VS Code → Ctrl+Shift+P → "Preferences: Open Settings (JSON)"
    Copy settings.json
    Extensions: code --list-extensions > extensions.txt
    Target: F:\A2E\LOCAL_ONLY\VSCode\
```

## 4.2 Things to IGNORE on Old Laptop

```
✗ Windows system files, temp files, cache
✗ Program Files (just reinstall apps fresh)
✗ Bing anything
✗ Random downloads that aren't A2E
✗ Game files, entertainment apps
✗ Old browser profiles (just export bookmarks)
✗ Windows.old folders
✗ Recycle Bin contents
```

---

# PHASE 5: NEW LAPTOP POLISH (15 min)

## 5.1 Windows Settings

```
□ Settings → Personalization → Start → Turn OFF "Show recommendations"
□ Settings → Privacy → General → Turn OFF advertising ID
□ Settings → System → Notifications → Reduce noise (turn off non-essential)
□ Settings → Apps → Default apps → Set browser to Edge or Chrome
□ Taskbar: Unpin anything not A2E-related
□ Taskbar: Pin VS Code, Terminal, File Explorer, browser
```

## 5.2 Browser Final Check

```
□ Verify all 8 startup tabs load correctly
□ Verify home page is ashes2echoes.com (NOT Bing)
□ Verify all Collective accounts stay signed in
□ Import bookmarks from old laptop export
□ Delete/ignore any Bing-related bookmarks
□ Create bookmark folder: "A2E Collective" with all agent URLs
□ Create bookmark folder: "A2E Resources" with:
    - GitHub: https://github.com/Barefootservants2
    - n8n: [your n8n instance URL]
    - E*TRADE: https://us.etrade.com
    - Finnhub: https://finnhub.io/dashboard
    - TwelveData: https://twelvedata.com/account
    - metals.dev: https://metals.dev
    - SEC EDGAR: https://efts.sec.gov/LATEST/search-index
    - FRED: https://fred.stlouisfed.org
    - Reddit (for SENTINEL): https://www.reddit.com/prefs/apps
    - Discord (for SENTINEL alerts): [your server URL]
    - Unusual Whales: https://unusualwhales.com
    - Lablab.ai: https://lablab.ai (hackathons)
```

## 5.3 Verify F:Drive Backup is Complete

```
□ Count repos on F:Drive: should be 13 folders
□ Compare A2E_Protocols on F:Drive vs GitHub — files should match
□ Spot-check: open METATRON_v10.5_PRIME_DIRECTIVE.md — should be 809 lines
□ Spot-check: open FIDELITY_LOCK_v10.5.md — should be 345 lines
□ Verify LOCAL_ONLY folder has OneNote exports, bookmarks, any extracted files
```

---

# PHASE 6: ONGOING SYNC DISCIPLINE

GitHub is the source of truth. F:Drive is the backup.

```
AFTER EVERY MICHA SESSION THAT PUSHES TO GITHUB:
1. Download updated files from GitHub
2. Replace corresponding files on F:Drive
3. Or: re-download the full repo ZIP periodically (weekly)

RULE: If a file exists on F:Drive but NOT in GitHub → it goes in LOCAL_ONLY\
RULE: If a file exists in GitHub but NOT on F:Drive → download it immediately
RULE: Never edit F:Drive files directly — all changes go through MICHA → GitHub → F:Drive
```

---

# CREDENTIALS REFERENCE (Sensitive — Keep Secure)

```
GitHub Token (Claude_MCP_Access): [STORED IN CLAUDE MEMORY — ask MICHA]
  Expires: Jul 3, 2026
  
Gmail A2E Platform: ashes2echoes.platform@gmail.com
  Password: [STORED IN CLAUDE MEMORY — ask MICHA]

E*TRADE: Sign in via existing credentials + 2FA

API Keys (stored in n8n credentials):
  - Finnhub
  - TwelveData  
  - Alpha Vantage
  - NewsAPI
  - metals.dev
  - FEC
  - Anthropic (Haiku for SENTINEL)
  - Unusual Whales
  See: N8N/HUNTER_API_KEY_AUDIT_2026-02-11.md for full inventory
```

---

## ATTESTATION

```
DOCUMENT: A2E Laptop Migration Playbook
TYPE: B — ENGINEERING SPECIFICATION
VERIFIED: All account URLs, repo names, and file paths verified against:
  - GitHub API repo listing (13 repos confirmed)
  - A2E_Protocols file tree (post v10.5 push)
  - Claude memory (account credentials)
  - Session history (tool/platform references)
UNVERIFIED: Old laptop file locations (cannot access local filesystem)
GENERATED WITHOUT EVIDENCE: 0
MODE: ADMINISTRATIVE
AGENT: MICHA (CIO)
TIMESTAMP: 2026-02-16T02:45:00Z
```

---

🔧 **MIGRATION PLAYBOOK — EXECUTE IN ORDER**
**Phase 1 first. Don't skip ahead.**

🔱 METATRON v10.5 | Uriel Covenant AI Collective | Ashes2Echoes, LLC
