const { EmbedBuilder, Client, Message } = require("discord.js");
const searcher = require("youtube-sr").default;
const ytdl = require("ytdl-core");
const fs = require("fs");

module.exports = {
  name: "download",
  aliases: ["dl", "dw"],
  d: "Private cmd",
  staff: true,
  stop: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    const queue = message.client.queue.get(message.guild.id);

    console.log(`${message.author.tag} used the command download!`);

    const query = args[0];
    if (!query) return error(message, "You give me nothing!");

    if (!searcher.validate(query, "VIDEO"))
      return error(message, "This is not a youtube link!");

    let data = await ytdl.getBasicInfo(query);
    let title = data.videoDetails.title;
    let url = data.videoDetails.video_url;

    if (fs.existsSync(`./download/${title}.m4a`)) {
      message.channel.send({
        content: `The file already exist, i will sent it now`,
      });
      message.channel
        .send({
          files: [`./download/${title}.m4a`],
        })
        .catch((error) => {
          if (error.code == 40005) {
            return message.channel.send({
              content: `**ERROR**: The file is to heavy!`,
            });
          }
          console.log(`errore: ${error.code}`);
          return message.channel.send({
            content: `There was an error trying to send the song: ${error}`,
          });
        });
      return;
    }

    const receiver = ytdl(url, {
      quality: "highestaudio",
    });

    const writer = receiver.pipe(
      fs.createWriteStream(`./download/${title}.m4a`)
    );

    writer.on("finish", () => {
      maxFileSize = 8 * 1024 * 1024;
      var stats = fs.statSync(`./download/${title}.m4a`);
      const fileSize = stats.size;
      if (fileSize >= maxFileSize) {
        message.channel.send({
          content: `**ERROR**: The file is to heavy!`,
        });
        return console.log(`The file is to heavy`);
      }
      message.channel
        .send({
          content: `I will send you the song shortly!\nThe song is: ${url}`,
        })
        .catch((err) => {});

      var title2 = title;
      message.channel
        .send({
          files: [`./download/${title2}.m4a`],
          content: `${title}`,
        })
        .catch((error) => {
          if (error.code == 40005) {
            return message.channel.send({
              content: `**ERROR**: The file is to heavy!`,
            });
          }
          console.log(`errore: ${error.code}`);
          message.channel.send({
            content: `There was an error trying to send the song: ${error}`,
          });
        });
    });

    writer.on("error", () => {
      message.channel.send({
        content: `There was an error trying to download the song!\nThe song may have special characters!`,
      });
    });

    //.pipe(fs.createWriteStream(`./music/${music}.m4a`))
    /*const seconds = "10"
    const time = seconds * 1000
    var musci2 = music
    message.author.send(`La canzone ti arriverà tra ${seconds} secondi!\nla canzone in questione è: ${track.url}`)
    setTimeout(function () {
        message.author.send({
            files: [`./music/${musci2}.m4a`]
        }).catch((error) => {
            message.channel.send(`C'è stato un errore provando a inviare la canzone: ${error}`)
        })
    }, time)*/
  },
};
