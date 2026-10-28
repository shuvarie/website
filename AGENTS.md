## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: tailwindcss, sveltekit-adapter

---

# AGENTS.md

This is the website for an AI tool called "Shuvarie".

## Stack

The repo is a **SvelteKit** app (Svelte 5 runes), prerendered with
`@sveltejs/adapter-static` into `build/` and deployed to Cloudflare Pages.
Styling is Tailwind CSS v4 with design tokens declared in `src/app.css`
(`@theme`), so there is no `tailwind.config.js`.

Documentation is markdown under `src/content/docs/`, compiled by **mdsvex**
(Svelte's MDX). Each page is a real Svelte component: it may import components
and use `{expressions}`. `mdx-plugins.ts` collects headings for the table of
contents; `src/lib/docs.ts` builds the nav, prev/next links and the search index.

Source code of the product itself can be found as a Git submodule in
`./ref/shuvarie` as reference.

## Commands

- `pnpm dev` — dev server
- `pnpm check` — svelte-check + TypeScript; must stay at zero errors
- `pnpm build` — prerender the whole site into `build/`

## Conventions

- Import app code through the `#lib/*` alias (`#lib/docs`, `#lib/components/…`).
- Keep pages prerenderable: no `+page.server.ts`, no runtime-only APIs. Anything
  dynamic belongs in a `+page.ts` with `export const prerender = true`.
- Add a docs page by dropping a `.md` file in `src/content/docs/` with
  `title`, `description`, `group` and `order` frontmatter. Do not write
  `headings` — it is generated.
- Literal `{` / `}` in prose must be escaped (`&#123;` / `&#125;`); fenced code
  blocks are fine.
- Code block languages must exist in `LANGS` in `vite.config.ts`.
- Keep `scripts/` empty of one-off migrations; content lives in `src/content`.
