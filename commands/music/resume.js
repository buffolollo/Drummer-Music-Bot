const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: [],
  voice: true,
  queue: true,
  d: "Resume the song!",
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    if (queue.paused == false)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(":x: This song is already playing.")
            .setColor("GREEN"),
        ],
      });
    queue.player.unpause();
    queue.paused = false;
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription("**Song resumed :white_check_mark:**")
          .setColor("GREEN"),
      ],
    });
  },
};
