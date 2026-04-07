import { ApplicationCommandOptionType } from 'discord.js';
import { db } from "../../../db.js";
import type { Command } from '../../../types.js';

export default {
    description: "Flip a coin!",
    cooldown: 30000,
    options: [
        {
            name: 'bet',
            description: 'The amount of coins to bet',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    callback: async ({ user, args }) => {
        try {
            const _user = db.getUser(user.id);
            if (!_user) {
                return { content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!" };
            }
            const betAmount = parseInt(args[0]);
            if (isNaN(betAmount)) {
                return { content: "Inappropriate" };
            }
            if (betAmount <= 0) {
                return { content: "You need to bet at least 1 coin. Sorry! I don't make the rules." };
            }
            if (betAmount > _user.coins) {
                return { content: "Sorry! You don't have enough coins to place this bet. Did you try having more money?" };
            }
            console.log(`User ${user.username} is flipped a coin and bet ${betAmount} coins.`);
            return {
                content: "Heads or tails? Pick one!",
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2, label: "🗿", style: 4,
                                custom_id: JSON.stringify({ call: "heads", betAmount, user: user.id }),
                                user: user.id,
                            },
                            {
                                type: 2, label: "🐈", style: 3,
                                custom_id: JSON.stringify({ call: "tails", betAmount, user: user.id }),
                                user: user.id,
                            }
                        ]
                    }
                ]
            };
        } catch (e) {
            console.error(e);
            return { content: "Uh oh! There was an error. Try again. 🤕" };
        }
    }
} satisfies Command;
