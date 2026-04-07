import { ApplicationCommandOptionType } from "discord.js";
import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: "Get a link to the piazza page or a specific post.",
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
    callback: async ({ args, user }: CommandUsage) => {
        const postNumber = args[0] ?? null;
        if (postNumber == null) {
            console.log(`User ${user.username} requested a link to the Piazza page.`);
            return {
                content: "EECS 370 Piazza: <https://eecs370.github.io/piazza>",
            };
        } else {
            console.log(`User ${user.username} requested a link to Piazza post #${postNumber}.`);
            return {
                content: `Piazza Post #${postNumber}: <https://piazza.com/class/llmch89c1hp3ht/post/${postNumber}>`,
            };
        }
    }
};
