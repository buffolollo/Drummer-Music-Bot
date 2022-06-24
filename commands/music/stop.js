const { MessageEmbed, Client, Message } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { get } = require("quick.db");

module.exports = {
  name: "stop",
  aliases: ["end"],
  voice: true,
  queue: true,
  d: "Stop music and clear queue!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;
    const clientVc = message.guild.me.voice.channel

    let queue = message.client.queue.get(message.guild.id);

    queue.player.stop();
    message.client.queue.delete(message.guild.id);

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription("**Music stopped :white_check_mark: **")
          .setColor("YELLOW"),
      ],
    });

    var interval = config.leaveOnStop * 1000;

    setTimeout(() => {
      let queue = message.client.queue.get(message.guild.id);
      if (queue) {
        return;
      } else {
        if (message.guild.me.voice.channel){
          const connection = getVoiceConnection(clientVc.guild.id)
          connection.disconnect()
        }
      }
    }, interval);
  },
};
