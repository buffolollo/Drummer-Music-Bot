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
const { join } = require("node:path");

const yt = require("ytdl-core");
let ytdl = require("discord-ytdl-core");

module.exports = {
  name: "testplay",
  aliases: ["tp"],
  //voice: true,
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
    const player = createAudioPlayer();
    const resource = createAudioResource(
      "https://cdn.discordapp.com/attachments/994708980314144839/1002683248343785542/pati.mp3",
      { inlineVolume: true }
    );
    player.play(resource);
    if (args[0] == "1") {
      const connection1 = await joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      resource.volume.setVolumeLogarithmic(100 / 100);
      connection1.subscribe(player);
    }
    if (args[0] == "2") {
      const connection2 = await joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      resource.volume.setVolumeLogarithmic(100 / 100);
      connection2.subscribe(player);
    }
  },
};
