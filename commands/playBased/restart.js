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

        return data.message.channel.send({
          content: `**Playing** 🎶 \`${track.name}\` - Now!`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
