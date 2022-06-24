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
  async execute(client, message, args) {
    const channel = message.member.voice.channel;
    let queue = message.client.queue.get(message.guild.id);
    queue.player.stop();
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription("**Song skipped :white_check_mark: **")
          .setColor("YELLOW"),
      ],
    });
  },
};
