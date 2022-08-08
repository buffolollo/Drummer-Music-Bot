const {
  Client,
  Collection,
  Partials,
  GatewayIntentBits,
} = require("discord.js");
const config = require("./config/config.json");
const colors = require("colors/safe");
const send = require("./utils/src/send");
const error = require("./utils/src/error");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.User,
    Partials.Reaction,
  ],
});

global.client = client;
global.config = config;
global.color = colors;
global.send = send;
global.error = error;

client.queue = new Map();
client.commands = new Collection();

require("./utils/handlers/CommandsHandler")(client);
require("./utils/handlers/EventsHandler")(client);
require("./utils/handlers/antiCrash")(client);
require("./database/connection/mongodb");

client.login(config.token);
