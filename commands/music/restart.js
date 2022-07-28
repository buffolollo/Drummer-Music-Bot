const { Client, Message, EmbedBuilder } = require("discord.js");
const {
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
const yt = require("ytdl-core");

module.exports = {
  name: "replay",
  aliases: ["restart", "rs"],
  voice: true,
  queue: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    let queue = message.client.queue.get(message.guild.id);

    const channel = message.member.voice.channel;

    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    _playYTDLStream(queue.songs[0]);

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
              if (queue) {
                return;
              } else {
                if (message.guild.me.voice.channel) {
                  const connection = getVoiceConnection(
                    message.guild.me.voice.channel.guild.id
                  );
                  connection.destroy();
                }
              }
            }, interval);
          } catch (error) {
            return deletequeue(message.guild.id);
          }
          return;
        }

        queue.connection.on(
          VoiceConnectionStatus.Disconnected,
          async (oldState, newState) => {
            deletequeue(message.guild.id);
          }
        );

        if (queue.stream) queue.stream.destroy();
        let newStream = await ytdl(track.url, {
          filter: "audioonly",
          quality: "highestaudio",
          highWaterMark: 1 << 25,
          opusEncoded: true,
        });

        queue.stream = newStream;
        const resource = createAudioResource(newStream, { inlineVolume: true });
        queue.player.play(resource);
        resource.volume.setVolumeLogarithmic(queue.volume / 100);
        queue.resource = resource;

        queue.player.on(AudioPlayerStatus.Idle, () => {
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

        return queue.message.channel.send({
          content: `**Playing** 🎶 \`${track.name}\` - Now!`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
