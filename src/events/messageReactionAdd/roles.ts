import { MessageReaction, User } from 'discord.js';
import { reactionRoleMessage, studentAlumRole, studentRole } from "../../index.js";

export default async (reaction: MessageReaction, user: User) => {
    if (reaction.message.id !== reactionRoleMessage) return;

    try {
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
