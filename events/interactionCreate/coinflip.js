const { mongoClient } = require("../..");
const { reactionRoleMessage } = require("../..");
const wait = require('node:timers/promises').setTimeout;

module.exports = async (interaction, user) => {
    //console.log("Event triggered");
    if (interaction.isButton()) {
        let db = await mongoClient.db('botCasino');
        let _user = await db.collection('users').findOne({ user_id: interaction.user.id, });
        await interaction.deferUpdate();
        await wait(100);
        let customId = interaction.customId;
        //console.log("BUTTON INTERACTION customId = " + customId);
        let first_colon = customId.indexOf(":"),
            second_colon = customId.indexOf(":", first_colon + 1);
        let playType = customId.substring(0, customId.indexOf(":")),
            betAmount = parseInt(customId.substring(first_colon + 1, second_colon)),
            verification_id = customId.substring(second_colon + 1, customId.length);
        //console.log("Interaction trigged by user with ID " + interaction.user.id + ". VERIFICATION_ID is " + verification_id);
        if (verification_id != _user.user_id) { return; }
        //console.log("Interaction event triggered. " + "playType==" + playType + ", user==" + interaction.user + ", betAmt==" + betAmount);
        let game_multiplier = 1;
        if (Math.random() < 0.5) { game_multiplier = -1;}
        //console.log("ROSHAMBO: editing reply");
        let final_message = ``;
        if (game_multiplier == -1) {
            final_message = `You lose, it was ${playType === "heads" ? "tails" : "heads"}! ${interaction.user.username}'s bet of ${betAmount} coins has been seized by the opponent! 😵`
        } else {
            final_message = `Correct, ${playType}! ${interaction.user.username} wins their bet amount of ${betAmount}! 🥳💃🎉`
        }
        await wait(1000);
        await interaction.editReply({
            content: (
                `Time for a coinflip!
You chose ${playType}
${final_message}`),
            components: []
        });
        db.collection('users').updateOne({ user_id: interaction.user.id }, { $inc: { coins: game_multiplier * betAmount } });
    }
};