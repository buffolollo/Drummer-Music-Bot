const { MessageEmbed } = require("discord.js");

function send(message, content) {
  return message.channel.send({
    embeds: [new MessageEmbed().setDescription(`${content}`).setColor("GREEN")],
  });
}

module.exports = send;
