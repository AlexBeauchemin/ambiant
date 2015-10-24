const showEndedMaxDefault = 2;

RadioController = RouteController.extend({
    data() {
        let radio = Radios.findOne({url:  this.params.url.toLowerCase() });
        let myRadio = null;
        let user = Meteor.user();
        let radioId = null;
        let currentlyPlaying = Session.get('currentlyPlaying');
        let showEndedMax = Session.get('showEndedMax');
        let showMore = {
            isVisible: false,
            text: 'Show More'
        };

        if (showEndedMax > showEndedMaxDefault) showMore.text = "Show Less";
        if (radio && radio._id) radioId = radio._id;
        if (user && user._id) myRadio = Radios.findOne({users: user._id });
        if (radioId) Session.set('currentRadioId', radio._id);

        Session.set('currentRadioOwner', radioId && myRadio && radio._id === myRadio._id);

        if (radio && radio.playlistEnded) {
            if (radio.playlistEnded.length > showEndedMaxDefault) showMore.isVisible = true;
            if (radio.playlistEnded.length > showEndedMax) radio.playlistEnded = radio.playlistEnded.slice(Math.max(radio.playlistEnded.length - showEndedMax, 1));
        }

        if (radio && radio.playlist.length) {
            radio.playlist[0] = _.extend(radio.playlist[0], {state: "playing"});

            if (Session.get('autoplay')) {
                App.youtube.play(radio.playlist[0].id);
                Session.set('autoplay', false);
            }
            else if (radio.playlist && currentlyPlaying !== radio.playlist[0].id) {
                App.youtube.play(radio.playlist[0].id);
            }
        }

        return {
            myRadio,
            radio,
            showMore,
            users: Presences.find({state: { currentRadioId: radioId }}).fetch()
        };
    },

    onBeforeAction() {
        Session.set('autoplay', false);
        Session.set('showEndedMax', showEndedMaxDefault);
        this.next();
    },

    onAfterAction() {
        //TODO: Retrieve number of users from server
        Meteor.call('updateUsers', this.data().radio._id, this.data().users.length);
    },

    onStop() {
        let radio = Radios.findOne({url: this.params.url.toLowerCase(), users: Meteor.user()._id });

        if (radio) Meteor.call('goOffline', radio._id);

        Session.set('currentRadioId', null);
        Session.set('currentRadioOwner', false);
        Session.set('currentlyPlaying', null);
        Session.set('showEndedMax', showEndedMaxDefault);
    },

    waitOn() {
        return [
            Meteor.subscribe('radio',  this.params.url.toLowerCase()),
            Meteor.subscribe('my-radio'),
            Meteor.subscribe('user-data'),
            Meteor.subscribe('user-presence', Session.get('currentRadioId'))
        ];
    }
});