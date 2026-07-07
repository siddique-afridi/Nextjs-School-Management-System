import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/login", "/adminRegister"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = authPages.includes(pathname);

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/adminRegister"],
};
