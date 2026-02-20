import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"
import { loginSchema } from "@/lib/validations-edge"
import { authConfig } from "./auth.config"
import { logAudit, AuditAction } from "./audit"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      phone?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    phone?: string | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.isActive) return null;

          const isPasswordValid = await compare(password, user.passwordHash);
          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: user.role,
            phone: user.phone
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user.id) {
        await logAudit(user.id, AuditAction.LOGIN, {
          email: user.email,
          platform: 'web'
        }, 'web');
      }
    },
    async signOut({ session }) {
      if (session?.user?.id) {
        await logAudit(session.user.id, AuditAction.LOGOUT, {
          email: session.user.email,
          platform: 'web'
        }, 'web');
      }
    }
  }
})
