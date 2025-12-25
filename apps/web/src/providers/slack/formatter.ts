import type {
  Deployment,
  DeploymentMeta,
  Links,
  VercelWebhook,
} from "@/schemas/vercel";
import { EMOJIS, getStateEmoji } from "./consts";
import type { SlackBlock, SlackMessage, SlackTextObject } from "./types";

type MessageCreator = (webhook: VercelWebhook) => SlackMessage;

const MESSAGE_CREATORS: Record<string, MessageCreator> = {
  deployment: createDeploymentMessage,
  domain: createDomainMessage,
  project: createProjectMessage,
};

export function formatWebhook(webhook: VercelWebhook): SlackMessage {
  const typePrefix = webhook.type.split(".")[0];
  const creator = MESSAGE_CREATORS[typePrefix];
  return creator ? creator(webhook) : createGenericMessage(webhook);
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function addBuildErrorBlock(blocks: SlackBlock[], meta: DeploymentMeta): void {
  const buildError = meta.buildError;
  if (!buildError) {
    return;
  }

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Build Error:*\n\`\`\`${truncate(buildError, 500)}\`\`\``,
    },
  });
}

function addGitInfoBlock(blocks: SlackBlock[], meta: DeploymentMeta): void {
  const {
    githubCommitRef,
    githubCommitSha,
    githubCommitOrg,
    githubCommitRepo,
  } = meta;
  if (!(githubCommitRef && githubCommitSha)) {
    return;
  }

  const commitUrl = `https://github.com/${githubCommitOrg}/${githubCommitRepo}/commit/${githubCommitSha}`;
  const fields: SlackTextObject[] = [
    {
      type: "mrkdwn",
      text: `${EMOJIS.BRANCH} *Branch*\n\`${githubCommitRef}\``,
    },
    {
      type: "mrkdwn",
      text: `${EMOJIS.COMMIT} *Commit*\n<${commitUrl}|\`${githubCommitSha.slice(0, 7)}\`>`,
    },
    {
      type: "mrkdwn",
      text: `${EMOJIS.ENV} *Environment*\n${meta.target || "production"}`,
    },
  ];

  blocks.push({ type: "section", fields });
}

function addCommitMessageBlock(
  blocks: SlackBlock[],
  meta: DeploymentMeta
): void {
  const message = meta.githubCommitMessage;
  if (!message) {
    return;
  }

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Commit Message:*\n\`\`\`${truncate(message, 500)}\`\`\``,
    },
  });
}

function addDeploymentButton(
  blocks: SlackBlock[],
  links: Links,
  isLive: boolean
): void {
  if (!links.deployment) {
    return;
  }

  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: isLive ? "View Deployment" : "View Preview",
          emoji: true,
        },
        url: links.deployment,
        action_id: "view_deployment",
        style: "primary",
      },
    ],
  });
}

function addFooter(blocks: SlackBlock[], deployment: Deployment): void {
  if (!deployment.id) {
    return;
  }

  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `Deployment ID: ${deployment.id}` }],
  });
}

function createDeploymentMessage(webhook: VercelWebhook): SlackMessage {
  const { deployment, links } = webhook.payload;
  if (!(deployment && links)) {
    return createGenericMessage(webhook);
  }

  const state = webhook.type.split(".")[1];
  const emoji = getStateEmoji(webhook.type);
  const meta = deployment.meta;
  const isError = webhook.type === "deployment.error";
  const isLive =
    webhook.type === "deployment.succeeded" ||
    webhook.type === "deployment.ready";

  const blocks: SlackBlock[] = [
    {
      type: "section",
      text: { type: "mrkdwn", text: `${emoji} *Deployment ${state}*` },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${deployment.name}* deployed to *${meta?.target || "production"}*`,
      },
    },
  ];

  if (isError && meta) {
    addBuildErrorBlock(blocks, meta);
  }
  if (meta) {
    addGitInfoBlock(blocks, meta);
    addCommitMessageBlock(blocks, meta);
  }
  addDeploymentButton(blocks, links, isLive);
  addFooter(blocks, deployment);

  return {
    text: `${emoji} Deployment ${state}: ${deployment.name}`,
    blocks,
    unfurl_links: false,
    unfurl_media: false,
  };
}

function createDomainMessage(webhook: VercelWebhook): SlackMessage {
  const { domain } = webhook.payload;
  if (!domain) {
    return createGenericMessage(webhook);
  }

  const state = webhook.type.split(".")[1];
  const emoji = getStateEmoji(webhook.type);

  return {
    text: `${emoji} Domain ${state}: ${domain.name}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${emoji} *Domain ${state}*\n\n*Domain:* ${domain.name}`,
        },
      },
    ],
  };
}

function createProjectMessage(webhook: VercelWebhook): SlackMessage {
  const { project } = webhook.payload;
  if (!project) {
    return createGenericMessage(webhook);
  }

  const state = webhook.type.split(".")[1];
  const emoji = getStateEmoji(webhook.type);
  const projectName = project.name || project.id;

  return {
    text: `${emoji} Project ${state}: ${projectName}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${emoji} *Project ${state}*\n\n*Project:* ${projectName}`,
        },
      },
    ],
  };
}

function createGenericMessage(webhook: VercelWebhook): SlackMessage {
  const formattedType = webhook.type
    .split(".")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "))
    .join(" • ");

  const emoji = getStateEmoji(webhook.type);

  return {
    text: `${emoji} ${formattedType}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${emoji} *${formattedType}*`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Event received at ${new Date(webhook.createdAt).toISOString()} | Event ID: ${webhook.id}`,
          },
        ],
      },
    ],
  };
}
