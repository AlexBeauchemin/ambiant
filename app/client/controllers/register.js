RegisterController = RouteController.extend({
  title: 'Ambiant | register',
  onBeforeAction: function () {
    let user = Meteor.user();
    let isGuest = false;

    if (user && user.profile) isGuest = user.profile.guest;
    if (user && !isGuest) Router.go('home');

    this.next();
  }
});