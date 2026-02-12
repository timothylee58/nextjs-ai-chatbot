/**
 * @fileoverview Hook for managing chat visibility (public or private).
 *
 * Reads the current visibility from the SWR-cached chat history when available,
 * falling back to a locally cached value. When the visibility is changed, the
 * hook optimistically updates the local cache and triggers the
 * `updateChatVisibility` server action to persist the change on the backend.
 */
"use client";

import { useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { updateChatVisibility } from "@/app/(chat)/actions";
import {
  type ChatHistory,
  getChatHistoryPaginationKey,
} from "@/components/sidebar-history";
import type { VisibilityType } from "@/components/visibility-selector";

export function useChatVisibility({
  chatId,
  initialVisibilityType,
}: {
  chatId: string;
  initialVisibilityType: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  const history: ChatHistory = cache.get("/api/history")?.data;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibilityType,
    }
  );

  const visibilityType = useMemo(() => {
    if (!history) {
      return localVisibility;
    }
    const chat = history.chats.find((currentChat) => currentChat.id === chatId);
    if (!chat) {
      return "private";
    }
    return chat.visibility;
  }, [history, chatId, localVisibility]);

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType);
    mutate(unstable_serialize(getChatHistoryPaginationKey));

    updateChatVisibility({
      chatId,
      visibility: updatedVisibilityType,
    });
  };

  return { visibilityType, setVisibilityType };
}
