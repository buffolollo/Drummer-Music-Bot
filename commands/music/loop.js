const { EmbedBuilder, Client, Message } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["lp"],
  voice: true,
  queue: true,
  d: "Activate loop!",
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
    switch (args[0]) {
      case "all":
        queue.loopall = !queue.loopall;
        queue.loopone = false;
        if (queue.loopall == true) {
          send(message, "**The queue loop has been activated!**");
        } else {
          error(message, "**The queue loop has been disabled!**");
        }
        break;
      case "one":
        queue.loopone = !queue.loopone;
        queue.loopall = false;
        if (queue.loopone == true) {
          send(message, "**The song loop has been activated!**");
        } else {
          error(message, "**The song loop has been turned off!**");
        }
        break;
      case "off":
        queue.loopall = false;
        queue.loopone = false;
        error(message, "**The loop has been disabled!**");
        break;
      default:
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("Pefavore specifica il tipo di loop che vuoi")
              .setColor(0x006400)
              .addFields([
                {
                  name: "one",
                  value: "Per attivare il loop della singola canzone",
                },
                {
                  name: "all",
                  value: "Per attivare il loop di tutta la coda",
                },
                {
                  name: "off",
                  value: "Per disattivare il loop corrente",
                },
              ]),
          ],
        });
    }
  },
};
