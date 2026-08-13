const {
    SlashCommandBuilder,
    MessageFlags
} = require('discord.js');

const OWNER_ID = process.env.OWNER_ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('See every server Paradise is currently in.'),

    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) {
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                flags: MessageFlags.Ephemeral
            });

            return;
        }

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const guilds = interaction.client.guilds.cache;

        if (guilds.size === 0) {
            await interaction.editReply(
                'Dude is not in any servers.'
            );

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
            const next = current
                ? `${current}\n\n${line}`
                : line;

            if (next.length > 1900) {
                chunks.push(current);
                current = line;
            } else {
                current = next;
            }
        }

        if (current) {
            chunks.push(current);
        }

        await interaction.editReply(
            `**🏜️ PARADISE SERVERS — ${guilds.size} TOTAL**\n\n` +
            chunks[0]
        );

        for (const chunk of chunks.slice(1)) {
            await interaction.followUp({
                content: chunk,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};