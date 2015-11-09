Template.Playlist.helpers({
  playlistLength: function (radio) {
    return radio.playlist.length + radio.playlistEnded.length;
  }
});

Template.Playlist.events({
  'click [data-action="clear"]': function() {
    if (!this.radio) return;

    Meteor.call('radio.clear', this.radio._id, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      else {
        App.youtube.stop();
      }
    });
  },
  'click [data-action="show-more"]': function() {
    if (Session.get('showEndedMax') === 50) Session.set('showEndedMax', 2);
    else Session.set('showEndedMax', 50);
  }
});