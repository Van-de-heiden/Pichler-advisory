/** Optional presentation-only holding page. No intake, booking or data changes. */
export interface RebrandingEnv {
  // Unset or any other value keeps the current production website unchanged.
  REBRANDING_MODE?: string;
}

const MARKETING_PATHS = new Set([
  '/leistungen',
  '/leistungen/prozesse-automatisierung',
  '/leistungen/apps-it-projekte',
  '/leistungen/websites',
  '/leistungen/betrieb-betreuung',
  '/branchen/handwerk-bau',
  '/branchen/handel-logistik',
  '/branchen/dienstleistungen',
  '/branchen/immobilien-bewirtschaftung',
  '/branchen/produktion-gewerbe',
  '/branchen/weitere-betriebe',
  '/branchen/sanitaer',
  '/branchen/heizung',
  '/branchen/gartenbau',
  '/branchen/immobilien',
  '/branchen/coiffeur',
  '/branchen/grosshandel',
  '/branchen/detailhandel',
  '/branchen/transport',
  '/ueber-mich',
  '/ueber-uns',
  '/kontakt',
]);

export const REBRANDING_PUBLIC_URLS = [
  'https://pichler-advisory.ch/',
  'https://pichler-advisory.ch/impressum',
  'https://pichler-advisory.ch/datenschutz',
  'https://pichler-advisory.ch/agb',
] as const;

export function isRebrandingEnabled(env: RebrandingEnv): boolean {
  return env.REBRANDING_MODE === 'on';
}

export function handleRebranding(request: Request, env: RebrandingEnv, html: string): Response | null {
  if (!isRebrandingEnabled(env) || !['GET', 'HEAD'].includes(request.method)) return null;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/' && !MARKETING_PATHS.has(path)) return null;

  // Keep the established canonical-host behavior. Do not intercept API routes.
  if (url.hostname === 'www.pichler-advisory.ch') {
    url.protocol = 'https:';
    url.host = 'pichler-advisory.ch';
    return Response.redirect(url.href, 308);
  }

  if (path !== '/') {
    // Rebranding is temporary: never make these marketing redirects permanent.
    const target = new URL(path === '/kontakt' ? '/#anfrage' : '/', url);
    return new Response(null, {
      status: 302,
      headers: { location: target.href, 'cache-control': 'no-store' },
    });
  }

  return new Response(request.method === 'HEAD' ? null : html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      'content-security-policy': "default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self'; connect-src 'none'; script-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'",
    },
  });
}
