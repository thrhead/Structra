import { auth } from "@/lib/auth"
import { jwtVerify } from "jose"

export async function verifyAuth(req: Request) {
    console.log('--- verifyAuth Start ---')
    // 1. Check Authorization header (Mobile) first for performance
    const authHeader = req.headers.get("Authorization")
    console.log("verifyAuth: Auth header present:", !!authHeader)

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1]
        console.log("verifyAuth: Bearer token found, length:", token.length);
        try {
            const secretKey = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
            if (!secretKey) {
                console.error("verifyAuth: AUTH_SECRET or NEXTAUTH_SECRET is missing!");
                return null;
            }
            const secret = new TextEncoder().encode(secretKey)
            
            console.log("verifyAuth: Verifying JWT with jose...")
            if (typeof jwtVerify !== 'function') {
                console.error("verifyAuth: jwtVerify is NOT a function!", typeof jwtVerify);
            }
            
            const { payload } = await jwtVerify(token, secret)
            console.log("verifyAuth: JWT verified for user:", payload.id, "Role:", payload.role);

            // Return a session-like object
            return {
                user: {
                    id: payload.id as string,
                    email: payload.email as string,
                    role: payload.role as string,
                    name: payload.name as string,
                    phone: payload.phone as string | undefined
                },
                expires: new Date(payload.exp! * 1000).toISOString()
            }
        } catch (err) {
            console.error("verifyAuth: Token verification failed:", err)
            // If token is invalid, we don't fall back to cookie auth for security reasons
            // (if a token is provided, it must be valid)
            return null
        }
    }

    // 2. Fallback to NextAuth session (Web / Cookies)
    try {
        console.log("verifyAuth: No Bearer token, trying NextAuth auth()...")
        
        let authFn = auth;
        if (typeof authFn !== 'function' && (auth as any)?.auth) {
            authFn = (auth as any).auth;
        }
        
        if (typeof authFn !== 'function') {
            console.error("verifyAuth: auth is NOT a function!", typeof authFn)
            return null
        }

        const session = await authFn()
        console.log("verifyAuth: NextAuth session result:", session ? `User ID: ${session.user?.id}` : 'No session')
        if (session) return session
    } catch (e) {
        console.error("verifyAuth: NextAuth auth() failed:", e)
    }

    return null
}

export async function verifyAdminOrManager(req: Request) {
    const session = await verifyAuth(req)
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
        return null
    }
    return session
}

export async function verifyAdmin(req: Request) {
    const session = await verifyAuth(req)
    if (!session || session.user.role !== 'ADMIN') {
        return null
    }
    return session
}
