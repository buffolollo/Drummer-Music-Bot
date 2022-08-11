const { Client, Message, EmbedBuilder } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "uptime",
  aliases: ["up"],
  d: "Bot uptime",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    const uptime = prettyMilliseconds(client.uptime);
    const uptimeEmbed = new EmbedBuilder()
      .setTitle(`Client Uptime`)
      .setDescription(`**Uptime**: \`${uptime}\``)
      .setColor("DarkGreen")
      .setTimestamp();
    message.reply({
      embeds: [uptimeEmbed],
    });
  },
};
