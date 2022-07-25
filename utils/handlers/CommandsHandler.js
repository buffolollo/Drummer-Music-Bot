const fs = require("fs");
module.exports = (client) => {
  const commandFolder = fs.readdirSync(`./commands`);
  for (const folder of commandFolder) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      client.commands.set(command.name, command);
    }
  }
};
