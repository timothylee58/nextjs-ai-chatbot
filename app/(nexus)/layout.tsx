/**
 * @file layout.tsx
 * @description Nexus Layout. The (nexus) route group provides an alternative
 * layout for the Nexus feature, separate from the main chat layout. It defines
 * page metadata (title and description) and renders child routes within a
 * minimal wrapper fragment.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexusChat — Next-Gen Messaging",
  description:
    "Real-time messaging, AI assistance, and privacy-by-design in one beautiful app.",
};

export default function NexusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
