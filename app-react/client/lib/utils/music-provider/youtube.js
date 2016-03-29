import $ from 'jquery';
import { map, get as _get } from 'lodash';
import Provider from './base';

const API_URL = 'https://apis.google.com/js/client.js';
const IFRAME_API_URL = 'https://www.youtube.com/iframe_api';

export default class Youtube extends Provider {
  constructor() {
    super(API_URL, IFRAME_API_URL);
    this._musicCategoryId = null;
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
    const p = $.Deferred();
    const request = gapi.client.youtube.videoCategories.list({
      regionCode: 'us',
      part: 'snippet'
    });

    request.execute((response) => {
      if (response.error) return;

      const categories = response.result.items;

      for (let i = 0; i < categories.length; i++) {
        if (categories[i].snippet.title.toLowerCase().indexOf('music') > -1) {
          this._musicCategoryId = categories[i].id;
          p.resolve();
          break;
        }
      }
    });

    return p.promise();
  }

  _initAPI() {
    const apiKey = this._config.apiKey;
    const p = $.Deferred();
    const interval = setInterval(() => {
      if (gapi && gapi.client) {
        clearInterval(interval);
        gapi.client.setApiKey(apiKey);
        gapi.client.load('youtube', 'v3', () => {
          p.resolve();
        });
      }
    }, 100);

    return p.promise();
  }

  _initIframeAPI() {
    const p = $.Deferred();
    const interval = setInterval(() => {
      if (YT && YT.Player) {
        clearInterval(interval);
        p.resolve();
      }
    }, 100);

    return p.promise();
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
