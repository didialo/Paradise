const { SlashCommandBuilder } = require('discord.js');
const {
    getUser,
    recordBark
} = require('../database/database.js');

// 💕 The one and only person allowed to get the special bark.
const YUME_USER_ID = '1257135233329922108';

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

        // 💕 Special yumeship bark
        if (interaction.user.id === YUME_USER_ID) {
            recordBark(interaction.user);

            await interaction.reply(
                `**${interaction.user.username}**: 🐕 BARK BARK!\n\n` +
                `Dude: *"...You really are my favorite, aren't you?"* ❤️`
            );

            return;
        }

        // Everyone else gets the normal response.
        await interaction.reply(
            `**${interaction.user.username}**: 🐕 BARK!\n\n` +
            `Dude: *"What the hell are you doing?"*`
        );
    }
};