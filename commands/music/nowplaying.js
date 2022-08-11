const { EmbedBuilder, Client, Message } = require("discord.js");
async function getTime(query) {
  var date = new Date(0);
  date.setSeconds(query); // specify value for SECONDS here
  var timeString = date.toISOString().substr(11, 8);
  return timeString;
}
function getPBar(totSec, query) {
  let thick = Math.floor(query / 5);
  let thin = Math.ceil((totSec - query) / 10) * 2;
  let str = "_[_";

  for (let i = 0; i < thick; i++) str += "▰";
  for (let i = 0; i < thin; i++) str += "▱";

  str += "_]_";

  return str;
}

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  voice: true,
  queue: true,
  d: "Nowplaying song info",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args, q) {
    const queue = q.get(message.guild.id);

    let currentStreamTime = parseInt(
      queue.player.state.playbackDuration / 1000
    );

    let addtime = parseInt(queue.addTime);
    let time = currentStreamTime + addtime;
    const song = queue.songs[0];
    let thumbnail = queue.songs[0].thumbnail;
    let timeLine = await getTime(parseInt(song.durationMS / 1000));
    let streamTime = await getTime(parseInt(time));
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: "Now playing",
            iconURL: "https://img.icons8.com/color/2x/rhombus-loader.gif",
          })
          .setThumbnail(thumbnail)
          .setColor(0x006400)
          .addFields([
            {
              name: "Name",
              value: `[${song.name}](${song.url})`,
            },
            {
              name: "Artist",
              value: `${song.author}`,
            },
            {
              name: "Views",
              value: `${song.views}`,
            },
            {
              name: "Requested by",
              value: `${song.requested}`,
            },
            {
              name: "Time",
              value: `(${streamTime} | ${time})  / (${timeLine} | ${
                song.durationMS / 1000
              } seconds)`,
            },
            {
              name: "Progress Bar",
              value: getPBar(song.durationMS / 1000, time),
            },
          ]),
        //.setDescription(`[${name}](${song.url})`)
      ],
    });
  },
};
