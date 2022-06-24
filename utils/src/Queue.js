function createQueue(message, channel, setqueue, song) {
  const structure = {
    message: message,
    vc: channel,
    connection: null,
    player: null,
    resource: null,
    volume: 100,
    paused: false,
    loopone: false,
    loopall: false,
    songs: [],
    stream: null,
    addTime: 0,
  };

  setqueue(message.guild.id, structure);
  structure.songs.push(song);
  return structure;
}

module.exports = createQueue;
