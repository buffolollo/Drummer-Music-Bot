const { EmbedBuilder, WebhookClient } = require("discord.js"); // Importing EmbedBuilder from Discord.js
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
    const ErrorEmbed = new EmbedBuilder()
      .setTitle("Error")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setColor(0xff0000)
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
    const unhandledRejectionEmbed = new EmbedBuilder()
      .setTitle("**🟥 There was an Unhandled Rejection/Catch 🟥**")
      .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
      .setColor(0xff0000)
      .addFields([
        {
          name: "Reason",
          value: `\`\`\`${inspect(reason, { depth: 0 })}\`\`\``.substring(
            0,
            1000
          ),
        },
        {
          name: "Promise",
          value: `\`\`\`${inspect(p, { depth: 0 })}\`\`\``.substring(0, 1000),
        },
      ])
      .setTimestamp();
    return s.send({
      embeds: [unhandledRejectionEmbed],
    });
  });

  //uncaughtException

  process.on("uncaughtException", (err, origin) => {
    console.log(err, origin);
    reload(client);
    const uncaughtExceptionEmbed = new EmbedBuilder()
      .setTitle("**🟥There was an Uncaught Exception/Catch 🟥**")
      .setColor(0xff0000)
      .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
      .addFields([
        {
          name: "Error",
          value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000),
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(
            0,
            1000
          ),
        },
      ])
      .setTimestamp();
    return s.send({
      embeds: [uncaughtExceptionEmbed],
    });
  });

  //uncaughtExceptionMonitor

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(err, origin);
    reload(client);
    const uncaughtExceptionMonitorEmbed = new EmbedBuilder()
      .setTitle("**🟥 There was an Uncaught Exception Monitor 🟥**")
      .setColor(0xff0000)
      .setURL(
        "https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor"
      )
      .addFields([
        {
          name: "Error",
          value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000),
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(
            0,
            1000
          ),
        },
      ])

      .setTimestamp();

    return s.send({
      embeds: [uncaughtExceptionMonitorEmbed],
    });
  });

  //multipleResolves

  // process.on("multipleResolves", (type, promise, reason) => {
  //   console.log(type, promise, reason);
  //   reload(client);
  //   const multipleResolvesEmbed = new EmbedBuilder()
  //     .setTitle("**🟥 There was an Multiple Resolve 🟥**")
  //     .setURL("https://nodejs.org/api/process.html#event-multipleresolves")
  //     .setColor(0xff0000)
  //     .addFields([
  //       {
  //         name: "Type",
  //         value: `\`\`\`${inspect(type, { depth: 0 })}\`\`\``.substring(
  //           0,
  //           1000
  //         ),
  //       },
  //       {
  //         name: "Promise",
  //         value: `\`\`\`${inspect(promise, { depth: 0 })}\`\`\``.substring(
  //           0,
  //           1000
  //         ),
  //       },
  //       {
  //         name: "Reason",
  //         value: `\`\`\`${inspect(reason, { depth: 0 })}\`\`\``.substring(
  //           0,
  //           1000
  //         ),
  //       },
  //     ])
  //     .setTimestamp();
  //   return s.send({
  //     embeds: [multipleResolvesEmbed],
  //   });
  // });

  //warning

  process.on("warning", (warn) => {
    console.log(warn);
    reload(client);
    const warningEmbed = new EmbedBuilder()
      .setTitle("**🟥 There was an Uncaught Exception Monitor Warning 🟥**")
      .setColor(0xff0000)
      .setURL("https://nodejs.org/api/process.html#event-warning")
      .addFields([
        {
          name: "Warn",
          value: `\`\`\`${inspect(warn, { depth: 0 }).substring(
            0,
            1000
          )}\`\`\``,
        },
      ])
      .setTimestamp();
    return s.send({
      embeds: [warningEmbed],
    });
  });
};
