const { mongoClient } = require("../..");
const { reactionRoleMessage } = require("../..");
const wait = require('node:timers/promises').setTimeout;

function getRandomSelection() {
    return (["🪨", "📃", "✂️"])[Math.floor(Math.random() * 3)];
}

module.exports = async (interaction, user) => {
    //console.log("Event triggered");
    if (interaction.isButton()) {
        let db = await mongoClient.db('botCasino');
        let _user = await db.collection('users').findOne(
            { user_id: user.id, }
        );
        let opp = getRandomSelection();
        await interaction.deferUpdate();
        await wait(10);
        let playType = interaction.customId.substring(0, interaction.customId.indexOf(":")),
            betAmount = parseInt(interaction.customId.substring(interaction.customId.indexOf(":") + 1, interaction.customId.length));
        console.log("Interaction event triggered. " + "playType==" + playType + ", user==" + interaction.user + ", betAmt==" + betAmount);
        if (playType == "rock") {
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\n', components: [] });
            await wait(2000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!", components: [] });
            await wait(1000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!", components: [] });
            if (opp == "🪨") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
            } else if (opp == "📃") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + betAmount + '. 🥳💃🎉', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
            } else if (opp == "✂️") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + betAmount + '. Better luck next time! 🤦😬', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $dec: { coins: betAmount } });
            }
        } else if (playType == "paper") {
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\n', components: [] });
            await wait(2000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp, components: [] });
            await wait(1000);
            if (opp == "🪨") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + betAmount + '. 🥳💃🎉', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
            } else if (opp == "📃") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
            } else if (opp == "✂️") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + betAmount + '. Better luck next time! 🤦😬', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $dec: { coins: betAmount } });
            }
        } else if (playType == "scissors") {
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\n', components: [] });
            await wait(2000);
            await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!", components: [] });
            await wait(1000);
            if (opp == "🪨") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + betAmount + '. Better luck next time! 🤦😬', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $dec: { coins: betAmount } });
            } else if (opp == "📃") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + betAmount + '. 🥳💃🎉', components: [] });
                db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
            } else if (opp == "✂️") {
                await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
            }
        }
    }
};