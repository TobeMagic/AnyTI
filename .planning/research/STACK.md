# Stack Research

**Domain:** 静态 BTI 矩阵测试平台
**Researched:** 2026-04-13
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 5.x | 静态站点外壳、路由、内容组织、SEO 页面生成 | Astro 默认静态输出，适合 GitHub Pages；同时支持 islands 架构，只给测试交互区加载 JS，天然适合“静态内容页 + 交互测试引擎”混合场景。 |
| React | 19.2 | 测试答题器、结果页、海报面板等交互组件 | React 组件模型适合复用题目渲染、结果卡片、分享海报等 UI 单元；官方文档当前为 `v19.2`。 |
| TypeScript | 5.x | 题库 schema、人格数据、计分逻辑、推荐规则的类型约束 | 该项目真正容易出错的是数据和映射，TS 能把“题目字段漏写”“维度名拼错”“人格向量缺项”尽量提前到构建期暴露。 |
| Tailwind CSS | 4.2 | 快速建立视觉 token、组件状态、海报布局 | v4 系列已经转向 CSS-first 配置与原生变量，适合后续做统一主题变量，但当前阶段也不会把设计系统复杂化。 |
| GitHub Pages + GitHub Actions | 当前官方流程 | 静态托管与自动部署 | GitHub Pages 本身就是静态托管服务，支持从仓库内容或构建产物发布；对本项目的零成本、零运维约束完全匹配。 |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/react` | 5.0.3 | 在 Astro 中渲染和按需 hydration React 组件 | 需要交互式 quiz runner、结果页面板、海报导出按钮时使用。 |
| `astro/zod` | Zod 4 support | 校验 `questions.json`、`personalities.json`、`meta.json` 等数据包结构 | 任何新增测试接入前都必须通过 schema 校验，避免矩阵复制时静默出错。 |
| `html-to-image` | 1.x | 将结果卡片 DOM 转为 PNG/JPEG/Canvas | 结果页海报导出最直接，适合客户端一键保存。 |
| `vitest` | 4.1.4 | 单元测试：维度计分、相似度计算、隐藏人格触发 | 计分逻辑必须可回归测试，否则一改数据就可能破结果。 |
| `@playwright/test` | latest stable | E2E 验证：答题流程、结果页、GitHub Pages 路径、移动端海报导出 | 对静态站而言，最值得测的是真实浏览器行为，而不是复杂后端。 |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `astro check` | 类型与 Astro 文件校验 | 在 CI 里和 `tsc --noEmit` 一起跑，尽早发现数据契约问题。 |
| GitHub Actions | 构建、部署、基础校验 | 与 GitHub Pages 的官方部署路径一致，避免本地手工发布。 |
| 浏览器原生 `localStorage` | 暂存答题进度与最近结果 | 静态站没有服务端 session，短期记忆应放客户端；仅存非敏感数据。 |

## Installation

```bash
# Core
npm create astro@latest
npm install react react-dom tailwindcss

# Supporting
npm install @astrojs/react html-to-image

# Dev dependencies
npm install -D typescript vitest @playwright/test
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro + React islands | Vite + React 单页/多页应用 | 如果团队明确只做互动页、完全不在意静态 SEO/内容页组织，Vite 更直接；但本项目后续需要主站聚合和 SEO，Astro 更稳。 |
| Tailwind CSS 4 | 纯手写 CSS Modules | 如果后续 UI 极度克制、页面数量很少、没有主题变量诉求，CSS Modules 可以更轻；但矩阵扩张后统一 token 会更麻烦。 |
| `html-to-image` | 纯 Canvas 手写排版 | 如果海报非常高度定制、需要像绘图程序一样逐像素控制，可转纯 Canvas；但 v1 海报更需要工程效率。 |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js / SSR-first stack | 会引入本项目不需要的服务器渲染、部署复杂度和运行时概念 | Astro 静态输出 + islands |
| 每个测试各自 fork 一份页面逻辑 | 初期看着快，后面会把矩阵维护成本直接打爆 | 共享引擎 + 数据包约束 |
| 无 schema 的裸 JSON 读写 | 最容易在复制测试时产生隐形字段错误 | `astro/zod` / Zod schema 校验 |
| 服务端数据库作为 v1 前提 | 与“零运维、零成本、纯静态”约束冲突 | 本地 JSON + build-time 内容层 |

## Stack Patterns by Variant

**If 仍然坚持仓库根目录就是 `wbti/`, `lbti/` 这类物理目录：**
- 保持公开 URL 与目录名一致
- 但内部仍建议将题库数据放在统一 schema 管理层，避免根目录散落脚本和重复逻辑

**If 后续矩阵拓展到 20+ 测试：**
- 继续用 Astro 内容集合或统一数据目录
- 因为新测试的真正成本在“数据质量”而不是“页面数量”，需要让新增测试像加内容而不是复制应用

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Astro 5.x | `@astrojs/react` 5.0.3 | 官方 React integration 文档当前版本即 5.0.3。 |
| Astro 5.x | Zod 4 via `astro/zod` | Astro 文档明确说明 `astro/zod` 支持 Zod 4。 |
| Tailwind CSS 4.2 | Vite/Astro modern pipeline | Tailwind v4 提供 CSS-first 配置，并对 Vite 提供一方集成。 |
| Vitest 4.1.4 | Vite-based toolchain | Vitest 与 Vite 生态天然贴合，适合前端域逻辑单测。 |

## Sources

- https://react.dev/learn/describing-the-ui — 确认 React `v19.2` 与组件模型
- https://vite.dev/guide/static-deploy.html#github-pages — 确认 Vite / GitHub Pages 部署与 `base` 配置
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages — 确认 GitHub Pages 为静态托管服务
- https://docs.astro.build/en/guides/deploy/github/ — 确认 Astro 官方推荐 GitHub Pages 部署方式
- https://docs.astro.build/en/guides/integrations-guide/react/ — 确认 `@astrojs/react` 当前文档版本与安装方式
- https://docs.astro.build/en/guides/content-collections/ — 确认内容集合、schema、`astro/zod` 支持
- https://tailwindcss.com/blog/tailwindcss-v4 — 确认 Tailwind CSS v4 与 CSS-first 配置
- https://github.com/bubkoo/html-to-image — 确认 DOM 转图能力与浏览器限制
- https://vitest.dev/guide/ — 确认 Vitest 当前文档版本 `v4.1.4`
- https://playwright.dev/docs/intro — 确认 Playwright 当前安装与 GitHub Actions 适配

---
*Stack research for: 静态 BTI 矩阵测试平台*
*Researched: 2026-04-13*
