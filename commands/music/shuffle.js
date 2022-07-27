const { Client, Message, EmbedBuilder } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
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

    const error = (err) =>
      message.channel.send({
        embeds: [new EmbedBuilder().setColor("RED").setDescription(err)],
      });

    const send = (content) =>
      message.channel.send({
        embeds: [new EmbedBuilder().setDescription(content).setColor("GREEN")],
      });

    const deletequeue = (id) => message.client.queue.delete(id);

    if (queue.songs.length < 3) {
      return error("**There are too few songs!**");
    }

    await shuffle(queue.songs, send);
  },
};

async function shuffle(squeue, send) {
  for (let i = squeue.length - 1; i > 0; i--) {
    let j = Math.round(Math.random() * (i + 1));
    while (j == 0) j = Math.round(Math.random() * (i + 1));
    const temp = squeue[i];
    squeue[i] = squeue[j];
    squeue[j] = temp;
  }
  send(`**Shuffle done!**`);
  return squeue;
}
