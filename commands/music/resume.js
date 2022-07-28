const { EmbedBuilder } = require("discord.js");
const send = require("../../utils/src/send");

module.exports = {
  name: "resume",
  aliases: [],
  voice: true,
  queue: true,
  d: "Resume the song!",
  execute(client, message, args) {
    const channel = message.member.voice.channel;

    let queue = message.client.queue.get(message.guild.id);

    if (queue.paused == false)
      return send(message, ":x: This song is already playing.");
    queue.player.unpause();
    queue.paused = false;
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription("**Song resumed :white_check_mark:**")
          .setColor(0x006400),
      ],
    });
  },
};
