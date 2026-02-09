"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Users,
  Phone,
  Search,
  Settings,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import type { NavSection } from "@/lib/nexus-types";

interface NavigationRailProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

/**
 * NavigationRail — 72px vertical left bar (desktop) / 64px bottom bar (mobile).
 *
 * Desktop (72px wide x full height):
 * ┌──────┐
 * │ Logo │  48px logo area
 * ├──────┤
 * │  💬  │  Nav items: 48x48px touch targets
 * │  👥  │  8px gap between items
 * │  📞  │  Active: violet indicator bar (3x20px) on left
 * │  🔍  │
 * ├──────┤
 * │      │  flex-1 spacer
 * ├──────┤
 * │  🌙  │  Theme toggle
 * │  👤  │  User avatar
 * └──────┘
 *
 * Mobile (100% wide x 64px tall, fixed bottom):
 * ┌────────────────────────────────────┐
 * │  💬   👥   🔍   📞   ⚙️          │
 * └────────────────────────────────────┘
 */
export function NavigationRail({
  activeSection,
  onSectionChange,
}: NavigationRailProps) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const navItems: { section: NavSection; icon: React.ElementType; label: string }[] =
    [
      { section: "chats", icon: MessageSquare, label: "Chats" },
      { section: "communities", icon: Users, label: "Communities" },
      { section: "calls", icon: Phone, label: "Calls" },
      { section: "ai-search", icon: Sparkles, label: "AI Search" },
      { section: "settings", icon: Settings, label: "Settings" },
    ];

  return (
    <>
      {/* ─── Desktop Navigation Rail ─── */}
      <nav
        className="hidden w-[72px] shrink-0 flex-col items-center border-r border-border bg-card py-4 md:flex"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="mb-6 flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
          <span className="text-lg font-bold text-white">N</span>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-1">
          {navItems.map(({ section, icon: Icon, label }) => (
            <button
              key={section}
              type="button"
              onClick={() => onSectionChange(section)}
              className={cn(
                "nexus-nav-indicator group relative flex size-12 items-center justify-center rounded-2xl transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeSection === section
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              data-active={activeSection === section}
              aria-label={label}
              aria-current={activeSection === section ? "page" : undefined}
            >
              <Icon className="size-5" />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex size-12 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>

        {/* User Avatar */}
        <button
          type="button"
          className="mt-2 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-semibold text-primary transition-all hover:shadow-lg"
          aria-label="Profile"
        >
          T
        </button>
      </nav>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur-lg md:hidden"
        role="navigation"
        aria-label="Main navigation"
      >
        {navItems.slice(0, 5).map(({ section, icon: Icon, label }) => (
          <button
            key={section}
            type="button"
            onClick={() => onSectionChange(section)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeSection === section
                ? "text-primary"
                : "text-muted-foreground",
            )}
            aria-label={label}
            aria-current={activeSection === section ? "page" : undefined}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
