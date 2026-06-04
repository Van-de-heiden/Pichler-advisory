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

export async function onRequestPost(context) {
  const { request, env } = context;

  const formData = await request.formData();
  const username = formData.get('username') || '';
  const password = formData.get('password') || '';
  const from = formData.get('from') || '/';

  const validUser = env.AUTH_USERNAME;
  const validPass = env.AUTH_PASSWORD;

  if (!validUser || !validPass) {
    return new Response('Auth not configured', { status: 500 });
  }

  if (username === validUser && password === validPass) {
    const secret = env.SESSION_SECRET || 'pichler-advisory-secret-2026';
    const token = await createToken(secret);

    const headers = new Headers({
      Location: from.startsWith('/') ? from : '/',
      'Set-Cookie': `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`,
    });
    return new Response(null, { status: 302, headers });
  }

  // Wrong credentials
  const redirect = new URL('/login', request.url);
  redirect.searchParams.set('error', '1');
  if (from !== '/') redirect.searchParams.set('from', from);
  return Response.redirect(redirect.toString(), 302);
}
