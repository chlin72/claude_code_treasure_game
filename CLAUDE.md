# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000 (auto-opens browser)
npm run build     # Production build → build/ directory
```

No lint or test scripts are configured. There is no `tsconfig.json` and TypeScript is transpiled by SWC (`@vitejs/plugin-react-swc`) without type-checking — type errors surface only in the IDE, not at build time.

## Code Conventions

Every new function must have a single-line comment at the top summarizing its usage, with documented input and output parameters.

## Architecture

This is a single-page React + TypeScript game built with Vite and Tailwind CSS v4.

**Game logic lives entirely in `src/App.tsx`:**
- `Box` interface tracks `id`, `isOpen`, and `hasTreasure` per chest
- `initializeGame()` randomly assigns the treasure to one of three boxes and resets score/state
- `resetGame()` is a thin wrapper that calls `initializeGame()`
- `openBox(boxId)` scores +$100 for treasure or −$50 for a skeleton, then checks for game-end conditions (treasure found or all boxes opened). Note: `score` is read from the outer closure inside `setBoxes`, not from React state — keep this stale-closure pattern in mind if adding score-dependent logic
- Framer Motion (`motion/react`) drives chest flip/scale animations; sound effects are imported as module URLs (`src/audios/`)
- Win/tie outcome: `score > 0` → "You Win!", `score ≤ 0` → "It's a Tie!" (negative scores display as tie, not loss)

**`src/components/ui/`** — ~40 pre-built Radix UI + shadcn/ui components. Use these for any new UI rather than adding new component libraries.

**`src/components/figma/ImageWithFallback.tsx`** — image component with error fallback, intended for Figma-designed assets.

**Assets:**
- `src/assets/` — treasure chest images (closed, opened with treasure, opened with skeleton) and `key.png` (used as custom cursor on hover)
- `src/audios/` — `chest_open.mp3` (normal open), `chest_open_with_evil_laugh.mp3` (skeleton reveal)
- `src/results/` — reference screenshots used during development (e.g. `key_hover.png`)

**Path alias:** `@` resolves to `src/` (configured in `vite.config.ts`).

**Versioned package aliases:** `vite.config.ts` maps versioned import names (e.g. `vaul@1.1.2`) to their unversioned equivalents. This allows Figma-exported code that references packages with pinned versions to resolve correctly without modification.

**Build output** goes to `build/` (not `dist/`).
