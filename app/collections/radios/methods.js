if (Meteor.isClient) {
  Meteor.methods({
    'radio.song-delete'(radioId, song) {
      if (!radioId || !song) return;
      Radios.update({ _id: radioId },{$pull: {songs: song.id, playlist: {uuid: song.uuid}}});
    },

    'radio.get-next-song'(radioId) {
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

  //todo: stub upvote/downvote
}

if (Meteor.isServer) {
  let Helpers = App.collectionHelpers.radio;

  Meteor.methods({
    'radio.create'(name) {
      let users = [];
      let twitchChannel = null;
      name = name.trim().substr(0,50);
      let url = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      let isGuest = false;

      if (!name) throw new Meteor.Error(500, 'Name invalid');
      if (!Meteor.user() || !Meteor.user()._id) throw new Meteor.Error(500, 'No user');

      users = [Meteor.user()._id];
      isGuest = Meteor.user().profile && Meteor.user().profile.guest;

      if (Meteor.user().services && Meteor.user().services.twitch) {
        twitchChannel = Meteor.user().services.twitch.name;
      }

      if (Radios.findOne({url: url})) throw new Meteor.Error(500, 'This name is already taken');

      return {
        res: Radios.insert({
          access: "all", // all, users, twitch, follow, subscribe or moderators
          allowVote: true,
          blacklistedSongs: [],
          blacklistedUsers: [],
          dateCreated: new Date(),
          dateLastAccess: new Date(),
          discovery: true,
          isGuest: isGuest,
          limitType: 'number', //number or time
          limitValue: 5,
          live: false,
          moderators: [],
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
          users: users
        }),
        url: url
      };
    },

    'radio.add-moderators'(radioId, moderators) {
      let radio = Radios.findOne(radioId);
      let moderatorsList = moderators.split(';');

      if (!radioId || !radio) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!moderators) return;
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot add moderators on this radio');

      moderatorsList = _.map(moderatorsList, function(mod) {
        return mod.trim().toLowerCase();
      });

      if (!radio.moderators) {
        Radios.update({ _id: radioId },{$set: {moderators: moderatorsList}});
      }
      else {
        Radios.update({ _id: radioId },{$push: {moderators: { $each: moderatorsList}}});
      }
    },

    'radio.add-song-to-playlist'(song, radioId) {
      let radio = Radios.findOne(radioId);
      let isGuest = false;

      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!song || !song.id || !song.data) throw new Meteor.Error(500, 'Song invalid');

      song.user = Helpers.getUser();
      song.dateAdded = new Date();
      song.downvotes = [];
      song.upvotes = [];
      song.uuid = uuid.v4();

      if (Meteor.user() && Meteor.user().profile) isGuest = Meteor.user().profile.guest;
      if (!isGuest) song.upvotes.push(Meteor.user()._id);

      if (Helpers.isSongBlocked(radioId, song.id)) throw new Meteor.Error(500, 'This song is blocked');
      if (Helpers.isUserBlocked(radioId, song.user)) throw new Meteor.Error(500, 'Sorry, you cannot add songs to this radio');

      if (radio.playlist.length >= 100) throw new Meteor.Error(500, 'Sorry, the playlist is full');

      if (!Helpers.isOwner(radioId)) {
        if (Helpers.hasUserReachedLimit(radio)) throw new Meteor.Error(500, 'You have reached your limit for this radio. Please try again later');
      }

      if (Helpers.isOwner(radioId) || Helpers.canAdd(radioId)) Radios.update({ _id: radioId },{ $push: { playlist: song, songs: song.id }});
    },

    'radio.block-song'(radioId, songId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId) && !Helpers.isModerator(radioId)) throw new Meteor.Error(500, 'Cannot use blacklist functions on this radio');

      Radios.update({ _id: radioId },{$pull: {songs: songId, playlist: {id: songId}}});
      Radios.update({ _id: radioId },{$push: {blacklistedSongs: songId}});
      return true;
    },

    'radio.block-user'(radioId, user) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId) && !Helpers.isModerator(radioId)) throw new Meteor.Error(500, 'Cannot use blacklist functions on this radio');
      if (user.id === Meteor.user()._id) throw new Meteor.Error(500, 'You cannot blacklist yourself');

      Radios.update({ _id: radioId },{$push: {blacklistedUsers: user}});
      return true;
    },

    'radio.clean-guest-radios'() {
      let guestRadios = [];
      let guestUsers = [];
      let toDelete;

      Radios.find({isGuest: true}).forEach(function(radio) {
        guestRadios.push({id: radio._id, user: radio.users[0]});
      });

      Meteor.users.find({'profile.guest': true}).forEach(function (user) {
        guestUsers.push(user._id);
      });

      toDelete = _.reject(guestRadios, function(radio) {
        return guestUsers.indexOf(radio.user) !== -1;
      });

      if (!_.isEmpty(toDelete)) {
        Radios.remove({'_id': {'$in': _.pluck(toDelete, 'id')}});
      }
    },

    'radio.clear'(radioId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot clear this radio');

      Radios.update({ _id: radioId },{ $set: {playlist: [], songs: [], playlistEnded: [] }});
    },

    'radio.delete'(radioId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot delete this radio');

      Radios.remove(radioId);
    },

    'radio.get-next-song'(radioId) {
      if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');

      let radio = Radios.findOne(radioId);

      if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');
      if (radio.skip === "admin" && (!Helpers.isOwner(radioId) && !Helpers.isModerator(radioId))) throw new Meteor.Error(500, 'Cannot skip on this radio');

      radio.playlistEnded.push(radio.playlist[0]);

      while (radio.playlistEnded.length > 50) {
        radio.playlistEnded.shift();
      }

      radio.playlist.shift();

      if (radio.allowVote) {
        radio.playlist = _.sortBy(radio.playlist, function (o) {
          if (typeof o.upvotes === 'undefined') return 0;
          return (o.upvotes.length - o.downvotes.length) * -1;
        });
      }
      else {
        radio.playlist = _.sortBy(radio.playlist, function (o) {
          return o.dateAdded;
        });
      }

      Radios.update({ _id: radioId },{ $set: {
        playlist: radio.playlist,
        playlistEnded: radio.playlistEnded
      }});

      if (!radio.playlist.length) {

        let fut = new Future(),
          relatedSong = null;

        let callback = Meteor.bindEnvironment(function (res) {
          relatedSong = res;
          fut.return(res);
        });

        Helpers.findRelated(radio, callback);

        fut.wait();

        if (!relatedSong) throw new Meteor.Error(500, 'Can\' find related songs, try with a higher threshold');
        return relatedSong;
      }

      return radio.playlist[0];
    },

    'radio.go-live'(radioId) {
      if (Helpers.isOwner(radioId)) Radios.update({_id: radioId}, {$set: {live: true, dateLastAccess: new Date()}});
    },

    'radio.go-offline'(radioId) {
      if (Helpers.isOwner(radioId)) Radios.update({_id: radioId}, {$set: {live: false}});
    },

    'radio.remove-moderator'(radioId, moderator) {
      let radio = Radios.findOne(radioId);

      if (!radioId || !radio) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!moderator) return;
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot add moderators on this radio');

      let mods = _.without(radio.moderators, moderator);
      Radios.update({ _id: radioId },{$set: {moderators: mods}});
    },

    'radio.song-delete'(radioId, song) {
      if (!radioId || !song) throw new Meteor.Error(500, 'Cannot access this radio');
      if (!Helpers.isOwner(radioId) && !Helpers.isModerator(radioId)) throw new Meteor.Error(500, 'Cannot delete songs on this radio');

      Radios.update({ _id: radioId },{$pull: {songs: song.id, playlist: {uuid: song.uuid}}});
    },

    'radio.song-downvote'(radioId, song) {
      let radio = Radios.findOne(radioId);
      let downvotes = null;
      let upvotes = null;
      let playlistSong = null;
      let userId = Meteor.user()._id;

      if (!Meteor.user() || (Meteor.user().profile && Meteor.user().profile.guest)) throw new Meteor.Error(500, 'You need to be logged in to downvote a song');
      if (!radio || !radioId || !song || !userId) throw new Meteor.Error(500, 'Can\'t downvote, song or radio invalid');

      radio.playlist.forEach(function(s) {
        if (s.uuid === song.uuid) {
          playlistSong = s;
        }
      });

      if (!playlistSong) throw new Meteor.Error(500, 'Can\'t downvote, song invalid');

      upvotes = playlistSong.upvotes;
      downvotes = playlistSong.downvotes;

      if (!downvotes) downvotes = [];
      if (!upvotes) upvotes = [];
      if (!downvotes.length || downvotes.indexOf(userId) === -1) {
        downvotes.push(userId);
        if (upvotes.indexOf(userId) !== -1) upvotes.splice(upvotes.indexOf(userId), 1);
      }
      else downvotes.splice(downvotes.indexOf(userId), 1);

      Radios.update({_id: radioId, 'playlist.uuid': song.uuid}, {$set: {'playlist.$.downvotes': downvotes, 'playlist.$.upvotes': upvotes}});
    },

    'radio.song-upvote'(radioId, song) {
      let radio = Radios.findOne(radioId);
      let downvotes = null;
      let upvotes = null;
      let playlistSong = null;
      let userId = Meteor.user()._id;

      if (!Meteor.user() || (Meteor.user().profile && Meteor.user().profile.guest)) throw new Meteor.Error(500, 'You need to be logged in to upvote a song');
      if (!radio || !radioId || !song || !userId) throw new Meteor.Error(500, 'Can\'t upvote, song or radio invalid');

      radio.playlist.forEach(function(s) {
        if (s.uuid === song.uuid) {
          playlistSong = s;
        }
      });

      if (!playlistSong) throw new Meteor.Error(500, 'Can\'t upvote, song invalid');

      upvotes = playlistSong.upvotes;
      downvotes = playlistSong.downvotes;

      if (!downvotes) downvotes = [];
      if (!upvotes) upvotes = [];
      if (!upvotes.length || upvotes.indexOf(userId) === -1) {
        upvotes.push(userId);
        if (downvotes.indexOf(userId) !== -1) downvotes.splice(downvotes.indexOf(userId), 1);
      }
      else upvotes.splice(upvotes.indexOf(userId), 1);

      Radios.update({_id: radioId, 'playlist.uuid': song.uuid}, {$set: {'playlist.$.downvotes': downvotes, 'playlist.$.upvotes': upvotes}});
    },

    'radio.update-config'(radioId, data) {
      if (!data) return;
      if (!Helpers.isOwner(radioId)) throw new Meteor.Error(500, 'Cannot modify this radio config');

      let config = {};

      if (data.access) config.access = data.access;
      if (data.allowVote || data.allowVote === false) config.allowVote = data.allowVote;
      if (data.skip) config.skip = data.skip;
      if (data.limitValue) config.limitValue = data.limitValue;
      if (data.limitType) config.limitType = data.limitType;
      if (data.public || data.public === false) config.public = !!data.public;
      if (data.threshold) {
        data.threshold = parseInt(data.threshold,10);
        if (data.threshold >=5 && data.threshold <= 25) config.threshold = data.threshold;
      }
      if (data.discovery || data.discovery === false) config.discovery = !!data.discovery;

      if (Object.keys(config).length > 0) Radios.update({ _id: radioId },{ $set: config });
    },

    'radio.update-users'(radioId, nbUsers) {
      if (!radioId) return;
      Radios.update({ _id: radioId },{ $set: { nbUsers: nbUsers } });
    }
  });
}