const { MessageEmbed, Client, Message } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "disconnect",
  aliases: ["dis"],
  voice: true,
  d: "Disconnect the bot!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;
    const clientVc = message.guild.me.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    if (!message.guild.me.voice.channel) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription("I am already logged out!")
            .setColor("RED"),
        ],
      });
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
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription("📭 **I have disconnected!**")
          .setColor("GREEN"),
      ],
    });
  },
};
