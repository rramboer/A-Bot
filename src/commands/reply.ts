import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { fetchMessageFromLink } from '../lib/messageLink.js';
import type { Command } from '../types.js';

export default {
    description: 'Replies to the specified message as the bot',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'message_link',
            description: 'The message to reply to',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'reply_text',
            description: 'The reply message',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async ({ user, guild, interaction }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        const link = interaction.options.getString('message_link', true);
        const replyText = interaction.options.getString('reply_text', true);
        try {
            const message = await fetchMessageFromLink(guild, link);
            if (!message) {
                return { content: 'Please make sure you are providing a valid message link.' };
            }
            await message.reply(replyText);
            const channelName = message.inGuild() ? message.channel.name : 'unknown';
            console.log(`User ${user.username} made the bot reply in #${channelName}.`);
            return { content: `Replied to ${message.url}` };
        } catch (e) {
            console.error('Error in reply command:', e);
            return { content: 'Unable to reply to message. Please verify that the message link is valid.' };
        }
    },
} satisfies Command;
