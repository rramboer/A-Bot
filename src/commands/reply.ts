import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import type { Command } from '../types.js';

export default {
    description: 'Replies to the specified message as the bot',
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
        }
    ],
    callback: async ({ user, guild, args }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        const IDs = args[0].split('/');
        if (IDs.length != 7) {
            return { content: 'Please make sure you are providing a valid message link.' };
        }
        try {
            const channel = await guild.channels.fetch(IDs[5]);
            const message = await (channel as TextChannel).messages.fetch(IDs[6]);
            await message.reply(args[1]);
            console.log(`User ${user.username} made the bot reply in \#${(channel as TextChannel).name}.`);
            return { content: `Replied to ${message.url}` };
        } catch (e) {
            console.error('Error in reply command:', e);
            return { content: 'Unable to reply to message. Please verify that the message link is valid.' };
        }
    }
} satisfies Command;
