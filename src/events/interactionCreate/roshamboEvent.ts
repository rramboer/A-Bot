import { Interaction } from 'discord.js';
import { mongoClient, gameId } from "../..";
import { setTimeout as wait } from 'node:timers/promises';

function getRandomSelection() {
    return (["🪨", "📃", "✂️"])[Math.floor(Math.random() * 3)];
}

module.exports = async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === undefined) return;

    const data = JSON.parse(interaction.customId);
    if (data.game_id != gameId.roshambo) return;

    const db = await mongoClient.db('botCasino');
    const _user = await db.collection('users').findOne({ user_id: interaction.user.id });
    const opp = getRandomSelection();
    await wait(100);
    let playType = data.playType;
    const betAmount = parseInt(data.betAmount);
    const verification_id = data.user_id;
    if (verification_id != _user.user_id) return;

    let game_multiplier = 0;
    if (playType == "rock") {
        game_multiplier = (opp == "📃") ? -1 : ((opp == "✂️") ? 1 : 0);
    } else if (playType == "paper") {
        game_multiplier = (opp == "📃") ? 0 : ((opp == "✂️") ? -1 : 1);
    } else if (playType == "scissors") {
        game_multiplier = (opp == "📃") ? 1 : ((opp == "✂️") ? 0 : -1);
    }
    playType = (playType == "rock") ? "🪨" : ((playType == "scissors") ? "✂️" : "📃");
    await interaction.editReply({
        content: `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ${playType}!\n`,
        components: []
    });
    let final_message = ``;
    if (game_multiplier == 0) {
        final_message = `🤦 A tie! ${interaction.user.username}'s bet is returned.`;
    } else if (game_multiplier == -1) {
        final_message = `☠️ You lose! ${interaction.user.username}'s bet of ${betAmount} coins has been seized by the opponent! 😵`;
    } else {
        final_message = `Victory! ${interaction.user.username} wins their bet amount of ${betAmount}! 🥳💃🎉`;
    }
    await wait(1000);
    await interaction.editReply({
        content: `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ${playType}\nYour opponent chose ${opp}`,
        components: []
    });
    await wait(1000);
    await interaction.editReply({
        content: `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ${playType}\nYour opponent chose ${opp}\n${final_message}`,
        components: []
    });
    db.collection('users').updateOne({ user_id: interaction.user.id }, { $inc: { coins: game_multiplier * betAmount } });
};
