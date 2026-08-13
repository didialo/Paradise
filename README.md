# 🏜️ Paradise — Dude

A Discord bot inspired by the wonderfully questionable atmosphere of Paradise.

Dude remembers people.

He keeps track of activity, trust, reputation, wanted notices, rants, people helped, and even barking.

Yes. Barking.

## ✨ Features

- 🧠 Persistent SQLite user memory
- ❤️ Trust system
- 🏷️ Reputation system
- 💬 Message tracking
- 🧍 Command tracking
- 🚨 Wanted notices
- 🗣️ Rant tracking
- 🤝 Helping system
- 🐕 Barking system
- 🎭 Relationship-based responses
- 🧠 Memory callbacks
- 📋 Paradise Files
- 👤 Creator-specific interactions

## 📋 Paradise Files

Dude keeps a profile for residents containing information such as:

- Reputation
- Relationship
- Trust
- Messages
- Commands used
- Wanted notices
- Rants
- People helped
- Barks
- Residency date

Trust and other statistics are stored in SQLite, so they survive bot restarts.

## 🐕 Barking

The `/bark` command is a completely serious and important part of Paradise.

The creator receives a special response from Dude when barking.

Barking can also increase persistent trust.

## 🛠️ Requirements

- Node.js 24+
- A Discord application
- A Discord bot token
- A Discord server for testing

## 📦 Installation

Clone or download the project.

Install dependencies:

```bash
npm install

Create a `.env` file in the project root using `.env.example` as a template.

Your `.env` should contain:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
OWNER_ID=your_discord_user_id