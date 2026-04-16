import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { CasinoDB, type CasinoUser } from '../src/db.js';

describe('CasinoDB', () => {
    let db: CasinoDB;

    beforeEach(() => {
        db = new CasinoDB(':memory:');
    });

    afterEach(() => {
        db.close();
    });

    describe('createUser / getUser', () => {
        it('creates a user and retrieves it', () => {
            assert.equal(db.createUser('1', 'Alice'), true);
            const user = db.getUser('1');
            assert.deepEqual(user, {
                user_id: '1',
                name: 'Alice',
                coins: 0,
                employed: false,
                income: 0,
                bonusAvailable: true,
                lastWorked: 0,
            });
        });

        it('returns null for nonexistent user', () => {
            assert.equal(db.getUser('999'), null);
        });

        it('returns false when creating a duplicate user', () => {
            db.createUser('1', 'Alice');
            assert.equal(db.createUser('1', 'Alice2'), false);
        });

        it('does not overwrite existing user on duplicate create', () => {
            db.createUser('1', 'Alice');
            db.createUser('1', 'Alice2');
            assert.equal(db.getUser('1')!.name, 'Alice');
        });
    });

    describe('deleteUser', () => {
        it('deletes an existing user', () => {
            db.createUser('1', 'Alice');
            db.deleteUser('1');
            assert.equal(db.getUser('1'), null);
        });

        it('does not throw when deleting nonexistent user', () => {
            assert.doesNotThrow(() => db.deleteUser('999'));
        });
    });

    describe('addCoins', () => {
        it('adds coins to a user', () => {
            db.createUser('1', 'Alice');
            db.addCoins('1', 100);
            assert.equal(db.getUser('1')!.coins, 100);
        });

        it('adds negative coins (deduction)', () => {
            db.createUser('1', 'Alice');
            db.addCoins('1', 100);
            db.addCoins('1', -30);
            assert.equal(db.getUser('1')!.coins, 70);
        });

        it('throws for nonexistent user', () => {
            assert.throws(() => db.addCoins('999', 100), /no user found/);
        });
    });

    describe('setCoins', () => {
        it('sets coins to a specific amount', () => {
            db.createUser('1', 'Alice');
            db.addCoins('1', 100);
            db.setCoins('1', 50);
            assert.equal(db.getUser('1')!.coins, 50);
        });

        it('throws for nonexistent user', () => {
            assert.throws(() => db.setCoins('999', 100), /no user found/);
        });
    });

    describe('setJob', () => {
        it('sets employment and adds income as signing bonus', () => {
            db.createUser('1', 'Alice');
            db.setJob('1', 200);
            const user = db.getUser('1')!;
            assert.equal(user.employed, true);
            assert.equal(user.income, 200);
            assert.equal(user.coins, 200);
        });

        it('stacks income on existing coins', () => {
            db.createUser('1', 'Alice');
            db.addCoins('1', 50);
            db.setJob('1', 200);
            assert.equal(db.getUser('1')!.coins, 250);
        });
    });

    describe('claimBonus', () => {
        it('adds bonus and marks it as claimed', () => {
            db.createUser('1', 'Alice');
            db.claimBonus('1', 500);
            const user = db.getUser('1')!;
            assert.equal(user.coins, 500);
            assert.equal(user.bonusAvailable, false);
        });

        it('throws for nonexistent user', () => {
            assert.throws(() => db.claimBonus('999', 500), /no user found/);
        });
    });

    describe('recordWork', () => {
        it('adds earnings and records timestamp', () => {
            db.createUser('1', 'Alice');
            const now = Date.now();
            db.recordWork('1', 75, now);
            const user = db.getUser('1')!;
            assert.equal(user.coins, 75);
            assert.equal(user.lastWorked, now);
        });

        it('throws for nonexistent user', () => {
            assert.throws(() => db.recordWork('999', 75, Date.now()), /no user found/);
        });
    });
});
