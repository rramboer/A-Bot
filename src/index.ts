import { Client, GatewayIntentBits, Partials } from 'discord.js';
import WOK from 'wokcommands';
import path from 'path';
import config from '../config.json';

const { token, owners, roleMessage } = config;

export const reactionRoleChannel = roleMessage.channel;
export const reactionRoleMessage = roleMessage.message;

export const gameId = {
    roshambo: "d7d3",
    coinflip: "17f0",
    hangman: "ac6b"
};

export const studentRole = '1053544751439290448';
export const studentAlumRole = '927680207505211443';
export let mongoClient: any = null;

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

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

export const discordClient = client;

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
    client.user!.setPresence({
        activities: [{ name: 'Casino Beta - v1.9.9' }],
        status: 'online',
    });
    (client.channels.cache.get(roleMessage.channel) as any).messages.fetch(roleMessage.message);
});

client.login(token);
