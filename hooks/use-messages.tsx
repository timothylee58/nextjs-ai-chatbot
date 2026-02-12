/**
 * @fileoverview Hook that merges server-loaded messages with real-time streamed
 * messages from the DataStreamProvider.
 *
 * Combines scroll-to-bottom behaviour (via `useScrollToBottom`) with a
 * `hasSentMessage` flag that tracks whether the user has submitted at least one
 * message during the current session. This flag can be used by the UI to
 * conditionally render elements such as a welcome screen versus the chat view.
 */
import type { UseChatHelpers } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { useScrollToBottom } from "./use-scroll-to-bottom";

export function useMessages({
  status,
}: {
  status: UseChatHelpers<ChatMessage>["status"];
}) {
  const {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
  } = useScrollToBottom();

  const [hasSentMessage, setHasSentMessage] = useState(false);

  useEffect(() => {
    if (status === "submitted") {
      setHasSentMessage(true);
    }
  }, [status]);

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  };
}
