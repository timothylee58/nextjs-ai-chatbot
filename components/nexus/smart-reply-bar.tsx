"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, X } from "lucide-react";
import type { SmartReply } from "@/lib/nexus-types";

interface SmartReplyBarProps {
  replies: SmartReply[];
  onSelect: (reply: SmartReply) => void;
  onDismiss: () => void;
  className?: string;
}

/**
 * SmartReplyBar — AI-generated contextual quick replies.
 *
 * ┌────────────────────────────────────────────────────────────┐
 * │ ✨ ┌──────────────┐ ┌────────────────┐ ┌──────────┐  [×] │
 * │    │ Sounds good! │ │ Let me check   │ │ Thanks!  │      │
 * │    └──────────────┘ └────────────────┘ └──────────┘      │
 * └────────────────────────────────────────────────────────────┘
 *
 * Appears above the composer when AI detects reply context.
 * Horizontally scrollable on mobile. Pills are 32px height.
 * Dismiss with X button or after selecting a reply.
 */
export function SmartReplyBar({
  replies,
  onSelect,
  onDismiss,
  className,
}: SmartReplyBarProps) {
  if (replies.length === 0) return null;

  return (
    <div
      className={cn(
        "nexus-msg-enter flex items-center gap-2 border-t border-primary/10 bg-primary/[0.03] px-4 py-2",
        className,
      )}
      role="region"
      aria-label="Smart reply suggestions"
    >
      <Sparkles className="size-3.5 shrink-0 text-primary" />

      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {replies.map((reply) => (
          <button
            key={reply.id}
            type="button"
            onClick={() => onSelect(reply)}
            className="shrink-0 rounded-full border border-primary/20 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
          >
            {reply.text}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Dismiss suggestions"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
