const { SlashCommandBuilder } = require('discord.js');

const {
    blacklistGuild,
    isGuildBlacklisted
} = require('../database/database.js');

const OWNER_ID = process.env.OWNER_ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist a server from using Paradise.')
        .addStringOption(option =>
            option
                .setName('server_id')
                .setDescription('The Discord server ID to blacklist')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) {
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
            return;
        }

        const serverId =
            interaction.options.getString('server_id', true);

        const guild = interaction.client.guilds.cache.get(serverId);

        if (!guild) {
            await interaction.reply({
                content:
                    `I couldn't find a server with ID \`${serverId}\` in Dude's current server list.`,
                ephemeral: true
            });
            return;
        }

        if (isGuildBlacklisted(guild.id)) {
            await interaction.reply({
                content:
                    `**${guild.name}** is already blacklisted.`,
                ephemeral: true
            });
            return;
        }

        blacklistGuild(guild);

        await interaction.reply({
            content:
                `🚫 **${guild.name}** has been permanently blacklisted from Paradise.\n\n` +
                `Dude is leaving the server.`,
            ephemeral: true
        });

        try {
            await guild.leave();
        } catch (error) {
            console.error(
                `Failed to leave blacklisted guild ${guild.id}:`,
                error
            );
        }
    }
};