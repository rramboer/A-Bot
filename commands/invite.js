const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    description: 'Creates an invite link with a specified number of uses',
    type: CommandType.BOTH,
    minArgs: 0,
    maxArgs: 1,
    options: [
        {
            name: 'n',
            description: 'Number of invite uses',
            required: false,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    expectedArgs: "<N>",
    testOnly: false,
    callback: async ({ guild, args, interaction: msgInt }) => {
        if (!args[0]) {
            msgInt.reply('discord.gg/rmQp6PSng9');
        } else {
            guild.invites.create('734492640757678083', { maxUses: parseInt(args[0]), maxAge: 0 }).then(i => {
                msgInt.reply(`discord.gg/${i.code}`);
            });
        }
    }
};