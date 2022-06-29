const { MessageEmbed, WebhookClient } = require("discord.js"); // Importing MessageEmbed from Discord.js
const { inspect } = require("util");
const s = new WebhookClient({
  url: "https://discord.com/api/webhooks/989248446580011068/byTv4BM44GDcISa6BeDwSjNb89iBqf2mS49t59obo-GnhreBIZ6pt6S6hPSz0Lce5uWc",
});
const reload = require("./reloadHandler");

module.exports = (client) => {
  //error

  client.on("error", (err) => {
    console.log(err);
    reload(client);
    const ErrorEmbed = new MessageEmbed()
      .setTitle("Error")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setColor("#2F3136")
      .setDescription(`\`\`\`${inspect(error, { depth: 0 })}\`\`\``)

      .setTimestamp();
    return s.send({
      embeds: [ErrorEmbed],
    });
  });

  //unhandledRejection

  process.on("unhandledRejection", (reason, p) => {
    console.log(
      color.yellow("——————————[Unhandled Rejection/Catch]——————————\n"),
      reason,
      p
    );
    reload(client);
    const unhandledRejectionEmbed = new MessageEmbed()
      .setTitle("**🟥 There was an Unhandled Rejection/Catch 🟥**")
      .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
      .setColor("RED")
      .addField(
        "Reason",
        `\`\`\`${inspect(reason, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .addField(
        "Promise",
        `\`\`\`${inspect(p, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .setTimestamp();
    return s.send({
      embeds: [unhandledRejectionEmbed],
    });
  });

  //uncaughtException

  process.on("uncaughtException", (err, origin) => {
    console.log(err, origin);
    reload(client);
    const uncaughtExceptionEmbed = new MessageEmbed()
      .setTitle("**🟥There was an Uncaught Exception/Catch 🟥**")
      .setColor("RED")
      .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
      .addField(
        "Error",
        `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .addField(
        "Origin",
        `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .setTimestamp();
    return s.send({
      embeds: [uncaughtExceptionEmbed],
    });
  });

  //uncaughtExceptionMonitor

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(err, origin);
    reload(client);
    const uncaughtExceptionMonitorEmbed = new MessageEmbed()
      .setTitle("**🟥 There was an Uncaught Exception Monitor 🟥**")
      .setColor("RED")
      .setURL(
        "https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor"
      )
      .addField(
        "Error",
        `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .addField(
        "Origin",
        `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(0, 1000)
      )

      .setTimestamp();

    return s.send({
      embeds: [uncaughtExceptionMonitorEmbed],
    });
  });

  //multipleResolves

  process.on("multipleResolves", (type, promise, reason) => {
    console.log(type, promise, reason);
    reload(client);
    const multipleResolvesEmbed = new MessageEmbed()
      .setTitle("**🟥 There was an Multiple Resolve 🟥**")
      .setURL("https://nodejs.org/api/process.html#event-multipleresolves")
      .setColor("RED")
      .addField(
        "Type",
        `\`\`\`${inspect(type, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .addField(
        "Promise",
        `\`\`\`${inspect(promise, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .addField(
        "Reason",
        `\`\`\`${inspect(reason, { depth: 0 })}\`\`\``.substring(0, 1000)
      )
      .setTimestamp();
    return s.send({
      embeds: [multipleResolvesEmbed],
    });
  });

  //warning

  process.on("warning", (warn) => {
    console.log(warn);
    reload(client);
    const warningEmbed = new MessageEmbed()
      .setTitle("**🟥 There was an Uncaught Exception Monitor Warning 🟥**")
      .setColor("RED")
      .setURL("https://nodejs.org/api/process.html#event-warning")
      .addField(
        "Warn",
        `\`\`\`${inspect(warn, { depth: 0 }).substring(0, 1000)}\`\`\``
      )
      .setTimestamp();
    return s.send({
      embeds: [warningEmbed],
    });
  });
};
