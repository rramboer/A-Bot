const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

module.exports = {
    // Required for slash commands
    description: "Use this command to claim your bonus if it is available.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        try {
            let db = await mongoClient.db('botCasino');
            console.log(`User: ${user.username} is attempting to claim bonus.`);
            let _user = await db.collection('users').findOne(
                {
                    user_id: user.id,
                }
            );
            // console.log("user retrieved=" + _user);
            console.log(_user);
            if (_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "I have no idea who you are. Join the casino with `/joincasino`."
                }
            }
            if (_user.bonusAvailable) {
                let bonus = Math.floor((Math.random() * 1000) + 500);
                let new_coins = _user.coins + bonus;
                if (new_coins == NaN || _user.coins == NaN) {
                    db.collection('users').updateOne({ user_id: user.id }, {
                        $set: {
                            coins: new_coins,
                            bonusAvailable: false
                        },
                    });
                    return {
                        content: "😳 Oops! I deleted all of your coins lol (not a joke). Must've been a bit flip"
                    }
                } else {
                    db.collection('users').updateOne({ user_id: user.id }, {
                        $inc: { coins: bonus, }, $set: { bonusAvailable: false, }
                    });
                }
                console.log("BONUS====" + bonus);
                return {
                    content: "🤯 You just claimed your bonus of " + bonus + " coins!"
                }
            } else {
                return {
                    content: "Sorry! 😔 You've already claimed your bonus."
                }
            }
        } catch (e) {
            console.error(e);
            return {
                content: "☠️ Oops! Something went wrong on my end."
            }
        }
    }
}