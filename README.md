# 🥃 Dude

> A chaotic, sarcastic Discord bot inspired by **The Dude from Postal 2**.

Dude is a personality-driven Discord bot built around chaotic conversations, questionable decisions, memory, and a very particular attitude.

He's not here to be your polite assistant.

He's here because somebody apparently thought giving the Dude access to Discord was a good idea.

---

## ✦ Features

### 🎭 Personality

Dude has a personality-focused response system designed to keep his responses sarcastic, unpredictable, and character-appropriate.

His behavior can change depending on:

* The current conversation
* Previous messages
* The user interacting with him
* Stored memories
* Context and conversation history
* Randomized response behavior

### 🧠 Memory

Dude can remember information provided during conversations and retrieve it later.

For example:

```text
User: Dude, remember this: the moon is fake.

Dude: Got it. The moon is definitely fake, right?
```

Later:

```text
User: What did I just say?

Dude: You just said, "the moon is fake."
```

Memory is designed to make conversations feel more continuous rather than treating every message as completely isolated.

### 💬 Natural Conversations

Dude is designed to respond conversationally instead of relying exclusively on predefined responses.

This includes:

* Context-aware replies
* Personality reactions
* Casual conversation
* Emotional reactions
* Randomized responses
* Memory-aware responses

### 💕 Yumeship Protocol

Dude includes a special interaction layer for the bot's designated yumeship relationship.

This changes how Dude behaves during certain interactions, allowing him to become noticeably more affectionate, flustered, or emotionally affected while still keeping his normal personality.

Basically:

> He can act tough all he wants.

> He still gets embarrassed.

---

## ✦ Commands

Dude primarily uses slash commands.

### General

| Command     | Description                    |
| ----------- | ------------------------------ |
| `/about`    | Shows information about Dude   |
| `/bark`     | Makes Dude bark                |
| `/dude`     | Interact with Dude             |
| `/helped`   | Shows available help           |
| `/invite`   | Get Dude's invite link         |
| `/monday`   | Monday.                        |
| `/paradise` | Paradise-related information   |
| `/profile`  | View a profile                 |
| `/quote`    | Get a random Dude quote        |
| `/rant`     | Let Dude rant                  |
| `/servers`  | View bot server information    |
| `/status`   | View Dude's current status     |
| `/wanted`   | View Dude's wanted information |

> Some commands may be restricted to developers or specific users.

---

## ✦ Developer Features

Dude also includes developer-only functionality for managing the bot.

These features may include:

* Server management
* Blacklisting
* Unblacklisting
* Server inspection
* Bot status management
* Maintenance controls

Developer commands are not available to regular users.

---

## ✦ Personality System

Dude's responses are influenced by multiple layers rather than a single static response table.

```text
User Message
     │
     ▼
Context
     │
     ├── Conversation History
     ├── Memory
     ├── User Relationship
     ├── Personality
     └── Response Probability
     │
     ▼
Dude
     │
     ▼
Generated Response
```

This allows Dude to react differently to the same message depending on the situation.

---

## ✦ Response Behavior

Dude intentionally does **not** respond the same way every time.

His response system uses weighted behavior and randomized choices to prevent conversations from becoming repetitive.

The goal is for Dude to feel like a character rather than a command handler.

---

## ✦ Tech Stack

* **Node.js**
* **Discord.js**
* **Hugging Face Inference**
* **dotenv**
* **Discord API**

---

## ✦ Requirements

* Node.js 18+
* A Discord bot application
* Discord bot token
* Hugging Face API access

---

## ✦ Installation

Clone the repository:

```bash
git clone https://github.com/didialo/Paradise.git
cd Paradise
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DISCORD_TOKEN=your_token_here
HF_TOKEN=your_huggingface_token_here
```

Then start the bot:

```bash
node index.js
```

---

## ✦ Configuration

Dude's behavior is controlled through the bot's personality and configuration files.

Depending on the current version, these may include:

```text
personality/
├── data.js
└── ...
```

Do not expose your bot token or API keys.

---

## ✦ Status

```text
// PROJECT: DUDE
// STATUS: STABLE
// MEMORY: ENABLED
// PERSONALITY: ACTIVE
// YUMESHIP PROTOCOL: ACTIVE
```

Dude is currently out of maintenance and available for normal use.

---

## ✦ Credits

**Dude** is inspired by the character **The Dude** from *Postal 2* by Running With Scissors.

This project is an unofficial fan-made Discord bot.

---

## ⚠️ Disclaimer

Dude is a fan-made project and is not affiliated with, endorsed by, or officially connected to Running With Scissors or the Postal franchise.

Some of Dude's behavior, humor, and personality are intentionally chaotic and may not be suitable for every server.

Use responsibly.

---

# 🥃 "Don't look at me like that. You're making this difficult."
