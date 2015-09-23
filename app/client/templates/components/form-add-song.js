var searchTimeout = null;
var focusSong = -1;
var $addSongField = null;

Template.FormAddSong.rendered = function () {
  $addSongField = $('input[name="add-song"]');
  Session.set('isSearching', false);
  resetValues();
};

Template.FormAddSong.events({
  'submit [data-action="add-song"]': function (e) {
    e.preventDefault();

    var song = Session.get('search-selected-song') || $addSongField.val();
    addSong(song, this.radio._id);
  },
  'keyup input[name="add-song"]': function (e) {
    e.preventDefault();

    var q = e.target.value;
    var results = Session.get('search-result');

    Session.set('isSearching', false);
    if (searchTimeout) clearTimeout(searchTimeout);

    //Automatically handled by submit event
    if (e.keyCode === 13) {
      return false;
    }

    if (e.keyCode === 40) {
      handleKeyDown(e, results);
      return false;
    }

    if (e.keyCode === 38) {
      handleKeyUp(e, results);
      return false;
    }

    resetValues(true);
    startSearch(q, this.radio._id);
  }
});

var addSong = function (song, radioId) {
  //Remove search results no matter what happens
  Session.set('search-result', null);
  focusSong = -1;

  if (!song || !radioId) return;

  var songId = App.youtube.getSongIdFromUrl(song);

  App.youtube.getSongInfo(songId, function (songInfo) {
    Meteor.call('addSongToPlaylist', {id: songId, type: 'user-added', data: songInfo}, radioId, function (error, res) {
      if (error) return Materialize.toast(error.reason, 5000);

      resetValues();
    });
  });
};

var handleKeyDown = function(e, results) {
  if (!results) return;
  if (focusSong + 1 >= results.length) return;

  focusSong++;

  Session.set('search-selected-song', results[focusSong].id.videoId);
  e.target.value = results[focusSong].snippet.title;
};

var handleKeyUp = function(e, results) {
  if (!results) return false;
  if (focusSong < 0) return false;

  focusSong--;

  Session.set('search-selected-song', results[focusSong].id.videoId);
  e.target.value = results[focusSong].snippet.title;
};

var startSearch = function(q, radioId) {
  if (q.length < 3
    || q.indexOf('http://') === 0
    || q.indexOf('https://') === 0
    || q.indexOf('www.') === 0
    || q.indexOf('youtube.') === 0
    || q.indexOf('youtu.be/') === 0) {
    Session.set('search-result', []);
    return;
  }

  if (!radioId) return;

  Session.set('isSearching', true);

  searchTimeout = setTimeout(function () {
    App.youtube.search(q, function (res) {
      Session.set('isSearching', false);
      if (res && res.items && res.items.length) Session.set('search-result', res.items);
    });
  }, 1000);
};

var resetValues = function(keepField) {
  Session.set('search-result', null);
  Session.set('search-selected-song', null);
  focusSong = -1;

  if (!keepField) $addSongField.val('');
};
