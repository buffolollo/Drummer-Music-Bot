const ytdl = require("discord-ytdl-core");
const { EmbedBuilder } = require("discord.js")

async function play(track, message) {
  const deletequeue = (id) => message.client.queue.delete(id);
  try {
    const data = message.client.queue.get(message.guild.id);
    if (!track) {
      try {
        data.channel.send(
          new EmbedBuilder()
            .setDescription(
              "La coda è vuota, non ci sono più canzoni da riprodurre :x:"
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
    const source = await ytdl(track.url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      opusEncoded: true,
    });
    const player = data.connection
      .play(source, { bitrate: "auto", type: "opus" })
      .on("finish", () => {
        var removed = data.songs.shift();
        if (data.loop == true) {
          data.songs.push(removed);
        }
        play(data.songs[0]);
      });
    player.setVolumeLogarithmic(data.volume / 100);
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

module.exports = play;