export const ROSHAMBO_CHOICES = ['rock', 'paper', 'scissors'] as const;
export type RoshamboChoice = (typeof ROSHAMBO_CHOICES)[number];

export const roshamboEmoji: Record<RoshamboChoice, string> = {
    rock: '🪨',
    paper: '📃',
    scissors: '✂️',
};

const beats: Record<RoshamboChoice, RoshamboChoice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
};

/** Returns the bet multiplier for a roshambo round: 1 = player wins, 0 = tie, -1 = player loses. */
export function roshamboOutcome(player: RoshamboChoice, opponent: RoshamboChoice): 1 | 0 | -1 {
    if (player === opponent) return 0;
    return beats[player] === opponent ? 1 : -1;
}

export function isRoshamboChoice(value: unknown): value is RoshamboChoice {
    return typeof value === 'string' && (ROSHAMBO_CHOICES as readonly string[]).includes(value);
}

export type DiceRoll = readonly [number, number];

/**
 * Returns the bet multiplier for a dice round:
 * 4 = win with double sixes, 2 = win with doubles, 1 = plain win, 0 = tie, -1 = loss.
 */
export function dicePayoutMultiplier(player: DiceRoll, opponent: DiceRoll): 4 | 2 | 1 | 0 | -1 {
    const playerTotal = player[0] + player[1];
    const opponentTotal = opponent[0] + opponent[1];
    if (playerTotal > opponentTotal) {
        if (player[0] === player[1]) return player[0] === 6 ? 4 : 2;
        return 1;
    }
    return playerTotal < opponentTotal ? -1 : 0;
}
