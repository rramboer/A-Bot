import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

export class CasinoDB {
    private db!: Database.Database;
    private stmts!: {
        getUser: Database.Statement;
        createUser: Database.Statement;
        deleteUser: Database.Statement;
        addCoins: Database.Statement;
        setCoins: Database.Statement;
        setEmployed: Database.Statement;
        claimBonus: Database.Statement;
        recordWork: Database.Statement;
    };

    constructor(dbPath?: string) {
        try {
            const resolvedPath = dbPath ?? path.join(__dirname, '..', 'db', 'casino.db');
            if (!dbPath) {
                fs.mkdirSync(path.join(__dirname, '..', 'db'), { recursive: true });
            }
            this.db = new Database(resolvedPath);
            this.db.pragma('journal_mode = WAL');
            this.init();
            this.stmts = {
                getUser: this.db.prepare('SELECT * FROM users WHERE user_id = ?'),
                createUser: this.db.prepare('INSERT OR IGNORE INTO users (user_id, name, coins, employed, income, bonus_available, last_worked) VALUES (?, ?, 0, 0, 0, 1, 0)'),
                deleteUser: this.db.prepare('DELETE FROM users WHERE user_id = ?'),
                addCoins: this.db.prepare('UPDATE users SET coins = coins + ? WHERE user_id = ?'),
                setCoins: this.db.prepare('UPDATE users SET coins = ? WHERE user_id = ?'),
                setEmployed: this.db.prepare('UPDATE users SET employed = 1, income = ? WHERE user_id = ?'),
                claimBonus: this.db.prepare('UPDATE users SET coins = coins + ?, bonus_available = 0 WHERE user_id = ?'),
                recordWork: this.db.prepare('UPDATE users SET coins = coins + ?, last_worked = ? WHERE user_id = ?'),
            };
        } catch (err) {
            console.error('FATAL: Failed to initialize SQLite database.');
            console.error('Ensure the db/ directory is writable and better-sqlite3 is built for this platform.');
            console.error(err);
            process.exit(1);
        }
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
        const row = this.stmts.getUser.get(userId) as any;
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

    private assertUpdated(result: Database.RunResult, userId: string): void {
        if (result.changes === 0) {
            throw new Error(`Database update failed: no user found with id ${userId}`);
        }
    }

    close(): void {
        this.db.close();
    }
}

export const db = new CasinoDB();
