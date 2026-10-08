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

## September 2026 redesign

The approved design study was transferred on 20 September 2026. The source and
images of the previous public website remain available on the branch
`archive/pre-redesign-2026-09-20` (commit `633adc8627ab20f17f97b6cb3a75b8b4d84de421`).
The existing production dependencies, Worker name and Cloudflare build setup
are retained. The entry animation runs once per browser tab session.

The Matterhorn asset is attributed and licensed on `/impressum#bildnachweise`.
The enquiry form submits messages and free, non-binding first-meeting requests directly to the server. Mail is sent via the existing Infomaniak mailbox. See `MAIL-SETUP.md` for the required production secret and release check.
