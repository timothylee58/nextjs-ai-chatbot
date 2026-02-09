"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  Pin,
  Archive,
  MoreHorizontal,
  ChevronDown,
  X,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import type { NavSection, NexusChat, NexusUser, UserStatus } from "@/lib/nexus-types";

// ─── Mock Data for Demo ────────────────────────────────────
const MOCK_CHATS: NexusChat[] = [
  {
    id: "1",
    type: "direct",
    name: "Sarah Chen",
    members: [],
    admins: [],
    unreadCount: 3,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    visibility: "private",
    encryptionEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessage: {
      id: "m1",
      chatId: "1",
      senderId: "u2",
      sender: { id: "u2", name: "Sarah Chen", username: "sarah", status: "online" },
      content: "The new design looks amazing! 🎨",
      type: "text",
      createdAt: new Date(Date.now() - 120000),
      readBy: [],
      reactions: [],
      attachments: [],
      isEncrypted: true,
    },
  },
  {
    id: "2",
    type: "group",
    name: "Product Team",
    members: [],
    admins: [],
    unreadCount: 12,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    visibility: "private",
    encryptionEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 300000),
    lastMessage: {
      id: "m2",
      chatId: "2",
      senderId: "u3",
      sender: { id: "u3", name: "Alex Kim", username: "alex", status: "away" },
      content: "Let's sync on the sprint goals",
      type: "text",
      createdAt: new Date(Date.now() - 300000),
      readBy: [],
      reactions: [],
      attachments: [],
      isEncrypted: true,
    },
  },
  {
    id: "3",
    type: "direct",
    name: "James Wright",
    members: [],
    admins: [],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    visibility: "private",
    encryptionEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 3600000),
    lastMessage: {
      id: "m3",
      chatId: "3",
      senderId: "me",
      sender: { id: "me", name: "You", username: "you", status: "online" },
      content: "Thanks for the code review!",
      type: "text",
      createdAt: new Date(Date.now() - 3600000),
      readBy: ["u4"],
      reactions: [],
      attachments: [],
      isEncrypted: true,
    },
  },
  {
    id: "4",
    type: "group",
    name: "Design Critique",
    members: [],
    admins: [],
    unreadCount: 5,
    isPinned: false,
    isMuted: true,
    isArchived: false,
    visibility: "private",
    encryptionEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 7200000),
    lastMessage: {
      id: "m4",
      chatId: "4",
      senderId: "u5",
      sender: { id: "u5", name: "Mia Torres", username: "mia", status: "offline" },
      content: "Shared a new Figma prototype",
      type: "text",
      createdAt: new Date(Date.now() - 7200000),
      readBy: [],
      reactions: [],
      attachments: [],
      isEncrypted: true,
    },
  },
];

interface ChatSidebarProps {
  activeSection: NavSection;
  onClose: () => void;
  activeChatId?: string;
  onChatSelect?: (chatId: string) => void;
}

/**
 * ChatSidebar — 320px sidebar panel showing chat list, search, and folders.
 *
 * ┌────────────────────┐
 * │ Header + Search    │  56px
 * ├────────────────────┤
 * │ Folder Tabs        │  40px (optional)
 * ├────────────────────┤
 * │                    │
 * │  Chat List         │  scrollable
 * │  (Pinned first)    │
 * │                    │
 * │                    │
 * └────────────────────┘
 */
export function ChatSidebar({
  activeSection,
  onClose,
  activeChatId,
  onChatSelect,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showFolders, setShowFolders] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const filteredChats = MOCK_CHATS.filter(
    (chat) =>
      !searchQuery ||
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pinnedChats = filteredChats.filter((c) => c.isPinned);
  const regularChats = filteredChats.filter((c) => !c.isPinned);

  return (
    <aside
      className="flex w-80 shrink-0 flex-col border-r border-border bg-card"
      role="complementary"
      aria-label="Chat sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-lg font-semibold text-foreground">
          {activeSection === "chats" && "Messages"}
          {activeSection === "communities" && "Communities"}
          {activeSection === "calls" && "Calls"}
          {activeSection === "ai-search" && "AI Search"}
          {activeSection === "contacts" && "Contacts"}
          {activeSection === "settings" && "Settings"}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Chat folders"
            onClick={() => setShowFolders(!showFolders)}
          >
            <FolderOpen className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="New chat"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Search chats"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Search suggestion */}
      {searchQuery.length > 2 && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs text-primary">
            Try AI search: &quot;{searchQuery}&quot;
          </span>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2" role="list" aria-label="Chat list">
        {/* Pinned section */}
        {pinnedChats.length > 0 && (
          <div className="mb-1">
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <Pin className="size-3 text-muted-foreground" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pinned
              </span>
            </div>
            {pinnedChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onClick={() => onChatSelect?.(chat.id)}
              />
            ))}
          </div>
        )}

        {/* All chats */}
        <div>
          {pinnedChats.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent
              </span>
            </div>
          )}
          {regularChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onClick={() => onChatSelect?.(chat.id)}
            />
          ))}
        </div>

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-3 size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No chats found</p>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Chat List Item ────────────────────────────────────────
function ChatListItem({
  chat,
  isActive,
  onClick,
}: {
  chat: NexusChat;
  isActive: boolean;
  onClick: () => void;
}) {
  const timeAgo = getRelativeTime(chat.updatedAt);
  const statusColors: Record<UserStatus, string> = {
    online: "bg-emerald-500",
    away: "bg-amber-500",
    dnd: "bg-red-500",
    offline: "bg-gray-400 dark:bg-gray-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-primary/10 text-foreground"
          : "hover:bg-secondary/70 text-foreground",
      )}
      role="listitem"
      aria-label={`Chat with ${chat.name}, ${chat.unreadCount} unread messages`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-full text-sm font-semibold",
            chat.type === "group"
              ? "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"
              : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary",
          )}
        >
          {chat.name?.charAt(0).toUpperCase()}
        </div>
        {chat.type === "direct" && (
          <span
            className={cn(
              "nexus-online-dot absolute -bottom-0.5 -right-0.5 size-3 rounded-full",
              statusColors[chat.lastMessage?.sender.status || "offline"],
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold">{chat.name}</span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {timeAgo}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-muted-foreground">
            {chat.lastMessage?.senderId === "me" && (
              <span className="text-muted-foreground/70">You: </span>
            )}
            {chat.lastMessage?.content}
          </p>
          {chat.unreadCount > 0 && (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Helpers ───────────────────────────────────────────────
function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
