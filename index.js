const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config/config.json");
const chalk = require("chalk");
const EventEmitter = require("events");
const intents = new Discord.Intents(32767);

process.setMaxListeners(0);
EventEmitter.defaultMaxListeners = 0;

const client = new Discord.Client({
  intents,
  partials: [
    "MESSAGE",
    "CHANNEL",
    "REACTION",
    "GUILD_MEMBER",
    "GUILD_SCHEDULED_EVENT",
    "USER",
  ],
});

global.client = client;
global.config = config;
global.color = chalk;

client.queue = new Map();
client.commands = new Discord.Collection();

require("./utils/handler/CommandsHandler")(client, Discord, fs);
require("./utils/handler/EventsHandler")(client, Discord, fs);
require("./database/connection/mongodb");

client.login(config.token);
