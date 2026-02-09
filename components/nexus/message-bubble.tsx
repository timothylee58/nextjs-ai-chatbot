"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Reply,
  MoreHorizontal,
  Smile,
  Copy,
  Trash2,
  Pin,
  Bookmark,
  Clock,
  Check,
  CheckCheck,
  Globe,
  Lock,
  Forward,
  Edit3,
} from "lucide-react";
import type { NexusMessage, UserStatus } from "@/lib/nexus-types";

interface MessageBubbleProps {
  message: NexusMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  showSenderName?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onBookmark?: (messageId: string) => void;
}

/**
 * MessageBubble — Individual chat message with reactions, replies, read receipts.
 *
 * Sent (right-aligned):                     Received (left-aligned):
 * ┌────────────────────────────────┐        ┌──────────────────────────────┐
 * │          ┌──────────────────┐  │        │ 🟢 Sarah Chen                │
 * │          │ Hey! How's the   │  │        │ ┌──────────────────┐         │
 * │          │ new feature?     │  │        │ │ It's going great │         │
 * │          └──────────────────┘  │        │ │ Almost done 🎉   │         │
 * │            10:24 AM  ✓✓       │        │ └──────────────────┘         │
 * │            😊2  👍1           │        │   10:25 AM                   │
 * └────────────────────────────────┘        └──────────────────────────────┘
 *
 * max-width: 480px | padding: 10px 14px | radius: 20/20/4/20 (sent)
 * Hover: action bar (react, reply, bookmark, more)
 * Reactions: pills below bubble, toggle on click
 */
export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showSenderName = false,
  onReply,
  onReact,
  onBookmark,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = React.useState(false);
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [showReactionPicker, setShowReactionPicker] = React.useState(false);

  const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  const statusColors: Record<UserStatus, string> = {
    online: "bg-emerald-500",
    away: "bg-amber-500",
    dnd: "bg-red-500",
    offline: "bg-gray-400 dark:bg-gray-600",
  };

  const ReadReceipt = () => {
    if (!isOwn) return null;
    const isRead = message.readBy.length > 0;
    return isRead ? (
      <CheckCheck className="size-3.5 text-accent" />
    ) : (
      <Check className="size-3.5 text-muted-foreground/50" />
    );
  };

  return (
    <div
      className={cn(
        "nexus-msg-enter group relative flex gap-2 px-4 py-0.5",
        isOwn ? "flex-row-reverse" : "flex-row",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowContextMenu(false);
        setShowReactionPicker(false);
      }}
      role="listitem"
      aria-label={`Message from ${message.sender.name}: ${message.content}`}
    >
      {/* Avatar */}
      {showAvatar && !isOwn ? (
        <div className="relative mt-auto shrink-0">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold text-primary">
            {message.sender.name.charAt(0)}
          </div>
          <span
            className={cn(
              "nexus-online-dot absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full",
              statusColors[message.sender.status],
            )}
          />
        </div>
      ) : (
        !isOwn && <div className="w-8 shrink-0" />
      )}

      {/* Message Content */}
      <div
        className={cn(
          "relative flex max-w-[480px] flex-col",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {/* Sender name */}
        {showSenderName && !isOwn && (
          <span className="mb-0.5 ml-1 text-[11px] font-semibold text-primary">
            {message.sender.name}
          </span>
        )}

        {/* Reply reference */}
        {message.replyTo && (
          <div
            className={cn(
              "mb-1 flex items-center gap-1.5 rounded-lg border-l-2 border-primary/40 bg-secondary/50 px-2.5 py-1.5 text-xs text-muted-foreground",
              isOwn ? "ml-auto" : "",
            )}
          >
            <Reply className="size-3" />
            <span className="truncate">Replying to a message</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "relative px-3.5 py-2.5 text-sm leading-relaxed",
            isOwn
              ? "nexus-bubble-sent bg-primary text-primary-foreground"
              : "nexus-bubble-received border border-border bg-card text-foreground",
          )}
        >
          {message.isDisappearing && (
            <div className="mb-1 flex items-center gap-1">
              <Clock className="size-2.5 opacity-60" />
              <span className="text-[9px] opacity-60">Disappearing</span>
            </div>
          )}

          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {message.translation && (
            <div className="mt-2 border-t border-current/10 pt-2">
              <div className="mb-0.5 flex items-center gap-1">
                <Globe className="size-3 opacity-60" />
                <span className="text-[10px] opacity-60">
                  Translated from {message.translation.originalLang}
                </span>
              </div>
              <p className="text-xs opacity-80">
                {message.translation.translatedContent}
              </p>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div
          className={cn(
            "mt-0.5 flex items-center gap-1.5 px-1",
            isOwn ? "flex-row-reverse" : "",
          )}
        >
          <span className="text-[10px] text-muted-foreground/60">
            {formatTime(message.createdAt)}
          </span>
          <ReadReceipt />
          {message.isEncrypted && (
            <Lock className="size-2.5 text-muted-foreground/40" />
          )}
          {message.editedAt && (
            <span className="text-[10px] text-muted-foreground/40">edited</span>
          )}
        </div>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className={cn("mt-1 flex flex-wrap gap-1", isOwn ? "justify-end" : "")}>
            {message.reactions.map((reaction, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onReact?.(message.id, reaction.emoji)}
                className={cn(
                  "nexus-reaction flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all",
                  reaction.users.includes("me")
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-secondary",
                )}
                aria-label={`${reaction.emoji} reaction, ${reaction.count}`}
              >
                <span>{reaction.emoji}</span>
                <span className="text-[10px] font-medium">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Thread preview */}
        {message.thread && message.thread.replyCount > 0 && (
          <button
            type="button"
            className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <Reply className="size-3" />
            {message.thread.replyCount}{" "}
            {message.thread.replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {/* ─── Hover Action Bar ─── */}
      {showActions && (
        <div
          className={cn(
            "absolute top-0 z-10 flex -translate-y-1/2 items-center gap-0.5 rounded-xl border border-border bg-card p-0.5 shadow-lg",
            isOwn ? "right-16" : "left-16",
          )}
        >
          {/* Quick react */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Add reaction"
            >
              <Smile className="size-3.5" />
            </button>
            {showReactionPicker && (
              <div
                className={cn(
                  "absolute bottom-full z-20 mb-1 flex items-center gap-0.5 rounded-xl border border-border bg-card p-1.5 shadow-xl",
                  isOwn ? "right-0" : "left-0",
                )}
              >
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onReact?.(message.id, emoji);
                      setShowReactionPicker(false);
                    }}
                    className="flex size-8 items-center justify-center rounded-lg text-base transition-transform hover:scale-125 hover:bg-secondary"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onReply?.(message.id)}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Reply"
          >
            <Reply className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onBookmark?.(message.id)}
            className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-colors",
              message.isBookmarked
                ? "text-amber-500"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            aria-label={message.isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className={cn("size-3.5", message.isBookmarked && "fill-current")} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowContextMenu(!showContextMenu)}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="More options"
            >
              <MoreHorizontal className="size-3.5" />
            </button>
            {showContextMenu && (
              <div
                className={cn(
                  "absolute top-full z-20 mt-1 min-w-[160px] rounded-xl border border-border bg-card p-1 shadow-xl",
                  isOwn ? "right-0" : "left-0",
                )}
              >
                {[
                  { icon: Copy, label: "Copy text", destructive: false },
                  { icon: Forward, label: "Forward", destructive: false },
                  { icon: Pin, label: message.isPinned ? "Unpin" : "Pin", destructive: false },
                  ...(isOwn ? [{ icon: Edit3, label: "Edit", destructive: false }] : []),
                  ...(isOwn ? [{ icon: Trash2, label: "Delete", destructive: true }] : []),
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                      item.destructive
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
