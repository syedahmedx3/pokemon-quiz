# 🎮 Pokémon Knowledge Test

### Professor Oak's Academy — React 18 · Vite 5 · PokéAPI · Apple Design System · i18n (EN/AR)

> **One-liner:** Pokémon quiz app with silhouette, type & mixed modes, countdown timer, streak scoring and S–D grading. Apple-inspired design system, fully responsive, Arabic / RTL ready.

---

## ✨ Features

| Feature                  | Details                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **3 Quiz Modes**         | Who's That Pokémon (silhouette), Type Expert, Mixed                                   |
| **3 Difficulty Levels**  | Rookie (Gen I · 20s), Trainer (Gen I–III · 15s), Champion (All · 10s)                 |
| **Countdown Timer**      | Per-question bar — green → amber → red                                                |
| **Lives System**         | 3 hearts; game ends early if all lost                                                 |
| **Streak Multiplier**    | Correct run boosts score up to ×1.6                                                   |
| **Time Bonus**           | Faster answers earn up to +50 pts                                                     |
| **Question Pre-loading** | Next question fetched in background for instant transitions                           |
| **API Cache**            | Each Pokémon fetched once per session                                                 |
| **Base Stats Panel**     | Expandable HP/ATK/DEF/SPD bars on silhouette reveal                                   |
| **S–D Grading**          | Letter grade + flavour text per round                                                 |
| **Per-question Recap**   | Full breakdown with sprites, types, points, wrong guesses                             |
| **Personal Best**        | Session high score on home screen                                                     |
| **Apple Design System**  | Full-bleed tiles, single Action Blue accent, SF-proxy typography, product shadow only |
| **i18n (EN / AR)**       | Complete English & Arabic string map; one-click toggle                                |
| **RTL Support**          | `dir="rtl"` on root, CSS logical properties, Arabic (Noto Sans Arabic) font           |
| **Fully Responsive**     | 419px → 1440px+; Apple breakpoint spec                                                |

---

## 🗂 Project Structure

```
pokemon-quiz/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── public/
│   └── pokeball.svg
└── src/
    ├── main.jsx                      # React DOM root
    ├── App.jsx                       # Screen router + lang state + dir attribute
    ├── i18n/
    │   └── strings.js                # EN + AR full translation map
    ├── styles/
    │   └── global.css                # Apple design tokens → CSS variables + all styles
    ├── constants/
    │   └── config.js                 # TOTAL_Q, DIFF_CFG, TCOLOR, APPLE tokens
    ├── utils/
    │   ├── helpers.js                # rnd, shuf, cap, pad3, hexRgb
    │   ├── api.js                    # fetchPk() with in-memory cache
    │   └── game.js                   # buildQ, preloadQ, calcPts, getGrade, resolveMode
    └── components/
        ├── GlobalNav.jsx             # 44px sticky black nav + lang toggle
        ├── Home.jsx                  # Apple product-tile home screen
        ├── Quiz.jsx                  # Frosted sub-nav + timer bar + question tiles
        ├── Results.jsx               # Grade hero tile + stats grid + recap
        └── atoms/
            ├── Spinner.jsx
            ├── TypeBadge.jsx
            ├── StatBar.jsx
            ├── LetterKey.jsx
            └── ScorePopup.jsx
```

---

## 🚀 Getting Started

```bash
# 1. Install
npm install

# 2. Dev server — opens at http://localhost:3000
npm run dev

# 3. Production build
npm run build

# 4. Preview production build
npm run preview
```

---

## 🍎 Apple Design System

All visual tokens are CSS custom properties in `src/styles/global.css`.

| Token                     | Value                          | Used for                                   |
| ------------------------- | ------------------------------ | ------------------------------------------ |
| `--color-primary`         | `#0066cc`                      | Every interactive element — the ONE accent |
| `--color-primary-on-dark` | `#2997ff`                      | Links on dark tiles                        |
| `--color-canvas`          | `#ffffff`                      | Primary surface                            |
| `--color-parchment`       | `#f5f5f7`                      | Alternating light tile                     |
| `--color-tile-1`          | `#272729`                      | Dark product tile                          |
| `--color-ink`             | `#1d1d1f`                      | All body text on light                     |
| `--shadow-product`        | `rgba(0,0,0,.22) 3px 5px 30px` | Pokémon sprites only — never UI chrome     |
| `--r-pill`                | `9999px`                       | Primary CTAs, chips, search                |
| `--r-lg`                  | `18px`                         | Utility cards, option buttons              |

### Rules followed

- Single Action Blue — zero second accent colours
- Product shadow on sprites only — never on cards, buttons or text
- `transform: scale(0.95)` on every button `active` state
- Full-bleed tiles with colour change as divider — no decorative borders/shadows
- Body text at **17px** (not 16px) with `letter-spacing: -0.374px`
- Weight ladder: 300 / 400 / 600 / 700 — 500 deliberately absent

---

## 🌍 Internationalisation

Strings live in `src/i18n/strings.js` as a flat key–value map per locale.

```js
// Adding a new language:
export const STRINGS = {
  en: { dir: "ltr", nav: { title: "Pokémon Quiz", … }, … },
  ar: { dir: "rtl", nav: { title: "اختبار بوكيمون", … }, … },
  fr: { dir: "ltr", nav: { title: "Quiz Pokémon",  … }, … }, // ← add here
};
```

The `dir` field is applied to the root `<div>` in `App.jsx`, which cascades RTL
layout (flex direction, text alignment, logical properties) to all children.
Arabic uses **Noto Sans Arabic** loaded via Google Fonts; the CSS variable
`--font` is overridden in `[dir="rtl"]`.

---

## 🎯 Scoring

```
Points = (100 + timeBonus) × streakMultiplier
timeBonus        = round((timeLeft / maxTime) × 50)   → up to +50
streakMultiplier = 1 + min(streak, 6) × 0.1           → up to ×1.6
```

| Grade | Accuracy | Title             |
| ----- | -------- | ----------------- |
| S     | ≥ 90%    | Pokémon Master!   |
| A     | ≥ 80%    | Gym Leader!       |
| B     | ≥ 65%    | Senior Trainer    |
| C     | ≥ 45%    | Pokémon Trainer   |
| D     | < 45%    | Team Rocket Grunt |

---

## 🔌 API

- Endpoint: `https://pokeapi.co/api/v2/pokemon/{id}`
- Fields: name · sprites (official artwork) · types · base stats
- Cache: module-level Map — each Pokémon fetched once per session
- Pre-loading: next question silently fetched while player reviews current answer

---

## 🛠 Tech Stack

`React 18` · `Vite 5` · `PokéAPI` · `Inter` + `Noto Sans Arabic` (Google Fonts) · Pure CSS custom properties · No CSS framework

---

## 📄 License

MIT
