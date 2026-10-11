# NOAH DECAILLE

Personal site system for Noah Decaille: projects, a blog ("Log"), experience and about. The look is a clean cyber-zine HUD: an off-black (or white schematic) ground, one acid lime accent, a muted cyan secondary, Archivo for words and JetBrains Mono for every label, number and readout. Retro is seasoning, not the meal: the page should read like a well-made spec sheet first and a 90s cyberpunk interface second.

## Principles

1. **Readable before retro.** Effects never touch body text. If a recruiter skims for ten seconds, they get name, role, three projects and a contact link.
2. **One accent, spent carefully.** Lime marks what is active, primary or live. If everything glows, nothing does.
3. **Square and ruled.** No rounded cards, no drop shadows. Structure comes from hairlines (`line`), corner brackets (`line-strong`) and spacing.
4. **Mono means data.** Anything machine-ish (indices, dates, tags, coordinates, status) is mono. Anything human (titles, prose) is Archivo.

## Content fundamentals

- **Voice:** first person, terse, operator-like. Short declaratives. "Built this to plan date nights without 40 tabs." not "I'm passionate about leveraging AI."
- **Section indices:** numbered, uppercase, slash-separated: `01 / ABOUT`, `02 / PROJECTS`, `03 / EXPERIENCE`, `04 / LOG`. The blog is called **Log**.
- **Readouts:** real data only, never filler. Good: `LAT 40.7644 LON -73.9235` (Astoria), `LAST COMMIT 3h AGO`, `STATUS: OPEN TO WORK`, `BUILD ▲ PASSING`. Bad: fake hex dumps, lorem readouts.
- **Tags:** bracketed and uppercase: `[DJANGO] [POSTGRES] [AI]`.
- **Dates:** ISO in mono: `2026-10-11`.
- **Glyphs as icons:** `▸` link/expand, `◂` back, `■` active, `□` inactive, `▲` up/ok, `×` close. No emoji.
- No em dashes in copy; use a colon, comma or period.

## Visual foundations

### Color

| Role | Token | Rule |
|---|---|---|
| Ground | `bg-000` | Page background. Scanlines live here only. |
| Panel | `bg-100` | Dashboard tiles, cards, code blocks. |
| Hover / selected | `bg-200` | Panel hover, table headers, inline code. |
| Hairline | `line` | Dividers and the schematic grid. Decorative. |
| Bracket / control border | `line-strong` | Corner brackets, inputs, secondary buttons. 3:1 in both themes. |
| Text | `ink`, `ink-muted`, `ink-faint` | Headings and prose; summaries; readouts. All pass 4.5:1. |
| Accent fill | `accent` + `on-accent` | Primary button, active nav marker, status dot, highlight. |
| Accent text | `accent-text` | Section numbers, cursor, active nav label. Deepens to `#4a7300` in light. |
| Secondary | `cyan` | Links and stack tags only. |
| Status | `warn`, `danger` | Small marks only, never blocks. |

Never put `accent` text on the light ground: it fails contrast. Use `accent-text`, or put `on-accent` text on an `accent` fill.

### Themes

- **Dark** (default): off-black ground, warm grey ink, lime glows on hover (`glow-accent`).
- **Schematic** (light): cool white ground with a faint `line` grid at `space-6` pitch, like a technical drawing. No glow, no scanlines; lime appears as fills with dark text.

Respect `prefers-color-scheme`, with a manual toggle in the nav rendered as `[ DARK ]` / `[ LIGHT ]`.

### Typography

- `wordmark`: NOAH DECAILLE in Archivo 800, uppercase, tracked `0.18em`.
- `display` → `h3`: Archivo, tight tracking, sentence case.
- `body` 17/28 for posts, max 70ch.
- `index`, `readout`, `tag`, `code`: JetBrains Mono. `index` and `tag` are always uppercase.
- Fonts load from Google Fonts: Archivo (400, 500, 600, 700, 800) and JetBrains Mono (400, 500).

### Space and layout

- 4px base (`space-1` … `space-16`). Panel padding `space-6`, panel gutter `space-4`.
- **Homepage = dashboard grid.** 12 columns at desktop, panels span 3/4/6/8/12. Suggested panels: Identity (name, one-liner, contact), Status (open to work, location readout), Featured project, Latest Log entry, Stack, Experience timeline. Collapses to one column under 720px, Identity first.
- Inner pages (post, project) drop the grid for a single 70ch column with a mono readout bar at the top.

### HUD vocabulary

- **Corner brackets:** four `stroke-bracket` L-shapes, arms `space-3` long, in `line-strong` (lime `accent-text` on hover or when active). Replace full borders on featured panels and images.
- **Section index header:** `index` style, number in `accent-text`, label in `ink`, then a `line` rule filling the row, then an optional right-aligned readout.
- **Readout bar:** a row of `readout` items in `ink-faint`, separated by `·`.
- **Scanlines:** a fixed repeating 1px/3px horizontal gradient over `bg-000` at `scanline` opacity in dark only. Never over text panels' content.

### Motion

- **Boot sequence:** first visit per session only. 4 to 6 lines of `code` style log (`> mounting /projects ... ok`) typing in at ~25ms per char, under 1.5s total, with a visible `[ SKIP ]` and Esc to skip. Skipped entirely under `prefers-reduced-motion`.
- **Decrypt:** section index labels scramble through random glyphs into place once, when scrolled into view (≤ 400ms).
- **Cursor:** a block `▌` in `accent-text` blinking at 1s steps after the hero line.
- **Hover:** corner brackets snap 2px inward and turn lime; 120ms, ease-out.
- Nothing loops except the cursor. No flicker, no glitch on text you need to read.

### Radius and depth

Square by default (`radius-none`). `radius-sm` for inline code and keys, `radius-full` for status dots. No elevation shadows; `glow-accent` is the only one, dark theme only.

## Iconography

No icon set yet. Use the mono glyphs listed in Content fundamentals. If a real icon set is added later, use 1.5px-stroke line icons on a 16/20px grid, square caps, colored `ink-muted` and `accent-text` when active.

## Logo

No logo mark: the wordmark NOAH DECAILLE set in the `wordmark` style is the identity. A favicon, if needed, is `ND` in Archivo 800 on an `accent` square with `on-accent` text.
