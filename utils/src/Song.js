const { Util } = require("discord.js");
const forHumans = require("./forhumans");

// title: Util.escapeMarkdown(ytdata.videoDetails.title),
//     name: Util.escapeMarkdown(ytdata.videoDetails.title),

async function Song(ytdata, message) {
  const n = ytdata.videoDetails.thumbnails.length;
  const song = {
    title: ytdata.videoDetails.title,
    name: ytdata.videoDetails.title,
    thumbnail: ytdata.videoDetails.thumbnails[n - 1].url,
    requested: message.author,
    id: ytdata.videoDetails.videoId,
    duration: forHumans(ytdata.videoDetails.lengthSeconds),
    durationMS: ytdata.videoDetails.lengthSeconds * 1000,
    url: ytdata.videoDetails.video_url,
    views: ytdata.videoDetails.viewCount,
    author: ytdata.videoDetails.author.name,
  };
  return song;
}

module.exports = Song;
