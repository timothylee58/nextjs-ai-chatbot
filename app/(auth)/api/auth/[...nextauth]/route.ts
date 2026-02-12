/**
 * NextAuth API Route — app/(auth)/api/auth/[...nextauth]/route.ts
 *
 * Catch-all route that handles all NextAuth.js endpoints:
 *   GET  /api/auth/session     — returns the current session
 *   GET  /api/auth/providers   — lists available auth providers
 *   GET  /api/auth/csrf        — returns CSRF token
 *   POST /api/auth/signin      — processes sign-in
 *   POST /api/auth/signout     — processes sign-out
 *   POST /api/auth/callback/*  — handles provider callbacks
 *
 * Re-exports GET and POST handlers from the central auth.ts config.
 */
// biome-ignore lint/performance/noBarrelFile: "Required"
export { GET, POST } from "@/app/(auth)/auth";
