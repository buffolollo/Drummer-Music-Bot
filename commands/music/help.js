const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["commands"],
  d: "View this message",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    const error = (err) =>
      message.channel.send(
        new MessageEmbed().setColor("RED").setDescription(err)
      );

    const send = (content) =>
      message.channel.send(
        new MessageEmbed().setDescription(content).setColor("GREEN")
      );

    const { commands } = message.client;
    let help = commands
      .filter((cmd) => !cmd.staff)
      .map((cmd) => `\`${cmd.name}\`: ${cmd.d}`)
      .join("\n");
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${client.user.tag.toString()}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            "These are my available commands!\n" +
              "Example of use: `!<nameCommand>`, !play\n\n" +
              "**My commands**\n" +
              `${help}`
          )
          .setTimestamp()
          .setColor("DARK_GREEN"),
      ],
    });
  },
};
