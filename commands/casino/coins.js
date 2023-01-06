const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

module.exports = {
    // Required for slash commands
    description: "Flex your bank account!",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({user}) => {
        try {
            let db = await mongoClient.db('botCasino');
            let users = await db.collection('users');
            let _user = await users.findOne(
                {
                    user_id:user.id,
                }
            );
            if(_user.coins == NaN) {
                users.updateOne({user_id:user.id},{
                    $set: {
                        coins: 0,
                        bonusAvailable:false
                    },
                });
                return { 
                    content: "😳 Oops! I deleted all of your coins lol (not a joke). Must've been a bit flip"
                }
            }
            console.log("attempting to find user " + user.username + " with ID=" + user.id);
            if(_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "👻 Boo! I am a ghost. Just kidding. I have no idea who you are. Join the casino with `/joincasino`."
                }
            }
            let coins = _user.coins;
            return {
                content: user.username + " has " + coins + " coins!",
            }
        } catch {
            return {
                content: "🤕 Uh oh! There was an error. Try again lol"
            }
        }
    }
}