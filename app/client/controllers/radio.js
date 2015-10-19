RadioController = RouteController.extend({
    data() {
        let radio = Radios.findOne({url: this.params.url });
        let myRadio = null;
        let isAdmin = false;
        let user = Meteor.user();
        let radioId = null;
        let currentlyPlaying = Session.get('currentlyPlaying');

        if (radio && radio._id) radioId = radio._id;

        if (user && user._id) myRadio = Radios.findOne({users: user._id });

        if (radioId && myRadio && radio._id === myRadio._id) {
            isAdmin = true;
            Session.set('currentRadioId', 'owner-' + radio._id);
        }
        else if (radioId) {
            Session.set('currentRadioId', radio._id);
        }

        if (radio && radio.playlistEnded) {
            if (radio.playlistEnded.length > 2) radio.playlistEnded = radio.playlistEnded.slice(Math.max(radio.playlistEnded.length - 2, 1));
        }

        if (radio && radio.playlist.length) {
            radio.playlist[0] = _.extend(radio.playlist[0], {state: "playing"});

            if (Session.get('autoplay')) {
                App.youtube.play(radio.playlist[0].id);
                Session.set('autoplay', false);
            }
            else if (currentlyPlaying && currentlyPlaying !== radio.playlist[0].id) {
                App.youtube.play(radio.playlist[0].id);
            }
        }

        return {
            isAdmin: isAdmin,
            radio: radio,
            users: Presences.find({state: { currentRadioId: radioId }}).fetch()
        };
    },

    onBeforeAction() {
        Session.set('autoplay', false);
        this.next();
    },

    onStop() {
        let radio = Radios.findOne({url: this.params.url, users: Meteor.user()._id });

        if (radio) Meteor.call('goOffline', radio._id);

        Session.set('currentRadioId', null);
        Session.set('currentlyPlaying', null);
    },

    waitOn() {
        return [
            Meteor.subscribe('radio', this.params.url),
            Meteor.subscribe('my-radio'),
            Meteor.subscribe('user-data'),
            Meteor.subscribe('user-presence', Session.get('currentRadioId'))
        ];
    }
});