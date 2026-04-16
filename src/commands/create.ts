import { ChannelType, PermissionFlagsBits } from "discord.js";
import type { Command } from '../types.js';

const semesters: Record<string, string> = {
    f: 'Fall',
    s: 'Spring/Summer',
    w: 'Winter'
};

export default {
    description: 'Creates a new semester category and channels',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'semester-year',
            description: 'Provide [F/S/W][Last two digits of year]',
            required: true,
            type: 3,
        }
    ],
    callback: async ({ user, guild, text }) => {
        if (!guild) return { content: 'This command can only be used in a server.' };
        const semester = text.toLowerCase();
        if (!semester.startsWith('f') && !semester.startsWith('s') && !semester.startsWith('w')) {
            return { content: 'Invalid semester format' };
        }
        try {
            let categoryName = semesters[semester.at(0)!];
            let year = semester.slice(1);
            year = year.padStart(4, '20');
            categoryName = categoryName + ` ${year}`;
            const categoryChannel = await guild.channels.create({ name: categoryName, type: ChannelType.GuildCategory });
            await categoryChannel.setPosition(2);
            const channels = ['general', 'random', 'homework', 'projects', 'exams'];
            for (const name of channels) {
                const channel = await guild.channels.create({ name, type: ChannelType.GuildText });
                await channel.setParent(categoryChannel);
            }
            console.log(`User ${user.username} created ${categoryName} category.`);
            return { content: `${categoryName} successfully created` };
        } catch (e) {
            console.error('Error in create command:', e);
            return { content: 'Unable to create category. Check bot permissions.' };
        }
    }
} satisfies Command;
