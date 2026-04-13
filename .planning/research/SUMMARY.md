# Project Research Summary

**Project:** BTI Matrix Platform
**Domain:** 静态人格测试矩阵平台
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Executive Summary

这个项目最像“静态内容站 + 高交互测试引擎”的混合体，而不是传统 SPA，也不是需要后端的 SaaS。官方文档层面，Astro + islands + GitHub Pages 这条路径与项目约束最匹配：页面可以静态生成、测试 URL 可独立索引、只有答题器和结果页需要 hydration，同时部署链路保持零运维。

从产品生态看，用户对人格测试的预期已经比较稳定：要有封面页、清晰的题目流、结果解释、分享动作，以及至少一定程度的“为什么是你”的解释层。真正能把本项目和普通人格测试拉开的，不是更复杂的算法本身，而是矩阵化扩展能力，也就是“同一套引擎快速复制多个测试，并在结果页内形成互荐闭环”。

研究也表明本项目最大的风险不是性能，而是结构失控：如果首个 `WBTI` 没有建立稳定的数据 contract、可测试的计分内核、独立静态路由和可靠的海报导出，后面每多一个测试都会把维护成本按倍放大。因此路线图应该先做平台骨架，再做首个测试体验，再做矩阵复制和主站聚合。

## Key Findings

### Recommended Stack

推荐使用 `Astro 5.x + React 19.2 + TypeScript 5.x + Tailwind CSS 4.2 + GitHub Pages`。Astro 提供静态路由、metadata 和内容组织，React 负责 quiz runner / result / poster 这类高交互局部，TypeScript + `astro/zod` 负责把题库和人格数据收紧成可验证 contract。

**Core technologies:**
- **Astro:** 静态路由与 SEO 页生成 — 最符合 GitHub Pages 与矩阵站需求
- **React 19.2:** 交互组件层 — 适合答题器、结果页、海报面板复用
- **TypeScript + `astro/zod`:** 数据契约与类型约束 — 防止复制测试时静默出错
- **Tailwind CSS 4.2:** 主题 token 与快速样式迭代 — 为后续讨论前端风格留出统一变量层
- **GitHub Pages + Actions:** 零运维部署 — 与项目成本约束完全一致

### Expected Features

用户必需项不是“海量功能”，而是一个完整、可信、可分享的测试闭环。

**Must have (table stakes):**
- 独立测试落地页与移动端答题流 — 用户默认预期
- 确定性的结果计算与结果页解释 — 没有解释层就没有“准感”
- 一键保存海报 — 本项目的传播动作核心
- 结果页相关推荐 — 对矩阵站是基本盘，不是附加项

**Should have (competitive):**
- 隐藏人格 / 稀有结果 — 提升传播意愿
- Top 2-3 相近人格展示 — 把余弦相似度优势显性化
- 统一模板快速复制到第二、第三个测试 — 这是平台级 differentiator

**Defer (v2+):**
- 用户账号与云端历史
- 实时推荐系统
- 大量 SEO 内容页与百科层

### Architecture Approach

推荐的结构是四层：`Quiz content/data`、`Shared domain engine`、`Interactive quiz experience`、`Static route/SEO shell`。这能把“每个测试是什么”和“平台如何运行”完全拆开，让新增测试只加数据包，不改引擎。

**Major components:**
1. **Quiz content pack** — 每个测试的数据合同：`meta/questions/personalities`
2. **Shared scoring engine** — 连续维度积分、相似度匹配、隐藏人格判定
3. **Quiz runner / result / poster UI** — React 交互层
4. **Static route shell + manifest** — Astro 路由、metadata、主站聚合与互荐入口

### Critical Pitfalls

1. **共享引擎名义化** — 没有统一 contract，后续每个测试都会长特殊逻辑
2. **结果逻辑和 UI 耦合** — 一旦改题库就难以验证结果是否漂移
3. **海报导出只在本机成功** — 真机和线上环境常因字体/跨域资源失败
4. **把整站做成单 SPA** — 直接损失 SEO、分享预览和矩阵路由价值
5. **结果文案过度科学化** — 传播也许变强，但信任边界会出问题

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Engine Foundation
**Rationale:** 先把“引擎共用，数据分离”落实成真正的工程骨架，否则后面任何测试都是假模板。  
**Delivers:** quiz pack schema、共享计分内核、静态路由骨架、部署链路、基础测试。  
**Addresses:** 数据 contract、独立静态路径、GitHub Pages 适配。  
**Avoids:** 共享引擎名义化、SPA 化、结果逻辑不可验证。

### Phase 2: WBTI End-to-End Experience
**Rationale:** 骨架稳定后，立即用 `WBTI` 跑通用户真实体验，验证题库到结果再到海报的完整链条。  
**Delivers:** `WBTI` 测试页、结果页、维度解释、海报导出、隐藏人格。  
**Uses:** React island、`html-to-image`、Vitest/Playwright。  
**Implements:** 首个完整 quiz pack 与结果模板。

### Phase 3: Matrix Replication + Recommendations
**Rationale:** 首测跑通后，最重要的是证明“复制第二个测试很便宜”，同时把结果页互荐做成产品能力。  
**Delivers:** 第二个测试（建议 `LBTI`）、统一推荐 manifest、跨测试卡片。  
**Addresses:** 矩阵站闭环与模板复用真实性。

### Phase 4: Main Navigation + SEO Aggregation
**Rationale:** 至少有两个测试后，主站聚合与 SEO 才有内容基础，不会做成空架子。  
**Delivers:** 主站导航页、分类标签、统一 metadata 策略。  
**Uses:** quiz manifest 与静态生成路由。

### Phase Ordering Rationale

- 先做 data contract 和共享引擎，是为了让后面的每个测试都成为“加内容”而不是“加应用”。
- `WBTI` 必须作为模板先跑通，否则矩阵只是纸上架构。
- 主站应依赖至少两个测试的真实结构，否则信息架构会反复返工。
- 海报与推荐要在首测阶段就进入，因为它们是增长能力，不是后装饰。

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** 海报导出与移动端真机兼容，尤其是字体/图片/CORS 细节
- **Phase 2:** 结果文案边界与隐藏人格触发设计，需要内容与产品共同校对

Phases with standard patterns (skip research-phase):
- **Phase 1:** Astro/GitHub Pages/测试框架的工程骨架相对标准
- **Phase 4:** 主站聚合在技术上并不难，关键是内容基础是否成熟

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | 主要基于 Astro / Vite / GitHub / React / Vitest / Playwright 官方文档 |
| Features | MEDIUM | 基于人格测试竞品与 quiz builder 平台能力观察，偏产品归纳 |
| Architecture | HIGH | 结合官方静态站文档与本项目约束，结论稳定 |
| Pitfalls | MEDIUM | 一部分来自官方文档与库限制，一部分来自该类产品的工程推断 |

**Overall confidence:** MEDIUM

### Gaps to Address

- **前端视觉方向尚未定：** 不影响当前骨架，但会影响 Tailwind token、海报风格和主站视觉语言
- **具体人格命名与文案体系未定：** 不影响平台架构，但会影响结果页模板内容密度
- **二维码生成方案未细化：** v1 可后补实现方式，当前不构成路线图阻塞

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/concepts/islands/ — islands 架构
- https://docs.astro.build/en/guides/content-collections/ — 数据集合、schema 与静态构建
- https://docs.astro.build/en/reference/routing-reference/#getstaticpaths — 批量静态路由
- https://docs.astro.build/en/guides/deploy/github/ — Astro + GitHub Pages 部署
- https://vite.dev/guide/static-deploy.html#github-pages — Pages 构建与 `base` 约束
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages — Pages 静态托管边界
- https://react.dev/learn/describing-the-ui — React 当前版本与组件模型
- https://tailwindcss.com/blog/tailwindcss-v4 — Tailwind v4 能力与 CSS-first 配置
- https://github.com/bubkoo/html-to-image — DOM 转图机制与限制
- https://vitest.dev/guide/ — Vitest 当前版本与测试定位
- https://playwright.dev/docs/intro — Playwright 的 E2E / Actions 适配

### Secondary (MEDIUM confidence)
- https://www.16personalities.com/ — 人格测试主站的结果包装与内容层观察
- https://www.mbtiresults.com/ — 多测试矩阵入口和结果页面结构观察
- https://help.tryinteract.com/en/articles/4143802-show-top-results-multiple-outcomes-to-quiz-takers — 多结果展示能力
- https://help.tryinteract.com/en/articles/9971974-how-to-set-up-personality-quiz-logic-scoring — 人格测试逻辑映射与准确性注意点

### Tertiary (LOW confidence)
- 无额外低可信来源作为核心决策依据

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
