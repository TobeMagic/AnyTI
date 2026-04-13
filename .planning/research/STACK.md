# Stack Research

**Domain:** Static BTI quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vite | current stable major | 本地开发、打包、MPA 输出 | 官方文档直接支持多 HTML 入口和 GitHub Pages 静态部署，适合 `index.html + /wbti/ + /lbti/` 这种矩阵目录结构。 |
| TypeScript | 6.0 | 共享引擎类型安全、题库/人格数据约束、计分逻辑可维护 | 计分权重、向量匹配、隐藏人格规则都属于“容易写错但难肉眼发现”的逻辑，TypeScript 能显著降低模板复制后的漂移风险。 |
| Native Web Platform | evergreen browsers | 运行时 UI、Canvas 海报、静态资源加载 | 当前产品不需要完整 SPA 框架；原生 HTML/CSS/ESM + Canvas 2D 更符合“纯静态、低 JS、低运维、可 SEO”的约束。 |
| GitHub Pages + GitHub Actions | current | 托管与自动部署 | 官方文档明确支持静态文件和 Actions 工作流；没有服务端语言支持，反而与本项目的零运维路线天然一致。 |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 4.x | 校验 `questions.json`、`personalities.json`、`manifest.json` 结构 | 只要开始做“一个引擎复制多个测试”，就应该在构建或运行时验证数据包，避免单测复制后悄悄坏掉。 |
| qrcode | current stable | 生成海报里的二维码 | 结果海报需要直出二维码时使用；适合和 Canvas 合成链路配合。 |
| Vitest | 4.x | 测试计分、相似度匹配、隐藏人格触发条件 | 引擎层最需要的是数学与规则回归测试，Vitest 和 Vite 生态贴合。 |
| Biome | 2.x | 格式化、lint、基础静态检查 | 这个项目文件量会快速扩张，但复杂度不高；用单工具链压住格式与常见错误，成本最低。 |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| GitHub Actions | 自动 build + deploy 到 Pages | Vite 官方给出了 GitHub Pages 工作流示例，直接复用即可。 |
| `vite preview` | 本地验证生产包 | 官方文档明确其用途是本地预览生产包，不是正式服务器。 |
| Lighthouse | 检查移动端性能与 SEO 基线 | 结果页、海报页、入口页都面向移动传播，发布前至少做一次手工审查。 |

## Installation

```bash
# Core
npm install zod qrcode

# Dev dependencies
npm install -D vite typescript vitest @biomejs/biome
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite MPA + TypeScript | Astro | 当“人格类型内容库 / SEO 落地页 / 博客文章”明显多于交互测试页时，Astro 对内容组织更省心。 |
| Native DOM + Canvas | React / Preact | 当前页面交互浅，框架不是刚需；如果后续要做复杂组件系统、状态同步、实验平台，再上框架更合适。 |
| Biome | ESLint + Prettier | 若团队已有成熟 ESLint 规则体系或必须依赖大量特定插件，再切回双工具链。 |
| GitHub Pages | Cloudflare Pages | 若后续需要预览环境、边缘函数、或更灵活的域名/缓存控制，再迁移。 |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Hash-router SPA (`#/wbti`) | Google 官方明确更偏好真实 `href` URL；哈希路由会削弱发现与索引能力，不利于矩阵 SEO。 | 真正的多页面路径，如 `/wbti/`、`/lbti/`、`/types/wbti/...` |
| Next.js / Nuxt SSR as v1 baseline | 项目没有服务端诉求，且目标托管是 GitHub Pages；SSR 会把零运维目标直接打破。 | Vite 静态多页面 |
| `html2canvas` 作为核心海报方案 | 结果海报是产品内建能力，不应依赖脆弱的 DOM 截图链路；字体、跨域图片、布局差异都可能导致导出不稳定。 | 原生 Canvas 2D 直接绘制海报，再用 `toBlob()` 导出 |
| 账号系统 / 数据库存档 | 与当前“零成本、零后端”约束冲突，而且会拖慢模板跑通。 | 无账号匿名测试 + 可复制分享链接 |

## Stack Patterns by Variant

**If the product remains quiz-first:**
- Keep Vite MPA + TypeScript + native Canvas.
- Because the main work is engine/data/content, not app-shell complexity.

**If the product becomes content-first later:**
- Introduce Astro or a content-oriented static layer for indexable personality library pages.
- Because SEO-heavy type pages and editorial content benefit from stronger content primitives.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Vite current stable | matching Vitest 4.x line | 保持在官方 starter / 官方文档推荐的兼容组合，升级 major 前先跑测试与部署预览。 |
| TypeScript 6.0 | Zod 4.x | 适合当前“类型驱动 + schema 校验”模式。 |
| Canvas 2D API | evergreen browsers | `drawImage()` 已广泛可用；`toBlob()` 自 2020 起已在主流浏览器普遍可用。 |

## Sources

- Vite build guide: https://vite.dev/guide/build.html
- Vite static deploy guide: https://vite.dev/guide/static-deploy.html
- GitHub Pages docs: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- TypeScript 6.0 official release: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
- Vitest blog / latest releases: https://v4.vitest.dev/blog
- Zod docs: https://zod.dev/packages/zod
- Biome docs: https://biomejs.dev/
- MDN `drawImage()`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
- MDN `toBlob()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- `node-qrcode` repository: https://github.com/soldair/node-qrcode

---
*Stack research for: Static BTI quiz matrix platform*
*Researched: 2026-04-13*
