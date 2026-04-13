# Pitfalls Research

**Domain:** 静态 BTI 矩阵测试平台
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: “数据分离”只停留在口号

**What goes wrong:**
表面上每个测试有自己的 `questions.json` 和 `personalities.json`，但实际计分字段、命名规范、隐藏人格规则各写各的，最终共享引擎充满例外分支。

**Why it happens:**
团队一开始只关注跑通首个测试，没有建立强制 schema 和命名约定。

**How to avoid:**
在 Phase 1 就建立 quiz pack contract、schema 校验和样例数据；新增测试不符合 contract 就不能构建。

**Warning signs:**
- `if (quizSlug === "wbti")` 这类分支开始进入引擎层
- 每个测试的维度命名风格不一致
- 修改一个测试会顺带改共享逻辑

**Phase to address:**
Phase 1

---

### Pitfall 2: 结果算法写进 UI，无法验证

**What goes wrong:**
结果显示“看起来能跑”，但一改题目或人格权重后没人知道结果是否被破坏，隐藏人格尤其容易失效。

**Why it happens:**
为了图快，把状态、计分、匹配和渲染全塞在前端组件里。

**How to avoid:**
把计分与匹配抽成纯函数；为每个测试至少准备几组黄金样例答案；对隐藏人格写单测。

**Warning signs:**
- 无法在不打开浏览器的情况下验证结果
- 结果 bug 只能靠人工反复点击
- 新增测试后不敢改引擎

**Phase to address:**
Phase 1

---

### Pitfall 3: 海报导出在真实设备上失效

**What goes wrong:**
本地桌面浏览器能导出海报，但线上移动端出现字体错位、图片丢失、跨域资源导致 canvas 被污染。

**Why it happens:**
DOM 转图对字体、图片来源、尺寸和浏览器能力都更敏感；很多项目只在本机调一次。

**How to avoid:**
海报模板尽量只依赖同源字体和图片；在移动端真机与 GitHub Pages 地址上验证；为大图导出预留降级方案。

**Warning signs:**
- 海报里引用了第三方图片/CDN 字体却没有 CORS 保证
- 海报模板尺寸远超手机视口
- 本地成功但预览环境失败

**Phase to address:**
Phase 2

---

### Pitfall 4: 为了简单做成单页应用，牺牲 SEO 和分享落地

**What goes wrong:**
所有测试都挂在一个客户端路由下，搜索引擎只看到同一个页面，朋友圈/小红书分享预览也无法针对具体测试定制。

**Why it happens:**
SPA 最好上手，开发者容易把“静态前端”误解成“单入口应用”。

**How to avoid:**
每个测试使用独立静态路径和 metadata；只把需要互动的区域做 hydration。

**Warning signs:**
- 公开 URL 只有 `/` 加 query/hash
- OG、title、description 始终一样
- 主站和子测试之间缺少清晰路由层次

**Phase to address:**
Phase 1

---

### Pitfall 5: 过度承诺“科学准确”，引发信任问题

**What goes wrong:**
文案把测试包装成心理诊断或绝对判断，一旦结果不准或表达过界，就会伤害信任甚至产生平台风险。

**Why it happens:**
人格测试产品天然容易靠“准到吓人”的语言获传播。

**How to avoid:**
坚持“行为风格 / 倾向 / 场景表现”叙述；在研究和内容设计阶段明确边界，不碰临床式断言。

**Warning signs:**
- 使用“你就是”“你必然”“你本质上有问题”之类绝对表达
- 把娱乐测试包装成专业评估
- 结果文案只追求刺激，不考虑边界

**Phase to address:**
Phase 2

---

### Pitfall 6: 主站太早做，反而浪费时间

**What goes wrong:**
还没跑通第一套模板，就先做导航页、品牌页、SEO 聚合页，最后发现模板层不稳定，需要全部返工。

**Why it happens:**
聚合入口看起来更像“平台”，很容易让人先做门面。

**How to avoid:**
把主站当成“模板复制被验证后”的第二顺位产物；先让 `WBTI` 与第二个测试证明扩张路径成立。

**Warning signs:**
- 主站页面比测试页面做得还完整
- 还没有第二个测试，上来就写站内分类与专题系统
- 导航信息架构反复变动

**Phase to address:**
Phase 3

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| 题库字段先不校验 | 首个测试接入更快 | 后续每加一个测试都可能悄悄破引擎 | Never |
| 结果页先写死 `WBTI` 文案槽位 | 更快上线首测 | 第二个测试时发现模板无法复用 | 仅限非常短暂的原型，不能进入主线 |
| 推荐位手工 hardcode 到组件里 | 马上能看到互荐卡片 | 主站和多个测试上线后维护混乱 | v1 可接受，但要集中在 manifest/config 中 |
| 海报模板直接复用页面 DOM | 开发快 | 样式耦合，页面改版就把海报打坏 | MVP 可接受，但需独立容器和测试用例 |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages | 忘记 repo 子路径下的 `base` | 从一开始就按 `/<repo>/` 场景验证构建与资源路径 |
| 海报导出 | 使用跨域字体/图片导致 canvas taint | 尽量同源资源，必要时验证 CORS 头与降级策略 |
| 分享预览 | 以为 SPA 更新 `<title>` 就够了 | 每个测试页都生成静态 metadata/OG |
| localStorage | 把关键业务逻辑依赖在本地缓存 | 缓存只做增强，不做唯一真相来源 |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 所有页面都全量 hydration | 首屏 JS 大、移动端卡 | 只让答题器和结果组件 hydration | 测试数量增加、内容页增多后立即恶化 |
| 一次性加载整个矩阵所有题库 | 首次进入任一测试都慢 | 每个测试只加载自己的数据包 | 2-3 个测试后就会明显感知 |
| 海报 DOM 过重 | 生成海报时掉帧或失败 | 控制海报层级和图片尺寸，避免复杂滤镜 | 中低端移动端最先出问题 |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| 直接把 JSON 文案注入 HTML | 若未来内容来源扩展，存在 XSS 风险 | 结果文案默认纯文本渲染，富文本需白名单 |
| 在前端嵌入第三方私钥或管理端凭据 | 静态站资源完全暴露 | v1 不接需要保密凭据的服务；后续走 serverless 中转 |
| 用 query 参数直接拼结果文案 | 可能被恶意构造分享链接污染展示 | query 只传 ID/hash，不传可执行内容 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| 题目过长、文案太学术 | 做题疲劳，完播率下降 | 口语化、场景化、短句优先 |
| 只有结果名，没有解释层 | 用户不觉得“准” | 至少提供核心描述 + 维度条 + 场景句 |
| 海报过于营销化 | 用户不愿意保存或转发 | 更像“人格卡片”而不是广告页 |
| 推荐位与当前情绪断裂 | 用户不点下一测 | 按场景和顺序推荐，例如职场测后推恋爱或压力测试 |

## "Looks Done But Isn't" Checklist

- [ ] **Quiz Pack:** 经常缺少 schema 校验 — 验证非法题库能在构建阶段失败
- [ ] **Scoring Engine:** 经常缺少黄金样例 — 验证至少 3-5 组固定答案能稳定命中预期人格
- [ ] **Poster Export:** 经常缺少真机验证 — 验证移动端线上环境也能导出
- [ ] **Static Routes:** 经常缺少 repo `base` 验证 — 验证 GitHub Pages 子路径资源不 404
- [ ] **Result Page:** 经常缺少推荐链路 — 验证测完后至少能进入其他测试
- [ ] **Hidden Persona:** 经常看起来写了却永远不可达 — 验证触发条件确实存在命中路径

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| 数据 contract 崩坏 | HIGH | 回收所有 quiz pack 到统一 schema，逐个修复字段并补测试 |
| 海报导出不稳定 | MEDIUM | 降低模板复杂度，替换跨域资源，补真机回归 |
| SPA 导致 SEO 不可用 | HIGH | 重建静态路由与 metadata 层，通常需要页面结构回退 |
| 结果文案越界 | MEDIUM | 全量审校结果文本，补写内容边界规范 |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 数据 contract 崩坏 | Phase 1 | 非法 quiz pack 构建失败；新增测试不改共享引擎 |
| 结果逻辑不可验证 | Phase 1 | Vitest 覆盖计分与隐藏人格 |
| 海报导出失效 | Phase 2 | 真机/Playwright 覆盖导出流程 |
| SPA 牺牲 SEO | Phase 1 | 每个测试独立静态路由可直接访问 |
| 结果文案越界 | Phase 2 | 内容审核清单通过，文本边界明确 |
| 主站过早建设 | Phase 3 | 路线图先完成两个测试模板化，再聚合主站 |

## Sources

- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages — 静态托管边界
- https://vite.dev/guide/static-deploy.html#github-pages — GitHub Pages 子路径与构建部署注意点
- https://docs.astro.build/en/concepts/islands/ — 减少整页 hydration 的官方模式
- https://docs.astro.build/en/guides/content-collections/ — schema、build-time collections 与静态生成边界
- https://github.com/bubkoo/html-to-image — DOM 转图实现与浏览器限制
- https://help.tryinteract.com/en/articles/9971974-how-to-set-up-personality-quiz-logic-scoring — 人格测试结果逻辑常见做法与准确性注意点
- https://www.16personalities.com/ — 结果包装、准确性话术与内容边界观察

---
*Pitfalls research for: 静态 BTI 矩阵测试平台*
*Researched: 2026-04-13*
