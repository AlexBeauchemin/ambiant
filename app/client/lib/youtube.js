App.youtube = (function () {
  const API_URL = "https://apis.google.com/js/client.js";
  const IFRAME_API_URL = "https://www.youtube.com/iframe_api";

  var Youtube = {
    config: {
      apiKey: '',
      element: 'youtube-player', //ID of the dom element,
      onReady: null,
      onSongError: null,
      onSongEnded: null,
      onStateChange: null
    },

    // -------------------------
    // Variables
    // -------------------------
    musicCategoryId: null,
    playerState: 'loading', //stop, play, pause, loading
    player: null,

    // -------------------------
    // Public functions
    // -------------------------
    init(config) {
      $.extend(this.config, config);

      if (!this.config.apiKey) {
        console.log('Please provide an API key!');
        return;
      }

      this.loadAPI()
        .then(this.initAPI.bind(this))
        .then(this.getMusicCategoryId);

      this.loadIframeAPI()
        .then(this.initIframeAPI)
        .then(() => {
          this.loadPlayer();
          this.stop();
          if (this.config.onReady) this.config.onReady();
        });
    },

    //if the video is a youtube url, parse and return the video id
    //else : assume that the url is a valid youtube id and return it
    getSongIdFromUrl(url) {
      let videoId,
        ampersandPosition;

      if (!url) return false;

      if (url.indexOf('?v=') !== -1) videoId = url.split('?v=')[1];
      else if (url.indexOf('youtu.be/') !== -1) videoId = url.split('youtu.be/')[1];

      if (!videoId) return url;

      ampersandPosition = videoId.indexOf('&');

      if (ampersandPosition !== -1) videoId = videoId.substring(0, ampersandPosition);

      return videoId;
    },

    getSongInfo(id, callback) {
      if (!window.gapi || !window.gapi.client.youtube) {
        Materialize.toast("Google api is not accessible", 5000);
        return callback(null);
      }

      let request = gapi.client.youtube.videos.list({
        id: id,
        part: 'snippet,contentDetails',
        type: 'video',
        maxResults: 1
      });

      request.execute((response) => {
        if (!response || !response.items || !response.items.length) {
          Materialize.toast("Cannot retrieve song information", 5000);
          return callback(null);
        }

        let info = this.getSongDetails(response.items[0]);

        if (callback) callback(info);
      });
    },

    pauseToggle() {
      if (this.playerState !== "pause") {
        this.player.pauseVideo();
        this.setState('pause');
      }
      else {
        this.player.playVideo();
        this.setState('play');
      }
    },

    play(id) {
      if (!$('#' + this.config.element).is(':visible')) return;
      if (!this.player || !this.player.loadVideoById) return;

      this.player.loadVideoById(id);
      this.setState('play');
      Session.set('currentlyPlaying', id);
      Meteor.call('radio.go-live', Session.get('currentRadioId'));
    },

    search(q, callback) {
      var _this = this;

      if (!window.gapi || !window.gapi.client.youtube) {
        Materialize.toast("Google api is not accessible", 5000);
        return;
      }

      var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet',
        type: 'video',
        maxResults: 10,
        videoCategoryId: _this.musicCategoryId
      });

      request.execute((response) => {
        if (callback) callback(response.result);
      });
    },

    stop() {
      if (this.player && this.player.stopVideo) this.player.stopVideo();
      this.setState('stop');
    },


    // -------------------------
    // Private Functions
    // -------------------------

    //Add leading 0 if number < 10
    formatTime(time) {
      time = parseInt(time, 10);
      if (time < 10) return '0' + time;
      return time;
    },

    getMusicCategoryId() {
      var p = $.Deferred();

      var request = gapi.client.youtube.videoCategories.list({
        regionCode: 'us',
        part: 'snippet'
      });

      request.execute((response) => {
        if (response.error) return console.log(response.message);

        var categories = response.result.items;

        for (var i = 0; i < categories.length; i++) {
          if (categories[i].snippet.title.toLowerCase().indexOf('music') > -1) {
            this.musicCategoryId = categories[i].id;
            p.resolve();
            break;
          }
        }
      });

      return p.promise();
    },

    getSongDetails(data) {
      let info = _.extend(data.snippet, data.contentDetails);
      let duration = null;

      if (info.duration) {
        duration = moment.duration(info.duration);
        info.duration = Math.floor(duration.asMinutes()) + ':' + this.formatTime(duration.seconds());
      }

      return info;
    },

    initAPI() {
      let _this = this,
        p = $.Deferred(),
        load = null;

      load = function load() {
        if (gapi && gapi.client) {
          gapi.client.setApiKey(_this.config.apiKey);
          gapi.client.load('youtube', 'v3', function () {
            p.resolve();
          });
        }
        else setTimeout(load, 100);
      };

      load();

      return p.promise();
    },

    initIframeAPI() {
      let p = $.Deferred(),
        load = null;

      load = function load() {
        if (YT && YT.Player) {
          p.resolve();
        }
        else setTimeout(load, 100);
      };

      load();

      return p.promise();
    },

    loadAPI() {
      let p = $.Deferred();

      $.getScript(API_URL, function () {
        p.resolve();
      });

      return p.promise();
    },

    loadIframeAPI() {
      let p = $.Deferred();

      $.getScript(IFRAME_API_URL, function () {
        p.resolve();
      });

      return p.promise();
    },

    loadPlayer() {
      let _this = this;

      _this.player = new YT.Player(_this.config.element, {
        height: '100%',
        width: '100%',
        events: {
          //'onReady': _this.playVideo,
          'onStateChange': _this.onPlayerStateChange.bind(_this),
          'onError': _this.onPlayerError.bind(_this)
        }
      });
    },

    onPlayerError(e) {
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

      if (this.config.onSongError) this.config.onSongError();
      this.stop();
    },

    onPlayerStateChange(e) {
      if (e.data === YT.PlayerState.ENDED) {
        if (this.config.onSongEnded) this.config.onSongEnded();
      }
    },

    setState(state) {
      this.playerState = state;
      if (this.config.onStateChange) this.config.onStateChange(state);
    }
  };

  return {
    init: Youtube.init.bind(Youtube),
    getSongIdFromUrl: Youtube.getSongIdFromUrl.bind(Youtube),
    getSongInfo: Youtube.getSongInfo.bind(Youtube),
    pauseToggle: Youtube.pauseToggle.bind(Youtube),
    play: Youtube.play.bind(Youtube),
    search: Youtube.search.bind(Youtube),
    stop: Youtube.stop.bind(Youtube)
  };
})();