const { Client, Message, EmbedBuilder } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
const yt = require("ytdl-core");

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
  async execute(client, message, args) {
    let queue = message.client.queue.get(message.guild.id);

    const channel = message.member.voice.channel;
    const error = (err) =>
      message.channel.send({
        embeds: [new EmbedBuilder().setColor("RED").setDescription(err)],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [new EmbedBuilder().setDescription(content).setColor("GREEN")],
      });

    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

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
            .setColor("DARK_GREEN"),
        ],
      })
      .catch((err) => {
        error(
          `**I can't send you the song!\nProbably you may have disabled the dms!**\nError: ${err}`
        );
      });
  },
};
