export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
  MODAL_SUBMIT = 5,
}

export enum InteractionResponseType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_UPDATE_MESSAGE = 6,
  UPDATE_MESSAGE = 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
  MODAL = 9,
}

export enum InteractionResponseFlags {
  EPHEMERAL = 64,
}

export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  STRING_SELECT = 3,
  TEXT_INPUT = 4,
}

export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

export enum TextInputStyle {
  SHORT = 1,
  PARAGRAPH = 2,
}

export type DiscordEmbed = {
  title?: string
  description?: string
  url?: string
  color?: number
  fields?: Array<{ name: string; value: string; inline?: boolean }>
  footer?: { text: string; icon_url?: string }
  thumbnail?: { url: string }
  author?: { name: string; icon_url?: string; url?: string }
}

export type DiscordButton = {
  type: ComponentType.BUTTON
  style: ButtonStyle
  label: string
  custom_id?: string
  url?: string
  disabled?: boolean
  emoji?: { name: string; id?: string }
}

export type DiscordTextInput = {
  type: ComponentType.TEXT_INPUT
  custom_id: string
  style: TextInputStyle
  label: string
  min_length?: number
  max_length?: number
  required?: boolean
  value?: string
  placeholder?: string
}

export type DiscordActionRow = {
  type: ComponentType.ACTION_ROW
  components: Array<DiscordButton | DiscordTextInput>
}

export type DiscordResponseData = {
  content?: string
  embeds?: DiscordEmbed[]
  components?: DiscordActionRow[]
  flags?: number
  title?: string
  custom_id?: string
}

export type DiscordInteractionResponse = {
  type: InteractionResponseType
  data?: DiscordResponseData
}
