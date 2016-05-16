import { get } from 'lodash';
import uuid from 'node-uuid';
import { Future } from 'fibers';
import Twitch from './twitch.js';
import Youtube from './youtube.js';

const Helpers = {
  canAdd(radioId) {
    const radio = Radios.findOne(radioId);
    const user = Meteor.user();
    let userTwitch = null;
    let hasAccess = false;

    if (!radio) throw new Meteor.Error(500, 'Cannot find this radio');
    if (get(user, 'services.twitch')) userTwitch = user.services.twitch;

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
        Twitch.isFollowing(radio.twitchChannel);
        hasAccess = true;
        break;
      case 'subscribe':
        if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
        Twitch.isSubscribed(radio.twitchChannel);
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
      default: hasAccess = false;
    }

    return hasAccess;
  },

  findRelated(radio, callback) {
    if (!radio) return;
    
    const songs = _.filter(radio.songs, (item) => {
      return get(item, 'domain') !== 'soundcloud';
    });
    let randomSong = null;

    if (!radio.playlist.length && _.isEmpty(songs) && radio.songs.length) {
      throw new Meteor.Error(500, 'Sorry, song discovery is not available for soundcloud playlists for the moment');
    }

    if (!radio.playlist.length && radio.songs) {
      randomSong = songs[Math.floor(Math.random() * radio.songs.length)];

      const songId = get(randomSong, 'id') || randomSong;
      const fut = new Future();
      const boundCallback = Meteor.bindEnvironment((res) => {
        if (callback) callback(res);
        if (res) {
          const newSong = Object.assign({}, res, { uuid: uuid.v4() });
          fut.return(Radios.update({ _id: radio._id }, { $push: { playlist: newSong } }));
        } else {
          fut.return(null);
        }
      });

      if (radio.discovery) Youtube.findRelated(songId, radio.threshold, radio.blacklistedSongs, boundCallback);
      else {
        Youtube.getSongInfo(songId, (songInfo) => {
          boundCallback({ id: songId, type: 'related', data: songInfo });
        });
      }

      fut.wait();
    }
  },

  getUser() {
    const meteorUser = Meteor.user();
    const user = {
      name: Twitch.getUserTwitchName(),
      email: null,
      id: meteorUser._id
    };

    if (!user.name && meteorUser.profile) user.name = meteorUser.profile.name;
    if (!user.name) user.name = 'Guest';

    if (get(meteorUser, 'services.twitch')) user.email = meteorUser.services.twitch.email;
    if (get(meteorUser, 'services.google')) user.email = meteorUser.services.google.email;
    if (get(meteorUser, 'services.facebook')) user.email = meteorUser.services.facebook.email;
    if (!user.email && meteorUser.profile && !meteorUser.profile.guest) user.email = meteorUser.emails[0].address;

    return user;
  },

  isOwner(radioId) {
    if (!radioId) return false;
    if (!Meteor.user()) return false;

    return !!Radios.findOne({ _id: radioId, users: Meteor.user()._id });
  },

  isModerator(radioId) {
    if (!radioId) return false;
    if (!Meteor.user()) return false;

    const email = this.getUser().email;
    let name = Twitch.getUserTwitchName();

    if (name) name = name.toLowerCase();

    if (name) return !!Radios.findOne({ _id: radioId, moderators: name });
    return !!Radios.findOne({ _id: radioId, moderators: email });
  },

  isSongBlocked(radioId, songId) {
    const radio = Radios.findOne({ _id: radioId });
    if (!radio) return false;
    return radio.blacklistedSongs.indexOf(songId) > -1;
  },

  isUserBlocked(radioId, user) {
    const radio = Radios.findOne({ _id: radioId });
    let isBlacklisted = false;

    if (!radio) return false;

    radio.blacklistedUsers.forEach((blacklistedUser) => {
      if (user.id === blacklistedUser.id) isBlacklisted = true;
      if (user.email && user.email === blacklistedUser.email) isBlacklisted = true;
    });

    return isBlacklisted;
  },

  hasUserReachedLimit(radio) {
    if (radio.limitType === 'number') {
      let count = 0;

      radio.playlist.forEach((song) => {
        if (song.user && song.user.id === Meteor.user()._id) count++;
      });

      if (count >= radio.limitValue) return true;
    } else if (radio.playlist.length) {
      let hasEnded = false;
      let count = 0;
      let song = null;

      while (!hasEnded) {
        song = radio.playlist[radio.playlist.length - (count + 1)];
        count++;
        if (count === radio.playlist.length) hasEnded = true;
        if (song.user && song.user.id === Meteor.user()._id) {
          const now = new Date().getTime();
          const minutesFromNow = Math.floor((now - song.dateAdded.getTime()) / (1000 * 60));

          if (minutesFromNow <= parseInt(radio.limitValue, 10)) return true;
          hasEnded = true;
        }
      }
    }

    return false;
  }
};

export default Helpers;
