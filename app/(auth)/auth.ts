/**
 * Authentication Setup — app/(auth)/auth.ts
 *
 * Configures NextAuth.js (Auth.js v5) with two credential-based providers:
 *   1. Email/password login — validates against bcrypt-hashed passwords in the DB
 *   2. Guest login — auto-creates a temporary anonymous user
 *
 * Also extends the NextAuth type system to include custom fields:
 *   - user.type ("guest" | "regular") — distinguishes anonymous vs registered users
 *   - token.id — persists user ID in the JWT for session access
 *
 * Exports: auth (session getter), signIn, signOut, GET/POST (API route handlers)
 */
import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { DUMMY_PASSWORD } from "@/lib/constants";
import { createGuestUser, getUser } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

/** Identifies whether a user signed up or is browsing anonymously */
export type UserType = "guest" | "regular";

/* ─── Type Augmentation ────────────────────────────────────────────
   Extends NextAuth's built-in Session and JWT types to carry our
   custom fields (id, type) through the auth pipeline:
   Provider → JWT callback → Session callback → useSession() hook
   ─────────────────────────────────────────────────────────────────── */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession["user"];
  }

  // biome-ignore lint/nursery/useConsistentTypeDefinitions: "Required"
  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    /* Provider 1: Email/Password login
       Looks up the user by email, then compares the submitted password
       against the bcrypt hash stored in the database. If the user doesn't
       exist, we still run compare() against a dummy hash to prevent
       timing attacks (attacker can't tell if the email exists). */
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return { ...user, type: "regular" };
      },
    }),
    /* Provider 2: Guest login
       Creates a new anonymous user in the DB and signs them in immediately.
       Triggered via the /api/auth/guest endpoint. */
    Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: "guest" };
      },
    }),
  ],
  /* ─── JWT & Session Callbacks ──────────────────────────────────
     jwt(): Runs when a JWT is created/updated. Copies user.id and
            user.type into the token so they persist across requests.
     session(): Runs when session is read. Copies token fields into
                the session object returned by useSession()/auth().
     ─────────────────────────────────────────────────────────────── */
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      return session;
    },
  },
});
