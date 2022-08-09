const { Client, Message, EmbedBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  name: "playmp3",
  aliases: ["p3"],
  voice: true,
  d: "Play a music of a discod attachment link",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    const channel = message.member.voice.channel;

    const query = args[0];

    if (!query) return error("Insert a link to a discord video or song");
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(query, { inlineVolume: true });
    resource.volume.setVolumeLogarithmic(100 / 100);
    player.play(resource);
    connection.subscribe(player);

    send(message, `I'm playing the sound!`);

    player.on(AudioPlayerStatus.Idle, () => {
      send(message, "Finished audio!");
      connection.disconnect();
    });
  },
};
