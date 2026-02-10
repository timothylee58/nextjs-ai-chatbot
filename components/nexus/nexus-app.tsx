"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { NavSection } from "@/lib/nexus-types";
import { NavigationRail } from "./navigation-rail";
import { ChatSidebar } from "./chat-sidebar";
import { ChatInterface } from "./chat-interface";
import { ChatFolders } from "./chat-folders";
import { CommunityHub } from "./community-hub";
import { VoiceRoom } from "./voice-room";
import { AISearch } from "./ai-search";

/**
 * NexusApp — Root shell that composes all NexusChat sections.
 *
 * Desktop Layout (>768px):
 * ┌──────┬────────────────────┬──────────────────────────────────┐
 * │      │                    │                                  │
 * │ Nav  │  Sidebar           │  Main Content                    │
 * │ Rail │  (320px)           │  (fluid, min 480px)              │
 * │      │                    │                                  │
 * │ 72px │  Chat list /       │  ChatInterface / CommunityHub /  │
 * │      │  Community /       │  VoiceRoom / AISearch / Settings  │
 * │      │  AI Search         │                                  │
 * │      │                    │                                  │
 * └──────┴────────────────────┴──────────────────────────────────┘
 *
 * Mobile Layout (<768px):
 * ┌──────────────────────────────────────┐
 * │  Sidebar (full width)               │  ← swipe to chat
 * │  OR                                 │
 * │  Chat Interface (full width)        │  ← back button
 * ├──────────────────────────────────────┤
 * │  Bottom Nav (64px)                  │
 * └──────────────────────────────────────┘
 */
export function NexusApp() {
  const [activeSection, setActiveSection] = React.useState<NavSection>("chats");
  const [activeChatId, setActiveChatId] = React.useState<string | undefined>("1");
<<<<<<< HEAD
  const [activeFolder, setActiveFolder] = React.useState<string | undefined>(undefined);
=======
  const [activeFolder, setActiveFolder] = React.useState<string | null>(null);
>>>>>>> f4b75fd22a6a7c19d67da194e142b01f8c9e7a77
  const [showChat, setShowChat] = React.useState(false); // mobile: toggle sidebar/chat

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setShowChat(true); // mobile: switch to chat view
  };

  const handleBack = () => {
    setShowChat(false); // mobile: back to sidebar
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* ─── Navigation Rail (desktop: left bar, mobile: bottom bar) ─── */}
      <NavigationRail
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setShowChat(false);
        }}
      />

      {/* ─── Sidebar Panel ─── */}
      <div
        className={cn(
          "flex h-full w-full flex-col border-r border-border bg-card md:w-80 md:shrink-0",
          // Mobile: hide sidebar when viewing chat
          showChat ? "hidden md:flex" : "flex",
        )}
      >
        {/* Chats section */}
        {activeSection === "chats" && (
          <>
            <ChatFolders
              activeFolder={activeFolder}
<<<<<<< HEAD
              onFolderSelect={(id) => setActiveFolder(id ?? undefined)}
=======
              onFolderSelect={setActiveFolder}
>>>>>>> f4b75fd22a6a7c19d67da194e142b01f8c9e7a77
            />
            <ChatSidebar
              activeSection={activeSection}
              onClose={() => {}}
              activeChatId={activeChatId}
              onChatSelect={handleChatSelect}
            />
          </>
        )}

        {/* Communities section */}
        {activeSection === "communities" && <CommunityHub />}

        {/* AI Search section */}
        {activeSection === "ai-search" && <AISearch />}

        {/* Calls section */}
        {activeSection === "calls" && (
          <div className="flex flex-1 flex-col">
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-lg font-semibold text-foreground">Calls</h2>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-primary/10">
                <svg
                  className="size-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                No recent calls
              </h3>
              <p className="text-xs text-muted-foreground">
                Start a voice or video call from any chat
              </p>
            </div>

            {/* Voice Room Preview */}
            <div className="p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Active Voice Rooms
              </p>
              <VoiceRoom roomName="Design Review" className="shadow-lg" />
            </div>
          </div>
        )}

        {/* Settings section */}
        {activeSection === "settings" && (
          <div className="flex flex-1 flex-col">
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            </div>
            <div className="space-y-1 px-3 py-2">
              {[
                { label: "Profile", desc: "Manage your identity" },
                { label: "Appearance", desc: "Theme, font, layout" },
                { label: "Notifications", desc: "Sound, badges, alerts" },
                { label: "Privacy & Security", desc: "E2EE, locks, data" },
                { label: "Chat Settings", desc: "Bubbles, reactions, media" },
                { label: "Language", desc: "Translation preferences" },
                { label: "Storage", desc: "Manage local data" },
              ].map(({ label, desc }) => (
                <button
                  key={label}
                  type="button"
                  className="flex w-full flex-col rounded-xl px-4 py-3 text-left transition-colors hover:bg-secondary"
                >
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Main Content Area ─── */}
      <div
        className={cn(
          "flex h-full flex-1 flex-col",
          // Mobile: show chat only when selected
          showChat ? "flex" : "hidden md:flex",
        )}
      >
        {activeSection === "chats" && activeChatId ? (
          <ChatInterface chatId={activeChatId} onBack={handleBack} />
        ) : activeSection === "chats" ? (
          /* Empty state when no chat selected (desktop) */
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="nexus-gradient-text text-3xl font-bold">N</span>
            </div>
            <h2 className="mb-1 text-xl font-bold text-foreground">NexusChat</h2>
            <p className="max-w-xs text-sm text-muted-foreground">
              Select a conversation to start messaging, or create a new chat.
            </p>
          </div>
        ) : activeSection === "communities" ? (
          <ChatInterface onBack={handleBack} />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Select an item from the sidebar
            </p>
          </div>
        )}
      </div>

      {/* Mobile bottom padding for nav bar */}
      <div className="h-16 shrink-0 md:hidden" />
    </div>
  );
}
