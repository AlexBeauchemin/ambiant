import { get } from 'lodash';

const Twitch = {
  getUser() {
    const accessToken = this._getAccessToken();
    if (!accessToken) throw new Meteor.Error(500, 'Can\'t get twitch user: Invalid access token');

    try {
      return HTTP.call(
        'get',
        'https://api.twitch.tv/kraken/user',
        { headers: { Authorization: `OAuth ${accessToken}` } }).data;
    } catch (err) {
      throw new Meteor.Error(500, `Failed to fetch identity from Twitch. ${err.error} - ${err.message}`);
    }
  },

  isFollowing(channel) {
    const accessToken = this._getAccessToken();
    const user = this.getUserTwitchName();

    if (!channel) throw new Meteor.Error(500, 'Invalid channel');
    if (!user) throw new Meteor.Error(500, 'Invalid user');
    if (!accessToken) throw new Meteor.Error(500, 'Invalid access token');

    try {
      return HTTP.call(
        'get',
        `https://api.twitch.tv/kraken/users/${user}/follows/channels/${channel}`,
        { headers: { Authorization: `OAuth ${accessToken}` } }).data;
    } catch (err) {
      if (err && err.message && err.message.indexOf('is not following') > -1) throw new Meteor.Error(404, `You are not following ${channel}`);
      else throw new Meteor.Error(500, 'Failed to get channel/follower relation.');
    }
  },

  isSubscribed(channel) {
    const accessToken = this._getAccessToken();
    const user = this.getUserTwitchName();

    if (!channel) throw new Meteor.Error(500, 'Invalid channel');
    if (!user) throw new Meteor.Error(500, 'Invalid user');
    if (!accessToken) throw new Meteor.Error(500, 'Invalid access token');

    try {
      return HTTP.call(
        'get',
        `https://api.twitch.tv/kraken/users/${user}/subscriptions/${channel}`,
        { headers: { Authorization: `OAuth ${accessToken}` } }).data;
    } catch (err) {
      if (err && err.message && err.message.indexOf('does not have a subscription program') > -1) throw new Meteor.Error(422, `${channel} does not have a subscription program.`);
      else if (err && err.message && err.message.indexOf('has no subscriptions to') > -1) throw new Meteor.Error(404, `You are not subscribed to ${channel}`);
      else throw new Meteor.Error(500, 'Failed to get channel/subscriber relation.');
    }
  },

  getUserTwitchName() {
    const user = Meteor.user();
    return get(user, 'services.twitch.name');
  },

  getUserBlockList() {
    // TODO: Get user block list
  },

  // -------------------------
  // Private functions
  // -------------------------
  _getAccessToken() {
    const user = Meteor.user();
    return get(user, 'services.twitch.accessToken');
  }
};

export default Twitch;
