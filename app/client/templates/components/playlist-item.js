Template.PlaylistItem.rendered = function() {
  this.$('.dropdown-button').dropdown({
    alignment: 'right',
    constrain_width: false
  });
};

Template.PlaylistItem.helpers({
  getImage(img) {
    if (img) return img;
    return '/album-default.jpg';
  },

  getLink() {
    const id = _.get(this, 'song.id');
    const link = _.get(this, 'song.data.link');

    return link || `http://youtu.be/${id}`
  },

  getVotes() {
    if (!this.song.upvotes && !this.song.downvotes) return;

    let total = this.song.upvotes.length - this.song.downvotes.length;

    if (total === 0) return '';
    if (total > 0) return '+' + total;

    return total;
  },

  getVoteState() {
    if (!this.song.upvotes && !this.song.downvotes) return;

    let total = this.song.upvotes.length - this.song.downvotes.length;

    if (total > 0) return 'positive';
    if (total < 0) return 'negative';
    return '';
  },

  isModerator() {
    return App.helpers.isModerator(Template.parentData(2).radio);
  },

  hasDownvote(user) {
    if (!this.song.downvotes) return;
    if (this.song.downvotes.indexOf(user._id) === -1) return;
    return 'active';
  },

  hasMenu() {
    const isModerator = App.helpers.isModerator(Template.parentData(2).radio);
    if ((Session.get('currentRadioOwner') || isModerator) && this.state !== "ended") return "has-menu";
    return "";
  },

  hasSkip() {
    const data = Template.parentData(2);
    if (this.state === "playing" && App.helpers.canSkip(data.radio)) return "has-skip";
    return "";
  },

  hasUpvote(user) {
    if (!this.song.upvotes || !user) return;
    if (this.song.upvotes.indexOf(user._id) === -1) return;
    return 'active';
  },

  hasVote() {
    if (this.state === 'playing' || this.state === 'ended') return false;
    if (!Template.parentData(2).radio.allowVote) return false;
    return "vote";
  }
});

Template.PlaylistItem.events({
  'click [data-action="next"]': function() {
    App.youtube.stop();
    App.soundcloud.stop();

    Meteor.call('radio.get-next-song', Session.get('currentRadioId'), function(error, res) {
      if (error) return Materialize.toast(error.reason, 5000);

      let domain = res.domain || 'youtube';

      if (res && res.id) App[domain].play(res.id);
    });
  },

  'click [data-action="remove-song"]': function(e) {
    e.preventDefault();

    let song = Template.parentData();
    let radioId = Session.get('currentRadioId');

    if (!radioId || !song) return;

    Meteor.call('radio.song-delete', radioId, song, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
    });
  },

  'click [data-action="block-song"]': function(e) {
    e.preventDefault();

    let songId = Template.parentData().id;
    let radioId = Session.get('currentRadioId');

    if (Session.get('currentlyPlaying') === songId) {
      Meteor.call('radio.get-next-song', Session.get('currentRadioId'), function(error, res) {
        if (error) return Materialize.toast(error.reason, 5000);

        let domain = res.domain || 'youtube';

        if (res && res.id) App[domain].play(res.id);
        else {
          App.youtube.stop();
          App.soundcloud.stop();
        }
      });
    }

    Meteor.call('radio.block-song', radioId, songId, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      if (res) Materialize.toast("This song has been blocked", 5000);
    });
  },

  'click [data-action="block-user"]': function(e) {
    e.preventDefault();

    let user = Template.parentData().user;
    let song = Template.parentData();
    let radioId = Session.get('currentRadioId');

    Meteor.call('radio.block-user', radioId, user, function(error, res) {
      if (error) Materialize.toast(error.reason, 5000);
      if (res) {
        Materialize.toast("This user has been blocked", 5000);

        Meteor.call('radio.song-delete', radioId, song, function(error, res) {
          if (error) Materialize.toast(error.reason, 5000);
        });
      }
    });
  },

  'click [data-action="upvote"]': function(e) {
    e.preventDefault();

    let song = Template.parentData();
    let radioId = Session.get('currentRadioId');

    Meteor.call('radio.song-upvote', radioId, song, (error, res) => {
      if (error) Materialize.toast(error.reason, 5000);
    });
  },

  'click [data-action="downvote"]': function(e) {
    e.preventDefault();

    let song = Template.parentData();
    let radioId = Session.get('currentRadioId');

    Meteor.call('radio.song-downvote', radioId, song, (error, res) => {
      if (error) Materialize.toast(error.reason, 5000);
    });
  }
});