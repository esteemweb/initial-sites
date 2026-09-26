import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, readLink, readPending, sign } from "@/server/listAuth";
import { clearCookie, setCookie } from "@/server/listRoutes";

/**
 * The magic link lands here. It works once, only in the browser that asked
 * for it, and only for fifteen minutes: the link's nonce must match the
 * pending cookie, and the pending cookie is deleted as soon as it is used.
 */
export async function GET(req: NextRequest) {
  const link = await readLink(req.nextUrl.searchParams.get("t"));
  const pending = await readPending(req.cookies.get(COOKIE.pending)?.value);

  const to = (path: string) => new URL(path, req.nextUrl.origin);

  if (!link || !pending || link.nonce !== pending.nonce) {
    const res = NextResponse.redirect(to("/list/sign-in?error=link"), 303);
    clearCookie(res, req, "pending");
    return res;
  }

  const res = NextResponse.redirect(to("/list/inside"), 303);
  const now = Math.floor(Date.now() / 1000);
  setCookie(res, req, "session", await sign(COOKIE.session, { email: pending.email, name: pending.name, iat: now }));
  if (pending.purpose === "join") {
    const joined = new Date().toISOString().slice(0, 10);
    setCookie(res, req, "member", await sign(COOKIE.member, { email: pending.email, name: pending.name, joined }));
  }
  clearCookie(res, req, "pending");
  return res;
}
