import { db } from "../../db.js";
import type { Command } from '../../types.js';

const WORK_COOLDOWN_MS = 3600000; // 1 hour

export default {
    description: "Go to work! Make some money.",
    callback: async ({ user }) => {
        try {
            const _user = db.getUser(user.id);
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
            const elapsed = now - _user.lastWorked;
            if (elapsed < WORK_COOLDOWN_MS) {
                const left = (WORK_COOLDOWN_MS - elapsed) / 1000;
                const timeStr = left > 60
                    ? `${Math.ceil(left / 60)} minute(s)`
                    : `${Math.ceil(left)} second(s)`;
                return {
                    content: `You are already working. Please wait ${timeStr}.`
                };
            }
            db.recordWork(user.id, _user.income, now);
            console.log(`User ${user.username} worked and earned ${_user.income} coins.`);
            return {
                content: "Cha-Ching! You just claimed a paycheck of " + _user.income + " coins! Come back in an hour for another " + _user.income + " coins! 🤑💰🪙"
            };
        } catch (e) {
            console.error('Error in work command:', e);
            return {
                content: "☠️ Oops! Something went wrong on my end."
            };
        }
    }
} satisfies Command;
