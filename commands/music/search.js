const { Client, Message, EmbedBuilder, Collection } = require("discord.js");
const searcher = require("youtube-sr").default;
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
    if (!args.length)
      return error(message, "**You didn't give me a song to play!**");

    searcher
      .search(args.join(" "), { limit: 10, type: "video" })
      .then((result) => {
        if (!result || result.length < 1) {
          return error(message, "**I have not found any video!**");
        }
        let resp = "";
        for (var i = 0; i < result.length; i++) {
          resp += `**[${parseInt(i) + 1}]** \`${result[i].title}\`\n`;
        }
        resp += `\nChoose a number from \`1-${result.length}\``;
        send(message, resp);
        const filter = (m) =>
          !isNaN(m.content) &&
          m.content < result.length + 1 &&
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
        collector.video = result;
        collector.on("collect", (m) => {
          let File = require("../playBased/play");
          File.execute(client, message, [result[parseInt(m.content) - 1].url]);
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
