Router.configure({
    layoutTemplate: 'Layout',
    loadingTemplate: 'Loading',
    data() {
        var radio = null;
        var user = Meteor.user();

        if (user && user._id) radio = Radios.findOne({users: user._id });

        return {
            radios: Radios.find(),
            myRadio: radio
        };
    },
    onRun() {
        $('body').removeAttr('data-route').attr('data-route', Router.current().route.getName());
        this.next();
    },
    onBeforeAction() {
        //Safety case, onRun doesn't seems to run after a hot reload (after code change)
        $('body').removeAttr('data-route').attr('data-route', Router.current().route.getName());
        this.next();
    },
    waitOn() {
        return [
            Meteor.subscribe('my-radio'),
            Meteor.subscribe('top-radios'),
            Meteor.subscribe('user-data'),
            Meteor.subscribe('user-presence', Session.get('currentRadioId'))
        ];
    }
});

Router.route('/', {name: 'home'});
Router.route('/radio/:url', {name: 'radio'});
Router.route('/contact', {name: 'contact'});
Router.route('/donate', {name: 'donate'});

