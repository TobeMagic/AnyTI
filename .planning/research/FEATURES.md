# Feature Research

**Domain:** Static BTI quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 单个测试独立入口页 | 矩阵型测试站必须让每个测试都可直接落地和传播，而不是只能从主站进入 | LOW | 每个测试都要有独立标题、说明、CTA、时间预估。 |
| 测试流程页（题目、选项、进度） | 用户默认会看到稳定的答题流程和明确的进度反馈 | MEDIUM | 10 分钟内完成的预期在竞品中很常见，进度和节奏感很重要。 |
| 明确且可区分的结果页 | 这是人格测试的核心价值交付，没有清晰结果就没有传播价值 | MEDIUM | 至少要有人格名、核心摘要、为什么是你、维度倾向。 |
| 结果后的重测 / 返回能力 | 竞品普遍提供 retake 或重新开始入口 | LOW | 传播内容天然会诱发二刷和转发给别人重测。 |
| 分享能力 | 这个品类的自然增长强依赖“晒结果” | MEDIUM | 本项目不是简单复制链接，而是明确要求一键导出海报。 |
| 站内“下一测什么”入口 | 多测试站点的用户默认会被引导去相关测试 | LOW | Arealme 一类站点已经把 “More Like This” 做成基本习惯。 |
| 基础可信度说明 | 对人格/心理类测试，用户会天然追问“你怎么算的” | LOW | 不必学术论文级，但至少要有简短方法说明和非临床免责声明。 |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 共用引擎 + 数据包复制能力 | 真正把“做一个爆款测试”升级成“持续扩张的矩阵平台” | HIGH | 这是平台级护城河，不是单页效果。 |
| 连续谱维度 + 余弦相似度结果匹配 | 结果比简单 A/B 或 4 字母标签更细腻，也更容易解释“为什么差一点就是另一个类型” | MEDIUM | 能支持隐藏人格、近邻类型、维度图谱。 |
| 隐藏人格 / 彩蛋人格 | 强传播点，能制造稀缺感和二次分享 | MEDIUM | 必须通过规则触发，不能像普通类型一样轻易拿到。 |
| Canvas 结果海报（含二维码） | 比单纯分享链接更适合朋友圈 / 小红书传播 | MEDIUM | 平台导流与结果展示可以在一张图内闭环。 |
| 按结果做跨测试推荐 | 从“测完一个”转成“连续测多个”，形成矩阵内部流量循环 | MEDIUM | 推荐文案应和当前结果/场景相关，而不是简单罗列。 |
| 静态可索引的人格内容页 | 同时服务 SEO 和用户二次阅读 | HIGH | 未来可让每种人格拥有独立、可被搜索引擎收录的页面。 |
| 节点化内容包装 | 利用开学季、情人节、双 11、暑假等节点重新激活已有引擎 | MEDIUM | 本质上是同一引擎的数据与文案变体能力。 |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 账号体系 / 历史记录 | 看起来更“产品化” | 立刻引入后端、隐私、找回、存储和运维问题，不符合当前约束 | 无账号匿名体验 + 用户自行保存海报 / 复制链接 |
| 评论区 / 社区讨论 | 看起来更热闹 | 审核、垃圾内容、低质互动会把零运维模型击穿 | 用站内推荐和外部社媒承接讨论 |
| AI 长报告生成 | 看起来高级且个性化 | 成本、稳定性、幻觉和产品焦点都会失控 | 先把结构化类型说明写扎实 |
| 单一巨大 SPA | 开发者容易默认这样做 | 不利于真实 URL、矩阵 SEO、按测试拆入口，也不利于 GitHub Pages 上的路径管理 | 静态多页面架构 |
| 一上来就做主站大而全 | 容易觉得“像平台” | 主站没有足够内容支撑时价值很弱，会分散首测跑通资源 | 先 WBTI 模板，2-3 个测试后再做聚合页 |

## Feature Dependencies

```text
测试数据 schema
    └──requires──> 数据加载与校验
                          └──requires──> 共享计分引擎
                                                └──requires──> 结果匹配与结果页渲染
                                                                              └──requires──> 海报导出

矩阵 manifest
    └──requires──> 站内推荐模块
                          └──enhances──> 结果页传播转化

真实 URL / 独立 HTML
    └──requires──> 多页面构建
                          └──enhances──> SEO 与测试入口传播
```

### Dependency Notes

- **数据加载与校验 requires 数据 schema:** 不先固定数据契约，后续复制测试时必然出现字段漂移。
- **共享计分引擎 requires 数据加载与校验:** 题库和人格数据不可信时，数学引擎越复杂越危险。
- **海报导出 enhances 结果页渲染:** 没有稳定结果页，海报只是在放大混乱内容。
- **真实 URL enhances SEO:** Google 官方文档强调要用真实 `href` 和唯一 URL，不要把内容藏在 hash 或按钮点击里。

## MVP Definition

### Launch With (v1)

- [ ] `WBTI` 独立入口页 — 先验证单测入口和完整答题体验。
- [ ] 共用测试引擎 — 题目加载、维度计分、结果匹配、隐藏人格规则。
- [ ] `WBTI` 结果页 — 人格名、核心摘要、维度解释、重测入口。
- [ ] Canvas 分享海报 — 人格名、核心描述、二维码、一键保存。
- [ ] 基础可信度说明 — 告诉用户“灵感来自哪些理论、结果如何计算、非临床用途”。
- [ ] 矩阵 manifest 骨架 — 即使只有一个测试，也要为后续多测试扩张预留配置位。

### Add After Validation (v1.x)

- [ ] 第二、第三个测试上线 — 让跨测试推荐真正生效。
- [ ] 轻量主站导航页 — 当矩阵至少有 2-3 个测试后再聚合。
- [ ] 人格详情页模板 — 为未来 SEO 与深阅读做准备。
- [ ] 简单事件埋点 — 观察开始率、完成率、分享率、推荐点击率。

### Future Consideration (v2+)

- [ ] 静态人格内容库 — 每个测试下的每个人格拥有可索引页面。
- [ ] 节点活动页 / 节日包装层 — 复用已有测试引擎做专题流量页。
- [ ] 更细的个体化推荐 — 依据结果组合推荐下一测。
- [ ] 更强方法论文档 / 技术白皮书 — 当品牌和信任要求变高时再补强。 

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| `WBTI` 入口与答题流 | HIGH | MEDIUM | P1 |
| 共享计分引擎 | HIGH | MEDIUM | P1 |
| 结果页与类型解释 | HIGH | MEDIUM | P1 |
| Canvas 海报导出 | HIGH | MEDIUM | P1 |
| 矩阵 manifest 骨架 | HIGH | LOW | P1 |
| 可信度说明 / 方法页 | MEDIUM | LOW | P2 |
| 第二、第三个测试复制上线 | HIGH | MEDIUM | P2 |
| 主站导航页 | MEDIUM | LOW | P2 |
| 静态人格 SEO 页 | HIGH | HIGH | P3 |
| AI 长报告 | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | 16Personalities | Truity | Our Approach |
|---------|------------------|--------|--------------|
| 结果解释深度 | 很强，按人格拆出 strengths、relationships、career、workplace 等章节 | 很强，测试矩阵 + 类型库 + blog/解释体系 | v1 先做“结果解释够清晰”，后续再按测试扩充章节深度 |
| 多测试矩阵 | 有其他产品，但核心仍偏单旗舰测试 | 非常明显，首页直接呈现多测试矩阵与内容库 | 从 Day 1 就按矩阵平台设计，而不是后补 |
| 科学/信任表达 | 有框架与产品体系，但对普通用户仍偏品牌化 | 有 technical documentation、workplace variants、business 产品线 | 采取“研究启发 + 明确免责声明 + 方法可解释”的中间路线 |
| 站内互导 | 有资源和产品跳转 | 首页和库页非常强 | 结果页内建“测完这个，下一测什么”作为矩阵关键动作 |
| 病毒传播导向 | 强品牌，分享偏链接 / 内容阅读 | 偏内容与评估产品 | 明确把海报导出作为主传播载体 |

## Sources

- Truity home / multi-test matrix: https://www.truity.com/
- Truity Big Five technical document: https://www.truity.com/sites/default/files/uploads/BigFiveTechnicalDocument.pdf
- 16Personalities type page structure: https://www.16personalities.com/istp-strengths-and-weaknesses
- Arealme result / related-tests pattern: https://www.arealme.com/time-perception-test/en/
- Arealme type page structure: https://www.arealme.com/entp-personality-type/en/
- Google Search Central JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

---
*Feature research for: Static BTI quiz matrix platform*
*Researched: 2026-04-13*
