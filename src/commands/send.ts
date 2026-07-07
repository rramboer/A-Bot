import { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../types.js';

export default {
    description: 'Sends a message as the bot in the specified channel',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'channel',
            description: 'The channel to be sent in',
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
        },
        {
            name: 'message',
            description: 'The message to be sent',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async ({ user, guild, interaction }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        try {
            const picked = interaction.options.getChannel('channel', true);
            const message = interaction.options.getString('message', true);
            const channel = await guild.channels.fetch(picked.id);
            if (!channel?.isTextBased()) {
                return { content: 'That channel is not a text channel.' };
            }
            await channel.send(message);
            console.log(`User ${user.username} made the bot send a message in #${channel.name}.`);
            return { content: `Message sent in <#${channel.id}>` };
        } catch (e) {
            console.error('Error in send command:', e);
            return { content: 'Unable to send message.' };
        }
    },
} satisfies Command;
