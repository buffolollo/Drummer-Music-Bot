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
    const AP = message.client.autoplay.get(message.guild.id);

    const error = (err) =>
      message.channel.send({
        embeds: [new MessageEmbed().setColor("RED").setDescription(err)],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [new MessageEmbed().setDescription(content).setColor("GREEN")],
      });

    if (AP.autoplay == false) {
      AP.autoplay = true;
      AP.LastSongId = queue.songs[0].id;
      send(`**Autoplay is now ON!**`);
    } else {
      AP.autoplay = false;
      send(`**Autoplay is now OFF!**`);
    }
  },
};
