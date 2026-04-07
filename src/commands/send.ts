import { ApplicationCommandOptionType, ChannelType, TextChannel } from "discord.js";
import type { Command } from '../types.js';

export default {
    description: 'Sends a message as the bot in the specified channel',
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
        }
    ],
    callback: async ({ user, guild, args, interaction }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        try {
            const channel = await guild.channels.fetch(args[0]);
            if (!channel || !channel.isTextBased()) {
                return { content: 'That channel is not a text channel.' };
            }
            await (channel as TextChannel).send(args[1]);
            console.log(`User ${user.username} made the bot send a message in #${channel.name}.`);
            return { content: `Message sent in <#${channel.id}>` };
        } catch (e) {
            console.error('Error in send command:', e);
            return { content: 'Unable to send message.' };
        }
    }
} satisfies Command;
