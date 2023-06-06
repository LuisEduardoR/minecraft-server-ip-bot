// By Luis Eduardo Rozante
// GitHub: https://github.com/LuisEduardoR
// Discord: Alyx#9029
//
// Partially based on the tutorial by Under Ctrl, you can find this tutorial on the following playlist:
// https://www.youtube.com/watch?v=KZ3tIGHU314&list=PLpmb-7WxPhe0ZVpH9pxT5MtC4heqej8Es

const { REST, Routes } = require('discord.js');
const load_settings = require('./load_settings.js');

console.log('Loading settings...');
settings = load_settings.loadSettings();

const commands = [
    {
        name: 'ip',
        description: 'Replies with the server IP.'
    }
];

const rest = new REST({ version: '10'}).setToken(settings.token);

(async() => {
    try {
        console.log('Registering commands...');
        await rest.put(
            Routes.applicationGuildCommands(settings.clientId, settings.guildId),
            {
                body: commands
            }
        );
        console.log('DONE!');
    } catch {
        console.log(`There was an error: ${error}`);
    }
})();