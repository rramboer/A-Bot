/**
 * Central runtime configuration.
 *
 * Values are read from the environment (see .env.example). IDs that are specific to the
 * original EECS 370 server are used as defaults so the bot keeps working there out of the
 * box, but self-hosters should override them via .env.
 */

/** Returns the trimmed value of an environment variable, or undefined when unset/blank. */
function env(name: string): string | undefined {
    const value = process.env[name]?.trim();
    if (!value) return undefined;
    return value;
}

/** Discriminators embedded in button custom IDs so each game only handles its own buttons. */
export const gameId = {
    roshambo: 'd7d3',
    coinflip: '17f0',
} as const;

/** Channel and message users react to for reaction roles. Unset disables the feature. */
export const reactionRoleChannel = env('ROLE_MESSAGE_CHANNEL');
export const reactionRoleMessage = env('ROLE_MESSAGE_ID');

/** Role granted for the 🖥️ reaction. */
export const studentRole = env('STUDENT_ROLE_ID') ?? '1053544751439290448';

/** Role granted for the 🎓 reaction. */
export const studentAlumRole = env('STUDENT_ALUM_ROLE_ID') ?? '927680207505211443';

/** Channel that /invite creates invite links for. */
export const inviteChannelId = env('INVITE_CHANNEL_ID') ?? '1053552629373997156';

/** Static invite returned by /invite when no use count is given. */
export const staticInviteUrl = env('STATIC_INVITE_URL') ?? 'discord.gg/rmQp6PSng9';

/** Filesystem path of the SQLite database. Defaults to <repo root>/db/casino.db. */
export const dbPath = env('DB_PATH');
