if (Meteor.isServer) {
  let Future = Npm.require('fibers/future');

  App.collectionHelpers.radio = {
    canAdd(radioId) {
      let radio = Radios.findOne(radioId),
        user = Meteor.user(),
        userTwitch = null,
        hasAccess = false;

      if (!radio) throw new Meteor.Error(500, 'Cannot find this radio');
      if (user.services && user.services.twitch) userTwitch = user.services.twitch;

      switch (radio.access) {
        case "all":
          hasAccess = true;
          break;
        case "twitch":
          if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
          hasAccess = true;
          break;
        case "follow":
          if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
          App.twitch.isFollowing(radio.twitchChannel);
          hasAccess = true;
          break;
        case "subscribe":
          if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
          App.twitch.isSubscribed(radio.twitchChannel);
          hasAccess = true;
          break;
      }

      return hasAccess;
    },

    findRelated(radio) {
      let randomSong = null;

      //TODO: Do not allow blocked songs

      if (radio && !radio.playlist.length && radio.songs) {
        randomSong = radio.songs[Math.floor(Math.random() * radio.songs.length)];

        let fut = new Future();
        let bound_callback = Meteor.bindEnvironment(function (res) {
          if (res) {
            fut.return(Radios.update({_id: radio._id}, {$push: {playlist: res}}));
          } else {
            fut.throw('error while finding related songs');
          }
        });
        App.youtube.findRelated(randomSong, radio.threshold, bound_callback);
        fut.wait();
      }
    },

    getUser() {
      let user = {
        name: App.twitch.getUserTwitchName(),
        email: null,
        id: Meteor.user()._id
      };

      if (!user.name && Meteor.user().profile) user.name = Meteor.user().profile.name;
      if (!user.name) user.name = "Guest";

      if (Meteor.user().services && Meteor.user().services.twitch) user.email = Meteor.user().services.twitch.email;
      if (!user.email && Meteor.user().profile && !Meteor.user().profile.guest) user.email = Meteor.user().emails[0].address;

      return user;
    },

    isOwner(radioId) {
      if (!radioId) return false;
      if (!Meteor.user()) return false;

      return !!Radios.findOne({_id: radioId, users: Meteor.user()._id});
    },

    isSongBlocked(radioId, songId) {
      let radio = Radios.findOne({_id: radioId});

      if (!radio) return false;

      if (radio.blacklistedSongs.indexOf(songId) > -1) return true;
      return false;
    },

    isUserBlocked(radioId, user) {
      let radio = Radios.findOne({_id: radioId}),
        isBlacklisted = false;

      if (!radio) return false;

      radio.blacklistedUsers.forEach(function (blacklistedUser) {
        if (user.id === blacklistedUser.id) isBlacklisted = true;
        if (user.email && user.email === blacklistedUser.email) isBlacklisted = true;
      });

      return isBlacklisted;
    },

    hasUserReachedLimit(radio) {
      if (radio.limitType === "number") {
        let count = 0;

        radio.playlist.forEach(function (song) {
          if (song.user && song.user.id === Meteor.user()._id) count++;
        });

        if (count >= radio.limitValue) return true;
      }
      else {
        if (radio.playlist.length) {
          let hasEnded = false;
          let count = 0;
          let song = null;

          while (!hasEnded) {
            song = radio.playlist[radio.playlist.length - (count + 1)];
            count++;
            if (count === radio.playlist.length) hasEnded = true;
            if (song.user && song.user.id === Meteor.user()._id) {
              let now = new Date().getTime();
              let minutesFromNow = Math.floor((now - song.dateAdded.getTime()) / (1000 * 60));

              if (minutesFromNow <= parseInt(radio.limitValue, 10)) return true;
              hasEnded = true;
            }
          }
        }
      }

      return false;
    }
  }
}