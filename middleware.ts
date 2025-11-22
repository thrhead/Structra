import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/register")
  
  const isDashboardPage = request.nextUrl.pathname.startsWith("/admin") ||
                          request.nextUrl.pathname.startsWith("/manager") ||
                          request.nextUrl.pathname.startsWith("/worker") ||
                          request.nextUrl.pathname.startsWith("/customer")

  // Eğer kullanıcı giriş yapmışsa ve auth sayfasındaysa, dashboard'a yönlendir
  if (session && isAuthPage) {
    const role = session.user?.role?.toLowerCase()
    return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  // Eğer kullanıcı giriş yapmamışsa ve protected sayfadaysa, login'e yönlendir  
  if (!session && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Role-based access control
  if (session && isDashboardPage) {
    const role = session.user?.role?.toLowerCase()
    const currentPath = request.nextUrl.pathname

    // Kullanıcı kendi rolüne ait olmayan bir sayfaya erişmeye çalışıyorsa
    if (!currentPath.startsWith(`/${role}`) && !currentPath.startsWith("/api")) {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/worker/:path*",
    "/customer/:path*",
    "/login",
    "/register",
  ],
}
