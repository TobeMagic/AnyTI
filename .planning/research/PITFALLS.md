# Pitfalls Research

**Domain:** Static BTI quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: 用单测试思维写第一版

**What goes wrong:**
`WBTI` 先写得很快，但代码、文案、字段名都绑死在第一个测试上，第二个测试开始就必须重构。

**Why it happens:**
团队会以为“先跑通一个再说”，却没有把“跑通模板”与“跑通产品”区分开。

**How to avoid:**
第一天就把数据契约、共享模块边界、推荐 manifest 设计出来。首发只有一个测试，但架构必须是矩阵级。

**Warning signs:**
- `wbti` 专属文案散落在 shared 逻辑里
- 结果页字段名只适合职场，不适合其他测试
- 新增测试需要复制并改 JS，而不是只换 JSON

**Phase to address:**
Phase 1

---

### Pitfall 2: 把 SEO 资产放进 hash 路由或按钮逻辑里

**What goes wrong:**
测试入口、人格详情、推荐跳转都只有前端状态，没有真实可抓取 URL，搜索资产无法沉淀。

**Why it happens:**
前端很容易默认做成 SPA，但 Google 官方已经明确强调可抓取链接要依赖真正的 `<a href>` 和唯一 URL。

**How to avoid:**
从架构上采用 MPA；测试入口、主站入口、未来人格页都给真实路径；个性化结果页和可索引内容页分开处理。

**Warning signs:**
- 页面切换只靠 `onclick`
- URL 主要是 `#/...`
- 结果页没有 title/canonical 设计

**Phase to address:**
Phase 1

---

### Pitfall 3: 结果看起来都差不多

**What goes wrong:**
用户做完 24 种人格测试，却发现结果描述、海报、维度解释都高度同质，分享欲会迅速归零。

**Why it happens:**
题目权重、人格向量、文案模板没有被系统调优；所有分数都挤在中间区间。

**How to avoid:**
对 `WBTI` 先做小规模人工验算与样本走查；确保每类人格都有明显行为特征、维度差异和语气差异；隐藏人格单独测试。

**Warning signs:**
- 多种人格共享大量相同句子
- 用户经常说“都差不多”
- 近邻类型切换过于频繁或完全无差异

**Phase to address:**
Phase 2

---

### Pitfall 4: 海报导出依赖脆弱的截图链路

**What goes wrong:**
导出的海报字体错位、图片丢失、跨域失败、移动端保存模糊，核心传播动作在真实设备上不稳定。

**Why it happens:**
为了快，直接把 DOM 截图当成生产方案，而不是把海报当成真正的图像生成能力。

**How to avoid:**
直接在 Canvas 里绘制最终海报；资源、二维码、背景图和文本都走同一导出链；对移动端和高 DPR 机型单独验证。

**Warning signs:**
- 不同手机导出的排版不一致
- 图片经常空白或被裁切
- 保存图尺寸和预览不一致

**Phase to address:**
Phase 3

---

### Pitfall 5: 过度宣称“科学准确”

**What goes wrong:**
产品一边追求传播梗感，一边把自己包装成严谨心理诊断，容易引发信任反噬。

**Why it happens:**
人格测试天然吸引“准确性”诉求，但当前产品本质上是 research-inspired 的大众化行为测试，不是临床测量工具。

**How to avoid:**
保留方法说明、理论来源和维度设计逻辑，但明确非临床、娱乐/启发用途；把重点放在“可解释”和“有场景感”，而不是“绝对准确”。

**Warning signs:**
- 文案频繁出现“精准诊断”“绝对定义你”
- 没有免责声明或方法页
- 用户开始质疑“科学依据在哪里”

**Phase to address:**
Phase 2

---

### Pitfall 6: GitHub Pages 部署路径与缓存处理不当

**What goes wrong:**
上线后资源 404、二维码指向错路径、旧页面引用新旧 chunk 冲突，用户打开结果页直接白屏。

**Why it happens:**
GitHub Pages 的 repo base path、Vite 的 `base` 设置、以及新旧构建切换时的资源缓存都容易被忽略。

**How to avoid:**
在仓库名路径和自定义域两种场景下都预留清晰配置；上线前总是用生产构建预览；必要时处理 `vite:preloadError`。

**Warning signs:**
- 本地没问题，部署后资源路径错
- 新版本上线后老链接白屏
- 海报二维码在仓库路径下打不开

**Phase to address:**
Phase 1

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| 把 `WBTI` 文案直接写进 JS | 开发很快 | 第二个测试开始全面复制黏贴 | Never |
| 海报先用 DOM 截图 | Demo 快 | 真实设备导出不稳定 | 仅限非常短暂原型，不可进入 v1 |
| 不给数据包做 schema 校验 | 省时间 | 后续复制测试时故障难查 | Never |
| 不写计分测试 | 初期看似节省时间 | 每次改题或改人格向量都可能 silently break | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages | 忘记为 repo 部署设置正确 `base` | 根据自定义域或 `<REPO>` 路径明确配置 `vite.config` |
| QR code | 二维码写死本地 URL 或错误 base path | 统一从环境/配置生成公开 URL |
| Analytics | 一开始把埋点写死在 UI 组件里 | 使用轻量 hooks 或 event dispatcher，保持可替换 |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 一次加载所有测试数据 | 首屏慢，移动端卡顿 | 只按当前测试加载数据包 | 2-3 个测试后就会明显恶化 |
| 海报资源过重 | 结果页导出慢、图片模糊 | 控制背景图尺寸、预加载字体、按 DPR 输出 | 分享导出阶段最明显 |
| 动画和装饰优先于流程效率 | 答题节奏拖沓，完成率下降 | 先保留高响应和清晰点击区，再加装饰 | 第一个真实流量波就能看到掉队 |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| 用 query string 保存过多用户状态 | 链接污染、结果 URL 混乱、潜在隐私暴露 | 只在 URL 放必要标识，其他状态保留在内存或短期 localStorage |
| 直接渲染不受控 HTML 文案 | XSS 风险，尤其未来若内容来源扩展 | 默认纯文本渲染；若需要富文本，限定白名单语法 |
| 随意接第三方分享/广告脚本 | 性能和隐私不可控 | v1 尽量减少第三方脚本，尤其在结果页 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| 题目太长、节奏太慢 | 用户中途退出，完成率低 | 控制题量和单题认知负担，给明确进度感 |
| 结果命名太学术或太像 MBTI 翻版 | 没有记忆点，也没有分享梗 | 保留行为识别度，用更鲜明的人格外号 |
| 结果后只给“再测一次” | 流量外流，没有矩阵循环 | 结果后立刻给相关下一测建议 |

## "Looks Done But Isn't" Checklist

- [ ] **答题流程：** 常见缺口是没有生产环境路径验证 — 检查 GitHub Pages 上是否能从独立入口正常完成一次测试。
- [ ] **结果页：** 常见缺口是只有“你是什么”，没有“为什么是你” — 检查维度解释和近邻差异是否存在。
- [ ] **海报导出：** 常见缺口是预览能看、保存出来糊或错位 — 检查真实下载文件。
- [ ] **矩阵结构：** 常见缺口是只有文档里可扩展，代码里不可扩展 — 检查新增测试是否真能只加数据包。
- [ ] **SEO：** 常见缺口是页面可访问但 title/canonical/真实链接缺失 — 检查入口页与未来类型页策略。

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| 单测试思维代码 | HIGH | 抽离 shared 模块、重做数据契约、补回归测试 |
| SEO 路径错误 | MEDIUM | 补真实入口页、修 canonical、修内链结构、重新部署 |
| 海报导出不稳定 | MEDIUM | 改为 Canvas 原生绘制链、重测字体与资源加载 |
| 结果差异不足 | MEDIUM | 回调题目权重、人格向量、重写结果文案 |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 单测试思维代码 | Phase 1 | 新增一个空白测试目录时无需复制业务逻辑 |
| SEO 路由错误 | Phase 1 | 所有入口页都可通过真实 URL 访问和跳转 |
| 结果差异不足 | Phase 2 | 不同样本用户拿到的结果和文案明显不同 |
| 海报链路脆弱 | Phase 3 | 真实手机上能稳定导出清晰海报 |
| 过度科学化宣称 | Phase 2 | 页面存在方法说明与非临床免责声明 |

## Sources

- Google Search Central JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google URL structure guidance: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
- Vite build guide (`vite:preloadError`, MPA): https://vite.dev/guide/build.html
- Vite static deploy guide (GitHub Pages base / Actions): https://vite.dev/guide/static-deploy.html
- GitHub Pages docs: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- MDN Canvas APIs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
- MDN Canvas export: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- Truity technical documentation example: https://www.truity.com/sites/default/files/uploads/BigFiveTechnicalDocument.pdf

---
*Pitfalls research for: Static BTI quiz matrix platform*
*Researched: 2026-04-13*
