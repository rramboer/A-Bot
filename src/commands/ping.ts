import type { Command } from '../types.js';

export default {
    description: 'Ping',
    callback: ({ user }) => {
        console.log(`User ${user.username} pinged the bot.`);
        return { content: 'Pong!' };
    },
} satisfies Command;
