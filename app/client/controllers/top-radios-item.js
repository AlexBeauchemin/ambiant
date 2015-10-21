Template.TopRadiosItem.helpers({
    getCurrentSongTitle: function(radio) {
        if (radio.playlist.length) return radio.playlist[0].data.title;
        return "...";
    },

    getCurrentSongImage: function(radio) {
        var image = "/album-default.jpg";

        if (radio.playlist.length &&
            radio.playlist[0].data &&
            radio.playlist[0].data.thumbnails &&
            radio.playlist[0].data.thumbnails.high) image = radio.playlist[0].data.thumbnails.high.url;

        return image;
    }
});