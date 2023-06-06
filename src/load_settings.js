// By Luis Eduardo Rozante
// GitHub: https://github.com/LuisEduardoR
// Discord: Alyx#9029

const fs = require('fs');

const SETTINGS_JSON_PATH = './settings.json';

function loadSettingsFromJson() {
    const settings_json = fs.readFileSync(SETTINGS_JSON_PATH, 'utf8');
        if (!settings_json) {
            console.log(`Failed reading ${SETTINGS_JSON_PATH}!`);
            exit();
        }
        
        return JSON.parse(settings_json);
}

module.exports = {
    loadSettingsFromJson: loadSettingsFromJson
}