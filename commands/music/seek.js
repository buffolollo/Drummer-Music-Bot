const { EmbedBuilder, Client, Message, Util } = require("discord.js");
const {
  createAudioPlayer,
  VoiceConnectionStatus,
  joinVoiceChannel,
  AudioPlayerStatus,
  createAudioResource,
  AudioPlayer,
} = require("@discordjs/voice");
const ytdl = require("discord-ytdl-core");
const youtubeScraper = require("yt-search");
const yt = require("ytdl-core");
const forHumans = require("../../utils/src/forhumans");
module.exports = {
  name: "seek",
  aliases: [],
  voice: true,
  queue: true,
  d: "Seek the song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args) {
    const channel = message.member.voice.channel;

    const queue = message.client.queue.get(message.guild.id);

    const error = (err) => message.channel.send(err);
    const send = (content) => message.channel.send(content);
    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);
    var time;

    time = args[0];
    if (isNaN(time)) return error(message, "Please enter a valid number!");

    if (queue.paused == true)
      return error(
        message,
        "To keep the song going, you have to pick it up again"
      );

    let queue2 = message.client.queue.get(message.guild.id);
    let or = time * 1000;
    if (queue2.songs[0].durationMS <= or) {
      return queue.player.stop();
    }

    time = parseInt(time);

    try {
      let song = queue.songs[0];
      _playYTDLStream(song);
    } catch (error) {
      deletequeue(message.guild.id);
      console.error(error);
    }

    async function _playYTDLStream(track) {
      try {
        const queue = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            error(
              queue.message,
              "**The queue is empty, there are no more songs to play!**"
            );
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
          seek: time,
        });

        queue.addTime = parseInt(time);
        queue.stream = newStream;
        const player = createAudioPlayer();
        const resource = createAudioResource(newStream, { inlineVolume: true });
        resource.volume.setVolumeLogarithmic(queue.volume / 100);
        queue.player = player;
        queue.resource = resource;
        player.play(resource);
        queue.connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
          queue.addTime = 0;
          if (queue.loopone) {
            return _playYTDLStream(queue.songs[0]);
          } else if (queue.loopall) {
            let removed = queue.songs.shift();
            queue.songs.push(removed);
          } else {
            queue.songs.shift();
          }
          _playYTDLStream(queue.songs[0]);
        });

        if (time < 0) {
          queue.message.channel.send({
            content: `**Playing** 🎶 \`${track.name}\` - Now!`,
          });
        }

        send(queue.message, `**I brought the song to ${time} seconds!**`);
      } catch (e) {
        console.error(e);
      }
    }
  },
};
