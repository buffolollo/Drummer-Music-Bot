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
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    const resource = createAudioResource("1.mp3");
    const resource2 = createAudioResource("2.mp3");
    player.play(resource);
    connection.subscribe(player);
    message.channel.send({
      content: "Playing sas",
      embeds: [new MessageEmbed().setDescription("Yes!")],
    });
    setTimeout(() => {
      console.log(player.state.playbackDuration);
    }, 5000);
  },
};
