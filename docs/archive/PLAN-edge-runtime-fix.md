# Plan: Edge Runtime Compatibility Fix for Next.js Middleware

## Problem Analysis
The application is failing with a 500 Internal Server Error on Vercel.
**Root Cause:** The `middleware.ts` file imports `auth` from `@/lib/auth`. This file imports `prisma` (`@/lib/db`) and `bcryptjs`.
- **Constraint:** Next.js Middleware runs on the **Edge Runtime**.
- **Conflict:** `PrismaClient` and `bcryptjs` depend on Node.js APIs (e.g., `fs`, `crypto`) that are **not available** in the Edge Runtime.

## Solution Strategy
We must decouple the Edge-compatible authentication logic (for Middleware) from the Node.js-dependent logic (for API routes/Server Actions).

### 1. Refactor Authentication Configuration
- **File:** `apps/web/lib/auth.config.ts`
- **Goal:** Make this file 100% Edge-compatible.
- **Action:**
    - Ensure it does NOT import `prisma`, `bcryptjs`, or any Node.js-only modules.
    - It should only contain the `session` strategy, `pages` configuration, and `callbacks`.
    - It should export the `authConfig` object.

### 2. Update Node.js Auth Implementation
- **File:** `apps/web/lib/auth.ts`
- **Goal:** Keep the full authentication logic here (Node.js runtime).
- **Action:**
    - Import `authConfig` from `./auth.config`.
    - Import `prisma` and `bcryptjs`.
    - Configure the `providers` array with the full `CredentialsProvider` logic (including database queries and password hashing).
    - Export `handlers`, `auth`, `signIn`, `signOut`.

### 3. Update Middleware
- **File:** `apps/web/middleware.ts`
- **Goal:** Run authentication checks without crashing the Edge Runtime.
- **Action:**
    - Do NOT import from `@/lib/auth`.
    - Instead, import `NextAuth` from `next-auth`.
    - Import `authConfig` from `@/lib/auth.config`.
    - Initialize NextAuth with the **Edge-compatible** config: `const { auth } = NextAuth(authConfig)`.
    - Use this lightweight `auth` instance for route protection.

### 4. Verification
- **Build Check:** Run `npm run build` to ensure no static generation errors.
- **Runtime Check:** Verify that accessing protected routes redirects to login, and login works (which uses the Node.js runtime API route).

## Execution Plan
1.  **Modify `apps/web/lib/auth.config.ts`**: Ensure strictly Edge-safe code.
2.  **Modify `apps/web/middleware.ts`**: Switch import to use `next-auth` directly with `authConfig`.
3.  **Verify `apps/web/lib/auth.ts`**: Ensure it correctly extends `authConfig`.
