import { EmbedBuilder } from 'discord.js';
import type { Command } from '../types.js';

// Keep this list in sync with the commands in src/commands/ and the README.
// Admin-only commands (/send, /reply, /react, /create) are intentionally unlisted.
const helpCommands = [
    {
        sectionTitle: 'General',
        commands: [
            { name: '/help', description: 'Prints this help message' },
            { name: '/ping', description: 'Checks that the bot is responsive' },
            { name: '/sourcecode', description: 'View the A-Bot source code' },
            { name: '/gpr', description: 'Grass privileges revoked' },
            { name: '/coursenotes', description: 'Posts a link to the unofficial course notes' },
            { name: '/invite [n]', description: 'Creates an invite link with an optional number of uses' },
        ],
    },
    {
        sectionTitle: 'Casino',
        commands: [
            { name: '/joincasino', description: 'Adds you to the casino' },
            { name: '/leavecasino', description: 'Removes you from the casino' },
            { name: '/getjob', description: 'Assigns you a job for coin income' },
            { name: '/work', description: 'Earns coin income based on your job (1h cooldown)' },
            { name: '/bonus', description: 'Claims your one-time starting bonus' },
            { name: '/coins [user]', description: 'Displays current balance of you or another user' },
            { name: '/dice <bet>', description: 'Roll dice against the house to gain or lose coins' },
            { name: '/roshambo <bet>', description: 'Play rock paper scissors, with a bet involved' },
            { name: '/coinflip <bet>', description: 'Flip a coin to gain or lose coins' },
        ],
    },
];

export default {
    description: 'Help',
    callback: ({ user }) => {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('A-Bot Help')
            .setFields(
                helpCommands.map((section) => ({
                    name: section.sectionTitle,
                    value: section.commands.map((cmd) => `**${cmd.name}**: ${cmd.description}`).join('\n'),
                })),
            );

        console.log(`User ${user.username} requested the help menu.`);
        return { embeds: [embed] };
    },
} satisfies Command;
