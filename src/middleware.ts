import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';

const { auth } = NextAuth(authConfig);

const ALLOWED_ORIGINS = [
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/field-service-management-.*\.vercel\.app$/,
  /^https:\/\/field-service-management-lovat\.vercel\.app$/,
  /^https:\/\/assembly-.*\.vercel\.app$/,
  /^https:\/\/assemblyweb\.vercel\.app$/,
  /^null$/, // For mobile file:// or other scenarios
  /^capacitor:\/\/.*$/, // Capacitor support
  /^exp:\/\/.*$/ // Expo support
];

const intlMiddleware = createMiddleware({
  locales: ['en', 'tr'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed'
});

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");
  const isAllowed = origin && ALLOWED_ORIGINS.some((pattern) => pattern.test(origin));

  // 1. CORS & OPTIONS Handling
  if (pathname.startsWith("/api")) {
    if (req.method === "OPTIONS") {
      if (isAllowed || !origin) {
        return new NextResponse(null, {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": origin || "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Language, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Platform, X-Client-Version",
            "Access-Control-Allow-Credentials": "true",
          },
        });
      }
      return new NextResponse("CORS Error: Origin not allowed", { status: 403 });
    }

    // Normal API request handling
    if (isAllowed || !origin) {
      const response = NextResponse.next();
      if (origin) response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      return response;
    }
  }

  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // 2. Auth & Role Based Redirection
  if (isLoggedIn) {
    // ⚠️ Geliştirme (Preview) için "/" (Anasayfa) yönlendirmesi iptal edildi:
    if (pathname === "/login") {
      return NextResponse.redirect(new URL(getDashboardUrl(userRole), req.url));
    }
    const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, "") || "/";
    if (pathWithoutLocale.startsWith("/admin") && userRole !== "ADMIN") return NextResponse.redirect(new URL("/login", req.url));
    if (pathWithoutLocale.startsWith("/manager") && !["ADMIN", "MANAGER"].includes(userRole!)) return NextResponse.redirect(new URL("/login", req.url));
    if (pathWithoutLocale.startsWith("/worker") && !["ADMIN", "MANAGER", "WORKER", "TEAM_LEAD"].includes(userRole!)) return NextResponse.redirect(new URL("/login", req.url));
    if (pathWithoutLocale.startsWith("/customer") && userRole !== "CUSTOMER") return NextResponse.redirect(new URL("/login", req.url));
  } else {
    const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, "") || "/";
    const protectedPaths = ["/admin", "/manager", "/worker", "/customer"];
    if (protectedPaths.some(path => pathWithoutLocale.startsWith(path))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3. Internationalization
  if (!pathname.startsWith("/api") && !pathname.startsWith("/_next") && !pathname.includes(".")) {
    return intlMiddleware(req);
  }

  return NextResponse.next();
});

function getDashboardUrl(role?: string) {
  switch (role) {
    case "ADMIN": return "/admin";
    case "MANAGER": return "/manager";
    case "CUSTOMER": return "/customer";
    case "WORKER":
    case "TEAM_LEAD": return "/worker";
    default: return "/";
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};