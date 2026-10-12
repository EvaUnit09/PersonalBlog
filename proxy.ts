import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isKnownPath } from "@/lib/content/known-path";
import manifest from "@/lib/content/slugs.json";

export const config = { matcher: ["/projects/:slug", "/log/:slug"] };

export function proxy(request: NextRequest) {
  if (isKnownPath(request.nextUrl.pathname, manifest)) return NextResponse.next();
  // Rewriting to a path no route matches renders the app's not-found UI; the status init makes it a real 404 on the first request.
  return NextResponse.rewrite(new URL("/_not-found-proxy", request.url), { status: 404 });
}
