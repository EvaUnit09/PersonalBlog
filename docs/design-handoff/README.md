# NOAH DECAILLE: personal site build brief

Hand this folder to Claude Code. Start by reading this file, then `design-system/BRAND-BOOK.md`, then look at `screenshots/`.

## What we're building

A personal site with four areas: **About**, **Projects**, **Experience**, **Log** (the blog). Look: clean cyber-zine HUD. Off-black ground, one acid-lime accent, muted cyan for links and tags. Archivo for words, JetBrains Mono for every label, number and readout. Dark theme plus a white "schematic" light theme.

## Contents

| Path | What |
|---|---|
| `screenshots/` | Full-page renders of 4 page types: `home`, `project-detail`, `log-post`, `about`. Each in dark and light at 1440px, plus mobile (390px, dark). |
| `reference/static/` | Self-contained HTML of every page and theme. Open in a browser. **Copy markup and CSS from here** when building components. |
| `reference/dc-source/` | Original design-tool sources (`.dc.html`). Reference only, they need the design tool's runtime. |
| `design-system/tokens.json` | Source of truth for colors (per theme), type styles, spacing, radius. |
| `design-system/tokens.css` | Same tokens as CSS custom properties. Drop into the app as the global theme file. |
| `design-system/BRAND-BOOK.md` | Voice, color rules, HUD vocabulary, motion rules. |
| `fonts/` | Archivo (400-800) and JetBrains Mono (400, 500) as woff2, latin subset. |

## Suggested stack (change if you prefer)

- **Astro** with content collections: posts and projects as MDX/markdown with frontmatter. Static output, near-zero JS, easy deploy to Netlify, Vercel or Cloudflare Pages.
- Plain CSS using `tokens.css` variables (no Tailwind needed; if used, map the tokens in config).
- A tiny script for: theme toggle, boot sequence, section-label "decrypt". Everything else is static HTML.
- Alternative if you want to practice React/TypeScript: Next.js App Router with the same structure.

## Routes

- `/` home (dashboard grid), `/about`
- `/projects` index (not mocked yet: grid of project cards using the "Also built" row style), `/projects/[slug]`
- `/log` index (not mocked yet: list rows like the home Log panel), `/log/[slug]`

## Components to extract

`SiteHeader` (wordmark, 4 nav items with `01 /` numbers, theme toggle), `Panel` (square, `bg-100`, four corner brackets, brackets turn lime on hover), `PanelHeader` (`index` style: lime number, label, hairline rule, optional right readout), `Readout` rows, `Tag` (`[BRACKETED]` mono, cyan), `Button` (primary lime fill with dark text, secondary 1px border), `Timeline row`, `Prose` (70ch, 17/28), `CodeBlock`, `PostNav`, `SiteFooter`.

## Behavior to implement

- **Theme:** `data-theme="dark|light"` on `<html>`. Default from `prefers-color-scheme`, manual toggle persisted in `localStorage`. Set before first paint to avoid flash.
- **Scanlines:** fixed overlay, `opacity: var(--scanline)` (0.035), dark only, `pointer-events: none`.
- **Light theme grid:** 24px hairline grid (`--line`) on the page background.
- **Boot sequence:** first visit per session only. 4 to 6 mono log lines typed in under 1.5s total, `[ SKIP ]` button and Esc to skip. Never shown with `prefers-reduced-motion`.
- **Decrypt:** section index labels scramble into place once on scroll into view, 400ms max.
- **Cursor:** blinking `▌` after the hero line, stepped 1s, static under reduced motion.
- **Hover:** brackets snap inward 2px and turn lime, 120ms.
- **Responsive:** 12-column grid, collapses to one column under 900px; hero font drops to 44px under 720px. See the mobile screenshots.

## Accessibility rules (already checked in the tokens)

- Use `accent` only as a fill with `on-accent` text. For lime *text* use `accent-text` (deepens to `#4a7300` in light theme).
- Real `<a>`, `<button>`, `<label>`. Visible focus ring in `accent-text` (add it, the mockups don't draw one).
- Decorative bracket and scanline elements are `aria-hidden`.

## Placeholders to replace

Everything in `[BRACKETS]` is a placeholder: experience dates (`[YYYY]`), Log titles and excerpts, the Nightcap screenshot and diagram, the portrait, contact links (email, GitHub, LinkedIn), resume PDF, reply time. The Django post on the log-post page is sample copy. Project blurbs for Foodsy, OpsAgent and the ticketing build are short drafts.

## Copy rules

First person, terse, operator-like. No em dashes. No emoji. Real data only in readouts (never fake stats).

## First prompt to give Claude Code

> Read README.md and design-system/BRAND-BOOK.md in this folder, and look at every image in screenshots/. Scaffold an Astro site that matches them, using design-system/tokens.css as the global theme and fonts/ self-hosted. Build the home page first, matching screenshots/home.dark.png and home.light.png, then the other page types. Use reference/static/*.html as the markup source.
