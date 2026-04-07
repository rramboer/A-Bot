import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";
import { mongoClient } from "../..";

module.exports = {
    description: "Flex your bank account!",
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "<user>",
    type: CommandType.BOTH,
    callback: async ({ client, user, args }: CommandUsage) => {
        try {
            const db = await mongoClient.db('botCasino');
            let user_id_input = args[0];
            if (args.length == 1) {
                if (user_id_input[0] == "<" && user_id_input[1] == "@") {
                    user_id_input = user_id_input.substring(2, user_id_input.length - 1);
                }
            }
            const _user = await db.collection('users').findOne({
                user_id: (args.length == 1) ? user_id_input : user.id,
            });
            let user_id;
            try {
                if (args.length == 1) {
                    user_id = await client.users.fetch(user_id_input).catch(() => null);
                } else {
                    user_id = await client.users.fetch(user.id).catch(() => null);
                }
            } catch (e) {
                return { content: `I searched high and low and couldn't find that user. Do they even exist?` };
            }
            if (_user == undefined || _user == null) {
                if (args.length > 0) {
                    return { content: `This user is not in the casino yet.` };
                }
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                };
            }
            if (args.length == 1) {
                return {
                    content: `${user_id!.username} has ${_user.coins} coins!`
                };
            }
            if (isNaN(_user.coins)) {
                db.collection('users').updateOne({ user_id: user.id }, {
                    $set: { coins: 0, bonusAvailable: false },
                });
                return {
                    content: "😳 Oops! I deleted all of your coins lol (not a joke). Must've been a bit flip..."
                };
            }
            const coins = _user.coins;
            console.log(`User ${user.username} is checking their balance and has ${coins} coins.`);
            return {
                content: user.username + " has " + coins + " coins!",
            };
        } catch {
            return {
                content: "🤕 Uh oh! There was an error. Try again."
            };
        }
    }
};
