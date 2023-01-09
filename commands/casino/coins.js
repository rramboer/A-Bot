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
            let _user = await db.collection('users').findOne(
                {
                    user_id: (args.length == 1) ? args[0] : user.id,
                }
            );
            if (args.length == 1) { console.log(`COINS command: User ID argument passed in, given user id ${args[0]}.`); }
            const user_id = await client.users.fetch((args.length == 1) ? args[0] : user.id).catch(() => null);
            if (!user_id) console.log("That user is not available");
            if (_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                }
            }
            if (args.length == 1 && _user == undefined || _user == null) {
                return { content: `Couldn't find that user. Have they joined the casino? Do they even exist? 🤔` }
            } else if (args.length == 1) {
                let earnings = _user.coins;
                return {
                    content: `${user_id.tag} has ${_user.coins} coins!`
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
