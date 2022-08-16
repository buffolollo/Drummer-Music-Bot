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
        let data = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            deletequeue(message.guild.id);
            error(
              data.message,
              "**The queue is empty, there are no more songs to play!**"
            );
            var interval = config.leaveOnEndQueue * 1000;
            setTimeout(() => {
              let queue = message.client.queue.get(message.guild.id);
              if (queue) return;
              if (message.guild.members.me.voice.channel) {
                const connection = getVoiceConnection(
                  message.guild.members.me.voice.channel.guild.id
                );
                connection.destroy();
              }
            }, interval);
          } catch (error) {
            return deletequeue(message.guild.id);
          }
          return;
        }

        if (
          !message.guild.members.me.voice.channel ||
          !message.client.queue.get(message.guild.id)
        ) {
          data.connection.destroy();
          return deletequeue(message.guild.id);
        }

        let newStream = await ytdl(track.url, {
          filter: "audioonly",
          quality: "highestaudio",
          highWaterMark: 1 << 25,
          opusEncoded: true,
          seek: time,
        });

        queue.addTime = parseInt(time);
        data.stream = newStream;
        const player = createAudioPlayer();
        const resource = createAudioResource(newStream, { inlineVolume: true });
        resource.volume.setVolumeLogarithmic(data.volume / 100);
        data.player = player;
        data.resource = resource;
        player.play(resource);
        data.connection.subscribe(player);

        if (
          !message.guild.members.me.voice.channel ||
          !message.client.queue.get(message.guild.id)
        ) {
          data.connection.destroy();
          return deletequeue(message.guild.id);
        }

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

        if (time < 0) {
          data.message.channel.send({
            content: `**Playing** 🎶 \`${track.name}\` - Now!`,
          });
        }

        send(data.message, `**I brought the song to ${time} seconds!**`);
      } catch (e) {
        console.error(e);
      }
    }
  },
};
