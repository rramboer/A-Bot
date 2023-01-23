
const { MongoClient, MongoDB } = require('mongodb')
const { mongoURI, token, owners, roleMessage } = require('./config.json');
const MONGODB_URI = mongoURI
const mongoClient = new MongoClient(MONGODB_URI);

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const WOK = require('wokcommands');
const path = require('path');
const fetch = require('node-fetch');
const { fetchTest } = require('./db');

//fetchTest(mongoClient);

reactionRoleChannel = roleMessage.channel;
reactionRoleMessage = roleMessage.message;

const gameId = {
    roshambo: "d7d3",
    coinflip: "17f0",
    hangman: "ac6b"
}

const studentRole = '1053544751439290448'; // Student role
const studentAlumRole = '927680207505211443'; // Student Alumni role
exports.studentRole = studentRole;
exports.studentAlumRole = studentAlumRole;
exports.reactionRoleChannel = reactionRoleChannel;
exports.reactionRoleMessage = reactionRoleMessage;
exports.mongoClient = mongoClient;
exports.gameId = gameId;

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

// Create a client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel],
});
exports.discordClient = client;
// When the client is ready, run this code (only once)
client.on('ready', c => {
    console.log(`Bot is online! Logged in as ${c.user.username}...`);
    new WOK({
        client,
        commandsDir: path.join(__dirname, 'commands'),
        disabledDefaultCommands: [
            'channelcommand',
            'customcommand',
            'delcustomcommand',
            'prefix',
            'requiredpermissions',
            'requiredroles',
            'togglecommand',
        ],
        events: {
            dir: path.join(__dirname, 'events'),
        },
        botOwners: owners
    });
    process.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection: ', error);
    });
    client.user.setPresence({
        activities: [{ name: 'Casino Beta - v1.9.9' }],
        status: 'online',
    });
    client.channels.cache.get(roleMessage.channel).messages.fetch(roleMessage.message);
});
// Log in to Discord with your client's token
client.login(token);
