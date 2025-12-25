export type SlackBlock =
  | SlackSectionBlock
  | SlackContextBlock
  | SlackDividerBlock
  | SlackActionsBlock;

export type SlackSectionBlock = {
  type: "section";
  text?: SlackTextObject;
  fields?: SlackTextObject[];
  accessory?: SlackAccessory;
};

export type SlackContextBlock = {
  type: "context";
  elements: (SlackTextObject | SlackImageElement)[];
};

export type SlackDividerBlock = {
  type: "divider";
};

export type SlackActionsBlock = {
  type: "actions";
  elements: SlackButtonElement[];
};

export type SlackTextObject = {
  type: "plain_text" | "mrkdwn";
  text: string;
  emoji?: boolean;
};

export type SlackImageElement = {
  type: "image";
  image_url: string;
  alt_text: string;
};

export type SlackButtonElement = {
  type: "button";
  text: SlackTextObject;
  url?: string;
  action_id: string;
  style?: "primary" | "danger";
};

export type SlackAccessory = SlackButtonElement | SlackImageElement;

export type SlackMessage = {
  text: string;
  blocks?: SlackBlock[];
  unfurl_links?: boolean;
  unfurl_media?: boolean;
};

export type SlackResponse = {
  ok: boolean;
  error?: string;
};
