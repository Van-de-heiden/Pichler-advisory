const ACCESS_COOKIE = "pichler_advisory_access";
const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sha256(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getConfiguration() {
  return {
    code: process.env.SITE_ACCESS_CODE?.trim() ?? "",
    secret: process.env.SITE_ACCESS_SECRET?.trim() ?? "",
  };
}

async function getCodeFingerprint(code: string) {
  return toBase64Url((await sha256(code)).slice(0, 12));
}

function tokenPayload(expiresAt: number, fingerprint: string) {
  return `pichler-advisory:${expiresAt}:${fingerprint}`;
}

export function isAccessConfigured() {
  const { code, secret } = getConfiguration();
  return code.length >= 6 && secret.length >= 32;
}

export async function isCorrectAccessCode(candidate: string) {
  const { code } = getConfiguration();
  if (!isAccessConfigured() || candidate.length > 128) return false;

  const [candidateHash, codeHash] = await Promise.all([sha256(candidate), sha256(code)]);
  let difference = 0;
  for (let index = 0; index < candidateHash.length; index += 1) {
    difference |= candidateHash[index] ^ codeHash[index];
  }
  return difference === 0;
}

export async function createAccessToken() {
  const { code, secret } = getConfiguration();
  if (!isAccessConfigured()) throw new Error("Access protection is not configured.");

  const expiresAt = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS;
  const fingerprint = await getCodeFingerprint(code);
  const payload = tokenPayload(expiresAt, fingerprint);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await importSigningKey(secret), encoder.encode(payload)));
  return `${expiresAt}.${fingerprint}.${toBase64Url(signature)}`;
}

export async function hasValidAccessToken(token: string | undefined) {
  if (!token || !isAccessConfigured()) return false;

  const [expiresRaw, fingerprint, signatureRaw, ...rest] = token.split(".");
  if (rest.length || !expiresRaw || !fingerprint || !signatureRaw) return false;

  const expiresAt = Number(expiresRaw);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + ACCESS_TOKEN_TTL_SECONDS + 60) return false;

  const { code, secret } = getConfiguration();
  const expectedFingerprint = await getCodeFingerprint(code);
  if (fingerprint !== expectedFingerprint) return false;

  try {
    return await crypto.subtle.verify(
      "HMAC",
      await importSigningKey(secret),
      fromBase64Url(signatureRaw),
      encoder.encode(tokenPayload(expiresAt, fingerprint)),
    );
  } catch {
    return false;
  }
}

export const accessCookie = {
  name: ACCESS_COOKIE,
};
