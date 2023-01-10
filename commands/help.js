const { CommandType } = require("wokcommands");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    // Required for slash commands
    description: "Help",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        // Return the same object you would use in
        // message.reply
        // or
        // interaction.reply
        // WOKCommands will reply to the message or the interaction
        // depending on how the user ran the command (legacy vs slash)

        const helpCommands = [
            {
                sectionTitle: "General Use",
                commands: [
                    {
                        name: "/help",
                        description: "Prints this help message"
                    },
                ]
            },
            {
                sectionTitle: "Casino",
                commands: [
                    {
                        name: "/joincasino",
                        description: "Adds you to the casino"
                    },
                    {
                        name: "/leavecasino",
                        description: "Removes you from the casino"
                    },
                    {
                        name: "/getjob",
                        description: "Assigns you a job for coin income"
                    },
                    {
                        name: "/work",
                        description: "Earns coin income based on your job"
                    },
                    {
                        name: "/coins",
                        description: "Displays your current balance"
                    },
                    {
                        name: "/dice <bet>",
                        description: "Roll dice to gain or lose coins"
                    },
                    {
                        name: "/roshambo <bet>",
                        description: "Play rock paper scissors, with a bet involved"
                    },
                ]
            },
        ];

        // im sorry in advance
        embed = new EmbedBuilder()
            .setTitle("A-Bot Help")
            .setFields(helpCommands.map((section) => {return {name: section.sectionTitle, value: `${section.commands.map((cmd) => `**${cmd.name}**: ${cmd.description}\n`)}`}}));

        return {
            embeds: [embed]
        }
    }
}