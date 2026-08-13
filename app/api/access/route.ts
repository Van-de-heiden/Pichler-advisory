import { accessCookie, createAccessToken, isAccessConfigured, isCorrectAccessCode } from "../../access-control";

export const dynamic = "force-dynamic";

function json(body: Record<string, unknown>, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store, private",
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export async function POST(request: Request) {
  if (!isAccessConfigured()) return json({ ok: false }, 503);

  let code = "";
  try {
    const payload = await request.json() as { code?: unknown };
    code = typeof payload.code === "string" ? payload.code : "";
  } catch {
    return json({ ok: false }, 400);
  }

  if (!(await isCorrectAccessCode(code))) return json({ ok: false }, 401);

  const token = await createAccessToken();
  const requestUrl = new URL(request.url);
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secure = requestUrl.protocol === "https:" || forwardedProtocol === "https";
  const cookie = [
    `${accessCookie.name}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");

  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}
