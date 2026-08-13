const { SlashCommandBuilder } = require('discord.js');

const OWNER_ID = process.env.OWNER_ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('See every server Paradise is currently in.'),

    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) {
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
            return;
        }

        const guilds = interaction.client.guilds.cache;

        if (guilds.size === 0) {
            await interaction.reply({
                content: 'Dude is not in any servers.',
                ephemeral: true
            });
            return;
        }

        const lines = [...guilds.values()].map((guild, index) => {
            return (
                `**${index + 1}. ${guild.name}**\n` +
                `🆔 \`${guild.id}\`\n` +
                `👥 ${guild.memberCount ?? 'Unknown'} members`
            );
        });

        const chunks = [];
        let current = '';

        for (const line of lines) {
            if ((current + '\n\n' + line).length > 1900) {
                chunks.push(current);
                current = line;
            } else {
                current += current ? `\n\n${line}` : line;
            }
        }

        if (current) {
            chunks.push(current);
        }

        await interaction.reply({
            content:
                `**🏜️ PARADISE SERVERS — ${guilds.size} TOTAL**\n\n` +
                chunks[0],
            ephemeral: true
        });

        for (const chunk of chunks.slice(1)) {
            await interaction.followUp({
                content: chunk,
                ephemeral: true
            });
        }
    }
};