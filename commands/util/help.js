const { Client, Message, EmbedBuilder } = require("discord.js");

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
  execute(client, message, args, q, prefix) {
    const channel = message.member.voice.channel;

    const { commands } = message.client;
    let help = commands
      .filter((cmd) => !cmd.staff && cmd.name != "pati" && cmd.aliases)
      .map(
        (cmd) => `\`${cmd.name}\`: ${cmd.d}\nAliases: ${cmd.aliases.join(",")}`
      )
      .join("\n");
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${client.user.tag.toString()}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            "These are my available commands!\n" +
              `Example of use: \`${prefix}<nameCommand>\`, ${prefix}play\n\n` +
              "Your prefix is: " +
              prefix +
              "\n" +
              "**My commands**\n" +
              `${help}`
          )
          .setTimestamp()
          .setColor("Random"),
      ],
    });
  },
};
