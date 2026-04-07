import { Interaction } from 'discord.js';
import { db } from "../../db.js";
import { setTimeout as wait } from 'node:timers/promises';

export default async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    let parsed;
    try {
        parsed = JSON.parse(interaction.customId);
    } catch {
        return; // Not a JSON customId, not ours
    }
    if (!parsed.call) return; // Not a coinflip interaction

    try {
        const _user = db.getUser(interaction.user.id);
        await interaction.deferUpdate();
        await wait(100);
        const { call, betAmount, user } = parsed;
        if (!_user || user != _user.user_id) { return; }
        let game_multiplier = 1;
        if (Math.random() < 0.5) { game_multiplier = -1; }
        let final_message = ``;
        if (game_multiplier == -1) {
            final_message = `You lose, it was ${call === "heads" ? "tails" : "heads"}! ${interaction.user.username}'s bet of ${betAmount} coins has been seized by the opponent! 😵`;
        } else {
            final_message = `Correct, ${call}! ${interaction.user.username} wins their bet amount of ${betAmount}! 🥳💃🎉`;
        }
        db.addCoins(interaction.user.id, game_multiplier * betAmount);
        await wait(1000);
        await interaction.editReply({
            content: (
                `Time for a coinflip!
You chose ${call}
${final_message}`),
            components: []
        });
    } catch (err) {
        console.error('Error in coinflip event handler:', err);
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: 'Something went wrong with the coinflip. Please try again.' });
            }
        } catch (innerErr) { console.warn('Failed to send coinflip error feedback:', innerErr); }
    }
};
