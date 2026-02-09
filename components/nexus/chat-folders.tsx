"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Folder,
  FolderOpen,
  Plus,
  Sparkles,
  MoreHorizontal,
  X,
  Pencil,
  Trash2,
  Inbox,
  Users,
  Briefcase,
  Heart,
} from "lucide-react";
import type { ChatFolder } from "@/lib/nexus-types";

// ─── Mock Folders ──────────────────────────────────────────
const MOCK_FOLDERS: ChatFolder[] = [
  { id: "f1", name: "Work", color: "#8b5cf6", icon: "briefcase", chatIds: ["1", "2"], isAIGenerated: false },
  { id: "f2", name: "Friends", color: "#ec4899", icon: "heart", chatIds: ["3"], isAIGenerated: false },
  { id: "f3", name: "Active Projects", color: "#06b6d4", icon: "folder", chatIds: ["2", "4"], isAIGenerated: true },
];

interface ChatFoldersProps {
  activeFolder?: string;
  onFolderSelect: (folderId: string | null) => void;
  className?: string;
}

/**
 * ChatFolders — Folder tabs for organizing chats with AI auto-sorting.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ┌──────┐ ┌────────┐ ┌──────────┐ ┌─────────────────┐ [+]  │
 * │ │ All  │ │💼 Work │ │💗 Friends│ │✨ Active Projects│      │
 * │ └──────┘ └────────┘ └──────────┘ └─────────────────┘      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Height: 40px | Horizontally scrollable
 * AI-generated folders have sparkle indicator
 * Right-click for rename/delete context menu
 */
export function ChatFolders({
  activeFolder,
  onFolderSelect,
  className,
}: ChatFoldersProps) {
  const [folders] = React.useState(MOCK_FOLDERS);
  const [contextMenuId, setContextMenuId] = React.useState<string | null>(null);

  const folderIcons: Record<string, React.ElementType> = {
    briefcase: Briefcase,
    heart: Heart,
    folder: Folder,
    inbox: Inbox,
    users: Users,
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto border-b border-border px-3 py-1.5",
        className,
      )}
      role="tablist"
      aria-label="Chat folders"
    >
      {/* All chats tab */}
      <button
        type="button"
        onClick={() => onFolderSelect(null)}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
          !activeFolder
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
        role="tab"
        aria-selected={!activeFolder}
      >
        <Inbox className="size-3.5" />
        All
      </button>

      {/* Folder tabs */}
      {folders.map((folder) => {
        const Icon = folderIcons[folder.icon || "folder"] || Folder;
        const isActive = activeFolder === folder.id;

        return (
          <div key={folder.id} className="relative">
            <button
              type="button"
              onClick={() => onFolderSelect(folder.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenuId(folder.id);
              }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              role="tab"
              aria-selected={isActive}
            >
              <Icon className="size-3.5" style={{ color: folder.color }} />
              {folder.name}
              {folder.isAIGenerated && (
                <Sparkles className="size-2.5 text-primary" />
              )}
              <span className="ml-0.5 text-[10px] text-muted-foreground/60">
                {folder.chatIds.length}
              </span>
            </button>

            {/* Context menu */}
            {contextMenuId === folder.id && (
              <div className="absolute left-0 top-full z-30 mt-1 min-w-[140px] rounded-xl border border-border bg-card p-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => setContextMenuId(null)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"
                >
                  <Pencil className="size-3" />
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => setContextMenuId(null)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add folder button */}
      <button
        type="button"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Create folder"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
