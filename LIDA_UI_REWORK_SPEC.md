# LIDA — UI/UX Rework Specification

> **Purpose:** Guide the next session for UI improvements
> **Date:** 2026-04-25

---

## 1. Executive Summary

The current LIDA frontend is a functional pixel-art demo. This document identifies **specific UI/UX issues** that need rework to elevate the product from "cool demo" to "professional SaaS platform" while retaining the pixel-art brand identity.

**Design Philosophy:** *"Pixel art as seasoning, not the main dish."*
- Keep pixel identity for: logo, icons, decorative elements, animations
- Use modern minimal UI for: tables, forms, data-heavy dashboards
- Add **one accent color** for functional emphasis

---

## 2. Critical Issues

### Issue 1: Pixel Art Overload (Severity: HIGH)

**Problem:** Every element has 2px black borders, blocky fonts, and pixel styling. This creates visual fatigue and makes the interface hard to scan.

**Evidence:**
- All 40+ UI components in `src/components/ui/*.tsx` have `border-2 border-black`
- Press Start 2P font used for body text (illegible at small sizes)
- Cards, buttons, inputs, badges — all identical styling

**Solution:**
```css
/* BEFORE (too much pixel) */
.card { border-2 border-black rounded-lg }
.button { bg-black text-white font-pixel border-2 }
.text { font-pixel text-sm }

/* AFTER (selective pixel) */
.card { border border-black/20 rounded-lg }  /* subtle */
.button-primary { bg-[#0066FF] text-white font-sans }  /* accent */
.button-secondary { bg-black text-white font-pixel border-2 }  /* pixel for emphasis */
.headline { font-pixel text-2xl }  /* pixel only for headlines */
.body { font-sans text-base text-gray-800 }  /* readable body */
```

**Files to modify:**
- `src/index.css` — Reduce global border intensity
- `src/components/ui/*.tsx` — Soften card/button/input styles
- `tailwind.config.js` — Add accent color + clean font

---

### Issue 2: Persian Translation Broken (Severity: HIGH)

**Problem:** `fa.ts` exists with 300+ translation keys, but components use hardcoded English strings. The language toggle only flips layout direction (RTL), not content.

**Evidence:**
```tsx
// Current (hardcoded) — in DashboardHome.tsx
<h2>Welcome back, {user.name}</h2>
<button>Deploy Agent</button>

// Should be:
<h2>{t('dashboard.welcome', { name: user.name })}</h2>
<button>{t('dashboard.deployAgent')}</button>
```

**Solution:**
1. Audit all `src/pages/**/*.tsx` files for hardcoded strings
2. Add missing keys to `src/i18n/en.ts` and `src/i18n/fa.ts`
3. Replace all strings with `const { t } = useTranslation(); t('key')`
4. Test RTL: tables, sidebars, chat bubbles must mirror

**Persian-specific additions:**
- Number formatting: Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩)
- Date: Jalali calendar using `persian-date` library
- Font: Vazirmatn weight 400-700 for body text

**Files to modify:**
- All `src/pages/**/*.tsx`
- `src/i18n/en.ts` and `src/i18n/fa.ts`

---

### Issue 3: LIDA Character Misplaced (Severity: MEDIUM)

**Problem:** LIDA (the pixel-art mascot) is a tiny floating widget in bottom-right. She should be the **hero** of the brand.

**Current:** `src/components/FloatingLIDA.tsx` — 128px, bottom-right corner, decorative only

**Recommended:**
```
Homepage Hero:
┌──────────────────────────────────────┐
│  ┌──────────┐                        │
│  │          │  "YOUR NEXT EMPLOYEE  │
│  │  LIDA    │   IS CODE"           │
│  │  256px   │                        │
│  │  animated│  [Deploy Agent]       │
│  │  sprite  │                        │
│  └──────────┘                        │
│     ↑                                │
│     Main focal point                 │
└──────────────────────────────────────┘
```

**Animation states for hero LIDA:**
- **Idle:** Breathing loop (translateY oscillation, 3s)
- **Wave:** Triggered on hover or page load (play once)
- **Blink:** Random eye-close sprite swap (every 4-8s)
- **Think:** When user scrolls to "How It Works" section

**Remove** `FloatingLIDA.tsx` from all pages except dashboard (where it can serve as quick-help).

**Files to modify:**
- `src/components/sections/HeroSection.tsx` — Add large LIDA sprite
- `src/components/FloatingLIDA.tsx` — Reduce to dashboard-only

---

### Issue 4: Animations Too Subtle (Severity: MEDIUM)

**Problem:** Glitch effects, typewriter text, and pixel particles are so subtle they're almost invisible. The "wow" factor is lost.

**Current:**
- Glitch: `box-shadow: ±2px` displacement (barely noticeable)
- Typewriter: Only on hero headline
- Scanline: 3% opacity (invisible)

**Recommended:**
```css
/* Glitch Effect — MORE AGGRESSIVE */
@keyframes glitch {
  0% { transform: translate(0); filter: none; }
  20% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
  40% { transform: translate(3px, -2px); filter: hue-rotate(-90deg); }
  60% { transform: translate(-2px); clip-path: inset(10% 0 60% 0); }
  80% { transform: translate(2px); clip-path: inset(40% 0 20% 0); }
  100% { transform: translate(0); filter: none; }
}

/* Typewriter — USE EVERYWHERE */
.agent-message {
  animation: typewriter 0.02s steps(1) forwards;
}

/* Scanline — EITHER VISIBLE OR REMOVED */
/* Option A: Visible (10% opacity) */
.scanline { opacity: 0.1; }
/* Option B: Remove entirely */
/* Delete scanline overlay */
```

**Files to modify:**
- `src/index.css` — Enhance glitch keyframes
- `src/components/sections/HeroSection.tsx` — Keep typewriter
- `src/pages/dashboard/Chat.tsx` — Add typewriter to agent messages
- `src/components/Layout.tsx` — Make scanline visible or remove

---

### Issue 5: No Accent Color (Severity: MEDIUM)

**Problem:** Pure black/white feels harsh and makes CTAs blend in. No visual hierarchy.

**Recommended:** Add **one** accent color:
```
Primary Accent: #0066FF (Electric Blue)
Usage:
- Primary CTAs (Deploy, Buy, Chat)
- Active states (selected tab, current page)
- Agent status: online = #00C853, busy = #FFD600, offline = #FF3D00
- Links and interactive elements
- Progress bars
```

**Files to modify:**
- `tailwind.config.js` — Add `accent: '#0066FF'` to theme
- `src/components/ui/button.tsx` — Add accent variant
- All CTA buttons across pages

---

### Issue 6: Chat Interface Feels Static (Severity: HIGH)

**Problem:** Chat page (`src/pages/dashboard/Chat.tsx`) has pre-written mock messages. No feeling of real conversation.

**Recommended improvements:**
1. **Typing indicator:** 3 animated dots when agent is "thinking"
2. **Message bubbles:** User = modern rounded; Agent = terminal-style block
3. **Timestamp:** Relative time ("2 min ago")
4. **Read receipts:** Small checkmark icons
5. **File attachments:** Drag-and-drop zone with pixel styling
6. **Quick actions:** Chips above input ("Generate Report", "Check Pipeline")

**Files to modify:**
- `src/pages/dashboard/Chat.tsx` — Complete rework of message rendering

---

### Issue 7: Mobile Dashboard Cramped (Severity: MEDIUM)

**Problem:** Dashboard tables, sidebar, and chat don't work well on mobile.

**Recommended:**
- Sidebar: Slide-out drawer on mobile (not persistent)
- Tables: Card-based layout on mobile (1 column)
- Chat: Full-screen with slide-out agent list
- Touch targets: Minimum 44x44px

**Files to modify:**
- `src/components/DashboardSidebar.tsx`
- `src/components/DashboardLayout.tsx`
- All dashboard pages

---

### Issue 8: Missing Loading States (Severity: MEDIUM)

**Problem:** Pages appear instantly. No skeleton, no spinner, no feedback.

**Recommended:**
```tsx
// Loading skeleton for dashboard stats
<div className="animate-pulse">
  <div className="h-8 bg-black/10 rounded w-24"></div>
</div>

// Loading spinner (pixel art style)
<div className="pixel-spinner">
  [LIDA running animation]
</div>
```

**Files to modify:**
- All dashboard pages — Add loading states for async data
- `src/components/` — Create Skeleton, Spinner components

---

## 3. Page-by-Page Rework Checklist

### Public Pages

| Page | Changes | Priority |
|------|---------|----------|
| **Home** | Add LIDA hero sprite (256px), accent CTA buttons, visible scanline | P0 |
| **About** | Reduce pixel borders on text sections, add LIDA illustrations | P1 |
| **Agents** | Agent cards: accent color on price, hover glitch effect | P1 |
| **Pricing** | Highlight "Pro" plan with accent, add "Most Popular" badge | P1 |
| **Contact** | Cleaner form layout (less pixel borders), success animation | P2 |
| **Auth** | Narrow card (max-w-md), accent submit button, error shake | P1 |

### Dashboard Pages

| Page | Changes | Priority |
|------|---------|----------|
| **DashboardHome** | Real-time stats with count-up animation, accent color on numbers | P0 |
| **MyAgents** | Status dots (green/yellow/red), progress bars with accent | P1 |
| **AgentStore** | Cards with hover lift + glitch, accent "Add to Cart" | P1 |
| **Chat** | Typing indicator, message timestamps, quick-action chips, file drop | P0 |
| **Team** | Cleaner table (zebra striping, less borders), avatar placeholders | P1 |
| **Billing** | Accent on "Current Plan", progress bar for usage | P2 |
| **Settings** | Toggle switches with accent, cleaner tab navigation | P2 |

### Admin Pages

| Page | Changes | Priority |
|------|---------|----------|
| **AdminDashboard** | Charts with accent color, stat cards with count-up | P1 |
| **Companies** | Sticky header, row hover, less pixel borders | P1 |
| **Agents** | Agent builder preview with accent, version badges | P2 |
| **Support** | Priority color coding (red=urgent, yellow=medium, green=low) | P2 |

---

## 4. Animation Specification

### Global Animations

| Animation | Trigger | Duration | Easing |
|-----------|---------|----------|--------|
| Page transition | Route change | 400ms | steps(6) |
| Scroll reveal | Element enters viewport | 600ms | steps(4) |
| Glitch hover | Mouse over interactive | 200ms | linear |
| Pixel confetti | Success state | 2s | ease-out |

### Component-Specific

| Component | Animation | Spec |
|-----------|-----------|------|
| **LIDA Hero** | Idle breathing | translateY(0 → -8px), 3s, infinite |
| **LIDA Hero** | Wave on hover | Sprite swap to wave.png, play once |
| **Agent Typing** | 3 dots bounce | scale(0.5 → 1), stagger 0.2s, infinite |
| **Message appear** | Slide + fade | translateY(10px → 0) + opacity, 200ms |
| **Stat counter** | Count up | 0 → value, 1.5s, ease-out |
| **Card hover** | Lift + glitch | translateY(-4px) + glitch flash, 200ms |
| **Button press** | Scale down | scale(0.95), 100ms |

---

## 5. Design Tokens (Updated)

### Colors

```
--color-bg:          #FFFFFF
--color-bg-alt:      #000000
--color-text:        #000000
--color-text-inverse:#FFFFFF
--color-accent:      #0066FF    /* NEW: Primary accent */
--color-accent-hover:#0052CC
--color-success:     #00C853    /* NEW: Agent online */
--color-warning:     #FFD600    /* NEW: Agent busy */
--color-danger:      #FF3D00    /* NEW: Agent offline / error */
--color-border:      #000000
--color-border-subtle: rgba(0,0,0,0.15)  /* UPDATED: lighter */
--color-surface:     rgba(0,0,0,0.03)    /* UPDATED: lighter */
```

### Typography

```
Display / Headlines:  Press Start 2P, 400, 24-64px
Body / UI:           Inter (NEW), 400-600, 14-16px  /* replaces Space Mono for body */
Monospace / Code:    Space Mono, 400, 13px
Persian:             Vazirmatn, 400-700, 14-16px
Labels / Badges:     Press Start 2P, 400, 10-12px
```

### Spacing (unchanged)

```
Section padding: 80-120px
Card padding: 24px
Card gap: 16px
Page max-width: 1280px
```

---

## 6. Asset Requirements

| Asset | Description | Size | Priority |
|-------|-------------|------|----------|
| `lida-hero.png` | Large LIDA for homepage hero | 256x256 | P0 |
| `lida-loading.png` | Running animation sprite | 128x128 | P1 |
| `lida-404.png` | Confused LIDA for error page | 256x256 | P2 |
| `lida-success.png` | Celebrating LIDA | 128x128 | P2 |

---

## 7. Implementation Order

1. **Week 1:** Fix Persian translations (audit all files)
2. **Week 1:** Add accent color to Tailwind config, update buttons
3. **Week 2:** Rework HeroSection with large LIDA sprite
4. **Week 2:** Enhance Chat page (typing indicator, quick actions)
5. **Week 3:** Polish dashboard tables (less borders, accent highlights)
6. **Week 3:** Add loading states and 404 page
7. **Week 4:** Mobile responsiveness pass

---

> **Document Version:** 1.0
> **Status:** Ready for next development session
