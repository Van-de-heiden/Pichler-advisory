const SESSION_COOKIE = 'pa_session';

async function createToken(secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('authenticated'));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Public paths — never block
  const isPublic =
    path === '/login' ||
    path === '/login/' ||
    path.startsWith('/api/') ||
    path.startsWith('/_astro/') ||
    path.startsWith('/assets/') ||
    path === '/favicon.svg' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml';

  if (isPublic) return next();

  // Validate session cookie
  const cookieStr = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieStr.split(';')
      .filter(Boolean)
      .map(c => {
        const idx = c.indexOf('=');
        return [c.slice(0, idx).trim(), c.slice(idx + 1).trim()];
      })
  );

  const secret = env.SESSION_SECRET || 'pichler-advisory-secret-2026';
  const expected = await createToken(secret);

  if (cookies[SESSION_COOKIE] === expected) return next();

  // Not authenticated — redirect to login
  const loginUrl = new URL('/login', request.url);
  if (path !== '/') loginUrl.searchParams.set('from', path);
  return Response.redirect(loginUrl.toString(), 302);
}
