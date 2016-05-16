import uuid from 'node-uuid';
import { clone, get as _get } from 'lodash';
import Helpers from './lib/helpers.js';

const PLAYLIST_SONG_LIMIT = 300;

Meteor.methods({
  'radio.add-song-to-playlist'(song, radioId) {
    const radio = Radios.findOne(radioId);
    const res = clone(song);
    let isGuest = false;

    if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
    if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');
    if (!song || !song.id || !song.data) throw new Meteor.Error(500, 'Song invalid');

    res.user = Helpers.getUser();
    res.dateAdded = new Date();
    res.downvotes = [];
    res.upvotes = [];
    res.uuid = uuid.v4();

    if (Meteor.user() && Meteor.user().profile) isGuest = Meteor.user().profile.guest;
    if (!isGuest) res.upvotes.push(Meteor.user()._id);

    if (Helpers.isSongBlocked(radioId, res.id)) throw new Meteor.Error(500, 'This song is blocked');
    if (Helpers.isUserBlocked(radioId, res.user)) throw new Meteor.Error(500, 'Sorry, you cannot add songs to this radio');

    if (radio.playlist.length >= PLAYLIST_SONG_LIMIT) throw new Meteor.Error(500, 'Sorry, the playlist is full');

    if (!Helpers.isOwner(radioId)) {
      if (Helpers.hasUserReachedLimit(radio)) throw new Meteor.Error(500, 'You have reached your limit for this radio. Please try again later');
    }

    if (Helpers.isOwner(radioId) || Helpers.canAdd(radioId)) Radios.update({ _id: radioId }, { $push: { playlist: res } });
  },
  
  ['radio.create'](name) {
    const user = Meteor.user() || {};
    const userId = user._id;
    const isGuest = _get(user, 'profile.guest');
    const twitchChannel = _get(user, 'services.twitch.name');
    const currentRadio = Radios.findOne({ users: userId });
    const url = name.trim()
      .substr(0, 50)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    if (!name) throw new Meteor.Error(500, 'Name invalid');
    if (!userId) throw new Meteor.Error(500, 'No user');

    if (Radios.findOne({ url })) throw new Meteor.Error(500, 'This name is already taken');
    if (currentRadio) Radios.remove(currentRadio._id);

    return {
      url,
      res: Radios.insert({
        isGuest,
        name,
        twitchChannel,
        url,
        access: 'all', // all, users, twitch, follow, subscribe or moderators
        allowVote: true,
        blacklistedSongs: [],
        blacklistedUsers: [],
        dateCreated: new Date(),
        dateLastAccess: new Date(),
        discovery: true,
        limitType: 'number', // number or time
        limitValue: 5,
        live: false,
        moderators: [],
        nbUsers: 0,
        playlist: [], // current playlist
        playlistEnded: [], // past songs
        public: true,
        skip: 'admin', // admin, all
        songs: [], // list of songs added, minus related songs (automatically added at the end of the playlist
        threshold: 10,
        users: [userId]
      })
    };
  },
  
  ['radio.remove'](_id) {
    return Radios.remove({ _id });
  }
});
