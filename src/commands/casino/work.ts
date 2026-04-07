import { CommandType, CooldownTypes } from "wokcommands";
import { CommandUsage } from "wokcommands";
import { mongoClient } from "../..";

module.exports = {
    description: "Go to work! Make some money.",
    type: CommandType.BOTH,
    cooldowns: {
        errorMessage: "You are already working. Please wait {TIME}.",
        type: CooldownTypes.perUser,
        duration: "1 h"
    },
    callback: async ({ user }: CommandUsage) => {
        try {
            const db = await mongoClient.db('botCasino');
            const users = await db.collection('users');
            const _user = await users.findOne({ user_id: user.id });
            if (_user == undefined || _user == null) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                };
            }
            if (!_user.employed) {
                return {
                    content: "Sorry, you are unemployed! Get a job first, using the command `/getjob`!",
                };
            } else {
                const earnings = _user.income;
                if (_user.working) {
                    users.updateOne({ user_id: user.id }, {
                        $inc: { coins: earnings },
                        $set: { working: true }
                    });
                    console.log(`User ${user.username} is working and earned ${earnings} coins.`);
                    return {
                        content: "Cha-Ching! You just claimed a paycheck of " + earnings + " coins! Come back in an hour for another " + earnings + " coins! 🤑💰🪙"
                    };
                } else {
                    users.updateOne({ user_id: user.id }, {
                        $set: { working: true }
                    });
                    console.log(`User ${user.username} started working for ${earnings} coins.`);
                    return {
                        content: "Nice! Come back in one hour to claim your paycheck of " + earnings + " coins!"
                    };
                }
            }
        } catch (e) {
            console.error(e);
            return {
                content: "☠️ Oops! Something went wrong on my end."
            };
        }
    }
};
