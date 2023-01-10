const { CommandType } = require("wokcommands");
const { mongoClient } = require("..");

module.exports = {
    // Required for slash commands
    description: "Join the bot casino! You can remove yourself laterwith `/removecasino`.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        // databasesList = await mongoClient.db().admin().listDatabases();
        let db = await mongoClient.db('botCasino');
        //console.log(db);
        let users = await db.collections('users');
        //console.log(users);
        //console.log("this is the user:::");
        //console.log(user);
        //console.log(user.id);
        let _user = await db.collection('users').findOne(
            {
                user_id: user.id,
            }
        );
        if (!(_user == undefined || _user == null || _user == NaN)) {
            return {
                content: `You're already in the casino, silly.`
            }
        }
        await db.collection('users').insertOne({
            user_id: user.id,
            name: user.username,
            coins: 0,
            employed: false,
            income: 0,
            lastDaily: new Date(0).toISOString(),
            bonusAvailable: true,
            working: false
        });
        console.log(`User ${user.username} added to database.`);
        return {
            content: `Welcome to the casino, ${user.username}! You have nothing to your name. Claim a starting bonus with \`/bonus\`, and start earning an income with \`/getjob\`. Have fun! 🥳`,
        }
    }
}