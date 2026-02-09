// ═══════════════════════════════════════════════════════════
// NEXUSCHAT — Core Type Definitions
// ═══════════════════════════════════════════════════════════

// ─── User & Presence ───────────────────────────────────────
export type UserStatus = "online" | "away" | "dnd" | "offline";

export type UserRole = "owner" | "admin" | "moderator" | "member" | "guest";

export interface NexusUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  status: UserStatus;
  statusMessage?: string;
  lastSeen?: Date;
  publicKey?: string; // E2EE public key
}

// ─── Messages ──────────────────────────────────────────────
export type MessageTone = "casual" | "polite" | "professional" | "friendly";

export type ReactionEmoji = string;

export interface MessageReaction {
  emoji: ReactionEmoji;
  users: string[]; // user IDs
  count: number;
}

export interface MessageAttachment {
  id: string;
  type: "image" | "video" | "audio" | "file" | "voice-note";
  url: string;
  name: string;
  size: number;
  mimeType: string;
  duration?: number; // for audio/video in seconds
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface ThreadInfo {
  parentId: string;
  replyCount: number;
  lastReplyAt: Date;
  participants: string[];
}

export interface NexusMessage {
  id: string;
  chatId: string;
  senderId: string;
  sender: NexusUser;
  content: string;
  type: "text" | "system" | "ai-summary" | "announcement";
  createdAt: Date;
  editedAt?: Date;
  readBy: string[];
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  replyTo?: string; // message ID for thread
  thread?: ThreadInfo;
  tone?: MessageTone;
  translation?: {
    originalLang: string;
    translatedLang: string;
    translatedContent: string;
  };
  isDisappearing?: boolean;
  disappearAt?: Date;
  isBookmarked?: boolean;
  isPinned?: boolean;
  isEncrypted: boolean;
}

// ─── Chat / Conversation ───────────────────────────────────
export type ChatType = "direct" | "group" | "channel" | "community";

export type ChatVisibility = "public" | "private" | "secret";

export interface ChatFolder {
  id: string;
  name: string;
  color: string;
  icon?: string;
  chatIds: string[];
  isAIGenerated?: boolean;
}

export interface NexusChat {
  id: string;
  type: ChatType;
  name?: string;
  description?: string;
  avatar?: string;
  members: NexusUser[];
  admins: string[];
  lastMessage?: NexusMessage;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  visibility: ChatVisibility;
  folderId?: string;
  encryptionEnabled: boolean;
  disappearingMode?: {
    enabled: boolean;
    duration: number; // seconds
  };
  createdAt: Date;
  updatedAt: Date;
}

// ─── AI Features ───────────────────────────────────────────
export interface AISummary {
  id: string;
  chatId: string;
  content: string;
  messageRange: {
    from: string; // message ID
    to: string;
  };
  keyPoints: string[];
  actionItems: string[];
  createdAt: Date;
}

export interface SmartReply {
  id: string;
  text: string;
  tone: MessageTone;
  confidence: number;
}

export interface ToneAnalysis {
  original: string;
  suggestions: {
    tone: MessageTone;
    text: string;
  }[];
}

export interface AISearchResult {
  messageId: string;
  chatId: string;
  snippet: string;
  relevanceScore: number;
  sender: NexusUser;
  date: Date;
}

// ─── Community ─────────────────────────────────────────────
export interface CommunityChannel {
  id: string;
  communityId: string;
  name: string;
  description?: string;
  type: "text" | "voice" | "announcements" | "events";
  position: number;
  isPrivate: boolean;
  memberCount: number;
}

export interface CommunityCategory {
  id: string;
  name: string;
  channels: CommunityChannel[];
  position: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner?: string;
  memberCount: number;
  onlineCount: number;
  categories: CommunityCategory[];
  roles: {
    id: string;
    name: string;
    color: string;
    permissions: string[];
  }[];
  createdAt: Date;
}

// ─── Polls & Events ────────────────────────────────────────
export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  creatorId: string;
  isAnonymous: boolean;
  isMultiChoice: boolean;
  endsAt?: Date;
  createdAt: Date;
}

export interface ChatEvent {
  id: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt?: Date;
  location?: string;
  attendees: string[];
  createdBy: string;
}

// ─── Voice & Video ─────────────────────────────────────────
export type CallStatus = "ringing" | "active" | "ended" | "missed";

export interface VoiceRoom {
  id: string;
  name: string;
  hostId: string;
  participants: {
    user: NexusUser;
    isMuted: boolean;
    isSpeaking: boolean;
    joinedAt: Date;
  }[];
  isLive: boolean;
  maxParticipants: number;
  liveCaptionsEnabled: boolean;
  noiseSuppressionEnabled: boolean;
  createdAt: Date;
}

export interface Call {
  id: string;
  type: "voice" | "video";
  status: CallStatus;
  participants: NexusUser[];
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
}

// ─── Privacy ───────────────────────────────────────────────
export interface EncryptionStatus {
  enabled: boolean;
  protocol: "signal" | "custom-e2ee";
  keyFingerprint?: string;
  lastVerified?: Date;
}

export interface ScreenshotAlert {
  id: string;
  userId: string;
  chatId: string;
  detectedAt: Date;
}

// ─── Reminders & Bookmarks ─────────────────────────────────
export interface Reminder {
  id: string;
  messageId: string;
  chatId: string;
  remindAt: Date;
  note?: string;
  isCompleted: boolean;
}

export interface Bookmark {
  id: string;
  messageId: string;
  chatId: string;
  label?: string;
  createdAt: Date;
}

// ─── Navigation ────────────────────────────────────────────
export type NavSection =
  | "chats"
  | "communities"
  | "calls"
  | "contacts"
  | "settings"
  | "ai-search";
