/**
 * @file page.tsx
 * @description Nexus Page. The main page for the Nexus feature, served at the
 * /nexus route. It renders the top-level NexusApp component which contains
 * the full Nexus messaging interface.
 */

import { NexusApp } from "@/components/nexus";

export default function NexusPage() {
  return <NexusApp />;
}
