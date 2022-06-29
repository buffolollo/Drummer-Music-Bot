const { Client, Message, MessageEmbed } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
const yt = require("ytdl-core");

module.exports = {
  name: "join",
  aliases: ["enter", "come", "cum"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    const error = (err) =>
      message.channel.send({
        embeds: [new MessageEmbed().setColor("RED").setDescription(err)],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [new MessageEmbed().setDescription(content).setColor("GREEN")],
      });

    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    const connection = await joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    message.channel.send({
      content: `**👍 Joined** \`${channel.name}\``,
    });
  },
};
