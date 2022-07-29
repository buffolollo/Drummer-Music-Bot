const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "save",
  aliases: ["sv"],
  voice: true,
  queue: true,
  d: "Save a song",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    let queue = message.client.queue.get(message.guild.id);

    const channel = message.member.voice.channel;

    message.author
      .send({
        embeds: [
          new EmbedBuilder()
            // .setAuthor({
            //   name: `${queue.songs[0].title}`,
            //   url: queue.songs[0].url,
            // })
            .setTitle(queue.songs[0].title)
            .setDescription(queue.songs[0].url)
            .setThumbnail(queue.songs[0].thumbnail)
            .setColor(0x006400),
        ],
      })
      .catch((err) => {
        error(
          message,
          `**I can't send you the song!\nProbably you may have disabled the dms!**\nError: ${err}`
        );
      });
  },
};
