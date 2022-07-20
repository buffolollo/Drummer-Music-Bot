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
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
const ytpl = require("ytpl");
const spotifyPlaylistRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifySongRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const resume = require("./resume");
const pause = require("./pause");
const addSongToQueue = require("../../utils/src/addSongToQueue");
const Queue = require("../../utils/src/Queue");
const Song = require("../../utils/src/Song");

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
      var a = 0;
      var interrupt = 0;
      const playlist = await ytpl(query);
      message.channel.send({
        content: `🔍🎶 **I'm adding the playlist** \`${playlist.title}. Songs: ${playlist.items.length}\` One moment...`,
      });
      for (let i = 0; i < playlist.items.length; i++) {
        if (!message.guild.me.voice.channel) {
          interrupt = 1;
          break;
        }
        await videoHandler(
          await yt.getInfo(playlist.items[i].shortUrl),
          message,
          vc,
          true
        );
        a++;
      }
      if (interrupt == 0) {
        return send({
          content: `**Youtube playlist: \`${playlist.title}\` has been added! | Songs: \`${a}\`**`,
        });
      }
      return;
    }

    if (searcher.validate(query, "VIDEO")) {
      let songInfo = await yt.getInfo(query);
      if (!songInfo)
        return error("**I couldn't find any songs with the provided URL**");
      return await videoHandler(songInfo, message, vc);
    }

    if (query.match(spotifySongRegex)) {
      const data = await spotify.getPreview(query);
      const result = await searcher.search(`${data.title} ${data.artist}`, {
        type: "video",
        limit: 1,
      });
      if (result.length < 1 || !result)
        return error("**I have not found any video!**");
      const songInfo = await yt.getInfo(result[0].url);
      return await videoHandler(songInfo, message, vc);
    }

    if (query.match(spotifyPlaylistRegex)) {
      const playlist = await spotify.getTracks(query);
      const data = await spotify.getData(query);
      message.channel.send({
        content: `🔍🎶 **I'm adding the playlist** \`${data.name}\` It may take a while...`,
      });
      var ForLoop = 0;
      var noResult = 0;
      var interrupt = 0;
      for (let i = 0; i < playlist.length; i++) {
        if (!message.guild.me.voice.channel) {
          interrupt = 1;
          break;
        }
        const query = `${playlist[i].name} ${playlist[i].artists[0].name}`;
        const result = await searcher
          .search(query, { type: "video", limit: 1 })
          .catch((err) => {});
        if (result.length < 1 || !result) {
          noResult++; // could be used later for skipped tracks due to result not being found //tipo per quanti errori
          continue;
        }
        await videoHandler(await yt.getInfo(result[0].url), message, vc, true);
        ForLoop++;
      }

      const playlistLength = ForLoop - noResult;

      if (interrupt == 0) {
        return send({
          content: `**Spotify playlist: \`${data.name}\` has been added! | Songs: \`${playlistLength}\`**`,
        });
      }
      return;
    }

    {
      let result = await searcher.search(query, { type: "video", limit: 1 });
      if (result.length < 1 || !result)
        return error("**I have not found any video!**");
      let songInfo = await yt.getInfo(result[0].url);
      return await videoHandler(songInfo, message, vc);
    }

    //VIDEOHANDLER FOR SONGS

    async function videoHandler(ytdata, message, vc, playlist = false) {
      let queue = message.client.queue.get(message.guild.id);
      const song = await Song(ytdata, message);
      if (!queue) {
        let structure = await Queue(message, channel, setqueue, song);
        try {
          if (
            !message.guild.me.voice.channel ||
            !message.client.queue.get(message.guild.id)
          ) {
            return deletequeue(message.guild.id);
          }
          let channel = message.member.voice.channel;
          let connection = await joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
          });
          structure.connection = connection;
          if (
            !message.guild.me.voice.channel ||
            !message.client.queue.get(message.guild.id)
          ) {
            getVoiceConnection(message.guild.id).destroy();
            return deletequeue(message.guild.id);
          }
          _playYTDLStream(structure.songs[0]);
        } catch (e) {
          console.log(e);
          deletequeue(message.guild.id);
        }
      } else {
        if (
          !message.guild.me.voice.channel ||
          !message.client.queue.get(message.guild.id)
        ) {
          message.client.queue.get(message.guild.id).connection.destroy();
          return deletequeue(message.guild.id);
        }
        if (playlist) addSongToQueue(ytdata, message, send, true);
        else addSongToQueue(ytdata, message, send);
      }
    }

    //PLAY THE YOUTUBE_STREAM

    async function _playYTDLStream(track) {
      try {
        let data = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            deletequeue(message.guild.id);
            data.message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    "**The queue is empty, there are no more songs to play!**"
                  )
                  .setColor("RED"),
              ],
            });
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

        if (
          !message.guild.me.voice.channel ||
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
          !message.guild.me.voice.channel ||
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

        data.message.channel.send({
          content: `**Playing** 🎶 \`${track.name}\` - Now!`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
