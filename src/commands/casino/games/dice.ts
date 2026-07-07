import { ApplicationCommandOptionType } from 'discord.js';
import { getDb } from '../../../db.js';
import { setTimeout as wait } from 'node:timers/promises';
import { validateBet } from '../../../lib/bets.js';
import { dicePayoutMultiplier, type DiceRoll } from '../../../lib/games.js';
import type { Command } from '../../../types.js';

function getRandomRoll() {
    return Math.ceil(Math.random() * 6);
}

export default {
    description: 'Play dice!',
    cooldown: 30000,
    options: [
        {
            name: 'bet',
            description: 'The amount of coins to bet',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
        },
    ],
    callback: async ({ user, channel, interaction }) => {
        if (!channel?.isSendable()) {
            return { content: 'This command can only be used in a server channel.' };
        }
        try {
            const db = getDb();
            const betAmount = interaction.options.getInteger('bet', true);
            const validation = validateBet(db.getUser(user.id), betAmount);
            if (!validation.ok) {
                return { content: validation.message };
            }

            const player: DiceRoll = [getRandomRoll(), getRandomRoll()];
            const opponent: DiceRoll = [getRandomRoll(), getRandomRoll()];

            console.log(`User ${user.username} wagered ${betAmount} coins in dice.`);
            await interaction.reply({
                content: `${user.username} wagered ${betAmount} coins and rolled the dice... 🎲`,
            });

            await wait(1500);
            await channel.send(`You rolled a ${player[0]} and ${player[1]}.`);

            await wait(2500);
            await channel.send(`Your opponent rolled ${opponent[0]} and ${opponent[1]}.`);

            await wait(2000);
            const multiplier = dicePayoutMultiplier(player, opponent);
            // Re-checked at settlement time: the balance may have changed since validation.
            if (multiplier !== 0 && !db.settleBet(user.id, betAmount, multiplier)) {
                await channel.send(
                    'Your balance can no longer cover this bet, so the game was voided. No coins were exchanged.',
                );
                return;
            }
            switch (multiplier) {
                case 4:
                    await channel.send(`Miraculous 🍀! You win 4x your bet, gaining ${betAmount * 4} coins!`);
                    break;
                case 2:
                    await channel.send(
                        `Incredible 🤯! You win double your bet, gaining ${betAmount * 2} coins!`,
                    );
                    break;
                case 1:
                    await channel.send(`Nice 🤯! You win your bet amount, gaining ${betAmount} coins!`);
                    break;
                case -1:
                    await channel.send(`😖 Your opponent won! You lose ${betAmount} coins! Sorry. 😵`);
                    break;
                case 0:
                    await channel.send('😲 A tie! You get your bet back.');
                    break;
            }
        } catch (e) {
            console.error('Error in dice command:', e);
            if (!interaction.replied) {
                return { content: 'Uh oh! There was an error. Try again. 🤕' };
            }
            try {
                await channel.send(
                    'Uh oh! Something went wrong with the dice game. Your bet may not have been processed. 🤕',
                );
            } catch (sendErr) {
                console.warn('Failed to send dice error feedback:', sendErr);
            }
        }
    },
} satisfies Command;
