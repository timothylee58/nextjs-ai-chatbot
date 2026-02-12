/**
 * Guest Login Route — app/(auth)/api/auth/guest/route.ts
 *
 * GET /api/auth/guest?redirectUrl=/
 *
 * Creates an anonymous guest account and signs the user in.
 * If the user already has a valid JWT token (already signed in),
 * redirects them to home instead of creating a duplicate guest.
 *
 * Used by the app to let users try the chatbot without registering.
 */
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
