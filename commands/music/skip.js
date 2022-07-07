const { MessageEmbed, Client, Message } = require("discord.js");

module.exports = {
  //^<>&
  name: "skip",
  aliases: [],
  voice: true,
  queue: true,
  d: "Skip the song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args, q) {
    let queue = q.get(message.guild.id);
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription("**Song skipped :white_check_mark: **")
          .setColor("YELLOW"),
      ],
    });
    return queue.player.stop();
  },
};
