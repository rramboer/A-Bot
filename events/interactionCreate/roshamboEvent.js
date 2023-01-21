const { isUndefined } = require("lodash");
const { mongoClient, gameId } = require("../..");
const { reactionRoleMessage } = require("../..");
const wait = require('node:timers/promises').setTimeout;

function getRandomSelection() {
    return (["🪨", "📃", "✂️"])[Math.floor(Math.random() * 3)];
}

module.exports = async (interaction, user) => {
    //console.log("Event triggered");
    if(isUndefined(interaction.customId)) {
        return;
    }
    const data = JSON.parse(interaction.customId);
    if (interaction.isButton() && data.game_id == gameId.roshambo) {
        let db = await mongoClient.db('botCasino');
        let _user = await db.collection('users').findOne({ user_id: interaction.user.id, });
        let opp = getRandomSelection();
        await interaction.deferUpdate();
        await wait(100);
        //console.log("BUTTON INTERACTION customId = " + customId);
        let playType = data.playType,
            betAmount = parseInt(data.betAmount),
            verification_id = data.user_id;
        console.log("Interaction trigged by user with ID " + interaction.user.id + ". VERIFICATION_ID is " + verification_id);
        if (verification_id != _user.user_id) { 
            console.log("User does not match. Exiting event call");
            return; }
        //console.log("Interaction event triggered. " + "playType==" + playType + ", user==" + interaction.user + ", betAmt==" + betAmount);
        var game_multiplier = 0;
        if (playType == "rock") {
            game_multiplier = (opp == "📃") ? -1 : ((opp == "✂️") ? 1 : 0);
        } else if (playType == "paper") {
            game_multiplier = (opp == "📃") ? 0 : ((opp == "✂️") ? -1 : 1);
        } else if (playType == "scissors") {
            game_multiplier = (opp == "📃") ? 1 : ((opp == "✂️") ? 0 : -1);
        }
        playType = (playType == "rock") ? "🪨" : ((playType == "scissors") ? "✂️" : "📃");
        //console.log("ROSHAMBO: editing reply");
        await interaction.editReply({
            content: (
                `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!
You chose ${playType}!\n`),
            components: []
        });
        let final_message = ``;
        if (game_multiplier == 0) {
            final_message = `🤦 A tie! ${interaction.user.username}'s bet is returned.`
        } else if (game_multiplier == -1) {
            final_message = `☠️ You lose! ${interaction.user.username}'s bet of ${betAmount} coins has been seized by the opponent! 😵`
        } else {
            final_message = `Victory! ${interaction.user.username} wins their bet amount of ${betAmount}! 🥳💃🎉`
        }
        await wait(1000);
        await interaction.editReply({
            content: (
                `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!
You chose ${playType}
Your opponent chose ${opp}`),
            components: []
        });
        await wait(1000);
        await interaction.editReply({
            content: (
                `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!
You chose ${playType}
Your opponent chose ${opp}
${final_message}`),
            components: []
        });
        db.collection('users').updateOne({ user_id: interaction.user.id }, { $inc: { coins: game_multiplier * betAmount } });
    }
};
