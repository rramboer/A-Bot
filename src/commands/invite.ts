import { ApplicationCommandOptionType } from 'discord.js';
import { inviteChannelId, staticInviteUrl } from '../config.js';
import type { Command } from '../types.js';

export default {
    description: 'Creates an invite link with a specified number of uses',
    options: [
        {
            name: 'n',
            description: 'Number of invite uses (1-100)',
            required: false,
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 100,
        },
    ],
    callback: async ({ user, guild, interaction }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        const maxUses = interaction.options.getInteger('n');
        if (maxUses === null) {
            console.log(`User ${user.username} created an invite link with unlimited uses.`);
            return { content: staticInviteUrl };
        }
        if (maxUses < 1 || maxUses > 100) {
            return { content: 'The number of uses must be between 1 and 100.' };
        }
        try {
            const invite = await guild.invites.create(inviteChannelId, { maxUses, maxAge: 0 });
            console.log(`User ${user.username} created an invite link with ${maxUses} uses.`);
            return { content: `discord.gg/${invite.code}` };
        } catch (e) {
            console.error('Error creating invite:', e);
            return { content: 'Unable to create invite. Check bot permissions.' };
        }
    },
} satisfies Command;
