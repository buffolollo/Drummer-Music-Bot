const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: [],
  d: "Bot ping",
  execute(client, message, args) {
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(
            `🏓Message time response ${
              (Date.now() - message.createdTimestamp) * -1
            }ms. API Latency is ${Math.round(client.ws.ping)}ms`
          )
          .setColor("GREEN"),
      ],
    });
  },
};
