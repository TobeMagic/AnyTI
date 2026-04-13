# Architecture Research

**Domain:** 静态 BTI 矩阵测试平台
**Researched:** 2026-04-13
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                         Static Route / SEO Layer                          │
├────────────────────────────────────────────────────────────────────────────┤
│  Main Nav Page   Quiz Landing Page   Result Route Shell   SEO Metadata    │
│      /               /wbti/              /wbti/result/    OG / sitemap    │
└───────────────┬───────────────────────┬────────────────────────────────────┘
                │ build-time props       │ static HTML + selective hydration
┌───────────────▼───────────────────────▼────────────────────────────────────┐
│                      Interactive Quiz Experience Layer                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Quiz Runner     Score State     Result Renderer     Poster Composer        │
│ React island    local state     React island        DOM -> image export    │
└───────────────┬───────────────────────┬────────────────────────────────────┘
                │                       │
┌───────────────▼───────────────────────▼────────────────────────────────────┐
│                          Shared Domain Engine Layer                        │
├────────────────────────────────────────────────────────────────────────────┤
│ Schema Validator   Scoring Kernel   Similarity Matcher   Recommendation    │
│ quiz pack checks   weighted dims    cosine similarity    static rule set   │
└───────────────┬───────────────────────┬────────────────────────────────────┘
                │ build-time load       │ runtime evaluation
┌───────────────▼───────────────────────▼────────────────────────────────────┐
│                           Quiz Content/Data Layer                          │
├────────────────────────────────────────────────────────────────────────────┤
│ quizzes/wbti/meta.json                                                  │
│ quizzes/wbti/questions.json                                             │
│ quizzes/wbti/personalities.json                                         │
│ quizzes/lbti/...                                                        │
│ quiz-manifest / category tags / season tags                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Quiz content pack | 定义某个测试的题目、人格、维度、主题元信息 | JSON 数据文件 + Zod schema 校验 |
| Shared scoring kernel | 根据答案选项累加连续维度得分，并输出统一向量 | 纯 TypeScript 函数，不依赖 UI |
| Result matcher | 把用户向量与人格向量做余弦相似度或其他规则匹配 | 纯 TypeScript 域服务 |
| Quiz runner UI | 展示题目、收集答案、控制进度与回退 | React island / 本地状态 |
| Result renderer | 展示主人格、维度谱、相近人格、推荐测试 | React island，可接受统一 result model |
| Poster composer | 把结果卡片渲染为适合保存和分享的图像 | DOM 模板 + `html-to-image` |
| Route shell | 负责静态 URL、metadata、build-time page generation | Astro page / layout |
| Quiz manifest | 统一列出测试 slug、标签、优先级、上架状态 | build-time 集合/静态配置 |

## Recommended Project Structure

```text
src/
├── content/
│   ├── quizzes/                 # 每个测试的数据包
│   │   ├── wbti/
│   │   │   ├── meta.json        # 测试标题、描述、标签、分享信息
│   │   │   ├── questions.json   # 题目与选项权重
│   │   │   └── personalities.json
│   │   └── lbti/
│   └── content.config.ts        # collection schema / Zod 校验
├── lib/
│   ├── quiz-data/               # quiz pack loader / adapters
│   ├── scoring/                 # 维度模型、积分与相似度
│   ├── recommendations/         # 静态推荐规则
│   ├── poster/                  # 海报导出逻辑
│   └── seo/                     # OG/meta 组装
├── components/
│   ├── quiz/                    # 题目卡、进度条、答题器
│   ├── result/                  # 结果头图、维度条、推荐卡
│   └── poster/                  # 海报画布/DOM 模板
├── layouts/                     # 主布局、测试布局
├── pages/
│   ├── index.astro              # 主站导航（后续）
│   ├── [quiz]/index.astro       # 各测试落地页
│   └── [quiz]/result.astro      # 结果路由壳
├── styles/                      # 全局 token、主题变量
└── utils/                       # 小型通用函数

public/
├── icons/
├── images/
└── fonts/

tests/
├── unit/
│   ├── scoring/
│   └── data-contracts/
└── e2e/
    ├── wbti.spec.ts
    └── pages-base-path.spec.ts
```

### Structure Rationale

- **`content/quizzes/`:** 让“新增一个测试”更像“新增一份内容”，不是复制整个应用。
- **`lib/scoring/`:** 计分和匹配是平台资产，必须与 UI 解耦。
- **`components/quiz` 与 `components/result`:** 把“交互壳”和“领域逻辑”分开，未来换视觉不应影响结果逻辑。
- **`pages/[quiz]/...`:** 保证公开 URL 天然就是 `/wbti/`、`/lbti/`，满足静态 SEO 与分享落地页需求。

## Architectural Patterns

### Pattern 1: Schema-Validated Quiz Pack

**What:** 每个测试只提供一组标准化数据包，先校验结构，再进入构建或运行。
**When to use:** 任何新增测试、修改题库、调整人格向量时。
**Trade-offs:** 初期写 schema 会略慢，但能显著减少矩阵复制时的低级错误。

**Example:**
```typescript
type QuizPack = {
  slug: string;
  dimensions: string[];
  questions: Question[];
  personalities: PersonalityProfile[];
};

export function assertQuizPack(pack: QuizPack) {
  if (!pack.questions.length) throw new Error("questions required");
  if (!pack.personalities.length) throw new Error("personalities required");
}
```

### Pattern 2: Pure Scoring Kernel

**What:** 把答题到结果的核心算法做成无 UI 副作用的纯函数。
**When to use:** 所有计分、结果匹配、隐藏人格判定。
**Trade-offs:** 需要多写一层 adapter，但极大提升可测试性和复用性。

**Example:**
```typescript
export function resolveResult(
  answers: AnswerSelection[],
  pack: QuizPack,
): MatchResult {
  const vector = accumulateDimensionScores(answers, pack.questions);
  return findClosestProfile(vector, pack.personalities);
}
```

### Pattern 3: Static Shell + Interactive Island

**What:** 页面主体和 metadata 在构建期生成，只有答题器和结果面板 hydration。
**When to use:** 需要 SEO、静态托管，同时仍要有富交互。
**Trade-offs:** 架构略复杂于纯 SPA，但明显更适合本项目的传播与搜索场景。

**Example:**
```typescript
---
import QuizPage from "../components/quiz/QuizPage.tsx";
const pack = Astro.props.pack;
---

<BaseLayout title={pack.meta.title}>
  <QuizPage client:load pack={pack} />
</BaseLayout>
```

### Pattern 4: Recommendation Manifest

**What:** 不做实时推荐系统，而是用静态规则决定“下一测什么”。
**When to use:** 结果页推荐、主站聚合、节日专题编排。
**Trade-offs:** 不够智能，但极其稳定、便于运营控制，也符合静态站约束。

## Data Flow

### Build Flow

```text
quiz JSON/meta
    ↓
Zod schema validation
    ↓
Astro content collection / loader
    ↓
getStaticPaths() 生成 /[quiz]/ 路由
    ↓
静态 HTML + metadata + hydrated island 挂载点
    ↓
GitHub Actions build
    ↓
GitHub Pages deploy
```

### Runtime Flow

```text
用户进入 /wbti/
    ↓
Quiz runner 加载该 quiz pack
    ↓
用户逐题作答，更新本地 answer state
    ↓
Scoring kernel 计算维度向量
    ↓
Result matcher 输出主人格 + 相近人格 + 维度条
    ↓
Result renderer 展示结果与相关推荐
    ↓
Poster composer 生成 PNG / JPEG
```

### Key Data Flows

1. **Quiz Pack Flow:** `meta/questions/personalities` → schema 校验 → route props → quiz runner
2. **Scoring Flow:** answer selections → dimension accumulator → cosine matcher → result model
3. **Poster Flow:** result model → poster DOM → image export → download/share
4. **Recommendation Flow:** current quiz slug + category tags → static rules → other quiz cards

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | 当前方案足够，优先保证 schema、路径、海报导出、移动端体验 |
| 1k-100k users | 优化图片与字体资源、细化 quiz manifest、引入轻量统计脚本、控制 hydration 范围 |
| 100k+ users | 重点不是拆后端，而是静态资产分发、构建时间、SEO 内容层和预生成素材；GitHub Pages 不够时再迁静态 CDN |

### Scaling Priorities

1. **First bottleneck:** 内容与结果逻辑不统一，而不是服务器性能
2. **Second bottleneck:** 前端资源重量与海报导出稳定性，而不是数据库读写

## Anti-Patterns

### Anti-Pattern 1: Scoring Logic Inside UI Components

**What people do:** 在 React 组件里直接写人格映射和分数累加。
**Why it's wrong:** 每做一个新测试就会复制一坨 if/else，最终无法验证结果是否一致。
**Do this instead:** 让组件只负责展示和事件收集，所有结果解析交给域层纯函数。

### Anti-Pattern 2: Single SPA Route for All Quizzes

**What people do:** 整站只有一个客户端入口，通过 query 参数切换不同测试。
**Why it's wrong:** SEO、社交预览、分享落地页和 GitHub Pages 路径调试都会变差。
**Do this instead:** 每个 quiz 生成独立静态路由，交互部分再局部 hydration。

### Anti-Pattern 3: Per-Quiz Code Fork

**What people do:** `wbti` 一套页面，`lbti` 再复制一套稍微改改。
**Why it's wrong:** 这直接违反“引擎共用，数据分离”，后续维护成本线性爆炸。
**Do this instead:** 共享引擎 + 数据包 + 可覆盖主题 token。

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | GitHub Actions 构建后发布 `dist/` | 注意 repo 子路径场景下的 `base` 配置 |
| Browser storage | `localStorage` 存答题进度或最近结果 | 只存非敏感数据，避免把业务依赖建立在浏览器存储上 |
| DOM-to-image library | 在结果页点击后导出海报 | 图片、字体尽量同源，避免 canvas taint |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `content` ↔ `lib/quiz-data` | typed loader | 不允许 UI 直接读取裸 JSON |
| `lib/scoring` ↔ `components/result` | domain model object | 结果 UI 只消费统一的 `MatchResult` |
| `lib/recommendations` ↔ `pages/result` | static function / manifest lookup | 不做运行时网络请求 |

## Sources

- https://docs.astro.build/en/concepts/islands/ — 确认 islands architecture 的静态 + 交互模式
- https://docs.astro.build/en/guides/content-collections/ — 确认 collection、schema、build-time data flow
- https://docs.astro.build/en/reference/routing-reference/#getstaticpaths — 确认静态批量路由生成方式
- https://docs.astro.build/en/guides/deploy/github/ — 确认 Astro + GitHub Pages 部署建议
- https://vite.dev/guide/static-deploy.html#github-pages — 确认 GitHub Pages 构建部署与 `base` 约束
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages — 确认 GitHub Pages 的静态托管边界
- https://github.com/bubkoo/html-to-image — 确认结果海报导出可基于 DOM -> image 实现

---
*Architecture research for: 静态 BTI 矩阵测试平台*
*Researched: 2026-04-13*
