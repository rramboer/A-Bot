const { CommandType } = require("wokcommands");

module.exports = {
    // Required for slash commands
    description: "Grass privileges revoked",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    minArgs: 0,
    maxArgs: 0,
    testOnly: false,
    callback: async ({ user }) => {
        console.log(`User ${user.username} has revoked someone's grass privileges.`);
        return {
            content: "https://tenor.com/view/grass-privileges-meme-touch-touch-grass-gif-26525632",
        }
    }
}