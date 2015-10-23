HomeController = RouteController.extend({
    data() {
        let radio = null;
        let user = Meteor.user();

        if (user && user._id) radio = Radios.findOne({users: user._id });

        console.log(Radios.find().fetch());

        return {
            myRadio: radio,
            recentRadios: Radios.find({live: true},{limit: 10, sort: {dateCreated: -1}}),
            twitchRadios: Radios.find({live: true, twitchChannel: {$ne: null}},{limit: 10, sort: {nbUsers: -1}}),
            topRadios:  Radios.find({live: true}, {limit: 10, sort: {nbUsers: -1}})
        };
    },

    waitOn() {
        return [
            Meteor.subscribe('my-radio'),
            Meteor.subscribe('user-data'),
            Meteor.subscribe('top-radios', 10),
            Meteor.subscribe('twitch-radios', 10),
            Meteor.subscribe('new-radios', 10)
        ];
    }
});