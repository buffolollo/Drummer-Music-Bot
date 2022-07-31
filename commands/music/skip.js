const { EmbedBuilder, Client, Message } = require("discord.js");
const send = require("../../utils/src/send");

module.exports = {
  //^<>&
  name: "skip",
  aliases: [],
  voice: true,
  queue: true,
  d: "Skip the song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args, q) {
    let queue = message.client.queue.get(message.guild.id);
    send(message, "**Song skipped :white_check_mark: **");
    return queue.player.stop();
  },
};
