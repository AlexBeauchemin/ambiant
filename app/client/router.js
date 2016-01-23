Router.configure({
  layoutTemplate: 'Layout',
  loadingTemplate: 'Loading',
  title: 'Ambiant - A collaborative web radio',
  data() {
    let radio = null;
    let user = Meteor.user();

    if (user && user._id) radio = Radios.findOne({users: user._id});

    return {
      myRadio: radio
    };
  },
  onBeforeAction() {
    $('body').attr('data-route', Router.current().route.getName());
    this.next();
  },
  waitOn() {
    return [
      Meteor.subscribe('my-radio'),
      Meteor.subscribe('user-data')
    ];
  }
});

Router.route('/', {name: 'home', path: '/'});
Router.route('/:url', {name: 'radio'});
Router.route('/radio/:url', { onBeforeAction: function() { this.redirect('/' + this.params.url); } });
Router.route('/page/login', {name: 'login'});
Router.route('/page/register', {name: 'register'});
Router.route('/page/contact', {name: 'contact'});
Router.route('/page/donate', {name: 'donate'});
Router.route('/reset-password/:token', {name: 'reset'});
