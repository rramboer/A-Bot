const { cannotHaveAUsernamePasswordPort } = require("whatwg-url");
const { reactionRoleMessage, studentAlumRole, studentRole } = require("../..");

module.exports = async (reaction, user) => {
    if (reaction.message.id === reactionRoleMessage) {
        const { guild } = reaction.message;
        await guild.members.fetch(user.id).then(async member => {
            // Reacting to one role should remove the other
            if (reaction.emoji.name === '🖥️') {
                guild.roles.fetch(studentAlumRole).then(r => { member.roles.remove(r); });
                await guild.roles.fetch(studentRole).then(r => { member.roles.add(r); });
                console.log(`User ${user.username} has been given the role: Student.`);
            } else if (reaction.emoji.name === '🎓') {
                guild.roles.fetch(studentRole).then(r => { member.roles.remove(r); });
                await guild.roles.fetch(studentAlumRole).then(r => { member.roles.add(r); });
                console.log(`User ${user.username} has been given the role: Student Alumni.`);
            }
        });
    } // if reaction is added to reaction role message
};