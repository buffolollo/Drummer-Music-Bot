const { Client, Message, MessageEmbed } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
const yt = require("ytdl-core");

module.exports = {
  name: "autoplay",
  aliases: ["ap", "at", "ay"],
  voice: true,
  queue: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args, q) {
    const queue = q.get(message.guild.id);

    const error = (err) =>
      message.channel.send({
        embeds: [new MessageEmbed().setColor("RED").setDescription(err)],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [new MessageEmbed().setDescription(content).setColor("GREEN")],
      });

    if (queue.autoplay == false) {
      queue.LastSongId = queue.songs[0].id;
      queue.autoplay = true;
      send(`**Autoplay is now ON!**`);
    } else {
      queue.LastSongId = null;
      queue.autoplay = false;
      send(`**Autoplay is now OFF!**`);
    }
  },
};
