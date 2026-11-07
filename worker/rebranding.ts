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

export const REBRANDING_MODE_HEADER = 'x-pichler-rebranding-mode';

// Install before the app router. Cached Flight data must not bypass holding mode.
// This script is rendered only when the Worker sets the trusted mode header.
export const REBRANDING_NAVIGATION_SCRIPT = `(()=>{
  if(window.__PA_REBRANDING_NAV__)return;
  window.__PA_REBRANDING_NAV__=true;
  const paths=new Set(${JSON.stringify([...MARKETING_PATHS])});
  const target=value=>{try{const url=new URL(value,location.href);const path=url.pathname.replace(/\\/+$/,'')||'/';return url.origin===location.origin&&(path==='/'||paths.has(path))?url:null;}catch{return null;}};
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target instanceof Element?event.target.closest('a[href]'):null;
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    const url=target(link.href);if(!url)return;
    event.preventDefault();event.stopImmediatePropagation();location.assign(url.href);
  },true);
  window.addEventListener('popstate',event=>{if(target(location.href)){event.stopImmediatePropagation();location.reload();}},true);
  window.addEventListener('pageshow',event=>{if(event.persisted&&target(location.href))location.reload();});
})();`;

export function handleRebranding(request: Request, env: RebrandingEnv, html: string): Response | null {
  if (!isRebrandingEnabled(env) || !['GET', 'HEAD'].includes(request.method)) return null;
  const url = new URL(request.url);
  const transportPath = url.pathname.replace(/\/+$/, '') || '/';
  const isRsc = transportPath.endsWith('.rsc');
  const path = (isRsc ? transportPath.slice(0, -4) : transportPath).replace(/\/+$/, '') || '/';
  if (path !== '/' && !MARKETING_PATHS.has(path)) return null;

  // Keep the established canonical-host behavior. Do not intercept API routes.
  if (url.hostname === 'www.pichler-advisory.ch') {
    url.protocol = 'https:';
    url.host = 'pichler-advisory.ch';
    if (isRsc) {
      url.pathname = path;
      url.searchParams.delete('_rsc');
      return new Response(null, { status: 302, headers: { location: url.href, 'cache-control': 'no-store' } });
    }
    return Response.redirect(url.href, 308);
  }

  // Vinext navigates through .rsc URLs. A clean document redirect produces HTML,
  // triggering its supported full-document fallback instead of the old app.
  if (isRsc) {
    const target = new URL(path === '/' ? url.href : (path === '/kontakt' ? '/#anfrage' : '/'), url);
    target.pathname = '/';
    target.searchParams.delete('_rsc');
    return new Response(null, { status: 302, headers: { location: target.href, 'cache-control': 'no-store' } });
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
      'cache-control': request.headers.get('RSC') === '1' ? 'no-store' : 'public, max-age=60',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      'content-security-policy': "default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self'; connect-src 'none'; script-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'",
    },
  });
}
