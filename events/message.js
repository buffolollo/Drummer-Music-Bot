const { Message, Client, EmbedBuilder, ChannelType } = require("discord.js");
const db = require("../database/schemas/prefixSchema");
var prefix;

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @returns
   */
  async execute(message, client) {
    if (message.channel.type == ChannelType.DM) return;
    if (message.author.bot) return;

    const data = await db.findOne({
      _id: message.author.id,
    });

    if (data) prefix = data.prefix;
    if (!data) {
      prefix = "!";
      db.create({
        _id: message.author.id,
        prefix: "!",
      });
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd =
      client.commands.get(command) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(command)
      );

    if (!cmd) return;

    if (cmd.stop) {
      return;
    }

    if (cmd.voice) {
      if (!message.member.voice.channel) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("**You must be in a voice channel** :x:")
              .setColor("RED"),
          ],
        });
      }
      if (message.guild.me.voice.channel) {
        if (message.member.voice.channel != message.guild.me.voice.channel) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setDescription("**You are not in the same voice channel** :x:")
                .setColor("RED"),
            ],
          });
        }
      }
    }

    if (cmd.queue && !message.client.queue.get(message.guild.id)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("**There is no queue** :x:")
            .setColor("YELLOW"),
        ],
      });
    }

    if (cmd.staff && message.member.id != "690637465341526077") {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("**You don't have permissions!** :x:")
            .setColor("RED"),
        ],
      });
    }

    let queue = message.client.queue;

    try {
      cmd.execute(client, message, args, queue, prefix);
    } catch (error) {
      console.error(error);
      message.reply("There was an error trying to execute that command!");
    }
  },
};
