const { MessageEmbed, Client, Message, Util } = require("discord.js");
const {
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");
let ytdl = require("discord-ytdl-core");
let yt = require("ytdl-core");
let forHumans = require("../../utils/src/forhumans");
let spotify = require("spotify-url-info");
const searcher = require("youtube-sr").default;
const spotifyPlaylist = require("../../utils/handler/spotifyPlaylist");
const youtubeVideo =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const youtubePlaylist =
  /^https?:\/\/(www.)?youtube.com\/playlist\?list=((PL|UU|LL|RD|OL)[a-zA-Z0-9-_]{16,41})$/;
const spotifyPlaylistRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifySongRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const DiscordRegex =
  /https:\/\/cdn.discordapp.com\/attachments\/(\d{17,19})\/(\d{17,19})\/(.+)/;
const resume = require("./resume");
const pause = require("./pause");
const addSongToQueue = require("../../utils/src/addSongToQueue");
const Queue = require("../../utils/src/Queue");
const Song = require("../../utils/src/Song");
const play = require("../util/test");

module.exports = {
  name: "play",
  aliases: ["p"],
  voice: true,
  d: "Play a song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    let channel = message.member.voice.channel;

    let error = (err) =>
      message.channel.send({
        embeds: [new MessageEmbed().setColor("RED").setDescription(err)],
      });

    let send = (content) => message.channel.send(content);

    let setqueue = (id, obj) => message.client.queue.set(id, obj);
    let deletequeue = (id) => message.client.queue.delete(id);
    var queue = message.client.queue.get(message.guild.id);
    var song;

    if (!channel.permissionsFor(message.client.user).has("CONNECT"))
      return error("I am not allowed to join the voice channel");

    if (!channel.permissionsFor(message.client.user).has("SPEAK"))
      return error("I am not allowed to speak on the voice channel");

    if (
      queue &&
      (queue.paused == true || queue.paused == false) &&
      !args.length
    ) {
      if (queue.paused == true) {
        resume.execute(client, message, args);
      } else {
        pause.execute(client, message, args);
      }
      return;
    }

    let query = args.join(" ");
    if (!query) return error("**You didn't give me a song to play!**");

    if (!message.guild.me.voice.channel) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      message.channel.send({
        content: `**👍 Joined** \`${channel.name}\``,
      });
    }

    message.channel.send({
      content: `🔎 **Searching** \`${args.join(" ")}\``,
    });

    setInterval(() => {
      if (message.guild.me.voice.channel)
        message.member.guild.me.voice.setDeaf(true).catch((err) => {});
    }, 2000);

    let vc = message.member.voice.channel;

    if (searcher.validate(query, "PLAYLIST_ID")) {
      const playlist = searcher.getPlaylist(query);
      var a = 0;
      playlist
        .then((playlist) => playlist.fetch())
        .then(async (playlist) => {
          message.channel.send({
            content: `🔍🎶 **Sto aggiungendo la playlist** \`${playlist.title} | ${playlist.videos.length}\` Un attimo...`,
          });
          playlist.videos.forEach(async (video) => {
            await videoHandler(
              await ytdl.getInfo(video.url),
              message,
              vc,
              true
            );
          });
        });
    }

    if (searcher.validate(query, "VIDEO")) {
      let songInfo = await yt.getInfo(query);
      if (!songInfo)
        return error("**Non ho trovato nessuna canzone con l'URL fornito**");
      return videoHandler(songInfo, message, vc);
    }

    if (query.match(spotifySongRegex)) {
      let data = await spotify.getPreview(query);
      let result = await searcher.search(`${data.title} ${data.artist}`, {
        type: "video",
        limit: 1,
      });
      if (result.length < 1 || !result)
        return error("**Non ho trovato nessun video!**");
      let songInfo = await ytdl.getInfo(result[0].url);
      return await videoHandler(songInfo, message, vc);
    }

    if (query.match(spotifyPlaylistRegex)) {
      let playlist = await spotify.getData(query);
      message.channel.send({
        content: `🔍🎶 **Sto aggiungendo la playlist** \`${playlist.name}\` Potrebbe volerci un po...`,
      });
      let name = playlist.name;
      let s = 0;
      let interrupt = 0;
      for (let i = 0; i < playlist.tracks.items.length; i++) {
        if (!message.guild.me.voice.channel) {
          interrupt = 1;
          break;
        }
        let query = `${playlist.tracks.items[i].track.name} - ${playlist.tracks.items[i].track.artists[0].name}`;
        const result = await searcher
          .search(query, { type: "video", limit: 1 })
          .catch((err) => {});
        if (result.length < 1 || !result) {
          s++; // could be used later for skipped tracks due to result not being found //tipo per quanti errori
          continue;
        }
        if (!message.guild.me.voice.channel) {
          interrupt = 1;
          break;
        }
        await videoHandler(
          await ytdl.getInfo(result[0].url),
          message,
          vc,
          true
        );
      }

      if ((interrupt = 0)) {
        return send({
          content: `**Spotify playlist: \`${spotify.name}\` has been added! | Songs: \`${tracks.length}\`**`,
        });
      }
    }

    // if (query.match(spotifyPlaylistRegex)) {
    //   const spotify = await spotifyPlaylist(message, query);
    //   let tracks = spotify.tracks;
    //   let u = 0;
    //   for (let i = 0; i < tracks.length; i++) {
    //     if (message.guild.me.voice.channel) {
    //       await videoHandler(
    //         await ytdl.getInfo(tracks[i].url),
    //         message,
    //         vc,
    //         true
    //       );
    //     } else {
    //       u = 1;
    //       break;
    //     }
    //   }
    //   // tracks.forEach(async (track) => {
    //   //   await videoHandler(await ytdl.getInfo(track.url), message, vc, true);
    //   // });
    //   if ((u = 1)) return;
    //   return send({
    //     content: `**Spotify playlist: \`${spotify.name}\` has been added! | Songs: \`${tracks.length}\`**`,
    //   });
    // }

    let result = await searcher.search(query, { type: "video", limit: 1 });
    if (result.length < 1 || !result)
      return error("**Non ho trovato nessun video!**");
    let songInfo = await ytdl.getInfo(result[0].url);
    return videoHandler(songInfo, message, vc);

    //VIDEOHANDLER FOR SONGS

    async function videoHandler(ytdata, message, vc, playlist = false) {
      let queue = message.client.queue.get(message.guild.id);
      song = Song(ytdata, message);
      if (!queue) {
        let structure = await Queue(message, channel, setqueue, song);
        try {
          let channel = message.member.voice.channel;
          let connection = await joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
          });
          structure.connection = connection;
          _playYTDLStream(structure.songs[0]);
        } catch (e) {
          console.log(e);
          deletequeue(message.guild.id);
        }
      } else {
        if (playlist) addSongToQueue(ytdata, message, send, true);
        else addSongToQueue(ytdata, message, send);
      }
    }

    //PLAY THE YOUTUBESTREAM

    async function _playYTDLStream(track) {
      try {
        let data = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            data.message.channel.send({
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
        data.connection.on(
          VoiceConnectionStatus.Disconnected,
          async (oldState, newState) => {
            deletequeue(message.guild.id);
          }
        );
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

        // data.resource.volume.setVolume(data.volume / 100);
        data.message.channel.send({
          content: `**Playing** 🎶 \`${track.name}\` - Now!`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
