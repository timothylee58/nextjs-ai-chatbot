"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Search,
  FileText,
  Image,
  Link2,
  Calendar,
  User,
  X,
  ArrowRight,
  Clock,
} from "lucide-react";
import type { AISearchResult } from "@/lib/nexus-types";

interface AISearchProps {
  className?: string;
}

// ─── Mock Search Results ───────────────────────────────────
const MOCK_RESULTS: AISearchResult[] = [
  {
    messageId: "m10",
    chatId: "2",
    snippet: "Here's the updated Figma link for the dashboard redesign",
    relevanceScore: 0.95,
    sender: { id: "u2", name: "Sarah Chen", username: "sarah", status: "online" },
    date: new Date(Date.now() - 86400000),
  },
  {
    messageId: "m11",
    chatId: "1",
    snippet: "The API documentation is now live at docs.nexuschat.dev",
    relevanceScore: 0.88,
    sender: { id: "u3", name: "Alex Kim", username: "alex", status: "away" },
    date: new Date(Date.now() - 172800000),
  },
  {
    messageId: "m12",
    chatId: "4",
    snippet: "I'll send the quarterly report by end of day Friday",
    relevanceScore: 0.72,
    sender: { id: "u5", name: "Mia Torres", username: "mia", status: "offline" },
    date: new Date(Date.now() - 604800000),
  },
];

const SUGGESTIONS = [
  "Find the file John sent last week",
  "What did we decide about the API redesign?",
  "Show links shared in Product Team",
  "Meeting notes from last Friday",
];

/**
 * AISearch — Natural language search across all conversations.
 *
 * ┌──────────────────────────────────────────────────┐
 * │  ✨ AI Search                                    │
 * │  ┌──────────────────────────────────────────┐    │
 * │  │ 🔍 Find the file John sent last week     │    │  Input: 48px
 * │  └──────────────────────────────────────────┘    │
 * │                                                  │
 * │  Try searching for:                              │
 * │  • "Find the file John sent last week"           │  Suggestions
 * │  • "What did we decide about the API?"           │
 * │  • "Show links shared in Product Team"           │
 * │                                                  │
 * │  ── Results ──────────────────────────────────   │
 * │  ┌──────────────────────────────────────────┐    │
 * │  │ Sarah Chen · Product Team · Yesterday    │    │  Result card: 72px
 * │  │ "Here's the updated Figma link for..."   │    │
 * │  └──────────────────────────────────────────┘    │
 * │  ┌──────────────────────────────────────────┐    │
 * │  │ Alex Kim · Direct · 2 days ago           │    │
 * │  │ "The API documentation is now live..."   │    │
 * │  └──────────────────────────────────────────┘    │
 * └──────────────────────────────────────────────────┘
 */
export function AISearch({ className }: AISearchProps) {
  const [query, setQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState<AISearchResult[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    // Simulate AI search
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setIsSearching(false);
    }, 800);
  };

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">AI Search</h2>
            <p className="text-xs text-muted-foreground">
              Search across all your conversations naturally
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ask anything about your chats..."
            className="h-12 w-full rounded-2xl border border-border bg-secondary/30 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="AI search input"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5">
        {/* No query — show suggestions */}
        {!query && (
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Try searching for:
            </p>
            <div className="space-y-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSearch(suggestion)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left text-sm text-foreground transition-colors hover:bg-secondary/50"
                >
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1">{suggestion}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>

            {/* Quick filters */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Quick filters
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: FileText, label: "Documents" },
                  { icon: Image, label: "Photos" },
                  { icon: Link2, label: "Links" },
                  { icon: Calendar, label: "Events" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSearch(`Show all ${label.toLowerCase()}`)}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Searching indicator */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="nexus-typing-dot size-2 rounded-full bg-primary" />
              <span className="nexus-typing-dot size-2 rounded-full bg-primary" />
              <span className="nexus-typing-dot size-2 rounded-full bg-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Searching your conversations...
            </p>
          </div>
        )}

        {/* Results */}
        {!isSearching && results.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              {results.length} results found
            </p>
            <div className="space-y-2">
              {results.map((result) => (
                <button
                  key={result.messageId}
                  type="button"
                  className="flex w-full items-start gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:bg-secondary/50"
                >
                  {/* Avatar */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/15 text-xs font-semibold text-primary">
                    {result.sender.name.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {result.sender.name}
                      </span>
                      <span>·</span>
                      <Clock className="size-3" />
                      <span>{getRelativeTime(result.date)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-foreground">
                      &ldquo;{result.snippet}&rdquo;
                    </p>
                    {/* Relevance bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${result.relevanceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {Math.round(result.relevanceScore * 100)}% match
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
