# A2E BULLSEYE — DESIGN SKILL v1.0
## Reusable Aesthetic Standard for All A2E Visual Outputs
**Author:** MICHA, CIO — Uriel Covenant  
**Date:** March 26, 2026  
**Classification:** FORGE SKILL — Load once, apply everywhere  
**Purpose:** Eliminate aesthetic re-briefing. This file IS the A2E design standard. Reference it. Do not re-explain it.

---

## HOW TO USE THIS SKILL

Drop this file reference at the start of any build session:
> "Apply the A2E BULLSEYE Design Skill from A2E_Protocols/BULLSEYE/A2E_BULLSEYE_DESIGN_SKILL_v1.0.md"

Claude loads this once. Every artifact, component, page, and document produced in that session uses these standards automatically. No re-briefing. No "remember the teal and gray" every session.

---

## BRAND IDENTITY

**Company:** Ashes2Echoes LLC (A2E)  
**Platform:** BULLSEYE — Uriel Covenant AI Collective  
**Principal:** William Earl Lemon  
**Mission:** Institutional-grade AI research and market intelligence. Built by a defense engineer. Operates like a command center.

**The feeling this brand must convey:**
- Military precision meets sacred geometry
- Intelligence system, not a startup
- Authority without arrogance
- Living, breathing — not static corporate
- The kind of platform you'd expect at a sovereign wealth fund, not a retail fintech

---

## TRADEMARK + LOGO

**Primary Mark:** Metatron's Cube — sacred geometry pattern  
**Treatment:** Teal/cyan glow (#00D4FF or #00BFFF) on dark gray (#1A1A2E or #0D0D1A)  
**Effect:** Soft outer glow, inner geometry visible at low opacity — NOT a hard solid shape  
**Usage:** Every page, every component header, every branded document  
**Never:** Flat. Never white background. Never corporate blue. Never without glow.

```
Primary brand color: Teal/Cyan glow
  HEX: #00D4FF (primary)
  HEX: #00BFFF (secondary teal)
  HEX: #7B2FBE (accent purple — used sparingly)

Background colors:
  Deep space: #0D0D1A (primary background)
  Dark panel: #1A1A2E (card/panel background)
  Elevated panel: #16213E (hover/active state)
  Border: rgba(0, 212, 255, 0.2) (teal at 20% opacity)

Text colors:
  Primary: #E8E8F0 (near-white, soft)
  Secondary: #9999BB (muted lavender-gray)
  Accent: #00D4FF (teal — for highlights, labels, values)
  Warning: #FFB347 (amber)
  Alert: #FF4757 (red)
  Success: #2ED573 (green)
```

---

## TYPOGRAPHY

**Primary Display Font:** Dancing Script Bold  
**Use for:** Logo, section headers, signature, principal name  
**Character:** Flowing, human, handcrafted — contrast against the technical precision of everything else  
**With bezier flourish:** When used as signature or title, add a curved decorative underline

**Secondary Font:** Inter or Roboto (system fallback)  
**Use for:** Body text, data, labels, navigation  
**Weight:** Regular (400) for body, Medium (500) for labels, SemiBold (600) for section titles

**Monospace Font:** JetBrains Mono or Fira Code  
**Use for:** All code blocks, API outputs, data values, ticker symbols in tables  
**Color:** #00D4FF on #0D0D1A background

**Typography hierarchy:**
```
H1 Display:  Dancing Script Bold, 48-64px, teal glow text
H2 Section:  Inter SemiBold, 28-32px, #E8E8F0
H3 Label:    Inter Medium, 16-18px, #00D4FF (teal)
Body:        Inter Regular, 14-16px, #9999BB
Data/Value:  JetBrains Mono, 14px, #00D4FF
Caption:     Inter Regular, 12px, #666688
```

---

## GLASSMORPHIC PANEL STANDARD

Every card, panel, and container uses glassmorphism. This is non-negotiable.

```css
/* Standard A2E Panel */
.a2e-panel {
  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 1px rgba(0, 212, 255, 0.1) inset;
}

/* Elevated Panel (hover/active) */
.a2e-panel-elevated {
  background: rgba(22, 33, 62, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 212, 255, 0.05);
}

/* HUD Panel (data display) */
.a2e-hud {
  background: rgba(13, 13, 26, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-left: 3px solid #00D4FF;
  border-radius: 8px;
}
```

---

## COMPONENT STANDARDS

### Status Indicators
```
🟢 GREEN  — Active/Live/Confirmed  → #2ED573
🟡 YELLOW — Warning/Pending/Watch  → #FFB347  
🔴 RED    — Alert/Failed/Breach    → #FF4757
⚪ GRAY   — Inactive/Offline      → #666688
🔵 TEAL   — In Progress/Loading   → #00D4FF
```

### Data Tables
- Header: #00D4FF text, bottom border 1px #00D4FF at 30% opacity
- Row alternating: #1A1A2E / #16213E
- Positive values: #2ED573
- Negative values: #FF4757
- Neutral/flat: #9999BB
- Ticker symbols: JetBrains Mono, #00D4FF, uppercase

### Buttons
```css
/* Primary Action */
.btn-primary {
  background: linear-gradient(135deg, #00D4FF 0%, #7B2FBE 100%);
  color: #0D0D1A;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  padding: 10px 20px;
}

/* Secondary Action */
.btn-secondary {
  background: transparent;
  color: #00D4FF;
  border: 1px solid rgba(0, 212, 255, 0.4);
  border-radius: 8px;
}

/* Danger */
.btn-danger {
  background: rgba(255, 71, 87, 0.15);
  color: #FF4757;
  border: 1px solid rgba(255, 71, 87, 0.4);
}
```

### Icons + Visual Elements
- Use Lucide React or Heroicons — clean, minimal, geometric
- Icon color: #00D4FF for active, #666688 for inactive
- No emoji in UI components (use in Telegram alerts only)
- Sacred geometry decorative elements: low opacity (5-15%), large, background layer only

---

## BULLSEYE INTERACTIVE RING MAP STANDARD

The BULLSEYE platform uses a concentric ring SVG as its primary navigation.

**Ring specifications:**
```
Ring 0 (center): Metatron cube, 80px radius, teal glow
Ring 1: Collective agents, 160px radius, 7 nodes
Ring 2: Protocol stack, 240px radius, 7 nodes
Ring 3: Capabilities, 320px radius, 8 nodes
Ring 4: Infrastructure, 400px radius, 8 nodes
Ring 5: Applications, 480px radius, 6 nodes
Ring 6: Security, 560px radius, 4 nodes

Ring line color: rgba(0, 212, 255, 0.15) — subtle, not dominant
Node default: rgba(26, 26, 46, 0.9) with teal border
Node hover: rgba(0, 212, 255, 0.1) fill, full teal border, scale 1.05
Node active: #00D4FF fill, dark text
```

**Animation standard:**
- Ring rotation: Rings 0-2 rotate slowly (360° / 120s) — subtle, not distracting
- Node hover: 150ms ease-in-out scale + glow transition
- Page load: Rings fade in center-out, 50ms stagger per ring
- No jarring animations. No bounce. Military precision, not game UI.

---

## AGENT PROFILE AESTHETIC

Each Collective agent has a visual identity for the BULLSEYE website.

**Reference:** @ad.aiart0 Instagram reel (15 Angels) — this is the benchmark aesthetic

| Agent | Visual | Color Accent | Character |
|-------|--------|-------------|-----------|
| URIEL | Angel — gold armor, commanding | #FFD700 Gold | CEO energy, strategic |
| MICHA | Angel — blue/white, analytical | #00D4FF Teal | Analytical, precise |
| COLOSSUS | Titan — dark metal, powerful | #8B0000 Deep red | Technical, raw power |
| HANIEL | Angel — green aura, flowing | #2ED573 Green | Political, diplomatic |
| RAZIEL | Angel — purple, mysterious | #7B2FBE Purple | Contrarian, deep research |
| GABRIEL | Messenger — white light | #FFFFFF White | Communication, automation |
| SERAPH | Seraph — multi-winged, burning | #FF6B35 Orange | Real-time, searching |

Each profile card: glassmorphic panel, agent image (AI-generated from @ad.aiart0 style reference), name in Dancing Script, role in Inter, accuracy stats in monospace.

---

## DOCUMENT + EXPORT STANDARD

When producing documents, reports, or PDFs for A2E:

**Header:** Metatron cube (small, top left) + "ASHES2ECHOES LLC" in Dancing Script + document title  
**Footer:** "Uriel Covenant AI Collective | CONFIDENTIAL" + page number + date  
**Watermark:** Metatron cube at 3% opacity, centered, full page  
**Color usage:** Teal for headers/highlights, standard grayscale for body text in print  
**Font in docs:** Fallback to Garamond or Georgia for body if Dancing Script unavailable  

---

## WHAT THIS BRAND IS NOT

**Never use:**
- Corporate blue (#0066CC, #003087 — looks like a bank)
- Generic gradients (pink-to-purple Instagram aesthetic)
- Stock photography of people in suits
- Comic Sans, Impact, or decorative fonts other than Dancing Script
- White backgrounds (BULLSEYE is dark mode only)
- Hard edges without glassmorphism on panels
- Neon green (#00FF00 — looks like 1990s hacking)
- Solid fills on panels (always transparent/blur)

---

## QUALITY BENCHMARK PROMPT

Before finalizing any visual output, ask:

> "Does this look like it belongs in a sovereign wealth fund's command center, or does it look like a startup's marketing page? If it looks like a startup, apply the A2E design standard until it doesn't."

The test: Would a defense program manager with 40 years of experience trust this interface with $400K in capital? If yes, ship it. If no, fix it.

---

## QUICK REFERENCE CARD

```
Background:    #0D0D1A (space) / #1A1A2E (panel)
Primary:       #00D4FF (teal glow)
Accent:        #7B2FBE (purple)
Text:          #E8E8F0 (primary) / #9999BB (secondary)
Positive:      #2ED573
Negative:      #FF4757
Warning:       #FFB347
Display font:  Dancing Script Bold
Body font:     Inter
Code font:     JetBrains Mono
Panel:         Glassmorphism — backdrop-filter: blur(12px)
Logo:          Metatron cube, teal glow on dark
Signature:     "William Earl Lemon" Dancing Script Bold + bezier flourish
```

---

*A2E BULLSEYE Design Skill v1.0*  
*Ashes2Echoes LLC | Uriel Covenant AI Collective*  
*Filed: BULLSEYE/A2E_BULLSEYE_DESIGN_SKILL_v1.0.md*  
*Load this file at the start of any BULLSEYE build session.*

