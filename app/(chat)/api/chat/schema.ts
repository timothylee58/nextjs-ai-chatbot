/**
 * @fileoverview Chat API Request Schema
 *
 * Defines Zod validation schemas for the POST /api/chat request body.
 *
 * The schema supports two distinct flows:
 * - **Single-message flow**: A new user message (`message`) containing text
 *   and/or file parts (JPEG/PNG images) is sent alongside the chat ID.
 * - **Tool-approval flow**: All conversation messages (`messages`) are sent
 *   back to resume generation after a tool invocation has been approved.
 *
 * Also validates the selected chat model identifier and visibility type
 * (public or private).
 *
 * @module app/(chat)/api/chat/schema
 */

import { z } from "zod";

const textPartSchema = z.object({
  type: z.enum(["text"]),
  text: z.string().min(1).max(2000),
});

const filePartSchema = z.object({
  type: z.enum(["file"]),
  mediaType: z.enum(["image/jpeg", "image/png"]),
  name: z.string().min(1).max(100),
  url: z.string().url(),
});

const partSchema = z.union([textPartSchema, filePartSchema]);

const userMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["user"]),
  parts: z.array(partSchema),
});

// For tool approval flows, we accept all messages (more permissive schema)
const messageSchema = z.object({
  id: z.string(),
  role: z.string(),
  parts: z.array(z.any()),
});

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  // Either a single new message or all messages (for tool approvals)
  message: userMessageSchema.optional(),
  messages: z.array(messageSchema).optional(),
  selectedChatModel: z.string(),
  selectedVisibilityType: z.enum(["public", "private"]),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
