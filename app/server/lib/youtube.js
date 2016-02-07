App.youtube = (function() {
  const Youtube = {
    // -------------------------
    // Variables
    // -------------------------

    musicCategoryId: 10,

    // -------------------------
    // Public functions
    // -------------------------

    init() {
      YoutubeApi.authenticate({
        type: 'key',
        key: App.config.youtubeApiKey
      });

      this.getMusicCategoryId();
    },

    findRelated(songId, maxResult, blacklistedSongs, callback) {
      let _this = this;

      if (!songId) {
        callback(null);
        throw new Meteor.Error(500, {message: 'can\'t find related, no id provided'});
      }

      YoutubeApi.search.list({
        relatedToVideoId: songId,
        part: 'snippet',
        type: 'video',
        maxResults: maxResult,  //0 to 50
        videoCategoryId: _this.musicCategoryId
      }, (err, data) => {
          if (err) {
            callback(null);
            throw new Meteor.Error(500, {message: 'can\'t find related', info: err});
          }
          if (data && data.items) {
            data.items.push({id: {videoId: songId}}); // Put the reference song in the related list so it can play again
            let id = "";
            let foundRelated = false;

            while(data.items && foundRelated === false) {
              let index = Math.floor(Math.random() * data.items.length);
              let randomSong = data.items[index];
              id = randomSong.id.videoId;

              if (blacklistedSongs.indexOf(id) !== -1) data.items.splice(index,1);
              else foundRelated = true;
            }

            if (!id) return callback(null);

            _this.getSongInfo(id, function(songInfo) {
              callback({ id: id, type: 'related', data: songInfo });
            });
          }
      });
    },

    getSongInfo(id, callback) {
      const _this = this;

      YoutubeApi.videos.list({
        id: id,
        part: 'snippet,contentDetails',
        type: 'video',
        maxResults: 1
      }, function(err, response) {
        if (err) return console.log("Can't find related", err);
        if (!response || !response.items) return;

        const info = _this.getSongDetails(response.items[0]);

        if (callback) callback(info);
      });
    },

    // -------------------------
    // Private functions
    // -------------------------

    //Add leading 0 if number < 10
    formatTime(time) {
      time = parseInt(time,10);
      if (time<10) return '0' + time;
      return time;
    },

    getMusicCategoryId() {
      let _this = this;

      YoutubeApi.videoCategories.list({
        regionCode: 'us',
        part: 'snippet'
      }, function(err,data) {
        if (err) return console.log(err);
        let categories = data.items;

        for (let i = 0; i < categories.length; i++) {
          if (categories[i].snippet.title.toLowerCase().indexOf('music') > -1) {
            _this.musicCategoryId = categories[i].id;
            break;
          }
        }
      });
    },

    getSongDetails(data) {
      let info = _.extend(data.snippet, data.contentDetails);
      let duration = null;

      if (info.duration) {
        duration = moment.duration(info.duration);
        info.duration = Math.floor(duration.asMinutes()) + ':' + this.formatTime(duration.seconds());
      }

      if (info.thumbnails && info.thumbnails.default) info.thumbnails = _.pick(info.thumbnails, ['default', 'high']);

      return _.pick(info, ['title', 'thumbnails', 'duration', 'licensedContent', 'regionRestriction']);
    }
  };

  return {
    init: Youtube.init.bind(Youtube),
    findRelated: Youtube.findRelated.bind(Youtube),
    getSongInfo: Youtube.getSongInfo.bind(Youtube)
  };
})();