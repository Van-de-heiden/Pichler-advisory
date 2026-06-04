# Pichler Capital Group — Design System

A restrained, premium design foundation for **Pichler Capital Group**, a private holding and capital group with a European, family-office-inspired identity. The system exists so that any agent or designer can produce on-brand interfaces, decks and assets that feel *discreet, composed, ambitious and enduring* — old-money elegance with modern private-capital discipline.

> **Brand promise:** *Capital deserves discipline.*

The guiding principle: capital should feel precise, calm and enduring. The visual language avoids noise, novelty for its own sake, and anything that smells faintly of a template. **Bordeaux and white** form the core; warm neutrals, ink tones and disciplined motion provide the supporting architecture.

---

## Company context

Pichler Capital Group is a **newly founded**, founder-led private investment and advisory house — a holding and capital group that develops, evaluates and stewards investment opportunities with entrepreneurial judgment, rigorous analysis and long-term intent. It is **not** a retail fintech, not a trading app, not a crypto venture. The audience is serious capital: private investors, partners and operators.

The firm is being founded around **2026–2027** by **Maurus Nic Ramon Pichler** — a young Swiss entrepreneur and digital-business developer (vocational training / *Lehre* in Switzerland), fluent in modern technology and current best practice. Crucially, this is a **first-generation** house: not an inherited multi-million fortune and not a "third-generation" dynasty, but a deliberate beginning. Maurus has been entrepreneurial since seventeen — starting with his own apparel label to gain real operating experience, then stepping into smaller projects, largely in the private sphere for friends and family.

The brand voice therefore borrows the *composure and discipline* of an established family office while remaining **honest about its origins**: ambitious, building, and intent on becoming the first generation that lasts. Avoid any copy implying inherited wealth, decades of track record, large assets under management, or "generations served". Frame legacy as **intent and ambition** (forward-looking), never as inheritance.

The brand should feel:

- **confidential**, not secretive
- **ambitious**, not loud
- **modern**, not trend-chasing
- **elevated**, not theatrical
- **precise**, not sterile
- **honestly new**, not pretending to be old

> *The brand enters the room in a tailored suit, not with a confetti cannon.*

### Surfaces in this system

The source repository is a pure brand foundation (tokens + guidelines); there is no shipping product yet. This design system establishes the foundations and builds two representative product surfaces as **UI kits**:

1. **Marketing website** (`ui_kits/website/`) — the public face the firm will use from launch: hero, investment thesis, approach, focus areas, a founder statement and contact.
2. **Investor portal** (`ui_kits/portal/`) — a discreet, password-gated dashboard: portfolio overview, opportunity detail, allocation and documents. **Figures are illustrative and intentionally modest / early-stage** — they reflect a house just beginning, not an established fund.

---

## Sources

This design system was built from the brand-definition repository the user provided. The reader is encouraged to explore it directly for deeper context:

- **GitHub:** [`Van-de-heiden/pichler-capital-group`](https://github.com/Van-de-heiden/pichler-capital-group)
  - `README.md` — system overview & design principles
  - `brand/colors.md` — colour philosophy, roles, usage ratios
  - `brand/typography.md` — type hierarchy, pairing logic, scale
  - `brand/motion.md` — animation principles, easing, timing tokens
  - `brand/voice.md` — verbal identity, tone, vocabulary, example copy
  - `tokens/colors.json` — machine-readable colour tokens
- **Logo artwork:** provided by the user (`assets/pcg-logo-full.png`), from which the transparent full lockup, shield mark and wordmark were derived.

All colour values and type tokens in `colors_and_type.css` are lifted verbatim from `tokens/colors.json` and `brand/typography.md`.

---

## Content fundamentals

How Pichler Capital Group writes. Voice in one sentence: **measured conviction, expressed with precision.** It should sound like a private investment house with entrepreneurial blood — not a bank brochure assembled by committee.

### Tone & personality
Discreet, intelligent, composed, ambitious, exact, slightly classical, commercially sharp. Never loud, childishly playful, over-promising, arrogant, crypto-hyped or generic-corporate.

### Person & address
Uses **"we"** for the firm and **"you"** for the reader, sparingly. More often the subject is *capital, opportunity, judgment* — concrete nouns rather than personal pronouns. Speaks *about the work*, not about itself.

### Casing
- **Sentence case** for almost everything — headlines, buttons, navigation, body.
- **UPPERCASE only for small tracked labels** (eyebrows, captions, metadata) — never for long text or large headlines.
- Avoid all-caps headlines unless deliberately editorial (the wordmark itself is the exception).

### Emoji & exclamation
- **No emoji. Ever.** They are incompatible with the brand's composure.
- Avoid exclamation marks. The brand does not say "Oops!". Error copy stays calm: *"We could not load this information. Please refresh the page or try again shortly."*

### Writing rules
- **Write with conviction.** "We identify opportunities with discipline, patience and commercial clarity" — not "We try to help clients explore potential opportunities."
- **Elegant, not obscure.** Rich vocabulary is welcome; fog is not. No "multi-dimensional optimisation frameworks."
- **Keep promises sober.** Never imply guaranteed returns. Use *intended return, target return, risk-adjusted view, investment thesis, downside considerations*. Never *guaranteed profit, risk-free, easy money, passive wealth machine*.
- **Rhythm then land.** Mix a measured longer sentence with a short decisive one. *"Capital is not moved by noise. It moves when judgment, timing and structure converge."*

### Vocabulary
- **Preferred:** capital, conviction, discipline, discretion, allocation, opportunity, thesis, stewardship, judgment, execution, clarity, substance, long-term, private, considered, selective, risk-adjusted, commercial, enduring.
- **Use rarely (powerful only when rare):** exclusive, luxury, elite, premium, selective, foundation. Treat *legacy* as forward-looking ambition only.
- **Avoid entirely (especially given the firm is new):** dynasty, inherited, generations served, decades of track record, old-money, *and* hustle, grindset, moonshot, guaranteed, no-brainer, insane returns, unlock your wealth, get rich, boss moves.

### Example copy
- **Hero:** *"Capital deserves discipline."* / *"Pichler Capital Group is a private investment and advisory house built for measured opportunities, entrepreneurial execution and long-term value creation."*
- **CTAs:** *Review opportunities* · *Start a confidential conversation* · *Explore the investment thesis*
- **Risk note:** *"All investments carry risk. Target returns are not guarantees. Decisions should be made with a clear understanding of the underlying assumptions, liquidity profile and downside exposure."*
- **Signature lines:** *Measured conviction* · *Enduring value* · *Built to endure* · *A deliberate beginning* · *Private capital, allocated with discipline.*

---

## Visual foundations

### Colour
Bordeaux + white core, warm neutrals supporting. The discipline is in the **ratio**, not just the palette:

| Share | Role |
|---|---|
| 55–70% | white / ivory (space, clarity) |
| 15–25% | ink, charcoal, text tones |
| 5–12% | stone, mist, borders |
| 3–8% | **Bordeaux** (authority, never flooding) |
| 1–3% | gold or semantic colours (privilege, never glitter) |

- **Bordeaux `#5A0F1B`** is the signature — primary CTAs, active nav, selected states, editorial dividers, small signature details. It anchors; it never floods.
- **Ivory `#F8F5EF`** warms alternate sections so the brand never feels clinical. **Mist `#EEEAE3`** for quiet panel contrast where white is too plain and ivory too warm.
- **Ink `#151417`** (not pure black) for text; **Charcoal `#262126`** for dark premium surfaces (footers, overlays).
- **Muted gold `#B89B5E`** is a privilege, not a habit — hairline separators, tiny status accents, refined highlight lines. Never large gold buttons, never casino gradients.
- **Semantic green/red** are reserved for financial indicators; **Risk Red `#9C2F3A` must never be confused with brand Bordeaux.**

### Typography
- **Display:** Cormorant Garamond — elegant, editorial, classical serif. Weights 400–600 only. Used for hero headlines, section titles, brand moments. Tight tracking (−0.025 to −0.04em) at large sizes.
- **Body / UI:** Inter — clean, highly legible. Weight 400 for body, 500–600 for emphasis. *Avoid 700+ unless there's a clear reason — luxury rarely shouts in bold.*
- **Hierarchy rule:** headlines may impress, body text must serve. Never set long paragraphs or dense tables in the display serif.
- Left-aligned by default; centre only for hero/short editorial blocks. Line length 55–75 characters.

### Spacing & layout
- 4px base scale (4/8/12/16/24/32/48/64/96/128). **Generous white space is the luxury** — empty space is discretion made visible.
- Wide, airy sections; comfortable line length; content rarely fills edge-to-edge except large imagery.

### Backgrounds & texture
- Predominantly **flat white and ivory** — calm, paper-like. Subtle **paper/mist tonal shifts** distinguish sections, not gradients.
- **Large cinematic imagery** is welcome (classic architecture, tailored menswear, marble, dark wood, quiet stewardship) — warm-toned, restrained, often with a **dark charcoal/Bordeaux overlay** before white text is placed on top.
- **No loud gradients, no neon, no crypto glow.** A single very soft Bordeaux-tinted wash on a dark section is the maximum.

### Corner radii
Rounded but not playful: small UI 4–8px, cards 12px, large feature surfaces 18px, pills only for tags/eyebrow chips. Nothing bubbly.

### Cards
White surface, **`mist` (`#EEEAE3`) hairline border**, soft warm shadow (never harsh black). Premium cards may carry a thin **Bordeaux highlight line** and a tiny gold accent. Lift `translateY(-3px)` max on hover with a slightly stronger shadow.

### Borders, shadows & elevation
- Borders are thin and warm — `mist` (subtle), `stone` (default), `taupe` (strong). Hairline gold for signature dividers.
- Shadows are **soft, warm and low-opacity** (built on ink `rgba(21,20,23,…)`, never pure black). Four-step scale from `xs` to `lg`, plus a Bordeaux-tinted brand shadow for primary CTAs.

### Motion
Deliberate, quiet, precise — *responsive, refined, controlled.*
- **Durations:** 120ms hover · 180ms buttons/nav · 280ms modals/overlays · 420ms hero reveals. Nothing over 500ms except page transitions.
- **Easing:** standard `cubic-bezier(0.2,0,0,1)`, refined entrance `cubic-bezier(0.16,1,0.3,1)`.
- **Hover:** colour fades, thin underline expansion, `translateY(-1px)` on buttons, `translateY(-3px)` on cards, image scale ≤1.02.
- **Press:** return to `translateY(0)` — settle, don't shrink-bounce.
- **Reveals:** opacity 0→1 with translateY 12px→0, used sparingly. *Staggering is seasoning, not soup.*
- **Forbidden:** bounce, elastic, infinite decorative loops, cursor-followers, loud parallax, layout-shifting hovers. Respect `prefers-reduced-motion`.

### Transparency & blur
Used minimally — a charcoal/Bordeaux image overlay (solid or low-opacity), and an occasional frosted nav bar on scroll. No glassmorphism as decoration.

### Imagery vibe
Warm, restrained, editorial. Classic architecture, marble, dark wood, tailored fabric, considered interiors. Often desaturated or low-contrast warm tones; subtle film grain acceptable. Never stocky, never neon, never busy.

---

## Iconography

The brand repository defines **no icon set**, and the identity is type- and space-led rather than icon-heavy. Icons are *quiet wayfinding*, never decoration.

- **System used:** [**Lucide**](https://lucide.dev) via CDN — chosen as the closest match to the brand's refined, thin-stroke, classical-modern character. **This is a substitution** (see caveats) — flagged for the user to confirm or replace.
- **Style rules:** consistent ~1.5px stroke, line (not filled), generous internal spacing, rendered in `ink`/`slate` at rest and `bordeaux-700` when active or emphasised. Sized 16–24px in UI.
- **Emoji:** never used.
- **Unicode glyphs:** the brand's own **diamond divider (◆)** and thin rule are the signature ornament — used as section separators and within the wordmark. Prefer this motif over decorative icons for editorial moments.
- **Brand marks** (in `assets/`) are PNG with transparent backgrounds, derived from the supplied logo artwork. Use the shield alone as an avatar/favicon-scale mark; the wordmark or full lockup in headers and footers.

---

## Index / manifest

**Root**
- `README.md` — this file: context, content & visual foundations, iconography, manifest.
- `SKILL.md` — Agent-Skill front-matter so this system can be used directly in Claude Code.
- `colors_and_type.css` — all colour tokens (base + semantic) and the full type system. **Import this first** in any build.

**`assets/`** — brand marks
- `pcg-logo-full.png` — full lockup on its ivory plate (original artwork).
- `pcg-logo-transparent.png` — full lockup, transparent background.
- `pcg-shield.png` — shield "PC" monogram mark, transparent.
- `pcg-wordmark.png` — wordmark + diamond divider, transparent.

**`preview/`** — Design System tab cards (colours, type, spacing, components, brand).

**`ui_kits/`** — high-fidelity, interactive product recreations
- `website/` — marketing website kit (`index.html` + JSX components).
- `portal/` — investor portal kit (`index.html` + JSX components).

Each UI kit folder carries its own `README.md` describing components and screens.

---

## Caveats

- **Fonts** (Cormorant Garamond, Inter) are the brand's recommended families, served from **Google Fonts CDN**. No font files were supplied — self-host the `.woff2` into `/fonts` for production if offline use is required.
- **Icon set (Lucide)** is a brand-appropriate **substitution** — there is no official Pichler icon set. Confirm or replace.
- **Imagery** in the UI kits uses neutral placeholders / drop zones — no licensed photography was supplied. Replace with commissioned warm editorial imagery.
- There is **no existing product codebase**; the two UI kits are faithful expressions of the brand foundation, not recreations of shipped screens.
