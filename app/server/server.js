Meteor.startup(function () {
    Radios._ensureIndex({"users": 1, "dateLastAccess": 1, "url": 1, "public": 1, "live": 1});

    allowEnv({
        NODE_ENV: 1
    });

    App.youtube.init();

    Meteor.setInterval(function () {
        Radios.find({live: 1}).forEach(function(radio) {
            let isLive = Presences.findOne({'state.currentRadioId': 'owner-' + radio._id});
            if (!isLive) Radios.update({_id: radio._id}, {$set: {live: false}})
        });
    }, 1000 * 60 * 1);
});