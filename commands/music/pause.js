const { EmbedBuilder, Client, Message } = require("discord.js");

module.exports = {
  //^<>&
  name: "pause",
  aliases: [],
  voice: true,
  queue: true,
  d: "Pause the song!",
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

    if (queue.paused == true)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(":x: This song is already paused.")
            .setColor("RED"),
        ],
      });
    queue.player.pause();
    queue.paused = true;
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription("**Song paused :white_check_mark:**")
          .setColor("GREEN"),
      ],
    });
  },
};
