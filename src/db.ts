import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dbPath } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CasinoUser {
    user_id: string;
    name: string;
    coins: number;
    employed: boolean;
    income: number;
    bonusAvailable: boolean;
    lastWorked: number;
}

/** Raw shape of a row in the users table. */
interface UserRow {
    user_id: string;
    name: string;
    coins: number;
    employed: number;
    income: number;
    bonus_available: number;
    last_worked: number;
}

/**
 * SQLite-backed persistence for the casino.
 *
 * The constructor throws when the database cannot be opened; callers (the composition
 * root in index.ts) decide how to handle that. Pass ':memory:' for tests.
 */
export class CasinoDB {
    private readonly db: Database.Database;
    private readonly stmts: {
        getUser: Database.Statement;
        createUser: Database.Statement;
        deleteUser: Database.Statement;
        addCoins: Database.Statement;
        setCoins: Database.Statement;
        setEmployed: Database.Statement;
        claimBonus: Database.Statement;
        recordWork: Database.Statement;
    };

    constructor(filePath?: string) {
        const resolvedPath = filePath ?? path.join(__dirname, '..', 'db', 'casino.db');
        if (!filePath) {
            fs.mkdirSync(path.join(__dirname, '..', 'db'), { recursive: true });
        }
        this.db = new Database(resolvedPath);
        this.db.pragma('journal_mode = WAL');
        this.init();
        this.stmts = {
            getUser: this.db.prepare('SELECT * FROM users WHERE user_id = ?'),
            createUser: this.db.prepare(
                'INSERT OR IGNORE INTO users (user_id, name, coins, employed, income, bonus_available, last_worked) VALUES (?, ?, 0, 0, 0, 1, 0)',
            ),
            deleteUser: this.db.prepare('DELETE FROM users WHERE user_id = ?'),
            addCoins: this.db.prepare('UPDATE users SET coins = coins + ? WHERE user_id = ?'),
            setCoins: this.db.prepare('UPDATE users SET coins = ? WHERE user_id = ?'),
            setEmployed: this.db.prepare('UPDATE users SET employed = 1, income = ? WHERE user_id = ?'),
            claimBonus: this.db.prepare(
                'UPDATE users SET coins = coins + ?, bonus_available = 0 WHERE user_id = ?',
            ),
            recordWork: this.db.prepare(
                'UPDATE users SET coins = coins + ?, last_worked = ? WHERE user_id = ?',
            ),
        };
    }

    private init() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                coins INTEGER NOT NULL DEFAULT 0,
                employed INTEGER NOT NULL DEFAULT 0,
                income INTEGER NOT NULL DEFAULT 0,
                bonus_available INTEGER NOT NULL DEFAULT 1,
                last_worked INTEGER NOT NULL DEFAULT 0
            )
        `);
    }

    getUser(userId: string): CasinoUser | null {
        const row = this.stmts.getUser.get(userId) as UserRow | undefined;
        if (!row) return null;
        return {
            user_id: row.user_id,
            name: row.name,
            coins: row.coins,
            employed: !!row.employed,
            income: row.income,
            bonusAvailable: !!row.bonus_available,
            lastWorked: row.last_worked,
        };
    }

    createUser(userId: string, name: string): boolean {
        return this.stmts.createUser.run(userId, name).changes > 0;
    }

    deleteUser(userId: string): void {
        this.stmts.deleteUser.run(userId);
    }

    addCoins(userId: string, amount: number): void {
        this.assertUpdated(this.stmts.addCoins.run(amount, userId), userId);
    }

    setCoins(userId: string, amount: number): void {
        this.assertUpdated(this.stmts.setCoins.run(amount, userId), userId);
    }

    setJob(userId: string, income: number): void {
        const txn = this.db.transaction(() => {
            this.stmts.setEmployed.run(income, userId);
            this.assertUpdated(this.stmts.addCoins.run(income, userId), userId);
        });
        txn();
    }

    claimBonus(userId: string, bonus: number): void {
        this.assertUpdated(this.stmts.claimBonus.run(bonus, userId), userId);
    }

    recordWork(userId: string, earnings: number, timestamp: number): void {
        this.assertUpdated(this.stmts.recordWork.run(earnings, timestamp, userId), userId);
    }

    /**
     * Atomically settles a game bet. Re-checks that the user still has at least
     * `betAmount` coins (bets are validated at command time but settled later, after
     * user interaction, so the balance may have changed) and then applies
     * `multiplier * betAmount` to their balance.
     *
     * Returns false — applying nothing — when the user no longer exists or can no
     * longer cover the bet, which prevents concurrent games from driving a balance
     * negative.
     */
    settleBet(userId: string, betAmount: number, multiplier: number): boolean {
        const txn = this.db.transaction(() => {
            const user = this.getUser(userId);
            if (!user || user.coins < betAmount) return false;
            if (multiplier !== 0) {
                this.stmts.addCoins.run(multiplier * betAmount, userId);
            }
            return true;
        });
        return txn();
    }

    private assertUpdated(result: Database.RunResult, userId: string): void {
        if (result.changes === 0) {
            throw new Error(`Database update failed: no user found with id ${userId}`);
        }
    }

    close(): void {
        this.db.close();
    }
}

let instance: CasinoDB | undefined;

/**
 * Returns the shared database instance, creating it (and the db/ directory) on first
 * use. Lazy so that importing this module — e.g. from tests — has no side effects.
 */
export function getDb(): CasinoDB {
    instance ??= new CasinoDB(dbPath);
    return instance;
}

/** Closes the shared database instance if it was ever opened. */
export function closeDb(): void {
    if (instance) {
        instance.close();
        instance = undefined;
    }
}
