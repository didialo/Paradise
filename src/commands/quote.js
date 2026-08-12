const { SlashCommandBuilder } = require('discord.js');

const quotes = [
    "Another fine day in Paradise.",
    "Yeah, this seems like a perfectly reasonable place to live.",
    "I had plans. Then Paradise happened.",
    "You know what? I'm not even gonna ask.",
    "Could be worse. Probably will be.",
    "I came here for a quiet life. That was clearly a mistake.",
    "Everything's fine. That's usually when things get interesting.",
    "I'm surrounded by idiots. And somehow I'm the problem.",
    "Whatever. It's not my problem. Yet.",
    "Paradise has a funny way of ruining a perfectly good afternoon.",
    "I'm just trying to get through the day.",
    "Great. Exactly what I needed.",
    "I should've stayed home.",
    "This place really lives up to its name.",
    "If this is Paradise, I'd hate to see the alternative."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a Dude-style quote.'),

    async execute(interaction) {
        const quote =
            quotes[Math.floor(Math.random() * quotes.length)];

        await interaction.reply(
            `> **"${quote}"**\n> — *The Dude*`
        );
    }
};