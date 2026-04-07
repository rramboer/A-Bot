import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { db } from "../../../db.js";
import { setTimeout as wait } from 'node:timers/promises';
import type { Command } from '../../../types.js';

function getRandomRoll() {
    return Math.ceil(Math.random() * 6);
}

export default {
    description: "Play dice!",
    cooldown: 30000,
    options: [
        {
            name: 'bet',
            description: 'The amount of coins to bet',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    callback: async ({ args, user, client, channel, interaction }) => {
        if (!channel) return { content: 'This command can only be used in a server channel.' };
        try {
            const _user = db.getUser(user.id);
            if (!_user) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                };
            }

            const betAmount = parseInt(args[0]);
            if (isNaN(betAmount)) {
                return { content: "Inappropriate" };
            }
            if (betAmount <= 0) {
                return {
                    content: "You need to bet at least 1 coin. Sorry! I don't make the rules."
                };
            }
            if (betAmount > _user.coins) {
                return {
                    content: "Sorry! You don't have enough coins to place this bet. Did you try having more money?"
                };
            }

            const textChannel = client.channels.cache.get(channel.id) as TextChannel;
            const player = [getRandomRoll(), getRandomRoll()];
            const opp = [getRandomRoll(), getRandomRoll()];

            console.log(`User ${user.username} wagered ${betAmount} coins in dice.`);
            await interaction.reply({ content: `${user.username} wagered ${betAmount} coins and rolled the dice... 🎲` });

            await wait(1500);
            await textChannel.send("You rolled a " + player[0] + " and " + player[1] + ".");

            await wait(2500);
            await textChannel.send("Your opponent rolled " + opp[0] + " and " + opp[1] + ".");

            await wait(2000);
            if ((player[0] + player[1]) > (opp[0] + opp[1])) {
                if (player[0] == player[1]) {
                    if (player[0] == 6) {
                        db.addCoins(user.id, betAmount * 4);
                        await textChannel.send("Miraculous 🍀! You win 4x your bet, gaining " + (betAmount * 4) + " coins!");
                    } else {
                        db.addCoins(user.id, betAmount * 2);
                        await textChannel.send("Incredible 🤯! You win double your bet, gaining " + (betAmount * 2) + " coins!");
                    }
                } else {
                    db.addCoins(user.id, betAmount);
                    await textChannel.send("Nice 🤯! You win your bet amount, gaining " + (betAmount) + " coins!");
                }
            } else if ((player[0] + player[1]) < (opp[0] + opp[1])) {
                db.addCoins(user.id, betAmount * -1);
                await textChannel.send(`😖 Your opponent won! You lose ${betAmount} coins! Sorry. 😵`);
            } else {
                await textChannel.send("😲 A tie! You get your bet back.");
            }
        } catch (e) {
            console.error('Error in dice command:', e);
            if (!interaction.replied) {
                return { content: "Uh oh! There was an error. Try again. 🤕" };
            }
            try {
                const ch = client.channels.cache.get(channel.id) as TextChannel;
                await ch.send("Uh oh! Something went wrong with the dice game. Your bet may not have been processed. 🤕");
            } catch (sendErr) { console.warn('Failed to send dice error feedback:', sendErr); }
        }
    }
} satisfies Command;
