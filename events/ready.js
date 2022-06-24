module.exports = {
  name: "ready",
  execute(client) {
    console.log(color.blue(`Ayo, back in track baby`));
    console.log(color.green.bold(`Logged in as ${client.user.tag}`));
    client.user.setActivity("Created by buffolollo#3713!");
    // client.user.setActivity("music!", { type: "LISTENING" });
  },
};
