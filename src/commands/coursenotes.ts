import type { Command } from '../types.js';

export default {
    description: "Get a link to the course notes.",
    callback: async ({ user }) => {
        console.log(`User ${user.username} requested a link to the course notes.`);
        return {
            content: "Check out the (unofficial) course notes at <https://github.com/danlliu/eecs370notes>!",
        };
    }
} satisfies Command;
