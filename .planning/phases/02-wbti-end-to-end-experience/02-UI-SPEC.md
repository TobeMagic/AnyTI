---
phase: 2
slug: wbti-end-to-end-experience
status: draft
shadcn_initialized: false
preset: new-york
created: 2026-04-13
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for the first user-facing BTI flow. This draft absorbs the user's direction: homepage -> category page -> test page, category-specific theme colors, and a more socially legible archetype style than conventional MBTI language.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | new-york |
| Component library | radix |
| Icon library | lucide-react |
| Font | Space Grotesk + Noto Sans SC |

---

## Information Architecture

1. `/` — Platform homepage: introduces the BTI matrix, shows category cards, and routes into category landing pages.
2. `/{category}/` — Category landing page: frames the category mood, applies category theme color, and leads into the concrete test.
3. `/{test-slug}/` — Test page: dedicated landing, quiz flow, and result experience.
4. `/{test-slug}/types/{type-id}/` — Reserved for future type/detail pages; not required to ship in Phase 2.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Compact element spacing |
| md | 16px | Default element spacing |
| lg | 24px | Section padding |
| xl | 32px | Layout gaps |
| 2xl | 48px | Major section breaks |
| 3xl | 64px | Page-level spacing |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.6 |
| Label | 14px | 400 | 1.4 |
| Heading | 28px | 700 | 1.2 |
| Display | 44px | 700 | 1.05 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#F3F7FA` | Platform background, page canvas, quiet surfaces |
| Secondary (30%) | `#D7E4EE` | Cards, section panels, navigation shells |
| Accent (10%) | `#2D5E83` | Primary CTA, progress bar, active states, key highlights |
| Destructive | `#B54A3A` | Destructive actions only |

Accent reserved for: primary CTA, selected category card state, quiz progress fill, active links, key badges

### Theme Architecture

- Platform homepage uses a neutral matrix shell so category colors feel distinct when users drill down.
- Each category page gets a dedicated accent family while reusing the same spacing, card, and navigation system.
- Example category accents:
  - Work / WBTI: steel blue + slate
  - Love / LBTI: rose + blush pink
  - Study / STBI: citrus yellow + ink
  - Spend / SBTI-like commerce lane: coral gold + cream
  - Fitness / FBTI: lime green + graphite
  - Travel / TBTI: sky teal + sand
- Test pages inherit the category accent but reduce visual noise so answering remains focused.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | 开始这个测试 |
| Empty state heading | 这个分类还在长出来 |
| Empty state body | 先去测已经上线的那个，或者回首页看看别的入口 |
| Error state | 页面没接住你这次点击，请刷新重试或回到上一层入口 |
| Destructive confirmation | 重新开始测试: 你当前进度会被清空，确认重来？ |

### Archetype Language Contract

- Result naming must read like a social label people愿意截图发出去, not like a formal psychometric label.
- Tone should be abstract, slightly sharp, and funny, but still feel “被说中”.
- Avoid textbook phrases such as “理性分析型人格” as the final display label.
- The shortest label should still make sense inside posters, recommendation cards, and future type galleries.

---

## Visual Hierarchy

- Platform homepage focal point: the category hero grid and the strongest category CTA above the fold.
- Category page focal point: the category headline plus the featured test card that leads into the active quiz.
- Test page focal point: the test name, short premise, and the primary start CTA.
- Result page focal point: the archetype name block first, then the one-line hit, then the dimension summary.

---

## Interaction Contract

- Homepage category cards must be obviously tappable on mobile and large enough for thumb-first use.
- Category pages must feel like “mini campaign hubs” rather than plain directory lists.
- Quiz progress must stay visible but not dominate the screen.
- Result pages should prioritize archetype name, one-line hit, dimension summary, and the next action.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | Card, Button, Badge, Progress, Tabs, Sheet, Dialog, Accordion | not required |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PENDING
- [ ] Dimension 2 Visuals: PENDING
- [ ] Dimension 3 Color: PENDING
- [ ] Dimension 4 Typography: PENDING
- [ ] Dimension 5 Spacing: PENDING
- [ ] Dimension 6 Registry Safety: PENDING

**Approval:** pending
