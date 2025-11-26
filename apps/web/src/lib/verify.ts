import crypto from "node:crypto";

import { env } from "@/env";

function sha1(data: Buffer, secret: string): string {
  return crypto.createHmac("sha1", secret).update(data).digest("hex");
}

export function verifySignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) {
    return false;
  }

  const rawBodyBuffer = Buffer.from(rawBody, "utf-8");
  const computedSignature = sha1(rawBodyBuffer, env.WEBHOOK_INTEGRATION_SECRET);

  return computedSignature === signature;
}
