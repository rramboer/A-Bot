# Contributing to A-Bot

Thanks for your interest in contributing!

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22 (see `.nvmrc`)
- Yarn 4 — run `corepack enable` once and the correct version is picked up from `package.json`

## Getting started

```bash
git clone https://github.com/rramboer/A-Bot.git
cd A-Bot
corepack enable
yarn install
cp .env.example .env   # then fill in DISCORD_TOKEN (see README for the Discord setup)
```

## Development workflow

| Command          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `yarn dev`       | Run the bot from source with live reload |
| `yarn test`      | Run the test suite (node:test)           |
| `yarn typecheck` | Typecheck sources and tests              |
| `yarn lint`      | Lint (`yarn lint:fix` to auto-fix)       |
| `yarn format`    | Format with Prettier                     |
| `yarn build`     | Compile to `dist/`                       |

CI runs `lint`, `format:check`, `typecheck`, `test`, and `build` on every push and pull request — please make sure all of them pass locally before opening a PR.

## Adding a slash command

Create a file in `src/commands/` (or a subdirectory — the tree is scanned recursively). The **file basename, lowercased, becomes the command name**. Default-export an object satisfying the `Command` interface from `src/types.ts`:

```ts
import type { Command } from '../types.js';

export default {
    description: 'Says hello',
    callback: ({ user }) => {
        return { content: `Hello, ${user.username}!` };
    },
} satisfies Command;
```

Optional fields: `options` (slash-command options), `cooldown` (per-user, in milliseconds), and `defaultMemberPermissions`. Commands are registered globally on startup.

If the command should appear in `/help`, add it to the list in `src/commands/help.ts`, and document it in the README command tables.

## Adding an event handler

Create a file in `src/events/<eventName>/` — the **directory name must match the discord.js event name** (e.g. `messageCreate`, `interactionCreate`). Default-export the handler function; it receives the event's arguments.

## Code style

- TypeScript, strict mode; formatting is enforced by Prettier and linting by typescript-eslint. Run `yarn format && yarn lint:fix` before committing.
- Keep pure logic (game outcomes, validation, parsing) in `src/lib/` so it can be unit-tested without Discord; add tests in `test/`.
- Avoid `any`, unawaited promises, and hard-coded server IDs (put configuration in `src/config.ts` + `.env.example`).
