const { SlashCommandBuilder } = require('discord.js');
const {
    getUser,
    recordBark
} = require('../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bark')
        .setDescription('Bark at Dude. You know you want to.'),

    async execute(interaction) {
        const user = getUser(interaction.user.id);

        if (!user) {
            await interaction.reply(
                "I don't know you well enough for that."
            );
            return;
        }

        const isCreator =
            interaction.user.id === process.env.OWNER_ID;

        if (isCreator) {
            recordBark(interaction.user);
            await interaction.reply(
                `**${interaction.user.username}**: 🐕 BARK BARK!\n\n` +
                `Dude: *"...Okay. That's actually adorable."* ❤️`
            );
            return;
        }

        await interaction.reply(
            `**${interaction.user.username}**: 🐕 BARK!\n\n` +
            `Dude: *"What the hell are you doing?"*`
        );
    }
};