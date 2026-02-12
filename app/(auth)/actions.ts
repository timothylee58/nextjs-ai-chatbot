/**
 * Auth Server Actions — app/(auth)/actions.ts
 *
 * Server-side form handlers for login and registration.
 * These are called by React's useActionState() hook from the login/register pages.
 *
 * Flow:
 *   1. Client submits form → FormData sent to server action
 *   2. Zod validates email/password format
 *   3. Action calls signIn() (login) or createUser() + signIn() (register)
 *   4. Returns a status object that the client uses to show toasts / redirect
 */
"use server";

import { z } from "zod";

import { createUser, getUser } from "@/lib/db/queries";

import { signIn } from "./auth";

/** Validates that email is valid and password is at least 6 characters */
const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** State machine for the login form — drives UI feedback (loading, error, success) */
export type LoginActionState = {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
};

/** Server action: validate credentials and sign the user in via NextAuth */
export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

/** State machine for the registration form */
export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
};

/** Server action: create a new user in the DB, then auto-sign them in */
export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password);
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
