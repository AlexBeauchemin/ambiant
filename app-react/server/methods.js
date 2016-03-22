import { get as _get } from 'lodash';

Meteor.methods({
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
