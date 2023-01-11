const { ApplicationCommandOptionType } = require("discord.js");
const { CommandType } = require("wokcommands");

module.exports = {
    // Required for slash commands
    description: "Get a link to the piazza page or a specific post.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    options: [
        {
            name: "postNumber",
            description: "The post #",
            type: ApplicationCommandOptionType.Number,
            required: false
        }
    ],
    callback: async ({ args, user }) => {
        // Return the same object you would use in
        // message.reply
        // or
        // interaction.reply
        // WOKCommands will reply to the message or the interaction
        // depending on how the user ran the command (legacy vs slash)
        let postNumber = args.postNumber ?? null;
        if (postNumber == null) {
            return {
                content: "https://piazza.com/class/lbzf4r97cuj4kt",
            }
        } else {
            return {
                content: `https://piazza.com/class/lbzf4r97cuj4kt/post/${postNumber}`,
            }
        }
    }
}