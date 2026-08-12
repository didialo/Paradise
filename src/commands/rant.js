const { SlashCommandBuilder } = require('discord.js');

const { recordRant } = require('../database/database.js');

const rants = [
    "Everybody wants something. Money, favors, attention. Nobody ever asks how I'm doing.",
    "You'd think a town called Paradise would be a little more relaxing.",
    "The bills are due, the neighbors are annoying, and somehow this is supposed to be my problem.",
    "I had plans today. Then Paradise happened.",
    "Every time I think things can't get any worse, somebody gets creative.",
    "I came here for a quiet life. Clearly that was a mistake.",
    "I don't know who thought this was a good idea, but I'm guessing they don't live here.",
    "You know what really pisses me off? Pretty much everything.",
    "I swear, I can't leave this place alone for five minutes.",
    "Maybe tomorrow will be better. Yeah. And maybe I'll win the lottery."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rant')
        .setDescription('Let the Dude complain about Paradise.'),

    async execute(interaction) {
        const rant = rants[Math.floor(Math.random() * rants.length)];

        recordRant(interaction.user);

        await interaction.reply({
            content: rant
        });
    }
};