App.soundcloud = (function () {
  const API_URL = "https://connect.soundcloud.com/sdk/sdk-3.0.0.js";
  const IFRAME_API_URL = "https://w.soundcloud.com/player/api.js";

  let Soundcloud = {
    config: {
      apiKey: '',
      element: 'soundcloud-player', //ID of the dom element,
      onProgress: null,
      onReady: null,
      onSongError: null,
      onSongEnded: null,
      onStateChange: null
    },

    // -------------------------
    // Variables
    // -------------------------
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
        .then(this.initAPI.bind(this));

      this.loadIframeAPI()
        .then(this.initIframeAPI)
        .then(() => {
          this.loadPlayer();
          this.stop();
          if (this.config.onReady) this.config.onReady();
        });
    },

    getSongInfo(id, callback) {
      let tracks = [];

      if (!window.SC || !window.SC.get) {
        Materialize.toast("Google api is not accessible", 5000);
        Session.set('isAddingSong', false);
        return callback(null);
      }

      SC.resolve(id).then((response) => {
        if (_.isEmpty(response)) {
          Materialize.toast("Cannot retrieve song information", 5000);
          Session.set('isAddingSong', false);
          return callback(null);
        }

        if (response.kind === 'playlist') {
          tracks = _.map(response.tracks, (track) => {
            return this.getSongDetails(track);
          });
        }
        else {
          tracks = [this.getSongDetails(response)];
        }

        if (callback) callback(tracks);
      });
    },

    pauseToggle() {
      if (this.playerState !== "pause") {
        this.player.pause();
        this.setState('pause');
      }
      else {
        this.player.play();
        this.setState('play');
      }
    },

    play(song) {
      if (!Session.get('currentRadioOwner')) return;
      if (!this.player || !song || !song.id) return;

      this.player.load(`http://api.soundcloud.com/tracks/${song.id}`, { auto_play: true });

      this.setState('play');
      Session.set('currentlyPlaying', song.id);
      Meteor.call('radio.go-live', Session.get('currentRadioId'));
      Meteor.call('radio.add-song-to-discover', song, Session.get('currentRadioId'));
    },

    search(q, callback) {
      let res;

      if (!window.SC || !window.SC.get) {
        Materialize.toast("Soundcloud api is not accessible", 5000);
        return;
      }

      SC.get('/tracks', {
        q: q
        //license: 'cc-by-sa'
      }).then((tracks) => {
        res = _.map(tracks, (track) => {
          return {
            id: track.permalink_url,
            title: _.get(track, 'user.username') + ' - ' + track.title
          };
        });
        if (callback) callback(res);
      });
    },

    stop() {
      if (this.player) this.player.pause();
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

    getSongDetails(track) {
      let duration = null;

      if (track.duration) {
        duration = moment.duration(track.duration);
        track.duration = Math.floor(duration.asMinutes()) + ':' + this.formatTime(duration.seconds());
      }

      return {
        id: track.id,
        duration: track.duration,
        license: track.license,
        link: track.permalink_url,
        title: _.get(track, 'user.username') + ' - ' + track.title,
        thumbnails: { default: { url: track.artwork_url }}
      };
    },

    initAPI() {
      let _this = this,
        p = $.Deferred(),
        load = null;

      load = () => {
        if (SC && SC.initialize) {
          SC.initialize({
            client_id: _this.config.apiKey
          });

          p.resolve();
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
        if (SC && SC.Widget) {
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
      const iframeElement = document.getElementById(this.config.element);
      this.player = SC.Widget(iframeElement);

      if (this.config.onSongEnded) this.player.bind(SC.Widget.Events.FINISH, this.config.onSongEnded);
      if (this.config.onProgress) this.player.bind(SC.Widget.Events.PLAY_PROGRESS, this.config.onProgress);
    },

    onPlayerError(e) {
      let message = 'Sorry, an error occured with the soundcloud player. The song will be skipped';
      Materialize.toast(`${message} (code ${e.data})`, 10000);

      if (this.config.onSongError) this.config.onSongError();
      this.stop();
    },

    setState(state) {
      this.playerState = state;
      if (this.config.onStateChange) this.config.onStateChange(state);
    }
  };

  return {
    init: Soundcloud.init.bind(Soundcloud),
    getSongInfo: Soundcloud.getSongInfo.bind(Soundcloud),
    pauseToggle: Soundcloud.pauseToggle.bind(Soundcloud),
    play: Soundcloud.play.bind(Soundcloud),
    search: Soundcloud.search.bind(Soundcloud),
    stop: Soundcloud.stop.bind(Soundcloud)
  };
})();