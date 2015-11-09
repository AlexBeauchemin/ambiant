Template.Player.rendered = function () {
  let data = this.data;
  let nbErrorsTimeout = 1000;
  let errorDelayedPlay = null;
  let playNextSong = () => {
    Meteor.call('radio.get-next-song', data.radio._id, function (error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      else if (res && res.id) App.youtube.play(res.id);
      else Session.set('autoplay', true);
    });
  };

  //On error, the interval double to avoid an error loop to eat api limit
  //The interval is reset every 10 minutes or on every succesfull play
  Meteor.setInterval(() => {
    nbErrorsTimeout = 1000;
  }, 1000 * 60 * 10);

  Session.set('player-state', 'loading');

  App.youtube.init({
    apiKey: App.config.youtubeApiKey,
    onSongEnded() {
      nbErrorsTimeout = 1000;
      playNextSong();
    },
    onSongError() {
      let songId = Session.get('currentlyPlaying');

      if (errorDelayedPlay) Meteor.clearTimeout(errorDelayedPlay);

      errorDelayedPlay = Meteor.setTimeout(() => {
        playNextSong();
        if (songId) Meteor.call('radio.block-song', data.radio._id, songId);
      }, nbErrorsTimeout);

      nbErrorsTimeout = nbErrorsTimeout * 2;
    },
    onStateChange(state) {
      Session.set('player-state', state);
      if (state === "play" && errorDelayedPlay) Meteor.clearTimeout(errorDelayedPlay);
    }
  });
};

Template.Player.events({
  'click [data-action="play"]': function (e) {
    e.preventDefault();

    if (!this.radio || !this.radio.playlist || !this.radio.playlist.length) return;

    let songId = this.radio.playlist[0].id;

    if (!songId) return;

    App.youtube.play(songId);
    Meteor.call('radio.go-live', this.radio._id);
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
