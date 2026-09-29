import { NextResponse, type NextRequest } from "next/server";
import { getPiece } from "@/lib/content/pieces";

export function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref") ?? "";
  const piece = getPiece(ref);
  const url = piece ? `/pieces/${piece.id}` : `/pieces?notfound=${encodeURIComponent(ref.slice(0, 20))}`;
  return NextResponse.redirect(new URL(url, req.url), 303);
}
