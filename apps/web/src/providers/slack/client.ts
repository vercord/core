import { env } from "@/env";
import type { SlackMessage } from "./types";

const RETRY_CONFIG = {
  maxRetries: 3,
  rateLimitDelay: 5000,
  backoffMultiplier: 1000,
} as const;

export async function sendMessage(message: SlackMessage): Promise<void> {
  const webhookUrl = env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("Slack: SLACK_WEBHOOK_URL is not configured");
  }

  await sendWithRetry(webhookUrl, message);
}

async function sendWithRetry(
  webhookUrl: string,
  message: SlackMessage,
  attempt = 0
): Promise<void> {
  if (attempt >= RETRY_CONFIG.maxRetries) {
    throw new Error("Slack: maximum retry attempts reached");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  // Slack webhooks return "ok" as text for success
  if (response.ok) {
    return;
  }

  // Rate limited (429)
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const delay = retryAfter
      ? Number.parseInt(retryAfter, 10) * 1000
      : RETRY_CONFIG.rateLimitDelay;
    await sleep(delay);
    return sendWithRetry(webhookUrl, message, attempt);
  }

  // Retry on server errors
  if (response.status >= 500) {
    if (attempt === RETRY_CONFIG.maxRetries - 1) {
      throw new Error(`Slack API error: ${response.status}`);
    }
    await sleep(RETRY_CONFIG.backoffMultiplier * (attempt + 1));
    return sendWithRetry(webhookUrl, message, attempt + 1);
  }

  const errorText = await response.text();
  throw new Error(`Slack API error: ${errorText}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
