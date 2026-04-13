# Pitfalls Research

**Domain:** Static personality quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Building It Like an SPA Instead of a Matrix of Static Pages

**What goes wrong:**
The project turns into one app-shell-heavy bundle with router workarounds and weak page-level SEO instead of a directory-based test matrix.

**Why it happens:**
SPA tooling feels familiar, and teams optimize for developer convenience before they optimize for the product's actual distribution model.

**How to avoid:**
Use one static entry per test, keep links crawlable, and let the URL structure mirror the matrix itself.

**Warning signs:**
- Needing client-side router rewrites to open basic pages
- Refreshing a nested test URL breaks
- Search metadata is mostly injected after page load

**Phase to address:**
Phase 1 foundation

---

### Pitfall 2: Fragile Poster Export

**What goes wrong:**
Result posters fail on some devices, export blank/tainted images, or look different from the intended design because fonts and assets were not actually ready.

**Why it happens:**
Teams often treat poster export as "just screenshot the result card" and underestimate CORS, font timing, and memory constraints.

**How to avoid:**
Render posters directly on Canvas, keep assets same-origin where possible, use `document.fonts.ready`, and prefer `toBlob()` over `toDataURL()` for large exports.

**Warning signs:**
- Export succeeds on desktop but fails on mobile Safari or in-app browsers
- External images/logos are used without explicit CORS handling
- Poster generation depends on DOM screenshots instead of a stable payload

**Phase to address:**
Phase 2 WBTI result and poster

---

### Pitfall 3: Data-Pack Drift Across Tests

**What goes wrong:**
The first test works, but cloned tests gradually diverge in field names, scoring semantics, or edge-case handling until the "shared engine" is shared in name only.

**Why it happens:**
Copy-paste content work happens faster than schema discipline, especially once several tests are being prepared in parallel.

**How to avoid:**
Create a strict schema for all quiz packs, validate packs on load/build, and add fixtures for representative edge cases before cloning WBTI into the second test.

**Warning signs:**
- Test-specific conditionals appear inside scoring logic
- Different tests require different JSON field names
- Editors are unsure what fields are mandatory

**Phase to address:**
Phase 1 foundation, then Phase 3 expansion

---

### Pitfall 4: Overclaiming Scientific Authority

**What goes wrong:**
Marketing copy reads like an official clinical or trademarked assessment, creating legal/trust risk and making the product easier to attack as pseudoscience.

**Why it happens:**
Personality products perform better when they feel credible, so teams push the language too far.

**How to avoid:**
Use "inspired by" framing, explain the dimension logic clearly, include concise disclaimers, and avoid presenting results as diagnosis or official MBTI output.

**Warning signs:**
- Page copy says or implies "official MBTI"
- Results speak in deterministic clinical language
- There is no distinction between "self-discovery content" and "psychological assessment"

**Phase to address:**
Phase 2 content and SEO framing

---

### Pitfall 5: Trying to Launch the Full Matrix Before Proving the Template

**What goes wrong:**
Six partially-built tests exist, but none of them has a finished quiz flow, result experience, poster export, or deploy pipeline.

**Why it happens:**
The matrix idea is strategically compelling, so the team starts multiplying before the template is operational.

**How to avoid:**
Honor the user's intended sequence: WBTI first, then one clone, then matrix navigation.

**Warning signs:**
- New test folders appear before WBTI is publicly usable
- Poster work is postponed "until later" on every test
- Nobody can describe the exact clone steps from test 1 to test 2

**Phase to address:**
Phase 1 and Phase 2 sequencing

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copying CSS into each test folder | Faster first page styling | Guaranteed visual drift and duplicated fixes | Never |
| Hardcoding recommendation links in HTML | Quick manual linking | Becomes unmaintainable as tests multiply | Only in the first WBTI placeholder if replaced immediately in Phase 3 |
| Storing raw full answer histories in `localStorage` | Easy persistence | Sync performance cost and messy data shape | Never for v1 |
| Embedding test text directly in TS files | Fastest authoring | Makes cloning harder and content review painful | Acceptable only for tiny prototype spikes, not for the committed template |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages | Forgetting repo subpath `base` | Set the Vite `base` correctly for `/<REPO>/` deployments |
| GitHub Pages | Assuming branch deploy with Jekyll defaults matches built assets | Prefer GitHub Actions workflow deployment; if bypassing Jekyll on branch deploys, use `.nojekyll` |
| Canvas export | Drawing third-party images directly | Keep assets same-origin or set CORS explicitly before drawing |
| Native share | Calling `navigator.share()` outside user activation | Trigger native share only from a user click/tap and provide fallback download/copy actions |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all tests' JSON on every page | Slow first load and large bundles | Fetch only the current test pack; keep the registry minimal | Noticeable as soon as 2-3 tests exist |
| Huge poster backgrounds/fonts | Export stutters or memory failures on mobile | Keep poster assets optimized and canvas dimensions controlled | Usually visible on mid-tier mobile devices first |
| Heavy `localStorage` writes per answer | Janky answering flow | Buffer updates in memory and persist only occasionally or on milestone steps | Breaks once payloads or write frequency grow |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Injecting unsanitized HTML from content JSON | XSS via content/config files | Treat content as text by default; sanitize any rich text explicitly |
| Adding too many third-party scripts early | Data leakage and performance loss | Keep v1 nearly script-free beyond the required runtime libraries |
| Publishing hidden/unlaunched tests in the public bundle | Premature discovery and confusing navigation | Control live tests via a registry and ship only what is ready to expose |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Result names are academic or bland | Low shareability and poor recall | Use sharp, meme-capable labels with short explanatory hooks |
| Result page delays the reveal | Users bounce before feeling rewarded | Show the type name and one-line verdict immediately |
| Test feels too long too early | Completion rate drops | Use fewer, higher-signal questions in the first public template |
| No "what next" action | Matrix traffic leaks out after one test | Always show another relevant test or a poster/share CTA |

## "Looks Done But Isn't" Checklist

- [ ] **Pages deployment:** verify repo subpath URLs, not just localhost root paths
- [ ] **Result poster:** verify export on desktop and mobile, not just on one browser
- [ ] **Result matching:** verify hidden-type conditions and tie-breaking with fixtures
- [ ] **SEO basics:** verify titles, descriptions, crawlable links, and 200/404 behavior on deployed pages
- [ ] **Second test clone:** verify a non-WBTI pack can run without code changes

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| SPA-style architecture drift | HIGH | Split routes back into real static entries, rework navigation, and rebuild metadata handling |
| Broken poster export | MEDIUM | Isolate poster into dedicated renderer, replace external assets, and add device verification steps |
| Data-pack drift | MEDIUM | Freeze schema, add migration script/tests, normalize all packs to the contract |
| Overclaimed scientific copy | LOW | Rewrite copy, add disclaimers, and remove problematic labels before broader distribution |
| Premature matrix sprawl | MEDIUM | Pause new tests, finish WBTI, document clone recipe, then resume expansion |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| SPA instead of static matrix | Phase 1 | Deployed nested routes work without rewrite hacks |
| Fragile poster export | Phase 2 | Poster exports reliably with same-origin assets and loaded fonts |
| Data-pack drift | Phase 1 and 3 | Second test runs on the same engine without special-case code |
| Overclaiming science | Phase 2 | Landing/result copy clearly distinguishes inspiration vs. official assessment |
| Premature matrix sprawl | Phase 1 and 2 | WBTI is live before any other test is treated as in-scope delivery |

## Sources

- Vite static deploy guide: https://vite.dev/guide/static-deploy.html
- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- GitHub Pages with Jekyll / `.nojekyll`: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll
- MDN `toDataURL()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
- MDN `crossOrigin`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin
- MDN `document.fonts`: https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts
- MDN Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN Web Share API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- Google Search Central JS SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Truity and IDRlabs public test pages for domain framing/disclaimer patterns

---
*Pitfalls research for: Static BTI-style personality quiz matrix platform*
*Researched: 2026-04-13*
