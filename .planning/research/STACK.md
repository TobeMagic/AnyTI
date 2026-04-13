# Stack Research

**Domain:** Static BTI-style personality quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 20.19+ or 22.12+ | Local build and CI runtime | Vite 7 requires these Node ranges, so aligning the repo to them avoids CI drift and ESM edge cases. |
| Vite | 7.x | Dev server, production bundling, multi-page static build | Official docs support multi-page apps directly and document GitHub Pages deployment cleanly. This matches the user's directory-per-test model better than an SPA-first stack. |
| TypeScript | 5.9.x | Shared engine, data contracts, scoring logic | TS 5.9 gives a cleaner default config and strong type-safety for score vectors, quiz schemas, and renderer contracts without pushing the project onto a just-released major. |
| Browser-native Web APIs | Baseline widely available | Quiz runtime, poster export, local persistence | Canvas 2D, Web Storage, URLSearchParams, and Fetch already cover the core runtime needs. Using the platform directly keeps the static bundle lean. |
| GitHub Pages + GitHub Actions | `configure-pages@v5`, `upload-pages-artifact@v4`, `deploy-pages@v4` | Zero-ops hosting and deployment | This is the user's explicit hosting constraint. Both GitHub and Vite document the exact workflow path. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 4.3.6 | Validate `questions.json`, `personalities.json`, and future registry/meta files | Use at build time and app boot so broken data packs fail fast instead of producing silent scoring bugs. |
| Vitest | 4.1.4 | Unit tests for scoring, cosine matching, hidden-type gates, and schema fixtures | Use from the first engine phase; the scoring core is deterministic and should be tested before any UI polish. |
| qrcode | 1.5.4 | Generate QR codes for result posters and share cards | Use in the poster pipeline; it works in browser and can render directly to canvas/data URL. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint + Prettier or Biome | Linting and formatting | Pick one stack and keep it boring. For this project, consistency matters more than tool novelty. |
| GitHub Actions | CI for build, test, deploy | Reuse the same workflow family GitHub Pages expects so deployment stays transparent. |
| Lighthouse (manual or CI later) | Performance/SEO checks | Add after the first public WBTI template is live; don't block phase 1 on it. |

## Installation

```bash
# Scaffold
npm create vite@latest . -- --template vanilla-ts

# Supporting libraries
npm install zod qrcode

# Dev dependencies
npm install -D vitest eslint prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite MPA + vanilla TypeScript | React + Vite | Use React only if the team later wants a component-heavy design system, complex shared UI state, or a richer app shell. For v1, quiz state is local and finite; React is optional complexity. |
| Vite MPA | Astro | Astro is attractive when content pages dominate and interactivity is sparse. Here, nearly every key route is interactive, so Astro adds another abstraction without solving a pressing problem yet. |
| GitHub Pages | Cloudflare Pages | Use Cloudflare Pages later only if preview deployments, edge functions, custom headers, or image/back-end needs appear. It is not needed for the current zero-backend scope. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js or other SSR-first frameworks as the baseline | Static export exists, but unsupported static-export features like redirects, headers, middleware, and server actions create unnecessary footguns for a zero-backend project. | Vite MPA with explicit static HTML entries |
| SPA router as the primary site architecture | GitHub Pages is happiest serving real files; SPA routing adds refresh/404 friction and weakens the test-per-directory SEO model. | Directory-based static pages per test |
| DOM-screenshot-first poster generation (`html2canvas`-style approach) | Poster export becomes fragile around fonts, transforms, and CORS. | Direct Canvas composition with controlled assets |
| Large answer logs or analytics blobs in `localStorage` | MDN notes Web Storage is synchronous; large reads/writes can block the UI. | Keep storage to small progress/result snapshots only |

## Stack Patterns by Variant

**If the project stays purely static:**
- Use Vite multi-page entries for `/wbti/`, `/lbti/`, `/sbti/`, etc.
- Load each test's JSON data pack lazily based on the current directory.
- Keep one shared engine bundle and one shared poster bundle.

**If content/SEO pages later become a major product surface:**
- Keep the quiz engine package as-is.
- Consider introducing Astro only for editorial shells and landing pages.
- Do not rewrite the quiz runtime until content volume proves it is worth it.

**If later phases require server features:**
- Keep the existing static front-end contract.
- Add only the missing capability at the edge (for example analytics ingestion or account history), rather than migrating the whole app to SSR.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `vite@7.x` | Node.js `20.19+` or `22.12+` | Official Vite 7 requirement |
| `vite@7.x` | GitHub Pages Actions workflow | Official Vite deploy guide documents a Pages workflow directly |
| `vitest@4.1.4` | Vite 7 projects | Vite 7 is supported starting from Vitest 3.2; latest 4.1.4 is the current stable track |
| `zod@4.3.6` | TypeScript 5.x | Good fit for schema validation in TS-first apps; avoid mixing old Zod 3 assumptions into new code |

## Sources

- Vite blog: https://vite.dev/blog/announcing-vite7 — verified Node.js support and current major
- Vite guide: https://vite.dev/guide/build — verified multi-page app support
- Vite guide: https://vite.dev/guide/static-deploy.html — verified GitHub Pages deployment and `base` handling
- GitHub Docs: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages — verified custom workflow deployment requirements
- GitHub Docs: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll — verified `.nojekyll` bypass note and Pages publishing behavior
- TypeScript docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html — verified TS 5.9 capabilities and current stable release-note track
- Vitest releases: https://github.com/vitest-dev/vitest/releases — verified current stable release line
- Zod releases: https://github.com/colinhacks/zod/releases — verified current stable release line
- qrcode package: https://www.npmjs.com/package/qrcode — verified browser/client support and current package version
- MDN Web Share API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API — verified native share constraints
- MDN Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API — verified sync storage trade-offs
- MDN Canvas export: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL — verified export and memory/CORS caveats

---
*Stack research for: Static BTI-style personality quiz matrix platform*
*Researched: 2026-04-13*
