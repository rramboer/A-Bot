const { mongoClient } = require("../..");
const { reactionRoleMessage } = require("../..");
const wait = require('node:timers/promises').setTimeout;

function getRandomSelection() {
    return (["🪨", "📃", "✂️"])[Math.floor(Math.random() * 3)];
}

module.exports = async (interaction, user) => {
    //console.log("Event triggered");
    if (interaction.isButton()) {
        console.log("Interaction event triggered. " + "custom_id==" + interaction.customId + ", user==" + interaction.user + ", betAmt==" + interaction.betAmount);
        let db = await mongoClient.db('botCasino');
        let _user = await db.collection('users').findOne(
            {
                user_id: user.id,
            }
        );
        let opp = getRandomSelection();
        await interaction.deferUpdate();
        await wait(10);
        let playType = interaction.customId.substring(0, interaction.customId.indexOf(":")),
            betAmount = interaction.customId.substring(interaction.customId.indexOf(":") + 1, interaction.customId.length);
        if (interaction.customId.type == "rock") {
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\n', components: [] });
            await wait(2000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!", components: [] });
            await wait(1000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!", components: [] });
            if (opp == "🪨") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
            } else if (opp == "📃") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + interaction.betAmount + '. 🥳💃🎉', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
            } else if (opp == "✂️") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + interaction.betAmount + '. Better luck next time! 🤦😬', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: -1 * betAmount } });
            }
        } else if (interaction.customId.type == "paper") {
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\n', components: [] });
            await wait(2000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp, components: [] });
            await wait(1000);
            if (opp == "🪨") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + interaction.betAmount + '. 🥳💃🎉', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
            } else if (opp == "📃") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
            } else if (opp == "✂️") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + interaction.betAmount + '. Better luck next time! 🤦😬', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: -1 * betAmount } });
            }
        } else if (interaction.customId.type == "scissors") {
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\n', components: [] });
            await wait(2000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!", components: [] });
            await wait(1000);
            if (opp == "🪨") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + interaction.betAmount + '. Better luck next time! 🤦😬', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: -1 * betAmount } });
            } else if (opp == "📃") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + interaction.betAmount + '. 🥳💃🎉', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
            } else if (opp == "✂️") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
            }
        }
    }
};