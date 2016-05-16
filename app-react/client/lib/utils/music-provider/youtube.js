import moment from 'moment';
import { Promise } from 'es6-promise';
import { extend, isEmpty, map, pick, get as _get } from 'lodash';

import Provider from './base';

const API_URL = 'https://apis.google.com/js/client.js';
const IFRAME_API_URL = 'https://www.youtube.com/iframe_api';

export default class Youtube extends Provider {
  constructor() {
    super(API_URL, IFRAME_API_URL);
    this.name = 'youtube';
    this._musicCategoryId = null;
  }

  getSongInfo(id) {
    return new Promise((resolve, reject) => {
      if (!_get(window, 'gapi.client.youtube')) return reject('Youtube API is not accessible');

      const requestSettings = {
        id,
        part: 'snippet,contentDetails',
        type: 'video',
        maxResults: 1
      };
      const request = gapi.client.youtube.videos.list(requestSettings);

      request.execute((response) => {
        if (!response || isEmpty(response.items)) {
          return reject('Cannot retrieve song information');
        }

        resolve([this._getSongDetails(response.items[0])]);
      });
    });
  }

  search(q, callback) {
    const videoCategoryId = this._musicCategoryId;

    if (!window.gapi || !window.gapi.client.youtube) {
      Materialize.toast('Google api is not accessible', 5000);
      return;
    }

    const request = gapi.client.youtube.search.list({
      q,
      videoCategoryId,
      part: 'snippet',
      type: 'video',
      maxResults: 10
    });

    request.execute((response) => {
      const res = map(response.items, (song) => {
        return {
          id: _get(song, 'id.videoId'),
          title: _get(song, 'snippet.title')
        };
      });

      if (callback) callback(res);
    });
  }

  stop() {
    if (_get(this.player, 'stopVideo')) this.player.stopVideo();
    this._setState('stop');
  }

  _getMusicCategoryId() {
    const request = gapi.client.youtube.videoCategories.list({
      regionCode: 'us',
      part: 'snippet'
    });

    return new Promise((resolve, reject) => {
      request.execute((response) => {
        if (response.error) reject();

        const categories = response.result.items;

        for (let i = 0; i < categories.length; i++) {
          if (categories[i].snippet.title.toLowerCase().indexOf('music') > -1) {
            this._musicCategoryId = categories[i].id;
            resolve();
            break;
          }
        }
      });
    });
  }

  // TODO: Duplicate from server/lib/youtube.js
  _getSongDetails(data) {
    const info = extend(data.snippet, data.contentDetails);
    const duration = info.duration ? moment.duration(info.duration) : null;
    const minutes = duration ? Math.floor(duration.asMinutes()) : '00';
    const seconds = duration ? this._formatTime(duration.seconds()) : '00';

    info.duration = `${minutes}:${seconds}`;

    if (_get(info, 'thumbnails.default')) info.thumbnails = pick(info.thumbnails, ['default', 'high']);

    return pick(info, ['title', 'thumbnails', 'duration', 'licensedContent', 'regionRestriction']);
  }

  _initAPI() {
    const apiKey = this._config.apiKey;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (gapi && gapi.client) {
          clearInterval(interval);
          gapi.client.setApiKey(apiKey);
          gapi.client.load('youtube', 'v3', () => {
            resolve();
          });
        }
      }, 100);
    });
  }

  _initIframeAPI() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (YT && YT.Player) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  _loadPlayer() {
    const element = this._config.element;
    const _this = this;

    this.player = new YT.Player(element, {
      height: '100%',
      width: '100%',
      events: {
        // 'onReady': _this.playVideo,
        onStateChange: _this._onPlayerStateChange.bind(this),
        onError: _this._onPlayerError.bind(this)
      }
    });
  }

  _onPlayerError(e) {
    let message = 'Sorry, an error occured with the youtube player. ';

    switch (e.data) {
      case 2:
        message += 'The video id is invalid. ';
        break;
      case 5:
        message += 'The requested content cannot be played in an HTML5 player. ';
        break;
      case 100:
        message += 'The video requested was not found, it may have been removed or made private. ';
        break;
      case 101:
      case 105:
        message += 'The owner of the requested video does not allow it to be played in embedded players. ';
    }

    message += 'The song will be skipped';
    Materialize.toast(`${message} (code ${e.data})`, 10000);

    if (this._config.onSongError) this._config.onSongError();
    this.stop();
  }

  _onPlayerStateChange(e) {
    if (e.data === YT.PlayerState.ENDED) {
      if (this._config.onSongEnded) this._config.onSongEnded();
    }
  }
}
