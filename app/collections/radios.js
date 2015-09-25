Radios = new Mongo.Collection("radios");

if(Meteor.isClient) {
    //Stub methods for faster auto-corrected results
    Meteor.methods({
        //...
    });
}

if(Meteor.isServer) {
    var Future = Npm.require('fibers/future');

    Meteor.publish("radios", function () {
        return Radios.find({public: true});
    });

    Meteor.publish("my-radio", function () {
        return Radios.find({users: this.userId});
    });

    Meteor.methods({
        getEnvironment: function() {
            if (process.env.ROOT_URL.indexOf('localhost') > -1) return 'dev';
            return 'prod';
        },
        createRadio: function(name) {
            var users = [];
            var twitchChannel = null;
            name = name.trim().substr(0,50);
            var url = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

            if (!name) throw new Meteor.Error(500, 'Name invalid');
            if (!Meteor.user() || !Meteor.user()._id) throw new Meteor.Error(500, 'No user');

            if (Meteor.user()) {
                users = [Meteor.user()._id];
                if (Meteor.user().services && Meteor.user().services.twitch) {
                    twitchChannel = Meteor.user().services.twitch.name;
                }
            }

            if (Radios.findOne({url: url})) throw new Meteor.Error(500, 'This name is already taken');

            return {
                res: Radios.insert({
                    access: "all", // all, users, twitch, follow, subscribe or whitelist
                    blacklistedSongs: [],
                    blacklistedUsers: [],
                    dateCreated: new Date(),
                    dateLastAccess: new Date(),
                    name: name,
                    playlist: [], //current playlist
                    playlistEnded: [], //past songs
                    public: true,
                    songs: [], //list of songs added, minus related songs (automatically added at the end of the playlist
                    threshold: 10,
                    twitchChannel: twitchChannel,
                    url: url,
                    users: users,
                    whitelist: []
                }),
                url: url
            }
        },
        addSongToPlaylist: function(song, radioId) {
            if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!song || !song.id || !song.data) throw new Meteor.Error(500, 'Song invalid');

            song.user = getUser();

            if (isSongBlocked(radioId, song.id)) throw new Meteor.Error(500, 'This song is blocked');
            if (isUserBlocked(radioId, song.user)) throw new Meteor.Error(500, 'Sorry, you cannot add songs to this radio');

            if (isOwner(radioId) || canAdd(radioId)) Radios.update({ _id: radioId },{ $push: { playlist: song, songs: song.id }});
        },
        blockSong: function(radioId, songId) {
            if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot use blacklist functions on this radio');

            Radios.update({ _id: radioId },{$pull: {songs: songId, playlist: {id: songId}}});
            Radios.update({ _id: radioId },{$push: {blacklistedSongs: songId}});
            return true;
        },
        blockUser: function(radioId, user) {
            if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot use blacklist functions on this radio');
            if (user.id === Meteor.user()._id) throw new Meteor.Error(500, 'You cannot blacklist yourself');

            Radios.update({ _id: radioId },{$push: {blacklistedUsers: user}});
            return true;
        },
        clearRadio: function(radioId) {
            if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot clear this radio');

            Radios.update({ _id: radioId },{ $set: {playlist: [], songs: [], playlistEnded: [] }});
        },
        deleteRadio: function(radioId) {
            if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot delete this radio');

            Radios.remove(radioId);
        },
        deleteSong: function(radioId, songId) {
            if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot delete songs on this radio');

            Radios.update({ _id: radioId },{$pull: {songs: songId, playlist: {id: songId}}});
        },
        getNextSong: function(radioId) {
            if (!radioId) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot skip on this radio');

            var radio = Radios.findOne(radioId);
            if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');

            radio.playlistEnded.push(radio.playlist[0]);
            radio.playlist.shift();

            Radios.update({ _id: radioId },{ $set: {
                playlist: radio.playlist,
                playlistEnded: radio.playlistEnded,
                dateLastAccess: new Date()
            }});

            if (!radio.playlist.length) return findRelated(radio);
            return radio.playlist[0];
        },
        updateConfig: function(radioId, data) {
            if (!data) return;
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot modify this radio config');

            var config = {};

            if (data.access) config.access = data.access;
            if (data.public || data.public === false) config.public = !!data.public;
            if (data.threshold) {
                data.threshold = parseInt(data.threshold,10);
                if (data.threshold >=5 && data.threshold <= 25) config.threshold = data.threshold;
            }

            if (Object.keys(config).length > 0) Radios.update({ _id: radioId },{ $set: config });
        }
    });

    var canAdd = function canAdd(radioId) {
        var radio = Radios.findOne(radioId);
        var user = Meteor.user();
        var userTwitch = null;
        var hasAccess = false;

        if (!radio) throw new Meteor.Error(500, 'Cannot find this radio');
        if (user.services && user.services.twitch) userTwitch = user.services.twitch;

        switch (radio.access) {
            case "all":
                hasAccess = true;
                break;
            case "twitch":
                if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
                hasAccess = true;
                break;
            case "follow":
                if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
                App.twitch.isFollowing(radio.twitchChannel);
                hasAccess = true;
                break;
            case "subscribe":
                if (!userTwitch) throw new Meteor.Error(700, 'You need to be connected to a Twitch account to add songs to this playlist, please login with your Twitch account');
                App.twitch.isSubscribed(radio.twitchChannel);
                hasAccess = true;
                break;
        }

        return hasAccess;
    };

    var findRelated = function findRelated(radio) {
        var randomSong = null;

        //TODO: Do not allow blocked songs

        if (radio && !radio.playlist.length && radio.songs) {
            randomSong = radio.songs[Math.floor(Math.random() * radio.songs.length)];

            var fut = new Future();
            var bound_callback = Meteor.bindEnvironment(function (res) {
                if (res) {
                    fut.return(Radios.update({ _id: radio._id}, { $push: { playlist: res }}));
                }  else {
                    fut.throw('error while finding related songs');
                }
            });
            App.youtube.findRelated(randomSong, radio.threshold, bound_callback);
            fut.wait();
        }
    };

    var getUser = function getUsername() {
        var user = {
            name: App.twitch.getUserTwitchName(),
            email: null,
            id: Meteor.user()._id
        };

        if (!user.name && Meteor.user().profile) user.name = Meteor.user().profile.name;
        if (!user.name) user.name = "Guest";

        if (Meteor.user().services && Meteor.user().services.twitch) user.email = Meteor.user().services.twitch.email;
        if (!user.email && Meteor.user().profile && !Meteor.user().profile.guest) user.email = Meteor.user().emails[0].address;

        return user;
    };

    var isOwner = function isOwner(radioId) {
        if (!radioId) return false;

        return !!Radios.findOne({_id: radioId, users: Meteor.user()._id});
    };

    var isSongBlocked = function isSongBlocked(radioId, songId) {
        var radio = Radios.findOne({_id: radioId});

        if (!radio) return false;

        if (radio.blacklistedSongs.indexOf(songId) > -1) return true;
        return false;
    };

    var isUserBlocked = function isUserBlocked(radioId, user) {
        var radio = Radios.findOne({_id: radioId}),
            isBlacklisted = false;

        if (!radio) return false;

        radio.blacklistedUsers.forEach(function(blacklistedUser) {
            if (user.id === blacklistedUser.id) isBlacklisted = true;
            if (user.email && user.email === blacklistedUser.email) isBlacklisted = true;
        });

        return isBlacklisted;
    };
}