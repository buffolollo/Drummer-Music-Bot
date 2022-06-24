const { Client, Message, MessageEmbed } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
const yt = require("ytdl-core");

module.exports = {
  name: "",
  aliases: [],
  voice: true,
  queue: true,
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
      message.channel.send(
        new MessageEmbed().setColor("RED").setDescription(err)
      );
    const send = (content) =>
      message.channel.send(
        new MessageEmbed().setDescription(content).setColor("GREEN")
      );
    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);
  },
};
