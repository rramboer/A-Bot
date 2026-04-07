import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: 'Reacts to a message with the specified emoji',
    type: CommandType.BOTH,
    minArgs: 2,
    maxArgs: 2,
    options: [
        {
            name: 'message_link',
            description: 'The message to react to',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'reaction_emote',
            description: 'The emote for the reaction',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    expectedArgs: "<message link> <reaction emote>",
    testOnly: false,
    callback: async ({ user, guild, args, interaction: msgInt }: CommandUsage) => {
        const IDs = args[0].split('/');
        if (IDs.length != 7) {
            msgInt!.reply("Please make sure you are providing a valid message link.");
            return;
        }
        guild!.channels.fetch(IDs[5]).then(c => {
            (c as TextChannel).messages.fetch(IDs[6]).then(async m => {
                await m.react(args[1]).then(() => {
                    msgInt!.reply(`Reacted ${args[1]} to ${m.url}`);
                    console.log(`User ${user.username} made the bot react ${args[1]} in \#${(c as TextChannel).name}.`);
                })
                    .catch(() => { msgInt!.reply(`Unable to find emoji \`${args[1]}\`.`); });
            })
                .catch(() => { msgInt!.reply(`Unable to find message. Please verify that the message link is valid.`); });
        })
            .catch(() => { msgInt!.reply(`Unable to react to message. Please verify that the message link is valid.`); });
    }
};
