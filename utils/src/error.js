const { EmbedBuilder } = require("discord.js");

function error(message, content) {
  return message.channel.send({
    embeds: [new EmbedBuilder().setDescription(content).setColor(0xff0000)],
  });
}

module.exports = error;
