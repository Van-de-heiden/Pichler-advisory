# Pichler Advisory

Production website for Pichler Advisory, built with Next.js-compatible Vinext and deployed as a Cloudflare Worker.

## Local development

Requirements:

- Node.js 22 or newer
- npm

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set both values in `.env.local`:

- `SITE_ACCESS_CODE`: the human-friendly code shared with visitors
- `SITE_ACCESS_SECRET`: a separate random value of at least 32 characters used to sign the access cookie

Never commit `.env.local` or production secret values.

## Validation

```bash
npm test
npm run lint
```

## Cloudflare deployment

The repository is prepared for Cloudflare Workers Builds. Connect the `main`
branch to the Worker named `pichler-advisory`.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`
- Required encrypted secrets: `SITE_ACCESS_CODE`, `SITE_ACCESS_SECRET`

The access code is checked server-side. A successful check creates a signed, HttpOnly session cookie that expires when the browser session ends or after twelve hours, whichever happens first.

The legal pages at `/impressum` and `/datenschutz` remain publicly accessible so visitors can review the provider and privacy information before entering a code.
