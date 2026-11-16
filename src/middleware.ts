import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (path.startsWith("/dashboard")) {
      if (role !== "ADMIN" && role !== "PENGELOLA_TOKO") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
    if (path.startsWith("/orders") || path.startsWith("/checkout")) {
      if (!role) return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin") || path.startsWith("/dashboard") || path.startsWith("/orders") || path.startsWith("/checkout")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/orders/:path*", "/checkout/:path*"],
};
