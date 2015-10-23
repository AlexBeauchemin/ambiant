if (Meteor.isServer) {
  Meteor.publish("radio", function(url) {
    return Radios.find({url: url});
  });

  Meteor.publish("my-radio", function() {
    return Radios.find({users: this.userId});
  });

  Meteor.publish("new-radios", function(limit = 10) {
    return Radios.find({
        public: {$eq: true},
        live: {$eq: true},
        playlist: {$not: {$size: 0}}
      }, {
        fields: {name: 1, playlist: 1, twitchChannel: 1, url: 1, nbUsers: 1},
        sort: {dateCreated: -1},
        limit: limit
      }
    );
  });

  Meteor.publish("twitch-radios", function(limit = 10) {
    return Radios.find({
          public: {$eq: true},
          live: {$eq: true},
          twitchChannel: {$ne: null},
          playlist: {$not: {$size: 0}}
        }, {
          fields: {name: 1, playlist: 1, twitchChannel: 1, url: 1, nbUsers: 1},
          sort: {nbUsers: -1},
          limit: limit
        }
    );
  });

  Meteor.publish('top-radios', function(limit = 10) {
    return Radios.find({
          public: {$eq: true},
          live: {$eq: true},
          playlist: {$not: {$size: 0}}
        }, {
          fields: {name: 1, playlist: 1, twitchChannel: 1, url: 1, nbUsers: 1},
          sort: {nbUsers: -1},
          limit: limit
        }
    );
  });
}