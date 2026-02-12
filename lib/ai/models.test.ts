/**
 * @file models.test.ts
 * @description Mock AI model instances used by Playwright end-to-end tests. Uses
 * the AI SDK's MockLanguageModelV3 and simulateReadableStream to create deterministic
 * test models (chatModel, reasoningModel, titleModel, artifactModel) that return
 * prompt-driven responses from the test prompt utilities.
 */

import { simulateReadableStream } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import { getResponseChunksByPrompt } from "@/tests/prompts/utils";

const mockUsage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 20, text: 20, reasoning: 0 },
};

export const chatModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    finishReason: "stop",
    usage: mockUsage,
    content: [{ type: "text", text: "Hello, world!" }],
    warnings: [],
  }),
  doStream: async ({ prompt }) => ({
    stream: simulateReadableStream({
      chunkDelayInMs: 500,
      initialDelayInMs: 1000,
      chunks: getResponseChunksByPrompt(prompt),
    }),
  }),
});

export const reasoningModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    finishReason: "stop",
    usage: mockUsage,
    content: [{ type: "text", text: "Hello, world!" }],
    warnings: [],
  }),
  doStream: async ({ prompt }) => ({
    stream: simulateReadableStream({
      chunkDelayInMs: 500,
      initialDelayInMs: 1000,
      chunks: getResponseChunksByPrompt(prompt, true),
    }),
  }),
});

export const titleModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    finishReason: "stop",
    usage: mockUsage,
    content: [{ type: "text", text: "This is a test title" }],
    warnings: [],
  }),
  doStream: async () => ({
    stream: simulateReadableStream({
      chunkDelayInMs: 500,
      initialDelayInMs: 1000,
      chunks: [
        { id: "1", type: "text-start" },
        { id: "1", type: "text-delta", delta: "This is a test title" },
        { id: "1", type: "text-end" },
        {
          type: "finish",
          finishReason: "stop",
          usage: mockUsage,
        },
      ],
    }),
  }),
});

export const artifactModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    finishReason: "stop",
    usage: mockUsage,
    content: [{ type: "text", text: "Hello, world!" }],
    warnings: [],
  }),
  doStream: async ({ prompt }) => ({
    stream: simulateReadableStream({
      chunkDelayInMs: 50,
      initialDelayInMs: 100,
      chunks: getResponseChunksByPrompt(prompt),
    }),
  }),
});
