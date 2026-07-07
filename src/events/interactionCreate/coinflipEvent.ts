import type { Interaction } from 'discord.js';
import { getDb } from '../../db.js';
import { gameId } from '../../config.js';
import { setTimeout as wait } from 'node:timers/promises';

interface CoinflipPayload {
    call: 'heads' | 'tails';
    betAmount: number;
    user_id: string;
}

/** Parses a button customId, returning the coinflip payload or null if it is not ours. */
function parseCustomId(customId: string): CoinflipPayload | null {
    let parsed: unknown;
    try {
        parsed = JSON.parse(customId);
    } catch {
        return null; // Not a JSON customId, not ours
    }
    if (typeof parsed !== 'object' || parsed === null) return null;
    const data = parsed as Record<string, unknown>;
    if (data.game_id !== gameId.coinflip) return null;
    if (data.call !== 'heads' && data.call !== 'tails') return null;
    if (typeof data.betAmount !== 'number' || typeof data.user_id !== 'string') return null;
    return { call: data.call, betAmount: data.betAmount, user_id: data.user_id };
}

export default async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const data = parseCustomId(interaction.customId);
    if (!data) return; // Not a coinflip interaction

    try {
        const db = getDb();
        const record = db.getUser(interaction.user.id);
        await interaction.deferUpdate();
        await wait(100);
        const { call, betAmount, user_id } = data;
        if (!record) return;
        if (user_id !== record.user_id) return;
        const gameMultiplier = Math.random() < 0.5 ? -1 : 1;
        // Re-validate at settlement time: the balance may have dropped since the bet
        // was placed (other games, /leavecasino, ...). Voiding keeps balances >= 0.
        if (!db.settleBet(record.user_id, betAmount, gameMultiplier)) {
            await interaction.editReply({
                content:
                    'Your balance can no longer cover this bet, so the game was voided. No coins were exchanged.',
                components: [],
            });
            return;
        }
        const finalMessage =
            gameMultiplier === -1
                ? `You lose, it was ${call === 'heads' ? 'tails' : 'heads'}! ${interaction.user.username}'s bet of ${betAmount} coins has been seized by the opponent! 😵`
                : `Correct, ${call}! ${interaction.user.username} wins their bet amount of ${betAmount}! 🥳💃🎉`;
        await wait(1000);
        await interaction.editReply({
            content: `Time for a coinflip!\nYou chose ${call}\n${finalMessage}`,
            components: [],
        });
    } catch (err) {
        console.error('Error in coinflip event handler:', err);
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'Something went wrong with the coinflip. Please try again.',
                });
            }
        } catch (innerErr) {
            console.warn('Failed to send coinflip error feedback:', innerErr);
        }
    }
};
