Template.Player.rendered = function() {
    let _this = this;

    Session.set('player-state', 'loading');

    App.youtube.init({
        apiKey: App.config.youtubeApiKey,
        onSongEnded() {
            Meteor.call('getNextSong', _this.data.radio._id, function(error, res) {
                if (error) Materialize.toast(error.reason, 5000);
                else if (res && res.id) App.youtube.play(res.id);
                else Session.set('autoplay', true);
            });
        },
        onStateChange(state) {
            Session.set('player-state', state);
        }
    });
};

Template.Player.events({
    'click [data-action="play"]': function(e) {
        e.preventDefault();

        if (!this.radio || !this.radio.playlist || !this.radio.playlist.length) return;

        let songId = this.radio.playlist[0].id;

        if (!songId) return;

        App.youtube.play(songId);
        Meteor.call('goLive', this.radio._id);
    }
});

Template.Player.helpers({
    isHidden(val) {
        if (!val) return "hidden";
        return "";
    },
    canSkip() {
        return App.helpers.canSkip(this.radio);
    }
});
