# Architecture Research

**Domain:** Static multi-quiz personality matrix platform
**Researched:** 2026-04-13
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                        Page Entries                         │
├─────────────────────────────────────────────────────────────┤
│  /wbti/   /lbti/   /sbti/   /stbi/   /fbti/   /tbti/       │
│  static HTML entry per test (plus future root hub page)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        Shared Runtime                       │
├─────────────────────────────────────────────────────────────┤
│  Quiz shell  │  Result shell  │  Recommendation shell      │
│  State flow  │  Poster engine │  Meta / share helpers      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        Domain Engine                        │
├─────────────────────────────────────────────────────────────┤
│  Data loader  │  Schema validator  │  Scoring + matching    │
│  Hidden rules │  Result mapper      │  Registry lookup       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                         Static Data                         │
├─────────────────────────────────────────────────────────────┤
│  questions.json  personalities.json  meta.json  registry   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Test entry page | Owns the route and test-specific metadata | Static HTML file under each test directory |
| Data loader | Loads the current test's JSON pack and validates it | Shared TypeScript module + `fetch()` + Zod parse |
| Quiz shell | Renders intro, questions, answer progress, and completion CTA | Small state machine in TypeScript |
| Scoring engine | Converts answers to dimension vector and finds best type | Pure functions with deterministic tests |
| Result shell | Maps matched type to user-facing blocks | Shared renderer + test-specific result content |
| Poster engine | Draws canvas poster, QR, and export/download artifacts | Canvas 2D composition with same-origin assets |
| Recommendation engine | Suggests other tests based on the current test and phase | Registry-driven config, no hardcoded links in page templates |

## Recommended Project Structure

```text
/
├── index.html                    # future matrix hub
├── shared/
│   ├── app/
│   │   ├── boot.ts               # resolve current test slug and boot the page
│   │   ├── quiz-shell.ts         # question flow orchestration
│   │   └── result-shell.ts       # result rendering orchestration
│   ├── engine/
│   │   ├── schema.ts             # zod schemas for data packs
│   │   ├── scoring.ts            # weighted dimension accumulation
│   │   ├── matching.ts           # cosine similarity and ranking
│   │   ├── hidden-types.ts       # override / easter-egg gates
│   │   └── registry.ts           # all live tests and recommendation metadata
│   ├── poster/
│   │   ├── render.ts             # canvas poster drawing
│   │   ├── qr.ts                 # qrcode integration
│   │   └── assets/               # shared poster assets
│   ├── seo/
│   │   ├── meta.ts               # per-test metadata helpers
│   │   └── structured-data.ts    # JSON-LD helpers
│   └── ui/
│       ├── styles.css            # base styling
│       └── components/           # small DOM helpers, not framework components
├── wbti/
│   ├── index.html
│   ├── questions.json
│   ├── personalities.json
│   └── meta.json
├── lbti/
├── sbti/
├── stbi/
├── fbti/
├── tbti/
└── tests/
    ├── scoring.test.ts
    ├── schema-fixtures.test.ts
    └── hidden-types.test.ts
```

### Structure Rationale

- **`shared/engine/`:** keeps the reusable logic isolated from presentation so every new test inherits the same scoring behavior.
- **Per-test directories:** preserve the user's matrix mental model and align with Vite multi-page builds and GitHub Pages static routes.
- **`meta.json`:** keeps titles, descriptions, poster copy, and recommendation metadata out of code.
- **`tests/`:** the data-driven engine will break at the edges first, so tests should focus there, not on UI snapshots.

## Architectural Patterns

### Pattern 1: Directory-As-Product Boundary

**What:** each test owns its route and data pack, while the runtime stays shared.
**When to use:** always, unless the project later proves it needs a CMS or server.
**Trade-offs:** excellent for cloning and SEO; requires discipline to avoid per-test code forks.

**Example:**
```typescript
const testSlug = window.location.pathname.split("/").filter(Boolean)[0] ?? "wbti";
const dataPack = await loadTestPack(testSlug);
startQuizApp(dataPack);
```

### Pattern 2: Schema-Validated Data Packs

**What:** treat quiz content as untrusted data, even though it lives in the repo.
**When to use:** from the first test onward.
**Trade-offs:** small upfront ceremony, large reduction in clone-time bugs.

**Example:**
```typescript
const TestPackSchema = z.object({
  questions: z.array(QuestionSchema),
  personalities: z.array(PersonalitySchema),
  meta: MetaSchema,
});
```

### Pattern 3: Deterministic Result Pipeline

**What:** answers build a numeric vector, cosine matching ranks types, hidden rules optionally override.
**When to use:** for all BTI tests in this matrix.
**Trade-offs:** more setup than simple A/B counting, but much easier to reason about and test.

**Example:**
```typescript
const scoreVector = accumulateScores(answers, questions);
const ranked = rankPersonalitiesByCosine(scoreVector, personalities);
const result = applyHiddenTypeOverrides(ranked[0], scoreVector, hiddenRules);
```

### Pattern 4: Poster As Separate Renderer

**What:** poster generation consumes a clean result payload instead of reading arbitrary DOM state.
**When to use:** always.
**Trade-offs:** extra interface layer, but avoids export bugs tied to layout refactors.

## Data Flow

### Request Flow

```text
[User opens /wbti/]
    ↓
[boot.ts resolves slug]
    ↓
[load questions/personality/meta JSON]
    ↓
[validate with schema]
    ↓
[quiz-shell renders flow]
    ↓
[answer events accumulate state]
    ↓
[scoring + cosine match + hidden rules]
    ↓
[result-shell renders result]
    ↓
[poster engine draws export image + QR]
```

### State Management

```text
[Ephemeral in-memory quiz state]
    ↓
[Optional localStorage snapshot for progress]
    ↓
[Pure scoring functions]
    ↓
[Serializable result payload]
```

### Key Data Flows

1. **Quiz runtime flow:** page route -> data pack -> validated state machine -> result payload
2. **Poster flow:** result payload -> poster template -> canvas -> blob/download/share
3. **Matrix discovery flow:** current test slug -> registry metadata -> recommended next tests

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Static JSON, local assets, GitHub Pages are more than enough |
| 1k-100k users | Optimize bundles, fingerprint assets, compress poster backgrounds, add lightweight analytics |
| 100k+ users | Consider a host with better preview/header control and optional edge functions, but keep the front-end contract static-first |

### Scaling Priorities

1. **First bottleneck:** content duplication and data-pack drift — fix with schemas, fixtures, and clear folder contracts
2. **Second bottleneck:** poster export reliability/performance on mobile — fix with deterministic canvas rendering and asset constraints

## Anti-Patterns

### Anti-Pattern 1: One Giant Global App Bundle

**What people do:** load all tests, all copy, and all routes into one SPA bundle.
**Why it's wrong:** weakens SEO, increases first-load cost, and makes matrix expansion slower rather than faster.
**Do this instead:** ship one route per test, one registry, one shared engine.

### Anti-Pattern 2: Hardcoding Test Logic in UI Files

**What people do:** put special scoring and result edge cases into page-level scripts.
**Why it's wrong:** the second test immediately forks the codebase.
**Do this instead:** keep special behavior in data packs or explicit engine extension points.

### Anti-Pattern 3: Exporting Posters From Arbitrary DOM

**What people do:** render a fancy DOM result card and screenshot it.
**Why it's wrong:** font load timing, cross-origin assets, and CSS layout shifts make export brittle.
**Do this instead:** treat poster rendering as a dedicated canvas pipeline.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | CI build -> upload artifact -> deploy | Matches both GitHub and Vite official docs |
| QR generation | In-browser library call from poster renderer | Keep QR generation local; no external API needed |
| Search indexing | Static HTML + crawlable links + optional JSON-LD | Prefer metadata in HTML, not JS-only app shell updates |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `shared/engine` ↔ page shells | Typed data/result payloads | Keep this contract stable so UI redesigns do not touch scoring |
| `shared/poster` ↔ result shell | Serializable result object | Poster should never depend on live DOM scraping |
| `registry` ↔ test pages | Slug + metadata lookup | Avoid hardcoded cross-links in page templates |

## Sources

- Vite build guide: https://vite.dev/guide/build — verified MPA build support
- Vite static deploy guide: https://vite.dev/guide/static-deploy.html — verified GitHub Pages `base` configuration and build/deploy expectations
- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages — verified Pages deploy pipeline requirements
- MDN Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL — verified export constraints and recommended blob-based export direction
- MDN `document.fonts`: https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts — verified font-load synchronization approach
- MDN Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API — verified storage behavior and sync cost
- Google Search Central JS SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics — verified app-shell crawl trade-offs
- Google Search Central structured data with JS: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript — verified JSON-LD injection support and testing expectations

---
*Architecture research for: Static BTI-style personality quiz matrix platform*
*Researched: 2026-04-13*
