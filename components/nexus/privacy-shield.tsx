"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Timer,
  Camera,
  AlertTriangle,
  X,
  ChevronRight,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface PrivacyShieldProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PrivacyShield — Privacy control panel for chat settings.
 *
 * ┌───────────────────────────────────────────────┐
 * │  🛡️ Privacy Shield                    [Close] │
 * ├───────────────────────────────────────────────┤
 * │                                               │
 * │  ┌─────────────────────────────────────────┐  │
 * │  │ 🔒 End-to-End Encryption          [ON] │  │
 * │  │    Signal Protocol · Verified           │  │
 * │  └─────────────────────────────────────────┘  │
 * │                                               │
 * │  ┌─────────────────────────────────────────┐  │
 * │  │ ⏱  Disappearing Messages          [OFF] │  │
 * │  │    Messages auto-delete after timer     │  │
 * │  └─────────────────────────────────────────┘  │
 * │                                               │
 * │  ┌─────────────────────────────────────────┐  │
 * │  │ 📸 Screenshot Detection           [ON]  │  │
 * │  │    Alerts when screenshots are taken    │  │
 * │  └─────────────────────────────────────────┘  │
 * │                                               │
 * │  ┌─────────────────────────────────────────┐  │
 * │  │ 👁  Read Receipts                 [ON]  │  │
 * │  │    Show when messages are read          │  │
 * │  └─────────────────────────────────────────┘  │
 * │                                               │
 * │  ┌─────────────────────────────────────────┐  │
 * │  │ 🔏 Biometric Lock                [OFF] │  │
 * │  │    Require fingerprint to open chat     │  │
 * │  └─────────────────────────────────────────┘  │
 * │                                               │
 * │  [Verify Encryption Keys]                     │
 * │                                               │
 * └───────────────────────────────────────────────┘
 *
 * Width: 360px (overlay panel)
 * Slides in from right on desktop, bottom sheet on mobile
 */
export function PrivacyShield({ className, isOpen, onClose }: PrivacyShieldProps) {
  const [settings, setSettings] = React.useState({
    encryption: true,
    disappearing: false,
    disappearingDuration: 24, // hours
    screenshotDetection: true,
    readReceipts: true,
    biometricLock: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  const privacyItems = [
    {
      key: "encryption" as const,
      icon: Lock,
      label: "End-to-End Encryption",
      description: "Signal Protocol · Verified",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      enabled: settings.encryption,
      locked: true, // Can't turn off
    },
    {
      key: "disappearing" as const,
      icon: Timer,
      label: "Disappearing Messages",
      description: settings.disappearing
        ? `Auto-delete after ${settings.disappearingDuration}h`
        : "Messages persist normally",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      enabled: settings.disappearing,
    },
    {
      key: "screenshotDetection" as const,
      icon: Camera,
      label: "Screenshot Detection",
      description: "Alert when screenshots are taken",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      enabled: settings.screenshotDetection,
    },
    {
      key: "readReceipts" as const,
      icon: Eye,
      label: "Read Receipts",
      description: "Show when messages are read",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      enabled: settings.readReceipts,
    },
    {
      key: "biometricLock" as const,
      icon: Fingerprint,
      label: "Biometric Lock",
      description: "Require fingerprint to open chat",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      enabled: settings.biometricLock,
    },
  ];

  return (
    <div
      className={cn(
        "nexus-slide-up absolute inset-y-0 right-0 z-40 flex w-full flex-col border-l border-border bg-card shadow-2xl md:w-[360px]",
        className,
      )}
      role="dialog"
      aria-label="Privacy Shield settings"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10">
            <Shield className="size-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Privacy Shield
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Control your privacy settings
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close privacy settings"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Privacy Trust Score */}
      <div className="mx-5 mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Privacy Score
            </span>
          </div>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {calculateScore(settings)}/100
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-500/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${calculateScore(settings)}%` }}
          />
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-2">
          {privacyItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl border border-border p-3.5 transition-colors hover:bg-secondary/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    item.bgColor,
                  )}
                >
                  <item.icon className={cn("size-4", item.color)} />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => !item.locked && toggleSetting(item.key)}
                disabled={item.locked}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  item.enabled ? "bg-emerald-500" : "bg-muted",
                  item.locked && "cursor-not-allowed opacity-70",
                )}
                role="switch"
                aria-checked={item.enabled}
                aria-label={`Toggle ${item.label}`}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                    item.enabled && "translate-x-5",
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <Fingerprint className="size-4" />
          Verify Encryption Keys
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Screenshot Alert Component ────────────────────────────
export function ScreenshotAlert({
  userName,
  onDismiss,
}: {
  userName: string;
  onDismiss: () => void;
}) {
  return (
    <div
      className="nexus-msg-enter mx-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
      role="alert"
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/20">
        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
          Screenshot Detected
        </p>
        <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
          {userName} took a screenshot of this chat
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
        aria-label="Dismiss alert"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

// ─── Helper ────────────────────────────────────────────────
function calculateScore(settings: {
  encryption: boolean;
  disappearing: boolean;
  screenshotDetection: boolean;
  readReceipts: boolean;
  biometricLock: boolean;
}): number {
  let score = 0;
  if (settings.encryption) score += 35;
  if (settings.disappearing) score += 20;
  if (settings.screenshotDetection) score += 20;
  if (settings.biometricLock) score += 15;
  if (!settings.readReceipts) score += 10; // More private without receipts
  return score;
}
