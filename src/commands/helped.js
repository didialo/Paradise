const { SlashCommandBuilder } = require('discord.js');
const { recordHelp } = require('../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('helped')
        .setDescription('Record that you helped another resident.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The person you helped')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('user');

        if (target.bot) {
            await interaction.reply(
                "Helping a bot doesn't count. They're already doing their job."
            );
            return;
        }

        if (target.id === interaction.user.id) {
            await interaction.reply(
                "You can't help yourself and expect Dude to give you credit."
            );
            return;
        }

        recordHelp(interaction.user);

        const responses = [
            `Alright. **${interaction.user.username}** actually helped someone.`,
            `Huh. **${interaction.user.username}** did something useful.`,
            `I'll give you that one, **${interaction.user.username}**.`,
            `Not bad, **${interaction.user.username}**. Maybe you're alright.`,
            `**${interaction.user.username}** helped **${target.username}**. Miracles happen.`
        ];

        const response =
            responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(response);
    }
};