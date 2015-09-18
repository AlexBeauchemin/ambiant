Template.BtnPause.events({
    'click [data-action="pause-toggle"]': function() {
        var songId = null;

        if (Session.get('player-state') === "stop") {
            songId = this.radio.playlist[0].id;
            App.youtube.play(songId);
        }
        else {
            App.youtube.pauseToggle();
        }
    }
});
