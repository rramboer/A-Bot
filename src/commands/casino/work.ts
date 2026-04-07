import { mongoClient } from "../../index.js";
import type { Command } from '../../types.js';

const WORK_COOLDOWN_MS = 3600000; // 1 hour

export default {
    description: "Go to work! Make some money.",
    callback: async ({ user }) => {
        try {
            const db = mongoClient.db('botCasino');
            const users = db.collection('users');
            const _user = await users.findOne({ user_id: user.id });
            if (!_user) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                };
            }
            if (!_user.employed) {
                return {
                    content: "Sorry, you are unemployed! Get a job first, using the command `/getjob`!",
                };
            }
            const now = Date.now();
            const lastWorked = _user.lastWorked ?? 0;
            const elapsed = now - lastWorked;
            if (elapsed < WORK_COOLDOWN_MS) {
                const left = (WORK_COOLDOWN_MS - elapsed) / 1000;
                const timeStr = left > 60
                    ? `${Math.ceil(left / 60)} minute(s)`
                    : `${Math.ceil(left)} second(s)`;
                return {
                    content: `You are already working. Please wait ${timeStr}.`
                };
            }
            const earnings = _user.income;
            await users.updateOne({ user_id: user.id }, {
                $inc: { coins: earnings },
                $set: { lastWorked: now }
            });
            console.log(`User ${user.username} worked and earned ${earnings} coins.`);
            return {
                content: "Cha-Ching! You just claimed a paycheck of " + earnings + " coins! Come back in an hour for another " + earnings + " coins! 🤑💰🪙"
            };
        } catch (e) {
            console.error('Error in work command:', e);
            return {
                content: "☠️ Oops! Something went wrong on my end."
            };
        }
    }
} satisfies Command;
