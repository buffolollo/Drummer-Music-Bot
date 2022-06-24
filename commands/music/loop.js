const { MessageEmbed, Client, Message } = require("discord.js");

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
  async execute(client, message, args) {
    const channel = message.member.voice.channel;
    
    const send = (content) =>
      message.channel.send({
        embeds: [new MessageEmbed().setColor("GREEN").setDescription(content)],
      });

    const disa = (content) =>
      message.channel.send({
        embeds: [new MessageEmbed().setColor("RED").setDescription(content)],
      });

    let queue = message.client.queue.get(message.guild.id);
    switch (args[0]) {
      case "all":
        queue.loopall = !queue.loopall;
        queue.loopone = false;
        if (queue.loopall == true) {
          send("**The queue loop has been activated!**");
        } else {
          disa("**The queue loop has been disabled!**");
        }
        break;
      case "one":
        queue.loopone = !queue.loopone;
        queue.loopall = false;
        if (queue.loopone == true) {
          send("**The song loop has been activated!**");
        } else {
          disa("**The song loop has been turned off!**");
        }
        break;
      case "off":
        queue.loopall = false;
        queue.loopone = false;
        disa("**The loop has been disabled!**");
        break;
      default:
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription("Pefavore specifica il tipo di loop che vuoi")
              .addField(`one`, `Per attivare il loop della singola canzone`)
              .addField(`all`, `Per attivare il loop di tutta la coda`)
              .addField(`off`, `Per disattivare il loop corrente`),
          ],
        });
    }
  },
};
