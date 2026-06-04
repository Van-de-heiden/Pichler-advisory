# Website UI kit — Pichler Capital Group

A high-fidelity recreation of the firm's public marketing site: calm, editorial, generous in white space. Open `index.html` — it loads the homepage with restrained scroll reveals, an interactive focus-area selector, a confidential-enquiry modal, and an "Investor login" that routes to the portal kit.

## Screens & flow
- **Homepage** (`index.html`) — hero → approach → investment thesis → focus areas → stewardship → closing + footer.
- **Contact modal** — confidential enquiry form with a fake submit + confirmation state.
- **Investor login** — links through to `../portal/index.html`.

## Components
| File | Role |
|---|---|
| `Nav.jsx` | Fixed header; frosts + gains a hairline border on scroll, underline-expand links |
| `Hero.jsx` | Display headline, lede, dual CTA, figure row, cinematic image plate |
| `Approach.jsx` | Four principle pillars (conviction, judgment, discretion, stewardship) |
| `Thesis.jsx` | Editorial split — image plate + numbered thesis points |
| `FocusAreas.jsx` | Interactive selectable cards with Bordeaux highlight rail |
| `TrackRecord.jsx` | Dark charcoal band with gold-ruled figures |
| `CTAFooter.jsx` | Diamond-divider closing CTA + footer |
| `ContactModal.jsx` | Confidential enquiry modal with confirmation state |

## Shared (`../shared/`)
- `Icon.jsx` — Lucide line icons (1.5 stroke).
- `ImagePlate.jsx` — refined placeholder for commissioned warm editorial photography. **Replace with real imagery in production.**

## Notes
- Uses root `colors_and_type.css` for all tokens + `website.css` for kit styles.
- Imagery is placeholder. Photography direction: classic architecture, marble, tailored interiors — warm, restrained, dark-overlaid where text sits on top.
