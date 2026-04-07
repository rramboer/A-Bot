import { CommandType, CooldownTypes } from "wokcommands";
import { CommandUsage } from "wokcommands";
import { ApplicationCommandOptionType } from 'discord.js';
import { mongoClient, gameId } from "../../..";

module.exports = {
    description: "Play rock paper scissors! Win your bet amount by beating your opponent.",
    type: CommandType.BOTH,
    cooldowns: {
        errorMessage: "Please wait {TIME} before playing again. Sorry about that!",
        type: CooldownTypes.perUser,
        duration: "30 s"
    },
    expectedArgs: "<bet>",
    minArgs: 1,
    maxArgs: 1,
    aliases: ["rps"],
    correctSyntax: "To run the command, specify the amount of your bet. Must be an integer value.",
    callback: async ({ user, args }: CommandUsage) => {
        try {
            const db = await mongoClient.db('botCasino');
            const _user = await db.collection('users').findOne({ user_id: user.id });
            if (_user == undefined || _user == null) {
                return { content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!" };
            }
            const betAmount = parseInt(args[0]);
            if (betAmount < 0) {
                return { content: "You can't bet an amount less than zero. Sorry! I don't make the rules." };
            }
            if (isNaN(betAmount)) {
                return { content: "Inappropriate" };
            }
            if (betAmount > _user.coins) {
                return { content: "Sorry! You don't have enough coins to place this bet. Did you try having more money?" };
            }
            console.log(`User ${user.username} is playing rock paper scissors and bet ${betAmount} coins.`);
            return {
                content: "Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!",
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2, label: "🪨", style: 4,
                                custom_id: JSON.stringify({ game_id: gameId.roshambo, playType: "rock", betAmount, user_id: user.id }),
                                user: user.id,
                            },
                            {
                                type: 2, label: "📃", style: 3,
                                custom_id: JSON.stringify({ game_id: gameId.roshambo, playType: "paper", betAmount, user_id: user.id }),
                                user: user.id,
                            },
                            {
                                type: 2, label: "✂️", style: 1,
                                custom_id: JSON.stringify({ game_id: gameId.roshambo, playType: "scissors", betAmount, user_id: user.id }),
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
};
