# Roadmap: BTI Matrix Platform

## Overview

This roadmap turns the BTI matrix idea into a reusable static product platform in three coarse phases. Phase 1 establishes the shared engine, data contracts, scoring core, and deployment skeleton; Phase 2 proves the first real frontend hierarchy through a homepage, category page, and complete `WBTI` experience; Phase 3 adds the poster, recommendation, and replication loop that makes the product behave like a matrix instead of a one-off quiz.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Shared Engine Foundation** - Build the static platform skeleton, data contracts, and reusable quiz runtime
- [ ] **Phase 2: WBTI End-to-End Experience** - Deliver the first complete home → category → WBTI flow and its result experience
- [ ] **Phase 3: Sharing and Matrix Loop** - Add poster export, recommendation loops, and prove the second-test replication path

## Phase Details

### Phase 1: Shared Engine Foundation
**Goal**: Establish the static project structure, schema-validated quiz packs, shared scoring runtime, and GitHub Pages deployment path so future quizzes can be added as data rather than code forks.
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, DATA-01, DATA-02, DATA-03, DATA-04, SCOR-01, SCOR-02, SCOR-03, SCOR-04, SCOR-05, SEO-02
**Success Criteria** (what must be TRUE):
  1. Published quizzes can live at stable static slugs such as `/wbti/` without relying on a single client-only route
  2. Invalid quiz data fails during build instead of breaking silently at runtime
  3. Weighted scoring, cosine matching, and hidden-type rules are covered by automated tests
  4. The project can build and deploy to GitHub Pages through a repeatable workflow while staying compatible with future homepage, category-page, test-page, and type-detail routes
**Plans**: 3 plans

Plans:
- [ ] 01-01: Bootstrap Vite multi-page project, repo structure, and GitHub Pages deployment workflow
- [ ] 01-02: Define quiz pack schemas, content loading, and shared metadata contracts
- [ ] 01-03: Implement the reusable scoring, matching, hidden-type, and test foundation

### Phase 2: WBTI End-to-End Experience
**Goal**: Use `WBTI` to prove the platform template with a responsive homepage-to-category-to-test hierarchy, answer flow, result calculation, social-first archetype framing, and per-page metadata.
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, THEM-01, WBTI-01, WBTI-02, WBTI-03, WBTI-04, ARCH-01, RSLT-01, TRST-01, SEO-01
**Success Criteria** (what must be TRUE):
  1. A visitor can enter from the platform homepage into a category landing page and then into `WBTI` without ambiguity.
  2. The first implemented category flow uses its own theme tokens while preserving the shared layout and interaction model.
  3. A visitor can complete `WBTI` on mobile or desktop, retake it without creating an account, and receive a result with a clear archetype explanation, core description, and dimension summary.
  4. WBTI archetype naming and short copy feel socially legible, abstract, humorous, and screenshot-friendly rather than academic.
  5. The `WBTI` experience includes a brief explanation of theory inspiration, scoring approach, and non-clinical disclaimer, and each page exposes crawlable metadata.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Build the platform homepage, first category landing page, and `WBTI` entry surface
- [ ] 02-02: Implement the `WBTI` quiz runner, result rendering, and social-first archetype copy contract
- [ ] 02-03: Apply category theming, responsive QA, and per-page SEO metadata

### Phase 3: Sharing and Matrix Loop
**Goal**: Turn the working `WBTI` template into a matrix-ready growth loop with poster export, QR-enabled sharing, other-quiz recommendations, and a proven second-test replication path.
**Depends on**: Phase 2
**Requirements**: RSLT-02, RSLT-03, RSLT-04, MTRX-01, MTRX-02, MTRX-03
**Success Criteria** (what must be TRUE):
  1. A visitor can export a shareable poster from the result page with archetype name, short description, and QR code
  2. Poster output preserves critical content in mobile-first social image dimensions and supports save/share fallback actions
  3. The result page recommends at least two other matrix entries or upcoming tests from a shared registry
  4. A second BTI test can launch through new data files and route assets without changing the shared engine code
**Plans**: 3 plans

Plans:
- [ ] 03-01: Implement poster export, QR placement, and social-share-safe rendering
- [ ] 03-02: Add matrix registry and recommendation loops to the result page
- [ ] 03-03: Prove the second-test replication path on the shared engine

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Shared Engine Foundation | 0/3 | Not started | - |
| 2. WBTI End-to-End Experience | 0/3 | Not started | - |
| 3. Sharing and Matrix Loop | 0/3 | Not started | - |
