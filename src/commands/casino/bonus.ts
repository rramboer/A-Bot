import { mongoClient } from "../../index.js";
import type { Command } from '../../types.js';

export default {
    description: "Use this command to claim your bonus if it is available.",
    callback: async ({ user }) => {
        try {
            const db = await mongoClient.db('botCasino');
            const _user = await db.collection('users').findOne({ user_id: user.id });
            if (_user == undefined || _user == null) {
                return {
                    content: "I have no idea who you are. Join the casino with `/joincasino`."
                };
            }
            if (_user.bonusAvailable) {
                const bonus = Math.floor((Math.random() * 1000) + 500);
                const new_coins = _user.coins + bonus;
                if (isNaN(new_coins) || isNaN(_user.coins)) {
                    await db.collection('users').updateOne({ user_id: user.id }, {
                        $set: { coins: 0, bonusAvailable: false },
                    });
                    return {
                        content: "😳 Oops! I deleted all of your coins lol (not a joke). Must've been a bit flip"
                    };
                } else {
                    await db.collection('users').updateOne({ user_id: user.id }, {
                        $inc: { coins: bonus }, $set: { bonusAvailable: false }
                    });
                }
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
