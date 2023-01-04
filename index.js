// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const WOK = require('wokcommands');
const path = require('path');
const fetch = require('node-fetch');

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

// When the client is ready, run this code (only once)
client.on('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
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
        botOwners: ['734971051037032569']
    });
    process.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection: ', error);
    });
    client.user.setPresence({
        activities: [{ name: 'with your emotions' }],
        status: 'online',
    });
});

// Log in to Discord with your client's token
client.login(token);