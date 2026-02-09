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
