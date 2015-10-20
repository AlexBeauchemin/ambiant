Template.Playlist.helpers({
  playlistLength: function (radio) {
    return radio.playlist.length + radio.playlistEnded.length;
  }
});

Template.Playlist.events({
  'click [data-action="clear"]': function() {
    if (!this.radio) return;

    Meteor.call('clearRadio', this.radio._id, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      else {
        App.youtube.stop();
      }
    });
  }
});