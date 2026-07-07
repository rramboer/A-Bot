import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    MessageFlags,
    Partials,
    type ApplicationCommandDataResolvable,
} from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { closeDb, getDb } from './db.js';
import { reactionRoleChannel, reactionRoleMessage } from './config.js';
import { formatDuration } from './lib/duration.js';
import type { Command } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('FATAL: DISCORD_TOKEN is not set. See .env.example for required variables.');
    process.exit(1);
}

if (!reactionRoleMessage) {
    console.warn('ROLE_MESSAGE_ID is not set; reaction roles are disabled.');
} else if (!reactionRoleChannel) {
    console.warn(
        'ROLE_MESSAGE_CHANNEL is not set; the reaction-role message will not be prefetched at startup.',
    );
}

// Fail fast if the database cannot be opened — commands assume it is available.
try {
    getDb();
} catch (err) {
    console.error('FATAL: Failed to initialize the SQLite database.');
    console.error('Ensure the db/ directory is writable and better-sqlite3 is built for this platform.');
    console.error(err);
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')) as {
    version: string;
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
    // Message/Reaction/User partials are required for messageReactionAdd to fire on
    // uncached messages (the reaction-role message after a cache eviction or restart).
    partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User],
});

let shuttingDown = false;
async function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log('Shutting down...');
    try {
        await client.destroy();
    } catch (err) {
        console.error('Error while destroying client:', err);
    }
    closeDb();
    process.exit(0);
}
process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());

client.on(Events.Error, (err) => {
    console.error('Discord client error:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
});

/** Recursively collects module files. Accepts .ts (dev via tsx) and .js (compiled dist/). */
function getFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...getFiles(full));
        else if (/\.(?:js|ts)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) files.push(full);
    }
    return files;
}

const cooldowns = new Map<string, Map<string, number>>();
const commands = new Collection<string, Command>();

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
        await interaction.reply({
            content: 'That command is not available right now. Please try again in a moment.',
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    // Cooldown check
    if (command.cooldown) {
        let timestamps = cooldowns.get(interaction.commandName);
        if (!timestamps) {
            timestamps = new Map();
            cooldowns.set(interaction.commandName, timestamps);
        }
        const now = Date.now();
        const userId = interaction.user.id;

        for (const [id, ts] of timestamps) {
            if (now >= ts + command.cooldown) timestamps.delete(id);
        }

        const lastUsed = timestamps.get(userId);
        if (lastUsed !== undefined) {
            const expiration = lastUsed + command.cooldown;
            await interaction.reply({
                content: `Please wait ${formatDuration(expiration - now)} before using this command again.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        timestamps.set(userId, now);
    }

    try {
        const result = await command.callback({
            client,
            user: interaction.user,
            guild: interaction.guild,
            interaction,
            channel: interaction.channel,
        });
        if (result && !interaction.replied && !interaction.deferred) {
            await interaction.reply(result);
        }
    } catch (error) {
        console.error(error);
        try {
            if (interaction.deferred) {
                await interaction.editReply({ content: 'An error occurred.' });
            } else if (interaction.replied) {
                await interaction.followUp({ content: 'An error occurred.', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'An error occurred.', flags: MessageFlags.Ephemeral });
            }
        } catch (replyError) {
            console.error('Failed to send error feedback:', replyError);
        }
    }
});

// Load command modules (before login so interactions never race an empty collection).
const slashCommands: ApplicationCommandDataResolvable[] = [];
for (const file of getFiles(path.join(__dirname, 'commands'))) {
    try {
        const mod = (await import(pathToFileURL(file).href)) as { default?: Command };
        const command = mod.default;
        if (!command || typeof command.callback !== 'function') {
            console.error(`Skipping ${file}: missing default export or callback.`);
            continue;
        }
        const name = path.basename(file, path.extname(file)).toLowerCase();
        commands.set(name, command);
        slashCommands.push({
            name,
            description: command.description,
            options: command.options ?? [],
            ...(command.defaultMemberPermissions !== undefined && {
                defaultMemberPermissions: command.defaultMemberPermissions,
            }),
        });
    } catch (err) {
        console.error(`Failed to load command from ${file}:`, err);
    }
}
console.log(`Loaded ${commands.size} commands.`);

// Load event handlers (directory name = Discord event name).
const eventsDir = path.join(__dirname, 'events');
for (const eventName of fs.readdirSync(eventsDir)) {
    const eventPath = path.join(eventsDir, eventName);
    if (!fs.statSync(eventPath).isDirectory()) continue;
    for (const file of getFiles(eventPath)) {
        try {
            const mod = (await import(pathToFileURL(file).href)) as { default?: unknown };
            if (typeof mod.default !== 'function') {
                console.error(`Skipping ${file}: default export is not a function.`);
                continue;
            }
            client.on(eventName, mod.default as (...args: unknown[]) => void);
        } catch (err) {
            console.error(`Failed to load event handler from ${file}:`, err);
        }
    }
}

client.once(Events.ClientReady, async (c) => {
    console.log(`Bot is online! Logged in as ${c.user.username}...`);

    // Register slash commands. client.application.commands.set serializes the
    // camelCase option fields (channelTypes, minValue, ...) correctly, unlike a raw
    // REST PUT of discord.js-shaped objects.
    try {
        await c.application.commands.set(slashCommands);
        console.log(`Registered ${slashCommands.length} slash commands.`);
    } catch (err) {
        console.error('FATAL: Failed to register slash commands:', err);
        process.exit(1);
    }

    c.user.setPresence({
        activities: [{ name: `Casino Beta - v${packageJson.version}` }],
        status: 'online',
    });

    // Pre-fetch the reaction-role message so existing reactions resolve quickly.
    if (reactionRoleChannel && reactionRoleMessage) {
        const roleChannel = c.channels.cache.get(reactionRoleChannel);
        if (roleChannel?.isTextBased()) {
            roleChannel.messages.fetch(reactionRoleMessage).catch((err: unknown) => {
                console.error('Failed to fetch role message:', err);
            });
        } else {
            console.warn(`Role message channel ${reactionRoleChannel} not found in cache.`);
        }
    }
});

try {
    await client.login(token);
} catch (err) {
    console.error('FATAL: Failed to log in to Discord. Check that DISCORD_TOKEN is valid.');
    console.error(err);
    closeDb();
    process.exit(1);
}
