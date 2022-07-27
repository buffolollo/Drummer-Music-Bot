const { EmbedBuilder } = require("discord.js");

function error(message, content) {
  return message.channel.send({
    embeds: [new EmbedBuilder().setDescription(`${content}`).setColor("#FF0000")],
  });
}

module.exports = error;
