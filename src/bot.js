// By Luis Eduardo Rozante
// GitHub: https://github.com/LuisEduardoR
// Discord: Alyx#9029
//
// Partially based on the tutorial by Under Ctrl, you can find this tutorial on the following playlist:
// https://www.youtube.com/watch?v=KZ3tIGHU314&list=PLpmb-7WxPhe0ZVpH9pxT5MtC4heqej8Es

const { Client, IntentsBitField } = require('discord.js');
const { IpService } = require('./ip_service.js');

const loadSettings = require('./load_settings.js');

const { exit } = require('process');

function onReady(client) {
    console.log(`Client is online! (${client.user.tag})\n`);

    // Initial IP check after login.
    ipService.checkForIpChanges();
    
    // Setups periodical IP if configured to do so.
    if(settings && settings.checkPeriod && settings.checkPeriod > 0.0) {
        ipService.setupPeriodicIpCheck(settings.checkPeriod);
    }
}

function onInteraction(interaction) {
    if(!interaction.isChatInputCommand()) {
        return;
    }

    console.log(`Client received command: /${interaction.commandName}`);

    if (interaction.commandName === 'ip') {
        ipService.handleIpCommand(interaction);
    }
}

console.log('Loading settings...\n');
const settings = loadSettings.loadSettingsFromJson();

// Add your bot's token to the settings.json file in the directory this app is run from.
if(settings && settings.token) {
    console.log(`Token loaded successfully (${String(settings.token).slice(0, 8)}...)`);
} else {
    console.log('Failed to load token, ensure a token is present in the settings file!');
    exit();
}

// Add the channels you want to allow this bot to reply with the server IP token to the settings.json file in the 
// directory this app is run from.
//
// NOTE: Add the entire name, including emojis and other utf8 symbols!
if (settings && settings.whitelist && settings.whitelist.length > 0) {
    console.log('The following channels are whitelisted for sending the IP:');
    console.log(settings.whitelist)
} else {
    console.log('Failed to load whitelist, ensure at least one channel name is present in the settings file array!');
    exit();
}

// Add the checkPeriod so the bot can check for IP changes from time to time in the settings.json file in the 
// directory this app is run from. Note that this value is in milliseconds.
if(settings && settings.checkPeriod && settings.checkPeriod > 0.0) {
    console.log(`The IP will be checked every ${settings.checkPeriod}ms`);
} else {
    console.log(`Failed to load checkPeriod, the server will not check the server IP unless a command is used!`);
}

console.log('\nDONE!\n');

const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent
        ],
    });

const ipService = new IpService(
    client,
    settings
);

// Setup events.
client.on('ready', onReady);
client.on('interactionCreate', onInteraction);

// Login to discord API.
console.log('Logging in...\n');
client.login(settings.token);