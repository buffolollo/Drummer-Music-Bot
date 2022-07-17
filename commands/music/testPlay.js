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
const Spotify = require("spotifydl-core").default;
const credentials = {
  clientId: "3d1908318dd0494a9ae38ef5f195b72d",
  clientSecret: "43b78c3812e543288647876e6815da30",
};
const spotify2 = new Spotify(credentials);
// const { getData, getPreview, getTracks, getDetails } = require("spotify-url-info")(fetch);
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const ytpl = require("ytpl");
let ytdl = require("discord-ytdl-core");

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
    console.log("q")

    const link = "https://open.spotify.com/playlist/03j3TDCMGIACRi5SdcxNT7?si=TYcZ9qXhTd-3V7Hfrgvg-g&utm_source=copy-link"

    const data = await spotify.getData(link);

    console.log(data.tracks.items.length);
  },
};
