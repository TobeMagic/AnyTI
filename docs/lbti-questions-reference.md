# LBTI 题目题库 · 版本管理参考文档

> 本文档为 LBTI 测试题目的完整结构化参考，用于题目优化迭代时的版本管理和对照查阅。
> **数据源**：`content/tests/lbti/questions.json`（生产数据）
> **开发参考**：`src/lib/content-localization.ts`（英译数据）
> **展示数据**：`src/lib/lbti-showcase.ts`（三面判词）
> **计分报告**：`src/lib/lbti-report.ts`（维度描述）

---

## 一、整体架构

LBTI 当前版本共 **20 道题**，覆盖 **6 个维度**，匹配 **16 种人格角色**，每种人格角色有 **3 种展示面**。

```
维度（L1-L6）
├── attunement   回应敏感
├── signal       表达与脆弱
├── repair       冲突修复
├── boundary    自主边界
├── certainty    承诺清晰
└── retreat     撤离防御
```

---

## 二、维度说明

| 维度 | Key | 左端标签 | 右端标签 | 科学依据 |
|---|---|---|---|---|
| 回应敏感 | `attunement` | 自稳低敏 | 高需回应 | Attachment / Responsiveness |
| 表达与脆弱 | `signal` | 含蓄试探 | 直接给到 | Disclosure / Bids |
| 冲突修复 | `repair` | 静音冷却 | 正面修复 | Repair / Dyadic Coping |
| 自主边界 | `boundary` | 关系融合 | 自主优先 | Autonomy / Boundaries |
| 承诺清晰 | `certainty` | 模糊可活 | 关系要明 | Commitment / Investment |
| 撤离防御 | `retreat` | 留场硬扛 | 先撤自保 | Withdrawal / Defense |

---

## 三、题目完整列表

### Q1
- **ID**：`lbti-q1`
- **题干**：`他/她已读了你三小时没回，你已经开始演第几集了？`
- **选项**：
  - `a` → 权重：att +2, sig -1, cer +1
  - `b` → 权重：sig +1, ret -1
  - `c` → 权重：att -1, bnd +1

---

### Q2
- **ID**：`lbti-q2`
- **题干**：`你给他/她发了一张觉得对方会喜欢的东西，发送键悬了一分钟后，你按了没？`
- **选项**：
  - `a` → 权重：sig +1, att +1
  - `b` → 权重：sig -1, att 0
  - `c` → 权重：att -1, sig -1, ret +1

---

### Q3
- **ID**：`lbti-q3`
- **题干**：`他/她忘记了一件答应过你的事，你第一反应是？`
- **选项**：
  - `a` → 权重：rep 0, att -1
  - `b` → 权重：sig +1, rep +1, att +1
  - `c` → 权重：cer +1, att 0

---

### Q4
- **ID**：`lbti-q4`
- **题干**：`他/她说"我想一个人静静"，你会？`
- **选项**：
  - `a` → 权重：att +1, cer +1
  - `b` → 权重：att +1, bnd -1
  - `c` → 权重：att -1, bnd +1, ret +1

---

### Q5
- **ID**：`lbti-q5`
- **题干**：`你们吵架了，谁都不理谁，他/她突然发来一句废话，你会？`
- **选项**：
  - `a` → 权重：rep +1, sig +1
  - `b` → 权重：ret +1, att -1
  - `c` → 权重：rep -1, att 0

---

### Q6
- **ID**：`lbti-q6`
- **题干**：`他/她情绪不好，你凑上去关心，对方说"我没事"，你会？`
- **选项**：
  - `a` → 权重：rep +1, att +1
  - `b` → 权重：sig -1, att 0
  - `c` → 权重：bnd +1, ret +1

---

### Q7
- **ID**：`lbti-q7`
- **题干**：`他/她突然问你"我们是什么关系"，你会？`
- **选项**：
  - `a` → 权重：cer +2, sig +2
  - `b` → 权重：att +1, bnd +1
  - `c` → 权重：att -1, cer -1

---

### Q8
- **ID**：`lbti-q8`
- **题干**：`你们关系越来越近，但你开始想往后退，为什么？`
- **选项**：
  - `a` → 权重：bnd +2, att -1
  - `b` → 权重：att +1, cer +1
  - `c` → 权重：ret +1, sig -1

---

### Q9
- **ID**：`lbti-q9`
- **题干**：`朋友起哄"你俩好甜"，他/她也在场，你的反应是？`
- **选项**：
  - `a` → 权重：sig -1, att +1
  - `b` → 权重：att 0, sig 0
  - `c` → 权重：sig +1, cer +1

---

### Q10
- **ID**：`lbti-q10`
- **题干**：`他/她越来越黏人，你嘴上说"你怎么这么粘人"，心里其实？`
- **选项**：
  - `a` → 权重：att +1, sig +1, ret -1
  - `b` → 权重：bnd +1, ret +1
  - `c` → 权重：att +1, cer +1

---

## 四、维度权重速查

| 维度 | 覆盖题号 |
|---|---|
| `attunement` | Q1-Q11, Q13-Q17, Q19 |
| `signal` | Q1-Q20 |
| `repair` | Q3, Q5, Q6, Q12-Q16, Q18, Q20 |
| `boundary` | Q1, Q2, Q4-Q10, Q13-Q16, Q18, Q19, Q20 |
| `certainty` | Q1, Q3, Q4, Q7-Q15, Q17-Q20 |
| `retreat` | Q1, Q2, Q4, Q5, Q8, Q10-Q14, Q16, Q17, Q19 |

---

## 五、权重修改规范

- 每次修改权重需在 `CHANGELOG` 区块记录
- 权重修改需同步更新 `lbti-report.ts` 中的描述对应性
- 新增维度需同步更新 `meta.json` 的 `dimensions` 和 `dimensionDetails`

---

## 六、版本记录

| 版本 | 日期 | 改动内容 |
|---|---|---|
| v1.0 | 2026-04-13 | 初始题库，30题/6维度，匹配16种人格 |
| v2.0 | 2026-05-10 | 重写题目，从30题压缩到10题；砍掉背景描述；三方向选项替代三档位；去掉所有括号内提示 |
| v2.1 | 2026-05-10 | 每题题干带"他/她"中性称谓；加入画面感/梗/具体情境；Q1已读不回、Q2发消息犹豫等更有趣场景 |
| v2.2 | 2026-05-10 | 扩题至20题；每题4选项覆盖att×sig四象限；全部用「他/她」中性称谓；修复匹配分布（cosine单位化+hiddenRule收紧） |

---

## 七、相关文件路径

| 文件 | 用途 |
|---|---|
| `content/tests/lbti/questions.json` | 题目生产数据 |
| `content/tests/lbti/personalities.json` | 人格画像生产数据 |
| `content/tests/lbti/meta.json` | 测试元数据、维度定义、文献来源 |
| `src/lib/content-localization.ts` | 英文翻译层 |
| `src/lib/lbti-showcase.ts` | 三面判词（自嘲/动物/甜心） |
| `src/lib/lbti-report.ts` | 维度报告文本（高/中/低） |
| `src/lib/lbti-localization.ts` | 人格标签英译 |
| `docs/lbti-personality-system.md` | 人格体系完整对照表 |
| `docs/lbti-banana-prompts.md` | 角色形象文生图 prompt |
| `docs/lbti-promotion-pack.md` | 推广资料包 |
| `docs/deep_research/processed/lbti_benchmark_notes_2026-04-13.md` | Benchmark 参考 |
| `docs/deep_research/processed/lbti_relationship_science_sources_2026-04-14.md` | 理论文献映射 |
