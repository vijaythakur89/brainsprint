#  BrainSprint 3D

**BrainSprint** is a high-performance, mobile-first 3D browser-based arcade runner game inspired by classic lane-swiping runner mechanics. Designed for kids and learners, it combines fast-paced 3D movement with dynamic educational challenges (starting with mathematics and expandable to other subjects).

---

##  Visual & Gameplay Reference
The game is inspired by modern 3D mobile arcade runners:
- **Perspective:** Third-person chase camera viewing a stylized low-poly winding path.
- **Controls:** Smooth 3-lane switching (Left, Center, Right) via swipe gestures or keyboard arrows.
- **Mechanics:** Players encounter moving answer gates and collect floating reward coins while solving timed or endless academic questions.

---

##  Tech Stack
- **Frontend & UI:** React, TypeScript, Vite
- **3D Engine:** Babylon.js (WebGL 2.0 baseline)
- **Styling:** CSS3 / Tailwind CSS (for smooth HUD overlays & menus)
- **Persistence:** Versioned `localStorage` for local profiles, scores, and badges.
- **Hosting & CI/CD:** GitHub Pages deployed automatically via GitHub Actions.

---

##  Project Architecture
```text
brainsprint/
├── public/
│   └── assets/           # 3D models, textures, and license docs
├── src/
│   ├── app/              # App shell, screen routing & global state
│   ├── game/             # Babylon.js scene setup, lighting & main loop
│   │   ├── input/        # Swipe & keyboard event handlers
│   │   ├── runner/       # Kinematic lane-switching logic
│   │   ├── track/        # Recyclable track segments
│   │   ├── gates/        # Gate generation & collision resolvers
│   │   └── math/         # Dynamic question & difficulty generator
│   ├── profile/          # Local device profile manager & badge tracker
│   ├── ui/               # HUD, pause menu, and results scoreboard
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts        # Configured for GitHub Pages base path
