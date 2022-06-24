let { MessageEmbed, Client, Message, Util } = require("discord.js");
let ytdl = require("discord-ytdl-core");
let yt = require("ytdl-core");
let forHumans = require("../../utils/src/forhumans");
const addSongToQueue = require("../../utils/src/addSongToQueue");
const Queue = require("../../utils/src/Queue");
const Song = require("../../utils/src/Song");
const filters = {
  bassboost: "bass=g=20",
  "8D": "apulsator=hz=0.09",
  vaporwave: "aresample=48000,asetrate=48000*0.8",
  nightcore: "aresample=48000,asetrate=48000*1.25",
  phaser: "aphaser=in_gain=0.4",
  tremolo: "tremolo",
  vibrato: "vibrato=f=6.5",
  reverse: "areverse",
  treble: "treble=g=5",
  normalizer: "dynaudnorm=g=101",
  surrounding: "surround",
  pulsator: "apulsator=hz=1",
  subboost: "asubboost",
  karaoke: "stereotools=mlev=0.03",
  flanger: "flanger",
  gate: "agate",
  haas: "haas",
  mcompand: "mcompand",
  mono: "pan=mono|c0=.5*c0+.5*c1",
  mstlr: "stereotools=mode=ms>lr",
  mstrr: "stereotools=mode=ms>rr",
  compressor: "compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6",
  expander:
    "compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3",
  softlimiter:
    "compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8",
  chorus: "chorus=0.7:0.9:55:0.4:0.25:2",
  chorus2d: "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3",
  chorus3d: "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
  fadein: "afade=t=in:ss=0:d=10",
};
module.exports = {
  name: "bassboost",
  aliases: ["bb", "boobs", "bs"],
  voice: true,
  staff: true,
  d: "Bassboost!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    const queue = message.client.queue.get(message.guild.id);

    const error = (err) =>
      message.channel.send({
        embeds: [new MessageEmbed().setDescription(err).setColor("RED")],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [
          new MessageEmbed().setDescription(content).setColor("DARK_GREEN"),
        ],
      });
    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    const bassboost_level = args[0];
    if (isNaN(bassboost_level))
      return error(`**Please select a bassboost level!**`);

    let currentStreamTime = parseInt(
      queue.player.state.playbackDuration / 1000
    );

    let addtime = parseInt(queue.addTime);
    let totalTime = currentStreamTime + addtime;

    try {
      let song = queue.songs[0];
      if (queue.filters.bassboost == false) {
        _playYTDLStream(song, true);
      } else {
        _playYTDLStream(song);
      }
    } catch (error) {
      deletequeue(message.guild.id);
      console.error(error);
    }

    async function _playYTDLStream(track, bassboost = false) {
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

        queue.connection.on(
          VoiceConnectionStatus.Disconnected,
          async (oldState, newState) => {
            deletequeue(message.guild.id);
          }
        );

        var newStream;

        if (bassboost == true) {
          newStream = await ytdl(track.url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            opusEncoded: true,
            encoderArgs: ["-af", `bass=g=${bassboost_level}`],
            seek: totalTime,
          });
          queue.filters.bassboost = true
        } else {
          newStream = await ytdl(track.url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            opusEncoded: true,
            seek: totalTime,
          });
          queue.filters.bassboost = false
        }

        queue.addTime = parseInt(addtime);
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

        queue.message.channel.send({
          embeds: [
            new MessageEmbed()
              .setDescription(`**I brought the song to ${time} seconds!**`)
              .setColor("GREEN"),
          ],
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
