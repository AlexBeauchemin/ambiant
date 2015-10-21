Router.configure({
    layoutTemplate: 'Layout',
    loadingTemplate: 'Loading',
    data() {
        console.log('data router');
        let radio = null;
        let user = Meteor.user();

        if (user && user._id) radio = Radios.findOne({users: user._id });

        return {
            myRadio: radio
        };
    },
    onBeforeAction() {
        //Safety case, onRun doesn't seems to run after a hot reload (after code change)
        $('body').removeAttr('data-route').attr('data-route', Router.current().route.getName());
        this.next();
    },
    waitOn() {
        return [
            Meteor.subscribe('my-radio'),
            Meteor.subscribe('user-data')
        ];
    }
});

Router.route('/', {name: 'home'});
Router.route('/radio/:url', {name: 'radio'});
Router.route('/contact', {name: 'contact'});
Router.route('/donate', {name: 'donate'});

