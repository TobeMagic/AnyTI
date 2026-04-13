# Feature Research

**Domain:** Personality quiz matrix products and static quiz platforms
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Fast mobile-first quiz flow | 16Personalities markets a result in about 10 minutes; online test users expect a low-friction session, not a form marathon | MEDIUM | Keep v1 in the roughly 20-40 question range unless a longer test clearly improves result quality |
| Immediate free result summary | Truity and 16Personalities both give immediate high-level results before upsells or deeper reports | LOW | Must land on a result page with a strong headline, short diagnosis, and next action |
| Distinct, memorable result identity | Users return for labels they can remember and share | MEDIUM | This directly supports social spread; names must be sticky, not academic |
| Credibility framing | Competitors consistently explain the theory, reviewer, or scientific basis of the test | LOW | Use concise basis/disclaimer blocks; do not overclaim clinical validity |
| Multi-test discovery | Truity and IDRlabs both operate as libraries of tests, not isolated pages | MEDIUM | Even v1 should reserve a slot for "next test" recommendations |
| Stable linkable URLs | Search and sharing both depend on crawlable, predictable page URLs | LOW | This favors static directory routes over app-shell-only navigation |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Shared engine + per-test data packs | Lets the product scale from one successful test to a real matrix with near-zero marginal engineering cost | MEDIUM | This is the project's core moat, not just an implementation detail |
| Canvas share poster with QR | Matches the actual distribution behavior of Chinese social products better than plain link sharing | MEDIUM | Competitors emphasize reports; this product should emphasize social spread assets |
| Cross-test recommendation graph | Turns each successful test into an acquisition surface for the next one | MEDIUM | Stronger when at least 2 tests exist, but the interface should be present from v1 |
| Hidden personalities / rare triggers | Adds replayability, bragging rights, and easter-egg sharing | MEDIUM | Must be used carefully so the main result system still feels coherent |
| Continuous-dimension scoring + cosine matching | Produces more nuanced results than a shallow A/B counting system | MEDIUM | Strong internal differentiator even if users never see the math directly |
| Seasonal/topic packaging | Work, love, study, spending, travel, fitness map naturally to social moments and SEO topics | LOW | This is a matrix-level growth differentiator rather than a single-page feature |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Account system in v1 | Seems useful for saving history and retention | Breaks the zero-backend constraint and delays launch for little early proof | Use optional local progress/result persistence only |
| Huge premium-style reports in the first release | Feels "more complete" | Slows copy production and makes the first template harder to finish | Start with a short result core plus 2-4 expandable sub-sections |
| Complex CMS or admin authoring before WBTI ships | Sounds scalable | Premature platform work before the template is validated | Author JSON packs by hand first; build tooling only after the second test |
| "Official MBTI" positioning | Appears credible | Trademark and trust risk; also clashes with the project's more playful tone | Use BTI-inspired branding and clear "inspired by / not official" framing |
| One mega-site app shell with every test bundled together | Feels centralized | Hurts bundle size, weakens page-level SEO, and complicates matrix expansion | Keep a matrix registry plus one static entry per test |

## Feature Dependencies

```text
Quiz flow UI
    └──requires──> validated question/personality schema
                           └──requires──> shared engine contracts

Result page
    └──requires──> scoring engine
                           └──requires──> cosine matching + hidden-type rules

Poster generation
    └──requires──> stable result payload
                           └──requires──> canonical quiz/test metadata

Cross-test recommendations
    └──requires──> test registry
                           └──requires──> at least 2 live tests

Main navigation hub
    └──enhances──> all test pages
                           └──best after──> 2-3 tests are already live
```

### Dependency Notes

- **Quiz flow requires validated schemas:** this is what keeps new tests from breaking the engine as the matrix expands.
- **Poster generation requires stable result payloads:** poster work should follow result-shape stabilization, not precede it.
- **Cross-test recommendations require at least two tests:** build the slot in v1, but real recommendation quality starts in phase 3.
- **Main navigation hub enhances the matrix, but should not block the template:** this matches the user's stated sequencing.

## MVP Definition

### Launch With (v1)

- [ ] `WBTI` intro, questions, progress, scoring, result, and restart flow — proves the full template
- [ ] Shared engine with typed/validated data-pack loading — enables cloning, not just one-off success
- [ ] Result page with memorable type identity and short behavior summary — validates whether users find the output share-worthy
- [ ] Canvas poster export with QR — validates the product's core social distribution loop
- [ ] Placeholder slot for "next test" recommendation — starts teaching users that this is a matrix, not a single quiz
- [ ] Basic theory/disclaimer/SEO framing — gives enough trust and indexability without overbuilding

### Add After Validation (v1.x)

- [ ] `LBTI` as the second test — proves the engine really clones cleanly
- [ ] Matrix registry and real cross-test recommendation mapping — becomes meaningful once there are multiple tests
- [ ] Main navigation landing page — worth doing after there is something to aggregate
- [ ] Local progress persistence — useful, but not core to proof-of-concept

### Future Consideration (v2+)

- [ ] Visual/personality-content authoring tools — only after hand-authored JSON becomes a bottleneck
- [ ] Team, comparison, or multi-user modes — outside the current static solo-user scope
- [ ] Deeper analytics / experimentation system — useful later, but not needed to prove WBTI template viability

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Shared scoring engine | HIGH | MEDIUM | P1 |
| WBTI quiz flow | HIGH | MEDIUM | P1 |
| Result page identity | HIGH | LOW | P1 |
| Poster export | HIGH | MEDIUM | P1 |
| Cross-test recommendation slot | MEDIUM | LOW | P2 |
| Second test clone (`LBTI`) | HIGH | MEDIUM | P2 |
| Main navigation hub | MEDIUM | MEDIUM | P2 |
| Authoring tools | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have after the template proves itself
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | 16Personalities | Truity | Our Approach |
|---------|------------------|--------|--------------|
| Test entry | Simple, fast, strongly branded | Many tests, category-driven | Single-template-first, then a curated six-test matrix |
| Result model | Rich narrative identity plus career/team products | Free basic result plus deeper reports and adjacent test families | Short, sharp, highly shareable identity first; deeper modules later |
| Library breadth | Narrower core universe plus products | Broad personality/career/work catalog | Medium breadth, but intentionally theme-curated around viral life scenarios |
| Scientific framing | Strong confidence language and framework pages | Reviewer, documentation, theory framing | Concise evidence-inspired framing without "official" overreach |
| Social distribution | Strong brand, but poster-led virality is not the main visible surface | Report/product-heavy | Canvas poster + QR as a first-class feature |

## Sources

- 16Personalities home: https://www.16personalities.com/ — observed fast entry, identity-led results, relationship/career/team expansion
- Truity home: https://www.truity.com/ — observed broad test library and business/workplace extensions
- Truity TypeFinder: https://www.truity.com/test/type-finder-personality-test-new — observed 130-question / 10-15 minute expectation, free basic result, deeper report model
- Truity 16-type tests index: https://www.truity.com/view/tests/personality-type — observed multi-test family structure across core, career, workplace, and love use cases
- IDRlabs tests index: https://www.idrlabs.com/tests.php — observed library-scale test catalog and topic breadth
- IDRlabs Jung Type Test: https://www.idrlabs.com/test.php — observed validation/disclaimer framing around free online personality tests

---
*Feature research for: Personality quiz matrix platform*
*Researched: 2026-04-13*
