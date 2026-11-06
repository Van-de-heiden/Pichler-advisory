# Pichler Advisory

Public website built with Next.js-compatible Vinext and a Cloudflare Worker. The
November 2026 migration uses the exact Sites v14 design with the existing PA OS
intake and manually confirmed booking workflow.

## Development and validation

Use Node.js >=22.13.0 and npm.

```bash
npm ci
npm run dev
```

```bash
npx tsc --noEmit
npm run lint
npm test
npx playwright install --with-deps chromium
npm run test:ui
```

Tests use local fixtures and mocks. They do not send live emails or calendar
invitations. `PA_BROWSER_EXECUTABLE` can select an installed Chromium browser.

## Migration and release

Read [the migration handoff](docs/SITES-V14-MIGRATION.md) before pushing this
candidate. It is prepared locally; **it has not been published**. The release
branch triggered both Cloudflare Workers Builds and Pages. Actual production and
preview branch settings and commands must be checked before any push, including
a pull-request branch.

Expected build command: `npm run build`. Worker configuration is retained in
`wrangler.jsonc`, including its name, PA OS binding and BookingDesk identity.
Do not replace this repository with the standalone Sites preview or static export.

Public routes are `/`, `/ueber-mich`, `/agb`, `/impressum` and `/datenschutz`.
Former service/industry pages redirect to relevant homepage sections. Private
`/termine/bestaetigen` stays available and excluded from search. Blog comes later.

See [MAIL-SETUP.md](MAIL-SETUP.md) for mail/calendar configuration and
[docs/OS_INTAKE.md](docs/OS_INTAKE.md) for durable intake behavior. All production
secrets remain external. Updated font licenses are served under `/licenses/`.
