const { CommandType, CooldownTypes } = require("wokcommands");
const { mongoClient } = require("../../..");
const { ApplicationCommandOption, ApplicationCommandOptionType } = require('discord.js');
// const { cannotHaveAUsernamePasswordPort } = require("whatwg-url");

/**
 * @param player user input, 1 = rock, 2 = paper, 3 = scissors
 * @returns 0 = tie, 1 = win, -1 = lose
 */
function coinflip() {
    let opp = Math.ceil(Math.random() * 2);
    return opp === 1 ? 1 : -1;
}

module.exports = {
    // Required for slash commands
    description: "Flip a coin!",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    cooldowns: {
        errorMessage: "Please wait {TIME} before playing again. Sorry about that!",
        type: CooldownTypes.perUser,
        duration: "30 s"
    },
    // setup args
    expectedArgs: "<bet>",
    minArgs: 1,
    maxArgs: 1,
    correctSyntax: "To run the command, specify the amount of your bet. Must be an integer value.",
    callback: async ({ user, args }) => {
        try {
            //console.log(`User ${user.username} with id ${user.id} is trying trying to play roshambo!`)
            let db = await mongoClient.db('botCasino');
            let _user = await db.collection('users').findOne({ user_id: user.id, });
            if (_user == undefined || _user == null || _user == NaN) {
                return { content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!" }
            }
            let betAmount = parseInt(args[0]);
            if (betAmount < 0) {
                return { content: "You can't bet an amount less than zero. Sorry! I don't make the rules." }
            }
            if (isNaN(betAmount)) {
                return { content: "Inappropriate" }
            }
            if (betAmount > _user.coins) {
                return { content: "Sorry! You don't have enough coins to place this bet. Did you try having more money?" }
            }
            console.log(`User ${user.username} is flipped a coin and bet ${betAmount} coins.`);
            return {
                content: "Heads or tails? Pick one!",
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "🗿",
                                style: 4,
                                custom_id: (`heads:${betAmount}:${user.id}`),
                                user: user.id,
                            },
                            {
                                type: 2,
                                label: "🐈",
                                style: 3,
                                custom_id: (`tails:${betAmount}:${user.id}`),
                                user: user.id,
                            }
                        ]
                    }
                ]
            }
        } catch (e) {
            console.error(e);
            return {
                content: "Uh oh! There was an error. Try again. 🤕"
            }
        }
    }
}