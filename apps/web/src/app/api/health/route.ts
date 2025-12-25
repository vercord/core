import { env } from "@/env";
import { providers } from "@/providers/registry";

export function GET() {
  const enabledProviders = providers.map((p) => p.name);

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    providers: enabledProviders,
    rateLimit: !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
  });
}
