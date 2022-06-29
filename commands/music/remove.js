const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = {
  name: "remove",
  aliases: ["rm"],
  voice: true,
  queue: true,
  d: "Remove a song from the queue!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    const error = (content) =>
      message.channel.send({
        embeds: [
          new MessageEmbed().setDescription(`**${content}**`).setColor("RED"),
        ],
      });

    let queue = message.client.queue.get(message.guild.id);

    if (queue.songs.length < 2)
      return error("There's only the song I'm playing!");

    let num = parseInt(args[0]);
    if (isNaN(num)) return error("Please enter a valid number!");

    if (num == 0) return error("**You cannot enter the number 0!**");

    if (!queue.songs[num])
      return error("I didn't find the song number in the queue!");

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(`**Song removed: \`${queue.songs[num].name}\`!**`)
          .setColor("GREEN"),
      ],
    });

    let q = queue.songs;
    let index = num;
    q.splice(index, 1);
  },
};
