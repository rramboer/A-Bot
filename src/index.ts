import { Client, GatewayIntentBits, Partials, REST, Routes, Collection } from 'discord.js';
import { MongoClient } from 'mongodb';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
import type { Command } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let config: any;
try {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf-8'));
} catch (err) {
    console.error('FATAL: Could not read config.json. See README.md for setup instructions.');
    console.error(err);
    process.exit(1);
}
const { token, owners, roleMessage, mongoURI } = config;

export const reactionRoleChannel = roleMessage.channel;
export const reactionRoleMessage = roleMessage.message;

export const gameId = {
    roshambo: "d7d3",
    coinflip: "17f0",
    hangman: "ac6b"
};

export const studentRole = '1053544751439290448';
export const studentAlumRole = '927680207505211443';
export let mongoClient: MongoClient;

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

function getFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...getFiles(full));
        else if (entry.name.endsWith('.js')) files.push(full);
    }
    return files;
}

const cooldowns = new Map<string, Map<string, number>>();
const commands = new Collection<string, Command>();

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    // Cooldown check
    if (command.cooldown) {
        if (!cooldowns.has(interaction.commandName)) {
            cooldowns.set(interaction.commandName, new Map());
        }
        const timestamps = cooldowns.get(interaction.commandName)!;
        const now = Date.now();
        const userId = interaction.user.id;

        if (timestamps.has(userId)) {
            const expiration = timestamps.get(userId)! + command.cooldown;
            if (now < expiration) {
                const left = (expiration - now) / 1000;
                const timeStr = left > 60
                    ? `${Math.ceil(left / 60)} minute(s)`
                    : `${Math.ceil(left)} second(s)`;
                await interaction.reply({
                    content: `Please wait ${timeStr} before using this command again.`,
                    ephemeral: true
                });
                return;
            }
        }
        timestamps.set(userId, now);
    }

    const args = interaction.options.data.map(opt => String(opt.value));
    const text = args.join(' ');

    try {
        const result = await command.callback({
            client,
            user: interaction.user,
            guild: interaction.guild,
            interaction,
            channel: interaction.channel,
            args,
            text,
        });
        if (result && !interaction.replied && !interaction.deferred) {
            await interaction.reply(result);
        }
    } catch (error) {
        console.error(error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred.', ephemeral: true });
        }
    }
});

client.once('ready', async (c) => {
    console.log(`Bot is online! Logged in as ${c.user.username}...`);

    // Connect to MongoDB
    // try {
    //     mongoClient = new MongoClient(mongoURI);
    //     await mongoClient.connect();
    //     console.log('Connected to MongoDB.');
    // } catch (err) {
    //     console.error('FATAL: Failed to connect to MongoDB:', err);
    //     process.exit(1);
    // }

    // Load commands
    const commandFiles = getFiles(path.join(__dirname, 'commands'));
    const slashCommands = [];
    for (const file of commandFiles) {
        try {
            const mod = await import(pathToFileURL(file).href);
            const command: Command = mod.default;
            if (!command?.callback) {
                console.error(`Skipping ${file}: missing default export or callback.`);
                continue;
            }
            const name = path.basename(file, '.js').toLowerCase();
            commands.set(name, command);
            slashCommands.push({
                name,
                description: command.description,
                options: command.options ?? [],
            });
        } catch (err) {
            console.error(`Failed to load command from ${file}:`, err);
        }
    }

    // Register slash commands
    try {
        const rest = new REST({ version: '10' }).setToken(token);
        await rest.put(Routes.applicationCommands(c.user.id), { body: slashCommands });
        console.log(`Registered ${slashCommands.length} slash commands.`);
    } catch (err) {
        console.error('FATAL: Failed to register slash commands:', err);
        process.exit(1);
    }

    // Load event handlers
    const eventsDir = path.join(__dirname, 'events');
    for (const eventName of fs.readdirSync(eventsDir)) {
        const eventPath = path.join(eventsDir, eventName);
        if (!fs.statSync(eventPath).isDirectory()) continue;
        for (const file of getFiles(eventPath)) {
            try {
                const mod = await import(pathToFileURL(file).href);
                if (typeof mod.default !== 'function') {
                    console.error(`Skipping ${file}: default export is not a function.`);
                    continue;
                }
                client.on(eventName, mod.default);
            } catch (err) {
                console.error(`Failed to load event handler from ${file}:`, err);
            }
        }
    }

    client.user!.setPresence({
        activities: [{ name: 'Casino Beta - v1.9.9' }],
        status: 'online',
    });

    const roleChannel = client.channels.cache.get(roleMessage.channel);
    if (roleChannel?.isTextBased()) {
        roleChannel.messages.fetch(roleMessage.message).catch(err => {
            console.error('Failed to fetch role message:', err);
        });
    } else {
        console.warn(`Role message channel ${roleMessage.channel} not found in cache.`);
    }
});

client.login(token);
