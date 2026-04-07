import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: 'Replies to the specified message as the bot',
    type: CommandType.BOTH,
    minArgs: 2,
    maxArgs: 2,
    options: [
        {
            name: 'message_link',
            description: 'The message to reply to',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'reply_text',
            description: 'The reply message',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    expectedArgs: "<message link> <reply text>",
    testOnly: false,
    callback: async ({ user, guild, args, interaction: msgInt }: CommandUsage) => {
        const IDs = args[0].split('/');
        if (IDs.length != 7) {
            msgInt!.reply("Please make sure you are providing a valid message link.");
            return;
        }
        guild!.channels.fetch(IDs[5]).then(c => {
            (c as TextChannel).messages.fetch(IDs[6]).then(async m => {
                await m.reply(args[1]).then(() => {
                    msgInt!.reply(`Replied to ${m.url}`);
                    console.log(`User ${user.username} made the bot reply in \#${(c as TextChannel).name}.`);
                })
                    .catch(() => { msgInt!.reply(`Unable to reply to message.`); });
            })
                .catch(() => { msgInt!.reply(`Unable to find message. Please verify that the message link is valid.`); });
        })
            .catch(() => { msgInt!.reply(`Unable to reply to message. Please verify that the message link is valid.`); });
    }
};
