const { EmbedBuilder, Message, Client } = require("discord.js");

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
  execute(client, message, args) {
    const channel = message.member.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    if (queue.songs.length < 2)
      return error(message, "There's only the song I'm playing!");

    let num = parseInt(args[0]);
    if (isNaN(num)) return error(message, "Please enter a valid number!");

    if (num == 0) return error(message, "**You cannot enter the number 0!**");

    if (!queue.songs[num])
      return error(message, "I didn't find the song number in the queue!");

    send(message, `**Song removed: \`${queue.songs[num].name}\`!**`);

    let q = queue.songs;
    let index = num;
    q.splice(index, 1);
  },
};
