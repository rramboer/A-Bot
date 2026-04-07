import { Interaction } from 'discord.js';
import { mongoClient, gameId } from "../../index.js";
import { setTimeout as wait } from 'node:timers/promises';

function getRandomSelection() {
    return (["🪨", "📃", "✂️"])[Math.floor(Math.random() * 3)];
}

export default async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === undefined) return;

    let data;
    try {
        data = JSON.parse(interaction.customId);
    } catch {
        return; // Not a JSON customId, not ours
    }
    if (data.game_id != gameId.roshambo) return;

    try {
        await interaction.deferUpdate();

        const db = mongoClient.db('botCasino');
        const _user = await db.collection('users').findOne({ user_id: interaction.user.id });
        const opp = getRandomSelection();
        await wait(100);
        let playType = data.playType;
        const betAmount = parseInt(data.betAmount);
        const verification_id = data.user_id;
        if (!_user || verification_id != _user.user_id) return;

        const outcomes: Record<string, Record<string, number>> = {
            rock:     { "📃": -1, "✂️": 1,  "🪨": 0 },
            paper:    { "📃": 0,  "✂️": -1, "🪨": 1 },
            scissors: { "📃": 1,  "✂️": 0,  "🪨": -1 },
        };
        const emojiMap: Record<string, string> = { rock: "🪨", paper: "📃", scissors: "✂️" };
        const game_multiplier = outcomes[playType]?.[opp] ?? 0;
        playType = emojiMap[playType];
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
        await db.collection('users').updateOne({ user_id: interaction.user.id }, { $inc: { coins: game_multiplier * betAmount } });
        await wait(1000);
        await interaction.editReply({
            content: `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ${playType}\nYour opponent chose ${opp}\n${final_message}`,
            components: []
        });
    } catch (err) {
        console.error('Error in roshambo event handler:', err);
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: 'Something went wrong with roshambo. Please try again.' });
            }
        } catch (innerErr) { console.warn('Failed to send roshambo error feedback:', innerErr); }
    }
};
