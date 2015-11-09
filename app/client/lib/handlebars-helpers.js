if (Meteor.isClient) {
  Template.registerHelper('debug', function (data) {
    console.log(data);
  });

  Template.registerHelper('isAdmin', function () {
    return Session.get('currentRadioOwner');
  });

  Template.registerHelper('isEqual', function (data1, data2) {
    return data1 === data2;
  });

  Template.registerHelper('notEqual', function (data1, data2) {
    return data1 !== data2;
  });

  Template.registerHelper('getSession', function (index) {
    return Session.get(index);
  });

  Template.registerHelper('conditionalClass', function (condition, trueClass, falseClass) {
    if (condition) return trueClass;
    return falseClass;
  });

  Template.registerHelper('routeIs', function (routeName) {
    return Router.current().route.getName() === routeName;
  });

  Template.registerHelper('isState', function (state) {
    return Session.get('player-state') === state;
  });

  Template.registerHelper('canAdd', function (state) {
    if (Session.get('player-state') === 'loading') return false;
    if (Session.get('isAddingSong') === true) return false;
    return true;
  });

  Template.registerHelper('isTwitchUser', function () {
    var user = Meteor.user();
    return !!(user && user.services && user.services.twitch);
  });

  Template.registerHelper('isGuest', function () {
    var user = Meteor.user();
    if (!user) return true;
    return !!(user.profile && user.profile.guest);
  });
}