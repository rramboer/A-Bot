import type { CasinoUser } from '../db.js';

export type BetValidation = { ok: true; user: CasinoUser } | { ok: false; message: string };

/**
 * Shared bet validation for the casino games (/coinflip, /dice, /roshambo).
 * The caller passes the user's current casino record (or null if they have not joined).
 */
export function validateBet(user: CasinoUser | null, betAmount: number): BetValidation {
    if (!user) {
        return {
            ok: false,
            message:
                'To play, you need to join the casino first. Do so by running the `/joincasino` command!',
        };
    }
    if (!Number.isInteger(betAmount) || betAmount <= 0) {
        return { ok: false, message: "You need to bet at least 1 coin. Sorry! I don't make the rules." };
    }
    if (betAmount > user.coins) {
        return {
            ok: false,
            message: "Sorry! You don't have enough coins to place this bet. Did you try having more money?",
        };
    }
    return { ok: true, user };
}
