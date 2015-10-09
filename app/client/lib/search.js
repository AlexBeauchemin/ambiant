App.search = (function () {
    var Search = {
        focusSong: -1,
        searchTimeout: null,
        selector: 'input[data-action="search"]',

        /**
         * Public functions
         */
        init() {
            Session.set('isSearching', false);
            this.resetValues();
        },

        addSong(song, radioId) {
            //Remove search results no matter what happens
            Session.set('search-result', null);
            this.focusSong = -1;

            if (!song || !radioId) return;

            let songId = App.youtube.getSongIdFromUrl(song);

            App.youtube.getSongInfo(songId, (songInfo) => {
                Meteor.call('addSongToPlaylist', {id: songId, type: 'user-added', data: songInfo}, radioId, (error, res) => {
                    if (error) return Materialize.toast(error.reason, 5000);

                    Materialize.toast(`Song "${songInfo.title}" added!`, 3000, 'success');
                    this.resetValues();
                    $(this.selector).focus();
                });
            });
        },

        getValue() {
            return Session.get('search-selected-song') || $(this.selector).val();
        },

        keyUp(e, radioId) {
            let q = e.target.value;
            let results = Session.get('search-result');

            Session.set('isSearching', false);
            if (this.searchTimeout) clearTimeout(this.searchTimeout);

            //Automatically handled by submit event
            if (e.keyCode === 13) {
                return false;
            }

            if (e.keyCode === 40) {
                this.handleKeyDown(e, results);
                return false;
            }

            if (e.keyCode === 38) {
                this.handleKeyUp(e, results);
                return false;
            }

            this.resetValues(true);
            this.startSearch(q, radioId);
        },

        /**
         * Private Functions
         */

        handleKeyDown(e, results) {
            if (!results) return;
            if (this.focusSong + 1 >= results.length) return;

            this.focusSong++;

            Session.set('search-selected-song', results[this.focusSong].id.videoId);
            e.target.value = results[this.focusSong].snippet.title;
        },

        handleKeyUp(e, results) {
            if (!results) return false;
            if (this.focusSong < 0) return false;

            this.focusSong--;

            Session.set('search-selected-song', results[this.focusSong].id.videoId);
            e.target.value = results[this.focusSong].snippet.title;
        },

        resetValues(keepField = false) {
            Session.set('search-result', null);
            Session.set('search-selected-song', null);
            this.focusSong = -1;

            if (!keepField) $(this.selector).val('');
        },

        startSearch(q, radioId) {
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

            this.searchTimeout = setTimeout(function () {
                App.youtube.search(q, function (res) {
                    Session.set('isSearching', false);
                    if (res && res.items && res.items.length) Session.set('search-result', res.items);
                });
            }, 1000);
        }
    };

    return {
        init: Search.init.bind(Search),
        addSong: Search.addSong.bind(Search),
        getValue: Search.getValue.bind(Search),
        keyUp: Search.keyUp.bind(Search)
    };
})();
