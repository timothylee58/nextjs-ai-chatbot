"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Lightbulb,
  X,
} from "lucide-react";
import type { AISummary } from "@/lib/nexus-types";

interface AISummaryCardProps {
  summary: AISummary;
  className?: string;
}

/**
 * AISummaryCard — Inline AI-generated conversation summary.
 *
 * ┌─────────────────────────────────────────────────┐
 * │ ✨ AI Summary               [Expand] [Dismiss] │
 * │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
 * │ Discussion about NexusChat design features      │
 * │                                                 │
 * │ 💡 Key Points:                                  │
 * │ • Aurora theme received positive feedback       │
 * │ • Privacy shield is a differentiating feature   │
 * │ • Tone adjuster identified as key innovation    │
 * │                                                 │
 * │ ☑️ Action Items:                                │
 * │ • Share latest prototype for review             │
 * │ • Set up voice room for design walkthrough      │
 * └─────────────────────────────────────────────────┘
 *
 * Width: 100% with max-width 520px
 * Appears inline in the message stream
 * Collapsible with smooth animation
 */
export function AISummaryCard({ summary, className }: AISummaryCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        "nexus-msg-enter my-3 mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-primary/20",
        "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
        className,
      )}
      role="region"
      aria-label="AI conversation summary"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-primary">
            AI Summary
          </span>
          <span className="text-[10px] text-muted-foreground">
            · {formatTime(summary.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={isExpanded ? "Collapse summary" : "Expand summary"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Dismiss summary"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="space-y-3 px-4 pb-4">
          {/* Summary text */}
          <p className="text-sm leading-relaxed text-foreground">
            {summary.content}
          </p>

          {/* Key Points */}
          {summary.keyPoints.length > 0 && (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="size-3.5 text-amber-500" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Points
                </span>
              </div>
              <ul className="space-y-1">
                {summary.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/40" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {summary.actionItems.length > 0 && (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="size-3.5 text-emerald-500" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Action Items
                </span>
              </div>
              <ul className="space-y-1">
                {summary.actionItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-foreground/80"
                  >
                    <div className="size-3.5 shrink-0 rounded border border-border" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
