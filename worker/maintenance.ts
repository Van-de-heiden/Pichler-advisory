/** Fail-closed maintenance boundary, executed before every application handler. */
export interface MaintenanceEnv {
  MAINTENANCE_MODE?: string;
  MAINTENANCE_AUTH_HASH?: string;
  ENQUIRY_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}
const HEADERS = {
  'cache-control': 'private, no-store, max-age=0',
  'x-robots-tag': 'noindex, nofollow, noarchive',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
};
export async function handleMaintenance(request: Request, env: MaintenanceEnv, html: string): Promise<Response | null> {
  if (env.MAINTENANCE_MODE !== 'on') return null;
  const url = new URL(request.url);
  const authorization = request.headers.get('authorization') || '';
  // Credentials are checked only server-side. SHA-256 compares a high-entropy,
  // randomly generated complete Basic header; no plaintext secret in source.
  if (authorization && env.MAINTENANCE_AUTH_HASH) {
    const bytes = new TextEncoder().encode(authorization);
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
    let difference = hash.length ^ env.MAINTENANCE_AUTH_HASH.length;
    for (let i=0;i<64;i++) difference |= hash.charCodeAt(i) ^ (env.MAINTENANCE_AUTH_HASH.charCodeAt(i) || 0);
    if (difference === 0 && /^[a-f0-9]{64}$/.test(env.MAINTENANCE_AUTH_HASH)) return null;
    if (env.ENQUIRY_LIMITER) {
      const result = await env.ENQUIRY_LIMITER.limit({ key: `maintenance:${request.headers.get('cf-connecting-ip') || 'unknown'}` });
      if (!result.success) return new Response('Zu viele Anmeldeversuche. Bitte später erneut versuchen.', {status:429,headers:{...HEADERS,'retry-after':'60'}});
    }

  }
  if (url.pathname === '/login') return new Response(request.method === 'HEAD' ? null : html, {status:401,headers:{...HEADERS,'content-type':'text/html; charset=utf-8','www-authenticate':'Basic realm="Pichler Advisory", charset="UTF-8"'}});
  if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n',{headers:{...HEADERS,'content-type':'text/plain; charset=utf-8'}});
  const isHome = url.pathname === '/' && (request.method === 'GET' || request.method === 'HEAD');
  if (isHome) return new Response(request.method === 'HEAD' ? null : html,{status:503,headers:{...HEADERS,'content-type':'text/html; charset=utf-8','retry-after':'86400'}});
  return new Response('Die Website ist vorübergehend wegen Wartungsarbeiten nicht verfügbar.', {status:503,headers:{...HEADERS,'content-type':'text/plain; charset=utf-8','retry-after':'86400'}});
}
export function privateResponse(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('cache-control','private, no-store, max-age=0');
  headers.set('x-robots-tag','noindex, nofollow, noarchive');
  headers.append('vary','Authorization');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
