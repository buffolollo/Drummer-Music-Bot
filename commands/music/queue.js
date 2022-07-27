const { Client, Message, EmbedBuilder } = require("discord.js");

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
  async execute(client, message, args, q) {
    const queue = q.get(message.guild.id);

    if (queue.songs.length < 2)
      return error(message, "There is no queue after this song");

    let currentPage = 0;
    const embeds = embedGeneraor(queue);

    if (queue.songs.length < 12) {
      return message.channel.send({
        content: `Songs: ${queue.songs.length - 1}`,
        embeds: [embeds[currentPage]],
      });
    }

    const queueEmbed = await message.channel.send({
      content: `Songs: ${queue.songs.length - 1}\nQueue page: ${
        currentPage + 1
      }/${embeds.length}`,
      embeds: [embeds[currentPage]],
    });
    if (queue.songs.length > 11) {
      queueEmbed.react("⬅️");
      queueEmbed.react("➡️");
    }
    const reactionFilter = (reaction, user) =>
      ["⬅️", "➡️"].includes(reaction.emoji.name) &&
      message.author.id == user.id;
    const collector = queueEmbed.createReactionCollector(reactionFilter);
    collector.on("collect", (reaction, user) => {
      let queue = reaction.client.queue.get(reaction.message.guild.id);
      if (!queue) return collector.stop();
      if (reaction.emoji.name == "➡️") {
        if (user.bot) return;
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
        if (user.bot) return;
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
    let info = current
      .map((song) => `${j++}. [${song.name}](${song.url})`)
      .join("\n");
    const msg = new EmbedBuilder()
      .setAuthor({
        name: "Queue",
        url: "https://img.icons8.com/color/2x/rhombus-loader.gif",
      })
      .setThumbnail(thumbnail)
      .setColor(0x006400)
      .setDescription(
        `Now playing:\n[${np.name}](${np.url})\n\nCoda:\n${info}`
      );
    embeds.push(msg);
  }
  return embeds;
}
