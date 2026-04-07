import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: "Get a link to the course notes.",
    type: CommandType.BOTH,
    callback: async ({ user }: CommandUsage) => {
        console.log(`User ${user.username} requested a link to the course notes.`);
        return {
            content: "Check out the (unofficial) course notes at <https://github.com/danlliu/eecs370notes>!",
        };
    }
};
