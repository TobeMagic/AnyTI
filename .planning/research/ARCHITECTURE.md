# Architecture Research

**Domain:** Static BTI quiz matrix platform
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```text
┌───────────────────────────────────────────────────────────────┐
│                    Entry / SEO Layer                         │
├───────────────────────────────────────────────────────────────┤
│  /index.html   /wbti/   /lbti/   /sbti/   /types/...        │
│  real href links + unique titles + canonical metadata       │
└───────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────────┐
│                    Shared Runtime Layer                      │
├───────────────────────────────────────────────────────────────┤
│  manifest loader  │  schema validation  │  analytics hooks  │
│  quiz runner      │  scoring engine     │  result resolver  │
│  poster composer  │  UI primitives      │  recommendation   │
└───────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────────┐
│                      Data Pack Layer                         │
├───────────────────────────────────────────────────────────────┤
│  /data/wbti/questions.json                                   │
│  /data/wbti/personalities.json                               │
│  /data/wbti/meta.json                                        │
│  /data/lbti/...                                              │
└───────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────────┐
│                    Export / Delivery Layer                   │
├───────────────────────────────────────────────────────────────┤
│  Canvas image blob  │  QR image  │  static assets  │ Pages  │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Quiz Manifest | 描述有哪些测试、顺序、状态、推荐关系 | `manifest.json` 或 `manifest.ts` |
| Data Loader | 读取每个测试的数据包并做 schema 校验 | `fetch` + Zod |
| Quiz Runner | 管理当前题目、答案、进度、回退、完成态 | 单页控制器 / state module |
| Scoring Engine | 累加维度分数、归一化、计算余弦相似度、处理隐藏人格 | 纯函数模块 |
| Result Resolver | 产出最终人格、近邻人格、维度解释素材 | shared/result module |
| Poster Composer | 直接在 Canvas 上绘制背景、标题、二维码、文案 | Canvas 2D API |
| Recommendation Module | 根据当前测试和结果推荐下一测 | rules-based manifest lookup |
| SEO Shell | 为每个入口页提供真实 URL、title、description、canonical | 各 HTML 入口 + build config |

## Recommended Project Structure

```text
index.html                     # 主站入口（后续再启用）
wbti/index.html                # WBTI 测试入口
lbti/index.html                # LBTI 测试入口
sbti/index.html                # 其他测试入口
shared/
├── core/
│   ├── schema.ts              # 数据 schema
│   ├── loader.ts              # 数据加载
│   ├── scoring.ts             # 维度计分 + 相似度
│   ├── hidden-types.ts        # 隐藏人格规则
│   └── recommend.ts           # 矩阵推荐逻辑
├── ui/
│   ├── quiz-flow.ts           # 答题流程 UI
│   ├── result-view.ts         # 结果页渲染
│   └── progress.ts            # 进度与导航
├── poster/
│   ├── compose.ts             # Canvas 绘制
│   └── assets.ts              # 海报资源加载
├── seo/
│   └── meta.ts                # title / canonical / structured meta
└── styles/
    └── tokens.css             # 共享设计变量
data/
├── manifest.json
├── wbti/
│   ├── questions.json
│   ├── personalities.json
│   └── meta.json
└── lbti/
    └── ...
scripts/
└── validate-data.mts          # 构建前校验所有数据包
```

### Structure Rationale

- **`shared/`**: 和用户提出的“通用引擎”方向一致，所有共用逻辑都放在这里，避免每个测试目录复制脚本。
- **`data/`**: 把“内容”与“引擎”彻底分开；未来新增测试基本等于新增一个数据包目录。
- **各测试独立 HTML 目录**: 与矩阵入口、真实 URL、GitHub Pages 路径结构、后续 SEO 扩张保持一致。

## Architectural Patterns

### Pattern 1: Data Pack Contract

**What:** 每个测试都只提供固定结构的数据包，运行时按同一契约读取。  
**When to use:** 从第一个测试开始就应该使用。  
**Trade-offs:** 前期多一点 schema 设计成本，但后期复制测试几乎没有结构债务。

**Example:**
```typescript
type QuizPack = {
  meta: { id: string; title: string; dimensions: string[] };
  questions: Array<{
    id: string;
    prompt: string;
    options: Array<{ label: string; weights: Record<string, number> }>;
  }>;
  personalities: Array<{
    id: string;
    label: string;
    vector: Record<string, number>;
    hidden?: boolean;
  }>;
};
```

### Pattern 2: Deterministic Scoring Pipeline

**What:** 从答案输入到人格输出走一条纯函数流水线。  
**When to use:** 所有结果计算都应走这一条路径。  
**Trade-offs:** 前期要把隐藏人格和边缘条件写清楚，但测试与回归最容易做。

**Example:**
```typescript
const scores = accumulateScores(answers, questions);
const normalized = normalizeScores(scores);
const match = resolveBestMatch(normalized, personalities);
const finalType = applyHiddenTypeRules(match, normalized, answers);
```

### Pattern 3: Static MPA Shell

**What:** 每个测试/内容页拥有真实 HTML 入口，而不是被单一 SPA 控制。  
**When to use:** 只要项目把 SEO 和可分享 URL 当成资产，就应该用。  
**Trade-offs:** 入口页数量变多，但部署和搜索引擎可见性更稳定。

## Data Flow

### Request Flow

```text
[User opens /wbti/]
    ↓
[Load manifest + wbti meta]
    ↓
[Load questions/personality pack]
    ↓
[Validate schema]
    ↓
[Render quiz flow]
    ↓
[Collect answers]
    ↓
[Run scoring + hidden rules]
    ↓
[Render result]
    ↓
[Compose poster + recommendations]
```

### State Management

```text
[Session State]
    ↓
[Quiz UI] ←→ [Answer Events] → [Scoring State]
    ↓
[Result View] ←→ [Poster Composer / Recommend Module]
```

### Key Data Flows

1. **Quiz Load Flow:** manifest → 当前测试 meta → questions/personality data → schema validation → UI。
2. **Result Flow:** answers → raw scores → normalized vector → cosine similarity → hidden type override → result payload。
3. **Poster Flow:** result payload → preload assets/fonts → Canvas draw → `toBlob()` → save/share。

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | GitHub Pages + 静态 JSON 足够；优先保证结构稳定与传播闭环。 |
| 1k-100k users | 优化图片/字体、缓存策略、埋点、结果页资源拆分；仍无需自建后端。 |
| 100k+ users | 如果矩阵页数和 SEO 内容激增，再考虑更强的内容构建层或迁移到更灵活的静态平台。 |

### Scaling Priorities

1. **First bottleneck:** 内容与引擎耦合导致复制速度下降 — 通过严格数据契约解决。
2. **Second bottleneck:** 结果页与海报资源过重导致移动端加载慢 — 通过按测试分包与资源压缩解决。

## Anti-Patterns

### Anti-Pattern 1: One-Off Quiz Code

**What people do:** 先把 `WBTI` 直接硬编码，等第二个测试再“抽公共层”。  
**Why it's wrong:** 第二个测试上线时会发现命名、字段、状态、结果页逻辑全部缠在一起。  
**Do this instead:** 从第一个测试起就按共享引擎 + 数据包架构落。

### Anti-Pattern 2: Hash Route Everything

**What people do:** 一个 `index.html` 加 hash-router 装下所有测试。  
**Why it's wrong:** 搜索可发现性差，路径管理混乱，矩阵入口难以自然分发。  
**Do this instead:** 保留真实目录和 HTML 入口。

### Anti-Pattern 3: Query-Only Result URLs as SEO Strategy

**What people do:** 用 `?result=xxx` 作为唯一结果页。  
**Why it's wrong:** 个性化结果页未必适合索引，而且会造成 canonical 混乱。  
**Do this instead:** 动态个性化结果页用于用户体验，静态人格详情页用于索引资产。

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Actions | build → upload `dist` → deploy Pages | 官方推荐路径，最贴合当前约束。 |
| Analytics provider (optional) | 页面级脚本 + event hooks | 先保持可插拔，别在 v1 锁死。 |
| QR link target | poster composer 内生成 | 需统一主域名 / repo base path，避免二维码指向错误路径。 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `data/` ↔ `shared/core` | typed JSON contract | 任何测试都必须服从同一 schema。 |
| `shared/core` ↔ `shared/ui` | pure data payloads | UI 不应知道底层计分细节。 |
| `shared/result` ↔ `shared/poster` | normalized result payload | 海报层只消费最终结果，不重新算分。 |

## Sources

- Vite multi-page build docs: https://vite.dev/guide/build.html
- Vite static deployment docs: https://vite.dev/guide/static-deploy.html
- GitHub Pages docs: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Google Search Central JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google URL structure guidance: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
- MDN `drawImage()`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
- MDN `toBlob()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob

---
*Architecture research for: Static BTI quiz matrix platform*
*Researched: 2026-04-13*
