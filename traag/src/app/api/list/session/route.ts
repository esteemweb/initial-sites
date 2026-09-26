import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, readMember, readSession } from "@/server/listAuth";

/** What the public pages need to know: nothing private, just the state. */
export async function GET(req: NextRequest) {
  const session = await readSession(req.cookies.get(COOKIE.session)?.value);
  const member = await readMember(req.cookies.get(COOKIE.member)?.value);
  return NextResponse.json(
    { signedIn: !!session, member: !!member, name: session?.name ?? member?.name ?? null },
    { headers: { "cache-control": "no-store" } },
  );
}
