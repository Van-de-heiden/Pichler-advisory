# Investor portal UI kit — Pichler Capital Group

A high-fidelity recreation of the firm's confidential investor portal: a discreet, data-respectful dashboard. Open `index.html` — it starts at the login screen; submit (any values) to enter. The "Return to pichlercapital.com" link and sidebar logout route back to the website kit.

## Screens & flow
- **Login** — centered card, shield, encrypted-access framing.
- **Overview** — capital figures, allocation donut, capital-account ledger, top positions.
- **Portfolio** — full positions table with Core / Selective filter.
- **Opportunity detail** — slide-in drawer with thesis, risk profile, committed / value / IRR / MOIC.
- **Documents** — letters, statements and memos with download affordance.
- **Settings** — intentionally minimal placeholder.

## Components
| File | Role |
|---|---|
| `Login.jsx` | Confidential access screen |
| `Sidebar.jsx` | Dark charcoal nav rail, Bordeaux active state, user + logout |
| `Topbar.jsx` | Page title, search, notifications |
| `Overview.jsx` | Stat tiles, allocation donut, capital account, positions preview |
| `Holdings.jsx` | Shared `HoldingsTable` + `OpportunityDrawer` |
| `Portfolio.jsx` | Filterable full positions table |
| `Documents.jsx` | Document list + `Settings` placeholder |
| `data.jsx` | Fake holdings, documents and allocation data (`window.PORTAL`) |

## Shared (`../shared/`)
- `Icon.jsx` — Lucide line icons (1.5 stroke).

## Notes
- Uses root `colors_and_type.css` + `portal.css`.
- The allocation donut is a restrained `conic-gradient` ring in brand tones — a data visual, not decoration.
- All figures are illustrative. Copy follows the sober financial voice: *target returns are not guarantees.*
