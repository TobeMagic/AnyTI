# Feature Research

**Domain:** 静态 BTI 矩阵测试平台
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 测试封面页 + 开始 CTA | 竞品普遍提供 cover page、时长预期和开测入口；没有封面页会显得像草率表单 | LOW | 包含标题、钩子文案、预计题量/时长、开始按钮 |
| 移动端友好的逐题答题流 | 人格测试主要消费场景就是手机；卡顿或布局溢出直接掉完播率 | MEDIUM | 需要大点击区、进度条、题目切换动效克制 |
| 确定性的结果逻辑 | 竞品通常用“答案累计指向结果”的逻辑；用户默认结果应稳定可复现 | MEDIUM | 本项目会升级为连续维度 + 向量匹配，但对用户来说核心是“结果别乱跳” |
| 结果页核心说明 | 16Personalities、MBTI Results 等都提供类型名、概述、优劣势或场景解释 | MEDIUM | 至少要有人格名、1 句 punchline、核心描述、维度解释 |
| 结果分享动作 | 人格测试天然依赖传播；竞品和工具平台都提供分享/引导扩散能力 | MEDIUM | v1 至少要一键保存海报；后续可再加平台化分享文案 |
| 结果页相关推荐 | 对单测平台不是必需，但对“矩阵平台”是基础设施 | LOW | 最少 2-3 个其他测试卡片，按场景或情绪导流 |
| 基础 SEO / 社交预览 | 每个测试落地页都需要可抓取标题、描述、OG 信息，否则流量浪费 | LOW | 静态页要有独立 metadata，不要全部指向同一首页 |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 隐藏人格 / 稀有结果 | 稀缺感会直接提高晒图与讨论欲望 | MEDIUM | 必须可控，不能随机瞎发；应由极端向量或特定模式触发 |
| Top 2-3 相近人格展示 | Interact 已经提供多结果百分比分布，说明用户愿意看“次匹配” | MEDIUM | 很适合本项目的余弦相似度模型，能把“像谁”解释得更自然 |
| 矩阵式互荐链路 | 单个测试做完即流失，矩阵互荐可以延长站内停留 | LOW | 推荐策略可以从静态规则开始，不需要个性化推荐系统 |
| 结果海报带二维码 | 把传播动作和回流入口绑在一起，特别适合朋友圈/小红书 | MEDIUM | 海报内容要控制层级，不要堆成营销页 |
| 主题化测试模板复用 | 工作、恋爱、学习等垂类切换只替换数据，会让扩张速度成为优势 | HIGH | 这是产品级 differentiator，不是单个页面特性 |
| 维度谱系解释 | 比单点人格名更像“你为什么是这个结果”，提高信服感 | MEDIUM | 可展示 4-5 个维度的倾向条，而不是只给标签 |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 登录账号 / 云端历史记录 | 看起来“更完整” | 与纯静态路线冲突，且对早期传播无增益 | 本地缓存最近一次结果，后续再评估账号系统 |
| 用户自建测试 / UGC 平台 | 听起来有平台想象力 | 直接把内容审核、编辑器、数据质量复杂度拉爆 | 先把官方 6 大测试模板跑顺 |
| 实时个性化推荐引擎 | 感觉更智能 | 静态站没有必要上动态推荐，边际收益低 | 先用静态规则：按场景、节日、相邻主题互推 |
| 伪科学包装过重 | 容易制造“准确感” | 一旦表述过头，信任和平台合规都有风险 | 用“行为风格/倾向”叙述，避免临床化或绝对化语言 |
| 每个测试独立重写 UI | 看似更灵活 | 会破坏矩阵复制效率 | 共享 layout + 可覆盖主题 token |

## Feature Dependencies

```text
题库数据 schema
    └──requires──> 计分引擎
                         └──requires──> 结果匹配器
                                              └──requires──> 结果页模板
                                                                   └──enhances──> 海报导出

测试元数据 / quiz manifest
    └──requires──> 目录路由生成
                         └──enhances──> 主站聚合
                         └──enhances──> 相关推荐

维度分数与人格向量
    └──enhances──> Top 2-3 相近人格展示
    └──enhances──> 隐藏人格触发规则
```

### Dependency Notes

- **题库 schema requires 计分引擎:** 没有统一数据契约，引擎无法保证每个测试都能复用。
- **结果匹配器 requires 结果页模板:** 先有稳定的结果数据模型，结果页和海报才能共享一套渲染。
- **quiz manifest enhances 主站聚合:** 主站晚做不代表现在可以不设计 manifest；否则后面很难自动聚合。
- **维度分数 enhances 多结果展示:** 如果只有单结果 ID，就做不出“你还很像谁”的解释层。

## MVP Definition

### Launch With (v1)

- [ ] `WBTI` 独立测试落地页 — 先验证单个高优先级场景能否跑通
- [ ] 通用答题引擎 + 连续维度计分 — 这是矩阵复制的根
- [ ] 结果页基础解释 + 维度条 — 让结果不只是一个名字
- [ ] 一键保存海报 — 内建传播动作
- [ ] 结果页相关推荐 — 内建矩阵导流动作
- [ ] GitHub Pages 自动部署 — 确保模板可以低成本稳定上线

### Add After Validation (v1.x)

- [ ] 隐藏人格与稀有徽章 — 当基础结果可信后再加彩蛋
- [ ] Top 2-3 相近人格显示 — 增强解释力和讨论度
- [ ] `LBTI` 第二个测试上线 — 验证模板扩张能力
- [ ] 主站导航页最小版本 — 至少有两个测试后再聚合更合理

### Future Consideration (v2+)

- [ ] SEO 内容层扩展（人格百科、对比文、节点专题页） — 在矩阵有一定量后再加
- [ ] 更细的推荐策略 — 基于测试完成链路优化，而非提前做推荐系统
- [ ] 更强的数据回收与分析能力 — 等流量成型后再评估统计方案

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| `WBTI` 测试流程 | HIGH | MEDIUM | P1 |
| 连续维度计分 + 结果匹配 | HIGH | MEDIUM | P1 |
| 结果页核心说明 | HIGH | MEDIUM | P1 |
| 海报导出 | HIGH | MEDIUM | P1 |
| 相关推荐 | HIGH | LOW | P1 |
| quiz manifest / 扩展模板 | HIGH | MEDIUM | P1 |
| 隐藏人格 | MEDIUM | MEDIUM | P2 |
| Top 2-3 相近人格 | MEDIUM | MEDIUM | P2 |
| 主站导航页 | MEDIUM | LOW | P2 |
| SEO 内容扩展 | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| 结果解释 | 16Personalities 强在完整类型说明与场景化解释 | MBTI Results 用多个子测试扩展同一人格体系 | 不追求百科厚度，先做 punchline + 场景化核心描述 + 维度解释 |
| 多结果显示 | Interact 支持“Show Top Results”显示多个高匹配结果 | 多数轻量人格测只给单结果 | 用相似度排序自然支持 Top 2-3 结果，但默认仍突出主结果 |
| 多测试矩阵 | MBTI Results 已展示工作、压力、关系等多子测试入口 | 16Personalities 更偏单主测 + 内容延展 | 把矩阵本身当产品，而不是把每个测试当一次性活动页 |
| 分享动作 | 多数工具型 quiz 平台提供分享或结果 CTA | 16Personalities 更偏内容消费 | v1 直接把海报和二维码作为默认出口 |

## Sources

- https://www.16personalities.com/ — 观察人格测试首页的时长承诺、结果说明与内容延展方式
- https://www.mbtiresults.com/ — 观察同一人格品牌下多测试矩阵入口与结果说明结构
- https://help.tryinteract.com/en/articles/4143802-show-top-results-multiple-outcomes-to-quiz-takers — 验证多结果/相近结果展示已是成熟做法
- https://help.tryinteract.com/en/articles/9971974-how-to-set-up-personality-quiz-logic-scoring — 验证人格测试常见的“答案与结果建立映射”逻辑
- https://help.tryinteract.com/en/collections/45504-quiz-feature-tutorials — 观察 quiz builder 对封面、结果、分享、图片规格等模块化要求

---
*Feature research for: 静态 BTI 矩阵测试平台*
*Researched: 2026-04-13*
