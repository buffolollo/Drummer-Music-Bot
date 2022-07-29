const { Client, Message, EmbedBuilder } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  d: "Get lyrics of a song",
  voice: true,
  queue: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    let queue = message.client.queue.get(message.guild.id);

    let pages = [];
    let current = 0;

    let query = queue.songs[0].name;
    query = query.replace(
      /lyrics|lyric|lyrical|video|official music video|\(official music video\)|\(video\)|\(video official\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi,
      ""
    );

    let res = await lyricsFinder(query);

    if (!res) {
      return message.channel.send({
        content: `**No lyrics found for -** \`${query}\``,
      });
    }

    for (let i = 0; i < res.length; i += 2048) {
      let lyrics = res.substring(i, Math.min(res.length, i + 2048));
      let page = new EmbedBuilder()
        .setTitle(`${queue.songs[0].title}`)
        .setDescription(lyrics)
        .setColor(0x006400)
        .setTimestamp()
        .setThumbnail(queue.songs[0].thumbnail);
      pages.push(page);
    }

    const filter = (reaction, user) =>
      ["⬅️", "➡️"].includes(reaction.emoji.name) &&
      message.author.id == user.id;
    const Embed = await message.channel.send({
      content: `Page ${current + 1}/${pages.length}`,
      embeds: [pages[current]],
    });
    if (pages.length > 1) {
      await Embed.react("⬅️");
      await Embed.react("➡️");

      let ReactionCol = Embed.createReactionCollector({ filter });

      ReactionCol.on("collect", (reaction, user) => {
        if (reaction.emoji.name == "➡️") {
          if (current < pages.length - 1) {
            current += 1;
            Embed.edit({
              content: `Page ${current + 1}/${pages.length}`,
              embeds: [pages[current]],
            });
          }
        } else {
          if (reaction.emoji.name == "⬅️") {
            if (current != 0) {
              current -= 1;
              Embed.edit({
                content: `Page ${current + 1}/${pages.length}`,
                embeds: [pages[current]],
              });
            }
          }
        }
      });
    }
  },
};
