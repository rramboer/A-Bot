import type { Command } from '../types.js';

export default {
    description: "Grass privileges revoked",
    callback: async ({ user }) => {
        console.log(`User ${user.username} has revoked someone's grass privileges.`);
        return {
            content: "https://tenor.com/view/grass-privileges-meme-touch-touch-grass-gif-26525632",
        };
    }
} satisfies Command;
