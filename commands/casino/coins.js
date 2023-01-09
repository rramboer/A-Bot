const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

module.exports = {
    // Required for slash commands
    description: "Flex your bank account!",
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "<user>",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ client, user, args }) => {
        try {
            let db = await mongoClient.db('botCasino');
            var user_id;
            var user_id_input = args[0];
            if (args.length == 1) {
                if (user_id_input[0] == "<" && user_id_input[1] == "@") {
                    user_id_input = user_id_input.substring(2, user_id_input.length - 1);
                }
            }
            let _user = await db.collection('users').findOne(
                {
                    user_id: (args.length == 1) ? user_id_input : user.id,
                }
            );
            try {
                if (args.length == 1) {
                    user_id = await client.users.fetch(user_id_input).catch((e) => console.error(e));
                } else {
                    user_id = await client.users.fetch(user.id).catch(() => null);
                }
            } catch (e) {
                //console.error(e);
                return { content: `I searched high and low and couldn't find that user. Do they even exist?` }
            }
            if (_user == undefined || _user == null || _user == NaN) {
                if (args.length > 0) {
                    return { content: `I searched high and low and couldn't find that user. Do they even exist?` }
                }
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                }
            }
            if (args.length == 1) {
                let earnings = _user.coins;
                return {
                    content: `${user_id.username} has ${_user.coins} coins!`
                }
            }
            if (_user.coins == NaN) {
                users.updateOne({ user_id: user.id }, {
                    $set: {
                        coins: 0,
                        bonusAvailable: false
                    },
                });
                return {
                    content: "😳 Oops! I deleted all of your coins lol (not a joke). Must've been a bit flip..."
                }
            }
            let coins = _user.coins;
            console.log(`User ${user.username} is checking their balance and has ${coins} coins.`);
            return {
                content: user.username + " has " + coins + " coins!",
            }
        } catch {
            return {
                content: "🤕 Uh oh! There was an error. Try again."
            }
        }
    }
}
