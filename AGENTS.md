# Repository Guidelines

## Project Structure & Module Organization

The project follows Astro's minimal starter. Application code lives in `src/`, with routable pages under `src/pages/` (`index.astro` ships the landing page). Create reusable UI in `src/components/` and share logic via `src/lib/` whenever abstractions grow. Static assets such as favicons or images belong in `public/`, while build artifacts are emitted to `dist/` after running the production build.

## Build, Test, and Development Commands

Run `npm install` once to install dependencies. Use `npm run dev` for the local dev server on `http://localhost:4321`; it hot-reloads `.astro` and React files. Ship-ready bundles come from `npm run build`, and you can verify them with `npm run preview`. The Astro CLI is exposed through `npm run astro -- <command>`—run `npm run astro -- check` before pushing to catch configuration and Markdown issues.

## Coding Style & Naming Conventions

This codebase is ESM-first and TypeScript-enabled via `tsconfig.json` (strict mode, React JSX runtime). Prefer `.astro` pages for layout-first work, and `.tsx` components for interactive pieces. Use Prettier defaults (two-space indentation, single quotes) and keep imports sorted logically: Astro/React first, relative paths last. Name components and files with `PascalCase`, utility modules with `camelCase`, and route files with kebab-case (e.g. `matchups-guide.astro`).

## Testing Guidelines

Automated tests are not set up yet; introduce them alongside new features. Favor component tests with Vitest + Testing Library or end-to-end checks with Playwright. Place test files next to the implementation or in `src/__tests__/` using the `*.test.ts[x]` pattern. At a minimum, run `npm run build` and `npm run astro -- check` to ensure types and content compile cleanly before opening a pull request, and include manual verification notes (e.g., screenshots of new pages) when functional coverage is thin.

## Commit & Pull Request Guidelines

Existing history uses short, imperative commit titles (e.g., `setup astro`). Follow that format, keep the first line under ~60 characters, and add details in the body if needed. Each pull request should describe the change, note any new routes or environment expectations, and link to tracked issues. Provide testing evidence (commands run, screenshots, or videos) so reviewers can validate quickly, and keep diffs focused—split large features into reviewable chunks whenever possible.
