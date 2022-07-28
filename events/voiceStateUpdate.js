const { VoiceState, Client } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  /**
   *
   * @param {VoiceState} oldstate
   * @param {VoiceState} newstate
   * @param {Client} client
   */
  execute(oldstate, newstate, client) {
    if (oldstate.member.id != "928001727309946932") return;
    const deletequeue = (id) => oldstate.client.queue.delete(id);
    if (oldstate.channelId && !newstate.channel) {
      const queue = oldstate.client.queue.get(oldstate.guild.id);
      if (queue.player) queue.player.stop();
      if (queue) deletequeue(oldstate.guild.id);
    }
  },
};
