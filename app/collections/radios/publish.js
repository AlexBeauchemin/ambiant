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
        fields: {name: 1, playlist: 1, twitchChannel: 1, url: 1},
        sort: {dateCreated: -1},
        limit: limit
      }
    );
  });

  Meteor.publish('top-radios', function(limit = 10) {
    //Get all users currently in a radio
    let radioIds = Presences.find({}, {fields: {'state.currentRadioId': 1}}).map((user) => {
      if (user.state && user.state.currentRadioId) return user.state.currentRadioId;
      return '';
    });

    //Group all radios
    let groupedIds = _.groupBy(radioIds, (radio) => {
      return radio;
    });
    let radioCount = [];

    //Count how many users per radio
    for (let radio in groupedIds) {
      if (radio && groupedIds.hasOwnProperty(radio)) radioCount.push({id: radio, count: groupedIds[radio].length});
    }

    //Keep only 10 radios with most users
    let top = _.sortBy(radioCount, 'count').slice(0, limit-1);

    //Get an array of the top radio id's
    radioIds = top.map((topRadio) => {
      return topRadio.id;
    });

    return Radios.find({_id: {$in: radioIds}}, {fields: {name: 1, playlist: 1, twitchChannel: 1, url: 1}});
  });
}