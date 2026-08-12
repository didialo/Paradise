const { SlashCommandBuilder } = require('discord.js');

const { recordWanted } = require('../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wanted')
        .setDescription('Put somebody on a Paradise wanted notice.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The unfortunate individual')
                .setRequired(false)
        ),

    async execute(interaction) {
        const target =
            interaction.options.getUser('user') || interaction.user;

        const notices = [
            {
                crime: 'Being a nuisance',
                lastSeen: 'Making everything worse',
                reward: 'One cold beer',
                status: 'Probably guilty'
            },
            {
                crime: 'Disturbing the peace',
                lastSeen: 'Somewhere they definitely should not be',
                reward: '$5 and a half-eaten donut',
                status: 'Extremely suspicious'
            },
            {
                crime: 'Having terrible ideas',
                lastSeen: 'Explaining one of them to somebody',
                reward: 'A firm handshake',
                status: 'Do not trust'
            },
            {
                crime: 'Generally causing problems',
                lastSeen: 'In Paradise',
                reward: "Whatever's left in the register",
                status: 'Wanted, apparently'
            },
            {
                crime: "Wasting the Dude's time",
                lastSeen: 'Right here, unfortunately',
                reward: 'Nothing',
                status: 'Annoying'
            }
        ];

        const notice =
            notices[Math.floor(Math.random() * notices.length)];

            recordWanted(target);

        await interaction.reply(
            `🚨 **PARADISE WANTED NOTICE** 🚨\n\n` +
            `**SUSPECT**\n${target.username}\n\n` +
            `**CHARGES**\n${notice.crime}\n\n` +
            `**LAST SEEN**\n${notice.lastSeen}\n\n` +
            `**REWARD**\n${notice.reward}\n\n` +
            `**STATUS**\n${notice.status}`
        );
    }
};