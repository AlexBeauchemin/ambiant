import $ from 'jquery';
import { get as _get } from 'lodash';
import Provider from './base';

const API_URL = 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js';
const IFRAME_API_URL = 'https://w.soundcloud.com/player/api.js';

export default class SoundCloud extends Provider {
  constructor() {
    super(API_URL, IFRAME_API_URL);
  }

  stop() {
    if (_get(this.player, 'pause')) this.player.pause();
    this._setState('stop');
  }

  _initAPI() {
    const apiKey = this._config.apiKey;
    const p = $.Deferred();
    const interval = setInterval(() => {
      if (SC && SC.initialize) {
        clearInterval(interval);
        SC.initialize({
          client_id: apiKey
        });
        p.resolve();
      }
    }, 100);

    return p.promise();
  }

  _initIframeAPI() {
    const p = $.Deferred();
    const interval = setInterval(() => {
      if (SC && SC.Widget) {
        clearInterval(interval);
        p.resolve();
      }
    }, 100);

    return p.promise();
  }

  _loadPlayer() {
    const iframeElement = document.getElementById(this._config.element);
    this.player = SC.Widget(iframeElement);

    if (this._config.onSongEnded) this.player.bind(SC.Widget.Events.FINISH, this._config.onSongEnded);
    if (this._config.onProgress) this.player.bind(SC.Widget.Events.PLAY_PROGRESS, this._config.onProgress);
  }
}
