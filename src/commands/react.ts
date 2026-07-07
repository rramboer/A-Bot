import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { fetchMessageFromLink } from '../lib/messageLink.js';
import type { Command } from '../types.js';

export default {
    description: 'Reacts to a message with the specified emoji',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'message_link',
            description: 'The message to react to',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'reaction_emote',
            description: 'The emote for the reaction',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async ({ user, guild, interaction }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        const link = interaction.options.getString('message_link', true);
        const emoji = interaction.options.getString('reaction_emote', true);
        try {
            const message = await fetchMessageFromLink(guild, link);
            if (!message) {
                return { content: 'Please make sure you are providing a valid message link.' };
            }
            await message.react(emoji);
            const channelName = message.inGuild() ? message.channel.name : 'unknown';
            console.log(`User ${user.username} made the bot react ${emoji} in #${channelName}.`);
            return { content: `Reacted ${emoji} to ${message.url}` };
        } catch (e) {
            console.error('Error in react command:', e);
            return {
                content: 'Unable to react to message. Please verify the message link and emoji are valid.',
            };
        }
    },
} satisfies Command;
