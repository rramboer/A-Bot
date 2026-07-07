import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateBet } from '../src/lib/bets.js';
import { formatDuration } from '../src/lib/duration.js';
import {
    ROSHAMBO_CHOICES,
    dicePayoutMultiplier,
    isRoshamboChoice,
    roshamboOutcome,
    type RoshamboChoice,
} from '../src/lib/games.js';
import { parseMessageLink } from '../src/lib/messageLink.js';
import type { CasinoUser } from '../src/db.js';

function makeUser(coins: number): CasinoUser {
    return {
        user_id: '1',
        name: 'Alice',
        coins,
        employed: false,
        income: 0,
        bonusAvailable: true,
        lastWorked: 0,
    };
}

describe('validateBet', () => {
    it('rejects users who have not joined the casino', () => {
        const result = validateBet(null, 10);
        if (result.ok) assert.fail('expected validation to fail');
        assert.match(result.message, /joincasino/);
    });

    it('rejects zero and negative bets', () => {
        assert.equal(validateBet(makeUser(100), 0).ok, false);
        assert.equal(validateBet(makeUser(100), -5).ok, false);
    });

    it('rejects non-integer bets', () => {
        assert.equal(validateBet(makeUser(100), 1.5).ok, false);
        assert.equal(validateBet(makeUser(100), NaN).ok, false);
    });

    it('rejects bets larger than the balance', () => {
        const result = validateBet(makeUser(50), 51);
        if (result.ok) assert.fail('expected validation to fail');
        assert.match(result.message, /enough coins/);
    });

    it('accepts a bet exactly equal to the balance', () => {
        const user = makeUser(50);
        const result = validateBet(user, 50);
        assert.deepEqual(result, { ok: true, user });
    });
});

describe('formatDuration', () => {
    it('formats sub-minute durations in seconds', () => {
        assert.equal(formatDuration(30000), '30 second(s)');
        assert.equal(formatDuration(500), '1 second(s)');
    });

    it('formats exactly one minute in seconds (matches cooldown message behavior)', () => {
        assert.equal(formatDuration(60000), '60 second(s)');
    });

    it('formats longer durations in whole minutes, rounding up', () => {
        assert.equal(formatDuration(61000), '2 minute(s)');
        assert.equal(formatDuration(90000), '2 minute(s)');
        assert.equal(formatDuration(3600000), '60 minute(s)');
    });
});

describe('roshamboOutcome', () => {
    const table: [RoshamboChoice, RoshamboChoice, number][] = [
        ['rock', 'rock', 0],
        ['rock', 'paper', -1],
        ['rock', 'scissors', 1],
        ['paper', 'rock', 1],
        ['paper', 'paper', 0],
        ['paper', 'scissors', -1],
        ['scissors', 'rock', -1],
        ['scissors', 'paper', 1],
        ['scissors', 'scissors', 0],
    ];

    for (const [player, opponent, expected] of table) {
        it(`${player} vs ${opponent} -> ${expected}`, () => {
            assert.equal(roshamboOutcome(player, opponent), expected);
        });
    }
});

describe('isRoshamboChoice', () => {
    it('accepts the three valid choices', () => {
        for (const choice of ROSHAMBO_CHOICES) {
            assert.equal(isRoshamboChoice(choice), true);
        }
    });

    it('rejects other values', () => {
        assert.equal(isRoshamboChoice('lizard'), false);
        assert.equal(isRoshamboChoice(42), false);
        assert.equal(isRoshamboChoice(null), false);
    });
});

describe('dicePayoutMultiplier', () => {
    it('pays 4x for a winning double six', () => {
        assert.equal(dicePayoutMultiplier([6, 6], [3, 4]), 4);
    });

    it('pays 2x for other winning doubles', () => {
        assert.equal(dicePayoutMultiplier([4, 4], [2, 3]), 2);
    });

    it('pays 1x for a plain win', () => {
        assert.equal(dicePayoutMultiplier([5, 3], [4, 2]), 1);
    });

    it('returns -1 for a loss, even with doubles', () => {
        assert.equal(dicePayoutMultiplier([2, 2], [5, 6]), -1);
        assert.equal(dicePayoutMultiplier([1, 1], [1, 2]), -1);
    });

    it('returns 0 for a tie, including double six vs double six', () => {
        assert.equal(dicePayoutMultiplier([3, 4], [5, 2]), 0);
        assert.equal(dicePayoutMultiplier([6, 6], [6, 6]), 0);
    });
});

describe('parseMessageLink', () => {
    it('parses a valid message link', () => {
        assert.deepEqual(parseMessageLink('https://discord.com/channels/111/222/333'), {
            guildId: '111',
            channelId: '222',
            messageId: '333',
        });
    });

    it('rejects links with the wrong number of segments', () => {
        assert.equal(parseMessageLink('https://discord.com/channels/111/222'), null);
        assert.equal(parseMessageLink('not a link'), null);
        assert.equal(parseMessageLink(''), null);
    });

    it('rejects links with empty segments', () => {
        assert.equal(parseMessageLink('https://discord.com/channels/111//333'), null);
    });
});
