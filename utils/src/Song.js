const { Util } = require("discord.js");
const forHumans = require("./forhumans");

function Song(ytdata, message) {
  const n = parseInt(ytdata.player_response.videoDetails.thumbnail.thumbnails.length)
  const song = {
    name: Util.escapeMarkdown(ytdata.videoDetails.title),
    thumbnail: ytdata.player_response.videoDetails.thumbnail.thumbnails[n - 1].url,
    requested: message.author,
    videoId: ytdata.videoDetails.videoId,
    duration: forHumans(ytdata.videoDetails.lengthSeconds),
    durationMS: ytdata.videoDetails.lengthSeconds * 1000,
    url: ytdata.videoDetails.video_url,
    views: ytdata.videoDetails.viewCount,
    author: ytdata.videoDetails.author.name,
  };
  return song;
}

module.exports = Song;
