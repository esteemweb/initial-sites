import { NextResponse, type NextRequest } from "next/server";
import { AGE, COOKIE, cookieOptions } from "./listAuth";
import type { FieldError } from "@/lib/listValidation";

export const isSecure = (req: NextRequest) => req.nextUrl.protocol === "https:";

/** Reject cross-site posts: the forms only ever post from this origin. */
export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  return !origin || origin === req.nextUrl.origin;
}

export function fail(status: number, error: FieldError) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function body(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const j = await req.json();
    return j && typeof j === "object" ? (j as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function setCookie(res: NextResponse, req: NextRequest, name: keyof typeof COOKIE, value: string) {
  res.cookies.set(COOKIE[name], value, cookieOptions(isSecure(req), AGE[name]));
}

export function clearCookie(res: NextResponse, req: NextRequest, name: keyof typeof COOKIE) {
  res.cookies.set(COOKIE[name], "", cookieOptions(isSecure(req), 0));
}
