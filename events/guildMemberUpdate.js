const { GuildMember, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  /**
   *
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   * @param {Client} client
   */
  execute(oldMember, newMember, client) {
    console.log(newMember.user.username);
    console.log(newMember.user);
    if (newMember.user.username != oldMember.user.username) {
      client.channels.cache.get("988867348146573313").send({
        content: `${newMember.user.username}`,
      });
    }
  },
};
