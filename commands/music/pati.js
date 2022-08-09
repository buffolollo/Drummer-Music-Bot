const { Client, Message, EmbedBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { ConnectionStates } = require("mongoose");

module.exports = {
  name: "pati",
  aliases: ["andrea"],
  voice: true,
  d: "Play JUST THE WAY YOU ARE PATI SONG",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    const channel = message.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource("./music/pati.mp3", {
      inlineVolume: true,
    });
    resource.volume.setVolumeLogarithmic(100 / 100);
    player.play(resource);
    connection.subscribe(player);

    send(message, `**PATI IS STARTING TO PLAY THE BEST SONG EVER!**`);

    player.on(AudioPlayerStatus.Idle, () => {
      send(message, "Pati has finished😭!");
      connection.disconnect();
    });
    connection.on(VoiceConnectionStatus.Disconnected, () => {
      player.stop();
      connection.destroy();
    });
  },
};
