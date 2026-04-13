# Project Research Summary

**Project:** BTI Matrix Platform
**Domain:** Static personality-quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Executive Summary

这不是一个“做完一个测试就上线”的小工具，而是一个更接近静态内容产品和轻交互测试产品中间地带的矩阵站。研究结果支持用户最初的方向：最合适的技术基线不是 SSR/后端应用，而是 **Vite 多页面静态站 + TypeScript 共用引擎 + 每个测试独立数据包**。这种组合既能满足 GitHub Pages 零运维约束，也能保留未来 SEO 与矩阵扩张空间。

从竞品形态看，用户真正期待的不是复杂账户系统，而是顺滑的答题流程、区分明显的结果页、可信但不过度学术化的解释，以及结果后的继续浏览路径。对本项目来说，最有价值的差异化不在“把单个测试做得更像 MBTI”，而在 **把结果海报、跨测试推荐、隐藏人格、矩阵复用能力做成系统能力**。

最大的风险并不在技术难度，而在路径依赖：如果第一版按单测试思维硬写，或把所有页面塞进一个 hash SPA，后续扩张和 SEO 资产都会被提前锁死。另一个关键风险是结果体验本身不够区分，导致传播链条在结果页就中断。因此路线图应先保证共享骨架，再跑通 `WBTI`，然后尽快补上海报与矩阵闭环，而不是一开始就做主站大而全。

## Key Findings

### Recommended Stack

研究最支持的方案是：**Vite MPA + TypeScript 6.0 + 原生 Web 平台（尤其 Canvas 2D）+ GitHub Pages / Actions**。这套栈与项目约束高度一致，能直接支持多 HTML 入口、静态部署、真实 URL，以及图像海报导出。

**Core technologies:**
- **Vite:** 多页面构建与静态部署友好，适合 `/wbti/` 这类真实路径入口。
- **TypeScript 6.0:** 适合共享计分引擎、schema 约束、规则回归测试。
- **Canvas 2D + native web APIs:** 适合稳定海报导出，避免 DOM 截图链路的脆弱性。
- **GitHub Pages + Actions:** 符合零运维约束，直接支持静态 artifact 部署。

### Expected Features

这类产品的基础功能不是“更多按钮”，而是 **入口页 → 答题流 → 结果页 → 分享/再传播 → 下一测** 的完整闭环。竞品证明：深度结果解释、多测试矩阵、人格内容库、方法说明与相关内容跳转都已经是成熟玩法。

**Must have (table stakes):**
- 独立测试入口页与真实 URL
- 答题流程、进度反馈、结果页、重测能力
- 分享能力，尤其是适合社媒传播的导出图
- 结果后的站内推荐
- 基础方法说明与非临床免责声明

**Should have (competitive):**
- 连续谱维度 + 余弦相似度结果匹配
- 隐藏人格 / 彩蛋类型
- 基于结果的跨测试推荐
- 后续可索引的人格详情页

**Defer (v2+):**
- 账号系统 / 历史记录
- 社区评论
- AI 长报告

### Architecture Approach

推荐架构是 **静态多页面壳层 + 共用运行时模块 + 每个测试独立数据包**。真实 HTML 入口解决 SEO 和分享路径问题；共享模块解决引擎复用；数据包解决多测试扩张；Canvas poster pipeline 解决传播导出稳定性。

**Major components:**
1. **Entry / SEO layer** — 各测试独立 HTML 入口、title、canonical 与 crawlable links。
2. **Shared runtime layer** — loader、schema validation、scoring engine、result resolver、poster composer、recommendation。
3. **Data pack layer** — 每个测试的 `questions.json`、`personalities.json`、`meta.json`。

### Critical Pitfalls

1. **把第一版写成单测试专用代码** — 从 Day 1 保持共享引擎与数据契约。
2. **做成 hash-router SPA** — 用真实 URL、真实 `<a href>`、独立 HTML 入口。
3. **结果差异不明显** — 先对 `WBTI` 做规则验算和样本走查，保证人格真正分化。
4. **海报导出只靠 DOM 截图** — 用原生 Canvas 绘制与 `toBlob()` 导出。
5. **过度宣称科学性** — 用“research-inspired + 可解释 + 非临床”替代“精准诊断”。

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Shared Foundation
**Rationale:** 先把平台骨架定对，后续复制测试才不会返工。  
**Delivers:** 多页面脚手架、共享 schema、数据加载、计分核心、部署管道。  
**Addresses:** 共享引擎、真实 URL、GitHub Pages 路径问题。  
**Avoids:** “单测试写法” 与 SEO 路由错误。

### Phase 2: WBTI MVP
**Rationale:** 用一个测试把真正的用户价值跑通。  
**Delivers:** `WBTI` 题库数据、结果页、隐藏人格、可信度说明。  
**Uses:** 共享计分引擎和数据包契约。  
**Implements:** 用户从开始测试到拿到结果的完整闭环。

### Phase 3: Share Loop
**Rationale:** 这个品类的增长飞轮不在“测试完成”，而在“结果被分享”。  
**Delivers:** Canvas 海报、二维码、下载链路、结果页推荐位、基础埋点。  
**Addresses:** 传播与矩阵内部导流。

### Phase 4: Matrix Expansion
**Rationale:** 至少再复制 1-2 个测试，才能证明模板化扩张能力不是纸上谈兵。  
**Delivers:** 第二和第三个测试上线、推荐规则真实生效。  
**Implements:** 平台级而非单页级产品逻辑。

### Phase 5: Aggregation and SEO
**Rationale:** 当矩阵里已有多个测试，再做主站聚合和可索引的人格内容页，投入产出更高。  
**Delivers:** 主站导航页、测试聚合、静态人格内容页策略。  
**Avoids:** 过早做空心主站。

### Phase Ordering Rationale

- 先做共享骨架，是为了避免 `WBTI` 变成无法复用的一次性代码。
- 先做单测 MVP，再做海报，是为了保证传播放大的不是半成品结果。
- 先扩 2-3 个测试，再做聚合页，是为了让主站真的有内容和内链价值。

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** 海报导出与移动端保存链路，需按真实设备验证。
- **Phase 5:** SEO 人格详情页策略，需细化 canonical、索引与内容模板方案。

Phases with standard patterns (skip research-phase):
- **Phase 1:** 多页面静态站脚手架与 GitHub Pages 部署，官方文档比较明确。
- **Phase 2:** 数据驱动的答题流与结果计算，模式清晰，可直接规划。

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | 关键选择多数可由 Vite、GitHub、TypeScript、MDN 官方文档支撑。 |
| Features | MEDIUM | 依赖对竞品结构与行业常见玩法的归纳，方向可靠但仍有产品判断成分。 |
| Architecture | MEDIUM | 与项目约束高度一致，但“人格详情页是否静态化”属于后续策略决定。 |
| Pitfalls | MEDIUM | 一部分来自官方 SEO/部署文档，一部分来自此类产品的工程常识与推演。 |

**Overall confidence:** MEDIUM

### Gaps to Address

- **人格详情页的最终策略：** 需要在后续规划时决定是先做动态结果页，还是同步生成静态类型页。
- **推荐逻辑的第一版粒度：** 先按测试类别/当前结果规则化，还是等 2-3 个测试上线后再细化。

## Sources

### Primary (HIGH confidence)
- Vite build guide: https://vite.dev/guide/build.html
- Vite static deploy guide: https://vite.dev/guide/static-deploy.html
- GitHub Pages docs: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- TypeScript 6.0 official release: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
- Zod docs: https://zod.dev/packages/zod
- Biome docs: https://biomejs.dev/
- MDN Canvas APIs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
- MDN Canvas export: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- Google Search Central JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

### Secondary (MEDIUM confidence)
- Truity home / test matrix: https://www.truity.com/
- Truity technical documentation example: https://www.truity.com/sites/default/files/uploads/BigFiveTechnicalDocument.pdf
- 16Personalities structure example: https://www.16personalities.com/istp-strengths-and-weaknesses
- Arealme examples: https://www.arealme.com/time-perception-test/en/
- Arealme type page example: https://www.arealme.com/entp-personality-type/en/
- `node-qrcode` repository: https://github.com/soldair/node-qrcode

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
