import { ChatInputCommandInteraction, Client, Guild, User, TextBasedChannel, ApplicationCommandOptionData } from 'discord.js';

export interface CommandCallbackOptions {
    client: Client;
    user: User;
    guild: Guild | null;
    interaction: ChatInputCommandInteraction;
    channel: TextBasedChannel | null;
    args: string[];
    text: string;
}

export interface Command {
    description: string;
    options?: ApplicationCommandOptionData[];
    cooldown?: number;
    callback: (options: CommandCallbackOptions) => Promise<any>;
}
