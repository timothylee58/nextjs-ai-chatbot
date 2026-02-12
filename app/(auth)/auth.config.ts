/**
 * Auth Configuration (Edge-compatible) — app/(auth)/auth.config.ts
 *
 * Minimal NextAuth config that can run in Edge Runtime (middleware).
 * Providers are intentionally empty here because bcrypt requires Node.js —
 * the actual providers are added in auth.ts which only runs on the server.
 *
 * This separation allows Next.js middleware to check auth state without
 * importing Node.js-only dependencies like bcrypt-ts.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",   // Redirect unauthenticated users here
    newUser: "/",        // Redirect newly registered users to home
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {},
} satisfies NextAuthConfig;
