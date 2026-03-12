import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Protection logic based on roles
    if (pathname.startsWith("/admin")) {
      if (token?.role === "EXECUTIVE") {
        return NextResponse.redirect(new URL("/executive", req.url));
      }

      if (token?.role === "ANALYST") {
        return NextResponse.redirect(new URL("/executive/reports", req.url));
      }

      if (token?.role === "SALES") {
        if (pathname.startsWith("/admin/leads")) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/admin/leads", req.url));
      }

      if (token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (
      pathname.startsWith("/executive") &&
      token?.role !== "ADMIN" &&
      token?.role !== "EXECUTIVE" &&
      token?.role !== "SUPER_ADMIN" &&
      token?.role !== "ANALYST"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/executive/:path*"],
};
