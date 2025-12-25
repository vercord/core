import discord from "./discord";
import slack from "./slack";
import telegram from "./telegram";
import type { Provider } from "./types";

// Add new providers here
const ALL_PROVIDERS = [discord, slack, telegram] as const;

// Filter to only enabled providers (non-null)
export const providers: Provider[] = ALL_PROVIDERS.filter(
  (p): p is Provider => p !== null
);
