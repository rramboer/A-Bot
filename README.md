<img src="https://github.com/rramboer/A-Bot/blob/master/assets/background-crop.png?raw=true">

# A-Bot

[![CI](https://github.com/rramboer/A-Bot/actions/workflows/ci.yml/badge.svg)](https://github.com/rramboer/A-Bot/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org/)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2)](https://discord.js.org/)

A multi-purpose Discord bot built with inspiration from the University of Michigan EECS 370 course Discord server. Adapted from [zombbblob](https://github.com/ToafdaLoaf/zombbblob).

## Features

- **BotCasino** — join a virtual casino, get a job, earn coins, and gamble them away
- **Server management** — send messages, reply, react, create semester channels, and generate invite links as the bot
- **EECS 370 utilities** — quick links to course notes
- **Reaction roles** — automatic role assignment via message reactions
- **Auto-replies** — replies "Soon:tm:" to messages asking when exams, grades, and the like are coming

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22 (see `.nvmrc`)
- [Yarn](https://yarnpkg.com/) 4.x (via `corepack enable`)

### Discord setup

1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications) and add a **Bot** to it.
2. Copy the bot token — this becomes `DISCORD_TOKEN` in your `.env`.
3. Under **Bot → Privileged Gateway Intents**, enable **Message Content Intent** and **Server Members Intent** (both are required and off by default).
4. Generate an invite URL (**OAuth2 → URL Generator**) with the `bot` and `applications.commands` scopes, and grant the permissions the bot needs: _Manage Roles_, _Manage Channels_, _Create Invite_, _Add Reactions_, _Send Messages_.
5. Invite the bot to your server with that URL.

> **Note:** Slash commands are registered globally on startup, so they can take up to an hour to propagate the first time.

> **Server-specific IDs:** The default role IDs (reaction roles) and invite channel ID target the original EECS 370 server. When self-hosting, override them in `.env` (see below), or those features will not work / will link to the wrong server.

### Installation

```bash
corepack enable
yarn install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable               | Required | Description                                                                                          |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `DISCORD_TOKEN`        | Yes      | Bot token from the Discord Developer Portal                                                          |
| `ROLE_MESSAGE_CHANNEL` | No       | Channel ID of the reaction-role message, used to prefetch it at startup                              |
| `ROLE_MESSAGE_ID`      | No       | Message ID users react to for roles (🖥️ = Student, 🎓 = Student Alum); unset disables reaction roles |
| `STUDENT_ROLE_ID`      | No       | Role granted for 🖥️ (defaults to the EECS 370 server's role)                                         |
| `STUDENT_ALUM_ROLE_ID` | No       | Role granted for 🎓 (defaults to the EECS 370 server's role)                                         |
| `INVITE_CHANNEL_ID`    | No       | Channel `/invite` creates invites for (defaults to the EECS 370 server)                              |
| `STATIC_INVITE_URL`    | No       | Invite returned by `/invite` with no arguments                                                       |
| `DB_PATH`              | No       | SQLite database path (defaults to `db/casino.db`)                                                    |

### Development

```bash
yarn dev
```

### Build & Run

```bash
yarn build
yarn start
```

Or in one step: `yarn prod`.

### Tests

```bash
yarn test
```

### Scripts

| Script           | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `yarn dev`       | Run from source with live reload (tsx watch)         |
| `yarn build`     | Compile TypeScript to `dist/`                        |
| `yarn start`     | Run the compiled bot                                 |
| `yarn prod`      | Build, then start                                    |
| `yarn test`      | Run the test suite (node:test via tsx)               |
| `yarn typecheck` | Typecheck all sources and tests without emitting     |
| `yarn lint`      | Lint with ESLint (`yarn lint:fix` to auto-fix)       |
| `yarn format`    | Format with Prettier (`yarn format:check` to verify) |
| `yarn db:reset`  | Delete the casino database (**destructive**)         |

## Database

Casino state (balances, jobs, bonus and work timestamps) is stored in a SQLite database at `db/casino.db`, created automatically on first run. The database uses WAL journal mode, so `casino.db-wal` and `casino.db-shm` sidecar files will appear alongside it. The `db/` directory is gitignored. To wipe all casino state, run `yarn db:reset` (destructive, cannot be undone).

## Commands

Command names are derived from the file basenames in `src/commands/`, lowercased.

### General

| Command       | Description                  |
| ------------- | ---------------------------- |
| `/help`       | Prints the help menu         |
| `/ping`       | Checks the bot is responsive |
| `/sourcecode` | Links to this repository     |
| `/gpr`        | Grass privileges revoked     |

### EECS 370

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `/coursenotes` | Link to the unofficial course notes |

### Server

| Command       | Description                                                |
| ------------- | ---------------------------------------------------------- |
| `/invite [n]` | Generate an invite link with optional limited uses (1-100) |

### Administration (requires Administrator permission)

| Command                              | Description                                           |
| ------------------------------------ | ----------------------------------------------------- |
| `/send <channel> <message>`          | Send a message as the bot                             |
| `/reply <message_link> <reply_text>` | Reply to a message as the bot                         |
| `/react <message_link> <emoji>`      | React to a message as the bot                         |
| `/create <semester-year>`            | Create a semester category with channels (e.g. `F23`) |

### BotCasino

| Command           | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `/joincasino`     | Join the casino                                         |
| `/leavecasino`    | Leave the casino (cannot be undone)                     |
| `/getjob`         | Get assigned a random job for coin income               |
| `/work`           | Earn your hourly paycheck (1h cooldown)                 |
| `/bonus`          | Claim a one-time starting bonus (random 500-1499 coins) |
| `/coins [user]`   | Check your or another user's balance                    |
| `/dice <bet>`     | Roll dice against the house (30s cooldown)              |
| `/roshambo <bet>` | Play rock paper scissors (30s cooldown)                 |
| `/coinflip <bet>` | Flip a coin, heads or tails (30s cooldown)              |

**Game rules:** games pay out your bet amount on a win and take it on a loss; ties return the bet. Dice pays 2x on a winning double and 4x on winning double sixes.

## Project structure

```
src/
├── index.ts          # Client setup, command/event loader, interaction dispatch
├── config.ts         # Environment-derived configuration
├── db.ts             # SQLite persistence layer (better-sqlite3)
├── types.ts          # Command interfaces
├── lib/              # Pure, unit-tested game/validation/formatting logic
├── commands/         # Slash commands (filename = command name)
└── events/           # Event handlers (directory name = Discord event)
test/                 # node:test suites
```

## Contributing

A-Bot is open source — contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow.

## License

[MIT](LICENSE) © Ryan Ramboer
