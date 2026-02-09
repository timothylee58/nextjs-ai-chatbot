"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Captions,
  Volume2,
  Hand,
  Users,
} from "lucide-react";
import type { VoiceRoom as VoiceRoomType, NexusUser } from "@/lib/nexus-types";

// ─── Mock Participants ─────────────────────────────────────
const MOCK_PARTICIPANTS: VoiceRoomType["participants"] = [
  {
    user: { id: "u1", name: "You", username: "you", status: "online" },
    isMuted: false,
    isSpeaking: true,
    joinedAt: new Date(),
  },
  {
    user: { id: "u2", name: "Sarah Chen", username: "sarah", status: "online" },
    isMuted: false,
    isSpeaking: false,
    joinedAt: new Date(),
  },
  {
    user: { id: "u3", name: "Alex Kim", username: "alex", status: "online" },
    isMuted: true,
    isSpeaking: false,
    joinedAt: new Date(),
  },
  {
    user: { id: "u4", name: "Mia Torres", username: "mia", status: "online" },
    isMuted: false,
    isSpeaking: false,
    joinedAt: new Date(),
  },
];

interface VoiceRoomProps {
  roomName?: string;
  className?: string;
}

/**
 * VoiceRoom — Drop-in audio room with live participants.
 *
 * ┌───────────────────────────────────────────────┐
 * │  🔊 Design Review Room          4 connected  │  Header: 56px
 * ├───────────────────────────────────────────────┤
 * │                                               │
 * │   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐       │
 * │   │ 🟢  │  │     │  │ 🔇  │  │     │       │  Participant circles:
 * │   │  Y  │  │  S  │  │  A  │  │  M  │       │  64px each, 16px gap
 * │   │ You │  │Sarah│  │Alex │  │ Mia │       │  Speaking: pulsing ring
 * │   └─────┘  └─────┘  └─────┘  └─────┘       │  Muted: mic-off badge
 * │                                               │
 * │   ┌─────────────────────────────────────┐     │
 * │   │ 💬 Live captions appear here...     │     │  Caption area: 60px
 * │   └─────────────────────────────────────┘     │
 * │                                               │
 * ├───────────────────────────────────────────────┤
 * │  [🎤 Mute]  [✋ Raise]  [CC]  [📞 Leave]    │  Controls: 64px
 * └───────────────────────────────────────────────┘
 */
export function VoiceRoom({
  roomName = "Design Review Room",
  className,
}: VoiceRoomProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [captionsEnabled, setCaptionsEnabled] = React.useState(true);
  const [handRaised, setHandRaised] = React.useState(false);
  const [caption, setCaption] = React.useState(
    "Sarah: I think the aurora gradient adds a really nice touch to the sidebar...",
  );
  const participants = MOCK_PARTICIPANTS;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
      role="region"
      aria-label={`Voice room: ${roomName}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10">
              <Volume2 className="size-4 text-emerald-500" />
            </div>
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{roomName}</h3>
            <p className="text-[11px] text-muted-foreground">
              {participants.length} connected
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Room settings"
        >
          <Settings className="size-4" />
        </button>
      </div>

      {/* Participants Grid */}
      <div className="flex flex-1 items-center justify-center px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {participants.map((participant) => (
            <div
              key={participant.user.id}
              className="flex flex-col items-center gap-2"
            >
              {/* Avatar with speaking ring */}
              <div className="relative">
                {participant.isSpeaking && (
                  <div className="nexus-pulse-ring absolute inset-0 rounded-full border-2 border-emerald-500" />
                )}
                <div
                  className={cn(
                    "flex size-16 items-center justify-center rounded-full text-lg font-semibold transition-all",
                    participant.isSpeaking
                      ? "bg-gradient-to-br from-emerald-500/20 to-emerald-400/20 text-emerald-600 ring-2 ring-emerald-500/50 dark:text-emerald-400"
                      : "bg-gradient-to-br from-primary/15 to-accent/15 text-primary",
                  )}
                >
                  {participant.user.name.charAt(0)}
                </div>

                {/* Mute badge */}
                {participant.isMuted && (
                  <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-destructive">
                    <MicOff className="size-3 text-white" />
                  </div>
                )}
              </div>

              {/* Name */}
              <span
                className={cn(
                  "max-w-[80px] truncate text-xs font-medium",
                  participant.isSpeaking
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground",
                )}
              >
                {participant.user.id === "u1" ? "You" : participant.user.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Captions */}
      {captionsEnabled && caption && (
        <div className="mx-4 mb-3 rounded-xl border border-border bg-secondary/50 px-4 py-2.5">
          <div className="mb-1 flex items-center gap-1.5">
            <Captions className="size-3 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Live Caption
            </span>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80">{caption}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 border-t border-border px-5 py-3.5">
        {/* Mute */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl transition-all",
            isMuted
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-foreground hover:bg-secondary/80",
          )}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </button>

        {/* Raise hand */}
        <button
          type="button"
          onClick={() => setHandRaised(!handRaised)}
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl transition-all",
            handRaised
              ? "bg-amber-500/10 text-amber-500"
              : "bg-secondary text-foreground hover:bg-secondary/80",
          )}
          aria-label={handRaised ? "Lower hand" : "Raise hand"}
        >
          <Hand className="size-5" />
        </button>

        {/* Captions toggle */}
        <button
          type="button"
          onClick={() => setCaptionsEnabled(!captionsEnabled)}
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl transition-all",
            captionsEnabled
              ? "bg-primary/10 text-primary"
              : "bg-secondary text-foreground hover:bg-secondary/80",
          )}
          aria-label={captionsEnabled ? "Disable captions" : "Enable captions"}
        >
          <Captions className="size-5" />
        </button>

        {/* Leave */}
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-2xl bg-destructive text-white transition-all hover:bg-destructive/90 active:scale-95"
          aria-label="Leave voice room"
        >
          <PhoneOff className="size-5" />
        </button>
      </div>
    </div>
  );
}
