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
  CERTIFICATE: 0x00_96_88,
  TRANSFER: 0x67_3a_b7,
  ALERT: 0xff_52_52,
  ROLLING: 0x00_b8_d4,
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
  CERTIFICATE: "🔐",
  DNS: "📡",
  TRANSFER: "↔️",
  ALERT: "🚨",
  ROLLING: "🔄",
  RENAME: "✏️",
  VERIFY: "✔️",
  UNVERIFY: "❓",
  MEMBER: "👤",
} as const;

const STATE_MAPPINGS = {
  color: {
    // Deployment events
    "deployment.canceled": COLORS.CANCELED,
    "deployment.check-rerequested": COLORS.INFO,
    "deployment.cleanup": COLORS.INFO,
    "deployment.created": COLORS.PENDING,
    "deployment.error": COLORS.ERROR,
    "deployment.integration.action.cancel": COLORS.CANCELED,
    "deployment.integration.action.cleanup": COLORS.INFO,
    "deployment.integration.action.start": COLORS.PENDING,
    "deployment.promoted": COLORS.PROMOTED,
    "deployment.ready": COLORS.SUCCESS,
    "deployment.succeeded": COLORS.SUCCESS,
    // Domain events
    "domain.created": COLORS.SUCCESS,
    "domain.auto-renew-changed": COLORS.INFO,
    "domain.certificate-add": COLORS.CERTIFICATE,
    "domain.certificate-add-failed": COLORS.ERROR,
    "domain.certificate-deleted": COLORS.REMOVED,
    "domain.certificate-renew": COLORS.CERTIFICATE,
    "domain.certificate-renew-failed": COLORS.ERROR,
    "domain.dns-records-changed": COLORS.INFO,
    "domain.renewal": COLORS.SUCCESS,
    "domain.renewal-failed": COLORS.ERROR,
    "domain.transfer-in-completed": COLORS.SUCCESS,
    "domain.transfer-in-failed": COLORS.ERROR,
    "domain.transfer-in-started": COLORS.TRANSFER,
    // Project domain events
    "project.domain-created": COLORS.CREATED,
    "project.domain-deleted": COLORS.REMOVED,
    "project.domain-moved": COLORS.TRANSFER,
    "project.domain-unverified": COLORS.WARNING,
    "project.domain-updated": COLORS.INFO,
    "project.domain-verified": COLORS.SUCCESS,
    // Integration configuration events
    "integration-configuration.permission-upgraded": COLORS.UPGRADED,
    "integration-configuration.removed": COLORS.ERROR,
    "integration-configuration.scope-change-confirmed": COLORS.CONFIRMED,
    "integration-configuration.transferred": COLORS.TRANSFER,
    // Integration resource events
    "integration-resource.project-connected": COLORS.CONNECTED,
    "integration-resource.project-disconnected": COLORS.DISCONNECTED,
    // Marketplace events
    "marketplace.invoice.created": COLORS.INFO,
    "marketplace.invoice.notpaid": COLORS.WARNING,
    "marketplace.invoice.paid": COLORS.PAID,
    "marketplace.invoice.refunded": COLORS.REFUNDED,
    "marketplace.member.changed": COLORS.INFO,
    // Alerts
    "alerts.triggered": COLORS.ALERT,
    // Project events
    "project.created": COLORS.CREATED,
    "project.removed": COLORS.REMOVED,
    "project.renamed": COLORS.INFO,
    "project.rolling-release.approved": COLORS.SUCCESS,
    "project.rolling-release.completed": COLORS.SUCCESS,
    "project.rolling-release.aborted": COLORS.CANCELED,
    "project.rolling-release.started": COLORS.ROLLING,
    default: COLORS.INFO,
  },
  emoji: {
    // Deployment events
    "deployment.canceled": EMOJIS.CANCELED,
    "deployment.check-rerequested": EMOJIS.REFRESH,
    "deployment.cleanup": EMOJIS.CLEANUP,
    "deployment.created": EMOJIS.PENDING,
    "deployment.error": EMOJIS.ERROR,
    "deployment.integration.action.cancel": EMOJIS.CANCELED,
    "deployment.integration.action.cleanup": EMOJIS.CLEANUP,
    "deployment.integration.action.start": EMOJIS.PENDING,
    "deployment.promoted": EMOJIS.PROMOTED,
    "deployment.ready": EMOJIS.SUCCESS,
    "deployment.succeeded": EMOJIS.SUCCESS,
    // Domain events
    "domain.created": EMOJIS.DOMAIN,
    "domain.auto-renew-changed": EMOJIS.REFRESH,
    "domain.certificate-add": EMOJIS.CERTIFICATE,
    "domain.certificate-add-failed": EMOJIS.ERROR,
    "domain.certificate-deleted": EMOJIS.TRASH,
    "domain.certificate-renew": EMOJIS.CERTIFICATE,
    "domain.certificate-renew-failed": EMOJIS.ERROR,
    "domain.dns-records-changed": EMOJIS.DNS,
    "domain.renewal": EMOJIS.SUCCESS,
    "domain.renewal-failed": EMOJIS.ERROR,
    "domain.transfer-in-completed": EMOJIS.SUCCESS,
    "domain.transfer-in-failed": EMOJIS.ERROR,
    "domain.transfer-in-started": EMOJIS.TRANSFER,
    // Project domain events
    "project.domain-created": EMOJIS.NEW,
    "project.domain-deleted": EMOJIS.TRASH,
    "project.domain-moved": EMOJIS.TRANSFER,
    "project.domain-unverified": EMOJIS.UNVERIFY,
    "project.domain-updated": EMOJIS.REFRESH,
    "project.domain-verified": EMOJIS.VERIFY,
    // Integration configuration events
    "integration-configuration.permission-upgraded": EMOJIS.UPGRADE,
    "integration-configuration.removed": EMOJIS.DISCONNECT,
    "integration-configuration.scope-change-confirmed": EMOJIS.CONFIRM,
    "integration-configuration.transferred": EMOJIS.TRANSFER,
    // Integration resource events
    "integration-resource.project-connected": EMOJIS.CONNECT,
    "integration-resource.project-disconnected": EMOJIS.UNLOCK,
    // Marketplace events
    "marketplace.invoice.created": EMOJIS.INVOICE,
    "marketplace.invoice.notpaid": EMOJIS.WARNING,
    "marketplace.invoice.paid": EMOJIS.PAYMENT,
    "marketplace.invoice.refunded": EMOJIS.MONEY,
    "marketplace.member.changed": EMOJIS.MEMBER,
    // Alerts
    "alerts.triggered": EMOJIS.ALERT,
    // Project events
    "project.created": EMOJIS.NEW,
    "project.removed": EMOJIS.TRASH,
    "project.renamed": EMOJIS.RENAME,
    "project.rolling-release.approved": EMOJIS.SUCCESS,
    "project.rolling-release.completed": EMOJIS.SUCCESS,
    "project.rolling-release.aborted": EMOJIS.CANCELED,
    "project.rolling-release.started": EMOJIS.ROLLING,
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
