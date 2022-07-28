const { EmbedBuilder } = require("discord.js");

function error(message, content) {
  return message.channel.send({
    embeds: [new EmbedBuilder().setDescription(content).setColor("Red")],
  });
}

module.exports = error;
