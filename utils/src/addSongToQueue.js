const { Util, EmbedBuilder } = require("discord.js");
const forHumans = require("./forhumans");
const Song = require("./Song");

async function addSongs(ytdata, message, playlist = false) {
  let queue = message.client.queue.get(message.guild.id);
  const song = await Song(ytdata, message);

  queue.songs.push(song);
  if (playlist) return;
  let n = parseInt(queue.songs.length);
  return message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setAuthor({
          name: "The song was added to the queue",
          iconURL: "https://img.icons8.com/color/2x/cd--v3.gif",
        })
        .setColor(0x006400)
        .setThumbnail(song.thumbnail)
        .addFields([
          {
            name: "Name",
            value: song.name,
            inline: false,
          },
          {
            name: "Visual",
            value: song.views,
            inline: false,
          },
          {
            name: "Length",
            value: song.duration,
            inline: false,
          },
          {
            name: "Requested by",
            value: song.requested.tag,
            inline: false,
          },
        ])
        .setFooter({ text: "Positioned " + (n - 1) + " In the queue" }),
    ],
  });
}

module.exports = addSongs;
