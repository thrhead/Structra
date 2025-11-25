import { auth } from "@/lib/auth"
import { jwtVerify } from "jose"

export async function verifyAuth(req: Request) {
    // 1. Check NextAuth session (Cookies)
    const session = await auth()
    if (session) return session

    // 2. Check Authorization header (Mobile)
    const authHeader = req.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1]
        try {
            const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback_secret")
            const { payload } = await jwtVerify(token, secret)

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
            // Token invalid or expired
            return null
        }
    }

    return null
}
