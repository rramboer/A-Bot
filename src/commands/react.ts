import { ApplicationCommandOptionType, PermissionFlagsBits, TextChannel } from "discord.js";
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
            await message.react(args[1]);
            console.log(`User ${user.username} made the bot react ${args[1]} in \#${(channel as TextChannel).name}.`);
            return { content: `Reacted ${args[1]} to ${message.url}` };
        } catch (e) {
            console.error('Error in react command:', e);
            return { content: 'Unable to react to message. Please verify the message link and emoji are valid.' };
        }
    }
} satisfies Command;
