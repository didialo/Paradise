const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../paradise.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        messages INTEGER DEFAULT 0,
        commands INTEGER DEFAULT 0,
        wanted INTEGER DEFAULT 0,
        rants INTEGER DEFAULT 0,
        helps INTEGER DEFAULT 0,
        trust INTEGER DEFAULT 60,
        joined_at TEXT,
        last_seen TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS blacklisted_guilds (
        guild_id TEXT PRIMARY KEY,
        guild_name TEXT NOT NULL,
        blacklisted_at TEXT NOT NULL
    )
`);

const columns = db
    .prepare('PRAGMA table_info(users)')
    .all()
    .map(column => column.name);

if (!columns.includes('helps')) {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN helps INTEGER DEFAULT 0
    `);
}

if (!columns.includes('passive_milestones')) {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN passive_milestones INTEGER DEFAULT 0
    `);
}

if (!columns.includes('trust')) {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN trust INTEGER DEFAULT 60
    `);
}

if (!columns.includes('barks')) {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN barks INTEGER DEFAULT 0
    `);
}

function ensureUser(user) {
    const existing = db
        .prepare('SELECT user_id FROM users WHERE user_id = ?')
        .get(user.id);

    if (!existing) {
        db.prepare(`
            INSERT INTO users (
                user_id,
                username,
                joined_at,
                last_seen,
                helps,
                trust
            )
            VALUES (?, ?, ?, ?, 0, 60)
        `).run(
            user.id,
            user.username,
            new Date().toISOString(),
            new Date().toISOString()
        );
    }
}

function recordMessage(user) {
    ensureUser(user);

    db.prepare(`
        UPDATE users
        SET
            username = ?,
            messages = messages + 1,
            last_seen = ?
        WHERE user_id = ?
    `).run(
        user.username,
        new Date().toISOString(),
        user.id
    );
}

function recordCommand(user) {
    ensureUser(user);

    db.prepare(`
        UPDATE users
        SET
            username = ?,
            commands = commands + 1,
            last_seen = ?
        WHERE user_id = ?
    `).run(
        user.username,
        new Date().toISOString(),
        user.id
    );
}

function recordWanted(user) {
    ensureUser(user);

    db.prepare(`
        UPDATE users
        SET
            username = ?,
            wanted = wanted + 1,
            trust = MAX(0, trust - 8),
            last_seen = ?
        WHERE user_id = ?
    `).run(
        user.username,
        new Date().toISOString(),
        user.id
    );
}

function recordRant(user) {
    ensureUser(user);

    db.prepare(`
        UPDATE users
        SET
            username = ?,
            rants = rants + 1,
            last_seen = ?
        WHERE user_id = ?
    `).run(
        user.username,
        new Date().toISOString(),
        user.id
    );
}

function recordBark(user) {
    ensureUser(user);

    const current = getUser(user.id);

    if (!current) return;

    // Barking is powerful, but not infinitely powerful.
    const barkBonus = current.barks < 10 ? 3 : 1;

    db.prepare(`
        UPDATE users
        SET
            barks = barks + 1,
            trust = MIN(100, trust + ?),
            last_seen = ?
        WHERE user_id = ?
    `).run(
        barkBonus,
        new Date().toISOString(),
        user.id
    );
}

function recordHelp(user) {
    ensureUser(user);

    db.prepare(`
        UPDATE users
        SET
            username = ?,
            helps = helps + 1,
            trust = MIN(100, trust + 5),
            last_seen = ?
        WHERE user_id = ?
    `).run(
        user.username,
        new Date().toISOString(),
        user.id
    );
}

function updatePassiveTrust(user) {
    ensureUser(user);

    const current = getUser(user.id);

    if (!current) return;

    const messageMilestone = Math.floor(
        current.messages / 25
    );

    const joined = new Date(current.joined_at);
    const now = new Date();

    const daysSinceJoining = Math.floor(
        (now - joined) / (1000 * 60 * 60 * 24)
    );

    const timeMilestone = Math.floor(
        daysSinceJoining / 7
    );

    const earnedMilestones =
        messageMilestone + timeMilestone;

    const alreadyEarned =
        current.passive_milestones || 0;

    if (earnedMilestones <= alreadyEarned) {
        return;
    }

    const newMilestones =
        earnedMilestones - alreadyEarned;

    const trustIncrease =
        newMilestones;

    db.prepare(`
        UPDATE users
        SET
            trust = MIN(100, trust + ?),
            passive_milestones = ?
        WHERE user_id = ?
    `).run(
        trustIncrease,
        earnedMilestones,
        user.id
    );
}

function getUser(userId) {
    return db
        .prepare('SELECT * FROM users WHERE user_id = ?')
        .get(userId);
}


// ================================================================
// 🚫 GUILD BLACKLIST SYSTEM
// ================================================================

function blacklistGuild(guild) {
    db.prepare(`
        INSERT OR REPLACE INTO blacklisted_guilds (
            guild_id,
            guild_name,
            blacklisted_at
        )
        VALUES (?, ?, ?)
    `).run(
        guild.id,
        guild.name,
        new Date().toISOString()
    );
}

function unblacklistGuild(guildId) {
    db.prepare(`
        DELETE FROM blacklisted_guilds
        WHERE guild_id = ?
    `).run(guildId);
}

function isGuildBlacklisted(guildId) {
    return Boolean(
        db.prepare(`
            SELECT guild_id
            FROM blacklisted_guilds
            WHERE guild_id = ?
        `).get(guildId)
    );
}

function getBlacklistedGuilds() {
    return db.prepare(`
        SELECT *
        FROM blacklisted_guilds
        ORDER BY blacklisted_at DESC
    `).all();
}


module.exports = {
    ensureUser,
    recordMessage,
    recordCommand,
    recordWanted,
    recordRant,
    recordHelp,
    recordBark,
    updatePassiveTrust,
    getUser,

    blacklistGuild,
    unblacklistGuild,
    isGuildBlacklisted,
    getBlacklistedGuilds
};