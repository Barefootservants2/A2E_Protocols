#!/usr/bin/env python3
"""
MAGAI M3 CONTEST — MAGAZINE COVER BUILDER
Ashes2Echoes, LLC | February 10, 2026
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# === CONFIGURATION ===
COVER_W = 1080  # Instagram/magazine portrait
COVER_H = 1920  # 9:16 ratio

# Brand colors
GOLD = (212, 175, 55)
BRIGHT_GOLD = (255, 215, 0)
TEAL = (0, 200, 200)
BRIGHT_CYAN = (0, 230, 230)
WHITE = (255, 255, 255)
OFF_WHITE = (240, 240, 240)
DARK_BG = (8, 8, 12)

# Magai gradient colors (from brand page)
MAGAI_YELLOW = (255, 200, 50)
MAGAI_ORANGE = (255, 140, 50)
MAGAI_RED = (230, 60, 80)
MAGAI_PURPLE = (160, 60, 200)
MAGAI_BLUE = (60, 100, 220)

# Fonts
FONT_BOLD = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_LIGHT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
FONT_CONDENSED = "/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Oblique.ttf"

def create_gradient_text(draw, text, position, font, colors, direction='horizontal'):
    """Create gradient-colored text by rendering character by character."""
    x, y = position
    total_width = draw.textlength(text, font=font)
    
    for i, char in enumerate(text):
        # Calculate position along the gradient
        char_x = x + draw.textlength(text[:i], font=font)
        progress = char_x / (x + total_width) if (x + total_width) > 0 else 0
        progress = max(0, min(1, (char_x - x) / max(total_width, 1)))
        
        # Interpolate between colors
        num_segments = len(colors) - 1
        segment = min(int(progress * num_segments), num_segments - 1)
        local_progress = (progress * num_segments) - segment
        
        c1 = colors[segment]
        c2 = colors[min(segment + 1, len(colors) - 1)]
        
        r = int(c1[0] + (c2[0] - c1[0]) * local_progress)
        g = int(c1[1] + (c2[1] - c1[1]) * local_progress)
        b = int(c1[2] + (c2[2] - c1[2]) * local_progress)
        
        draw.text((char_x, y), char, font=font, fill=(r, g, b, 255))


def build_cover():
    # Load the angel image
    angel = Image.open('/home/claude/angel_raw.png').convert('RGBA')
    
    # Create cover canvas
    cover = Image.new('RGBA', (COVER_W, COVER_H), DARK_BG + (255,))
    
    # Scale angel to fill the cover width while maintaining aspect ratio
    angel_ratio = angel.height / angel.width
    angel_w = COVER_W
    angel_h = int(COVER_W * angel_ratio)
    
    # If angel isn't tall enough, scale to fill height instead
    if angel_h < COVER_H:
        angel_h = COVER_H
        angel_w = int(COVER_H / angel_ratio)
    
    angel_resized = angel.resize((angel_w, angel_h), Image.LANCZOS)
    
    # Center the angel on the cover, shift down slightly for masthead space
    ax = (COVER_W - angel_w) // 2
    ay = 80  # Push down to leave masthead space
    
    cover.paste(angel_resized, (ax, ay), angel_resized)
    
    # === DARKEN TOP AND BOTTOM FOR TEXT READABILITY ===
    overlay = Image.new('RGBA', (COVER_W, COVER_H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    
    # Top gradient (for masthead)
    for y in range(350):
        alpha = int(200 * (1 - y / 350))
        od.line([(0, y), (COVER_W, y)], fill=(0, 0, 0, alpha))
    
    # Bottom gradient (for features/info)
    for y in range(COVER_H - 500, COVER_H):
        progress = (y - (COVER_H - 500)) / 500
        alpha = int(220 * progress)
        od.line([(0, y), (COVER_W, y)], fill=(0, 0, 0, alpha))
    
    # Right side gradient for feature text
    for x in range(COVER_W - 400, COVER_W):
        progress = (x - (COVER_W - 400)) / 400
        alpha = int(140 * progress)
        for y in range(500, COVER_H - 400):
            pass  # Skip this - let the dark bg handle it
    
    cover = Image.alpha_composite(cover, overlay)
    
    # === DRAW TEXT ===
    draw = ImageDraw.Draw(cover)
    
    # --- MASTHEAD: ASHES2ECHOES ---
    font_masthead = ImageFont.truetype(FONT_BOLD, 52)
    masthead_text = "ASHES2ECHOES"
    bbox = draw.textbbox((0, 0), masthead_text, font=font_masthead)
    mw = bbox[2] - bbox[0]
    mx = (COVER_W - mw) // 2
    my = 35
    
    # Gold glow behind masthead
    glow_layer = Image.new('RGBA', (COVER_W, COVER_H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    for offset in range(6, 0, -1):
        alpha = int(40 * (1 - offset / 6))
        glow_draw.text((mx, my), masthead_text, font=font_masthead, 
                       fill=GOLD + (alpha,))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=4))
    cover = Image.alpha_composite(cover, glow_layer)
    draw = ImageDraw.Draw(cover)
    
    # Masthead text in gold
    draw.text((mx, my), masthead_text, font=font_masthead, fill=BRIGHT_GOLD + (255,))
    
    # Thin line under masthead
    line_y = my + 65
    draw.line([(mx, line_y), (mx + mw, line_y)], fill=GOLD + (120,), width=1)
    
    # --- ISSUE INFO (left aligned under masthead line) ---
    font_issue = ImageFont.truetype(FONT_LIGHT, 16)
    draw.text((mx, line_y + 8), "ISSUE 001  •  FEBRUARY 2026  •  AI FUTURES", 
              font=font_issue, fill=OFF_WHITE + (160,))
    
    # --- MAGAI WORDMARK (centered, mid-upper) ---
    font_magai = ImageFont.truetype(FONT_BOLD, 72)
    magai_text = "Magai"
    bbox_m = draw.textbbox((0, 0), magai_text, font=font_magai)
    magai_w = bbox_m[2] - bbox_m[0]
    magai_x = (COVER_W - magai_w) // 2
    magai_y = 160
    
    # Magai glow
    glow2 = Image.new('RGBA', (COVER_W, COVER_H), (0, 0, 0, 0))
    glow2_draw = ImageDraw.Draw(glow2)
    glow2_draw.text((magai_x, magai_y), magai_text, font=font_magai, fill=(255, 150, 50, 80))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(radius=10))
    cover = Image.alpha_composite(cover, glow2)
    draw = ImageDraw.Draw(cover)
    
    # Magai text with gradient
    create_gradient_text(draw, magai_text, (magai_x, magai_y), font_magai,
                        [MAGAI_YELLOW, MAGAI_ORANGE, MAGAI_RED, MAGAI_PURPLE, MAGAI_BLUE])
    
    # --- "OPEN OUR FUTURES" below Magai ---
    font_futures = ImageFont.truetype(FONT_BOLD, 22)
    futures_text = "OPEN  OUR  FUTURES"
    bbox_f = draw.textbbox((0, 0), futures_text, font=font_futures)
    fw = bbox_f[2] - bbox_f[0]
    fx = (COVER_W - fw) // 2
    fy = magai_y + 82
    
    # Cyan glow
    glow3 = Image.new('RGBA', (COVER_W, COVER_H), (0, 0, 0, 0))
    glow3_draw = ImageDraw.Draw(glow3)
    glow3_draw.text((fx, fy), futures_text, font=font_futures, fill=BRIGHT_CYAN + (100,))
    glow3 = glow3.filter(ImageFilter.GaussianBlur(radius=6))
    cover = Image.alpha_composite(cover, glow3)
    draw = ImageDraw.Draw(cover)
    
    draw.text((fx, fy), futures_text, font=font_futures, fill=BRIGHT_CYAN + (240,))
    
    # --- FEATURE HEADLINES (lower right) ---
    font_feature_label = ImageFont.truetype(FONT_BOLD, 18)
    font_feature_desc = ImageFont.truetype(FONT_REGULAR, 14)
    
    features = [
        ("THE PROMPT", "One prompt. Two days.\nThe process that changes\neverything."),
        ("NANO BANANA PRO", "Why the model nobody\npicked won the contest."),
        ("#MadeWithMagai", "20+ AI engines.\nOne platform. Zero limits."),
    ]
    
    feat_x = COVER_W - 320
    feat_y = COVER_H - 520
    
    for label, desc in features:
        # Semi-transparent backing pill
        desc_lines = desc.count('\n') + 1
        pill_h = 22 + (desc_lines * 18) + 16
        pill = Image.new('RGBA', (290, pill_h), (0, 0, 0, 120))
        cover.paste(Image.alpha_composite(
            Image.new('RGBA', (290, pill_h), (0, 0, 0, 0)), pill
        ), (feat_x - 10, feat_y - 4), pill)
        draw = ImageDraw.Draw(cover)
        
        # Feature label in gold
        draw.text((feat_x, feat_y), label, font=font_feature_label, fill=BRIGHT_GOLD + (230,))
        
        # Feature description in white
        feat_desc_y = feat_y + 24
        for line in desc.split('\n'):
            draw.text((feat_x, feat_desc_y), line, font=font_feature_desc, fill=OFF_WHITE + (200,))
            feat_desc_y += 18
        
        feat_y += pill_h + 16
    
    # --- BOTTOM BAR ---
    bar_y = COVER_H - 80
    draw.rectangle([(0, bar_y), (COVER_W, bar_y + 2)], fill=GOLD + (80,))
    
    font_bar = ImageFont.truetype(FONT_LIGHT, 14)
    draw.text((40, bar_y + 15), "ASHES2ECHOES, LLC", font=font_bar, fill=GOLD + (180,))
    draw.text((40, bar_y + 35), "Uriel Covenant AI Collective", font=font_bar, fill=OFF_WHITE + (120,))
    
    # Issue/barcode area (right side)
    font_bar_right = ImageFont.truetype(FONT_REGULAR, 12)
    draw.text((COVER_W - 250, bar_y + 15), "M3 CONTEST ENTRY  •  2026", font=font_bar_right, fill=OFF_WHITE + (140,))
    draw.text((COVER_W - 250, bar_y + 35), "ashes2echoes.com", font=font_bar_right, fill=TEAL + (160,))
    
    # Decorative barcode (fake, for magazine feel)
    barcode_x = COVER_W - 90
    barcode_y = bar_y + 10
    import random
    random.seed(42)
    for i in range(20):
        w = random.choice([2, 3, 4])
        h = random.randint(30, 45)
        draw.rectangle([(barcode_x, barcode_y), (barcode_x + w, barcode_y + h)], 
                       fill=WHITE + (100,))
        barcode_x += w + random.choice([1, 2])
    
    # === SAVE ===
    final = cover.convert('RGB')
    final.save('/home/claude/magai_contest_cover.png', quality=95)
    print(f"Cover saved: {final.size[0]}x{final.size[1]}")
    
    return final

if __name__ == '__main__':
    build_cover()
