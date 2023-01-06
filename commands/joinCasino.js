const { CommandType } = require("wokcommands");
const { mongoClient } = require("..");

module.exports = {
    // Required for slash commands
    description: "Join the bot casino! You can remove yourself laterwith /removeCasino.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        // databasesList = await mongoClient.db().admin().listDatabases();
        let db = await mongoClient.db('botCasino');
        console.log(db);
        let users = await db.collections('users');
        console.log(users);
        console.log("this is the user:::");
        console.log(user);
        console.log(user.id);
        await db.collection('users').insertOne({
            user_id: user.id,
            name: user.username,
            cash: 0,
            employed: false,
            income: 0,
            lastDaily: new Date(0).toISOString(),
            bonusAvailable: true,
        }, (error) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Completed insertion")
            }
        }
        );
        return {
            content: "Welcome to the casino! You have nothing to your name. Claim a starting bonus with `/bonus`, and start earning an income with `/work`. Try not to get addicted 😀! Have fun! 🥳",
        }
    }
}