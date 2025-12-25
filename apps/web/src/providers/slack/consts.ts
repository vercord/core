import type { WebhookType } from "@/schemas/vercel";

export const EMOJIS = {
  SUCCESS: ":white_check_mark:",
  ERROR: ":x:",
  PENDING: ":hourglass_flowing_sand:",
  CANCELED: ":no_entry_sign:",
  PROMOTED: ":link:",
  BRANCH: ":seedling:",
  COMMIT: ":memo:",
  ENV: ":gear:",
  URL: ":globe_with_meridians:",
  DOMAIN: ":globe_with_meridians:",
  PROJECT: ":package:",
  NEW: ":new:",
  TRASH: ":wastebasket:",
  UPGRADE: ":arrow_up:",
  DISCONNECT: ":electric_plug:",
  CONNECT: ":link:",
  INVOICE: ":receipt:",
  WARNING: ":warning:",
  PAYMENT: ":moneybag:",
  MONEY: ":money_with_wings:",
  REFRESH: ":arrows_counterclockwise:",
  CLEANUP: ":broom:",
  CONFIRM: ":white_check_mark:",
  DEPLOY: ":rocket:",
} as const;

const STATE_EMOJI_MAP: Record<string, string> = {
  "deployment.created": EMOJIS.PENDING,
  "deployment.succeeded": EMOJIS.SUCCESS,
  "deployment.ready": EMOJIS.SUCCESS,
  "deployment.promoted": EMOJIS.PROMOTED,
  "deployment.error": EMOJIS.ERROR,
  "deployment.canceled": EMOJIS.CANCELED,
  "deployment.check-rerequested": EMOJIS.REFRESH,
  "deployment.integration.action.start": EMOJIS.PENDING,
  "deployment.integration.action.cancel": EMOJIS.CANCELED,
  "deployment.integration.action.cleanup": EMOJIS.CLEANUP,
  "domain.created": EMOJIS.DOMAIN,
  "integration-configuration.permission-upgraded": EMOJIS.UPGRADE,
  "integration-configuration.removed": EMOJIS.DISCONNECT,
  "integration-configuration.scope-change-confirmed": EMOJIS.CONFIRM,
  "integration-resource.project-connected": EMOJIS.CONNECT,
  "integration-resource.project-disconnected": EMOJIS.DISCONNECT,
  "marketplace.invoice.created": EMOJIS.INVOICE,
  "marketplace.invoice.notpaid": EMOJIS.WARNING,
  "marketplace.invoice.paid": EMOJIS.PAYMENT,
  "marketplace.invoice.refunded": EMOJIS.MONEY,
  "project.created": EMOJIS.NEW,
  "project.removed": EMOJIS.TRASH,
  default: EMOJIS.DEPLOY,
};

export function getStateEmoji(type: WebhookType): string {
  return STATE_EMOJI_MAP[type] ?? STATE_EMOJI_MAP.default;
}
