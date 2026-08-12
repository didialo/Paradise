const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dude')
        .setDescription('Ask the Dude something.'),

    async execute(interaction) {
        const responses = [
            'What?',
            'Yeah, yeah. I’m listening.',
            'Do I look like I care?',
            'Fine. What is it?',
            'Whatever.',
            'Great. Another problem.',
            'I leave you people alone for five minutes...',
            'Could be worse. Probably will be.',
            'Another fine day in Paradise.',
            'You know what? I don’t even want to know.'
        ];

        const response =
            responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(response);
    }
};