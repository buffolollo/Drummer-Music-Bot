const { Client, Message, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
const yt = require("ytdl-core");

module.exports = {
  name: "join",
  d: "Join the voice channel",
  aliases: ["enter", "come"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    const channel = message.member.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    message.channel.send({
      content: `**👍 Joined** \`${channel.name}\``,
    });
  },
};
