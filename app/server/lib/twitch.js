Meteor.methods({
  isFollowingChannel: function isFollowingChannel(channel) {
    return App.twitch.isFollowing(channel);
  },
  isSubscribedChannel: function isSubscribedChannel(channel) {
    return App.twitch.isSubscribed(channel);
  }
});

App.twitch = (function() {
  var Twitch = {
    // -------------------------
    // Variables
    // -------------------------



    // -------------------------
    // Public functions
    // -------------------------

    getUser: function getUser() {
      var accessToken = this.getAccessToken();
      if (!accessToken) throw new Meteor.Error(500, 'Can\'t get twitch user: Invalid access token');

      try {
        return HTTP.call(
            "get",
            "https://api.twitch.tv/kraken/user",
            {headers: {"Authorization": "OAuth " + accessToken}}).data;
      } catch (err) {
        throw new Meteor.Error(500, "Failed to fetch identity from Twitch. " + err.error + " - " + err.message);
      }
    },

    isFollowing: function isFollowing(channel) {
      var accessToken = this.getAccessToken();
      var user = this.getUserTwitchName();
      if (!channel) throw new Meteor.Error(500, 'Invalid channel');
      if (!user) throw new Meteor.Error(500, 'Invalid user');
      if (!accessToken) throw new Meteor.Error(500, 'Invalid access token');

      try {
        return HTTP.call(
          "get",
          "https://api.twitch.tv/kraken/users/" + user + "/follows/channels/" + channel,
          {headers: {"Authorization": "OAuth " + accessToken}}).data;
      } catch (err) {
        if (err && err.message && err.message.indexOf("is not following") > -1) throw new Meteor.Error(404, "You are not following " + channel);
        else throw new Meteor.Error(500, "Failed to get channel/follower relation.");
      }
    },

    isSubscribed: function isSubscribed(channel) {
      var accessToken = this.getAccessToken();
      var user = this.getUserTwitchName();
      if (!channel) throw new Meteor.Error(500, 'Invalid channel');
      if (!user) throw new Meteor.Error(500, 'Invalid user');
      if (!accessToken) throw new Meteor.Error(500, 'Invalid access token');

      try {
        return HTTP.call(
            "get",
            "https://api.twitch.tv/kraken/users/" + user + "/subscriptions/" + channel,
            {headers: {"Authorization": "OAuth " + accessToken}}).data;
      } catch (err) {
        if (err && err.message && err.message.indexOf("does not have a subscription program") > -1) throw new Meteor.Error(422, channel + " does not have a subscription program.");
        else if (err && err.message && err.message.indexOf("has no subscriptions to") > -1) throw new Meteor.Error(404, "You are not subscribed to " + channel);
        else throw new Meteor.Error(500, "Failed to get channel/subscriber relation.");
      }
    },

    getUserTwitchName: function getUserTwitchName() {
      if (!Meteor.user() || !Meteor.user().services || !Meteor.user().services.twitch) return false;
      return Meteor.user().services.twitch.name;
    },

    getUserBlockList: function getUserBlockList() {

    },

    // -------------------------
    // Private functions
    // -------------------------
    getAccessToken: function getAccessToken() {
      var user = Meteor.user();

      if (!user || !user._id || !user.services || !user.services.twitch) return false;
      return user.services.twitch.accessToken;
    }
  };

  return {
    getUser: Twitch.getUser.bind(Twitch),
    getUserBlockList: Twitch.getUserBlockList.bind(Twitch),
    getUserTwitchName: Twitch.getUserTwitchName.bind(Twitch),
    isFollowing: Twitch.isFollowing.bind(Twitch),
    isSubscribed: Twitch.isSubscribed.bind(Twitch)
  };
})();