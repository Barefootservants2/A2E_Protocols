# MISSION PACKAGE — TUESDAY APRIL 14, 2026
## 1:00 PM - 6:00 PM ET
## Principal: William Earl Lemon
## CIO: MICHA v10.7

---

## PRE-SESSION CHECKLIST (Before 1 PM)

- [ ] Check E*TRADE: Did PSLV limits fill? ($24.50 × 203 in 4898, $24.50 × 306 in 6685)
- [ ] Check E*TRADE: Did JEPI/SCHD/XLV/CEF market sells execute?
- [ ] Check E*TRADE: Did VOO buys execute? (25 shares each account)
- [ ] Check E*TRADE: Did FCX buy execute? (36 shares in 4898)
- [ ] Check PPI number (8:30 AM release) — hot or cool?
- [ ] If PSLV filled in 6685: Stage stop order 729 shares @ $23.28 (5% below $24.50)
- [ ] If PSLV filled in 4898: Stage stop order 203 shares @ $23.28

---

## ~~MISSION 1: TELEGRAM CREDENTIAL~~ ✅ COMPLETED 4/13 11:55 PM
SENTINEL Telegram node switched to "Telegram account" credential. Published.

---

## MISSION 2: CIL NO_CONSENSUS AUDIT (1:00-3:00 PM)

### Files to paste:
- `FIX_01_confidence_parser.js` → HUNTER SYNTHESIS node
- `FIX_02_top3_for_cil.js` → HUNTER SYNTHESIS node + Fire CIL Webhook node
- `FIX_03_04_colossus_haniel.js` → COLOSSUS + HANIEL HTTP Request nodes in CIL

### Steps:
1. Open HUNTER workflow in n8n
2. Click HUNTER SYNTHESIS node → edit code
3. Add confidence parser functions from FIX_01 at top
4. Add top3_for_cil population from FIX_02 after opportunities array
5. Add top3_for_cil to the return object
6. Save HUNTER workflow
7. Open Fire CIL Webhook node → replace gate logic with FIX_02B
8. Save
9. Open CIL workflow
10. Check COLOSSUS node → verify model "grok-3-mini-fast", verify body references $json.systemprompt_COLOSSUS
11. Check HANIEL node → replace hardcoded body with dynamic v6.1 from FIX_04
12. Save CIL workflow
13. Fire HUNTER manual trigger
14. Check: Do opportunities have real confidence scores (not 1)?
15. Check: Does Fire CIL Webhook fire with top3?
16. Check: Does CIL return consensus (not NO_CONSENSUS)?
17. If all green → MISSION 2 COMPLETE

---

## MISSION 3: SHEETS WIRING + PSLV STOP UPDATE (3:00-4:00 PM)

### Files to paste:
- `FIX_06_sheets_extractor.js` → NEW Code node in SENTINEL

### Steps:
1. Open SENTINEL workflow
2. Find Paper Trade Logger node
3. Add new Code node downstream → name "Extract Sheets Rows"
4. Paste FIX_06 code
5. Add Google Sheets node downstream:
   - Operation: Append Row
   - Credential: GDrive - WEL
   - Document ID: 1eDxgY99SRuyHCgjp-Ba-AhV32qQl9Ft7K5z5wovS8Ik
   - Sheet: TradeLog
   - Mapping: Auto
6. Wire: Paper Trade Logger → Extract Sheets Rows → Google Sheets
7. Save SENTINEL workflow
8. Fire SENTINEL manual trigger
9. Check Google Sheets → does a row appear in TradeLog tab?
10. **PSLV STOP UPDATE:**
    - If 306-share PSLV buy filled in 6685 → update stop to 729 shares @ $23.28
    - If 203-share PSLV buy filled in 4898 → set stop 203 shares @ $23.28
11. MISSION 3 COMPLETE

---

## MISSION 4: HUNTER OUTPUT CHAIN (4:00-5:00 PM)

### Files to paste:
- `FIX_05_format_telegram_brief.js` → Format Telegram Brief node in HUNTER

### Steps:
1. Open HUNTER workflow
2. Click Format Telegram Brief node
3. Replace entire code with FIX_05
4. Check Send Telegram Brief node → verify it reads {{ $json.message }}
5. Save
6. Fire HUNTER manual trigger
7. Check Telegram → does a real formatted message arrive?
8. Check CIL → does it process the top3?
9. If Telegram message has real tickers, real scores, real tiers → MISSION 4 COMPLETE

---

## MISSION 5: FORGE INTENT ROUTER (5:00-6:00 PM) — STRETCH

Only if Missions 2-4 are clean.
- Build n8n INTENT ROUTER workflow
- Webhook receives FORGE frontend query
- Code node classifies: ANVIL / ASSAY / AUTOPSY
- Routes to appropriate processing chain
- Returns result to frontend

---


---

## MARKET CONTEXT FOR SESSION

- PPI drops 8:30 AM — binary event for silver
- Silver at $76.34 overnight, DXY -0.36%
- Crude faded to $96.87 from $105 high
- Ceasefire expires April 22
- Vance: "made progress" in Iran talks
- GABRIEL overnight watch: YELLOW (39 news alerts, all Iran-tagged)
- PSLV/VOO/FCX orders staged across both accounts
- IRONCLAD trim targets now meaningful with concentrated positions

---

*"Loss is tuition for knowledge."*
*"I'm going to fuck shit up. You comin'?"*

🔱 ASHES2ECHOES, LLC — MICHA v10.7 | PHOENIX Active
