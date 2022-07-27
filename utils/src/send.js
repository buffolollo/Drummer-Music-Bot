const { EmbedBuilder } = require("discord.js");

function send(message, content) {
  return message.channel.send({
    embeds: [new EmbedBuilder().setDescription(`${content}`).setColor("#006400")],
  });
}

module.exports = send;
