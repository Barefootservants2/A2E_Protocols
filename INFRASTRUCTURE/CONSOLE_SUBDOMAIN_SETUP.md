# Console Subdomain Setup Guide

**Goal:** Promote MICHA Console from `ashes2echoes.com/console/` (currently public, soft-locked) to `console.ashes2echoes.com` with full Vercel Authentication (SSO-required).

**Time:** ~5 minutes, one-time
**Cost:** $0 — Vercel Authentication is free on all plans

---

## Why do this

The current `/console/` path is reachable by anyone who knows the URL. The wake-screen passcode is client-side only — no real security. Promoting to a dedicated subdomain with Vercel Authentication means:

- Anyone visiting `console.ashes2echoes.com` is redirected to Vercel SSO login
- Only team members (currently: `ashes2echoesplatform-7848`) can log in
- No URL guessing, no password sharing, no client-side-only theater
- `ashes2echoes.com/console/` can stay as a fallback or be removed

---

## Steps

### 1. Create the new Vercel project

Go to https://vercel.com/new

1. Click **Import Git Repository**
2. Select **Barefootservants2/Ashes2Echoes** (already connected)
3. Name the project: `ashes2echoes-console`
4. **Framework Preset:** Other (leave as default)
5. **Root Directory:** Click "Edit" → type `console` → save
6. **Build & Output Settings:** Leave all blank (static site)
7. Click **Deploy**

Deploy takes ~6-10 seconds. Confirm it lands READY.

### 2. Enable Vercel Authentication

On the new project's dashboard:

1. Settings → **Deployment Protection**
2. Under **Vercel Authentication**, select **Standard Protection**
   - (This protects production + all previews)
   - Only team members with SSO access can view
3. Save

Re-open the deploy URL — should now prompt for Vercel login.

### 3. Add the custom domain

Same project:

1. Settings → **Domains**
2. Type: `console.ashes2echoes.com`
3. Click **Add**

DNS should auto-verify because `ashes2echoes.com` is already pointed at Vercel (the main site uses the same nameservers). The subdomain will resolve within 30-60 seconds.

### 4. Verify

Open `https://console.ashes2echoes.com/` in a browser:

- First visit: should redirect to `vercel.com/sso` → prompts GitHub/Google login
- After authenticating as `ashes2echoesplatform-7848@...`: loads the console (wake screen → orb → login → views)
- On any other browser without your auth: locked out

### 5. Update INFRA_MAP

After verification works:

1. Edit `A2E_Protocols/INFRASTRUCTURE/INFRA_MAP.md`
2. Move the console entry from "PENDING" to the Production URLs table
3. Commit

### 6. (Optional) Remove public /console/ fallback

If you want the `/console/` subpath to stop serving:

- Option A: Delete `Ashes2Echoes/console/index.html` from the repo
- Option B: Add a vercel.json rewrite that returns 410 Gone for `/console/*`

Recommended: **keep the fallback for a week**, then decide. Having it lets you compare UX of the two paths.

---

## Rollback

If anything breaks:

1. In the new `ashes2echoes-console` project, click **Settings → General → Delete Project**
2. Confirm deletion
3. The `/console/` subpath on the main site is untouched — continues serving

---

## Additional notes

**Sharing access with collaborators**: If someone else needs to view the console behind auth, invite them to the Ashes2Echoes Vercel team. They'll be able to log in with their Vercel account after accepting the invite.

**Emergency bypass**: If you need an automation (CI, Puppeteer test) to access the protected console without human login, generate a Protection Bypass token in Settings → Deployment Protection → "Protection Bypass for Automation". Use as a URL query param or header.

**Mobile access**: Vercel SSO works on mobile browsers. Your Chrome/Safari session will persist after first login.

---

## When this doc was written

2026-04-24 PHOENIX S3c · Initial deploy of MICHA Console v0.3 to `/console/` subpath. Subdomain promotion is a 5-min follow-up you can do when convenient.
