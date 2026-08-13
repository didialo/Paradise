const { SlashCommandBuilder } = require('discord.js');

const {
    unblacklistGuild,
    isGuildBlacklisted
} = require('../database/database.js');

const OWNER_ID = process.env.OWNER_ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Remove a server from Paradise blacklist.')
        .addStringOption(option =>
            option
                .setName('server_id')
                .setDescription('The Discord server ID to unblacklist')
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

        if (!isGuildBlacklisted(serverId)) {
            await interaction.reply({
                content:
                    `\`${serverId}\` is not currently blacklisted.`,
                ephemeral: true
            });
            return;
        }

        const guild =
            interaction.client.guilds.cache.get(serverId);

        unblacklistGuild(serverId);

        await interaction.reply({
            content:
                `✅ Server \`${serverId}\` has been removed from the blacklist.`,
            ephemeral: true
        });

        if (guild) {
            await guild.leave().catch(() => {});
        }
    }
};