Template.PlaylistItem.rendered = function() {
  this.$('.dropdown-button').dropdown({
    alignment: 'right',
    constrain_width: false
  });
};

Template.PlaylistItem.helpers({
  hasMenu: function (state) {
    if (Session.get('currentRadioOwner') && state != "ended") return "has-menu";
    return "";
  },
  hasSkip: function (state) {
    let data = Template.parentData(2);
    if (state === "playing" && App.helpers.canSkip(data.radio)) return "has-skip";
    return "";
  }
});

Template.PlaylistItem.events({
  'click [data-action="next"]': function() {
    Meteor.call('getNextSong', Session.get('currentRadioId'), function(error, res) {
      if (error) {
        Materialize.toast(error.reason, 5000);
      }
      else if (res && res.id) {
        App.youtube.play(res.id);
      }
      else {
        Session.set('autoplay', true);
        Session.set('currentlyPlaying', null);
      }
    });
  },
  'click [data-action="remove-song"]': function(e) {
    e.preventDefault();

    let songId = Template.parentData().id;
    let radioId = Session.get('currentRadioId');

    if (!radioId || !songId) return;

    Meteor.call('deleteSong', radioId, songId, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
    });
  },
  'click [data-action="block-song"]': function(e) {
    e.preventDefault();

    let songId = Template.parentData().id;
    let radioId = Session.get('currentRadioId');

    Meteor.call('blockSong', radioId, songId, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      if (res) Materialize.toast("This song has been blocked", 5000);
    });
  },
  'click [data-action="block-user"]': function(e) {
    e.preventDefault();

    let user = Template.parentData().user;
    let songId = Template.parentData().id;
    let radioId = Session.get('currentRadioId');

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