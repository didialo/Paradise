# 🏜️ Paradise — Dude

A Discord bot inspired by the wonderfully questionable atmosphere of Paradise.

Dude remembers people.

He keeps track of activity, trust, reputation, wanted notices, rants, people helped, and even barking.

Yes. Barking.

## ✨ Features

* 🧠 Persistent SQLite user memory
* ❤️ Trust system
* 🏷️ Reputation system
* 💬 Message tracking
* 🧍 Command tracking
* 🚨 Wanted notices
* 🗣️ Rant tracking
* 🤝 Helping system
* 🐕 Barking system
* 🎭 Relationship-based responses
* 🧠 Memory callbacks
* 📋 Paradise Files
* 👤 Creator-specific interactions
* 💾 Persistent data across restarts
* 🌐 Global slash commands

## 📋 Paradise Files

Dude keeps a profile for residents containing information such as:

* Reputation
* Relationship
* Trust
* Messages
* Commands used
* Wanted notices
* Rants
* People helped
* Barks
* Residency date

Trust and other statistics are stored in SQLite, so they survive bot restarts.

## 🐕 Barking

The `/bark` command is a completely serious and important part of Paradise.

The creator receives a special response from Dude when barking, while other residents receive the standard bark response.

Barking can also increase persistent trust.

## 🧠 Memory

Dude remembers activity from residents over time.

Depending on a user's history, trust, and activity, Dude can respond differently.

Tracked activity includes:

* Messages
* Commands
* Rants
* Wanted notices
* Helping
* Barking
* Trust
* Reputation

The bot can also reference previous activity when responding to people.

## 🎭 Personality

Dude reacts differently depending on his relationship with a user.

Highly trusted residents may receive friendlier responses, while people with very low trust may receive considerably less enthusiastic ones.

Dude can also react to:

* Mondays
* Good mornings
* Requests for help
* Mistakes
* Chaos
* Disasters

Responses are intentionally unpredictable.

## 📜 Commands

Paradise currently provides these slash commands:

* `/bark`
* `/dude`
* `/helped`
* `/monday`
* `/paradise`
* `/profile`
* `/quote`
* `/rant`
* `/status`
* `/wanted`

### `/bark`

Bark at Dude.

Yes, this is a real command.

The creator receives a special response; other users receive the standard response.

### `/dude`

Interact directly with Dude.

### `/helped`

Record that someone helped you.

### `/monday`

Summon an appropriate response to Monday.

### `/paradise`

Get information about Paradise.

### `/profile`

View a resident's Paradise File.

### `/quote`

Get a Paradise quote.

### `/rant`

Record a rant.

### `/status`

View Paradise-related status information.

### `/wanted`

Interact with the wanted-notice system.

## 🌐 Slash Commands

Paradise uses Discord slash commands.

Commands are deployed globally with:

```bash
npm run deploy
```

The deployment script registers commands using Discord's global application-command endpoint.

This allows the commands to be available across servers where Paradise is properly installed.

Global commands can take some time to propagate after deployment.

## 🛠️ Requirements

* Node.js 24+
* A Discord application
* A Discord bot token
* A Discord server for testing
* `discord.js`
* `better-sqlite3`
* `dotenv`

## 📦 Installation

Clone or download the project.

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root using `.env.example` as a template.

Example:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
OWNER_ID=your_discord_user_id
```

Then deploy the slash commands:

```bash
npm run deploy
```

Start Paradise:

```bash
npm start
```

## 🤖 Discord Installation

When inviting Paradise to a server, make sure the application is installed with:

* `bot`
* `applications.commands`

Without `applications.commands`, the bot may appear in the server while its slash commands remain unavailable.

## 🔐 Bot Permissions and Intents

Paradise currently uses:

* Guilds
* Guild Members
* Guild Messages
* Message Content

Make sure the corresponding privileged intents are enabled in the Discord Developer Portal where required.

The bot should also have the permissions needed to interact with messages and members.

## 💾 Database

Paradise uses SQLite through `better-sqlite3`.

Persistent information survives bot restarts.

The database stores information related to:

* Users
* Trust
* Reputation
* Messages
* Commands
* Wanted notices
* Rants
* People helped
* Barks
* Residency information

## 📁 Project Structure

```text
Paradise/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
│
└── src/
    ├── index.js
    ├── deploy-commands.js
    │
    ├── commands/
    │   ├── bark.js
    │   ├── dude.js
    │   ├── helped.js
    │   ├── monday.js
    │   ├── paradise.js
    │   ├── profile.js
    │   ├── quote.js
    │   ├── rant.js
    │   ├── status.js
    │   └── wanted.js
    │
    ├── database/
    │   └── database.js
    │
    └── personality/
        └── data.js
```

## 🧪 Development

Start Paradise:

```bash
npm start
```

Redeploy slash commands after changing commands:

```bash
npm run deploy
```

Development mode:

```bash
npm run dev
```

## ⚠️ Troubleshooting

### Commands were deployed but do not appear

Make sure:

1. `npm run deploy` completed successfully.
2. Paradise was installed with both `bot` and `applications.commands`.
3. The bot is present in the server.
4. Global commands have had enough time to propagate.
5. Discord is up to date and synchronized.

### Paradise appears offline

Make sure the bot process is running:

```bash
npm start
```

A successful login prints:

```text
Dude is online as ...
```

### Commands appear on one Discord client but not another

Discord clients can temporarily cache or display application commands differently.

Try:

* Restarting Discord
* Updating Discord
* Signing out and back in
* Reopening the application

If commands appear on desktop but not mobile, the bot deployment itself may already be working correctly.

### Database problems

Make sure dependencies are installed:

```bash
npm install
```

If `better-sqlite3` has installation issues, reinstall the project dependencies.

## 🔒 Security

Never commit `.env` to GitHub.

Never share:

```text
DISCORD_TOKEN
```

Never publish private database files containing user information.

If the bot token is exposed, regenerate it immediately through the Discord Developer Portal.

## 📜 License

This project is currently distributed as an open-source Paradise bot project.

## 🔒 Code Modification Policy

Paradise contains private, creator-specific functionality that is intentionally part of the bot's codebase.

Do **not** remove, disable, modify, or intentionally bypass creator-specific systems without permission.

This includes hidden or private functionality that may not be documented elsewhere in this README.

If the creator becomes aware that a server has intentionally removed or disabled these systems without authorization, **that server may be permanently blacklisted from using Paradise.**

By using Paradise, you agree to respect the bot's code and its creator-specific functionality.

**In short:** Don't mess with the parts of Paradise that aren't yours to remove.

---

# 🏜️ Paradise

Dude remembers.

He probably remembers what you did, too.
