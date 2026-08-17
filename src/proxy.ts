import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isPostSignupLogin =
    request.nextUrl.pathname === "/login" &&
    request.nextUrl.searchParams.get("signup") === "success";

  if (isPostSignupLogin) {
    return NextResponse.next();
  }

  if (request.cookies.has("access_token")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};
