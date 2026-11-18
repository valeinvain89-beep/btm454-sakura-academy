# Sakura Tech Academy - BTM454 Technology Management

Source snapshot of **Sakura Tech Academy**, a pixel-style, Japanese-themed learning game built for **BTM454 Technology Management** (UiTM, degree level). The app was built on Base44 and this repository is a manual copy of its key source files.

**Live app:** https://btm454-sakura-academy5-azvic89.base44.app

## Status of the game at the time of this snapshot
- **Chapter 5 - IT Guardian** is playable (five missions covering resource strategy, governance, IT service management and cybersecurity).
- **Chapter 6 (Emerging Technologies)** and **Chapter 7 (Ethics and Social Responsibility)** are planned and not yet built.
- Progress is saved per browser as a guest, and the game has a Learning journal.

## What is in this repository
| Path | Contents |
|---|---|
| `src/game/` | Game code and content: `Academy.jsx`, `Village.jsx`, `content.js`, `pixel-world.js`, `save-functions.js`, styles |
| `src/routes/` | App routes (game entry page and sign-in related pages) |
| `src/router.jsx`, `src/server.js`, `src/start.js`, `src/index.css` | App shell |
| Config files | `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `jsconfig.json`, `components.json`, `wrangler.jsonc` |

## Not included
This is a partial copy. These parts of the Base44 project were left out: `src/components/ui` (generic UI components), `src/hooks`, `src/lib`, `src/api`, `scripts`, `base44`, `agent`, `.agents`, and Base44-internal files (`AGENTS.md`, `CLAUDE.md`, `skills-lock.json`). Because of this, the repository will **not build or run on its own**. The `test:game` and `test:world` scripts in `package.json` refer to files in the omitted `scripts` folder.

## Notes
- The files were copied by hand from the Base44 code view and checked by size and checksum. The repository is not synced with Base44, so it can fall behind the live app.
- Course: BTM454 Technology Management (classes 2B and 2C).
