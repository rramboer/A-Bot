import type { MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { reactionRoleMessage, studentAlumRole, studentRole } from '../../config.js';

export default async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (!reactionRoleMessage || reaction.message.id !== reactionRoleMessage) return;

    try {
        // With partials enabled, the reaction/user may be uncached; fetch the full objects.
        if (reaction.partial) reaction = await reaction.fetch();
        if (user.partial) user = await user.fetch();

        const { guild } = reaction.message;
        if (!guild) return;
        const member = await guild.members.fetch(user.id);

        if (reaction.emoji.name === '🖥️') {
            const alumRole = await guild.roles.fetch(studentAlumRole);
            const studRole = await guild.roles.fetch(studentRole);
            if (alumRole) await member.roles.remove(alumRole);
            if (studRole) await member.roles.add(studRole);
            console.log(`User ${user.username} has been given the role: Student.`);
        } else if (reaction.emoji.name === '🎓') {
            const studRole = await guild.roles.fetch(studentRole);
            const alumRole = await guild.roles.fetch(studentAlumRole);
            if (studRole) await member.roles.remove(studRole);
            if (alumRole) await member.roles.add(alumRole);
            console.log(`User ${user.username} has been given the role: Student Alumni.`);
        }
    } catch (err) {
        console.error('Error in role assignment:', err);
    }
};
