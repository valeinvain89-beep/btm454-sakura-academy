# Sakura Tech Academy - BTM454 Technology Management

Source of **Sakura Tech Academy**, a pixel-style, Japanese-themed learning game built for **BTM454 Technology Management** (UiTM, classes 2B and 2C).

**Live app:** https://btm454-sakura-academy5-azvic89.base44.app

## Status of the game at the time of this snapshot
- **Chapter 5 - IT Guardian** is playable (five missions covering resource strategy, governance, IT service management and cybersecurity).
- **Chapter 6 (Emerging Technologies)** and **Chapter 7 (Ethics and Social Responsibility)** are planned and not yet playable.
- Progress is saved per browser as a guest, and the game has a Learning journal.

## What is in this repository
| Path | Contents |
|---|---|
| `src/game/` | Game code and content: Academy, Village, content, pixel world, save functions and styles |
| `src/routes/` | App routes (game entry page and sign-in pages) |
| `src/components/`, `src/lib/`, `src/hooks/`, `src/api/` | Shared UI components, helpers, hooks and the Base44 client |
| `scripts/` | Smoke tests (`npm run test:game`, `npm run test:world`) |
| `base44/`, config files | Base44, Vite, Tailwind, ESLint and Cloudflare settings |

## Build
A GitHub Actions workflow (`.github/workflows/build.yml`) runs `npm install` and `npm run build` on every push to main. The build passes.

Locally:
```
npm install
npm run build
```
The `.npmrc` sets `legacy-peer-deps=true` because two @tanstack/ai packages have a peer-version conflict.

## Limits
- Sign-in and saved progress depend on the Base44 backend (`@base44/sdk`), so the game does not fully run from this repository alone. Use the live app to play.
- This is a manual snapshot copied from Base44, not a live sync. The Base44 skill folders (`.agents`, `agent`) and a package-lock file are not included.

## Course
BTM454 Technology Management - classes 2B and 2C.
