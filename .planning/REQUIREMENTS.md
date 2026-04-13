# Requirements: BTI Matrix Platform

**Defined:** 2026-04-13
**Core Value:** 用一套可复用的静态测试引擎，持续低成本孵化多个高传播测试，并把流量沉淀回自有矩阵资产

## v1 Requirements

### Platform Foundation

- [ ] **PLAT-01**: Visitor can open each published test at a stable static route under its own quiz slug
- [ ] **PLAT-02**: Visitor can complete the site’s core flows on mobile and desktop without layout breakage
- [ ] **PLAT-03**: Site owner can deploy the project to GitHub Pages through a repeatable build workflow
- [ ] **PLAT-04**: Site owner can add or edit a quiz data pack and have schema errors fail during build

### Quiz Flow

- [ ] **QUIZ-01**: Visitor can start `WBTI` from its own landing page with title, hook, and start action
- [ ] **QUIZ-02**: Visitor can answer `WBTI` one question at a time with visible progress
- [ ] **QUIZ-03**: Visitor can revise a previous answer before finishing the test
- [ ] **QUIZ-04**: Visitor can finish `WBTI` without creating an account or using server-side state

### Results Engine

- [ ] **RSLT-01**: Visitor receives a `WBTI` result calculated from weighted continuous dimensions rather than simple A/B counting
- [ ] **RSLT-02**: Visitor sees a primary archetype name, core description, and short explanation of why it matched
- [ ] **RSLT-03**: Visitor sees the five `WBTI` behavior dimensions rendered as a readable profile or spectrum
- [ ] **RSLT-04**: Site owner can define hidden archetype trigger rules inside quiz data without changing shared runtime code
- [ ] **RSLT-05**: Site owner can verify scoring and result matching against known answer sets with automated tests

### Sharing

- [ ] **SHAR-01**: Visitor can export the result page as a shareable image from the browser
- [ ] **SHAR-02**: Exported poster includes archetype name, short description, and a QR code back to the quiz
- [ ] **SHAR-03**: Poster output fits mobile-first social sharing dimensions without clipped critical content

### Matrix Readiness

- [ ] **MATR-01**: Visitor sees at least two other test recommendations on the result page
- [ ] **MATR-02**: Site owner can add a new quiz slug by providing structured data rather than forking quiz runtime logic
- [ ] **MATR-03**: Site owner can define quiz metadata needed later for main navigation and SEO aggregation

### SEO and Metadata

- [ ] **SEO-01**: Each published quiz route exposes unique title, description, and share preview metadata
- [ ] **SEO-02**: The route and content structure stays compatible with a future aggregated main navigation site

## v2 Requirements

### Additional Tests

- **NEXT-01**: Visitor can take `LBTI` using the shared engine with only quiz-specific data changes
- **NEXT-02**: Visitor can take `STBI` using the shared engine with only quiz-specific data changes
- **NEXT-03**: Visitor can take `SBTI`, `FBTI`, and `TBTI` as additional matrix tests

### Matrix Experience

- **MATR-04**: Visitor can browse a main navigation page that aggregates all published quizzes
- **MATR-05**: Visitor can see cross-quiz categories, seasonal tags, or campaign groupings on the main site
- **MATR-06**: Visitor can see top 2-3 nearest archetypes on the result page when that explanation improves clarity

### Content Expansion

- **CONT-01**: Visitor can read deeper archetype explanation pages or comparison content for SEO expansion
- **CONT-02**: Site owner can publish seasonal landing pages tied to traffic nodes such as school start, Valentine’s Day, or Double 11

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts and cloud history | Conflicts with static-first, zero-ops v1 scope |
| Backend database or server-rendered personalization | Not needed to validate the matrix model |
| User-generated quizzes or quiz builder UI | Explodes content quality and moderation complexity too early |
| Real-time analytics dashboard | Useful later, but not essential to validating the first matrix template |
| Full main navigation site in v1 | User explicitly wants this after 2-3 quizzes are live |
| Final visual brand system and detailed archetype copywriting | User explicitly wants skeleton first, details later |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAT-01 | TBD | Pending |
| PLAT-02 | TBD | Pending |
| PLAT-03 | TBD | Pending |
| PLAT-04 | TBD | Pending |
| QUIZ-01 | TBD | Pending |
| QUIZ-02 | TBD | Pending |
| QUIZ-03 | TBD | Pending |
| QUIZ-04 | TBD | Pending |
| RSLT-01 | TBD | Pending |
| RSLT-02 | TBD | Pending |
| RSLT-03 | TBD | Pending |
| RSLT-04 | TBD | Pending |
| RSLT-05 | TBD | Pending |
| SHAR-01 | TBD | Pending |
| SHAR-02 | TBD | Pending |
| SHAR-03 | TBD | Pending |
| MATR-01 | TBD | Pending |
| MATR-02 | TBD | Pending |
| MATR-03 | TBD | Pending |
| SEO-01 | TBD | Pending |
| SEO-02 | TBD | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 0
- Unmapped: 21 ⚠️

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 after initial definition*
