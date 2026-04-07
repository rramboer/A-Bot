import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: "Ping",
    type: CommandType.BOTH,
    callback: async ({ user }: CommandUsage) => {
        console.log(`User ${user.username} pinged the bot.`);
        return { content: "Pong!" };
    }
};
