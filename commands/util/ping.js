const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: [],
  d: "Bot ping",
  execute(client, message, args) {
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `🏓Message time response ${
              Date.now() - message.createdTimestamp
            }ms. API Latency is ${Math.round(client.ws.ping)}ms`
          )
          .setColor("DarkGreen"),
      ],
    });
  },
};
