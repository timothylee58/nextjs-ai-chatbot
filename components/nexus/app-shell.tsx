"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { NavigationRail } from "./navigation-rail";
import { ChatSidebar } from "./chat-sidebar";
import { ChatFolders } from "./chat-folders";
import type { NavSection } from "@/lib/nexus-types";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AppShell — The root layout container for NexusChat.
 *
 * Layout (desktop):
 * ┌──────┬───────────┬──────────────────────────┐
 * │ Nav  │ Sidebar   │  Main Content Area       │
 * │ Rail │ (320px)   │  (fluid)                 │
 * │(72px)│           │                          │
 * │      │           │                          │
 * │      │           │                          │
 * └──────┴───────────┴──────────────────────────┘
 *
 * Layout (mobile):
 * ┌──────────────────────────────────────────────┐
 * │  Main Content Area (full width)              │
 * │                                              │
 * │                                              │
 * ├──────────────────────────────────────────────┤
 * │  Bottom Navigation Bar (64px)                │
 * └──────────────────────────────────────────────┘
 */
export function AppShell({ children, className }: AppShellProps) {
  const [activeSection, setActiveSection] =
    React.useState<NavSection>("chats");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={cn(
        "flex h-dvh w-full overflow-hidden bg-background",
        className,
      )}
    >
      {/* Navigation Rail — hidden on mobile, shown at bottom */}
      {!isMobile && (
        <NavigationRail
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      )}

      {/* Sidebar Panel */}
      {sidebarOpen && !isMobile && (
        <ChatSidebar
          activeSection={activeSection}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      )}
    </div>
  );
}

// ─── Mobile Bottom Navigation ──────────────────────────────
import {
  MessageCircle,
  Users,
  Phone,
  Search,
  Settings,
} from "lucide-react";

interface MobileBottomNavProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

function MobileBottomNav({
  activeSection,
  onSectionChange,
}: MobileBottomNavProps) {
  const navItems: { section: NavSection; icon: React.ElementType; label: string }[] = [
    { section: "chats", icon: MessageCircle, label: "Chats" },
    { section: "communities", icon: Users, label: "Groups" },
    { section: "calls", icon: Phone, label: "Calls" },
    { section: "ai-search", icon: Search, label: "Search" },
    { section: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav
      className="flex h-16 shrink-0 items-center justify-around border-t border-border bg-card px-2"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map(({ section, icon: Icon, label }) => (
        <button
          key={section}
          type="button"
          onClick={() => onSectionChange(section)}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors",
            activeSection === section
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-current={activeSection === section ? "page" : undefined}
          aria-label={label}
        >
          <Icon
            className={cn(
              "size-5 transition-all",
              activeSection === section && "scale-110",
            )}
          />
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
