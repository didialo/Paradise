const { SlashCommandBuilder } = require('discord.js');
const { getUser } = require('../database/database.js');

// 💕 The one person who gets the special romance profile section.
const YUME_USER_ID = '1257135233329922108';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription("See what Dude remembers about someone.")
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The Paradise resident')
                .setRequired(false)
        ),

    async execute(interaction) {
        const target =
            interaction.options.getUser('user') || interaction.user;

        const user = getUser(target.id);

        if (!user) {
            await interaction.reply(
                `I don't know **${target.username}** yet. Give them a minute.`
            );
            return;
        }

        const reputation = getReputation(user);
        const relationship = getRelationship(user);
        const assessment = getAssessment(
            user,
            reputation,
            relationship
        );

        let profile =
            `**PARADISE FILE — ${target.username}**\n\n` +
            `🏷️ **Reputation:** ${reputation.name}\n` +
            `🤝 **Relationship:** ${relationship.name}\n` +
            `❤️ **Trust:** ${relationship.trust}%\n`;

        // 💕 Romance is only shown for the designated user.
        if (target.id === YUME_USER_ID) {
            const romance = getRomance(relationship.trust);

            profile +=
                `💕 **Romance:** ${romance.name}\n` +
                `💘 **Affection:** ${romance.affection}%\n`;
        }

        profile +=
            `\n` +
            `💬 **Messages:** ${user.messages}\n` +
            `🧍 **Commands used:** ${user.commands}\n` +
            `🚨 **Wanted notices:** ${user.wanted}\n` +
            `🗣️ **Rants:** ${user.rants}\n` +
            `🤝 **People helped:** ${user.helps}\n` +
            `🐕 **Barks:** ${user.barks}\n` +
            `📅 **Resident since:** ${formatDate(user.joined_at)}\n\n` +
            `**DUDE'S ASSESSMENT**\n` +
            `*${assessment}*`;

        await interaction.reply(profile);
    }
};

function getReputation(user) {
    const score =
        (user.wanted * 5) +
        (user.rants * 2) +
        (user.commands * 0.25);

    if (score >= 30) {
        return {
            name: "💀 PARADISE'S MOST WANTED",
            level: 5
        };
    }

    if (score >= 20) {
        return {
            name: '🔴 PUBLIC THREAT',
            level: 4
        };
    }

    if (score >= 10) {
        return {
            name: '🟠 MENACE',
            level: 3
        };
    }

    if (score >= 5) {
        return {
            name: '🟡 SUSPICIOUS',
            level: 2
        };
    }

    return {
        name: '🟢 CIVILIAN',
        level: 1
    };
}

function getRelationship(user) {
    const trust = Math.max(
        0,
        Math.min(100, user.trust ?? 60)
    );

    if (trust >= 85) {
        return {
            name: '⭐ Trusted Local',
            trust
        };
    }

    if (trust >= 70) {
        return {
            name: '🙂 Alright',
            trust
        };
    }

    if (trust >= 50) {
        return {
            name: '😐 Acquaintance',
            trust
        };
    }

    if (trust >= 30) {
        return {
            name: '😒 Annoyed',
            trust
        };
    }

    if (trust >= 10) {
        return {
            name: '🙄 Distrusted',
            trust
        };
    }

    return {
        name: '💢 Absolutely Not',
        trust
    };
}

function getRomance(trust) {
    if (trust >= 95) {
        return {
            name: '💘 Completely Gone',
            affection: 100
        };
    }

    if (trust >= 90) {
        return {
            name: '💞 Hopelessly Attached',
            affection: 95
        };
    }

    if (trust >= 85) {
        return {
            name: '💕 Very Fond',
            affection: 88
        };
    }

    if (trust >= 75) {
        return {
            name: '💗 Getting Attached',
            affection: 78
        };
    }

    if (trust >= 60) {
        return {
            name: '💓 Curious',
            affection: 65
        };
    }

    return {
        name: '🤍 Complicated',
        affection: Math.max(25, trust)
    };
}

function getAssessment(user, reputation, relationship) {
    if (relationship.trust < 10) {
        return "I'd rather not talk about this one.";
    }

    if (reputation.level === 5) {
        return "I've got an entire file cabinet dedicated to this one.";
    }

    if (reputation.level === 4) {
        return "Yeah, I'd keep an eye on this one.";
    }

    if (relationship.trust >= 85) {
        return "You've been alright. Don't screw it up.";
    }

    if (relationship.trust >= 70) {
        return "You're alright. For now.";
    }

    if (reputation.level === 3) {
        return "Starting to become a bit of a problem.";
    }

    if (reputation.level === 2) {
        return "Something about this one doesn't sit right.";
    }

    if (user.rants >= 5) {
        return "Complains a lot. Can't really blame them.";
    }

    if (user.commands >= 10) {
        return "Keeps summoning me. Starting to think this is personal.";
    }

    if (user.messages >= 25) {
        return "Yeah, I've definitely seen this guy around.";
    }

    return "Still figuring this one out.";
}

function formatDate(date) {
    if (!date) return 'Unknown';

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}