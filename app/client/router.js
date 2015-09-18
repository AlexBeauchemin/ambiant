Router.configure({
    layoutTemplate: 'Layout',
    loadingTemplate: 'Loading',
    data: function() {
        var radio = null;
        var user = Meteor.user();

        if (user && user._id) radio = Radios.findOne({users: user._id });

        return {
            radios: Radios.find(),
            myRadio: radio
        };
    },
    onRun: function () {
        Session.set('autoplay', false);

        this.next();
    },
    waitOn: function () {
        return [
            Meteor.subscribe('radios'),
            Meteor.subscribe('my-radio'),
            Meteor.subscribe('user-data')
        ];
    }
});

Router.route('/', {name: 'home'});
Router.route('/radio/:url', {name: 'radio'});

