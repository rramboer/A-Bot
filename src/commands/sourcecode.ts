import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: "Posts a link to the source code for A-Bot",
    type: CommandType.BOTH,
    callback: async ({ user }: CommandUsage) => {
        console.log(`User ${user.username} requested the A-Bot source code.`);
        return {
            content: "The source code for A-Bot is at  <https://github.com/rramboer/A-Bot/tree/master>."
        };
    }
};
