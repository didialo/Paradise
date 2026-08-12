
### `CHANGELOG.txt`

```text
PARADISE — DUDE CHANGELOG
=========================

[2026-08-12] — Global Command Update

COMMANDS
--------
- Updated Paradise slash-command deployment.
- Changed command registration from guild-specific commands to global application commands.
- Paradise now deploys commands across all servers where the bot is properly installed.
- Added support for public server deployment.
- Confirmed 10 slash commands are deployed.

CURRENT COMMANDS
----------------
- /bark
- /dude
- /helped
- /monday
- /paradise
- /profile
- /quote
- /rant
- /status
- /wanted

GLOBAL COMMAND DEPLOYMENT
-------------------------
- Updated src/deploy-commands.js.
- Replaced applicationGuildCommands() with applicationCommands().
- Commands are now registered globally using the bot CLIENT_ID.
- `GUILD_ID` is no longer required for slash-command registration.
- Global command propagation may take some time after deployment.

INSTALLATION
------------
- Paradise requires the `bot` scope.
- Paradise requires the `applications.commands` scope.
- Incorrect installation scopes can result in the bot appearing in a server
  without its slash commands being available.

PERSONALITY & MEMORY
--------------------
- Persistent SQLite user memory.
- Trust system.
- Reputation system.
- Message tracking.
- Command tracking.
- Wanted notices.
- Rant tracking.
- Helping system.
- Barking system.
- Relationship-based responses.
- Memory callbacks.
- Paradise Files.

PRESENCE
--------
- Dude sets a Discord presence after successfully connecting.
- Current presence:
  another fine day in Paradise

DATABASE
--------
- Persistent SQLite storage remains enabled.
- User activity survives bot restarts.
- better-sqlite3 continues to provide database storage.

TECHNICAL
---------
- Discord.js 14.
- Node.js 24+.
- dotenv environment configuration.
- Global slash-command deployment through Discord's application command API.

FIXES
-----
- Fixed slash commands being limited to the GUILD_ID server.
- Fixed public-server command availability after global deployment.
- Improved installation documentation for application commands.

KNOWN NOTES
-----------
- Global slash commands may take time to propagate through Discord.
- Discord clients can sometimes temporarily display different command
  availability while synchronizing.

UPCOMING
--------
- Additional Paradise interactions.
- More personality responses.
- More persistent memory features.
- Additional Paradise File statistics.
- More community interactions.
