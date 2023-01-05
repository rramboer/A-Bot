const { CommandType } = require("wokcommands");

module.exports = {
    // Required for slash commands
    description: "Grass privileges revoked",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: () => {
        return {
            content: "https://tenor.com/view/grass-privileges-meme-touch-touch-grass-gif-26525632",
        }
    }
}