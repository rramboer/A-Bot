import { db } from "../../db.js";
import type { Command } from '../../types.js';

export default {
    description: "Use this command to claim your bonus if it is available.",
    callback: async ({ user }) => {
        try {
            const _user = db.getUser(user.id);
            if (!_user) {
                return {
                    content: "I have no idea who you are. Join the casino with `/joincasino`."
                };
            }
            if (_user.bonusAvailable) {
                const bonus = Math.floor((Math.random() * 1000) + 500);
                db.claimBonus(user.id, bonus);
                console.log(`User ${user.username} claimed a bonus of ${bonus} coins.`);
                return {
                    content: "🤯 You just claimed your bonus of " + bonus + " coins!"
                };
            } else {
                return {
                    content: "Sorry! 😔 You've already claimed your bonus."
                };
            }
        } catch (e) {
            console.error(e);
            return {
                content: "☠️ Oops! Something went wrong on my end."
            };
        }
    }
} satisfies Command;
