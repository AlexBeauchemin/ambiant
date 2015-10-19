Radios = new Mongo.Collection("radios");

if(Meteor.isClient) {
    //Stub methods for faster auto-corrected results
    Meteor.methods({
        //...
    });
}

if(Meteor.isServer) {
    var Future = Npm.require('fibers/future');

    Meteor.publish("radio", function (url) {
        return Radios.find({url: url});
    });

    Meteor.publish("my-radio", function () {
        return Radios.find({users: this.userId});
    });

    Meteor.publish('top-radios', function() {
        //Get all users currently in a radio
        var radioIds = Presences.find({}, { fields: { 'state.currentRadioId': 1 } }).map(function(user) {
            if (user.state && user.state.currentRadioId) return user.state.currentRadioId;
            return '';
        });

        //Group all radios
        var groupedIds = _.groupBy(radioIds, function(radio){ return radio; });
        var radioCount = [];

        //Count how many users per radio
        for (var radio in groupedIds) {
            if (radio) radioCount.push({ id: radio, count: groupedIds[radio].length});
        };

        //Keep only 10 radios with most users
        var top = _.sortBy(radioCount, 'count').slice(0,9);

        //Get an array of the top radio id's
        radioIds = top.map(function(topRadio) {
            return topRadio.id;
        });

        return Radios.find({ _id: {$in: radioIds}}, { fields: { name: 1, playlist: 1, twitchChannel: 1, url: 1 }});
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
                    limitType: 'number', //number or time
                    limitValue: 5,
                    live: 0,
                    name: name,
                    playlist: [], //current playlist
                    playlistEnded: [], //past songs
                    public: true,
                    skip: "admin", // admin, all
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
            song.dateAdded = new Date();

            if (isSongBlocked(radioId, song.id)) throw new Meteor.Error(500, 'This song is blocked');
            if (isUserBlocked(radioId, song.user)) throw new Meteor.Error(500, 'Sorry, you cannot add songs to this radio');

            let radio = Radios.findOne(radioId);

            if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');
            if (radio.playlist.length >= 100) throw new Meteor.Error(500, 'Sorry, the playlist is full');

            if (!isOwner(radioId)) {
                if (hasUserReachedLimit(radio)) throw new Meteor.Error(500, 'You have reached your limit for this radio. Please try again later');
            }

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

            let radio = Radios.findOne(radioId);

            if (!radio) throw new Meteor.Error(500, 'Cannot access this radio');
            if (!isOwner(radioId) && radio.skip === "admin") throw new Meteor.Error(500, 'Cannot skip on this radio');

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
        goLive: function(radioId) {
          if (isOwner(radioId)) Radios.update({_id: radioId}, {$set: {live: true}}) ;
        },
        goOffline: function(radioId) {
            if (isOwner(radioId)) Radios.update({_id: radioId}, {$set: {live: false}}) ;
        },
        updateConfig: function(radioId, data) {
            if (!data) return;
            if (!isOwner(radioId)) throw new Meteor.Error(500, 'Cannot modify this radio config');

            var config = {};

            if (data.access) config.access = data.access;
            if (data.skip) config.skip = data.skip;
            if (data.limitValue) config.limitValue = data.limitValue;
            if (data.limitType) config.limitType = data.limitType;
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
        if (!Meteor.user()) return false;

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

    var hasUserReachedLimit = function hasUserReachedLimit(radio) {
        if (radio.limitType === "number") {
            let count = 0;

            radio.playlist.forEach(function(song) {
                if (song.user && song.user.id === Meteor.user()._id) count++;
            });

            if (count >= radio.limitValue) return true;
        }
        else {
            if (radio.playlist.length) {
                let hasEnded = false;
                let count = 0;
                let song = null;

                while (!hasEnded) {
                    song = radio.playlist[radio.playlist.length - (count + 1)];
                    count++;
                    if (count === radio.playlist.length) hasEnded = true;
                    if (song.user && song.user.id === Meteor.user()._id) {
                        let now = new Date().getTime();
                        let minutesFromNow = Math.floor((now - song.dateAdded.getTime()) / (1000 * 60));

                        if (minutesFromNow <= parseInt(radio.limitValue,10)) return true;
                        hasEnded = true;
                    }
                }
            }
        }

        return false;
    }
}