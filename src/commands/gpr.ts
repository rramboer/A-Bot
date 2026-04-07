import { CommandType } from "wokcommands";
import { CommandUsage } from "wokcommands";

module.exports = {
    description: "Grass privileges revoked",
    type: CommandType.BOTH,
    minArgs: 0,
    maxArgs: 0,
    testOnly: false,
    callback: async ({ user }: CommandUsage) => {
        console.log(`User ${user.username} has revoked someone's grass privileges.`);
        return {
            content: "https://tenor.com/view/grass-privileges-meme-touch-touch-grass-gif-26525632",
        };
    }
};
