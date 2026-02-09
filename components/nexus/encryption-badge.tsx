"use client";

import { cn } from "@/lib/utils";
import { Shield, Lock } from "lucide-react";

interface EncryptionBadgeProps {
  className?: string;
}

/**
 * EncryptionBadge — Visual indicator of end-to-end encryption status.
 *
 * ┌───────────────────────────────────────┐
 * │  🛡️ Messages are end-to-end encrypted │
 * └───────────────────────────────────────┘
 *
 * Positioned at the top of chat as a trust signal.
 * Includes shimmer animation on the privacy shield.
 */
export function EncryptionBadge({ className }: EncryptionBadgeProps) {
  return (
    <div
      className={cn(
        "nexus-shield-shimmer relative flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5",
        className,
      )}
      role="status"
      aria-label="This conversation is end-to-end encrypted"
    >
      <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10">
        <Shield className="size-3 text-emerald-600 dark:text-emerald-400" />
      </div>
      <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
        Messages are end-to-end encrypted
      </span>
    </div>
  );
}
