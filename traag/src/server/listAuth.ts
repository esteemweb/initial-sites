/**
 * The list: membership and sign-in without a password or a database.
 *
 * Everything is a signed, httpOnly cookie on the visitor's own browser,
 * which is what "simulated and persisted locally" means here. The server
 * holds no state; it only signs and checks. Nobody can forge a session by
 * editing a cookie or by typing a URL, because every value carries an
 * HMAC the browser cannot produce.
 *
 *   traag_member   who joined on this browser        1 year
 *   traag_session  signed in                         30 days
 *   traag_pending  a magic link was requested        15 minutes
 *
 * The magic link carries a nonce that must match the pending cookie, so
 * a link only works once, only in the browser that asked for it, and only
 * for fifteen minutes. No email is ever sent: the "inbox" is a page that
 * shows the message we would have sent.
 */

export const COOKIE = {
  member: "traag_member",
  session: "traag_session",
  pending: "traag_pending",
} as const;

export const AGE = {
  member: 60 * 60 * 24 * 365,
  session: 60 * 60 * 24 * 30,
  pending: 60 * 15,
} as const;

// The signing key comes only from the LIST_SECRET environment variable:
// locally from .env.local (never committed), on Vercel from the project's
// environment settings. There is deliberately no built-in fallback: a key
// written in the code would be public the moment the repo is, and anyone
// could forge a signed-in cookie. Without it, the list fails closed:
// nothing can be signed and every cookie reads as invalid.
function secret() {
  const s = process.env.LIST_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "LIST_SECRET is missing or shorter than 32 characters. Set it in .env.local for local runs and in Vercel's environment variables for deploys.",
    );
  }
  return s;
}

export type Member = { email: string; name: string; joined: string };
export type Session = { email: string; name: string; iat: number };
export type Pending = { email: string; name: string; purpose: "join" | "sign-in"; nonce: string; exp: number };
type Link = { nonce: string; exp: number };

const enc = new TextEncoder();

function b64url(bytes: Uint8Array) {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

let keyPromise: Promise<CryptoKey> | null = null;
function key() {
  keyPromise ??= crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
  return keyPromise;
}

async function hmac(data: string) {
  return new Uint8Array(await crypto.subtle.sign("HMAC", await key(), enc.encode(data)));
}

/** kind is mixed into the signature so a session can never pass as a link. */
export async function sign(kind: string, payload: object) {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = b64url(await hmac(`${kind}.${body}`));
  return `${body}.${sig}`;
}

export async function verify<T>(kind: string, token: string | undefined | null): Promise<T | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), fromB64url(sig), enc.encode(`${kind}.${body}`));
    if (!ok) return null;
    return JSON.parse(new TextDecoder().decode(fromB64url(body))) as T;
  } catch {
    return null;
  }
}

export function nonce() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return b64url(b);
}

export async function readSession(token: string | undefined) {
  const s = await verify<Session>(COOKIE.session, token);
  if (!s) return null;
  if (Date.now() / 1000 - s.iat > AGE.session) return null;
  return s;
}
export const readMember = (token: string | undefined) => verify<Member>(COOKIE.member, token);
export const readPending = async (token: string | undefined) => {
  const p = await verify<Pending>(COOKIE.pending, token);
  return p && p.exp > Date.now() / 1000 ? p : null;
};
export const signLink = (l: Link) => sign("link", l);
export const readLink = async (t: string | null) => {
  const l = await verify<Link>("link", t);
  return l && l.exp > Date.now() / 1000 ? l : null;
};

export function cookieOptions(secure: boolean, maxAge: number) {
  return { httpOnly: true, sameSite: "lax" as const, secure, path: "/", maxAge };
}

/** Presale codes are per member and per tour, so a leaked code is traceable. */
export async function presaleCode(email: string, tour: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const h = await hmac(`presale.${tour}.${email.toLowerCase()}`);
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[h[i] % alphabet.length];
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}
