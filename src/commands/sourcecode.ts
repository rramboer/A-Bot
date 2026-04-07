import type { Command } from '../types.js';

export default {
    description: "Posts a link to the source code for A-Bot",
    callback: async ({ user }) => {
        console.log(`User ${user.username} requested the A-Bot source code.`);
        return {
            content: "The source code for A-Bot is at  <https://github.com/rramboer/A-Bot/tree/master>."
        };
    }
} satisfies Command;
