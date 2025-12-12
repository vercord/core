import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import HttpStatusCode from "@/enums/http-status-codes";
import { env } from "@/env";

const shouldEnableRateLimiting = (): boolean => {
  // Explicitly disabled
  if (env.ENABLE_RATE_LIMITING === false) {
    return false;
  }

  // Check if Upstash config is available
  const hasUpstashConfig =
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN;

  // Explicitly enabled but missing config
  if (env.ENABLE_RATE_LIMITING === true && !hasUpstashConfig) {
    throw new Error(
      "Rate limiting is enabled but UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required"
    );
  }

  // Auto-enable if config is present (when undefined) or explicitly enabled
  return hasUpstashConfig;
};

let ratelimit: Ratelimit | null = null;

if (shouldEnableRateLimiting()) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
  });
}

/**
 * Extracts the client IP from request headers
 * Handles comma-separated IPs in x-forwarded-for
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return headers.get("x-real-ip") || "unknown";
}

/**
 * Rate limiting middleware for API routes
 * @param ip Client IP address to rate limit
 * @returns Response object if rate limit exceeded, undefined otherwise
 */
export async function checkRateLimit(
  ip: string
): Promise<Response | undefined> {
  if (!ratelimit) {
    return;
  }

  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Too many requests, please try again later",
        code: "rate_limit_exceeded",
      }),
      {
        status: HttpStatusCode.TOO_MANY_REQUESTS_429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return;
}
