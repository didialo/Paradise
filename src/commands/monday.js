const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('monday')
        .setDescription("Ask the Dude how Monday is going."),

    async execute(interaction) {
        const reports = [
            {
                mood: 'Fucking terrible',
                motivation: 'Missing',
                responsibilities: 'Unfortunately present',
                patience: 'Nonexistent',
                outlook: 'Could be worse'
            },
            {
                mood: 'Annoyed',
                motivation: 'Still looking for it',
                responsibilities: 'Ignored',
                patience: 'Running dangerously low',
                outlook: 'Not promising'
            },
            {
                mood: 'Tired',
                motivation: 'I had some around here somewhere',
                responsibilities: 'Who invited these?',
                patience: 'Ask again tomorrow',
                outlook: 'Probably terrible'
            },
            {
                mood: 'Fine',
                motivation: 'Barely operational',
                responsibilities: 'Under protest',
                patience: 'Acceptable',
                outlook: 'Another fine day in Paradise'
            }
        ];

        const report =
            reports[Math.floor(Math.random() * reports.length)];

        await interaction.reply(
            `**MONDAY REPORT**\n\n` +
            `🧠 **Mood:** ${report.mood}\n` +
            `💼 **Motivation:** ${report.motivation}\n` +
            `📋 **Responsibilities:** ${report.responsibilities}\n` +
            `⏳ **Patience:** ${report.patience}\n` +
            `🏜️ **Outlook:** ${report.outlook}`
        );
    }
};