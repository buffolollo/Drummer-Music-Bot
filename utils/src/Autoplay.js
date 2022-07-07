function Autoplay(message, setAutoplay) {
  const structure = {
    autoplay: false,
    LastSongId: String,
  };

  setAutoplay(message.guild.id, structure);
  return structure;
}

module.exports = Autoplay;
