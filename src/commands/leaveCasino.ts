import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";
import { mongoClient } from "..";

module.exports = {
    description: "This removes you from the bot casino (cannot be undone!).",
    type: CommandType.BOTH,
    callback: async ({ user }: CommandUsage) => {
        const db = await mongoClient.db('botCasino');
        const _user = await db.collection('users').findOne({ user_id: user.id });
        if (_user == undefined || _user == null) {
            return {
                content: "You're not even in the casino. Why are you trying to leave? Rude..."
            };
        }
        console.log(`Removing user ${user.username} from the casino.`);
        await db.collection('users').deleteOne({ user_id: user.id });
        return {
            content: "You have left the casino. We'll miss you! 🥺😥😭",
        };
    }
};
