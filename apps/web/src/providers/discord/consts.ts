import type { WebhookType } from "@/schemas/vercel";
import type { StateProperty } from "./types";

export const BOT_NAME = "Versend";
export const BOT_AVATAR =
  "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png";

export const COLORS = {
  PROMOTED: 0xd9_98_e3,
  SUCCESS: 0x2e_cc_71,
  ERROR: 0xe7_4c_3c,
  CANCELED: 0x95_a5_a6,
  INFO: 0x34_98_db,
  PENDING: 0xf1_c4_0f,
  WARNING: 0xff_98_00,
  REFUNDED: 0x60_7d_8b,
  PAID: 0x4c_af_50,
  CONNECTED: 0x21_96_f3,
  DISCONNECTED: 0xf4_43_36,
  CREATED: 0x8b_c3_4a,
  REMOVED: 0xff_57_22,
  UPGRADED: 0x9c_27_b0,
  CONFIRMED: 0x00_bc_d4,
} as const;

export const EMOJIS = {
  PROMOTED: "🔗",
  SUCCESS: "✅",
  ERROR: "❌",
  CANCELED: "🚫",
  PENDING: "⏳",
  BRANCH: "🌿",
  COMMIT: "📝",
  PROJECT: "📦",
  DEPLOY: "🚀",
  REFRESH: "🔄",
  CLEANUP: "🧹",
  DOMAIN: "🌐",
  UPGRADE: "🔼",
  DISCONNECT: "🔌",
  CONFIRM: "✅",
  CONNECT: "🔗",
  UNLOCK: "🔓",
  INVOICE: "📝",
  WARNING: "⚠️",
  PAYMENT: "💵",
  MONEY: "💸",
  NEW: "🆕",
  TRASH: "🗑️",
  ENV: "🔗",
  URL: "🌐",
  MESSAGE: "💬",
} as const;

const STATE_MAPPINGS = {
  color: {
    "deployment.created": COLORS.PENDING,
    "deployment.succeeded": COLORS.SUCCESS,
    "deployment.ready": COLORS.SUCCESS,
    "deployment.promoted": COLORS.PROMOTED,
    "deployment.error": COLORS.ERROR,
    "deployment.canceled": COLORS.CANCELED,
    "deployment.check-rerequested": COLORS.INFO,
    "deployment.integration.action.start": COLORS.PENDING,
    "deployment.integration.action.cancel": COLORS.CANCELED,
    "deployment.integration.action.cleanup": COLORS.INFO,
    "domain.created": COLORS.SUCCESS,
    "integration-configuration.permission-upgraded": COLORS.UPGRADED,
    "integration-configuration.removed": COLORS.ERROR,
    "integration-configuration.scope-change-confirmed": COLORS.CONFIRMED,
    "integration-resource.project-connected": COLORS.CONNECTED,
    "integration-resource.project-disconnected": COLORS.DISCONNECTED,
    "marketplace.invoice.created": COLORS.INFO,
    "marketplace.invoice.notpaid": COLORS.WARNING,
    "marketplace.invoice.paid": COLORS.PAID,
    "marketplace.invoice.refunded": COLORS.REFUNDED,
    "project.created": COLORS.CREATED,
    "project.removed": COLORS.REMOVED,
    default: COLORS.INFO,
  },
  emoji: {
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
    "integration-resource.project-disconnected": EMOJIS.UNLOCK,
    "marketplace.invoice.created": EMOJIS.INVOICE,
    "marketplace.invoice.notpaid": EMOJIS.WARNING,
    "marketplace.invoice.paid": EMOJIS.PAYMENT,
    "marketplace.invoice.refunded": EMOJIS.MONEY,
    "project.created": EMOJIS.NEW,
    "project.removed": EMOJIS.TRASH,
    default: EMOJIS.DEPLOY,
  },
} as const;

export function getStateProperty(
  type: WebhookType,
  property: StateProperty
): number | string {
  const mapping = STATE_MAPPINGS[property];
  return mapping[type as keyof typeof mapping] ?? mapping.default;
}
