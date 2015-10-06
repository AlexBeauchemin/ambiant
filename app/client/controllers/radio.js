RadioController = RouteController.extend({
    data: function() {
        var radio = Radios.findOne({url: this.params.url });
        var myRadio = null;
        var isAdmin = false;
        var user = Meteor.user();
        var radioId = null;

        if (radio && radio._id) radioId = radio._id;

        if (user && user._id) myRadio = Radios.findOne({users: user._id });

        if (radioId && myRadio && radio._id === myRadio._id) {
            isAdmin = true;
        }
        else if (radioId) {
            Session.set('currentRadioId', radio._id);
        }

        if (radio && radio.playlistEnded) {
            if (radio.playlistEnded.length > 2) radio.playlistEnded = radio.playlistEnded.slice(Math.max(radio.playlistEnded.length - 2, 1));
            //if (radio.playlistEnded.length === 3) {
            //    radio.playlistEnded[0].position = "last";
            //}
        }

        if (radio && radio.playlist.length) {
            radio.playlist[0] = _.extend(radio.playlist[0], {state: "playing"});
            if (Session.get('autoplay')) {
                App.youtube.play(radio.playlist[0].id);
                Session.set('autoplay', false);
            }
        }

        return {
            isAdmin: isAdmin,
            radio: radio,
            users: Presences.find({state: { currentRadioId: radioId }}).fetch()
        };
    },

    onStop: function() {
        Session.set('currentRadioId', null);
    },

    waitOn: function () {
        return [
            Meteor.subscribe('radio', this.params.url),
            Meteor.subscribe('my-radio'),
            Meteor.subscribe('user-data'),
            Meteor.subscribe('user-presence', Session.get('currentRadioId'))
        ];
    }
});