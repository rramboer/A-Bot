/**
 * Formats a remaining duration for user-facing cooldown messages,
 * e.g. "45 second(s)" or "3 minute(s)".
 */
export function formatDuration(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    return seconds > 60 ? `${Math.ceil(seconds / 60)} minute(s)` : `${Math.ceil(seconds)} second(s)`;
}
