// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    c.guilds.fetch('927674403825790976').then(g => { //g is a guild
        g.channels.fetch('1053546509288870008').then(ch => { //ch is a channel
            ch.send(`<:secretemote:1054767344108437595>`);
        })
    })
});

// Log in to Discord with your client's token
client.login(token);