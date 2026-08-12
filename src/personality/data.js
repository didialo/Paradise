const dudeResponses = [
    "What?",
    "Yeah, yeah. I'm listening.",
    "Do I look like I care?",
    "Fine. What is it?",
    "Whatever.",
    "Great. Another problem.",
    "I leave you people alone for five minutes...",
    "Could be worse. Probably will be.",
    "Another fine day in Paradise.",
    "You know what? I don't even want to know."
];

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

const mondayResponses = [
    "It's Monday. Again. Somehow.",
    "Monday. Fantastic.",
    "If anybody needs me, don't.",
    "It's Monday. I'm already tired of this week.",
    "Monday came back. Nobody invited it."
];

const automaticResponses = {
    monday: [
        "Yeah. It's Monday. I noticed.",
        "It's Monday. That explains a lot.",
        "Monday already? Great.",
        "I was hoping we'd skip this one."
    ],

    morning: [
        "Morning. If you can call it that.",
        "Yeah. Morning.",
        "Good morning. Whatever that means.",
        "Morning. Don't expect much from me."
    ],

    help: [
        "Fine. What is it?",
        "What do you need?",
        "Yeah, yeah. What's the problem?",
        "Alright. Let's hear it."
    ],

    mistake: [
        "That's usually how these things start.",
        "Well, you fucked that up.",
        "Could've been worse.",
        "And somehow I knew this was coming."
    ],

    chaos: [
        "I leave you people alone for five minutes...",
        "What the hell happened?",
        "You know what? I'm not even gonna ask.",
        "Great. Just great."
    ]
};

module.exports = {
    dudeResponses,
    rants,
    mondayResponses,
    automaticResponses
};