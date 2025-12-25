import { env } from "@/env";
import type { VercelWebhook } from "@/schemas/vercel";
import type { Provider } from "../types";
import { sendMessage } from "./client";
import { formatWebhook } from "./formatter";

const slackProvider: Provider | null = env.SLACK_WEBHOOK_URL
  ? {
      name: "slack",
      async send(webhook: VercelWebhook): Promise<void> {
        const message = formatWebhook(webhook);
        await sendMessage(message);
      },
    }
  : null;

export default slackProvider;
