import { NextResponse, type NextRequest } from "next/server";
import { clearCookie, fail, sameOrigin } from "@/server/listRoutes";

/** Off the list: membership, session and any pending link, all gone. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail(403, { field: "form", message: "that didn't come from this site" });
  const res = NextResponse.json({ ok: true, next: "/list?left=1" });
  clearCookie(res, req, "member");
  clearCookie(res, req, "session");
  clearCookie(res, req, "pending");
  return res;
}
