"use client";

import type { NexusUser } from "@/lib/nexus-types";

interface TypingIndicatorProps {
  user: NexusUser;
}

/**
 * TypingIndicator — Animated dots showing when a user is typing.
 *
 * ┌──────────────────────────────────────┐
 * │ Avatar  [● ● ●]  Sarah is typing... │
 * └──────────────────────────────────────┘
 *
 * Dots: 6px each, 4px gap, bounce animation staggered by 150ms
 * Container: matches received message bubble alignment
 */
export function TypingIndicator({ user }: TypingIndicatorProps) {
  return (
    <div
      className="flex items-center gap-2 px-1 py-1"
      role="status"
      aria-label={`${user.name} is typing`}
    >
      {/* Avatar */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-semibold text-primary">
        {user.name.charAt(0)}
      </div>

      {/* Typing bubble */}
      <div className="nexus-bubble-received flex items-center gap-1 border border-border bg-card px-4 py-3">
        <span className="nexus-typing-dot inline-block size-1.5 rounded-full bg-muted-foreground/60" />
        <span className="nexus-typing-dot inline-block size-1.5 rounded-full bg-muted-foreground/60" />
        <span className="nexus-typing-dot inline-block size-1.5 rounded-full bg-muted-foreground/60" />
      </div>

      <span className="text-[11px] text-muted-foreground">
        {user.name} is typing...
      </span>
    </div>
  );
}
