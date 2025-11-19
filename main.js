const Discord = require("discord.js");
const client = new Discord.Client();  //{ partials: ["MESSAGE", "CHANNEL", "REACTION"] }
const role = require("discord-auto-role");
require('dotenv').config();
const mongoose = require("mongoose");
var mute = require('mute');
const Levels = require("discord-xp");
const RPC = require("discord-rpc");
const { OpenAIApi, Configuration } = require("openai")
const config = new Configuration({
    apiKey: process.env.OPENAI_KEY
})

const openai = new OpenAIApi(config)


Levels.setURL(process.env.MONGOPATH);

const memberCounter = require('./counters/member-counter');
const botActivity = require('./events/client/Activity');
const welcome = require('./events/client/welcome');
const leave = require('./events/client/leave');
const mongo = require('./mongo');
const joinrole = require('./events/client/joinrole');

client.on('ready', async () => {
    welcome(client);
    leave(client);
    memberCounter(client);
    joinrole(client);
    botActivity(client);
    await mongo().then(async (mongoose) => {
        try {
            console.log('Connected to DataBase!')
        } finally {
            mongoose.connection.close()
        }
         
    })
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.DISCORD_TOKEN);
