import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getDb } from '../../../db.js';
import { gameId } from '../../../config.js';
import { validateBet } from '../../../lib/bets.js';
import { ROSHAMBO_CHOICES, roshamboEmoji, type RoshamboChoice } from '../../../lib/games.js';
import type { Command } from '../../../types.js';

const buttonStyles: Record<RoshamboChoice, ButtonStyle> = {
    rock: ButtonStyle.Danger,
    paper: ButtonStyle.Success,
    scissors: ButtonStyle.Primary,
};

export default {
    description: 'Play rock paper scissors! Win your bet amount by beating your opponent.',
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
            console.log(`User ${user.username} is playing rock paper scissors and bet ${betAmount} coins.`);
            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                ROSHAMBO_CHOICES.map((playType) =>
                    new ButtonBuilder()
                        .setLabel(roshamboEmoji[playType])
                        .setStyle(buttonStyles[playType])
                        .setCustomId(
                            JSON.stringify({
                                game_id: gameId.roshambo,
                                playType,
                                betAmount,
                                user_id: user.id,
                            }),
                        ),
                ),
            );
            return {
                content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!',
                components: [buttons],
            };
        } catch (e) {
            console.error(e);
            return { content: 'Uh oh! There was an error. Try again. 🤕' };
        }
    },
} satisfies Command;
