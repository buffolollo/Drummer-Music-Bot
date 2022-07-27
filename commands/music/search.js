const { Client, Message, EmbedBuilder, Collection } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const ytsr = require("yt-search");
const yt = require("ytdl-core");
const send = require("../../utils/src/send");
const alreadyCollector = new Collection();

module.exports = {
  name: "search",
  aliases: ["sr"],
  voice: true,
  d: "Search a song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    if (message.author.bot) return;

    const channel = message.member.voice.channel;

    const queue = message.client.queue.get(message.guild.id);

    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    if (!args.length) return error("**You didn't give me a song to play!**");
    ytsr(args.join(" "), (err, res) => {
      if (err) return error("Sorry, something went wrong!");
      let videos = res.videos.slice(0, 10);
      let resp = "";
      for (var i in videos) {
        resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
      }
      resp += `\nChoose a number from \`1-${videos.length}\``;
      send(message, resp);
      const filter = (m) =>
        !isNaN(m.content) &&
        m.content < videos.length + 1 &&
        m.content > 0 &&
        m.author.id == message.author.id;
      const collectorString = `${message.author.id}${message.channel.id}`;
      const currentCollector = alreadyCollector.get(collectorString);
      if (currentCollector) {
        currentCollector.stop();
      }
      const collector = message.channel.createMessageCollector({
        filter,
        time: 30000,
        errors: ["time"],
      });
      alreadyCollector.set(collectorString, collector);
      collector.video = videos;
      collector.on("collect", (m) => {
        let File = require("./play");
        File.execute(client, message, [videos[parseInt(m.content) - 1].url]);
        collector.stop();
      });
      collector.on("end", (collected, reason) => {
        if (reason == "time") {
          error("The time is up, if you want you can redo the command");
        }
      });
    });
  },
};
