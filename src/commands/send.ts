import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import type { Command } from '../types.js';

export default {
    description: 'Sends a message as the bot in the specified channel',
    options: [
        {
            name: 'channel',
            description: 'The channel to be sent in',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'message',
            description: 'The message to be sent',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    callback: async ({ user, guild, args }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        try {
            const channelId = args[0].slice(2, args[0].length - 1);
            const c = await guild.channels.fetch(channelId);
            await (c as TextChannel).send(args[1]);
            console.log(`User ${user.username} made the bot send a message in \#${(c as TextChannel).name}.`);
            return { content: `Message sent in ${args[0]}` };
        } catch (e) {
            console.error('Error in send command:', e);
            return { content: 'Unable to send message. Did you tag the channel with `#channel`?' };
        }
    }
} satisfies Command;
