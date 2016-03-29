import $ from 'jquery';
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
      .then(this._getMusicCategoryId);

    this._loadIframeAPI()
      .then(this._initIframeAPI)
      .then(() => {
        this._loadPlayer();
        this.stop();
        if (this._config.onReady) this._config.onReady();
      });
    
    return this;
  }

  _getMusicCategoryId() {}
  
  _initAPI() {
    console.warn(`The _initAPI function should be defined for the provider '${this._config.element}'`);
  }

  _loadAPI() {
    const p = $.Deferred();

    $.getScript(this.API_URL, () => {
      p.resolve();
    });

    return p.promise();
  }

  _loadIframeAPI() {
    const p = $.Deferred();

    $.getScript(this.IFRAME_API_URL, () => {
      p.resolve();
    });

    return p.promise();
  }

  _setState(state) {
    this._playerState = state;
    if (this._config.onStateChange) this._config.onStateChange(state);
  }
}
