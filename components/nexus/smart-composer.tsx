"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  Image as ImageIcon,
  X,
  Sparkles,
  Globe,
  AlertTriangle,
  ChevronDown,
  Camera,
  FileText,
  Lock,
} from "lucide-react";
import type { MessageTone } from "@/lib/nexus-types";

interface SmartComposerProps {
  onSend: (content: string) => void;
  isEncrypted?: boolean;
  placeholder?: string;
}

/**
 * SmartComposer — Enhanced message input with AI tone adjuster, attachments, and voice notes.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │ ┌ Tone bar (when active) ─────────────────────────────┐ │
 * │ │ Casual · Polite · Professional · Friendly           │ │
 * │ └────────────────────────────────────────────────────-─┘ │
 * ├─────────────────────────────────────────────────────────┤
 * │ 📎  📷  │  Type a message...              🎤  😀  ✨  │ │
 * │         │                                   ↗ Send    │ │
 * │  [🔒 E2EE]                                            │ │
 * └─────────────────────────────────────────────────────────┘
 *
 * Min height: 56px | Max height: 160px (auto-grows)
 * Textarea auto-resizes with content
 */
export function SmartComposer({
  onSend,
  isEncrypted = false,
  placeholder = "Type a message...",
}: SmartComposerProps) {
  const [message, setMessage] = React.useState("");
  const [showToneBar, setShowToneBar] = React.useState(false);
  const [selectedTone, setSelectedTone] = React.useState<MessageTone | null>(null);
  const [tonePreview, setTonePreview] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [showAttachMenu, setShowAttachMenu] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const content = tonePreview || message;
    if (!content.trim()) return;
    onSend(content.trim());
    setMessage("");
    setTonePreview(null);
    setSelectedTone(null);
    setShowToneBar(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToneSelect = (tone: MessageTone) => {
    setSelectedTone(tone);
    // Simulate AI tone adjustment
    const toneMap: Record<MessageTone, (text: string) => string> = {
      casual: (t) => t.replace(/\.$/, "!").replace(/please /gi, ""),
      polite: (t) =>
        t.startsWith("Could")
          ? t
          : `Could you please ${t.charAt(0).toLowerCase()}${t.slice(1)}`,
      professional: (t) =>
        `I'd like to bring to your attention: ${t.charAt(0).toLowerCase()}${t.slice(1)}`,
      friendly: (t) => `Hey! ${t} 😊`,
    };
    if (message.trim()) {
      setTonePreview(toneMap[tone](message));
    }
  };

  const tones: { tone: MessageTone; emoji: string; label: string }[] = [
    { tone: "casual", emoji: "😎", label: "Casual" },
    { tone: "polite", emoji: "🤝", label: "Polite" },
    { tone: "professional", emoji: "💼", label: "Professional" },
    { tone: "friendly", emoji: "😊", label: "Friendly" },
  ];

  return (
    <div className="shrink-0 border-t border-border bg-card">
      {/* Tone Adjuster Bar */}
      {showToneBar && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-[11px] font-medium text-muted-foreground">
            Adjust tone:
          </span>
          <div className="flex items-center gap-1">
            {tones.map(({ tone, emoji, label }) => (
              <button
                key={tone}
                type="button"
                onClick={() => handleToneSelect(tone)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                  selectedTone === tone
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
                aria-pressed={selectedTone === tone}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowToneBar(false);
              setTonePreview(null);
              setSelectedTone(null);
            }}
            className="ml-auto rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close tone adjuster"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Tone Preview */}
      {tonePreview && (
        <div className="flex items-start gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2">
          <Sparkles className="mt-0.5 size-3.5 text-primary" />
          <div className="flex-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
              {selectedTone} tone preview
            </span>
            <p className="mt-0.5 text-sm text-foreground">{tonePreview}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setMessage(tonePreview);
                setTonePreview(null);
              }}
              className="rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setTonePreview(null);
                setSelectedTone(null);
              }}
              className="rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="flex items-end gap-2 px-3 py-2">
        {/* Attachment Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Attach file"
          >
            <Paperclip className="size-[18px]" />
          </button>

          {/* Attachment Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 z-20 mb-2 min-w-[180px] rounded-xl border border-border bg-card p-1.5 shadow-xl">
              {[
                { icon: ImageIcon, label: "Photo or Video", color: "text-blue-500" },
                { icon: Camera, label: "Camera", color: "text-green-500" },
                { icon: FileText, label: "Document", color: "text-amber-500" },
              ].map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setShowAttachMenu(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  <Icon className={cn("size-4", color)} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="relative flex min-h-[40px] flex-1 items-center rounded-2xl border border-border bg-secondary/30 transition-colors focus-within:border-primary/50 focus-within:bg-secondary/50">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="max-h-[160px] min-h-[40px] flex-1 resize-none bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Message input"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-0.5">
          {/* Tone Adjuster Toggle */}
          <button
            type="button"
            onClick={() => setShowToneBar(!showToneBar)}
            className={cn(
              "flex size-9 items-center justify-center rounded-xl transition-colors",
              showToneBar
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            aria-label="AI tone adjuster"
            aria-pressed={showToneBar}
          >
            <Sparkles className="size-[18px]" />
          </button>

          {/* Voice Note / Send */}
          {message.trim() ? (
            <button
              type="button"
              onClick={handleSend}
              className="nexus-glow flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              aria-label="Send message"
            >
              <Send className="size-[18px]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                "flex size-9 items-center justify-center rounded-xl transition-colors",
                isRecording
                  ? "bg-destructive text-destructive-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              aria-label={isRecording ? "Stop recording" : "Record voice note"}
            >
              <Mic className={cn("size-[18px]", isRecording && "animate-pulse")} />
            </button>
          )}
        </div>
      </div>

      {/* E2EE indicator */}
      {isEncrypted && (
        <div className="flex items-center justify-center gap-1 pb-1.5 text-[10px] text-muted-foreground/60">
          <Lock className="size-2.5" />
          <span>End-to-end encrypted</span>
        </div>
      )}
    </div>
  );
}
