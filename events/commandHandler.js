const { Message, Client, EmbedBuilder, ChannelType } = require("discord.js");
const db = require("../database/schemas/prefixSchema");
const BlockUser = require("../database/schemas/BlockUser");
let blocked;

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   * @returns
   */
  async execute(message, client) {
    if (message.channel.type == ChannelType.DM) return;

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

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const blockuser = await BlockUser.findOne({
      _id: message.author.id,
    });
    if (blockuser) blocked = blockuser.blocked;
    if (!blockuser) {
      blocked == false;
      BlockUser.create({
        _id: message.author.id,
        blocked: false,
      });
    }
    if (blocked == true) {
      return error(message, `**You are blocked from the commands!**`);
    }

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
              .setColor("Red"),
          ],
        });
      }
      if (message.guild.members.me.voice.channel) {
        if (
          message.member.voice.channelId !=
            message.guild.members.me.voice.channelId &&
          message.client.queue.get(message.guild.id)
        ) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "**The bot is playing in another voice channel!**"
                )
                .setColor("Red"),
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
            .setColor("Red"),
        ],
      });
    }

    if (cmd.staff && message.member.id != "690637465341526077") {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("**You don't have permissions!** :x:")
            .setColor("Red"),
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
