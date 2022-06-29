const { Client, Message, MessageEmbed } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const skip = require("./skip");
const {
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioResource,
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

    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);
    var queue = message.client.queue.get(message.guild.id);
    var num;

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

    _playYTDLStream(queue.songs[num]);

    async function _playYTDLStream(track) {
      try {
        const queue = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            queue.message.channel.send({
              embeds: [
                new MessageEmbed()
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

        // let dispatcher = queue.connection
        //   .play(newStream, { type: "opus", bitrate: "auto" })
        //   .on("finish", () => {
        //     queue.addTime = 0;
        //     if (queue.loopone) {
        //       return _playYTDLStream(queue.songs[0]);
        //     } else if (queue.loopall) {
        //       queue.songs.push(queue.songs[0]);
        //       queue.songs.shift();
        //     } else {
        //       var removed = queue.songs.shift();
        //     }
        //     _playYTDLStream(queue.songs[0]);
        //   });

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
