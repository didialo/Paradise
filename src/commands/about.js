const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const { getStats } = require('../database/database.js');

const packageInfo = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Find out more about Dude and Paradise.'),

    async execute(interaction) {
        const client = interaction.client;

        const guildCount = client.guilds.cache.size;

        const residentCount = client.guilds.cache.reduce(
            (total, guild) => total + (guild.memberCount || 0),
            0
        );

        const stats = getStats();

        const latency = client.ws.ping >= 0
            ? Math.round(client.ws.ping)
            : 0;

        const uptime = formatUptime(client.uptime);

        const commandCount = client.commands.size;

        const embed = new EmbedBuilder()
            .setColor(0xF4D6A7)

            .setAuthor({
                name: 'DUDE // PARADISE',
                iconURL: client.user.displayAvatarURL()
            })

            .setTitle('PARADISE INFORMATION')

            .setDescription(
                '*Another fine day in Paradise.*\n\n' +
                '**You wanted to know about me. Fine. Here.**'
            )

            .addFields(
                {
                    name: 'ABOUT',
                    value:
                        "Dude is the resident menace of Paradise. " +
                        "He remembers people, watches what they do, " +
                        "and occasionally decides whether he likes them.",
                    inline: false
                },

                {
                    name: 'SERVERS',
                    value: `\`${guildCount.toLocaleString()}\``,
                    inline: true
                },

                {
                    name: 'RESIDENTS',
                    value: `\`${residentCount.toLocaleString()}\``,
                    inline: true
                },

                {
                    name: 'COMMANDS',
                    value: `\`${commandCount.toLocaleString()}\``,
                    inline: true
                },

                {
                    name: 'UPTIME',
                    value: `\`${uptime}\``,
                    inline: true
                },

                {
                    name: 'LATENCY',
                    value: `\`${latency}ms\``,
                    inline: true
                },

                {
                    name: 'VERSION',
                    value: `\`v${packageInfo.version}\``,
                    inline: true
                },

                {
                    name: 'PARADISE ACTIVITY',
                    value:
                        `**Messages:** \`${stats.messages.toLocaleString()}\`\n` +
                        `**Commands used:** \`${stats.commands.toLocaleString()}\`\n` +
                        `**People helped:** \`${stats.helps.toLocaleString()}\`\n` +
                        `**Rants:** \`${stats.rants.toLocaleString()}\`\n` +
                        `**Barks:** \`${stats.barks.toLocaleString()}\`\n` +
                        `**Wanted notices:** \`${stats.wanted.toLocaleString()}\``,
                    inline: false
                },

                {
                    name: "DUDE'S PERSONALITY",
                    value:
                        'sarcastic · observant · occasionally helpful · ' +
                        'probably judging you',
                    inline: false
                },

                {
                    name: 'DATABASE',
                    value:
                        `\`${stats.users.toLocaleString()}\` tracked residents · ` +
                        `\`${stats.blacklistedGuilds.toLocaleString()}\` blacklisted servers`,
                    inline: false
                },

                {
                    name: 'DEVELOPER',
                    value: '`Clouddyie`',
                    inline: true
                },

                {
                    name: 'LIBRARY',
                    value: '`discord.js`',
                    inline: true
                }
            )

            .setFooter({
                text: 'PARADISE // try not to make things worse'
            })

            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('GitHub')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/didialo/Paradise')
        );

        await interaction.reply({
            embeds: [embed],
            components: [buttons]
        });
    }
};

function formatUptime(ms) {
    if (!ms) return 'starting...';

    let seconds = Math.floor(ms / 1000);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);

    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes || parts.length === 0) {
        parts.push(`${minutes}m`);
    }

    return parts.join(' ');
}