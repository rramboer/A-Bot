import type { Interaction } from 'discord.js';
import { getDb } from '../../db.js';
import { gameId } from '../../config.js';
import { setTimeout as wait } from 'node:timers/promises';
import {
    ROSHAMBO_CHOICES,
    isRoshamboChoice,
    roshamboEmoji,
    roshamboOutcome,
    type RoshamboChoice,
} from '../../lib/games.js';

interface RoshamboPayload {
    playType: RoshamboChoice;
    betAmount: number;
    user_id: string;
}

function getRandomSelection(): RoshamboChoice {
    const choice = ROSHAMBO_CHOICES[Math.floor(Math.random() * ROSHAMBO_CHOICES.length)];
    return choice ?? 'rock'; // index is always in range; fallback satisfies noUncheckedIndexedAccess
}

/** Parses a button customId, returning the roshambo payload or null if it is not ours. */
function parseCustomId(customId: string): RoshamboPayload | null {
    let parsed: unknown;
    try {
        parsed = JSON.parse(customId);
    } catch {
        return null; // Not a JSON customId, not ours
    }
    if (typeof parsed !== 'object' || parsed === null) return null;
    const data = parsed as Record<string, unknown>;
    if (data.game_id !== gameId.roshambo) return null;
    if (!isRoshamboChoice(data.playType)) return null;
    if (typeof data.betAmount !== 'number' || typeof data.user_id !== 'string') return null;
    return { playType: data.playType, betAmount: data.betAmount, user_id: data.user_id };
}

export default async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const data = parseCustomId(interaction.customId);
    if (!data) return; // Not a roshambo interaction

    try {
        await interaction.deferUpdate();

        const db = getDb();
        const record = db.getUser(interaction.user.id);
        const opponent = getRandomSelection();
        await wait(100);
        const { playType, betAmount, user_id } = data;
        if (!record) return;
        if (user_id !== record.user_id) return;

        const gameMultiplier = roshamboOutcome(playType, opponent);
        const playEmoji = roshamboEmoji[playType];
        const opponentEmoji = roshamboEmoji[opponent];
        const prompt = 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!';
        await interaction.editReply({
            content: `${prompt}\nYou chose ${playEmoji}!\n`,
            components: [],
        });
        // Re-validate at settlement time: the balance may have dropped since the bet
        // was placed (other games, /leavecasino, ...). Voiding keeps balances >= 0.
        if (gameMultiplier !== 0 && !db.settleBet(record.user_id, betAmount, gameMultiplier)) {
            await interaction.editReply({
                content: `${prompt}\nYou chose ${playEmoji}\nYour balance can no longer cover this bet, so the game was voided. No coins were exchanged.`,
                components: [],
            });
            return;
        }
        let finalMessage: string;
        if (gameMultiplier === 0) {
            finalMessage = `🤦 A tie! ${interaction.user.username}'s bet is returned.`;
        } else if (gameMultiplier === -1) {
            finalMessage = `☠️ You lose! ${interaction.user.username}'s bet of ${betAmount} coins has been seized by the opponent! 😵`;
        } else {
            finalMessage = `Victory! ${interaction.user.username} wins their bet amount of ${betAmount}! 🥳💃🎉`;
        }
        await wait(1000);
        await interaction.editReply({
            content: `${prompt}\nYou chose ${playEmoji}\nYour opponent chose ${opponentEmoji}`,
            components: [],
        });
        await wait(1000);
        await interaction.editReply({
            content: `${prompt}\nYou chose ${playEmoji}\nYour opponent chose ${opponentEmoji}\n${finalMessage}`,
            components: [],
        });
    } catch (err) {
        console.error('Error in roshambo event handler:', err);
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'Something went wrong with roshambo. Please try again.',
                });
            }
        } catch (innerErr) {
            console.warn('Failed to send roshambo error feedback:', innerErr);
        }
    }
};
