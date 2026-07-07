import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getDb } from '../../../db.js';
import { gameId } from '../../../config.js';
import { validateBet } from '../../../lib/bets.js';
import type { Command } from '../../../types.js';

export default {
    description: 'Flip a coin!',
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
    callback: ({ user, interaction }) => {
        try {
            const betAmount = interaction.options.getInteger('bet', true);
            const validation = validateBet(getDb().getUser(user.id), betAmount);
            if (!validation.ok) {
                return { content: validation.message };
            }
            console.log(`User ${user.username} is flipped a coin and bet ${betAmount} coins.`);
            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel('🗿')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(
                        JSON.stringify({
                            game_id: gameId.coinflip,
                            call: 'heads',
                            betAmount,
                            user_id: user.id,
                        }),
                    ),
                new ButtonBuilder()
                    .setLabel('🐈')
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(
                        JSON.stringify({
                            game_id: gameId.coinflip,
                            call: 'tails',
                            betAmount,
                            user_id: user.id,
                        }),
                    ),
            );
            return {
                content: 'Heads or tails? Pick one!',
                components: [buttons],
            };
        } catch (e) {
            console.error(e);
            return { content: 'Uh oh! There was an error. Try again. 🤕' };
        }
    },
} satisfies Command;
