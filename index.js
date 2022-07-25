const Discord = require("discord.js");
const config = require("./config/config.json");
const colors = require("colors/safe")
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
global.color = colors;

client.queue = new Map();
client.commands = new Discord.Collection();

require("./utils/handlers/CommandsHandler")(client);
require("./utils/handlers/EventsHandler")(client);
require("./utils/handlers/antiCrash")(client);
require("./database/connection/mongodb");

client.login(config.token);
