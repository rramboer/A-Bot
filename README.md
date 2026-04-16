<img src="https://github.com/rramboer/A-Bot/blob/master/assets/background-crop.png?raw=true">

# A-Bot

A multi-purpose Discord bot built with inspiration from the University of Michigan EECS 370 course Discord server. Adapted from [zombbblob](https://github.com/ToafdaLoaf/zombbblob).

## Features

- **BotCasino** — join a virtual casino, get a job, earn coins, and gamble them away
- **Server management** — send messages, reply, react, create semester channels, and generate invite links as the bot
- **EECS 370 utilities** — quick links to course notes
- **Reaction roles** — automatic role assignment via message reactions

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [Yarn](https://yarnpkg.com/) 4.x

### Installation

```bash
yarn install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```
DISCORD_TOKEN=your-discord-bot-token
ROLE_MESSAGE_CHANNEL=channel-id-for-reaction-roles
ROLE_MESSAGE_ID=message-id-for-reaction-roles
```

### Development

```bash
yarn dev
```

### Build & Run

```bash
yarn build
yarn start
```

### Tests

```bash
yarn test
```

## Commands

### General

| Command | Description |
|---------|-------------|
| `/help` | Prints the help menu |
| `/sourcecode` | Links to this repository |
| `/gpr` | Grass privileges revoked |

### EECS 370

| Command | Description |
|---------|-------------|
| `/coursenotes` | Link to the unofficial course notes |

### Server

| Command | Description |
|---------|-------------|
| `/invite [n]` | Generate an invite link with optional limited uses |

### Administration (requires Administrator permission)

| Command | Description |
|---------|-------------|
| `/send <channel> <message>` | Send a message as the bot |
| `/reply <message_link> <reply_text>` | Reply to a message as the bot |
| `/react <message_link> <emoji>` | React to a message as the bot |
| `/create <semester-year>` | Create a semester category with channels (e.g. `F23`) |

### BotCasino

| Command | Description |
|---------|-------------|
| `/joincasino` | Join the casino |
| `/leavecasino` | Leave the casino (cannot be undone) |
| `/getjob` | Get assigned a random job for coin income |
| `/work` | Earn your hourly paycheck (1h cooldown) |
| `/bonus` | Claim a one-time starting bonus |
| `/coins [user]` | Check your or another user's balance |
| `/dice <bet>` | Roll dice against an opponent |
| `/roshambo <bet>` | Play rock paper scissors |
| `/coinflip <bet>` | Flip a coin, heads or tails |

## Contributing

A-Bot is open source — contributions are welcome!
