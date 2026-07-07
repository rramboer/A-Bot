import { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../types.js';

const SEMESTER_NAMES: Record<string, string> = {
    f: 'Fall',
    s: 'Spring/Summer',
    w: 'Winter',
};

/** Position of new semester categories in the channel list. */
const CATEGORY_POSITION = 2;

const CHANNEL_NAMES = ['general', 'random', 'homework', 'projects', 'exams'];

export default {
    description: 'Creates a new semester category and channels',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'semester-year',
            description: 'Provide [F/S/W][Last two digits of year]',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async ({ user, guild, interaction }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        const input = interaction.options.getString('semester-year', true).toLowerCase();
        const match = /^([fsw])(\d{2})$/.exec(input);
        if (!match) {
            return {
                content: 'Invalid semester format. Provide [F/S/W][last two digits of year], e.g. F23.',
            };
        }
        const semesterName = SEMESTER_NAMES[match[1] ?? ''];
        const year = `20${match[2] ?? ''}`;
        if (!semesterName) {
            return {
                content: 'Invalid semester format. Provide [F/S/W][last two digits of year], e.g. F23.',
            };
        }
        try {
            const categoryName = `${semesterName} ${year}`;
            const categoryChannel = await guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
            });
            await categoryChannel.setPosition(CATEGORY_POSITION);
            for (const name of CHANNEL_NAMES) {
                await guild.channels.create({
                    name,
                    type: ChannelType.GuildText,
                    parent: categoryChannel,
                });
            }
            console.log(`User ${user.username} created ${categoryName} category.`);
            return { content: `${categoryName} successfully created` };
        } catch (e) {
            console.error('Error in create command:', e);
            return { content: 'Unable to create category. Check bot permissions.' };
        }
    },
} satisfies Command;
