const { Client, Message, EmbedBuilder } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const yt = require("ytdl-core");

module.exports = {
  name: "shuffle",
  aliases: ["sh"],
  d: "Shuffle queue!",
  voice: true,
  queue: true,
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    const queue = message.client.queue.get(message.guild.id);

    const deletequeue = (id) => message.client.queue.delete(id);

    if (queue.songs.length < 3) {
      return error(message, "**There are too few songs!**");
    }

    await shuffle(queue.songs, send, message);
  },
};

async function shuffle(squeue, send, message) {
  for (let i = squeue.length - 1; i > 0; i--) {
    let j = Math.round(Math.random() * (i + 1));
    while (j == 0) j = Math.round(Math.random() * (i + 1));
    const temp = squeue[i];
    squeue[i] = squeue[j];
    squeue[j] = temp;
  }
  send(message, `**Shuffle done!**`);
  return squeue;
}
