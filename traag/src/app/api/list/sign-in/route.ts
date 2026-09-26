import { NextResponse, type NextRequest } from "next/server";
import { AGE, COOKIE, nonce, readMember, sign } from "@/server/listAuth";
import { body, fail, sameOrigin, setCookie } from "@/server/listRoutes";
import { checkEmail } from "@/lib/listValidation";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail(403, { field: "form", message: "that didn't come from this site" });
  const b = await body(req);
  if (!b) return fail(400, { field: "form", message: "something went wrong sending that. try again" });

  const email = String(b.email ?? "").trim().toLowerCase();
  const e = checkEmail(email);
  if (e) return fail(400, { field: "email", message: e });

  // A real list would answer "check your inbox" either way, so nobody can
  // test which emails are on it. A demo with no inbox has to say it.
  const member = await readMember(req.cookies.get(COOKIE.member)?.value);
  if (!member || member.email !== email) {
    return fail(404, { field: "email", message: "that email isn't on the list. join first, it takes ten seconds" });
  }

  const pending = {
    email,
    name: member.name,
    purpose: "sign-in" as const,
    nonce: nonce(),
    exp: Math.floor(Date.now() / 1000) + AGE.pending,
  };
  const res = NextResponse.json({ ok: true, next: "/list/check" });
  setCookie(res, req, "pending", await sign(COOKIE.pending, pending));
  return res;
}
