---
name: a2e-brand-guidelines
description: Applies Ashes2Echoes (A2E) / Uriel Covenant brand identity to any artifact, document, presentation, or web output. Use when brand colors, typography, logo placement, or A2E visual identity standards apply. Triggers on mentions of A2E branding, Metatron cube, teal glow, Ashes2Echoes styling, or Collective visual identity.
license: Proprietary - Ashes2Echoes LLC
---

# Ashes2Echoes Brand Guidelines

## Overview

Official brand identity system for Ashes2Echoes LLC and the Uriel Covenant AI Collective. Apply these standards to all outputs including presentations, documents, web artifacts, social media, apparel, and platform interfaces.

**Keywords**: A2E, Ashes2Echoes, Uriel Covenant, Metatron cube, branding, teal, sacred geometry, Collective, BULLSEYE

## Brand Identity

### Logo & Mark

- **Primary Mark**: Metatron sacred geometry cube with teal glow on gray background
- **Usage**: All branding, apparel, website headers, document headers, and presentation title slides
- **Clear space**: Minimum 1x cube width on all sides
- **Minimum size**: 32px digital, 0.5" print
- **Do NOT**: Rotate, distort, recolor outside approved palette, or place on busy backgrounds

### Colors

**Primary Palette:**

- Teal Glow: `#00BFA6` - Primary accent, logo glow, CTAs, highlights
- Dark Gray: `#2D2D2D` - Primary backgrounds, text on light
- Medium Gray: `#4A4A4A` - Secondary backgrounds, cards
- Light Gray: `#E0E0E0` - Borders, subtle dividers

**Secondary Palette:**

- Deep Teal: `#008B76` - Hover states, secondary accent
- Near Black: `#1A1A1A` - Deepest backgrounds, hero sections
- White: `#FFFFFF` - Text on dark, clean space
- Warm Gray: `#9E9E9E` - Muted text, captions

**Signal Colors (for data/status):**

- Bullish Green: `#4CAF50` - Positive, confirmed, pass
- Bearish Red: `#F44336` - Negative, failed, stop
- Caution Amber: `#FFC107` - Warning, pending, watch
- Info Blue: `#2196F3` - Informational, neutral data

### Typography

- **Headings**: Inter Bold (with Arial Bold fallback)
- **Body Text**: Inter Regular (with Arial fallback)
- **Monospace/Code**: JetBrains Mono (with Consolas fallback)
- **Signature/Display**: Dancing Script Bold (William Earl Lemon signature only)
- **Heading Scale**: H1=32pt, H2=24pt, H3=18pt, H4=14pt
- **Body**: 14pt standard, 12pt compact

### Voice & Tone

- Direct, no-nonsense, technically precise
- Zero placation. Raw facts. Truth over comfort.
- Confidence without arrogance
- "Loss is tuition for knowledge" philosophy embedded in all educational content
- Never use corporate jargon or filler language

## Application Rules

### Documents (DOCX/PDF)

- Header: Metatron cube mark (left) + "ASHES2ECHOES" wordmark (right)
- Footer: "Ashes2Echoes LLC | Newport News, VA | Confidential" centered
- Section headers: Teal accent bar (3pt) above heading text
- Body text: Dark Gray on White
- Code blocks: JetBrains Mono on Near Black background

### Presentations (PPTX)

- Title slide: Full bleed Near Black background, Metatron cube centered, title in White below
- Content slides: Dark Gray background, Teal accent elements
- Data slides: Use Signal Colors for status indicators
- Final slide: Metatron cube + "Not willing to give up your life for beliefs = for sale" tagline
- Font minimum: 40pt (Winston rule)

### Web / HTML Artifacts

- Background: Near Black (`#1A1A1A`) or Dark Gray (`#2D2D2D`)
- Primary text: White (`#FFFFFF`)
- Accent elements: Teal Glow (`#00BFA6`)
- Interactive elements: Teal Glow with Deep Teal hover
- Cards/panels: Medium Gray (`#4A4A4A`) with subtle teal border
- Border radius: 8px standard

### Agent Profiles (BULLSEYE)

Each Collective agent uses the base palette plus a unique accent:
- MICHA (CIO): Teal Glow `#00BFA6`
- URIEL (Strategist): Gold `#FFD700`
- COLOSSUS (Quant): Electric Blue `#00B8D4`
- HANIEL (Research): Emerald `#00C853`
- RAZIEL (Deep Analysis): Purple `#AA00FF`
- SARIEL (Search): Orange `#FF6D00`
- GABRIEL (Watch): Silver `#B0BEC5`

## Technical Implementation

### CSS Variables

```css
:root {
  --a2e-teal: #00BFA6;
  --a2e-teal-deep: #008B76;
  --a2e-dark: #2D2D2D;
  --a2e-darker: #1A1A1A;
  --a2e-mid: #4A4A4A;
  --a2e-light: #E0E0E0;
  --a2e-white: #FFFFFF;
  --a2e-muted: #9E9E9E;
  --a2e-green: #4CAF50;
  --a2e-red: #F44336;
  --a2e-amber: #FFC107;
  --a2e-blue: #2196F3;
  --font-heading: 'Inter', Arial, sans-serif;
  --font-body: 'Inter', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, monospace;
  --radius: 8px;
}
```

### Python (python-pptx / docx)

```python
A2E_COLORS = {
    'teal': RGBColor(0x00, 0xBF, 0xA6),
    'dark': RGBColor(0x2D, 0x2D, 0x2D),
    'darker': RGBColor(0x1A, 0x1A, 0x1A),
    'mid': RGBColor(0x4A, 0x4A, 0x4A),
    'white': RGBColor(0xFF, 0xFF, 0xFF),
    'green': RGBColor(0x4C, 0xAF, 0x50),
    'red': RGBColor(0xF4, 0x43, 0x36),
    'amber': RGBColor(0xFF, 0xC1, 0x07),
}
```
