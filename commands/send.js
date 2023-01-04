const { ApplicationCommandOptionType } = require("discord.js");
const { CommandType } = require("wokcommands");

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
    callback: async ({ guild, args, interaction: msgInt }) => {
        const channel = args[0].slice(2, args[0].length - 1);
        guild.channels.fetch(channel)
            .then(async c => { c.send(args[1]); await msgInt.reply(`Message sent in ${args[0]}`); })
            .catch(() => { msgInt.reply(`Unable to send message. Did you tag the channel with \`#channel\`?`) });
    }
};