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
    callback: async ({ user, guild, args, interaction: msgInt }) => {
        if (!args[0]) {
            console.log(`User ${user.username} created an invite link with unlimited uses.`);
            msgInt.reply('discord.gg/rmQp6PSng9');
        } else {
            guild.invites.create('1053552629373997156', { maxUses: parseInt(args[0]), maxAge: 0 }).then(i => {
                msgInt.reply(`discord.gg/${i.code}`);
                console.log(`User ${user.username} created an invite link with ${parseInt(args[0])} uses.`);
            });
        }
    }
};