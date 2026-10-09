# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A redesign of the KTU (student-facing university portal) website, bootstrapped from Create Next App and still mostly the default scaffold (`app/page.tsx` is the starter page). `research.md` holds the UX analysis driving the redesign (e.g. the home page should prioritise latest exam info, notifications and benefits over anti-ragging/fee/suraksha emergency items; notifications should be their own page; the header should stay constant across pages) — read it before designing screens.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, `eslint-config-next`)

There is no test runner configured.

## Stack and conventions

- Next.js 16.4 (App Router, `app/` at repo root, no `src/`), React 19, TypeScript, Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`, theme tokens via `@theme inline`; no tailwind config file).
- Path alias `@/*` maps to the repo root.
- Layout uses the globally typed `LayoutProps<"/">` helper (no import needed) and `next/font/google` Geist fonts exposed as `--font-geist-sans` / `--font-geist-mono`.
- Dark mode is driven by `prefers-color-scheme` via CSS variables `--background` / `--foreground`.

## Next.js version warning

`AGENTS.md` (auto-managed by `next dev`) states this Next.js version has breaking changes from what you may know. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Repo notes

- `.agents/` is gitignored; `skills-lock.json` tracks installed agent skills (e.g. `ui-ux-pro-max`).
