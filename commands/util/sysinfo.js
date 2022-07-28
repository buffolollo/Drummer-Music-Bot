const { Client, Message, EmbedBuilder } = require("discord.js");
const os = require("node-os-utils");
const mem = os.mem;
const cpu = os.cpu;

module.exports = {
  name: "stats",
  aliases: [
    "usage",
    "usageram",
    "sysinfo",
    "system",
    "systeminfo",
    "statistics",
  ],
  staff: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    const c = await cpu.usage();
    const info = await mem.info();
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Statistics")
      .setDescription("Stats of the bot")
      .addFields(
        {
          name: "Memory (RAM)",
          value:
            "Total Memory: " +
            info.totalMemMb +
            " MB\nUsed Memory: " +
            info.usedMemMb +
            " MB\nFree Memory: " +
            info.freeMemMb +
            " MB\nPercentage Of Free Memory: " +
            info.freeMemPercentage +
            "%",
          inline: true,
        },
        {
          name: "CPU",
          value: `Percentage of CPU Usage: ${c} %`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({
          dynamic: true,
        }),
      });

    message.channel.send({
      embeds: [embed],
    });
  },
};
