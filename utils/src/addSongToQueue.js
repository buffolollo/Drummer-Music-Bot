const { Util, MessageEmbed } = require("discord.js");
const forHumans = require("./forhumans");
const Song = require("./Song");

async function addSongs(ytdata, message, send, playlist = false) {
  let queue = message.client.queue.get(message.guild.id);
  const song = await Song(ytdata, message);

  queue.songs.push(song);
  if (playlist) return;
  let n = parseInt(queue.songs.length);
  return send({
    embeds: [
      new MessageEmbed()
        .setAuthor({
          name: "The song was added to the queue",
          iconURL: "https://img.icons8.com/color/2x/cd--v3.gif",
        })
        .setColor("GREEN")
        .setThumbnail(song.thumbnail)
        .addField("Name", song.name, false)
        .addField("Visuals", song.views, false)
        .addField("Lenght", song.duration, false)
        .addField("Requested by", song.requested.tag, false)
        .setFooter({ text: "Positioned " + (n - 1) + " In the queue" }),
    ],
  });
}

module.exports = addSongs;
