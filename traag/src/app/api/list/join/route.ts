import { NextResponse, type NextRequest } from "next/server";
import { AGE, COOKIE, nonce, readMember, sign } from "@/server/listAuth";
import { body, fail, sameOrigin, setCookie } from "@/server/listRoutes";
import { checkEmail, checkName } from "@/lib/listValidation";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail(403, { field: "form", message: "that didn't come from this site" });
  const b = await body(req);
  if (!b) return fail(400, { field: "form", message: "something went wrong sending that. try again" });

  const email = String(b.email ?? "").trim().toLowerCase();
  const name = String(b.name ?? "").trim();
  const e = checkEmail(email);
  if (e) return fail(400, { field: "email", message: e });
  const n = checkName(name);
  if (n) return fail(400, { field: "name", message: n });

  // Already on the list with this email: send a sign-in link instead of
  // pretending to add them twice.
  const member = await readMember(req.cookies.get(COOKIE.member)?.value);
  const already = member?.email === email;

  const pending = {
    email,
    name: already ? member!.name : name,
    purpose: already ? ("sign-in" as const) : ("join" as const),
    nonce: nonce(),
    exp: Math.floor(Date.now() / 1000) + AGE.pending,
  };
  const res = NextResponse.json({ ok: true, already, next: "/list/check" });
  setCookie(res, req, "pending", await sign(COOKIE.pending, pending));
  return res;
}
