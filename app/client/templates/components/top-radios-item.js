Template.TopRadiosItem.helpers({
  getCurrentSongTitle: function (radio) {
    if (radio.playlist.length) return radio.playlist[0].data.title;
    return "Unnamed song";
  },

  getCurrentSongImage: function (radio) {
    let image = { url: "/album-default.jpg" };

    if (radio.playlist.length &&
      radio.playlist[0].data &&
      radio.playlist[0].data.thumbnails) {
      if (radio.playlist[0].data.thumbnails.high) image = radio.playlist[0].data.thumbnails.high;
      else image = radio.playlist[0].data.thumbnails.default;
    }

    return image.url;
  }
});