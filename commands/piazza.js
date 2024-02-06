const { ApplicationCommandOptionType } = require("discord.js");
const { CommandType } = require("wokcommands");

module.exports = {
    // Required for slash commands
    description: "Get a link to the piazza page or a specific post.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    minimumArgs: 0,
    maximumArgs: 1,
    options: [
        {
            name: "postnumber",
            description: "Piazza post #",
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
        let postNumber = args[0] ?? null;
        if (postNumber == null) {
            console.log(`User ${user.username} requested a link to the Piazza page.`);
            return {
                content: "EECS 370 Piazza: <https://eecs370.github.io/piazza>",
            }
        } else {
            console.log(`User ${user.username} requested a link to Piazza post #${postNumber}.`);
            return {
                content: `Piazza Post #${postNumber}: <https://piazza.com/class/llmch89c1hp3ht/post/${postNumber}>`,
            }
        }
    }
}
