const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  d: "Queue of the server",
  voice: true,
  queue: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    const queue = message.client.queue.get(message.guild.id);

    if (queue.songs.length < 2)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription("Non c'è nessuna coda dopo questa canzone")
            .setColor("YELLOW"),
        ],
      });

    let currentPage = 0;
    const embeds = embedGeneraor(queue);

    const queueEmbed = await message.channel.send({
      content: `Songs: ${queue.songs.length - 1}\nQueue page: ${
        currentPage + 1
      }/${embeds.length}`,
      embeds: [embeds[currentPage]],
    });
    if (queue.songs.length > 11) {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("➡️");
    }
    const reactionFilter = (reaction, user) =>
      ["⬅️", "➡️"].includes(reaction.emoji.name) &&
      message.author.id == user.id;
    const collector = queueEmbed.createReactionCollector(reactionFilter);
    collector.on("collect", (reaction, user) => {
      let queue = message.client.queue.get(message.guild.id);
      if (!queue) return collector.stop();
      if (reaction.emoji.name == "➡️") {
        if (currentPage < embeds.length - 1) {
          currentPage += 1;
          queueEmbed.edit({
            content: `Songs: ${queue.songs.length - 1}\nQueue page: ${
              currentPage + 1
            }/${embeds.length}`,
            embeds: [embeds[currentPage]],
          });
          reaction.users.remove(user);
        }
      }
      if (reaction.emoji.name == "⬅️") {
        if (currentPage != 0) {
          currentPage -= 1;
          queueEmbed.edit({
            content: `Songs: ${queue.songs.length - 1}\nQueue page: ${
              currentPage + 1
            }/${embeds.length}`,
            embeds: [embeds[currentPage]],
          });
          reaction.users.remove(user);
        }
      }
    });
  },
};

function embedGeneraor(queue) {
  const embeds = [];
  let thumbnail = queue.songs[0].thumbnail;
  let np = queue.songs[0];
  let songs = 11;
  for (let i = 1; i < queue.songs.length; i += 10) {
    const current = queue.songs.slice(i, songs);
    songs += 10;
    let j = i;
    process.setMaxListeners(0);
    let info = current
      .map((song) => `${j++}. [${song.name}](${song.url})`)
      .join("\n");
    const msg = new MessageEmbed()
      .setAuthor({
        name: "Coda",
        url: "https://img.icons8.com/color/2x/rhombus-loader.gif",
      })
      .setThumbnail(thumbnail)
      .setColor("YELLOW")
      .setDescription(
        `Now playing:\n[${np.name}](${np.url})\n\nCoda:\n${info}`
      );
    embeds.push(msg);
  }
  return embeds;
}
