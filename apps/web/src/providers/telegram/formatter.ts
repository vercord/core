import type { VercelWebhook } from "@/schemas/vercel";

const EMOJIS = {
  success: "✅",
  error: "❌",
  pending: "⏳",
  canceled: "🚫",
  promoted: "🔗",
  info: "ℹ️",
  branch: "🌿",
  commit: "📝",
  url: "🌐",
  cleanup: "🧹",
  refresh: "🔄",
  alert: "🚨",
  certificate: "🔐",
  transfer: "↔️",
  verify: "✔️",
  rename: "✏️",
  member: "👤",
} as const;

type Formatter = (webhook: VercelWebhook) => string;

const FORMATTERS: Record<string, Formatter> = {
  deployment: formatDeployment,
  domain: formatDomain,
  project: formatProject,
};

export function formatWebhook(webhook: VercelWebhook): string {
  const typePrefix = webhook.type.split(".")[0];
  const formatter = FORMATTERS[typePrefix];
  return formatter ? formatter(webhook) : formatGeneric(webhook);
}

function formatDeployment(webhook: VercelWebhook): string {
  const { deployment, links } = webhook.payload;
  if (!deployment) {
    return formatGeneric(webhook);
  }

  const state = webhook.type.split(".")[1];
  const emoji = getEmoji(state);
  const meta = deployment.meta;

  const lines: string[] = [
    `${emoji} <b>Deployment ${state}</b>`,
    "",
    `<b>Project:</b> ${escapeHtml(deployment.name)}`,
  ];

  if (meta?.target) {
    lines.push(`<b>Environment:</b> ${escapeHtml(meta.target)}`);
  }

  if (meta?.githubCommitRef) {
    lines.push(
      `${EMOJIS.branch} <b>Branch:</b> <code>${escapeHtml(meta.githubCommitRef)}</code>`
    );
  }

  if (meta?.githubCommitSha) {
    const shortSha = meta.githubCommitSha.slice(0, 7);
    const commitUrl = `https://github.com/${meta.githubCommitOrg}/${meta.githubCommitRepo}/commit/${meta.githubCommitSha}`;
    lines.push(
      `${EMOJIS.commit} <b>Commit:</b> <a href="${commitUrl}">${shortSha}</a>`
    );
  }

  if (meta?.githubCommitMessage) {
    const message =
      meta.githubCommitMessage.length > 200
        ? `${meta.githubCommitMessage.slice(0, 200)}...`
        : meta.githubCommitMessage;
    lines.push("", `<pre>${escapeHtml(message)}</pre>`);
  }

  if (webhook.type === "deployment.error" && meta?.buildError) {
    const errorText =
      meta.buildError.length > 300
        ? `${meta.buildError.slice(0, 300)}...`
        : meta.buildError;
    lines.push(
      "",
      "<b>Build Error:</b>",
      `<pre>${escapeHtml(errorText)}</pre>`
    );
  }

  if (links?.deployment) {
    lines.push(
      "",
      `${EMOJIS.url} <a href="${links.deployment}">View Deployment</a>`
    );
  }

  return lines.join("\n");
}

function formatDomain(webhook: VercelWebhook): string {
  const { domain } = webhook.payload;
  if (!domain) {
    return formatGeneric(webhook);
  }

  const state = webhook.type.split(".")[1];
  return [
    `${EMOJIS.url} <b>Domain ${state}</b>`,
    "",
    `<b>Domain:</b> ${escapeHtml(domain.name)}`,
  ].join("\n");
}

function formatProject(webhook: VercelWebhook): string {
  const { project } = webhook.payload;
  if (!project) {
    return formatGeneric(webhook);
  }

  const state = webhook.type.split(".")[1];
  const emoji = state === "created" ? "🆕" : "🗑️";

  return [
    `${emoji} <b>Project ${state}</b>`,
    "",
    `<b>Project:</b> ${escapeHtml(project.name || project.id)}`,
  ].join("\n");
}

function formatGeneric(webhook: VercelWebhook): string {
  const formattedType = webhook.type
    .split(".")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" • ");

  return [
    `${EMOJIS.info} <b>${escapeHtml(formattedType)}</b>`,
    "",
    `Event received at ${new Date(webhook.createdAt).toISOString()}`,
  ].join("\n");
}

function getEmoji(state: string): string {
  const map: Record<string, string> = {
    // Success states
    succeeded: EMOJIS.success,
    ready: EMOJIS.success,
    completed: EMOJIS.success,
    approved: EMOJIS.success,
    paid: EMOJIS.success,
    verified: EMOJIS.verify,
    renewal: EMOJIS.success,
    // Error states
    error: EMOJIS.error,
    failed: EMOJIS.error,
    notpaid: EMOJIS.error,
    // Pending/info states
    created: EMOJIS.pending,
    started: EMOJIS.pending,
    // Canceled states
    canceled: EMOJIS.canceled,
    aborted: EMOJIS.canceled,
    removed: EMOJIS.canceled,
    deleted: EMOJIS.canceled,
    // Other states
    promoted: EMOJIS.promoted,
    cleanup: EMOJIS.cleanup,
    triggered: EMOJIS.alert,
    renamed: EMOJIS.rename,
    transferred: EMOJIS.transfer,
    moved: EMOJIS.transfer,
    changed: EMOJIS.refresh,
    updated: EMOJIS.refresh,
    refunded: EMOJIS.info,
  };
  return map[state] || EMOJIS.info;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
