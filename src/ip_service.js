// By Luis Eduardo Rozante
// GitHub: https://github.com/LuisEduardoR
// Discord: Alyx#9029

require('discord.js');

const { exec } = require('child_process');

class IpService {

    constructor(client, settings) {
        this.client = client;
        this.settings = settings;
        this.lastIp = undefined;
    }    
    
    storeLastIp(ip) {
        this.lastIp = ip;
        console.log(`Last server IP was ${ip} (${new Date()})`);
    }
    
    getIp(callback) {
        exec('curl ifconfig.me', (err, stdout, stderr) => {
            if(err) {
                console.error(err);
                return null;
            }
    
            if (callback) {
                callback(stdout);
            }
        });
    }
    
    async sendIpToChannel(interaction) {
        this.getIp((ip) => {
            if(ip) {
                this.storeLastIp(ip);
                console.log('Replying with IP...');
                interaction.reply(`Hello! The server IP is ${this.lastIp}.`);
            } else {
                console.log('Failed to get server IP!');
            }
        });
    }
    
    async notifyIpToChannels (channel_names, ip, firstRun) {
    
        var message = undefined;
    
        if(firstRun) {
            console.log(`Running for the first time! Server IP = ${ip}`);
            message = `I just woke up! The server IP is ${ip}.`;
        } else {
            console.log(`The server IP has changed ${this.lastIp} -> ${ip}`);
            message = `The server IP has changed! It is now ${ip}. Remember to update it before trying to connect!`;
        }

        this.storeLastIp(ip);
        
        channel_names.forEach(channel_name => {
            var channel = this.client.channels.cache.find(channel => channel.name === channel_name);
            if(channel) {
                channel.send({content: message});
            }
        });
    }
    
    handleIpCommand(interaction) {
        console.log(`Handling command /ip in ${interaction.channel.name}!`);
        if(this.settings.whitelist.includes(interaction.channel.name)) {
            this.sendIpToChannel(interaction);
        } else {
            console.log(`Replying with channel not allowed message... (${interaction.channel.name} not whitelisted)`);
            interaction.reply('Sorry! I am not allowed to send the server IP on this channel...');
        }
    }
    
    checkForIpChanges() {
        console.log('Checking for IP changes...');
        this.getIp((ip) => {
            if(ip) {
                if(ip !== this.lastIp) {
                    var firstRun = (this.lastIp === undefined);
                    this.notifyIpToChannels(this.settings.whitelist, ip, firstRun);
                } else {
                    console.log('Server IP has not changed!');
                }
            } else {
                console.log('Failed to check for server IP!');
                return;
            }
        });
    }
    
    setupPeriodicIpCheck() {
        setInterval(() => {
            this.checkForIpChanges();
        }, this.settings.checkPeriod);
    }
}

module.exports = {
    IpService: IpService
}