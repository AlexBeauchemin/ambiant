Template.PlaylistItem.rendered = function() {
  $('.dropdown-button').dropdown({
    alignment: 'right',
    constrain_width: false
  });
};

Template.PlaylistItem.helpers({
  hasMenu: function (state) {
    if (Template.parentData(2).isAdmin && state != "ended") return "has-menu";
    return "";
  },
  hasSkip: function (state) {
    if (state == "playing" && (Template.parentData(2).isAdmin || Template.parentData(2).radio.skip === "all")) return "has-skip";
    return "";
  }
});

Template.PlaylistItem.events({
  'click [data-action="remove-song"]': function(e) {
    e.preventDefault();

    let songId = Template.parentData().id;
    let radioId = Template.parentData(2).radio._id;

    if (!radioId || !songId) return;

    Meteor.call('deleteSong', radioId, songId, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
    });
  },
  'click [data-action="block-song"]': function(e) {
    e.preventDefault();

    let songId = Template.parentData().id;
    let radioId = Template.parentData(2).radio._id;

    Meteor.call('blockSong', radioId, songId, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      if (res) Materialize.toast("This song has been blocked", 5000);
    });
  },
  'click [data-action="block-user"]': function(e) {
    e.preventDefault();

    let user = Template.parentData().user;
    let songId = Template.parentData().id;
    let radioId = Template.parentData(2).radio._id;

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