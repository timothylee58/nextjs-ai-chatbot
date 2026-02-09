"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Phone,
  Video,
  Search,
  Shield,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import type { NexusMessage, NexusUser, SmartReply, AISummary } from "@/lib/nexus-types";
import { MessageBubble } from "./message-bubble";
import { SmartComposer } from "./smart-composer";
import { SmartReplyBar } from "./smart-reply-bar";
import { TypingIndicator } from "./typing-indicator";
import { AISummaryCard } from "./ai-summary-card";
import { EncryptionBadge } from "./encryption-badge";
import { PrivacyShield } from "./privacy-shield";

// ─── Mock Data ─────────────────────────────────────────────
const CURRENT_USER: NexusUser = { id: "me", name: "Timothy", username: "timothy", status: "online" };
const CHAT_PARTNER: NexusUser = { id: "u2", name: "Sarah Chen", username: "sarah", status: "online" };

const MOCK_MESSAGES: NexusMessage[] = [
  {
    id: "m1", chatId: "1", senderId: "u2", sender: CHAT_PARTNER,
    content: "Hey! Have you seen the latest design mockups for NexusChat?",
    type: "text", createdAt: new Date(Date.now() - 3600000),
    readBy: ["me"], reactions: [{ emoji: "👍", users: ["me"], count: 1 }],
    attachments: [], isEncrypted: true,
  },
  {
    id: "m2", chatId: "1", senderId: "me", sender: CURRENT_USER,
    content: "Yes! The Aurora theme looks incredible. Love the violet-to-cyan gradient.",
    type: "text", createdAt: new Date(Date.now() - 3500000),
    readBy: ["u2"], reactions: [{ emoji: "❤️", users: ["u2"], count: 1 }],
    attachments: [], isEncrypted: true,
  },
  {
    id: "m3", chatId: "1", senderId: "u2", sender: CHAT_PARTNER,
    content: "The privacy shield feature is really going to set us apart. No other chat app has real-time screenshot detection with a trust score!",
    type: "text", createdAt: new Date(Date.now() - 3200000),
    readBy: ["me"], reactions: [], attachments: [], isEncrypted: true,
    thread: { parentId: "m3", replyCount: 3, lastReplyAt: new Date(Date.now() - 2800000), participants: ["me", "u2"] },
  },
  {
    id: "m4", chatId: "1", senderId: "me", sender: CURRENT_USER,
    content: "Absolutely. And the AI tone adjuster is going to save so many awkward messages. Imagine rewriting a quick \"ok\" into \"Sounds great, thanks for letting me know!\"",
    type: "text", createdAt: new Date(Date.now() - 2900000),
    readBy: ["u2"], reactions: [{ emoji: "🔥", users: ["u2"], count: 1 }, { emoji: "💯", users: ["u2"], count: 1 }],
    attachments: [], isEncrypted: true,
  },
  {
    id: "m5", chatId: "1", senderId: "u2", sender: CHAT_PARTNER,
    content: "Should we set up a voice room to walk through the community hub design?",
    type: "text", createdAt: new Date(Date.now() - 1800000),
    readBy: ["me"], reactions: [], attachments: [], isEncrypted: true,
  },
  {
    id: "m6", chatId: "1", senderId: "me", sender: CURRENT_USER,
    content: "Great idea! Let me finish this component first and I'll hop in. Maybe 20 minutes?",
    type: "text", createdAt: new Date(Date.now() - 1600000),
    readBy: ["u2"], reactions: [{ emoji: "👍", users: ["u2"], count: 1 }],
    attachments: [], isEncrypted: true,
  },
  {
    id: "m7", chatId: "1", senderId: "u2", sender: CHAT_PARTNER,
    content: "Perfect, I'll set up the room with live captions enabled. The noise suppression is surprisingly good too!",
    type: "text", createdAt: new Date(Date.now() - 600000),
    readBy: ["me"], reactions: [], attachments: [], isEncrypted: true,
    translation: { originalLang: "Korean", translatedLang: "English", translatedContent: "Perfect, I'll set up the room with live captions enabled. The noise suppression is surprisingly good too!" },
  },
];

const MOCK_SUMMARY: AISummary = {
  id: "s1", chatId: "1",
  content: "Discussion about NexusChat's design progress including the Aurora theme, privacy features, and AI-powered tools.",
  messageRange: { from: "m1", to: "m7" },
  keyPoints: [
    "Aurora theme with violet-to-cyan gradient received positive feedback",
    "Privacy shield with screenshot detection is a key differentiator",
    "AI tone adjuster identified as a standout innovation",
    "Voice room with live captions planned for design walkthrough",
  ],
  actionItems: [
    "Finish current component work",
    "Set up voice room for design walkthrough in 20 min",
    "Review community hub design together",
  ],
  createdAt: new Date(Date.now() - 300000),
};

const MOCK_SMART_REPLIES: SmartReply[] = [
  { id: "sr1", text: "Sounds good, joining soon!", tone: "casual", confidence: 0.92 },
  { id: "sr2", text: "Can you share the Figma link?", tone: "professional", confidence: 0.85 },
  { id: "sr3", text: "Love that! 🎉", tone: "friendly", confidence: 0.78 },
];

interface ChatInterfaceProps {
  chatId?: string;
  className?: string;
  onBack?: () => void;
}

/**
 * ChatInterface — Complete chat view combining header, messages, AI features, and composer.
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │  [←]  Sarah Chen  🟢 Online      📞  📹  🔍  🛡️  ⋮  │  Header: 56px
 * ├──────────────────────────────────────────────────────────┤
 * │            🔒 End-to-end encrypted                      │
 * │                                                         │
 * │  ┌──────────────────────────┐                           │
 * │  │ Hey! Have you seen the   │                           │  Messages
 * │  │ latest mockups?          │                           │
 * │  └──────────────────────────┘                           │
 * │                ┌─────────────────────────────┐          │
 * │                │ Yes! Aurora looks incredible │          │
 * │                └─────────────────────────────┘          │
 * │                                                         │
 * │  ┌─ AI Summary ──────────────────────────────┐         │
 * │  │ Discussion about design progress...        │         │
 * │  └────────────────────────────────────────────┘         │
 * │  ● ● ● Sarah is typing...                              │
 * ├──────────────────────────────────────────────────────────┤
 * │ ✨ [Sounds good!] [Share Figma?] [Love that!]     [×]  │  Smart replies
 * ├──────────────────────────────────────────────────────────┤
 * │ 📎  │  Type a message...                   ✨  🎤  ↗  │  Composer
 * │  🔒 End-to-end encrypted                               │
 * └──────────────────────────────────────────────────────────┘
 */
export function ChatInterface({ chatId, className, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState(MOCK_MESSAGES);
  const [showPrivacyShield, setShowPrivacyShield] = React.useState(false);
  const [showSmartReplies, setShowSmartReplies] = React.useState(true);
  const [isTyping, setIsTyping] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (content: string) => {
    const newMsg: NexusMessage = {
      id: `m${Date.now()}`, chatId: "1", senderId: "me", sender: CURRENT_USER,
      content, type: "text", createdAt: new Date(),
      readBy: [], reactions: [], attachments: [], isEncrypted: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setShowSmartReplies(false);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 3000);
  };

  return (
    <div className={cn("relative flex h-full flex-1 flex-col bg-background", className)}>
      {/* ─── Chat Header ─── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            aria-label="Back to chat list"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="relative">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-semibold text-primary">
              S
            </div>
            <span className="nexus-online-dot absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Sarah Chen</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {[
            { icon: Phone, label: "Voice call" },
            { icon: Video, label: "Video call" },
            { icon: Search, label: "Search in chat" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={label}
            >
              <Icon className="size-[18px]" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowPrivacyShield(!showPrivacyShield)}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg transition-colors",
              showPrivacyShield
                ? "bg-emerald-500/10 text-emerald-500"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            aria-label="Privacy shield"
          >
            <Shield className="size-[18px]" />
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="More options"
          >
            <MoreVertical className="size-[18px]" />
          </button>
        </div>
      </header>

      {/* ─── Messages ─── */}
      <div className="flex flex-1 flex-col overflow-y-auto py-4" role="list" aria-label="Messages">
        <div className="flex justify-center px-4 pb-6 pt-2">
          <EncryptionBadge />
        </div>

        {messages.map((msg, i) => {
          const isOwn = msg.senderId === "me";
          const prevMsg = messages[i - 1];
          const showAvatar = !isOwn && (!prevMsg || prevMsg.senderId !== msg.senderId);
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={isOwn}
              showAvatar={showAvatar}
            />
          );
        })}

        <div className="px-4">
          <AISummaryCard summary={MOCK_SUMMARY} />
        </div>

        {isTyping && (
          <div className="px-4 pt-2">
            <TypingIndicator user={CHAT_PARTNER} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Smart Replies ─── */}
      {showSmartReplies && (
        <SmartReplyBar
          replies={MOCK_SMART_REPLIES}
          onSelect={(r) => handleSend(r.text)}
          onDismiss={() => setShowSmartReplies(false)}
        />
      )}

      {/* ─── Composer ─── */}
      <SmartComposer onSend={handleSend} isEncrypted />

      {/* ─── Privacy Shield Overlay ─── */}
      <PrivacyShield isOpen={showPrivacyShield} onClose={() => setShowPrivacyShield(false)} />
    </div>
  );
}
