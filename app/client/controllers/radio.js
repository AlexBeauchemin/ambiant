const showEndedMaxDefault = 2;

RadioController = RouteController.extend({
  title: function () {
    let radio = Radios.findOne({url: this.params.url.toLowerCase()});
    if (radio) return 'Ambiant | ' + radio.name;
  },
  metaProperties: {
    'og:title': function () {
      let radio = Radios.findOne({url: this.params.url.toLowerCase()});
      if (radio) return 'Ambiant | ' + radio.name;
    },
    'og:url': function () {
      let radio = Radios.findOne({url: this.params.url.toLowerCase()});
      if (radio) return 'http://ambiant.io/' + radio.url;
    }
  },
  data() {
    let radio = Radios.findOne({url: this.params.url.toLowerCase()}),
      myRadio = null,
      user = Meteor.user(),
      radioId = null,
      currentlyPlaying = Session.get('currentlyPlaying'),
      showEndedMax = Session.get('showEndedMax'),
      showMore = {
        isVisible: false,
        text: 'Show More'
      };

    if (showEndedMax > showEndedMaxDefault) showMore.text = "Show Less";
    if (radio && radio._id) radioId = radio._id;
    if (user && user._id) myRadio = Radios.findOne({users: user._id});
    if (radioId) Session.set('currentRadioId', radio._id);

    Session.set('currentRadioOwner', radioId && myRadio && radio._id === myRadio._id);

    if (radio && radio.playlistEnded) {
      if (radio.playlistEnded.length > showEndedMaxDefault) showMore.isVisible = true;
      if (radio.playlistEnded.length > showEndedMax) radio.playlistEnded = radio.playlistEnded.slice(Math.max(radio.playlistEnded.length - showEndedMax, 1));
    }

    if (radio && radio.playlist.length) {
      radio.playlist[0] = _.extend(radio.playlist[0], {state: "playing"});

      if (Session.get('autoplay')) {
        App.youtube.play(radio.playlist[0].id);
        Session.set('autoplay', false);
      }
      else if (currentlyPlaying && currentlyPlaying !== radio.playlist[0].id) {
        App.youtube.play(radio.playlist[0].id);
      }

      //Remove first song (currently playing)
      let tmp = radio.playlist[0];
      radio.playlist.shift();

      //Sort by date or votes
      if (radio.allowVote) {
        radio.playlist = _.sortBy(radio.playlist, function(o) {
          if (typeof o.upvotes === 'undefined') return 0;
          return (o.upvotes.length - o.downvotes.length) * -1;
        });
      }
      else {
        radio.playlist = _.sortBy(radio.playlist, function (o) {
          return o.dateAdded;
        });
      }

      //Reinject current playing song as the first song in the list
      radio.playlist.unshift(tmp);
    }

    return {
      myRadio,
      radio,
      showMore,
      users: Presences.find({state: {currentRadioId: radioId}}).fetch()
    };
  },

  onRun() {
    $('body').removeAttr('data-mode');
    Session.set('radio-mode', '');
    Session.set('autoplay', false);
    Session.set('showEndedMax', showEndedMaxDefault);
    this.next();
  },

  onRerun() {
    //TODO: Find a way to restart radio on hot code push
    //console.log('autoplay: '+Session.get('autoplay'));
    this.next();
  },

  onAfterAction() {
    //TODO: Retrieve number of users from server
    if (this.data() && this.data().radio)
      Meteor.call('radio.update-users', this.data().radio._id, this.data().users.length);
  },

  onStop() {
    let radio = Radios.findOne({url: this.params.url.toLowerCase(), users: Meteor.user()._id});

    if (radio) Meteor.call('radio.go-offline', radio._id);

    Session.set('currentRadioId', null);
    Session.set('currentRadioOwner', false);
    Session.set('currentlyPlaying', null);
    Session.set('showEndedMax', showEndedMaxDefault);
  },

  waitOn() {
    return [
      Meteor.subscribe('radio', this.params.url.toLowerCase()),
      Meteor.subscribe('my-radio'),
      Meteor.subscribe('user-data'),
      Meteor.subscribe('user-presence', Session.get('currentRadioId'))
    ];
  }
});