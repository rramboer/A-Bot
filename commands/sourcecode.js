const { CommandType } = require("wokcommands");

module.exports = {
    // Required for slash commands
    description: "Posts a link to the source code for A-Bot",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        console.log(`User ${user.username} requested the A-Bot source code.`);
        return {
            content: "The source code for A-Bot is at  <https://github.com/rramboer/A-Bot/tree/master>."
        }
    }
}