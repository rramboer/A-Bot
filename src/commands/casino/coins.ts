import { ApplicationCommandOptionType } from 'discord.js';
import { getDb } from '../../db.js';
import type { Command } from '../../types.js';

export default {
    description: 'Flex your bank account!',
    options: [
        {
            name: 'user',
            description: 'The user to check',
            required: false,
            type: ApplicationCommandOptionType.User,
        },
    ],
    callback: ({ user, interaction }) => {
        try {
            const target = interaction.options.getUser('user');
            const targetUser = target ?? user;
            const record = getDb().getUser(targetUser.id);
            if (!record) {
                if (target) {
                    return { content: 'This user is not in the casino yet.' };
                }
                return {
                    content:
                        'To play, you need to join the casino first. Do so by running the `/joincasino` command!',
                };
            }
            console.log(
                `User ${user.username} checked balance for ${targetUser.username}: ${record.coins} coins.`,
            );
            return {
                content: `${targetUser.username} has ${record.coins} coins!`,
            };
        } catch (e) {
            console.error('Error in coins command:', e);
            return {
                content: '🤕 Uh oh! There was an error. Try again.',
            };
        }
    },
} satisfies Command;
