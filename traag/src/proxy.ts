import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, readSession } from "@/server/listAuth";

/**
 * First gate for the private area: no valid, signed session, no page.
 * The page checks again itself, because a proxy is only an optimistic
 * check; this one exists so the redirect happens before any rendering.
 */
export async function proxy(req: NextRequest) {
  const session = await readSession(req.cookies.get(COOKIE.session)?.value);
  if (session) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/list/sign-in";
  url.search = "?from=inside";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/list/inside", "/list/inside/:path*"],
};
