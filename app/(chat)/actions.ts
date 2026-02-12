/**
 * @fileoverview Chat Server Actions
 *
 * Contains Next.js server actions used by the chat UI:
 *
 * - {@link saveChatModelAsCookie} - Persists the user's preferred AI model
 *   selection as a cookie for future sessions.
 * - {@link generateTitleFromUserMessage} - Uses AI (via the title model) to
 *   generate a concise chat title from the user's first message.
 * - {@link deleteTrailingMessages} - Removes all messages in a chat after a
 *   given message's timestamp, used for edit/retry workflows.
 * - {@link updateChatVisibility} - Toggles a chat's visibility between
 *   "public" and "private".
 *
 * @module app/(chat)/actions
 */

"use server";

import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import type { VisibilityType } from "@/components/visibility-selector";
import { titlePrompt } from "@/lib/ai/prompts";
import { getTitleModel } from "@/lib/ai/providers";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisibilityById,
} from "@/lib/db/queries";
import { getTextFromMessage } from "@/lib/utils";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: getTitleModel(),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisibilityById({ chatId, visibility });
}
