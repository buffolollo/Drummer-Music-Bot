let spotify = require("spotify-url-info");
const searcher = require("youtube-sr").default;

async function spotifyPlaylist(message, query) {
  let playlist = await spotify.getData(query);
  message.channel.send({
    content: `🔍🎶 **Sto aggiungendo la playlist** \`${playlist.name}\` Potrebbe volerci un po...`,
  });
  let name = playlist.name;
  const tracks = [];
  let s = 0;
  for (let i = 0; i < playlist.tracks.items.length; i++) {
    if (!message.guild.me.voice.channel) {
      break;
    }
    let query = `${playlist.tracks.items[i].track.name} - ${playlist.tracks.items[i].track.artists[0].name}`;
    const result = await searcher
      .search(query, { type: "video", limit: 1 })
      .catch((err) => {});
    if (result.length < 1 || !result) {
      s++; // could be used later for skipped tracks due to result not being found //tipo per quanti errori
      continue;
    }
    tracks.push({ url: result[0].url });
  }
  return { tracks, name };
}

module.exports = spotifyPlaylist;
