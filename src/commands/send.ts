import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: 'Sends a message as the bot in the specified channel',
    type: CommandType.BOTH,
    minArgs: 2,
    maxArgs: 2,
    options: [
        {
            name: 'channel',
            description: 'The channel to be sent in',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'message',
            description: 'The message to be sent',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    expectedArgs: "<channel> <message>",
    testOnly: false,
    callback: async ({ user, guild, args, interaction: msgInt }: CommandUsage) => {
        const channel = args[0].slice(2, args[0].length - 1);
        guild!.channels.fetch(channel)
            .then(async (c) => {
                (c as TextChannel).send(args[1]);
                await msgInt!.reply(`Message sent in ${args[0]}`);
                console.log(`User ${user.username} made the bot send a message in \#${(c as TextChannel).name}.`);
            })
            .catch(() => { msgInt!.reply(`Unable to send message. Did you tag the channel with \`#channel\`?`) });
    }
};
