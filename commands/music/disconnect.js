const { EmbedBuilder, Client, Message } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "disconnect",
  aliases: ["dis", "leave"],
  voice: true,
  d: "Disconnect the bot!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args) {
    const clientVc = message.guild.members.me.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    if (!message.guild.members.me.voice.channel) {
      return send(message, "I am already logged out!");
    }

    if (queue) {
      queue.player.stop();
      message.client.queue.delete(message.guild.id);
    }
    const connection = getVoiceConnection(clientVc.guild.id);
    connection.disconnect();
    // try {
    //   queue.connection.disconnect();
    // } catch (error) {}
    // const connection = getVoiceConnection(clientVc.guild.id);
    // try {
    //   connection.disconnect();
    // } catch (error) {}
    send(message, "📭 **I have disconnected!**");
  },
};
