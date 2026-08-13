require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Collection,
    MessageFlags
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const { automaticResponses } = require('./personality/data.js');

const {
    recordMessage,
    recordCommand,
    updatePassiveTrust,
    getUser,
    isGuildBlacklisted
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


// ================================================================
// 👋 MEMBER JOIN
// ================================================================

client.on('guildMemberAdd', async member => {
    if (isGuildBlacklisted(member.guild.id)) {
        return;
    }

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


// ================================================================
// 🟢 READY
// ================================================================

client.once('clientReady', () => {
    console.log(`Dude is online as ${client.user.tag}`);

    client.user.setPresence({
        activities: [
            {
                name: 'another fine day in Paradise',
                type: 0
            }
        ],
        status: 'idle'
    });

    console.log(
        `Currently in ${client.guilds.cache.size} server(s).`
    );
});


// ================================================================
// ⚙️ SLASH COMMANDS
// ================================================================

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // 🚫 Blacklisted servers cannot use Paradise.
    // The bot owner can still use management commands.
    if (
        interaction.guildId &&
        isGuildBlacklisted(interaction.guildId) &&
        interaction.user.id !== process.env.OWNER_ID
    ) {
        await interaction.reply({
            content:
                '🚫 This server has been blacklisted from using Paradise.',
            flags: MessageFlags.Ephemeral
        }).catch(() => {});

        return;
    }

    const command =
        client.commands.get(interaction.commandName);

    if (!command) return;

    recordCommand(interaction.user);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(
            `Command error in ${interaction.commandName}:`
        );

        console.error(error);

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {
            await interaction.reply({
                content:
                    "Great. Something broke. Don't look at me.",
                flags: MessageFlags.Ephemeral
            }).catch(() => {});
        }
    }
});


// ================================================================
// 💬 AUTOMATIC RESPONSES
// ================================================================

const responseCooldowns = new Map();


// ================================================================
// 💕 YUMESHIP PROTOCOL
// ================================================================

const FLIRT_USER_ID = '1257135233329922108';

const flirtCooldowns = new Map();

client.on('messageCreate', async message => {
    if (message.author.bot) return;


    // ============================================================
    // 🔗 ONLY PREFIX COMMAND — INVITE DUDE
    // ============================================================

    if (
        message.content
            .trim()
            .toLowerCase() === 'p!invite'
    ) {
        const inviteUrl =
            'https://discord.com/oauth2/authorize?client_id=1536711351047557170&permissions=8&integration_type=0&scope=bot+applications.commands';

        await message.reply({
            content:
                `🏜️ **Invite Dude to your server**\n\n` +
                `[➜ Add Dude to a server](${inviteUrl})`,
            allowedMentions: {
                parse: []
            }
        }).catch(() => {});

        return;
    }


    if (!message.guild) return;


    // ============================================================
    // 🚫 BLACKLISTED SERVERS
    // ============================================================

    if (isGuildBlacklisted(message.guild.id)) {
        return;
    }


    recordMessage(message.author);
    updatePassiveTrust(message.author);

const content =
    message.content.toLowerCase();

// ============================================================
// 🏓 PING
// ============================================================

if (content === 'p!ping') {
    const startedAt = performance.now();

    const pingMessage = await message.reply(
        '🏜️ **Hold on... checking the damage.**'
    );

    const roundTrip = Math.max(
        1,
        Math.round(
            performance.now() - startedAt
        )
    );

    const websocketPing = client.ws.ping;

    const websocketText =
        websocketPing >= 0
            ? `\`${Math.round(websocketPing)}ms\``
            : '`measuring...`';

    const uptimeSeconds = Math.floor(
        client.uptime / 1000
    );

    const days = Math.floor(
        uptimeSeconds / 86400
    );

    const hours = Math.floor(
        (uptimeSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (uptimeSeconds % 3600) / 60
    );

    const seconds =
        uptimeSeconds % 60;

    const uptimeParts = [];

    if (days) {
        uptimeParts.push(`${days}d`);
    }

    if (hours || days) {
        uptimeParts.push(`${hours}h`);
    }

    if (minutes || hours || days) {
        uptimeParts.push(`${minutes}m`);
    }

    uptimeParts.push(`${seconds}s`);

    const uptime =
        uptimeParts.join(' ');

    const memoryMB =
        process.memoryUsage().rss /
        1024 /
        1024;

    const os = require('os');

    const processor =
        os.cpus()?.[0]?.model ||
        'Unknown processor';

    const operatingSystem =
        `${os.version()} · ${process.arch}`;

    const nodeVersion =
        process.version;

    await pingMessage.edit(
        `🏜️ **PARADISE // THE DUDE IS ALIVE**\n\n` +
        `> 🏓 **Roundtrip:** \`${roundTrip}ms\`\n` +
        `> 📡 **WebSocket:** ${websocketText}\n\n` +
        `**THE SITUATION**\n` +
        `> **Uptime:** \`${uptime}\`\n` +
        `> **Memory:** \`${memoryMB.toFixed(2)} MB\`\n\n` +
        `**THE MACHINE**\n` +
        `> **Node:** \`${nodeVersion}\`\n` +
        `> **CPU:** \`${processor}\`\n` +
        `> **OS:** \`${operatingSystem}\`\n\n` +
        `*Everything is fine. Probably.* 🏜️`
    );

    return;
}

const user =
    getUser(message.author.id);

    // ============================================================
    // 💕 SPECIAL PERSON
    // ============================================================

    if (
        message.author.id === FLIRT_USER_ID &&
        user
    ) {
        const now = Date.now();

        const lastFlirt =
            flirtCooldowns.get(message.author.id);

        // Minimum cooldown: 2 minutes.
        if (
            !lastFlirt ||
            now - lastFlirt >= 2 * 60 * 1000
        ) {
            const trust =
                user.trust ?? 60;

            let chance = 0.12;

            // Higher trust = more affectionate.
            if (trust >= 90) {
                chance = 0.30;
            } else if (trust >= 80) {
                chance = 0.25;
            } else if (trust >= 70) {
                chance = 0.20;
            } else if (trust >= 60) {
                chance = 0.16;
            }

            // More likely when directly addressed.
            const directlyAddressed =
                message.mentions.has(client.user) ||
                content.includes('paradise');

            if (directlyAddressed) {
                chance += 0.15;
            }

            // Messages that invite affection.
            if (
                /\b(love|miss|cute|pretty|handsome|sweet|kiss|hug|date|like you|love you)\b/i
                    .test(content)
            ) {
                chance += 0.20;
            }

            if (Math.random() < chance) {
                const response =
                    getFlirtResponse(
                        message.author.username,
                        trust,
                        content
                    );

                flirtCooldowns.set(
                    message.author.id,
                    now
                );

                await message
                    .reply(response)
                    .catch(() => {});

                return;
            }
        }
    }


    // ============================================================
    // 🧪 NORMAL PARADISE AUTOMATIC RESPONSES
    // ============================================================

    let category = null;

    if (/\bmonday\b/.test(content)) {
        category = 'monday';

    } else if (
        /\b(good morning|morning)\b/.test(content)
    ) {
        category = 'morning';

    } else if (
        /\b(help|can someone help)\b/.test(content)
    ) {
        category = 'help';

    } else if (
        /\b(fucked up|messed up|screwed up|my bad)\b/
            .test(content)
    ) {
        category = 'mistake';

    } else if (
        /\b(what happened|wtf|chaos|disaster)\b/
            .test(content)
    ) {
        category = 'chaos';
    }

    if (!category) return;

    const cooldownKey =
        `${message.guild.id}-${category}`;

    const lastResponse =
        responseCooldowns.get(cooldownKey);

    if (
        lastResponse &&
        Date.now() - lastResponse < 5 * 60 * 1000
    ) {
        return;
    }

    if (Math.random() > 0.25) {
        return;
    }

    let response = null;

    if (user) {
        const score =
            (user.wanted * 5) +
            (user.rants * 2) +
            (user.commands * 0.25);

        if (score >= 30) {
            response =
                getWantedResponse(
                    message.author.username
                );

        } else if (score >= 20) {
            response =
                getThreatResponse(
                    message.author.username
                );

        } else if (score >= 10) {
            response =
                getMenaceResponse(
                    message.author.username
                );

        } else {
            response =
                getRelationshipResponse(
                    message.author.username,
                    user.trust ?? 60
                );
        }
    }

    if (!response && user) {
        response =
            getMemoryResponse(
                message.author.username,
                user
            );
    }

    if (!response) {
        const responses =
            automaticResponses[category];

        if (
            responses &&
            responses.length > 0
        ) {
            response =
                responses[
                    Math.floor(
                        Math.random() *
                        responses.length
                    )
                ];
        }
    }

    if (!response) return;

    responseCooldowns.set(
        cooldownKey,
        Date.now()
    );

    await message
        .reply(response)
        .catch(() => {});
});


// ================================================================
// 💕 FLIRTING
// ================================================================

function getFlirtResponse(
    username,
    trust,
    content
) {
    const responses = [];


    // 💗 Normal affection
    if (trust >= 50) {
        responses.push(
            `Oh, it's you. I was wondering when you'd show up. ♡`,
            `You know, Paradise is a little nicer when you're around.`,
            `There you are. I was starting to wonder where you went. 💕`,
            `You really do have a habit of getting my attention, ${username}.`,
            `I was going to ignore you, but... I suppose I can make an exception. ♡`,
            `You keep showing up like this and I'm going to start thinking you like me.`,
            `You're getting dangerously good at making me smile.`,
            `Don't look at me like that. You're making this difficult.`
        );
    }


    // 💕 High trust
    if (trust >= 70) {
        responses.push(
            `You know I have a soft spot for you, right? Don't make me regret admitting that. 💕`,
            `Honestly, ${username}? You're probably my favorite person here.`,
            `I could talk to everyone else, but I'd rather talk to you.`,
            `You're lucky you're cute. That's the only reason I'm letting you get away with this. ♡`,
            `I missed you. There. I said it. Happy now?`,
            `You always manage to make my day better. It's annoyingly adorable.`,
            `If you keep being this sweet, I might actually fall for you.`
        );
    }


    // 💘 Very high trust
    if (trust >= 85) {
        responses.push(
            `Come here, you. I've got a little more attention to give you. 💕`,
            `At this point I'm not even pretending I don't like you.`,
            `${username}, you're ridiculously important to me. You know that?`,
            `I think I've made my feelings pretty obvious by now... ♡`,
            `If Paradise had a favorite person, it'd probably be you. Don't let that go to your head.`,
            `You have no idea how much I like seeing your name pop up.`,
            `Yeah, yeah. I like you. A lot. Happy? 💘`,
            `You're kind of my weakness, ${username}.`
        );
    }


    // 😳 Missing
    if (
        /\b(miss|missed)\b/i.test(content)
    ) {
        responses.push(
            `...You missed me? Because I definitely noticed you were gone. ♡`,
            `I missed you too. Don't make me say it twice. 💕`
        );
    }


    // ❤️ Love
    if (
        /\b(love you|i love you)\b/i
            .test(content)
    ) {
        responses.push(
            `...You can't just say things like that and expect me to stay composed. 💕`,
            `I... love you too, idiot. There. You happy now? ♡`,
            `You're really trying to make me blush, aren't you?`
        );
    }


    // ✨ Compliments
    if (
        /\b(cute|pretty|handsome|sweet)\b/i
            .test(content)
    ) {
        responses.push(
            `Oh? You think I'm cute? Keep talking. I'm listening. 👀`,
            `Careful. Compliments are a dangerous game with me. ♡`,
            `You're pretty cute yourself, you know.`
        );
    }


    // 💋 Kisses
    if (
        /\b(kiss|kiss me)\b/i.test(content)
    ) {
        responses.push(
            `...You're bold today, aren't you? 😳`,
            `You really just asked Paradise that? ...Come here. ♡`,
            `Maybe. If you're nice. 💕`
        );
    }

    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];
}


// ================================================================
// 💞 RELATIONSHIP RESPONSES
// ================================================================

function getRelationshipResponse(
    username,
    trust
) {
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

    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];
}


// ================================================================
// 🧠 MEMORY
// ================================================================

function getMemoryResponse(
    username,
    user
) {
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
        Math.floor(
            Math.random() *
            responses.length
        )
    ];
}


// ================================================================
// 😈 MENACE
// ================================================================

function getMenaceResponse(username) {
    const responses = [
        `${username}, maybe let's not make things worse today.`,
        `I know you, ${username}. This usually ends badly.`,
        `${username}, I'm keeping an eye on you.`,
        `You again, ${username}? Fantastic.`
    ];

    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];
}


// ================================================================
// 🚨 THREAT
// ================================================================

function getThreatResponse(username) {
    const responses = [
        `${username}, I'm not getting involved in whatever you're planning.`,
        `Everybody keep an eye on ${username}.`,
        `${username}, whatever you're about to do, don't.`,
        `I knew ${username} was going to be trouble.`
    ];

    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];
}


// ================================================================
// 💀 WANTED
// ================================================================

function getWantedResponse(username) {
    const responses = [
        `${username}. Seriously? I just looked at your file.`,
        `Everybody stay calm. ${username} is here.`,
        `${username}, I'm pretty sure you're not supposed to be here.`,
        `Oh great. Paradise's Most Wanted just showed up.`,
        `Someone call somebody. I don't know who. Just somebody.`
    ];

    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];
}


// ================================================================
// 🔑 LOGIN
// ================================================================

client.login(process.env.DISCORD_TOKEN);
