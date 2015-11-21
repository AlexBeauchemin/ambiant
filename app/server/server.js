Meteor.startup(function () {
  Future = Npm.require('fibers/future');

  Radios._ensureIndex({
    "users": 1,
    "dateCreated": 1,
    "dateLastAccess": 1,
    "url": 1,
    "public": 1,
    "live": 1,
    "nbUsers": 1
  });

  allowEnv({
    NODE_ENV: 1
  });

  App.youtube.init();

  //todo: remove this
  Radios.update({allowVote: {$exists: false}}, {$set: {allowVote: true}});

  Meteor.setInterval(function () {
    Radios.find({live: true}).forEach(function (radio) {
      let isLive = Presences.findOne({'state.currentRadioId': radio._id, userId: radio.users[0]});
      if (!isLive) Radios.update({_id: radio._id}, {$set: {live: false}});
    });
  }, 1000 * 60 * 1);
});