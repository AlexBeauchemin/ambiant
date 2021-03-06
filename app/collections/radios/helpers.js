if (Meteor.isServer) {
  App.collectionHelpers.radio = {
    canAdd(radioId) {
      let radio = Radios.findOne(radioId),
        user = Meteor.user(),
        userTwitch = null,
        hasAccess = false;

      if (!radio) throw new Meteor.Error(500, 'Cannot find this radio');
      if (user.services && user.services.twitch) userTwitch = user.services.twitch;

      switch (radio.access) {
        case 'all':
          hasAccess = true;
          break;
        case 'twitch':
          if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
          hasAccess = true;
          break;
        case 'follow':
          if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
          App.twitch.isFollowing(radio.twitchChannel);
          hasAccess = true;
          break;
        case 'subscribe':
          if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
          App.twitch.isSubscribed(radio.twitchChannel);
          hasAccess = true;
          break;
        case 'users':
          if (user.profile && user.profile.guest) throw new Meteor.Error(700, 'You need to have an account to add songs to this playlist, please login or register');
          hasAccess = true;
          break;
        case 'moderators':
          if (!this.isModerator(radioId)) throw new Meteor.Error(700, 'You need to be a moderator to add songs to this playlist');
          hasAccess = true;
          break;
      }

      return hasAccess;
    },

    findRelated(radio, callback) {
      if (!radio) return;

      let randomSong = null;
      let songs = _.filter(radio.songs, (item) => {
        return _.get(item, 'domain') !== 'soundcloud';
      });

      if (!radio.playlist.length && _.isEmpty(songs) && radio.songs.length) {
        throw new Meteor.Error(500, 'Sorry, song discovery is not available for soundcloud playlists for the moment');
      }

      if (!radio.playlist.length && radio.songs) {
        randomSong = songs[Math.floor(Math.random() * radio.songs.length)];

        const domain = _.get(randomSong, 'domain') || 'youtube';
        const songId = _.get(randomSong, 'id') || randomSong;
        let fut = new Future();
        let bound_callback = Meteor.bindEnvironment(function (res) {
          if (callback) callback(res);
          if (res) {
            res.uuid = uuid.v4();
            fut.return(Radios.update({_id: radio._id}, {$push: {playlist: res}}));
          } else {
            fut.return(null);
          }
        });

        if (radio.discovery) App.youtube.findRelated(songId, radio.threshold, radio.blacklistedSongs, bound_callback);
        else {
          App.youtube.getSongInfo(songId, function(songInfo) {
            bound_callback({ id: songId, type: 'related', data: songInfo });
          });
        }

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
      if (Meteor.user().services && Meteor.user().services.google) user.email = Meteor.user().services.google.email;
      if (Meteor.user().services && Meteor.user().services.facebook) user.email = Meteor.user().services.facebook.email;
      if (!user.email && Meteor.user().profile && !Meteor.user().profile.guest) user.email = Meteor.user().emails[0].address;

      return user;
    },

    isOwner(radioId) {
      if (!radioId) return false;
      if (!Meteor.user()) return false;

      return !!Radios.findOne({_id: radioId, users: Meteor.user()._id});
    },

    isModerator(radioId) {
      if (!radioId) return false;
      if (!Meteor.user()) return false;

      let name = App.twitch.getUserTwitchName();
      let email = this.getUser().email;

      if (name) name = name.toLowerCase();

      if (name) return !!Radios.findOne({_id: radioId, moderators: name});
      return !!Radios.findOne({_id: radioId, moderators: email});
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
  };
}