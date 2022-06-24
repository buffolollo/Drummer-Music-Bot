const { MessageEmbed, Client, Message } = require("discord.js");

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
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    const error = (err) =>
      message.channel.send({
        embeds: [
          new MessageEmbed().setColor("RED").setDescription(`**${err}**`),
        ],
      });

      const send = (err) =>
      message.channel.send({
        embeds: [
          new MessageEmbed().setColor("DARK_GREEN").setDescription(`**${err}**`),
        ],
      });

    let queue = message.client.queue.get(message.guild.id);

    const query = args[0]
    if(!query) return send(`The volume is ${queue.volume}`)
    let num = parseInt(query);
    if (isNaN(num)) return error(`Please enter a valid number!`);

    if (message.author.id != "690637465341526077") {
      if (num < 1) return error("The minimum volume is 1!");
      if (num > 100) return error("The volume limit is 100!");
    }

    queue.resource.volume.setVolumeLogarithmic(num / 100);
    queue.volume = num;

    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(`\`Volume set to:\` **${num}**`)
          .setColor("GREEN"),
      ],
    });
  },
};
