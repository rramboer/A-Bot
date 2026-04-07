import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";
import { mongoClient } from "..";

module.exports = {
    description: "Join the bot casino! You can remove yourself laterwith `/removecasino`.",
    type: CommandType.BOTH,
    callback: async ({ user }: CommandUsage) => {
        const db = await mongoClient.db('botCasino');
        const _user = await db.collection('users').findOne({ user_id: user.id });
        if (_user != undefined && _user != null) {
            return { content: `You're already in the casino, silly.` };
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
        };
    }
};
