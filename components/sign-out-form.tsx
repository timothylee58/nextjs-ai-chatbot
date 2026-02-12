/**
 * @module sign-out-form
 * @description Sign out form/button component. Renders a server-action form
 * that triggers the authentication sign-out flow when submitted.
 */
import Form from "next/form";

import { signOut } from "@/app/(auth)/auth";

export const SignOutForm = () => {
  return (
    <Form
      action={async () => {
        "use server";

        await signOut({
          redirectTo: "/",
        });
      }}
      className="w-full"
    >
      <button
        className="w-full px-1 py-0.5 text-left text-red-500"
        type="submit"
      >
        Sign out
      </button>
    </Form>
  );
};
