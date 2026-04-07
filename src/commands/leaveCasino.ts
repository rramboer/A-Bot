import { db } from "../db.js";
import type { Command } from '../types.js';

export default {
    description: "This removes you from the bot casino (cannot be undone!).",
    callback: async ({ user }) => {
        try {
            const _user = db.getUser(user.id);
            if (!_user) {
                return {
                    content: "You're not even in the casino. Why are you trying to leave? Rude..."
                };
            }
            console.log(`Removing user ${user.username} from the casino.`);
            db.deleteUser(user.id);
            return {
                content: "You have left the casino. We'll miss you! 🥺😥😭",
            };
        } catch (e) {
            console.error('Error in leaveCasino command:', e);
            return { content: "☠️ Oops! Something went wrong on my end." };
        }
    }
} satisfies Command;
