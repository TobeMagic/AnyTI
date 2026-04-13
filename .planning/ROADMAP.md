# Roadmap: BTI Matrix Platform

## Overview

这条路线图把 BTI 矩阵平台压成 4 个粗粒度阶段，先定静态多入口和数据契约，再用 `WBTI` 跑通第一条完整链路，再补齐结果页的传播闭环，最后验证模板是否真的能复制到第二个测试。这样阶段边界来自需求本身，而不是套通用 PM 模板。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Static Matrix Foundation** - Build the reusable static structure, quiz-pack contract, and matrix registry.
- [ ] **Phase 2: WBTI Engine and Quiz Flow** - Deliver the first complete WBTI answering experience on top of the shared engine.
- [ ] **Phase 3: WBTI Results and Share Loop** - Turn WBTI completions into results, posters, trust framing, and cross-test continuation.
- [ ] **Phase 4: Template Hardening and Replication** - Prove the template can be tested and reused for a second BTI test without engine rewrites.

## Phase Details

### Phase 1: Static Matrix Foundation
**Goal**: The platform can build as a GitHub Pages static multi-page site where every quiz is a schema-validated data pack with its own route and shared registry.
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, DATA-01, DATA-02, DATA-03, DATA-04, MTRX-01, SEO-02
**Success Criteria** (what must be TRUE):
  1. The project builds and deploys as a static multi-page site on GitHub Pages.
  2. Each live test is reachable from its own static directory route such as `/wbti/`.
  3. A test is defined through `questions.json`, `personalities.json`, and `meta.json`, and invalid data fails schema validation before rendering or scoring.
  4. The site maintains a shared registry of live and upcoming tests, and the route/content structure stays compatible with a future matrix hub and indexable detail pages.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Scaffold the static multi-entry project and GitHub Pages deployment flow.
- [ ] 01-02: Define the shared quiz-pack schemas, validation path, and data loading contracts.
- [ ] 01-03: Add the matrix registry and shared runtime boundaries that future tests can reuse.

### Phase 2: WBTI Engine and Quiz Flow
**Goal**: Visitors can start, complete, restart, and retake WBTI using a shared weighted-dimension scoring engine without any account or server-state dependency.
**Depends on**: Phase 1
**Requirements**: SCOR-01, SCOR-02, SCOR-03, SCOR-04, WBTI-01, WBTI-02, WBTI-03, WBTI-04
**Success Criteria** (what must be TRUE):
  1. A user can start WBTI from a dedicated intro page and answer the full questionnaire with visible progress and mobile-friendly interactions.
  2. Answer options can assign weighted scores across multiple dimensions, and the engine converts completed answers into a user score vector.
  3. The engine ranks personalities by cosine similarity and can apply hidden-personality trigger rules after base matching.
  4. A user can complete, restart, and retake WBTI without creating an account or relying on server-side state.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Build the WBTI intro page and responsive quiz runner shell.
- [ ] 02-02: Implement weighted scoring, vector creation, cosine matching, and hidden-rule support.
- [ ] 02-03: Wire the complete WBTI answer flow, restart, and retake behavior.

### Phase 3: WBTI Results and Share Loop
**Goal**: After completing WBTI, users get a readable result page, understand the test framing, can export a poster, and are pulled deeper into the matrix instead of dead-ending.
**Depends on**: Phase 2
**Requirements**: RSLT-01, RSLT-02, RSLT-03, RSLT-04, TRST-01, MTRX-02, SEO-01
**Success Criteria** (what must be TRUE):
  1. After completing WBTI, the user sees a result page with a personality name, core description, dimension summary, and a short explanation of why it matched.
  2. The user can read a brief explanation of the theory inspiration, scoring approach, and non-clinical disclaimer from the WBTI experience.
  3. The result page can generate a canvas poster that includes the personality name, short description, and a QR code back to the test.
  4. The result page provides download/save behavior for the poster, share/copy-link fallback actions, and recommends at least two other matrix entries or upcoming tests.
  5. Each live test page exposes unique title/description metadata and crawlable internal links suitable for search indexing.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Build the WBTI result page, explanation blocks, and trust/disclaimer section.
- [ ] 03-02: Implement canvas poster generation, QR composition, and save/share fallback actions.
- [ ] 03-03: Add metadata, crawlable links, and registry-driven cross-test recommendations.

### Phase 4: Template Hardening and Replication
**Goal**: The shared template is verified by automated tests and reused to launch a second BTI test without changing the engine contract.
**Depends on**: Phase 3
**Requirements**: SCOR-05, MTRX-03
**Success Criteria** (what must be TRUE):
  1. The scoring and matching pipeline is covered by automated tests against known answer sets.
  2. A second BTI test can launch using new data files rather than engine rewrites.
  3. The template now behaves like a reusable product foundation rather than a one-off WBTI implementation.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Add automated regression coverage for scoring, matching, and hidden-rule behavior.
- [ ] 04-02: Clone the template into a second BTI test using new data packs only.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Static Matrix Foundation | 0/3 | Not started | - |
| 2. WBTI Engine and Quiz Flow | 0/3 | Not started | - |
| 3. WBTI Results and Share Loop | 0/3 | Not started | - |
| 4. Template Hardening and Replication | 0/2 | Not started | - |
