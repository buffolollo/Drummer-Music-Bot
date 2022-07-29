const { EmbedBuilder, Client, Message } = require("discord.js");
const send = require("../../utils/src/send");

module.exports = {
  name: "volume",
  aliases: ["vol"],
  voice: true,
  queue: true,
  d: "Change the volume of the song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args) {
    let queue = message.client.queue.get(message.guild.id);

    const query = args[0];
    if (!query) return send(message, `The volume is **${queue.volume}**`);
    let num = parseInt(query);
    if (isNaN(num)) return error(message, `Please enter a valid number!`);

    if (message.author.id != "690637465341526077") {
      if (num < 1) return error(message, "The minimum volume is 1!");
      if (num > 100) return error(message, "The volume limit is 100!");
    }

    queue.resource.volume.setVolumeLogarithmic(num / 100);
    queue.volume = num;

    return send(message, `\`Volume set to:\` **${num}**`);
  },
};
