import { MessageReaction, User } from 'discord.js';
import { reactionRoleMessage, studentAlumRole, studentRole } from "../..";

module.exports = async (reaction: MessageReaction, user: User) => {
    if (reaction.message.id === reactionRoleMessage) {
        const { guild } = reaction.message;
        await guild!.members.fetch(user.id).then(async member => {
            if (reaction.emoji.name === '🖥️') {
                guild!.roles.fetch(studentAlumRole).then(r => { member.roles.remove(r!); });
                await guild!.roles.fetch(studentRole).then(r => { member.roles.add(r!); });
                console.log(`User ${user.username} has been given the role: Student.`);
            } else if (reaction.emoji.name === '🎓') {
                guild!.roles.fetch(studentRole).then(r => { member.roles.remove(r!); });
                await guild!.roles.fetch(studentAlumRole).then(r => { member.roles.add(r!); });
                console.log(`User ${user.username} has been given the role: Student Alumni.`);
            }
        });
    }
};
