require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`Preparing command: ${command.data.name}`);
    }
}

const rest = new REST({ version: '10' })
    .setToken(process.env.DISCORD_TOKEN);

async function deploy() {
    try {
        console.log(`Registering ${commands.length} commands...`);

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log('All Dude commands registered in Paradise.');
    } catch (error) {
        console.error(error);
    }
}

deploy();