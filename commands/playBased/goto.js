const { Client, Message, EmbedBuilder } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const skip = require("../music/skip");
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
  execute(client, message, args, q) {
    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    const queue = q.get(message.guild.id);

    if (queue.songs.length < 2)
      return error(message, "There's only the song I'm playing!");

    var num = parseInt(args[0]);
    if (isNaN(num)) return error(message, "Please enter a valid number!");

    if (num == 0) return error(message, "**You cannot enter the number 0!**");

    if (num == 1) {
      return skip.execute(client, message, args);
    }

    if (!queue.songs[num]) {
      var num = parseInt(queue.songs.length - 1);
      return _playYTDLStream(queue.songs[num]);
    }

    return _playYTDLStream(queue.songs[num]);

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
        });

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

        data.songs[0] = data.songs[num];
        let q = data.songs;
        // let index = num;
        q.splice(num, 1);

        return data.message.channel.send({
          content: `**Playing** 🎶 \`${track.name}\` - Now!`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
