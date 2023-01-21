const { mongoClient } = require("../..");
const { reactionRoleMessage } = require("../..");
const wait = require('node:timers/promises').setTimeout;

module.exports = async (interaction, user) => {
    if (interaction.isButton()) {
        const db = await mongoClient.db('botCasino');
        const _user = await db.collection('users').findOne({ user_id: interaction.user.id, });
        await interaction.deferUpdate();
        await wait(100);
        const { call, betAmount, user } = JSON.parse(interaction.customId);
        if (user != _user.user_id) { return; }
        let game_multiplier = 1;
        if (Math.random() < 0.5) { game_multiplier = -1; }
        let final_message = ``;
        if (game_multiplier == -1) {
            final_message = `You lose, it was ${call === "heads" ? "tails" : "heads"}! ${interaction.user.username}'s bet of ${betAmount} coins has been seized by the opponent! 😵`
        } else {
            final_message = `Correct, ${call}! ${interaction.user.username} wins their bet amount of ${betAmount}! 🥳💃🎉`
        }
        await wait(1000);
        await interaction.editReply({
            content: (
                `Time for a coinflip!
You chose ${call}
${final_message}`),
            components: []
        });
        db.collection('users').updateOne({ user_id: interaction.user.id }, { $inc: { coins: game_multiplier * betAmount } });
    }
};
