import type { Guild, Message } from 'discord.js';

export interface MessageLinkParts {
    guildId: string;
    channelId: string;
    messageId: string;
}

/**
 * Parses a Discord message link of the form
 * https://discord.com/channels/<guildId>/<channelId>/<messageId>.
 * Returns null when the link does not have the expected shape.
 */
export function parseMessageLink(link: string): MessageLinkParts | null {
    const parts = link.split('/');
    if (parts.length !== 7) return null;
    const [guildId, channelId, messageId] = parts.slice(4);
    if (!guildId || !channelId || !messageId) return null;
    return { guildId, channelId, messageId };
}

/**
 * Resolves a message link to a Message within the given guild.
 * Returns null for malformed links or non-text channels; rejects if Discord lookups fail.
 */
export async function fetchMessageFromLink(guild: Guild, link: string): Promise<Message | null> {
    const parts = parseMessageLink(link);
    if (!parts) return null;
    const channel = await guild.channels.fetch(parts.channelId);
    if (!channel?.isTextBased()) return null;
    return channel.messages.fetch(parts.messageId);
}
