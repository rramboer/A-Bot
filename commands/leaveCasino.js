const { CommandType } = require("wokcommands");
const { mongoClient } = require("..");

module.exports = {
    // Required for slash commands
    description: "This removes you from the bot casino (cannot be undone!).",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        // databasesList = await mongoClient.db().admin().listDatabases();
        let db = await mongoClient.db('botCasino');
        //console.log(db);
        let users = await db.collections('users');
        let _user = await db.collection('users').findOne(
            {
                user_id: user.id,
            }
        );
        if ((_user == undefined || _user == null || _user == NaN)) {
            return {
                content: "You're not even in the casino. Why are you trying to leave? Rude..."
            }
        }
        //console.log(users);
        //console.log("this is the user:::");
        //console.log(user);
        //console.log(user.id);
        console.log(`Removing user ${user.username} from the casino.`);
        await db.collection('users').deleteOne({
            user_id: user.id,
        });
        return {
            content: "You have left the casino. We'll miss you! 🥺😥😭",
        }
    }
}