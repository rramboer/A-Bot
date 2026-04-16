import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import type { Command } from '../types.js';

export default {
    description: 'Creates an invite link with a specified number of uses',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'n',
            description: 'Number of invite uses',
            required: false,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    callback: async ({ user, guild, args }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        if (!args[0]) {
            console.log(`User ${user.username} created an invite link with unlimited uses.`);
            return { content: 'discord.gg/rmQp6PSng9' };
        }
        try {
            const invite = await guild.invites.create('1053552629373997156', { maxUses: parseInt(args[0]), maxAge: 0 });
            console.log(`User ${user.username} created an invite link with ${parseInt(args[0])} uses.`);
            return { content: `discord.gg/${invite.code}` };
        } catch (e) {
            console.error('Error creating invite:', e);
            return { content: 'Unable to create invite. Check bot permissions.' };
        }
    }
} satisfies Command;
