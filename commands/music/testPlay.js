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
const spotify = new Spotify(credentials);

module.exports = {
  name: "test",
  aliases: ["t"],
  voice: true,
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

    console.log("a");

    const data = await spotify.getPlaylist(query);
    const song = await spotify.getTrack(data.tracks[0]);

    console.log(song);
    return console.log(data.tracks);

    message.channel.send({
      content: `${data.tracks}, ${data.artists}`,
    });

    return;

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    const resource = createAudioResource();
    player.play(resource);
    connection.subscribe(player);
    message.channel.send({
      content: `Playing ${info.title}`,
      embeds: [new MessageEmbed().setDescription("Yes!")],
    });
    setTimeout(() => {
      console.log(player.state.playbackDuration);
    }, 5000);
  },
};
