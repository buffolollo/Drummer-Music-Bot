const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  voice: true,
  queue: true,
  d: "Visualizza la coda del server!",
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    if(queue.songs.length < 2) return message.channel.send(new EmbedBuilder()
    .setDescription("Non c'è nessuna coda dopo questa canzone")
    .setColor("YELLOW"));

    var np = queue.songs[0]
    var thumbnail = queue.songs[0].thumbnail;

    var sus;
    var cuc = 0;
    sus = queue.songs
      .filter((x) => x != queue.songs[0])
      .map((x) => {
        cuc += 1;
        return (
          "• " +
          "`" +
          cuc +
          "." +
          "`" +
          `[${x.name}](${x.url})` +
          " `-Requested by` " +
          `<@${x.requested.id}>`
        );
      })
      .join("\n");

      return message.channel.send(new EmbedBuilder()
      .setAuthor(
          "Coda",
          "https://img.icons8.com/color/2x/rhombus-loader.gif"
      )
      .setThumbnail(thumbnail)
      .setColor("YELLOW")
      .setDescription(`Now playing:\n[${np.name}](${np.url})\n\nCoda:\n${sus}`)
  )
  },
};
