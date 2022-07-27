const { Message, Client, EmbedBuilder } = require("discord.js");
const MC = require("minecraft-server-util");

module.exports = {
  name: "mcstats",
  aliases: ["mc", "minecrfat"],
  d: "Get stats of a minecraft server.",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(client, message, args) {
    const IP = "185.229.237.130";
    const Port = "25565";

    const Embed = new EmbedBuilder()
      .setColor("#1ad4a8")
      .setTitle("Devvolt Network | Stats");

    MC.status(IP, parseInt(Port))
      .then((response) => {
        Embed.addField("Server IP:", `\`devvolt.dev\``)
          .addField("Server Port:", `\`${Port}\``)
          .addField("Server MOTD:", `\`${response.motd.clean}\``)
          .addField("Server Players:", `\`${response.players.online}\``)
          .addField("Server Max Players:", `\`${response.players.max}\``)
          .addField("Server Version:", `\`${response.version.name}\``);
        message.channel.send({ embeds: [Embed] });
      })
      .catch((err) => {
        message.channel.send({
          embeds: [
            Embed.setColor("RED").setDescription(
              `> There was an error, check the server IP and Port.\n> \n> Error: ${err}`
            ),
          ],
        });
      });
  },
};
