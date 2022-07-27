const { EmbedBuilder, Client, Message } = require("discord.js");

module.exports = {
  name: "clearqueue",
  aliases: ["cq", "clq"],
  voice: true,
  queue: true,
  d: "Clear the queue",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    let queue = message.client.queue.get(message.guild.id);
    queue.songs = [];
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "**Queue cleared :white_check_mark: **"
          )
          .setColor("GREEN"),
      ],
    });
  },
};
