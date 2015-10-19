Template.Playlist.rendered = function() {
  $('.dropdown-button').dropdown({
    alignment: 'right',
    constrain_width: false
  });
};

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
  },
  'click [data-action="remove-song"]': function(e) {
    e.preventDefault();

    let songId = this.id;
    let radioId = Template.parentData().radio._id;

    if (!radioId || !songId) return;

    Meteor.call('deleteSong', radioId, songId, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
    });
  },
  'click [data-action="block-song"]': function(e) {
    e.preventDefault();

    let songId = this.id;
    let radioId = Template.parentData().radio._id;

    Meteor.call('blockSong', radioId, songId, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      if (res) Materialize.toast("This song has been blocked", 5000);
    });
  },
  'click [data-action="block-user"]': function(e) {
    e.preventDefault();

    let user = this.user;
    let songId = this.id;
    let radioId = Template.parentData().radio._id;

    Meteor.call('blockUser', radioId, user, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      if (res) {
        Materialize.toast("This user has been blocked", 5000);

        Meteor.call('deleteSong', radioId, songId, function(error, res) {
          if (error) Materialize.toast(error.reason, 5000);
        });
      }
    });
  }
});