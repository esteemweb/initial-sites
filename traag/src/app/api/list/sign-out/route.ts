import { NextResponse, type NextRequest } from "next/server";
import { clearCookie, fail, sameOrigin } from "@/server/listRoutes";

/** Signed out, still on the list. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail(403, { field: "form", message: "that didn't come from this site" });
  const res = NextResponse.json({ ok: true, next: "/list?out=1" });
  clearCookie(res, req, "session");
  return res;
}
