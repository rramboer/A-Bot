import { mongoClient } from "../index.js";
import type { Command } from '../types.js';

export default {
    description: "Join the bot casino! You can remove yourself later with `/leavecasino`.",
    callback: async ({ user }) => {
        try {
            const db = mongoClient.db('botCasino');
            const _user = await db.collection('users').findOne({ user_id: user.id });
            if (_user) {
                return { content: `You're already in the casino, silly.` };
            }
            await db.collection('users').insertOne({
                user_id: user.id,
                name: user.username,
                coins: 0,
                employed: false,
                income: 0,
                lastDaily: new Date(0).toISOString(),
                bonusAvailable: true,
                working: false
            });
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
