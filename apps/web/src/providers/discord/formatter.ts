import { Embed } from "@vermaysha/discord-webhook";

import type { Deployment, Links, VercelWebhook } from "@/schemas/vercel";
import { BOT_AVATAR, EMOJIS, getStateProperty } from "./consts";

type EmbedCreator = (webhook: VercelWebhook) => Embed;

const EMBED_CREATORS: Record<string, EmbedCreator> = {
  deployment: createDeploymentEmbed,
  domain: createDomainEmbed,
  project: createProjectEmbed,
};

export function formatWebhook(webhook: VercelWebhook): Embed {
  const typePrefix = webhook.type.split(".")[0];
  const creator = EMBED_CREATORS[typePrefix];
  return creator ? creator(webhook) : createGenericEmbed(webhook);
}

function createDeploymentEmbed(webhook: VercelWebhook): Embed {
  const { deployment, links } = webhook.payload;
  if (!(deployment && links)) {
    return createGenericEmbed(webhook);
  }

  const state = webhook.type.split(".")[1];
  const embed = new Embed();

  setBasicProperties(embed, webhook, `Deployment ${state}`);

  if (links.deployment) {
    embed.setUrl(links.deployment);
  }

  setDeploymentDescription(embed, webhook, deployment);
  addDeploymentFields(embed, deployment, links, webhook.type);

  return embed;
}

function createDomainEmbed(webhook: VercelWebhook): Embed {
  const { domain } = webhook.payload;
  if (!domain) {
    return createGenericEmbed(webhook);
  }

  const embed = new Embed();
  setBasicProperties(embed, webhook, `Domain ${webhook.type.split(".")[1]}`);
  embed.setDescription(`**Domain**: ${domain.name}`);

  return embed;
}

function createProjectEmbed(webhook: VercelWebhook): Embed {
  const { project } = webhook.payload;
  if (!project) {
    return createGenericEmbed(webhook);
  }

  const embed = new Embed();
  setBasicProperties(embed, webhook, `Project ${webhook.type.split(".")[1]}`);
  embed.setDescription(`**Project**: ${project.id}`);

  return embed;
}

function createGenericEmbed(webhook: VercelWebhook): Embed {
  const embed = new Embed();
  const formattedEvent = formatEventName(webhook.type);

  setBasicProperties(embed, webhook, formattedEvent);
  embed.setDescription(
    `Webhook event received at ${new Date(webhook.createdAt).toISOString()}`
  );
  embed.setFooter({
    text: `Event ID: ${webhook.id}`,
    icon_url: BOT_AVATAR,
  });

  return embed;
}

function setBasicProperties(
  embed: Embed,
  webhook: VercelWebhook,
  title: string
): void {
  const emoji = getStateProperty(webhook.type, "emoji") as string;
  const color = getStateProperty(webhook.type, "color") as number;

  embed.setTitle(`\`${emoji}\` ${title}`);
  embed.setColor(`#${color.toString(16)}`);
  embed.setTimestamp();
  embed.setAuthor({
    name: "versend.io",
    icon_url: BOT_AVATAR,
    url: "https://versend.io",
  });
}

function setDeploymentDescription(
  embed: Embed,
  webhook: VercelWebhook,
  deployment: Deployment
): void {
  const meta = deployment?.meta;
  let description = `**${deployment.name}** deployed to **${meta?.target || "production"}**`;

  if (webhook.type === "deployment.error" && meta?.buildError) {
    const maxErrorLength = 500;
    const errorText =
      meta.buildError.length > maxErrorLength
        ? `${meta.buildError.slice(0, maxErrorLength)}...`
        : meta.buildError;
    description += `\n\n**Build Error:**\n\`\`\`\n${errorText}\`\`\``;
  }

  embed.setDescription(description);
}

function addDeploymentFields(
  embed: Embed,
  deployment: Deployment,
  links: Links,
  webhookType: string
): void {
  const meta = deployment?.meta;

  if (meta?.githubCommitRef && meta?.githubCommitSha) {
    const commitUrl = `https://github.com/${meta.githubCommitOrg}/${meta.githubCommitRepo}/commit/${meta.githubCommitSha}`;
    const shortSha = meta.githubCommitSha.slice(0, 7);

    embed.addField({
      name: `\`${EMOJIS.BRANCH}\` Branch`,
      value: `\`${meta.githubCommitRef}\``,
      inline: true,
    });

    embed.addField({
      name: `\`${EMOJIS.COMMIT}\` Commit`,
      value: `[\`${shortSha}\`](${commitUrl})`,
      inline: true,
    });

    embed.addField({
      name: `\`${EMOJIS.ENV}\` Environment`,
      value: meta?.target || "production",
      inline: true,
    });
  }

  if (meta?.githubCommitMessage) {
    const maxCommitLength = 1000;
    const commitMessage =
      meta.githubCommitMessage.length > maxCommitLength
        ? `${meta.githubCommitMessage.slice(0, maxCommitLength)}...`
        : meta.githubCommitMessage;

    embed.addField({
      name: `\`${EMOJIS.MESSAGE}\` Commit Message`,
      value: `\`\`\`\n${commitMessage}\`\`\``,
      inline: false,
    });
  }

  if (links?.deployment) {
    const isLive =
      webhookType === "deployment.succeeded" ||
      webhookType === "deployment.ready";
    const label = isLive ? "Preview URL" : "Deployment URL";
    const hostname = new URL(links.deployment).hostname;

    embed.addField({
      name: `\`${EMOJIS.URL}\` ${label}`,
      value: `[${hostname}](${links.deployment})`,
      inline: false,
    });
  }

  if (deployment.id) {
    embed.setFooter({
      text: `Deployment ID: ${deployment.id}`,
      icon_url: BOT_AVATAR,
    });
  }
}

function formatEventName(eventType: string): string {
  return eventType
    .split(".")
    .map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ")
    )
    .join(" • ");
}
