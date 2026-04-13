# Project Research Summary

**Project:** BTI Matrix Platform
**Domain:** Static BTI-style personality quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** HIGH

## Executive Summary

This product is best treated as a static multi-page quiz matrix, not as a single app shell. The official Vite and GitHub Pages documentation align unusually well with the user's desired structure: one route per test, one shared engine, data packs per test, and deployment through GitHub Actions to Pages. That means the technical strategy should stay intentionally simple in v1: Vite 7, TypeScript 5.9, browser-native APIs, and a small set of supporting libraries for schema validation, QR generation, and engine tests.

The product landscape shows that successful personality-test products consistently combine three things: low-friction test entry, immediate identity-rich results, and adjacent expansion paths such as work, relationships, or career. What this project can do differently is treat social distribution and matrix compounding as first-class product behavior rather than afterthoughts. The poster export, hidden personalities, and cross-test recommendations are not decorative features; they are the bridge between one-off traffic and a durable matrix asset.

The main risk is self-inflicted complexity. The fastest way to lose the project is to build too much platform before WBTI proves the template, or to adopt an architecture that fights static hosting and page-level SEO. The roadmap should therefore front-load engine contracts, WBTI end-to-end delivery, and poster reliability, then prove replication with a second test on the same shared engine.

## Key Findings

### Recommended Stack

The recommended baseline is Vite 7 multi-page app mode on top of Node.js 20.19+ / 22.12+, written in TypeScript 5.9, deployed to GitHub Pages through GitHub Actions. Add Zod for data-pack validation, Vitest for scoring engine tests, and `qrcode` for the poster QR workflow. This stays fully aligned with the project's zero-backend, zero-ops constraint and preserves the user's planned folder-per-test layout.

**Core technologies:**
- **Vite 7.x:** static multi-page build and GitHub Pages-friendly deployment
- **TypeScript 5.9.x:** typed engine contracts and safer data-driven cloning
- **GitHub Pages + Actions:** zero-ops hosting that matches the chosen stack
- **Canvas/Web Storage/Web Share:** native runtime APIs for postering, light persistence, and mobile sharing

### Expected Features

The table stakes are clear: quick quiz flow, immediate free result, memorable type naming, credibility framing, and a discoverable multi-test surface. Competitors already offer broad test libraries and identity-centric results; what they do less visibly is matrix-native social spread. That is the opening for this project.

**Must have (table stakes):**
- Fast quiz flow and mobile completion
- Immediate result reveal with a memorable type identity
- Basic credibility/disclaimer framing
- Discoverable adjacent tests or a clear next-step CTA

**Should have (competitive):**
- Canvas poster with QR
- Cross-test recommendation slot
- Hidden personality/easter-egg logic
- Continuous-spectrum scoring with richer type matching

**Defer (v2+):**
- Accounts/history
- Admin/CMS tooling
- Team/comparison features

### Architecture Approach

The recommended architecture is directory-based static entries backed by one shared runtime and one deterministic scoring engine. Each test should ship its own `questions.json`, `personalities.json`, and `meta.json`, while the shared engine handles loading, validation, scoring, result mapping, poster export, and recommendations. This keeps the clone path explicit and testable.

**Major components:**
1. **Per-test static entry pages** — own route, metadata, and current-test bootstrapping
2. **Shared engine modules** — schema validation, scoring, matching, hidden-type rules
3. **Result/poster layer** — renders final type, poster assets, QR, and share/download actions
4. **Registry/recommendation layer** — powers matrix expansion and cross-test discovery

### Critical Pitfalls

1. **SPA drift on static hosting** — avoid app-shell-first routing; use real static pages
2. **Fragile poster export** — avoid DOM screenshot hacks; use deterministic Canvas rendering
3. **Data-pack drift** — enforce schemas and fixtures before cloning tests
4. **Overclaiming science** — keep BTI-inspired framing, not "official assessment" language
5. **Launching the whole matrix too early** — prove WBTI first, then clone

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Shared Engine Foundation
**Rationale:** the entire matrix depends on a stable data contract and deterministic scoring core.
**Delivers:** Vite MPA scaffold, shared engine modules, schemas, test fixtures, deploy skeleton.
**Addresses:** shared scoring engine, data-pack validation, static route architecture.
**Avoids:** SPA drift and data-pack drift.

### Phase 2: WBTI End-to-End Template
**Rationale:** WBTI is the chosen proving ground and must validate the full user loop.
**Delivers:** WBTI intro, quiz flow, result page, trust framing, and first deployment.
**Uses:** shared engine and validated data packs.
**Implements:** quiz shell, result shell, and the first complete archetype experience.

### Phase 3: Sharing and Matrix Loop
**Rationale:** the matrix thesis is unproven until sharing and replication both work.
**Delivers:** poster export, QR flow, share fallbacks, registry-driven recommendations, and a second-test replication proof.
**Uses:** result payload contract, registry metadata, and the shared engine.
**Implements:** the growth loop that turns a single test into a matrix-ready platform.

### Phase Ordering Rationale

- The data contract comes first because every later test depends on it.
- WBTI comes second because the template must prove scoring, result UX, and trust framing end to end.
- Sharing and replication come third because a matrix is only real once one test can generate traffic for the next one.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** poster export reliability on mobile/in-app browsers and exact share fallbacks.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Vite scaffold, GitHub Pages deployment, schema/test setup
- **Phase 2:** data-driven quiz flow and result rendering patterns are straightforward once the engine contract exists

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Grounded mostly in official Vite, GitHub, MDN, TypeScript, Vitest, and Zod sources |
| Features | MEDIUM | Competitive patterns are clear, but exact social-share behavior is partly inferred from product strategy and public competitor surfaces |
| Architecture | HIGH | Strongly constrained by the user's static-hosting requirements and well-supported by official docs |
| Pitfalls | HIGH | Backed by official hosting/API docs plus domain-specific product patterns |

**Overall confidence:** HIGH

### Gaps to Address

- **Poster QA matrix:** validate exact behavior later on target mobile browsers and in-app browsers during implementation.
- **Structured data scope:** choose the right metadata depth when future hub/type-detail pages exist.
- **Analytics choice:** if the product later needs measurement, pick a privacy/cost model that still fits the zero-backend constraint.

## Sources

### Primary (HIGH confidence)
- https://vite.dev/blog/announcing-vite7
- https://vite.dev/guide/build
- https://vite.dev/guide/static-deploy.html
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html
- https://github.com/vitest-dev/vitest/releases
- https://github.com/colinhacks/zod/releases
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
- https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript

### Secondary (MEDIUM confidence)
- https://www.16personalities.com/
- https://www.truity.com/
- https://www.truity.com/test/type-finder-personality-test-new
- https://www.truity.com/view/tests/personality-type
- https://www.idrlabs.com/tests.php
- https://www.idrlabs.com/test.php
- https://www.npmjs.com/package/qrcode

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
