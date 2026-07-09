import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/login", "/adminRegister"];
const protectedPrefixes = ["/admin", "/teacher", "/student"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken");
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAuthPage = authPages.includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/login", "/adminRegister"],
};
