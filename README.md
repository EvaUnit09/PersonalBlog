# Noah Decaille: personal site

Next.js (App Router) + TypeScript, deployed on Vercel. Design source of truth lives in
`docs/design-handoff/` (brief, brand book, tokens, reference HTML, screenshots).

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests (`test:watch`, `test:coverage` for 80% gate) |
| `npm run test:e2e` | Playwright at 1440px and 390px (builds and serves on :3100) |

## Layout

- `app/` routes, root layout, `fonts.ts` (self-hosted Archivo + JetBrains Mono)
- `styles/tokens.css` copied verbatim from the handoff; `app/globals.css` maps fonts and base styles
- `tests/unit`, `tests/e2e`
