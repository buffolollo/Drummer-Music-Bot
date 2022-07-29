const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "clearconsole",
  aliases: ["cc", "ccc", "cls", "cl"],
  staff: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    console.clear();
    console.log(`Ayo, back in track baby`);
    console.log(`Logged in as ${client.user.tag}`);
    message.channel.send(`**Fatto!**`);
    message.react("✅");
  },
};
