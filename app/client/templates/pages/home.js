Template.Home.events({
    'click [data-action="open-create-radio"]': function() {
        var $modal = $('#modal-create-radio');

        $modal.openModal();
        $modal.find('input').first().trigger('click').trigger('focus');
        return false;
    }
});

Template.Home.rendered = function() {
    $('.collapsible').collapsible();
    $('.modal-trigger').leanModal();
    $('ul.tabs').tabs();
};

Template.Home.helpers({
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