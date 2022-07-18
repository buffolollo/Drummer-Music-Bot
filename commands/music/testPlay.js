const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnection,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const { Client, Message, MessageEmbed } = require("discord.js");
let ytdl = require("discord-ytdl-core");
let yt = require("ytdl-core");
let spotify = require("spotify-url-info");

module.exports = {
  name: "testplay",
  aliases: ["tp"],
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

    const link = "https://www.youtube.com/watch?v=-H5w_1K1Vlw"

    const data = await yt.getInfo(link);

    let n = data.videoDetails.thumbnails.length
    console.log(data.videoDetails.thumbnails[n - 1].url)
  },
};
