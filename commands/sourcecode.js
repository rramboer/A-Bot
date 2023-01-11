const { CommandType } = require("wokcommands");

module.exports = {
    // Required for slash commands
    description: "Get a link to the course notes.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        console.log(`User ${user.username} requested a link to the course notes.`);
        return {
            content: "The source code for A-Bot is at  <https://github.com/rramboer/A-Bot/tree/master>"
        }
    }
}