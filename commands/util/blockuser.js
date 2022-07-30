const { Client, Message, EmbedBuilder } = require("discord.js");
const BlockUser = require("../../database/schemas/BlockUser");

module.exports = {
  name: "blockuser",
  aliases: ["block", "buser"],
  staff: true,
  d: "Block a user form the commands!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args, queue, prefix) {
    const user = message.mentions.members.first();
    if (!user) return error(message, "Please tag the user!");
    const blockuser = await BlockUser.findOne({
      _id: user.id,
    });
    if (!blockuser) {
      prefix = "!";
      await BlockUser.create({
        _id: user.id,
        blocked: false,
      });
    }
    if (blockuser.blocked == true) {
      await BlockUser.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          $set: {
            blocked: false,
          },
        }
      );
      send(message, `User: ${user.user} is now unblocked!`);
    }
    if (blockuser.blocked == false) {
      await BlockUser.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          $set: {
            blocked: true,
          },
        }
      );
      send(message, `User: ${user.user} is now blocked!`);
    }
  },
};
