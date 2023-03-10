const { CommandType } = require("wokcommands");

module.exports = {
    // Required for slash commands
    description: "Ping",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        // Return the same object you would use in
        // message.reply
        // or
        // interaction.reply
        // WOKCommands will reply to the message or the interaction
        // depending on how the user ran the command (legacy vs slash)
        console.log(`User ${user.username} pinged the bot.`);
        return {
            content: "Pong!",
        }
    }
}