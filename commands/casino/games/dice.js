const { CommandType } = require("wokcommands");
const { mongoClient } = require("../../..");
const { discordClient } = require('../../../index');
const { ApplicationCommandOption, ApplicationCommandOptionType, channelLink, Application } = require('discord.js');

function getRandomRoll() {
    return Math.ceil(Math.random() * 6);
}

function sendMessage() {

}

async function playGame(client, betAmount) {
    console.log("TEST");
    let player = [getRandomRoll(), getRandomRoll()],
        opp = [getRandomRoll(), getRandomRoll()];
    setTimeout(((c, p) => { c.send("You rolled a " + p[0] + " and " + p[1] + ".") }).bind(client, player), 1500);
    setTimeout(((c, p) => { c.send("Your opponent rolled " + p[0] + " and " + p[1] + ".") }).bind(client, opp), 4000);
    if ((player[0] + player[1]) > (opp[0] + opp[1])) {
        if (player[0] == player[1]) {
            setTimeout(((c, betAmount) => { c.send("Nice 🤯! You win double your bet, gaining " + (betAmount * 2) + " coins!") }).bind(client, betAmount), 6000);
        } else {
            setTimeout(((c, betAmount) => { c.send("Nice 🤯! You win back your bet, gaining " + (betAmount) + " coins!") }).bind(client, betAmount), 6000);
        }
    } else if ((player[0] + player[1]) < (opp[0] + opp[1])) {
        setTimeout(((c, betAmount) => { c.send("😖 Your opponent won! You lost " + betAmount + " coins! Sorry. 😵") }).bind(client, betAmount), 6000);
    } else {
        setTimeout(((c, betAmount) => { c.send("😲 A tie! You get your bet back.") }).bind(client, betAmount), 6000);

    }
    // c.send('test');
}

module.exports = {
    // Required for slash commands
    description: "Play dice!",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    // setup args
    expectedArgs: "<bet>",
    minArgs: 1,
    maxArgs: 1,
    correctSyntax: "To run the command, specify the amount of your bet. Must be an integer value.",
    callback: async ({ args, user, client, channel }) => {
        try {
            let db = await mongoClient.db('botCasino');
            let _user = await db.collection('users').findOne(
                {
                    user_id: user.id,
                }
            );
            console.log("attempting to find user " + user.username + " with ID=" + user.id);
            if (_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                }
            }

            var betAmount = parseInt(args[0]);
            if (betAmount < 0) {
                return {
                    content: "You can't bet an amount less than zero. Sorry! I don't make the rules."
                }
            }
            if (betAmount > _user.coins) {
                return {
                    content: "Sorry! You don't have enough coins to place this bet. Did you try having more money?"
                }
            }
            let player = [getRandomRoll(), getRandomRoll()],
                opp = [getRandomRoll(), getRandomRoll()];
            console.log("player rolls = " + player[0] + "," + player[1]);
            console.log("opp rolls = " + opp[0] + "," + opp[1]);
            setTimeout(((client, p) => { client.channels.cache.get(channel.id).send("You rolled a " + p[0] + " and " + p[1] + ".") }), 1500, client, player);
            setTimeout(((client, p) => { client.channels.cache.get(channel.id).send("Your opponent rolled " + p[0] + " and " + p[1] + ".") }), 4000, client, opp);
            if ((player[0] + player[1]) > (opp[0] + opp[1])) {
                if (player[0] == player[1]) {
                    setTimeout(((db, client, channel, user, betAmount) => {
                        db.collection('users').updateOne({ user_id: user.id }, {
                            $inc: { coins: betAmount * 2, }
                        });
                        client.channels.cache.get(channel.id).send("Incredible 🤯! You win double your bet, gaining " + (betAmount * 2) + " coins!");
                    }), 6000, db, client, channel, user, betAmount);

                } else {
                    setTimeout(((db, client, channel, user, betAmount) => {
                        db.collection('users').updateOne({ user_id: user.id }, {
                            $inc: { coins: betAmount, }
                        });
                        client.channels.cache.get(channel.id).send("Nice 🤯! You win your bet amount, gaining " + (betAmount) + " coins!");
                    }), 6000, db, client, channel, user, betAmount);
                }
            } else if ((player[0] + player[1]) < (opp[0] + opp[1])) {
                setTimeout(((db, client, channel, user, betAmount) => {
                    db.collection('users').updateOne({ user_id: user.id }, {
                        $inc: { coins: betAmount * -1, }
                    });
                    client.channels.cache.get(channel.id).send("Your opponent beat you! You lose " + betAmount + " coins! Sorry. 😵");
                }), 6000, db, client, channel, user, betAmount);
            } else {
                setTimeout(((db, c, user, betAmount) => {
                    client.channels.cache.get(channel.id).send("😲 A tie! You get your bet back.");
                }), 6000, db, client, channel, user, betAmount);

            }
            return {
                content: "Rolling the dice with a very ambitious bet of " + betAmount + " coins...🎲"
            }

        } catch (e) {
            console.error(e);
            return {
                content: "Uh oh! There was an error. Try again. 🤕"
            }
        }
    }
}