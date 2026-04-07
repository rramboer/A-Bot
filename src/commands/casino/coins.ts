import { ApplicationCommandOptionType } from "discord.js";
import { db } from "../../db.js";
import type { Command } from '../../types.js';

export default {
    description: "Flex your bank account!",
    options: [
        {
            name: 'user',
            description: 'The user to check',
            required: false,
            type: ApplicationCommandOptionType.User,
        }
    ],
    callback: async ({ client, user, args }) => {
        try {
            const targetId = args[0] ?? user.id;
            const targetUser = await client.users.fetch(targetId).catch(() => null);
            if (!targetUser) {
                return { content: "I searched high and low and couldn't find that user. Do they even exist?" };
            }
            const _user = db.getUser(targetId);
            if (!_user) {
                if (args[0]) {
                    return { content: "This user is not in the casino yet." };
                }
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                };
            }
            console.log(`User ${user.username} checked balance for ${targetUser.username}: ${_user.coins} coins.`);
            return {
                content: `${targetUser.username} has ${_user.coins} coins!`,
            };
        } catch (e) {
            console.error('Error in coins command:', e);
            return {
                content: "🤕 Uh oh! There was an error. Try again."
            };
        }
    }
} satisfies Command;
