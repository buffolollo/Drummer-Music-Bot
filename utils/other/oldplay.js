const { EmbedBuilder, Client, Message, Util } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const youtubeScraper = require("yt-search");
const yt = require("ytdl-core");
const forHumans = require("./forhumans");
const play = require("./play");


module.exports = {
  name: "play",
  aliases: ["p"],
  voice: true,
  d: "Riproduci una canzone!",
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
      message.channel.send(
        new EmbedBuilder().setColor("RED").setDescription(err)
      );
    const send = (content) => message.channel.send(content);
    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);
    var queue = message.client.queue.get(message.guild.id);
    var song;
    let newStream;

    if (!channel.permissionsFor(message.client.user).has("CONNECT"))
      return error("Non ho il permesso di entrare nel canale vocale");

    if (!channel.permissionsFor(message.client.user).has("SPEAK"))
      return error("Non ho il permesso di parlare nel canale vocale");

    const vc = message.member.voice.channel;

    if (queue && queue.paused == true && !args.length) {
      queue.connection.dispatcher.resume();
      queue.paused = false;
      send(
        new EmbedBuilder()
          .setDescription("**Canzone ripresa :white_check_mark:**")
          .setColor("YELLOW")
      );
      return;
    }

    const query = args.join(" ");
    if (!query) return error("**Non mi hai dato una canzone da riprodurre!**");

    message.channel.send(`🔎 **Searching** \`${args.join(" ")}\``);

    if (
      query.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)
    ) {
      await ytpl(query).then(async (playlist) => {
        send(`**La playlist: \`${playlist.title}\` è stata aggiunta!**`)
        playlist.items.forEach(async (item) => {
          await videoHandler(
            await ytdl.getInfo(item.shortUrl),
            message,
            vc,
            true
          );
        });
      });
    } else {
      let result = await (await youtubeScraper(query)).videos;
      if (result.length == 0 || !result)
        return error("**Non ho trovato nessun video!**");
      let songInfo = await ytdl.getInfo(result[0].url);
      return videoHandler(songInfo, message, vc);
    }

    async function videoHandler(ytdata, message, vc, playlist = false) {
      let queue = message.client.queue.get(message.guild.id);
      song = {
        name: Util.escapeMarkdown(ytdata.videoDetails.title),
        thumbnail:
          ytdata.player_response.videoDetails.thumbnail.thumbnails[0].url,
        requested: message.author,
        videoId: ytdata.videoDetails.videoId,
        duration: forHumans(ytdata.videoDetails.lengthSeconds),
        durationMS: ytdata.videoDetails.lengthSeconds * 1000,
        url: ytdata.videoDetails.video_url,
        views: ytdata.videoDetails.viewCount,
        author: ytdata.videoDetails.author.name,
      };
      if (!queue) {
        const structure = {
          channel: message.channel,
          vc: channel,
          volume: 100,
          playing: true,
          paused: false,
          loopone: false,
          loopall: false,
          queue: [],
          connection: null,
          stream: null,
          addTime: 0,
        };

        setqueue(message.guild.id, structure);
        structure.queue.push(song);

        try {
          const join = await vc.join();
          structure.connection = join;
          _playYTDLStream(structure.queue[0]);
          //play(structure.queue[0], message);
        } catch (e) {
          console.log(e);
          deletequeue(message.guild.id);
          return error(
            "Non sono riuscito ad entrare, per favore, controlla la console"
          );
        }
      } else {
        queue.songs.push(song);
        if(playlist) return;
        return send(
          new EmbedBuilder()
            .setAuthor(
              "La canzone è stata aggiunta alla coda",
              "https://img.icons8.com/color/2x/cd--v3.gif"
            )
            .setColor("F93CCA")
            .setThumbnail(song.thumbnail)
            .addField("Nome", song.name, false)
            .addField("Visualizzazioni", song.views, false)
            .addField("Durata", song.duration, false)
            .addField("Richiesta da", song.requested.tag, false)
            .setFooter("Positioned " + queue.songs.length + " In the queue")
        );
      }
    }

    return;

    if (query.includes("youtube.com")) {
      try {
        const ytdata = await yt.getBasicInfo(query);
        if (!ytdata)
          return error("**Non ho trovato nessuna canzone con l'URL fornito**");
        song = {
          name: Util.escapeMarkdown(ytdata.videoDetails.title),
          thumbnail:
            ytdata.player_response.videoDetails.thumbnail.thumbnails[0].url,
          requested: message.author,
          videoId: ytdata.videoDetails.videoId,
          duration: forHumans(ytdata.videoDetails.lengthSeconds),
          durationMS: ytdata.videoDetails.lengthSeconds * 1000,
          url: ytdata.videoDetails.video_url,
          views: ytdata.videoDetails.viewCount,
          author: ytdata.videoDetails.author.name,
        };
      } catch (e) {
        console.log(e);
        return error(
          "C'è stato un errore, prova a controllare il link inserito"
        );
      }
    } else {
      try {
        const fetched = await (await youtubeScraper(query)).videos;
        if (fetched.length === 0 || !fetched)
          return error(
            "**Non sono riuscito a trovare la canzone che hai chiesto!**"
          );
        const data = fetched[0];
        let msD = data.seconds * 1000;
        song = {
          name: Util.escapeMarkdown(data.title),
          thumbnail: data.image,
          requested: message.author,
          videoId: data.videoId,
          duration: data.timestamp.toString(),
          durationMS: msD,
          url: data.url,
          views: data.views,
          author: data.author.name,
        };
      } catch (err) {
        console.log(err);
        return error("C'è stato un errore a trovare la canzone");
      }
    }

    channel.join();
    setInterval(() => {
      if (message.guild.me.voice.channel)
        message.member.guild.me.voice.setDeaf(true).catch((err) => {});
    }, 2000);

    var list = message.client.queue.get(message.guild.id);

    if (list) {
      send(
        new EmbedBuilder()
          .setAuthor(
            "La canzone è stata aggiunta alla coda",
            "https://img.icons8.com/color/2x/cd--v3.gif"
          )
          .setColor("F93CCA")
          .setThumbnail(song.thumbnail)
          .addField("Nome", song.name, false)
          .addField("Visualizzazioni", song.views, false)
          .addField("Durata", song.duration, false)
          .addField("Richiesta da", song.requested.tag, false)
          .setFooter("Positioned " + list.queue.length + " In the queue")
      );
      return list.queue.push(song);
    }

    const structure = {
      channel: message.channel,
      vc: channel,
      volume: 100,
      playing: true,
      paused: false,
      loopone: false,
      loopall: false,
      queue: [],
      connection: null,
      stream: null,
      addTime: 0,
    };

    setqueue(message.guild.id, structure);
    structure.queue.push(song);

    try {
      const join = await channel.join();
      structure.connection = join;
      _playYTDLStream(structure.queue[0]);
      //play(structure.queue[0], message);
    } catch (e) {
      console.log(e);
      deletequeue(message.guild.id);
      return error(
        "Non sono riuscito ad entrare, per favore, controlla la console"
      );
    }

    async function _playYTDLStream(track) {
      try {
        const data = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            data.channel.send(
              new EmbedBuilder()
                .setDescription(
                  "**La coda è vuota, non ci sono più canzoni da riprodurre!**"
                )
                .setColor("RED")
            );
            deletequeue(message.guild.id);
            var interval = config.leaveOnEndQueue * 1000;
            setTimeout(() => {
              let queue = message.client.queue.get(message.guild.id);
              if (queue) {
                return;
              } else {
                if (message.guild.me.voice.channel)
                  message.guild.me.voice.channel.leave();
              }
            }, interval);
          } catch (error) {
            return deletequeue(message.guild.id);
          }
          return;
        }
        data.connection.on("disconnect", () => deletequeue(message.guild.id));
        newStream = await ytdl(track.url, {
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
              data.songs.push(data.songs[0]);
              data.songs.shift();
            } else {
              data.songs.shift();
            }
            _playYTDLStream(data.songs[0]);
          });
        dispatcher.setVolumeLogarithmic(data.volume / 100);
        data.channel.send(
          new EmbedBuilder()
            .setAuthor(
              "Ho iniziato a riprodurre",
              "https://img.icons8.com/color/2x/cd--v3.gif"
            )
            .setColor("YELLOW")
            .setThumbnail(track.thumbnail)
            .addField("Nome", track.name, false)
            .addField("Visualizzazioni", track.views, false)
            .addField("Durata", track.duration, false)
            .addField("Richiesta da", track.requested, false)
            .setFooter("Natsuki was here...")
        );
      } catch (e) {
        console.error(e);
      }
    }
  },
};
