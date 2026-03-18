# DRIVE INGEST v3.0 — Universal Content Extractor
## AZRAEL Build Specification
**Date:** 2026-03-18
**Base:** DRIVE INGEST v2.0 (workflow UjKFiREa4G4kdBNG)
**Purpose:** Crawl any Google Drive folder tree, read ALL file types, classify content, push to A2E_Intelligence GitHub repo
**Accounts:** william.e.lemon@gmail.com (64.5GB), ashes2echoes.platform@gmail.com (73GB), barefootservants@gmail.com (6.07GB)
**Total corpus:** ~143.5GB, several thousand files across 3 drives

---

## ARCHITECTURE — 12 nodes

```
MANUAL TRIGGER (or webhook)
    │
    ▼
ACCOUNT CONFIG (Set node — toggle between 3 accounts)
    │
    ▼
FOLDER CRAWLER (Google Drive — List folder contents, recursive)
    │
    ▼
FILE TYPE ROUTER (Switch node — route by mimeType)
    │
    ├── TEXT BRANCH: .txt, .html, .csv, .md, .json → DRIVE DOWNLOAD → TEXT PROCESSOR
    ├── EMAIL BRANCH: .mbox → DRIVE DOWNLOAD → MBOX PARSER
    ├── DOCUMENT BRANCH: .pdf, .docx, Google Docs → DRIVE DOWNLOAD/EXPORT → DOC PROCESSOR
    ├── IMAGE BRANCH: .jpg, .png, .gif, .webp → CATALOG ONLY (filename + metadata)
    ├── SKIP BRANCH: video, audio, large binaries → LOG + SKIP
    │
    ▼
CONTENT CLASSIFIER (Code node — classify by CONTENT not just filename)
    │
    ▼
GITHUB PUSH (HTTP node — push to A2E_Intelligence repo by category)
    │
    ▼
EXECUTION LOG (Telegram + GitHub log file)
```

---

## NODE SPECS

### NODE 1: MANUAL TRIGGER
- Type: Manual Trigger
- Purpose: Run on demand. No schedule needed yet.

### NODE 2: ACCOUNT CONFIG (Set node)
- Fields:
  - `account`: dropdown/string — "WEL" | "A2E" | "BAREFOOT"
  - `root_folder_id`: string — folder ID to start crawling (or "root" for entire drive)
  - `max_depth`: number — max subfolder recursion depth (default: 10)
  - `dry_run`: boolean — if true, catalog only, no GitHub push
  - `file_limit`: number — max files per run (default: 100, prevents timeout)
- Based on `account` value, downstream nodes use the matching Google Drive credential

### NODE 3: FOLDER CRAWLER (Code node + Google Drive node in loop)
- Logic:
  1. Start with `root_folder_id`
  2. List all items in folder (files + subfolders)
  3. For each subfolder, add to queue
  4. Continue until queue empty or `max_depth` reached
  5. Output: flat array of ALL files with full path, mimeType, size, id
- NOTE: n8n Google Drive node "List" operation with folder filter. Loop using SplitInBatches + recursive sub-workflow OR a single Code node using Google Drive API directly via HTTP Request.
- Better approach: Use HTTP Request node calling `https://www.googleapis.com/drive/v3/files?q='FOLDER_ID'+in+parents&fields=files(id,name,mimeType,size,modifiedTime,parents)` with pagination (pageToken). Code node manages the BFS queue.

### NODE 4: FILE TYPE ROUTER (Switch node)
- Routes on `mimeType`:
  - `text/*`, `application/json`, `text/csv`, `text/html`, `text/markdown` → TEXT BRANCH
  - `application/mbox`, files ending `.mbox` → EMAIL BRANCH
  - `application/pdf`, `application/vnd.openxmlformats*`, `application/vnd.google-apps.document` → DOCUMENT BRANCH
  - `image/*` → IMAGE BRANCH
  - Everything else (video, audio, zip, binary) → SKIP BRANCH

### NODE 5: DRIVE DOWNLOAD (Google Drive node — Download operation)
- Operation: Download
- File ID: from crawler output
- For Google Docs/Sheets: use Export (to .txt or .pdf)
- Output: binary data attached to item
- Timeout: 120s per file

### NODE 6: TEXT PROCESSOR (Code node)
- Input: downloaded text/json/html/csv content
- Logic:
  - .json: Parse, extract conversation content (Hangouts format: `conversations[].events[].chat_message.message_content.segment[].text`)
  - .html: Strip tags, extract text body
  - .csv: Read headers + first 50 rows as preview
  - .txt/.md: Read as-is
- Output: `{ filename, content_preview (first 2000 chars), full_content, file_type, source_path }`

### NODE 7: MBOX PARSER (Code node)
- Input: .mbox file content
- Logic:
  - Split on `From ` delimiter (standard mbox format)
  - Extract per email: From, To, Date, Subject, Body (text/plain part)
  - Limit: first 500 emails per .mbox file (prevent memory blow)
  - Output array of email objects
- Output: `{ filename, email_count, emails: [{ from, to, date, subject, body_preview }] }`

### NODE 8: DOC PROCESSOR (Code node)
- Input: downloaded PDF/DOCX content
- Logic:
  - PDF: Extract text via pdf-parse or similar
  - DOCX: Extract text via mammoth or raw XML parse
  - Google Docs: Already exported as text
- Output: `{ filename, content_preview, full_content, page_count }`

### NODE 9: CONTENT CLASSIFIER (Code node)
- Input: processed content from any branch
- Enhanced classification using CONTENT not just filename:
```javascript
const CATEGORIES = {
  PROMPTS:       ['prompt','forge','template','system prompt','instruction set','custom instruction'],
  PROTOCOLS:     ['protocol','ironclad','phoenix','metatron','directive','sop','amendment','gate'],
  CODE_PYTHON:   ['.py','python','import ','def ','class ','pip install'],
  CODE_JS:       ['.js','javascript','const ','function ','require(','import {'],
  CODE_HTML:     ['.html','<html','<div','<!DOCTYPE','<head>'],
  CODE_N8N:      ['n8n','workflow','node','webhook','credential','alwaysOutputData'],
  MARKET_INTEL:  ['silver','gold','pslv','ibit','vix','dxy','yield','comex','shanghai','ticker','price target'],
  CAREER:        ['resume','cover letter','linkedin','job','application','interview','salary'],
  COLLECTIVE:    ['collective','uriel','colossus','haniel','raziel','sariel','micha','agent','cil'],
  EMAIL_WEL:     [], // classified by source account
  EMAIL_A2E:     [],
  EMAIL_BAREFOOT:[],
  IMAGES:        [], // classified by mimeType
  CREATIVE:      ['lyrics','song','poem','story','book','chapter','verse'],
  APPLICATIONS:  ['app','dashboard','widget','component','interface','ui','ux'],
  LEARNING:      ['course','lesson','module','curriculum','study','tutorial','exercise']
};
```
- Emails auto-classify by source account
- Images go to IMAGES with filename-based sub-tag
- Content keyword matching scores each category, highest wins
- Ties broken by: first match in content > filename match > UNKNOWN

### NODE 10: GITHUB PUSH (HTTP Request node)
- Target: `https://api.github.com/repos/Barefootservants2/A2E_Intelligence/contents/`
- Auth: Token `${GITHUB_TOKEN}`
- Path: `{CATEGORY}/{filename}` mapping to A2E_Intelligence directory structure
- Method: PUT (creates file, or updates if SHA provided)
- Content: base64 encoded
- For large files (>5MB): log to skip list, flag for manual review
- For images: push metadata JSON only, not the binary (saves repo space)
- `dry_run` check: if true, skip push, log what WOULD be pushed

### NODE 11: EXECUTION LOG (Code node → Telegram + GitHub)
- Telegram: summary to hunter_a2e_bot / chat 8203545338
  - Files processed, categories, errors, skipped
- GitHub: push execution log to `A2E_Intelligence/ARCHIVE/INGEST_LOGS/`
  - Full manifest of every file processed with category assignment

### NODE 12: ERROR HANDLER (attached to all nodes)
- On error: log filename + error + continue
- Never stop the pipeline on a single file failure
- Summary of all errors in execution log

---

## CREDENTIAL MAPPING

| Account | Credential Name in n8n | Drive ID |
|---------|----------------------|----------|
| WEL (william.e.lemon) | Google Drive account (existing) | root or specific folder |
| A2E (ashes2echoes.platform) | Google Drive A2E (CREATE NEW) | root or specific folder |
| Barefoot (barefootservants) | Google Drive Barefoot (CREATE NEW) | root or specific folder |
| GitHub | Header Auth (existing) | — |
| Telegram | Telegram account (existing) | — |

**ACTION REQUIRED:** Create Google Drive OAuth credentials in n8n for A2E and Barefoot accounts. Same process as WEL credential — Google Cloud Console → OAuth consent → credential → paste Client ID/Secret in n8n.

---

## EXECUTION STRATEGY

### Phase 1: Catalog Run (dry_run = true)
- Run against each account with `dry_run: true`
- Output: complete file manifest with proposed categories
- Review manifest, adjust classifier keywords if needed
- No GitHub pushes

### Phase 2: Text-First Extraction
- Run with FILE TYPE ROUTER set to TEXT BRANCH only
- Processes: .txt, .json, .html, .csv, .md
- These are the highest-value files (chat exports, configs, notes)
- Fastest to process, smallest files

### Phase 3: Email Extraction
- Run with EMAIL BRANCH enabled
- Processes .mbox files
- Largest files, most content
- 500-email cap per .mbox prevents memory issues

### Phase 4: Document Extraction
- PDFs, DOCX files
- May need OCR for scanned PDFs (flag for manual review)

### Phase 5: Image Catalog
- Metadata-only push (filename, date, size, source folder)
- Full image content stays on Drive
- Phone screenshots with text: flag for OCR in future pass

---

## AZRAEL BUILD PROMPTS

### BUILD PROMPT 1 of 4: Core Architecture + Folder Crawler

```
I need to upgrade DRIVE INGEST v2.0 (workflow UjKFiREa4G4kdBNG) to v3.0.

Current v2.0 has 4 nodes: Webhook Trigger → Google Drive List → Classify Code → Webhook Response.

Replace with this architecture:

1. Replace webhook trigger with MANUAL TRIGGER node
2. Add SET node called "ACCOUNT CONFIG" with these fields:
   - account (string): "WEL" (default)
   - root_folder_id (string): "root" (default)
   - max_depth (number): 10
   - dry_run (boolean): false
   - file_limit (number): 100

3. Replace the simple Drive List with a FOLDER CRAWLER using a Code node + HTTP Request node pattern:
   - Code node builds a BFS queue starting from root_folder_id
   - HTTP Request node calls Google Drive API v3: GET https://www.googleapis.com/drive/v3/files?q='{FOLDER_ID}'+in+parents&fields=files(id,name,mimeType,size,modifiedTime,parents)&pageSize=100
   - Use OAuth2 credential for Google Drive (existing credential name: "Google Drive account")
   - Loop via SplitInBatches until queue is empty or max_depth/file_limit reached
   - Output: flat array of all files with id, name, mimeType, size, modifiedTime, full_path

4. Add SWITCH node called "FILE TYPE ROUTER" after the crawler:
   - Route 1 "TEXT": mimeType contains "text/" OR "application/json"
   - Route 2 "EMAIL": name ends with ".mbox"
   - Route 3 "DOCUMENT": mimeType contains "pdf" OR "openxmlformats" OR "google-apps.document"
   - Route 4 "IMAGE": mimeType starts with "image/"
   - Route 5 "SKIP": everything else

Wire: MANUAL TRIGGER → ACCOUNT CONFIG → FOLDER CRAWLER → FILE TYPE ROUTER

Keep existing Google Drive credential. Do not create new credentials.
```

### BUILD PROMPT 2 of 4: Download + Processing Branches

```
Continuing DRIVE INGEST v3.0 build.

For each FILE TYPE ROUTER output, add download and processing:

TEXT BRANCH (Route 1):
- Add Google Drive node "DOWNLOAD TEXT FILE" — operation: Download, fileId from router output
- Add Code node "TEXT PROCESSOR":
  - If .json: try JSON.parse, extract text content, handle Hangouts format (conversations[].events[].chat_message)
  - If .html: strip HTML tags with regex, keep text body
  - If .csv: read first 50 rows
  - If .txt/.md: pass through as-is
  - Output: { filename, content_preview (first 2000 chars), full_content, file_type, source_path, source_account }

EMAIL BRANCH (Route 2):
- Add Google Drive node "DOWNLOAD MBOX" — operation: Download
- Add Code node "MBOX PARSER":
  - Split content on lines starting with "From " (mbox delimiter)
  - For each email extract: From header, To header, Date header, Subject header, body text
  - Cap at 500 emails per file
  - Output: { filename, email_count, emails: [{from, to, date, subject, body_preview(200 chars)}] }

DOCUMENT BRANCH (Route 3):
- For Google Docs: Add Google Drive node "EXPORT GOOGLE DOC" — operation: Export, mimeType: text/plain
- For PDF/DOCX: Add Google Drive node "DOWNLOAD DOC" — operation: Download
- Add Code node "DOC PROCESSOR": extract text content, output same format as TEXT PROCESSOR

IMAGE BRANCH (Route 4):
- Add Code node "IMAGE CATALOGER": NO download. Just build metadata:
  { filename, mimeType, size, modifiedTime, source_path, source_account, category: "IMAGES" }

SKIP BRANCH (Route 5):
- Add Code node "SKIP LOGGER": log filename + reason + size. No download.

All branches output to a single MERGE node called "MERGE PROCESSED" (mode: Append).
```

### BUILD PROMPT 3 of 4: Classifier + GitHub Push

```
Continuing DRIVE INGEST v3.0 build.

After MERGE PROCESSED, add:

1. Code node "CONTENT CLASSIFIER":
   - Input: merged processed items from all branches
   - Classify each item into one of these categories based on content keywords AND filename:
     PROMPTS, PROTOCOLS, CODE_PYTHON, CODE_JS, CODE_HTML, CODE_N8N, MARKET_INTEL, CAREER, COLLECTIVE, EMAIL_WEL, EMAIL_A2E, EMAIL_BAREFOOT, IMAGES, CREATIVE, APPLICATIONS, LEARNING
   - Keyword lists for each category (use these exact arrays):
     PROMPTS: ['prompt','forge','template','system prompt','instruction set']
     PROTOCOLS: ['protocol','ironclad','phoenix','metatron','directive','sop','gate']
     CODE_PYTHON: ['.py','python','import ','def ','class ']
     CODE_JS: ['.js','javascript','const ','function ','require(']
     CODE_HTML: ['.html','<html','<div','<!DOCTYPE']
     CODE_N8N: ['n8n','workflow','webhook','credential','node']
     MARKET_INTEL: ['silver','gold','pslv','ibit','vix','dxy','yield','comex','ticker']
     CAREER: ['resume','cover letter','linkedin','job','application','interview']
     COLLECTIVE: ['collective','uriel','colossus','haniel','raziel','sariel','micha','cil']
     CREATIVE: ['lyrics','song','poem','story','book','chapter']
     APPLICATIONS: ['app','dashboard','widget','component','interface']
     LEARNING: ['course','lesson','module','curriculum','study','tutorial']
   - Emails: classify by source_account field (WEL/A2E/BAREFOOT)
   - Score each category by keyword hits in content + filename. Highest score wins.
   - Add github_path field: map category to A2E_Intelligence directory path

2. IF node "DRY RUN CHECK":
   - If $('ACCOUNT CONFIG').first().json.dry_run === true → skip to EXECUTION LOG
   - If false → continue to GITHUB PUSH

3. Code node "GITHUB PUSH" (using HTTP Request inside Code for control):
   - For each classified item:
     - Skip if full_content is empty or if size > 5MB
     - PUT to https://api.github.com/repos/Barefootservants2/A2E_Intelligence/contents/{github_path}/{filename}
     - Headers: Authorization: token ${GITHUB_TOKEN}
     - Body: { message: "INGEST: {category} - {filename}", content: base64(full_content or metadata) }
     - Check for existing file first (GET to get SHA), update if exists
     - Log success/failure per file
   - Rate limit: 100ms delay between pushes (GitHub API limit)
   - Output: push results array
```

### BUILD PROMPT 4 of 4: Logging + Error Handling

```
Continuing DRIVE INGEST v3.0 build. Final nodes.

1. Code node "BUILD EXECUTION SUMMARY":
   - Count: total files found, processed, pushed, skipped, errored
   - Group by category
   - List all errors with filenames
   - Format as markdown

2. Telegram node "SEND REPORT":
   - Bot token credential: use existing Telegram credential
   - Chat ID: 8203545338
   - Message: execution summary (truncate to 4000 chars for Telegram limit)

3. HTTP Request node "LOG TO GITHUB":
   - Push execution log to A2E_Intelligence/ARCHIVE/INGEST_LOGS/INGEST_RUN_{timestamp}.md
   - Same GitHub auth pattern as GITHUB PUSH

4. ERROR HANDLING on ALL nodes:
   - Set onError: "continueRegularOutput" on every node that processes files
   - This ensures one bad file never kills the pipeline
   - Errors collected in a running array passed through the pipeline

Wire: CONTENT CLASSIFIER → DRY RUN CHECK → GITHUB PUSH → BUILD EXECUTION SUMMARY → SEND REPORT + LOG TO GITHUB (parallel)
Also wire: DRY RUN CHECK (true branch) → BUILD EXECUTION SUMMARY (skip push, still log)

FINAL: Publish workflow. Name: "DRIVE INGEST v3.0"
```

---

## POST-BUILD VALIDATION

1. Run Phase 1 (dry_run=true) against WEL Drive Takeout folder
2. Check Telegram for summary
3. Review category assignments in the log
4. Adjust classifier keywords if needed
5. Run Phase 2 (dry_run=false, text files only) against same folder
6. Verify files land in correct A2E_Intelligence directories on GitHub
7. Repeat for A2E and Barefoot accounts after creating their Drive credentials

---

## CREDENTIAL SETUP REQUIRED BEFORE BUILD

1. **Google Drive A2E credential:** In n8n Settings → Credentials → New → Google Drive OAuth2 → authorize with ashes2echoes.platform@gmail.com
2. **Google Drive Barefoot credential:** Same process with barefootservants@gmail.com
3. Both require Google Cloud Console OAuth client (use existing A2E project or create new)

---

## KNOWN LIMITATIONS

- .mbox files over 500MB may timeout. Split with file_limit parameter.
- Images are cataloged not pushed (binary too large for GitHub, metadata only).
- GitHub API rate limit: 5000 requests/hour. With 100ms delay, ~600 files/minute max.
- Google Drive API rate limit: 20,000 queries/day. Folder crawler is the heaviest consumer.
- PDF text extraction in n8n Code node is limited. May need external service for scanned PDFs.
