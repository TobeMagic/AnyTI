# AnyTI · LBTI 恋爱人格测试平台

> 面向移动端传播的恋爱人格测试站点：三面人格展示、可分享结果图、纯静态部署到 GitHub Pages。

[![Deploy AnyTI](https://github.com/TobeMagic/AnyTI/actions/workflows/deploy.yml/badge.svg)](https://github.com/TobeMagic/AnyTI/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-EA7A70?logo=github)](https://tobemagic.github.io/AnyTI/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

中文优先 · [English README](./README.en.md)

快速入口: [在线体验](https://tobemagic.github.io/AnyTI/) · [快速开始](#快速开始) · [页面预览](#页面预览) · [贡献指南](#贡献指南)

## 目录
- [项目定位](#项目定位)
- [在线地址](#在线地址)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [功能亮点](#功能亮点)
- [页面预览](#页面预览)
- [项目结构](#项目结构)
- [角色图片处理](#角色图片处理)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 项目定位
AnyTI 当前聚焦 `LBTI` 单题单版本，核心目标是把“可测、可读、可转发”的测试链路做完整：

- 首页 16 角色矩阵，支持三面切换（自嘲面 / 动物面 / 甜心面）
- 测试页快速进入答题，移动端优先
- 结果页可生成分享图并保存转发
- 全站静态构建，零服务端依赖，直接部署 GitHub Pages

## 在线地址

| 页面 | 地址 |
|---|---|
| 首页 | https://tobemagic.github.io/AnyTI/ |
| 测试页 | https://tobemagic.github.io/AnyTI/test/ |
| 人格图鉴 | https://tobemagic.github.io/AnyTI/types/ |
| 人格详情示例 | https://tobemagic.github.io/AnyTI/types/plan-r/ |
| 仓库 | https://github.com/TobeMagic/AnyTI |

## 快速开始

```bash
git clone https://github.com/TobeMagic/AnyTI.git
cd AnyTI
npm ci
npm run dev
```

浏览器打开 `http://localhost:5173/`（如端口占用，Vite 会自动切换端口）。

## 常用命令

```bash
# 本地开发
npm run dev

# 内容校验 + TS 检查 + 构建
npm run build

# 单元测试
npm run test

# E2E（会先构建）
npm run test:e2e
```

## 功能亮点

- `三面人格系统`: 同一角色支持三种展示面，统一映射逻辑。
- `可分享结果卡`: 结果页可导出海报图，适合社交平台传播。
- `数据驱动题库`: 问题与人格数据拆分在 `content/tests/lbti`，便于迭代。
- `GitHub Pages 自动部署`: 推送 `main` 自动构建并发布。

## 页面预览

### PC 端

| 首页 | 测试页 |
|---|---|
| <img src="./docs/screenshots/home-desktop-vp.png" alt="Home Desktop" width="100%" /> | <img src="./docs/screenshots/test-desktop-vp.png" alt="Test Desktop" width="100%" /> |

| 人格图鉴 | 人格详情 |
|---|---|
| <img src="./docs/screenshots/types-desktop-vp.png" alt="Types Desktop" width="100%" /> | <img src="./docs/screenshots/detail-desktop-vp.png" alt="Type Detail Desktop" width="100%" /> |

### 手机端

| 首页 | 测试页 |
|---|---|
| <img src="./docs/screenshots/home-mobile-vp.png" alt="Home Mobile" width="240" /> | <img src="./docs/screenshots/test-mobile-vp.png" alt="Test Mobile" width="240" /> |

| 人格图鉴 | 人格详情 |
|---|---|
| <img src="./docs/screenshots/types-mobile-vp.png" alt="Types Mobile" width="240" /> | <img src="./docs/screenshots/detail-mobile-vp.png" alt="Type Detail Mobile" width="240" /> |

| 结果页（手机） |
|---|
| <img src="./docs/screenshots/test-result-mobile-vp.png" alt="Test Result Mobile" width="240" /> |

## 项目结构

```text
AnyTI/
├── content/                     # 测试数据（题目/人格/元信息）
│   └── tests/lbti/
├── public/images/lbti/          # 前端角色图资源（部署静态目录）
├── src/
│   ├── components/              # 核心组件（答题、结果、导航等）
│   ├── pages/                   # 页面级组件
│   ├── lib/                     # 计分、路由、海报生成、展示映射
│   └── styles/                  # 全局样式与页面样式
├── scripts/                     # 数据校验、角色图裁剪脚本
└── .github/workflows/deploy.yml # Pages 自动部署
```

## 角色图片处理

角色裁剪脚本:

- `scripts/crop_lbti_individual.py`

当前脚本会把 `docs` 下的源图切分成单角色 PNG，并输出到：

- `public/images/lbti/individual/self`
- `public/images/lbti/individual/animal`
- `public/images/lbti/individual/sweet`

## 贡献指南

1. 新建分支并提交改动（保持小步提交）。
2. 本地通过 `npm run build`（至少保证可构建）。
3. 涉及交互/视觉调整时，附上 PC 与手机截图。
4. 提交 PR，说明改动范围、风险点与验证结果。

## 许可证

当前仓库尚未附带明确的开源许可证文件（`LICENSE`）。如需对外开源，请先补充许可证后再分发使用。
