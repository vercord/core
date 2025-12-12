import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import HttpStatusCode from "@/enums/http-status-codes";
import { env } from "@/env";

const isRateLimitingEnabled = (): boolean => {
  const hasUpstashConfig = Boolean(
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  );

  if (env.ENABLE_RATE_LIMITING === false) {
    return false;
  }

  if (env.ENABLE_RATE_LIMITING === true) {
    if (!hasUpstashConfig) {
      throw new Error(
        "Rate limiting is enabled but UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required"
      );
    }
    return true;
  }

  // undefined - auto-detect based on config presence
  return hasUpstashConfig;
};

let ratelimit: Ratelimit | null = null;
let rateLimitingEnabled: boolean | null = null;

const getRatelimit = (): Ratelimit | null => {
  if (rateLimitingEnabled === null) {
    rateLimitingEnabled = isRateLimitingEnabled();
  }
  if (!rateLimitingEnabled) {
    return null;
  }
  if (ratelimit) {
    return ratelimit;
  }

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
  });

  return ratelimit;
};

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
  const rateLimiter = getRatelimit();
  if (!rateLimiter) {
    return;
  }

  const { success, reset } = await rateLimiter.limit(ip);

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
