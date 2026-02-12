/**
 * @file client-providers.tsx
 * @description Client-side provider wrapper. This "use client" component wraps
 * children with ThemeProvider (dark/light mode via next-themes), SessionProvider
 * (NextAuth session context), and Toaster (sonner toast notifications). Used in
 * the root layout to isolate client-side providers from the server component tree.
 */

"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <Toaster position="top-center" />
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
