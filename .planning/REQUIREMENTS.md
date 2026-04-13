# Requirements: BTI Matrix Platform

**Defined:** 2026-04-13
**Core Value:** 用一套可复用的静态测试引擎，持续低成本孵化多个高传播测试，并把流量沉淀回自有矩阵资产。

## v1 Requirements

### Foundation

- [ ] **FND-01**: The project can build and deploy as a static multi-page site on GitHub Pages.
- [ ] **FND-02**: Each live test is served from its own static directory route (for example `/wbti/`).
- [ ] **FND-03**: Live tests reuse shared runtime and engine code instead of duplicating core logic per test.

### Data Packs

- [ ] **DATA-01**: Each test can define its questions in a `questions.json` file.
- [ ] **DATA-02**: Each test can define its personalities and target vectors in a `personalities.json` file.
- [ ] **DATA-03**: Each test can define its metadata and recommendation configuration in a `meta.json` file.
- [ ] **DATA-04**: The app validates test data packs against a shared schema before rendering or scoring them.

### Scoring Engine

- [ ] **SCOR-01**: Answer options can assign weighted scores to one or more dimensions.
- [ ] **SCOR-02**: The engine can convert completed answers into a user score vector.
- [ ] **SCOR-03**: The engine ranks personalities by cosine similarity against the user score vector.
- [ ] **SCOR-04**: The engine can apply optional hidden-personality trigger rules after base matching.
- [ ] **SCOR-05**: The scoring and matching pipeline is covered by automated tests.

### WBTI Template

- [ ] **WBTI-01**: A user can start the Workplace Behavior Type Indicator from a dedicated intro page.
- [ ] **WBTI-02**: A user can answer the full WBTI questionnaire with visible progress and mobile-friendly interactions.
- [ ] **WBTI-03**: A user can restart and retake WBTI after completing the test.
- [ ] **WBTI-04**: A user can complete WBTI without creating an account or relying on server-side state.

### Navigation and Category Pages

- [ ] **NAV-01**: A user can enter the platform from a homepage that routes into category landing pages before an individual test.
- [ ] **NAV-02**: A user can open a category landing page that frames the topic and links into a specific test experience.
- [ ] **THEM-01**: Category landing pages apply category-specific theme tokens while preserving shared layout and interaction patterns.

### Results and Sharing

- [ ] **RSLT-01**: After completing WBTI, the user sees a result page with a personality name, core description, dimension summary, and a short explanation of why it matched.
- [ ] **RSLT-02**: The result page can generate a share poster as a canvas image.
- [ ] **RSLT-03**: The poster includes the personality name, a short result description, and a QR code linking back to the test.
- [ ] **RSLT-04**: The result page provides download/save behavior for the poster plus share/copy-link fallback actions.

### Archetype Framing

- [ ] **ARCH-01**: WBTI archetype names and short descriptions use abstract, humorous, screenshot-friendly language that works as a social identity tag rather than academic jargon.

### Trust and Method

- [ ] **TRST-01**: A user can read a brief explanation of the test's theory inspiration, scoring approach, and non-clinical disclaimer from the WBTI experience.

### Matrix Readiness

- [ ] **MTRX-01**: The site maintains a registry of live and upcoming tests for recommendations and future navigation.
- [ ] **MTRX-02**: The WBTI result page recommends at least two other matrix entries or upcoming tests so the experience does not dead-end after one result.
- [ ] **MTRX-03**: A second BTI test can launch using the shared engine with new data files rather than engine rewrites.

### SEO and Metadata

- [ ] **SEO-01**: Each live test page has unique title/description metadata and crawlable internal links suitable for search indexing.
- [ ] **SEO-02**: The route and content structure remain compatible with a future matrix navigation site and future indexable type/detail pages.

## v2 Requirements

### Additional Tests

- **HUB-01**: After at least two tests exist, the site exposes a matrix navigation page linking to all live tests.
- **TEST-01**: The platform expands from WBTI/LBTI baseline coverage to include STBI, SBTI, FBTI, and TBTI.
- **TEST-02**: Each additional test introduces its own dimension model, personality set, and hidden-type logic without changing the shared engine contract.

### Tooling and Operations

- **TOOL-01**: Editors can author and validate test packs through dedicated tooling instead of manual JSON editing.
- **TOOL-02**: The platform collects lightweight analytics or experiment data without breaking the static-first architecture.

### User Retention

- **USER-01**: A user can resume incomplete tests or revisit previous results across sessions.
- **USER-02**: A user can browse a richer library of related tests and category landing pages from the hub.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Accounts and login | Conflicts with the zero-backend, zero-ops constraint for the current milestone |
| Payment, upsell, or premium report system | Not required to validate the engine/template thesis |
| Full admin CMS before WBTI ships | Premature platform work; manual JSON is enough for the first two tests |
| Full final brand system and all category art direction polish | Information architecture and theme direction are now defined, but final visual refinement across all categories is still later work |
| Full 24-type content writing for all six tests | Content depth is important, but not required to define the project backbone |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Pending |
| FND-02 | Phase 1 | Pending |
| FND-03 | Phase 1 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| DATA-04 | Phase 1 | Pending |
| SCOR-01 | Phase 1 | Pending |
| SCOR-02 | Phase 1 | Pending |
| SCOR-03 | Phase 1 | Pending |
| SCOR-04 | Phase 1 | Pending |
| SCOR-05 | Phase 1 | Pending |
| SEO-02 | Phase 1 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| THEM-01 | Phase 2 | Pending |
| WBTI-01 | Phase 2 | Pending |
| WBTI-02 | Phase 2 | Pending |
| WBTI-03 | Phase 2 | Pending |
| WBTI-04 | Phase 2 | Pending |
| ARCH-01 | Phase 2 | Pending |
| RSLT-01 | Phase 2 | Pending |
| TRST-01 | Phase 2 | Pending |
| SEO-01 | Phase 2 | Pending |
| RSLT-02 | Phase 3 | Pending |
| RSLT-03 | Phase 3 | Pending |
| RSLT-04 | Phase 3 | Pending |
| MTRX-01 | Phase 3 | Pending |
| MTRX-02 | Phase 3 | Pending |
| MTRX-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 after IA and virality direction update*
