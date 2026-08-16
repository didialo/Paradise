const { SlashCommandBuilder } = require('discord.js');

const events = [
    {
        event: 'The local store is having a sale.',
        reaction: "Yeah, I'm sure there's no catch."
    },
    {
        event: 'A cop just drove past the neighborhood.',
        reaction: "Probably looking for somebody. Hopefully not me."
    },
    {
        event: 'Someone is yelling in the street.',
        reaction: "It's Paradise. What did you expect?"
    },
    {
        event: 'The neighbors are having another argument.',
        reaction: "And here I was hoping for a quiet afternoon."
    },
    {
        event: 'A suspicious van has parked outside.',
        reaction: "Yeah. That's probably fine."
    },
    {
        event: 'Someone left a package on the doorstep.',
        reaction: "I'm not touching that."
    },
    {
        event: 'The power just went out.',
        reaction: "Great. Just great."
    },
    {
        event: 'Everything is strangely quiet.',
        reaction: "That's usually when you should start worrying."
    },
    {
        event: 'A bunch of people are running down the street.',
        reaction: "You know what? I'm staying inside."
    },
    {
        event: 'Nothing happened today.',
        reaction: "Honestly? I'll take it."
    }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paradise')
        .setDescription('See what is happening in Paradise.'),

    async execute(interaction) {

        const event =
            events[
                Math.floor(
                    Math.random() * events.length
                )
            ];

        await interaction.editReply(
            `🏜️ **PARADISE REPORT**\n\n` +
            `**EVENT**\n${event.event}\n\n` +
            `**DUDE'S REACTION**\n*${event.reaction}*`
        );
    }
};
