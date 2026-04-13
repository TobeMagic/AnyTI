# Phase 1: Shared Engine Foundation - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the static foundation that all future category pages, test pages, and result pages depend on: reusable project structure, quiz-pack data contract, shared scoring/runtime boundaries, route compatibility, and GitHub Pages deployment. This phase does not implement the final homepage or category-page visuals, but it must preserve the route and data model those surfaces will rely on.

</domain>

<decisions>
## Implementation Decisions

### Naming and URL Policy
- Test pages use short top-level acronym slugs such as `/wbti/`, `/lbti/`, `/sbti/`.
- Future category landing pages can use top-level category slugs such as `/work/`, `/love/`, `/study/`, while tests still keep their own stable slugs.
- Future type/detail pages reserve a stable nested pattern such as `/{test-slug}/types/{type-id}/`.
- Public slugs and reusable IDs stay lowercase ASCII; nested IDs use kebab-case.

### Quiz Pack Contract
- Each quiz is a three-file core pack: `questions.json`, `personalities.json`, `meta.json`.
- `questions.json` keeps question order, copy, options, and scoring weights together instead of splitting copy from logic.
- `personalities.json` keeps target vectors, display labels, and hidden-trigger rules together instead of spreading them across extra files.
- `meta.json` should be a balanced contract: title, hook, status, SEO description, recommendation tags, poster theme key, and other category-level metadata needed for later surfaces.

### Route Compatibility
- Phase 1 must preserve compatibility with a future frontend hierarchy of homepage -> category page -> test page.
- The route system must support future category hubs and future type/detail pages without forcing a router rewrite.
- SEO and metadata contracts should assume that pages beyond the test root will exist later, even if they are not implemented in this phase.

### Claude's Discretion
- Exact Vite multi-entry configuration.
- Exact schema library and test-runner wiring.
- Exact shared runtime module boundaries and naming inside `shared/`.

</decisions>

<specifics>
## Specific Ideas

- Frontend phases should use `gsd-ui-phase`, `ui-ux-pro-max`, and `ckm:ui-styling` to lock design decisions before implementation.
- The long-term product hierarchy is `homepage -> category page -> test page`.
- Different categories should have different theme colors; example: the love category can use a pink palette.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core Planning
- `.planning/PROJECT.md` — product direction, matrix strategy, category-page hierarchy, and virality-oriented content direction
- `.planning/REQUIREMENTS.md` — v1 acceptance criteria for foundation, route compatibility, and data-pack structure
- `.planning/ROADMAP.md` — Phase 1 scope boundary and plan split
- `.planning/STATE.md` — latest project memory and current focus

### Research
- `.planning/research/SUMMARY.md` — stack, architecture, and pitfalls for the static quiz-matrix approach
- `docs/deep_research/processed/sbti_virality_findings.md` — user-requested research on why SBTI spread and what to outperform later

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No product code exists yet; only planning documents are present.

### Established Patterns
- Planning already assumes a static multi-page architecture with shared runtime and isolated quiz data packs.
- Phase 1 should create the first real code pattern rather than inherit an existing one.

### Integration Points
- New code will anchor to the `.planning` contract: route naming, data-pack shape, and later UI-SPEC decisions.

</code_context>

<deferred>
## Deferred Ideas

- Final homepage and category-page visual design — Phase 2
- Category theme palette execution beyond the first implemented flow — later frontend phases
- Detailed WBTI archetype naming and copy system informed by SBTI-style virality — Phase 2 and Phase 3

</deferred>

---
*Phase: 01-shared-engine-foundation*
*Context gathered: 2026-04-13*
