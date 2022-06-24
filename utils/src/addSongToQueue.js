const { Util, MessageEmbed } = require("discord.js");
const forHumans = require("./forhumans");
const Song = require("./Song");
var song;

async function addSongs(ytdata, message, send, playlist = false) {
  let queue = message.client.queue.get(message.guild.id);
  song = Song(ytdata, message);

  queue.songs.push(song);
  if (playlist) return;
  let n = parseInt(queue.songs.length);
  return send({
    embeds: [
      new MessageEmbed()
        .setAuthor({
          name: "La canzone è stata aggiunta alla coda",
          iconURL: "https://img.icons8.com/color/2x/cd--v3.gif",
        })
        .setColor("GREEN")
        .setThumbnail(song.thumbnail)
        .addField("Nome", song.name, false)
        .addField("Visualizzazioni", song.views, false)
        .addField("Durata", song.duration, false)
        .addField("Richiesta da", song.requested.tag, false)
        .setFooter({ text: "Positioned " + (n - 1) + " In the queue" }),
    ],
  });
}

module.exports = addSongs;
