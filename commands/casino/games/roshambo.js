const { CommandType, CooldownTypes } = require("wokcommands");
const { mongoClient } = require("../../..");
const { ApplicationCommandOption, ApplicationCommandOptionType } = require('discord.js');

/**
 * @param player user input, 1 = rock, 2 = paper, 3 = scissors
 * @returns 0 = tie, 1 = win, -1 = lose
 */
function rps(player) {
    let opp = Math.ceil(Math.random() * 3);
    if (player == opp) { return 0; }
    if (player == 1) {
        return (opp == 2) ? -1 : 1;
    } else if (player == 2) {
        return (opp == 3) ? -1 : 1;
    } else if (player == 3) {
        return (opp == 1) ? -1 : 1;
    }
}

module.exports = {
    // Required for slash commands
    description: "Play rock paper scissors! Win your bet amount by beating your opponent.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    cooldowns: {
        errorMessage: "You are already working. Please wait {time}.",
        type:CooldownTypes.perUser,
        duration: "5 m"
    },
    // setup args
    expectedArgs: "<bet>",
    minArgs: 1,
    maxArgs: 1,
    aliases: ["rps"],
    correctSyntax: "To run the command, specify the amount of your bet. Must be an integer value.",
    callback: async ({ user }) => {
        try {
            return {
                content: "Not implemented my bad 😂"
            }
            let db = await mongoClient.db('botCasino');
            let _user = await db.collection('users').findOne(
                {
                    user_id: user.id,
                }
            );
            console.log(`User ${user.username} is playing rock paper scissors.`);
            if (_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                }
            }

        } catch (e) {
            console.error(e);
            return {
                content: "Uh oh! There was an error. Try again. 🤕"
            }
        }
    }
}