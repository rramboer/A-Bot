import { db } from "../db.js";
import type { Command } from '../types.js';

export default {
    description: "Join the bot casino! You can remove yourself later with `/leavecasino`.",
    callback: async ({ user }) => {
        try {
            if (!db.createUser(user.id, user.username)) {
                return { content: `You're already in the casino, silly.` };
            }
            console.log(`User ${user.username} added to database.`);
            return {
                content: `Welcome to the casino, ${user.username}! You have nothing to your name. Claim a starting bonus with \`/bonus\`, and start earning an income with \`/getjob\`. Have fun! 🥳`,
            };
        } catch (e) {
            console.error('Error in joinCasino command:', e);
            return { content: "☠️ Oops! Something went wrong on my end." };
        }
    }
} satisfies Command;
