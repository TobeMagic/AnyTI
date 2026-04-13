# Roadmap: BTI Matrix Platform

## Overview

This roadmap turns the BTI matrix idea into a reusable static product platform in three coarse phases. Phase 1 establishes the shared engine, data contract, and deployment skeleton; Phase 2 proves the template with a full `WBTI` experience; Phase 3 adds the sharing and recommendation loop that makes the product behave like a matrix instead of a one-off quiz.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Shared Engine Foundation** - Build the static platform skeleton, data contracts, and reusable quiz runtime
- [ ] **Phase 2: WBTI End-to-End Experience** - Deliver the first complete quiz flow from landing page to results
- [ ] **Phase 3: Sharing and Matrix Loop** - Add poster export, recommendation loops, and verification hardening

## Phase Details

### Phase 1: Shared Engine Foundation
**Goal**: Establish the static project structure, schema-validated quiz packs, shared scoring runtime, and GitHub Pages deployment path so future quizzes can be added as data rather than code forks.
**Depends on**: Nothing (first phase)
**Requirements**: PLAT-01, PLAT-03, PLAT-04, MATR-02, MATR-03, SEO-02
**Success Criteria** (what must be TRUE):
  1. Published quizzes can live at stable static slugs such as `/wbti/` without relying on a single client-only route
  2. Invalid quiz data fails during build instead of breaking silently at runtime
  3. A new quiz slug can be introduced through structured data and metadata without copying the runtime codebase
  4. The project can build and deploy to GitHub Pages through a repeatable workflow
**Plans**: 3 plans

Plans:
- [ ] 01-01: Bootstrap Vite multi-page project, repo structure, and GitHub Pages deployment workflow
- [ ] 01-02: Define quiz pack schemas, content loading, and shared metadata manifest
- [ ] 01-03: Implement the reusable scoring, matching, and route shell foundation

### Phase 2: WBTI End-to-End Experience
**Goal**: Use `WBTI` to prove the platform template with a responsive landing page, answer flow, result calculation, result explanation, and per-quiz metadata.
**Depends on**: Phase 1
**Requirements**: PLAT-02, QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, RSLT-01, RSLT-02, RSLT-03, RSLT-04, SEO-01
**Success Criteria** (what must be TRUE):
  1. A visitor can start `WBTI`, answer it on mobile or desktop, revise answers, and finish without layout or interaction failures
  2. The final result is calculated from weighted continuous dimensions and rendered with a clear archetype explanation
  3. The result page displays the five `WBTI` dimensions in a readable profile and supports hidden archetype logic from data
  4. The `WBTI` route exposes its own title, description, and share preview metadata
**Plans**: 3 plans

Plans:
- [ ] 02-01: Build the `WBTI` landing page and interactive quiz runner
- [ ] 02-02: Implement `WBTI` result rendering, dimension profile, and hidden archetype support
- [ ] 02-03: Apply responsive QA and per-quiz SEO/share metadata

### Phase 3: Sharing and Matrix Loop
**Goal**: Turn the working `WBTI` template into a matrix-ready growth loop with poster export, QR-enabled sharing, other-quiz recommendations, and automated confidence checks.
**Depends on**: Phase 2
**Requirements**: RSLT-05, SHAR-01, SHAR-02, SHAR-03, MATR-01
**Success Criteria** (what must be TRUE):
  1. Known answer sets can verify scoring and hidden archetype matching through automated tests
  2. A visitor can export a shareable poster from the result page with archetype name, short description, and QR code
  3. Poster output preserves critical content in mobile-first social image dimensions
  4. The result page recommends at least two other tests so the user can continue deeper into the matrix
**Plans**: 2 plans

Plans:
- [ ] 03-01: Implement poster export, QR placement, and social-share-safe rendering
- [ ] 03-02: Add recommendation loops and automated verification for scoring and sharing flows

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Shared Engine Foundation | 0/3 | Not started | - |
| 2. WBTI End-to-End Experience | 0/3 | Not started | - |
| 3. Sharing and Matrix Loop | 0/2 | Not started | - |
