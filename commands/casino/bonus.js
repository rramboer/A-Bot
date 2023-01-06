const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

module.exports = {
    // Required for slash commands
    description: "Use this command to claim your bonus if it is available.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({user}) => {
        let db = await mongoClient.db('botCasino');
        let users = await db.collection('users');
        console.log("attempting to find user " + user.username + " with ID=" + user.id);
        let _user = await users.findOne(
            {
                user_id:user.id,
            }
        );
        // console.log("user retrieved=" + _user);
        console.log(_user);
        if(_user == undefined || _user == null || _user == NaN) {
            return {
                content: "👻 Boo! I am a ghost. Just kidding. I have no idea who you are. Join the casino with `/joincasino`."
            }
        }
        if(_user.bonusAvailable) {
            let bonus = Math.floor((Math.random() * 1000) + 500);
            let new_coins = _user.coins + bonus;
            if(new_coins == NaN || _user.coins == NaN) {
                users.updateOne({user_id:user.id},{
                    $set: {
                        coins: new_coins,
                        bonusAvailable:false
                    },
                });
                return { 
                    content: "😳 Oops! I deleted all of your coins lol (not a joke). Must've been a bit flip"
                }
            } else {
                users.updateOne({user_id:user.id},{
                    $inc: {
                        coins: bonus,
                    },
                    $set: {
                        bonusAvailable:false,
                    }
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
    }
}