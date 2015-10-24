if (Meteor.isClient) {
  Meteor.methods({
    deleteSong: function(radioId, songId) {
      if (!radioId || !songId) return;
      Radios.update({ _id: radioId },{$pull: {songs: songId, playlist: {id: songId}}});
    },

    getNextSong: function(radioId) {
      let radio = Radios.findOne(radioId);

      if (!radio) return;

      radio.playlistEnded.push(radio.playlist[0]);

      while (radio.playlistEnded.length > 50) {
        radio.playlistEnded.shift();
      }

      radio.playlist.shift();

      Radios.update({ _id: radioId },{ $set: {
        playlist: radio.playlist,
        playlistEnded: radio.playlistEnded
      }});

      return radio.playlist[0];
    }
  });
}

if (Meteor.isServer) {
  let Helpers = App.collectionHelpers.radio;

  Meteor.methods({
    createRadio(name) {
      let users = [];
      let twitchChannel = null;
      name = name.trim().substr(0,50);
      let url = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

      if (!name) throw new Meteor.Error(500, 'Name invalid');
      if (!Meteor.user() || !Meteor.user()._id) throw new Meteor.Error(500, 'No user');

      if (Meteor.user()) {
        users = [Meteor.user()._id];
        if (Meteor.user().services && Meteor.user().services.twitch) {
          twitchChannel = Meteor.user().services.twitch.name;
        }
      }

      if (Radios.findOne({url: url})) throw new Meteor.Error(500, 'This name is already taken');

      return {
        res: Radios.insert({
          access: "all", // all, users, twitch, follow, subscribe or whitelist
          blacklistedSongs: [],
          blacklistedUsers: [],
          dateCreated: new Date(),
          dateLastAccess: new Date(),
          limitType: 'number', //number or time
          limitValue: 5,
          live: false,
          name: name,
          nbUsers: 0,
          playlist: [], //current playlist
          playlistEnded: [], //past songs
          public: true,
          skip: "admin", // admin, all
          songs: [], //list of songs added, minus related songs (automatically added at the end of the playlist
          threshold: 10,
          twitchChannel: twitchChannel,
          url: url,
          users: users,
          whitelist: []
        }),
        url: url
      }
    },

    addSongToPlaylist(song, radioId) {
      let radio = Radios.findOne(radioId);

      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!song || !song.id || !song.data) throw new Meteor.Error(500, 'Song invalid');

      song.user = Helpers.getUser();
      song.dateAdded = new Date();

      if (Helpers.isSongBlocked(radioId, song.id)) throw new Meteor.Error(500, 'This song is blocked');
      if (Helpers.isUserBlocked(radioId, song.user)) throw new Meteor.Error(500, 'Sorry, you cannot add songs to this radio');

      if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');
      if (radio.playlist.length >= 100) throw new Meteor.Error(500, 'Sorry, the playlist is full');

      if (!Helpers.isOwner(radioId)) {
        if (Helpers.hasUserReachedLimit(radio)) throw new Meteor.Error(500, 'You have reached your limit for this radio. Please try again later');
      }

      if (Helpers.isOwner(radioId) || Helpers.canAdd(radioId)) Radios.update({ _id: radioId },{ $push: { playlist: song, songs: song.id }});
    },
    blockSong: function(radioId, songId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot use blacklist functions on this radio');

      Radios.update({ _id: radioId },{$pull: {songs: songId, playlist: {id: songId}}});
      Radios.update({ _id: radioId },{$push: {blacklistedSongs: songId}});
      return true;
    },
    blockUser: function(radioId, user) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot use blacklist functions on this radio');
      if (user.id === Meteor.user()._id) throw new Meteor.Error(500, 'You cannot blacklist yourself');

      Radios.update({ _id: radioId },{$push: {blacklistedUsers: user}});
      return true;
    },
    clearRadio: function(radioId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot clear this radio');

      Radios.update({ _id: radioId },{ $set: {playlist: [], songs: [], playlistEnded: [] }});
    },
    deleteRadio: function(radioId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot delete this radio');

      Radios.remove(radioId);
    },
    deleteSong: function(radioId, songId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot delete songs on this radio');

      Radios.update({ _id: radioId },{$pull: {songs: songId, playlist: {id: songId}}});
    },
    getNextSong: function(radioId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');

      let radio = Radios.findOne(radioId);

      if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId) && radio.skip === "admin") throw new Meteor.Error(500, 'Cannot skip on this radio');

      radio.playlistEnded.push(radio.playlist[0]);

      while (radio.playlistEnded.length > 50) {
        radio.playlistEnded.shift();
      }

      radio.playlist.shift();

      Radios.update({ _id: radioId },{ $set: {
        playlist: radio.playlist,
        playlistEnded: radio.playlistEnded,
        dateLastAccess: new Date()
      }});

      if (!radio.playlist.length) return Helpers.findRelated(radio);
      return radio.playlist[0];
    },
    goLive: function(radioId) {
      if (Helpers.isOwner(radioId)) Radios.update({_id: radioId}, {$set: {live: true}}) ;
    },
    goOffline: function(radioId) {
      if (Helpers.isOwner(radioId)) Radios.update({_id: radioId}, {$set: {live: false}}) ;
    },
    updateConfig: function(radioId, data) {
      if (!data) return;
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot modify this radio config');

      var config = {};

      if (data.access) config.access = data.access;
      if (data.skip) config.skip = data.skip;
      if (data.limitValue) config.limitValue = data.limitValue;
      if (data.limitType) config.limitType = data.limitType;
      if (data.public || data.public === false) config.public = !!data.public;
      if (data.threshold) {
        data.threshold = parseInt(data.threshold,10);
        if (data.threshold >=5 && data.threshold <= 25) config.threshold = data.threshold;
      }

      if (Object.keys(config).length > 0) Radios.update({ _id: radioId },{ $set: config });
    },
    updateUsers: function(radioId, nbUsers) {
      if (!radioId) return;
      Radios.update({ _id: radioId },{ $set: { nbUsers: nbUsers } });
    }
  });
}