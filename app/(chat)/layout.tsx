/**
 * Chat Layout — app/(chat)/layout.tsx
 *
 * Shared layout for all chat routes (new chat + existing chat pages).
 * Wraps children with:
 *   1. Pyodide script — in-browser Python runtime for code execution artifacts
 *   2. DataStreamProvider — React context for real-time AI response streaming
 *   3. SidebarProvider + AppSidebar — collapsible sidebar with chat history
 *
 * The SidebarWrapper is an async Server Component that:
 *   - Reads the auth session to show user info in the sidebar
 *   - Reads the sidebar_state cookie to restore open/collapsed state
 */
import { cookies } from "next/headers";
import Script from "next/script";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <Suspense fallback={<div className="flex h-dvh" />}>
          <SidebarWrapper>{children}</SidebarWrapper>
        </Suspense>
      </DataStreamProvider>
    </>
  );
}

async function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
