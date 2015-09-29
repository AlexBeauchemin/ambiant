Meteor.startup(function () {
    Radios._ensureIndex({"users": 1, "dateLastAccess": 1, "url": 1, "public": 1});

    allowEnv({
        NODE_ENV: 1
    });

    App.youtube.init();

});