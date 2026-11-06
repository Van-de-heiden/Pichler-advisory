# Sites v14 migration handoff

Prepared 6 November 2026. Status: local candidate, no push, no production change.

## Exact inputs

- Repository: `Van-de-heiden/Pichler-advisory`.
- Baseline: `61003aa142bd90176ab9fe049b5731e21665177f`.
- Both `main` and `release/sites-design-2026-11-06` resolved to that baseline.
- Sites project: `appgprj_6aece36850a081919bd3cf2d1ed06d39`, version 14.
- Sites commit: `e257d8938b114d5e0cea4b8279199886db14ba32`.
- Source Library file: `libfile_25fda547426881919a85fa3039417bfa`.
- Source content file: `file_00000000074481fd95b347dbf3cb769a`.
- Archive: `Pichler-Advisory-Sites-v14-Migration-Source.tar.gz`.
- Archive SHA-256: `59c88aa925e69a62696cb6506318c1f428f4fdee2476722c678f64e70f561b07`.
- Active source homepage: `preview-app/app/v6-home.tsx`; the older source
  `preview-app/app/page.tsx` was not substituted for it.

The archive was checked locally before extraction, with path traversal and
symlink checks. The Library helper's xattr operation is unavailable on Windows
(`os.setxattr` missing); returned Library identity was retained using NTFS named
streams and a JSON sidecar. No credential or Sites hosting identity was imported.

## What changed

- v14 homepage, interactions, responsive styles, about/legal layouts, landscape,
  and supplied SVG wordmarks/signets are integrated into the existing app.
- Preview-only notices and disabled submission were removed. The original
  validated form submission, reference reuse, error handling and durable success
  behavior now power the v14 form. Choosing a service updates the enquiry topic
  without erasing typed details.
- Previous content pages and entrance animation were removed. Known service and
  industry URLs use permanent redirects to the corresponding homepage area.
  Campaign parameters survive; a mapped service cannot be overridden by a query.
- Public pages have canonical/share metadata, structured data and a five-page
  sitemap. Search robots may index public content. API and confirmation paths
  remain excluded. A blog is not added.
- Legal content describes the actual intake, retry metadata, booking, Cloudflare,
  Infomaniak and local font use; private Sites preview disclosures are removed.
  Provided company/register facts remain unchanged. Production processing must
  still match these descriptions at release.

## Backend and data invariants

Dependencies and lockfile, Wrangler configuration, `lib/enquiry.ts`, enquiry,
booking, calendar and SMTP backend modules, the confirmation page and the existing
backend tests remain byte-identical to baseline. See the protected-file manifest.
Only marketing routing, redirects, robots and sitemap change in `worker/index.ts`.

- Worker: `pichler-advisory`; existing compatibility date and `nodejs_compat`.
- Service binding `PA_OS` -> `pichler-advisory-os`, entrypoint `IntakeService`.
- Durable Object binding `BOOKINGS`, class `BookingDesk`, existing SQLite
  migration `booking-desk-v1`; named instance `pichler-advisory-booking-desk`.
- Rate-limit namespaces `2026100701` and `2026100702` are retained.
- `POST /api/enquiries`: same-origin JSON, UUIDv4 requestId, validation, privacy
  acknowledgement and honeypot. Persist through PA OS first, then claim/send the
  notification. A successful reference means durable intake, not guaranteed mail.
- A repeated reference must not duplicate intake or uncertain mail delivery.
  Browser session storage holds a reference and fingerprint, not form text.
- Booking link `/termine/bestaetigen#id=...&token=...`; token goes in the
  `x-booking-token` header to details/confirm APIs. Viewing details never creates
  an event. Manual confirmation and the calendar workflow are preserved.
- `MAIL_PASSWORD`, `INFOMANIAK_CALENDAR_TOKEN` and optional calendar ID remain
  external. No secret values were read or changed.

## Cloudflare evidence and release blocker

The baseline has successful checks from both Cloudflare products:

- Workers build `fc41a241-d069-42a4-a858-e7c5a3e50c2f`, Worker version
  `0cc8d6d7-99ff-4a5f-b198-4f03f685295b`, completed 2026-11-06 21:16:46Z.
- Pages deployment `24a5e22b-7baa-4816-81d2-dbe212280d18`, branch preview
  `https://release-sites-design-2026-11.pichler-advisory.pages.dev`.
- GitHub Actions run `42295293106` ran on a release-branch push. The CI workflow
  itself runs checks, not a deployment command.

The Cloudflare build detail URL redirected to login. Actual production branch,
non-production deploy command, active Worker version, routes, custom domains and
preview binding isolation have **not** been verified. A successful build and a
dashboard URL containing `/production/` do not prove live activation. The public
website still showed the old design during inspection.

No push is permitted until those facts are resolved. This is a login/evidence
blocker, not an automatic approval rejection; no denied mutation was executed.

Official references:

- https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
- https://developers.cloudflare.com/pages/configuration/branch-build-controls/

Workers documentation distinguishes the newer Worker Preview model from older
projects whose preview builds use production settings. Do not assume isolation,
or switch models as a workaround. Inspect this project's actual configuration.

## Concrete release sequence

1. In authenticated Cloudflare, record Workers branch control, build/deploy
   commands, preview settings, active production deployment, domains/routes and
   resolved bindings. Record Pages production branch, automatic build policy and
   custom domains too. Keep DNS and Cloudflare enabled.
2. Verify that the planned push cannot activate production or mutate production
   PA OS/BookingDesk. If it can, agree the intended release mechanism and make
   that specific reversible trigger adjustment first. A new branch alone is not
   proof of isolation.
3. Recheck remote main against baseline. If it advanced, integrate changes locally
   and rerun relevant checks. Review the diff and protected manifest. Transfer as
   one atomic source commit, not partially uploaded files. Exclude node_modules,
   build output and secrets.
4. Run CI and inspect a preview with submissions mocked or separately confirmed
   test bindings. Review the five public routes, mobile navigation, assets,
   service choices, old links and legal disclosures.
5. Deploy through the verified production path; check active version and domain.
   With explicit release-test authorization, send one labeled enquiry and verify
   PA OS intake, notification, manual confirmation and calendar outcome. Local
   tests cannot prove live credentials, RPC availability or deliverability.
6. Record deployed commit/version and keep the prior Worker version for rollback.
   Do not delete or rename the Durable Object namespace, migrate the database or
   alter PA OS as part of this design release.

Rollback: restore the previous verified Worker deployment and matching source
commit/assets; retain intake and booking state. A full pre-migration Git bundle
is provided. Its SHA-256 is
`7e4610e21af96551291da1b60020dc86b94263dffb92999b823c7fb79703b2b7`.

## Validation and limits

Accompanying logs cover backend, build, HTML, TypeScript, lint and browser checks.
Final results: 24/24 backend tests, 6/6 HTML tests and 5/5 browser scenarios pass.
Build and TypeScript pass. ESLint exits successfully with zero errors and five
`no-img-element` performance advisories. The build reports Vinext's existing
static route-classification limitation; routes were verified by rendered tests.
Browser scenarios include desktop/mobile retries, retained inputs/reference,
service/topic selection, missing meeting dates and inert confirmation links.
Desktop and 390px mobile appearance were inspected against the exact v14 source.
No live submissions, email/calendar actions, pushes, deployments, DNS or
Cloudflare setting changes were performed.

A maintenance page has not been deployed: the existing public site can stay
available during preparation. If needed later, use a bounded Worker response
with HTTP 503 and Retry-After, exempting APIs and confirmation links. That needs
its own verified release and rollback; disabling Cloudflare is unnecessary.
