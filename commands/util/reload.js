const { Client, Message } = require("discord.js");
const fs = require("fs");
const send = require("../../utils/src/send");

module.exports = {
  name: "reload",
  aliases: ["rl"],
  d: "Private cmd!",
  staff: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args) {
    const commandFolder = fs.readdirSync(`./commands`);
    for (const folder of commandFolder) {
      const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        delete require.cache[require.resolve(`../${folder}/${file}`)];
        try {
          const newCommand = require(`../${folder}/${file}`);
          message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
          console.error(error);
          message.channel.send({
            content: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``,
          });
        }
      }
    }
    console.log("Reloading commands...");
    send(message, `**I reloaded the commands!**`);
  },
};
