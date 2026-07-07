import { getDb } from '../../db.js';
import { formatDuration } from '../../lib/duration.js';
import type { Command } from '../../types.js';

const WORK_COOLDOWN_MS = 3600000; // 1 hour

export default {
    description: 'Go to work! Make some money.',
    callback: ({ user }) => {
        try {
            const db = getDb();
            const record = db.getUser(user.id);
            if (!record) {
                return {
                    content:
                        'To play, you need to join the casino first. Do so by running the `/joincasino` command!',
                };
            }
            if (!record.employed) {
                return {
                    content: 'Sorry, you are unemployed! Get a job first, using the command `/getjob`!',
                };
            }
            const now = Date.now();
            const elapsed = now - record.lastWorked;
            if (elapsed < WORK_COOLDOWN_MS) {
                return {
                    content: `You are already working. Please wait ${formatDuration(WORK_COOLDOWN_MS - elapsed)}.`,
                };
            }
            db.recordWork(user.id, record.income, now);
            console.log(`User ${user.username} worked and earned ${record.income} coins.`);
            return {
                content: `Cha-Ching! You just claimed a paycheck of ${record.income} coins! Come back in an hour for another ${record.income} coins! 🤑💰🪙`,
            };
        } catch (e) {
            console.error('Error in work command:', e);
            return {
                content: '☠️ Oops! Something went wrong on my end.',
            };
        }
    },
} satisfies Command;
