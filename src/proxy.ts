import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    response.cookies.set("admin-token", "", { maxAge: 0, path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico|background.mp4).*)"],
};
