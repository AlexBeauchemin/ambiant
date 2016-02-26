import _ from 'lodash';

Meteor.methods({
  ['radio.create'](name) {
    let user = Meteor.user() || {};
    let userId = user._id;
    let isGuest = _.get(user, 'profile.guest');
    let twitchChannel = _.get(user, 'services.twitch.name');
    let currentRadio = Radios.findOne({users: userId});
    let url = name.trim()
      .substr(0,50)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    if (!name) throw new Meteor.Error(500, 'Name invalid');
    if (!userId) throw new Meteor.Error(500, 'No user');

    if (Radios.findOne({url: url})) throw new Meteor.Error(500, 'This name is already taken');
    if (currentRadio) Radios.remove(currentRadio._id);

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
        users: [userId]
      }),
      url: url
    };
  },
  ['radio.remove'](_id) {
    return Radios.remove({_id});
  }
});