import YoutubeAPI from 'youtube-api';
import { extend, get, pick } from 'lodash';
import moment from 'moment';

const Youtube = {
  // -------------------------
  // Variables
  // -------------------------

  musicCategoryId: 10,

  // -------------------------
  // Public functions
  // -------------------------

  init() {
    YoutubeAPI.authenticate({
      type: 'key',
      key: get(Meteor.settings, 'public.youtubeApiKey')
    });

    this.getMusicCategoryId();
  },

  findRelated(songId, maxResult, blacklistedSongs, callback) {
    const _this = this;

    if (!songId) {
      callback(null);
      throw new Meteor.Error(500, { message: 'can\'t find related, no id provided' });
    }

    YoutubeAPI.search.list({
      relatedToVideoId: songId,
      part: 'snippet',
      type: 'video',
      maxResults: maxResult,  // 0 to 50
      videoCategoryId: _this.musicCategoryId
    }, (err, data) => {
      if (err) {
        callback(null);
        throw new Meteor.Error(500, { message: 'can\'t find related', info: err });
      }
      if (data && data.items) {
        data.items.push({ id: { videoId: songId } }); // Put the reference song in the related list so it can play again
        let id = '';
        let foundRelated = false;

        while (data.items && foundRelated === false) {
          const index = Math.floor(Math.random() * data.items.length);
          const randomSong = data.items[index];
          id = randomSong.id.videoId;

          if (blacklistedSongs.indexOf(id) !== -1) data.items.splice(index, 1);
          else foundRelated = true;
        }

        if (!id) return callback(null);

        _this.getSongInfo(id, (songInfo) => {
          callback({ id, type: 'related', data: songInfo });
        });
      }
    });
  },

  getSongInfo(id, callback) {
    const _this = this;

    YoutubeAPI.videos.list({
      id,
      part: 'snippet,contentDetails',
      type: 'video',
      maxResults: 1
    }, function (err, response) {
      if (err) return console.log('Can\'t find related', err);
      if (!response || !response.items) return;

      const info = _this.getSongDetails(response.items[0]);

      if (callback) callback(info);
    });
  },

  // -------------------------
  // Private functions
  // -------------------------

  // TODO: Duplicate from music-provider/base.js
  // Add leading 0 if number < 10
  formatTime(time) {
    const res = parseInt(time, 10);
    if (res < 10) return `0${res}`;
    return res;
  },

  getMusicCategoryId() {
    let _this = this;

    YoutubeAPI.videoCategories.list({
      regionCode: 'us',
      part: 'snippet'
    }, function (err, data) {
      if (err) return console.log(err);
      const categories = data.items;

      for (let i = 0; i < categories.length; i++) {
        if (categories[i].snippet.title.toLowerCase().indexOf('music') > -1) {
          _this.musicCategoryId = categories[i].id;
          break;
        }
      }
    });
  },

  // TODO: Duplicate from music-provider/youtube.js
  getSongDetails(data) {
    const info = extend(data.snippet, data.contentDetails);
    const duration = info.duration ? moment.duration(info.duration) : null;
    const minutes = duration ? Math.floor(duration.asMinutes()) : '00';
    const seconds = duration ? this._formatTime(duration.seconds()) : '00';

    info.duration = `${minutes}:${seconds}`;

    if (get(info, 'thumbnails.default')) info.thumbnails = pick(info.thumbnails, ['default', 'high']);

    return pick(info, ['title', 'thumbnails', 'duration', 'licensedContent', 'regionRestriction']);
  }
};

export default Youtube;
