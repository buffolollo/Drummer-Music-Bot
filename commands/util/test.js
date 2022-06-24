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
  name: "PPAJDHCHCOOOOHSDFUSHCUSHCUSHCPOIOAJSODUWWOIC3254654",
  aliases: [],
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
  async execute(ytdata, message, vc, playlist = false, channel) {
    let send = (content) => message.channel.send(content);
    let setqueue = (id, obj) => message.client.queue.set(id, obj);
    let deletequeue = (id) => message.client.queue.delete(id);

    const queue = message.client.queue.get(message.guild.id);
    song = Song(ytdata, message);
    if (!queue) {
      let structure = await Queue(message, channel, setqueue, song);
      try {
        let c = message.member.voice.channel;
        let join = await c.join();
        structure.connection = join;
        _playYTDLStream(structure.songs[0]);
      } catch (e) {
        console.log(e);
        deletequeue(message.guild.id);
      }
    } else {
      if (playlist) addSongToQueue(ytdata, message, send, true);
      else addSongToQueue(ytdata, message, send);
    }

    async function _playYTDLStream(track) {
      try {
        let data = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            data.channel.send(
              new MessageEmbed()
                .setDescription(
                  "**La coda è vuota, non ci sono più canzoni da riprodurre!**"
                )
                .setColor("RED")
            );
            deletequeue(message.guild.id);
            var interval = config.leaveOnEndQueue * 1000;
            setTimeout(() => {
              let queue = message.client.queue.get(message.guild.id);
              if (queue) return;
              if (message.guild.me.voice.channel)
                message.guild.me.voice.channel.leave();
            }, interval);
          } catch (error) {
            return deletequeue(message.guild.id);
          }
          return;
        }
        data.connection.on("disconnect", () => {
          deletequeue(message.guild.id);
        });
        let newStream = await ytdl(track.url, {
          filter: "audioonly",
          quality: "highestaudio",
          highWaterMark: 1 << 25,
          opusEncoded: true,
        });
        data.stream = newStream;
        let dispatcher = data.connection
          .play(newStream, { bitrate: "auto", type: "opus" })
          .on("finish", () => {
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
        dispatcher.setVolumeLogarithmic(data.volume / 100);
        data.channel.send(`**Playing** 🎶 \`${track.name}\` - Now!`);
      } catch (e) {
        console.error(e);
      }
    }
  },
};
