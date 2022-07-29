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
const { Client, Message, EmbedBuilder } = require("discord.js");
const ytsr = require("youtube-sr").default;
// const { getData, getPreview, getTracks, getDetails } = require("spotify-url-info")(fetch);
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);

const yt = require("ytdl-core");
let ytdl = require("discord-ytdl-core");

module.exports = {
  name: "testplay",
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

    // const link = "https://www.youtube.com/watch?v=X-5ACIGzSw0"

    // const data = await ytsr.search(link, { type: "video", limit: 1 })

    // console.log(data[0]);
  },
};
