import { CommandType, CooldownTypes } from "wokcommands";
import { CommandUsage } from "wokcommands";
import { TextChannel } from "discord.js";
import { mongoClient } from "../../..";

function getRandomRoll() {
    return Math.ceil(Math.random() * 6);
}

module.exports = {
    description: "Play dice!",
    type: CommandType.BOTH,
    cooldowns: {
        type: CooldownTypes.perUser,
        duration: "30 s"
    },
    expectedArgs: "<bet>",
    minArgs: 1,
    maxArgs: 1,
    correctSyntax: "To run the command, specify the amount of your bet. Must be an integer value.",
    callback: async ({ args, user, client, channel }: CommandUsage) => {
        try {
            const db = await mongoClient.db('botCasino');
            const _user = await db.collection('users').findOne({ user_id: user.id });
            if (_user == undefined || _user == null) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                };
            }

            const betAmount = parseInt(args[0]);
            if (betAmount < 0) {
                return {
                    content: "You can't bet an amount less than zero. Sorry! I don't make the rules."
                };
            }
            if (isNaN(betAmount)) {
                return { content: "Inappropriate" };
            }
            if (betAmount > _user.coins) {
                return {
                    content: "Sorry! You don't have enough coins to place this bet. Did you try having more money?"
                };
            }
            const player = [getRandomRoll(), getRandomRoll()];
            const opp = [getRandomRoll(), getRandomRoll()];
            setTimeout(() => {
                (client.channels.cache.get(channel!.id) as TextChannel).send("You rolled a " + player[0] + " and " + player[1] + ".");
            }, 1500);
            setTimeout(() => {
                (client.channels.cache.get(channel!.id) as TextChannel).send("Your opponent rolled " + opp[0] + " and " + opp[1] + ".");
            }, 4000);
            if ((player[0] + player[1]) > (opp[0] + opp[1])) {
                if (player[0] == player[1]) {
                    if (player[0] == 6) {
                        setTimeout(() => {
                            db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount * 4 } });
                            (client.channels.cache.get(channel!.id) as TextChannel).send("Miraculous 🍀! You win 4x your bet, gaining " + (betAmount * 4) + " coins!");
                        }, 6000);
                    } else {
                        setTimeout(() => {
                            db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount * 2 } });
                            (client.channels.cache.get(channel!.id) as TextChannel).send("Incredible 🤯! You win double your bet, gaining " + (betAmount * 2) + " coins!");
                        }, 6000);
                    }
                } else {
                    setTimeout(() => {
                        db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
                        (client.channels.cache.get(channel!.id) as TextChannel).send("Nice 🤯! You win your bet amount, gaining " + (betAmount) + " coins!");
                    }, 6000);
                }
            } else if ((player[0] + player[1]) < (opp[0] + opp[1])) {
                setTimeout(() => {
                    db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount * -1 } });
                    (client.channels.cache.get(channel!.id) as TextChannel).send(`😖 Your opponent won! You lose ${betAmount} coins! Sorry. 😵`);
                }, 6000);
            } else {
                setTimeout(() => {
                    (client.channels.cache.get(channel!.id) as TextChannel).send("😲 A tie! You get your bet back.");
                }, 6000);
            }
            console.log(`User ${user.username} wagered ${betAmount} coins in dice.`);
            return {
                content: `${user.username} wagered ${betAmount} coins and rolled the dice... 🎲`
            };
        } catch (e) {
            console.error(e);
            return {
                content: "Uh oh! There was an error. Try again. 🤕"
            };
        }
    }
};
