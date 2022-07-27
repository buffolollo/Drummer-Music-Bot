const { Client, Message, EmbedBuilder } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const skip = require("./skip");
const {
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");

module.exports = {
  name: "goto",
  aliases: ["qp", "goto", "go", "to", "queueplay"],
  d: "Goto a song in the queue",
  voice: true,
  queue: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args, q) {
    const error = (err) =>
      message.channel.send({
        embeds: [new EmbedBuilder().setColor("RED").setDescription(err)],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [new EmbedBuilder().setDescription(content).setColor("GREEN")],
      });

    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    const queue = q.get(message.guild.id);
    let num;

    if (queue.songs.length < 2)
      return error("There's only the song I'm playing!");

    num = parseInt(args[0]);
    if (isNaN(num)) return error("Please enter a valid number!");

    if (num == 0) return error("**You cannot enter the number 0!**");

    if (num == 1) {
      skip.execute(client, message, args);
    }

    if (!queue.songs[num]) {
      num = parseInt(queue.songs.length - 1);
      return _playYTDLStream(queue.songs[num]);
    }

    return _playYTDLStream(queue.songs[num]);

    async function _playYTDLStream(track) {
      try {
        let data = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            data.message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    "**The queue is empty, there are no more songs to play!**"
                  )
                  .setColor("RED"),
              ],
            });
            deletequeue(message.guild.id);
            var interval = config.leaveOnEndQueue * 1000;
            setTimeout(() => {
              let queue = message.client.queue.get(message.guild.id);
              if (queue) return;
              if (message.guild.me.voice.channel) {
                const connection = getVoiceConnection(
                  message.guild.me.voice.channel.guild.id
                );
                connection.destroy();
              }
            }, interval);
          } catch (error) {
            return deletequeue(message.guild.id);
          }
          return;
        }

        let newStream = await ytdl(track.url, {
          filter: "audioonly",
          quality: "highestaudio",
          highWaterMark: 1 << 25,
          opusEncoded: true,
        });

        data.stream = newStream;
        const player = createAudioPlayer();
        const resource = createAudioResource(newStream, { inlineVolume: true });
        resource.volume.setVolumeLogarithmic(data.volume / 100);
        data.player = player;
        data.resource = resource;
        player.play(resource);
        data.connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
          data.addTime = 0;
          if (data.loopone) {
            return _playYTDLStream(data.songs[0]);
          } else if (data.loopall) {
            let removed = data.songs.shift();
            data.songs.push(removed);
          } else {
            data.songs.shift();
          }
          _playYTDLStream(data.songs[0]);
        });

        queue.songs[0] = queue.songs[num];
        let q = queue.songs;
        let index = num;
        q.splice(index, 1);

        return queue.message.channel.send({
          content: `**Playing** 🎶 \`${track.name}\` - Now!`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
