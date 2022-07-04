const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnection,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const fs = require("fs");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "test",
  aliases: ["tp"],
  // voice: true,
  staff: true,
  d: "Riproduci una canzone!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    let channel = message.member.voice.channel;
    let deletequeue = (id) => message.client.queue.delete(id);

    const query = args[0];

    const url =
      "https://open.spotify.com/track/3fjmSxt0PskST13CSdBUFx?si=e420cd3a80834011";
  },
};
