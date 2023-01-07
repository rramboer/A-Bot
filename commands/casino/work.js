const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

module.exports = {
    // Required for slash commands
    description: "Go to work! Make some money.",
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
            if(_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                }
            }
            if(!_user.employed) {
                return {
                    content: "Sorry, you are unemployed! Get a job first, using the command `/getjob`!",
                }
            } else {
                let earnings = _user.income;
                // users.updateOne({user_id:user.id},{
                //     $inc: {
                //         coins: earnings,
                //     },
                //     $set: {
                //         bonusAvailable:false,
                //     }
                // });
                return {
                    content: "Nice! Come back in one hour to claim your paycheck of " + earnings + " coins!"
                }
            }
        } catch(e) {
            console.error(e);
            return {
                content: "☠️ Oops! Something went wrong on my end."
            }
        }
    }
}