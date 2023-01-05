const { ChannelType } = require("discord.js");
const { CommandType } = require("wokcommands");

module.exports = {
    description: 'Creates a new semester category and channels',
    type: CommandType.BOTH,
    minArgs: 1,
    maxArgs: 1,
    options: [
        {
            name: 'semester-year',
            description: 'Provide [F/S/W][Last two digits of year]',
            required: true,
            type: 3,
        }
        // Add an optional archive argument (adds ARCHIVED after category name and disables new messages)
    ],
    expectedArgs: "<[F/S/W][Last two digits of year]>",
    testOnly: false,
    callback: async ({ guild, text, interaction: msgInt }) => {
        const semesters = {
            f: 'Fall',
            s: 'Spring/Summer',
            w: 'Winter'
        };
        const semester = text.toLowerCase();
        if (semester.startsWith('f') || semester.startsWith('s') || semester.startsWith('w')) {
            let categoryName = semesters[semester.at(0)];
            let year = semester.slice(1); // Remove first character
            year = year.padStart(4, '20'); // Pads up to 4 character string, so you can technically say 2022
            categoryName = categoryName + ` ${year}`;
            const category = guild.channels.create({ name: categoryName, type: ChannelType.GuildCategory });
            let categoryChannel;
            category.then(c => { categoryChannel = c; c.setPosition(2) }); //Staff-Only Channels is at Position 0
            const channels = ['general', 'random', 'homework', 'projects', 'exams'];
            for (let i = 0; i < channels.length; ++i) {
                guild.channels.create({ name: channels[i], type: ChannelType.GuildText })
                    .then(channel => { channel.setParent(categoryChannel) })
                    .catch(() => { msgInt.reply("Unable to create category"); return; });
            }
            msgInt.reply(`${categoryName} successfully created`);
        } else {
            msgInt.reply('Invalid semester format');
        }
    }
};