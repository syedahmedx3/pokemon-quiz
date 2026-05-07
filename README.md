# 🎮 Pokémon Knowledge Test
### Professor Oak's Academy — Built with React + PokéAPI

A polished, fully-interactive Pokémon quiz game with three game modes,
difficulty levels, a live countdown timer, streak multipliers, and a
detailed results breakdown.

---

## ✨ Features

| Feature | Details |
|---|---|
| **3 Quiz Modes** | Who's That Pokémon (silhouette), Type Expert, Mixed |
| **3 Difficulty Levels** | Rookie (Gen I), Trainer (Gen I–III), Champion (All Gens) |
| **Countdown Timer** | 20 / 15 / 10 seconds per question, colour-coded bar |
| **Lives System** | 3 hearts — game ends early if all are lost |
| **Streak Multiplier** | Correct answers in a row boost your score (up to ×1.6) |
| **Time Bonus** | Faster answers earn extra points (up to +50) |
| **Question Pre-loading** | Next question fetched in background for instant transitions |
| **API Cache** | Each Pokémon is only fetched once per session |
| **Base Stats Panel** | Expandable HP / ATK / DEF / SPD bars on reveal |
| **S–D Grade System** | Letter grade + flavour text at the end of each round |
| **Per-question Recap** | Full breakdown with sprites, types, points, and wrong guesses |
| **Personal Best** | Session high score displayed on the home screen |

---

## 🗂 Project Structure

```
pokemon-quiz/
├── index.html                   # Vite entry HTML
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── public/
│   └── pokeball.svg             # Favicon
└── src/
    ├── main.jsx                 # React DOM root
    ├── App.jsx                  # Screen router (home → quiz → results)
    ├── styles/
    │   └── global.css           # All CSS — cards, animations, utilities
    ├── constants/
    │   └── config.js            # TOTAL_Q, DIFF_CFG, TCOLOR, ALL_TYPES
    ├── utils/
    │   ├── helpers.js           # rnd, shuf, cap, pad3, hexRgb
    │   ├── api.js               # fetchPk() with in-memory cache
    │   └── game.js              # buildQ, preloadQ, calcPts, getGrade, resolveMode
    └── components/
        ├── Home.jsx             # Settings / start screen
        ├── Quiz.jsx             # Active quiz with timer & lives
        ├── Results.jsx          # End-of-round grade & recap
        └── atoms/
            ├── Spinner.jsx      # Loading indicator
            ├── TypeBadge.jsx    # Coloured Pokémon type pill
            ├── StatBar.jsx      # Animated base stat bar
            ├── LetterKey.jsx    # A / B / C / D key chip on options
            └── ScorePopup.jsx   # +pts animated badge
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 🎯 Scoring Formula

```
Points = (100 + timeBonus) × streakMultiplier

timeBonus        = round((timeLeft / maxTime) × 50)   → up to +50
streakMultiplier = 1 + min(streak, 6) × 0.1           → up to ×1.6
```

### Grade thresholds

| Grade | Accuracy | Title |
|---|---|---|
| S | ≥ 90% | Pokémon Master! |
| A | ≥ 80% | Gym Leader! |
| B | ≥ 65% | Senior Trainer |
| C | ≥ 45% | Pokémon Trainer |
| D | < 45% | Team Rocket Grunt |

---

## 🔌 API

All Pokémon data is sourced from the free, open [PokéAPI](https://pokeapi.co/).

- **Endpoint used:** `https://pokeapi.co/api/v2/pokemon/{id}`
- **Fields consumed:** name, sprites (official artwork), types, base stats
- **Caching:** results are stored in a module-level `Map` — each Pokémon
  is only fetched once per browser session, keeping network usage minimal
- **Pre-loading:** while the player reviews the current answer, the next
  question is silently fetched in the background so transitions feel instant

---

## 🛠 Tech Stack

- **React 18** — UI + hooks
- **Vite 5** — build tool & dev server
- **PokéAPI** — Pokémon data
- **Syne** + **Press Start 2P** — Google Fonts
- Pure CSS — no CSS framework, all hand-written with CSS custom classes

---

## 📄 License

MIT — free to use, modify, and distribute.
