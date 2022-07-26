const { Client, Message, MessageEmbed } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus
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
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    const error = (err) =>
      message.channel.send({
        embeds: [new MessageEmbed().setColor("RED").setDescription(err)],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [new MessageEmbed().setDescription(content).setColor("GREEN")],
      });

    const query = args[0];

    if (!query) return error("Insert a link to a discord video or song");
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource("../../music/", { inlineVolume: true });
    player.play(resource);
    connection.subscribe(player);
    resource.volume.setVolumeLogarithmic(100 / 100);

    send(`I'm playing the sound!`);

    player.on(AudioPlayerStatus.Idle, () => {
      send("Finished audio!")
      connection.disconnect()
    })
  },
};
