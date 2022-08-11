const { EmbedBuilder } = require("@discordjs/builders");
const { Client, Message, OAuth2Scopes, PermissionFlagsBits } = require("discord.js")
module.exports = {
  name: "invite",
  aliases: ["inv"],
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  execute(client, message, args) {
    const invite = client.generateInvite({
        scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
        permissions: [PermissionFlagsBits.Administrator],
    })
    message.reply({
        embeds: [new EmbedBuilder().setDescription(`[Invite me](${invite})`)]
    })
  },
};
