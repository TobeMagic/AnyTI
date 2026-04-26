# AnyTI · LBTI Relationship Personality Platform

<p align="center">
  <img src="./docs/logo.png" alt="AnyTI LBTI Logo" width="96" />
</p>

> A mobile-first, shareable relationship personality test site with static deployment on GitHub Pages.

[![Deploy AnyTI](https://github.com/TobeMagic/AnyTI/actions/workflows/deploy.yml/badge.svg)](https://github.com/TobeMagic/AnyTI/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-EA7A70?logo=github)](https://tobemagic.github.io/AnyTI/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

Primary document: [中文 README](./README.md)

Quick links: [Live Site](https://tobemagic.github.io/AnyTI/) · [Quick Start](#quick-start) · [Screenshots](#screenshots)

## Table of Contents
- [Overview](#overview)
- [Online URLs](#online-urls)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [Highlights](#highlights)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Portrait Pipeline](#portrait-pipeline)
- [Contributing](#contributing)
- [License](#license)

## Overview
AnyTI currently focuses on one polished channel: `LBTI`.

- 16-character matrix on homepage with 3 synchronized faces
- Mobile-friendly test flow
- Result poster generation for social sharing
- Fully static build and GitHub Pages deployment

## Online URLs

| Page | URL |
|---|---|
| Home | https://tobemagic.github.io/AnyTI/ |
| Test | https://tobemagic.github.io/AnyTI/test/ |
| Types | https://tobemagic.github.io/AnyTI/types/ |
| Type Detail (example) | https://tobemagic.github.io/AnyTI/types/plan-r/ |
| Repository | https://github.com/TobeMagic/AnyTI |

## Quick Start

```bash
git clone https://github.com/TobeMagic/AnyTI.git
cd AnyTI
npm ci
npm run dev
```

Open `http://localhost:5173/`.

## Commands

```bash
npm run dev         # local dev
npm run build       # validate + typecheck + build
npm run test        # unit tests
npm run test:e2e    # playwright tests
```

## Highlights

- `Three-face character system`: self-mock, animal, sweet
- `Shareable result card`: save and repost-ready output
- `Data-driven content`: `questions.json` + `personalities.json`
- `Auto deployment`: push to `main` and publish via GitHub Actions

## Screenshots

### Desktop

| Home | Test |
|---|---|
| <img src="./docs/screenshots/home-desktop-vp.png" alt="Home Desktop" width="100%" /> | <img src="./docs/screenshots/test-desktop-vp.png" alt="Test Desktop" width="100%" /> |

| Types | Type Detail |
|---|---|
| <img src="./docs/screenshots/types-desktop-vp.png" alt="Types Desktop" width="100%" /> | <img src="./docs/screenshots/detail-desktop-vp.png" alt="Type Detail Desktop" width="100%" /> |

### Mobile

| Home | Test |
|---|---|
| <img src="./docs/screenshots/home-mobile-vp.png" alt="Home Mobile" width="240" /> | <img src="./docs/screenshots/test-mobile-vp.png" alt="Test Mobile" width="240" /> |

| Types | Type Detail |
|---|---|
| <img src="./docs/screenshots/types-mobile-vp.png" alt="Types Mobile" width="240" /> | <img src="./docs/screenshots/detail-mobile-vp.png" alt="Type Detail Mobile" width="240" /> |

| Test Result (mobile) |
|---|
| <img src="./docs/screenshots/test-result-mobile-vp.png" alt="Test Result Mobile" width="240" /> |

## Project Structure

```text
AnyTI/
├── content/tests/lbti/          # questions, personalities, metadata
├── public/images/lbti/          # runtime portrait assets
├── src/components/              # UI components
├── src/pages/                   # page-level components
├── src/lib/                     # scoring, routes, poster generation
├── src/styles/                  # global and page styles
├── scripts/                     # validation and crop scripts
└── .github/workflows/deploy.yml # GitHub Pages workflow
```

## Portrait Pipeline

Script:

- `scripts/crop_lbti_individual.py`

Outputs:

- `public/images/lbti/individual/self`
- `public/images/lbti/individual/animal`
- `public/images/lbti/individual/sweet`

## Contributing

1. Create a branch with focused commits.
2. Run `npm run build` before opening a PR.
3. Attach desktop + mobile screenshots for UI changes.
4. Describe scope, risk, and validation in PR notes.

## License

No explicit open-source license file is present yet (`LICENSE` not found). Add one before public redistribution.
