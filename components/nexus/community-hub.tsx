"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Hash,
  Volume2,
  Megaphone,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Users,
  Lock,
  Crown,
  Shield,
  Star,
} from "lucide-react";
import type { Community, CommunityChannel } from "@/lib/nexus-types";

// ─── Mock Data ─────────────────────────────────────────────
const MOCK_COMMUNITY: Community = {
  id: "c1",
  name: "NexusChat Devs",
  description: "Official community for NexusChat developers",
  avatar: "",
  memberCount: 2847,
  onlineCount: 312,
  categories: [
    {
      id: "cat1",
      name: "General",
      position: 0,
      channels: [
        { id: "ch1", communityId: "c1", name: "welcome", description: "Say hi!", type: "text", position: 0, isPrivate: false, memberCount: 2847 },
        { id: "ch2", communityId: "c1", name: "announcements", type: "announcements", position: 1, isPrivate: false, memberCount: 2847 },
        { id: "ch3", communityId: "c1", name: "general", type: "text", position: 2, isPrivate: false, memberCount: 2100 },
      ],
    },
    {
      id: "cat2",
      name: "Development",
      position: 1,
      channels: [
        { id: "ch4", communityId: "c1", name: "frontend", type: "text", position: 0, isPrivate: false, memberCount: 890 },
        { id: "ch5", communityId: "c1", name: "backend", type: "text", position: 1, isPrivate: false, memberCount: 720 },
        { id: "ch6", communityId: "c1", name: "design", type: "text", position: 2, isPrivate: false, memberCount: 560 },
        { id: "ch7", communityId: "c1", name: "team-leads", type: "text", position: 3, isPrivate: true, memberCount: 12 },
      ],
    },
    {
      id: "cat3",
      name: "Voice Channels",
      position: 2,
      channels: [
        { id: "ch8", communityId: "c1", name: "Lounge", type: "voice", position: 0, isPrivate: false, memberCount: 0 },
        { id: "ch9", communityId: "c1", name: "Pair Programming", type: "voice", position: 1, isPrivate: false, memberCount: 3 },
      ],
    },
    {
      id: "cat4",
      name: "Events",
      position: 3,
      channels: [
        { id: "ch10", communityId: "c1", name: "upcoming-events", type: "events", position: 0, isPrivate: false, memberCount: 1500 },
      ],
    },
  ],
  roles: [
    { id: "r1", name: "Admin", color: "#ef4444", permissions: ["all"] },
    { id: "r2", name: "Moderator", color: "#8b5cf6", permissions: ["kick", "ban", "mute"] },
    { id: "r3", name: "Contributor", color: "#06b6d4", permissions: ["post"] },
  ],
  createdAt: new Date(),
};

interface CommunityHubProps {
  className?: string;
  onChannelSelect?: (channelId: string) => void;
}

/**
 * CommunityHub — Channel browser for community spaces.
 *
 * ┌────────────────────────────────────────┐
 * │  NexusChat Devs                       │  Banner: 120px
 * │  2,847 members · 312 online           │
 * ├────────────────────────────────────────┤
 * │ ▼ GENERAL                        [+]  │  Category header
 * │   # welcome                           │  Channel: 36px height
 * │   📢 announcements                    │
 * │   # general                           │
 * ├────────────────────────────────────────┤
 * │ ▼ DEVELOPMENT                    [+]  │
 * │   # frontend                          │
 * │   # backend                           │
 * │   🔒 team-leads                       │
 * ├────────────────────────────────────────┤
 * │ ▼ VOICE CHANNELS                      │
 * │   🔊 Lounge                           │
 * │   🔊 Pair Programming (3)             │
 * └────────────────────────────────────────┘
 */
export function CommunityHub({ className, onChannelSelect }: CommunityHubProps) {
  const [collapsedCategories, setCollapsedCategories] = React.useState<Set<string>>(
    new Set(),
  );
  const [activeChannel, setActiveChannel] = React.useState("ch3");

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const community = MOCK_COMMUNITY;

  const channelIcons: Record<CommunityChannel["type"], React.ElementType> = {
    text: Hash,
    voice: Volume2,
    announcements: Megaphone,
    events: Calendar,
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Community Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 px-4 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-bold text-white shadow-lg">
            {community.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {community.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3" />
                {community.memberCount.toLocaleString()}
              </span>
              <span className="size-1 rounded-full bg-emerald-500" />
              <span>{community.onlineCount} online</span>
            </div>
          </div>
        </div>

        {/* Role badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {community.roles.map((role) => (
            <span
              key={role.id}
              className="flex items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-0.5 text-[10px] font-medium"
              style={{ color: role.color }}
            >
              {role.name === "Admin" && <Crown className="size-2.5" />}
              {role.name === "Moderator" && <Shield className="size-2.5" />}
              {role.name === "Contributor" && <Star className="size-2.5" />}
              {role.name}
            </span>
          ))}
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto py-2">
        {community.categories.map((category) => {
          const isCollapsed = collapsedCategories.has(category.id);
          return (
            <div key={category.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="group flex w-full items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {isCollapsed ? (
                  <ChevronRight className="size-3" />
                ) : (
                  <ChevronDown className="size-3" />
                )}
                {category.name}
                <Plus className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 px-2">
                  {category.channels.map((channel) => {
                    const Icon = channelIcons[channel.type];
                    const isActive = activeChannel === channel.id;
                    return (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => {
                          setActiveChannel(channel.id);
                          onChannelSelect?.(channel.id);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {channel.isPrivate ? (
                          <Lock className="size-4 shrink-0" />
                        ) : (
                          <Icon className="size-4 shrink-0" />
                        )}
                        <span className="truncate">{channel.name}</span>
                        {channel.type === "voice" && channel.memberCount > 0 && (
                          <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {channel.memberCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
