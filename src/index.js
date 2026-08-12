require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require('discord.js');

const fs = require('fs');
const path = require('path');
const { automaticResponses } = require('./personality/data.js');

const {
    recordMessage,
    recordCommand,
    updatePassiveTrust,
    getUser
} = require('./database/database.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`Loaded command: ${command.data.name}`);
    } else {
        console.log(`Skipped invalid command: ${file}`);
    }
}

client.on('guildMemberAdd', async member => {
    const greetings = [
        `Oh, great. **${member.displayName}** just showed up.`,
        `Great. Another one. Welcome to Paradise, **${member.displayName}**.`,
        `Oh. It's **${member.displayName}**. Fantastic.`,
        `Welcome to Paradise, **${member.displayName}**. Try not to make things worse.`,
        `Another person in Paradise. This place is getting crowded.`,
        `Hey, **${member.displayName}**. Keep your hands off my stuff.`
    ];

    const greeting =
        greetings[Math.floor(Math.random() * greetings.length)];

    const channel = member.guild.systemChannel;

    if (!channel) return;

    await channel.send(greeting).catch(() => {});
});

client.once('clientReady', () => {
    console.log(`Dude is online as ${client.user.tag}`);

    client.user.setPresence({
        activities: [
            {
                name: 'another fine day in Paradise',
                type: 0
            }
        ],
        status: 'online'
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    recordCommand(interaction.user);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Command error in ${interaction.commandName}:`);
        console.error(error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "Great. Something broke. Don't look at me.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

const responseCooldowns = new Map();

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.guild) return;

    recordMessage(message.author);
    updatePassiveTrust(message.author);

    const content = message.content.toLowerCase();

    let category = null;

    if (/\bmonday\b/.test(content)) {
        category = 'monday';
    } else if (/\b(good morning|morning)\b/.test(content)) {
        category = 'morning';
    } else if (/\b(help|can someone help)\b/.test(content)) {
        category = 'help';
    } else if (/\b(fucked up|messed up|screwed up|my bad)\b/.test(content)) {
        category = 'mistake';
    } else if (/\b(what happened|wtf|chaos|disaster)\b/.test(content)) {
        category = 'chaos';
    }

    if (!category) return;

    const cooldownKey = `${message.guild.id}-${category}`;
    const lastResponse = responseCooldowns.get(cooldownKey);

    if (lastResponse && Date.now() - lastResponse < 5 * 60 * 1000) {
        return;
    }

    if (Math.random() > 0.25) {
        return;
    }

    const user = getUser(message.author.id);

  let response;

if (user) {
    const score =
        (user.wanted * 5) +
        (user.rants * 2) +
        (user.commands * 0.25);

    if (score >= 30) {
        response = getWantedResponse(message.author.username);
    } else if (score >= 20) {
        response = getThreatResponse(message.author.username);
    } else if (score >= 10) {
        response = getMenaceResponse(message.author.username);
    } else {
        response = getRelationshipResponse(
            message.author.username,
            user.trust ?? 60
        );
    }
}

function getRelationshipResponse(username, trust) {
    let responses;

    if (trust >= 85) {
        responses = [
            `Hey, ${username}. Good to see you.`,
            `What's up, ${username}?`,
            `${username}! You're alright. I mean that.`,
            `Hey, ${username}. Paradise is better with you around.`
        ];
    } else if (trust >= 70) {
        responses = [
            `Hey, ${username}.`,
            `What's going on, ${username}?`,
            `${username}, you're alright.`,
            `Good to see you, I guess.`
        ];
    } else if (trust >= 50) {
        responses = [
            `Oh. It's you, ${username}.`,
            `Yeah, what's up?`,
            `${username}. What's the problem?`,
            `I know you. Sort of.`
        ];
    } else if (trust >= 30) {
        responses = [
            `What do you want, ${username}?`,
            `${username}, I'm kinda busy.`,
            `Seriously, ${username}?`,
            `You again. Great.`
        ];
    } else if (trust >= 10) {
        responses = [
            `I'm keeping an eye on you, ${username}.`,
            `Whatever you're doing, don't.`,
            `${username}, I'm not getting involved.`,
            `I don't trust this conversation.`
        ];
    } else {
        responses = [
            `No.`,
            `Absolutely not, ${username}.`,
            `I'm not talking to you.`,
            `Go bother somebody else.`,
            `I know what you did.`
        ];
    }

    return responses[Math.floor(Math.random() * responses.length)];
}

function getMemoryResponse(username, user) {
    const responses = [];

    if (user.wanted >= 1) {
        responses.push(
            `I'd be careful if I were you, ${username}. You've already got a file.`
        );
    }

    if (user.rants >= 2) {
        responses.push(
            `You know, ${username}, you've complained about this before.`
        );
    }

    if (user.helps >= 1) {
        responses.push(
            `Huh. You actually helped somebody recently. Maybe there's hope.`
        );
    }

    if (user.messages >= 25) {
        responses.push(
            `${username}, you've been around here quite a bit.`
        );
    }

    if (user.commands >= 10) {
        responses.push(
            `You really like using those commands, don't you, ${username}?`
        );
    }

    if (responses.length === 0) {
        return null;
    }

    if (Math.random() > 0.35) {
        return null;
    }

    return responses[
        Math.floor(Math.random() * responses.length)
    ];
}

if (!response && user) {
    response = getMemoryResponse(
        message.author.username,
        user
    );
}

    if (!response) {
        const responses = automaticResponses[category];

        response =
            responses[Math.floor(Math.random() * responses.length)];
    }

    responseCooldowns.set(cooldownKey, Date.now());

    await message.reply(response).catch(() => {});
});

function getMenaceResponse(username) {
    const responses = [
        `${username}, maybe let's not make things worse today.`,
        `I know you, ${username}. This usually ends badly.`,
        `${username}, I'm keeping an eye on you.`,
        `You again, ${username}? Fantastic.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

function getThreatResponse(username) {
    const responses = [
        `${username}, I'm not getting involved in whatever you're planning.`,
        `Everybody keep an eye on ${username}.`,
        `${username}, whatever you're about to do, don't.`,
        `I knew ${username} was going to be trouble.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

function getWantedResponse(username) {
    const responses = [
        `${username}. Seriously? I just looked at your file.`,
        `Everybody stay calm. ${username} is here.`,
        `${username}, I'm pretty sure you're not supposed to be here.`,
        `Oh great. Paradise's Most Wanted just showed up.`,
        `Someone call somebody. I don't know who. Just somebody.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

client.login(process.env.DISCORD_TOKEN);