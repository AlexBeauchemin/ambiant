import { Promise } from 'es6-promise';
import { merge } from 'lodash';

export default class Provider {
  constructor(API_URL, IFRAME_API_URL) {
    this.API_URL = API_URL;
    this.IFRAME_API_URL = IFRAME_API_URL;

    this.player = null;
    this._playerState = 'loading'; // stop, play, pause, loading
    this._config = {
      apiKey: '',
      element: 'player', // ID of the dom element,
      onProgress: null,
      onReady: null,
      onSongError: null,
      onSongEnded: null,
      onStateChange: null
    };
  }

  init(config) {
    this._config = merge(this._config, config);

    if (!this._config.apiKey) {
      console.log('Please provide an API key!');
      return;
    }

    this._loadAPI()
      .then(this._initAPI.bind(this))
      .then(this._getMusicCategoryId.bind(this));

    this._loadIframeAPI()
      .then(this._initIframeAPI)
      .then(() => {
        this._loadPlayer();
        this.stop();
        if (this._config.onReady) this._config.onReady();
      });

    return this;
  }

  // TODO: Duplicate from server/lib/youtube.js
  _formatTime(time) {
    const formattedTime = parseInt(time, 10);
    if (formattedTime < 10) return `0${formattedTime}`;
    return formattedTime;
  }

  _getMusicCategoryId() {}

  _getScript(source) {
    let script = document.createElement('script');
    const prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    prior.parentNode.insertBefore(script, prior);

    return new Promise((resolve) => {
      script.onload = script.onreadystatechange = (_, isAbort) => {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
          script.onload = script.onreadystatechange = null;
          script = undefined;

          if (!isAbort) resolve();
        }
      };

      script.src = source;
    });
  }

  _initAPI() {
    console.warn(`The _initAPI function should be defined for the provider '${this._config.element}'`);
  }

  _loadAPI() {
    return this._getScript(this.API_URL);
  }

  _loadIframeAPI() {
    return this._getScript(this.IFRAME_API_URL);
  }

  _setState(state) {
    this._playerState = state;
    if (this._config.onStateChange) this._config.onStateChange(state);
  }
}
