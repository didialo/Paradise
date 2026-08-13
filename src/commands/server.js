const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

const OWNER_ID = process.env.OWNER_ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Inspect a Paradise server.')
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('The server ID to inspect.')
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

        const serverId = interaction.options.getString('id');
        const guild = interaction.client.guilds.cache.get(serverId);

        if (!guild) {
            await interaction.reply({
                content:
                    `I could not find a server with the ID \`${serverId}\`.`,
                ephemeral: true
            });
            return;
        }

        let inviteUrl = 'Unavailable';

        try {
            const channels = guild.channels.cache
                .filter(channel =>
                    channel.isTextBased() &&
                    channel
                        .permissionsFor(interaction.client.user)
                        ?.has(PermissionFlagsBits.CreateInstantInvite)
                )
                .sort((a, b) => a.position - b.position);

            const channel = channels.first();

            if (channel) {
                const invite = await channel.createInvite({
                    maxAge: 86400,
                    maxUses: 1,
                    unique: true,
                    reason: 'Owner server inspection.'
                });

                inviteUrl = invite.url;
            }
        } catch {
            inviteUrl = 'Unable to create invite';
        }

        const embed = new EmbedBuilder()
            .setColor(0xF4D6A7)
            .setAuthor({
                name: 'DUDE // SERVER INSPECTION',
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTitle(guild.name)
            .setDescription(
                '*So you want to inspect this place. Fine.*'
            )
            .addFields(
                {
                    name: 'SERVER ID',
                    value: `\`${guild.id}\``,
                    inline: false
                },
                {
                    name: 'MEMBERS',
                    value: `\`${guild.memberCount ?? 'Unknown'}\``,
                    inline: true
                },
                {
                    name: 'CREATED',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                    inline: true
                },
                {
                    name: 'OWNER',
                    value: `<@${guild.ownerId}>`,
                    inline: true
                },
                {
                    name: 'INVITE',
                    value: inviteUrl === 'Unavailable' ||
                           inviteUrl === 'Unable to create invite'
                        ? `\`${inviteUrl}\``
                        : inviteUrl,
                    inline: false
                }
            )
            .setFooter({
                text: 'PARADISE // decide carefully'
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};