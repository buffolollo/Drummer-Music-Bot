const { EmbedBuilder, WebhookClient } = require("discord.js");
const fs = require("fs");
const webhook = new WebhookClient({
  url: "https://discord.com/api/webhooks/989248446580011068/byTv4BM44GDcISa6BeDwSjNb89iBqf2mS49t59obo-GnhreBIZ6pt6S6hPSz0Lce5uWc",
});

function reload(client) {
  const commandFolder = fs.readdirSync(`./commands`);
  for (const folder of commandFolder) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      delete require.cache[require.resolve(`../../commands/${folder}/${file}`)];
      try {
        const newCommand = require(`../../commands/${folder}/${file}`);
        client.commands.set(newCommand.name, newCommand);
      } catch (error) {
        console.error(error);
        return webhook.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("Error to reload the commands")
              .addField("Reason", `\`\`\`${error}\`\`\``)
              .setColor("RED")
              .setTimestamp(),
          ],
        });
      }
    }
  }
  console.log("Reloading commands...");
}

module.exports = reload;
