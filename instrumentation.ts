import { registerOTel } from "@vercel/otel";

/**
 * Next.js Instrumentation
 *
 * This file is automatically loaded by Next.js at startup (before any routes).
 * It registers OpenTelemetry (OTel) tracing for observability on Vercel.
 * Traces are sent to Vercel's dashboard for monitoring API latency,
 * database queries, and AI model call performance.
 */
export function register() {
  registerOTel({ serviceName: "ai-chatbot" });
}
