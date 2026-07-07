import type {
    ApplicationCommandOptionData,
    Awaitable,
    ChatInputCommandInteraction,
    Client,
    Guild,
    InteractionReplyOptions,
    PermissionResolvable,
    TextBasedChannel,
    User,
} from 'discord.js';

export interface CommandCallbackOptions {
    client: Client;
    user: User;
    guild: Guild | null;
    interaction: ChatInputCommandInteraction;
    channel: TextBasedChannel | null;
}

export interface Command {
    description: string;
    options?: ApplicationCommandOptionData[];
    /** Per-user cooldown in milliseconds. */
    cooldown?: number;
    defaultMemberPermissions?: PermissionResolvable;
    /**
     * Command handler. A returned value is used as the interaction reply unless the
     * command already replied itself.
     */
    callback: (options: CommandCallbackOptions) => Awaitable<InteractionReplyOptions | string | undefined>;
}
