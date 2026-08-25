# Pichler Advisory

Production website for Pichler Advisory, built with Next.js-compatible Vinext and deployed as a Cloudflare Worker.

## Local development

Requirements:

- Node.js 22 or newer
- npm

```bash
npm ci
npm run dev
```

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

The production website is publicly accessible. Changes merged into `main` are
built and deployed through the connected Cloudflare Worker.
