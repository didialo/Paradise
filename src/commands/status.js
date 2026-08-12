const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription("Check the Dude's current condition."),

    async execute(interaction) {
        const statuses = [
            {
                mood: 'Not great',
                cash: '$0.00',
                patience: 'Running out',
                wanted: 'Probably',
                situation: 'Getting worse'
            },
            {
                mood: 'Annoyed',
                cash: '$0.00',
                patience: 'None',
                wanted: 'Definitely',
                situation: 'Could be better'
            },
            {
                mood: 'Tired',
                cash: '$13.37',
                patience: 'Questionable',
                wanted: 'Not currently',
                situation: 'Suspiciously quiet'
            },
            {
                mood: 'Fine',
                cash: '$0.00',
                patience: 'Fine',
                wanted: 'Irrelevant',
                situation: 'Another fine day in Paradise'
            }
        ];

        const status =
            statuses[Math.floor(Math.random() * statuses.length)];

        await interaction.reply(
            `**DUDE STATUS**\n\n` +
            `🧠 **Mood:** ${status.mood}\n` +
            `💵 **Cash:** ${status.cash}\n` +
            `⏳ **Patience:** ${status.patience}\n` +
            `🚨 **Wanted:** ${status.wanted}\n` +
            `🏜️ **Situation:** ${status.situation}`
        );
    }
};